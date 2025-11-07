import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Bucket } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadResponse {
  url: string;
  secure_url?: string; // Mantenemos compatibilidad con el código existente
}

@Injectable()
export class FileUploadRepository implements OnModuleInit {
  private readonly logger = new Logger(FileUploadRepository.name);
  private bucket: Bucket;

  onModuleInit() {
    this.logger.log('Initializing FileUploadRepository...');
    this.initializeFirebase();
  }

  /**
   * Lee el valor de FIREBASE_CREDENTIALS desde process.env
   * Ahora siempre está en una sola línea (JSON string o ruta de archivo)
   */
  private readFirebaseCredentialsFromEnv(): string | null {
    if (process.env.FIREBASE_CREDENTIALS) {
      const value = process.env.FIREBASE_CREDENTIALS.trim();

      // Si es JSON (empieza con {), retornarlo directamente
      if (value.startsWith('{')) {
        this.logger.log(`FIREBASE_CREDENTIALS found as JSON string, length: ${value.length}`);
        return value;
      }

      // Si no es JSON, es una ruta de archivo, retornar null para manejarlo después
      this.logger.log('FIREBASE_CREDENTIALS is not JSON, treating as file path');
      return null;
    }

    return null;
  }

  private initializeFirebase() {
    try {
      this.logger.log('Starting Firebase initialization...');
      const storageUrl = process.env.STORAGE_URL;
      this.logger.log(`STORAGE_URL: ${storageUrl || 'not set, will use default from service account'}`);

      let serviceAccount: ServiceAccount;

      // 1. Intentar leer desde variable de entorno (JSON string o ruta de archivo)
      this.logger.log('Attempting to read FIREBASE_CREDENTIALS from environment...');
      const credentialsFromEnv = this.readFirebaseCredentialsFromEnv();

      if (credentialsFromEnv) {
        // Es un JSON string (siempre en una sola línea)
        this.logger.log(`Found credentials as JSON string, length: ${credentialsFromEnv.length} characters`);
        try {
          serviceAccount = JSON.parse(credentialsFromEnv) as ServiceAccount;
          this.logger.log('✓ Successfully parsed Firebase credentials from FIREBASE_CREDENTIALS env variable');
          this.logger.log(`Project ID: ${serviceAccount.projectId}`);
        } catch (parseError) {
          this.logger.error(`Failed to parse JSON from FIREBASE_CREDENTIALS: ${parseError}`);
          this.logger.error(`First 100 chars: ${credentialsFromEnv.substring(0, 100)}...`);
          throw new Error(`Invalid JSON in FIREBASE_CREDENTIALS: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        }
      } else if (process.env.FIREBASE_CREDENTIALS) {
        // No es JSON, tratar como ruta de archivo
        const serviceAccountPath = process.env.FIREBASE_CREDENTIALS.trim();
        this.logger.log(`FIREBASE_CREDENTIALS is not JSON, treating as file path: ${serviceAccountPath}`);

        if (!fs.existsSync(serviceAccountPath) || fs.lstatSync(serviceAccountPath).isDirectory()) {
          throw new Error(`Firebase credentials file not found at: ${serviceAccountPath}`);
        }

        this.logger.log(`Loading Firebase credentials from file: ${serviceAccountPath}`);
        serviceAccount = JSON.parse(
          fs.readFileSync(serviceAccountPath, 'utf-8')
        ) as ServiceAccount;
        this.logger.log(`Project ID: ${serviceAccount.projectId}`);
      } else {
        // 2. Intentar leer desde archivos en ubicaciones comunes
        const path1 = path.resolve(process.cwd(), 'src/config/firebase-service-account.json');
        const path2 = path.resolve(process.cwd(), 'firebase-service-account.json');

        this.logger.log(`Checking Firebase credentials in common file locations...`);
        this.logger.log(`  - ${path1}`);
        this.logger.log(`  - ${path2}`);

        let serviceAccountPath: string | null = null;
        if (fs.existsSync(path1) && !fs.lstatSync(path1).isDirectory()) {
          serviceAccountPath = path1;
          this.logger.log(`✓ Found at: ${path1}`);
        } else if (fs.existsSync(path2) && !fs.lstatSync(path2).isDirectory()) {
          serviceAccountPath = path2;
          this.logger.log(`✓ Found at: ${path2}`);
        }

        if (!serviceAccountPath) {
          const errorMsg = `Firebase service account not found. Please either:
1. Set FIREBASE_CREDENTIALS in .env as a JSON string, or
2. Set FIREBASE_CREDENTIALS in .env as a file path, or
3. Place firebase-service-account.json in:
   - ${path1}
   - ${path2}`;
          this.logger.error(errorMsg);
          throw new Error(errorMsg);
        }

        this.logger.log(`Loading Firebase credentials from file: ${serviceAccountPath}`);
        serviceAccount = JSON.parse(
          fs.readFileSync(serviceAccountPath, 'utf-8')
        ) as ServiceAccount;
      }

      // Verificar si Firebase ya está inicializado
      if (admin.apps.length === 0) {
        const bucketName = storageUrl || `${serviceAccount.projectId}.appspot.com`;
        this.logger.log(`Initializing Firebase with bucket: ${bucketName}`);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: bucketName,
        });
        this.logger.log('Firebase Admin initialized');
      } else {
        this.logger.log('Firebase Admin already initialized');
      }

      this.bucket = admin.storage().bucket();
      if (!this.bucket) {
        const errorMsg = 'Failed to get Firebase Storage bucket';
        this.logger.error(errorMsg);
        throw new Error(errorMsg);
      }

      this.logger.log(`✅ Firebase Storage initialized successfully. Bucket: ${this.bucket.name}`);
      this.logger.log(`Bucket exists: ${!!this.bucket}`);
    } catch (error) {
      this.logger.error('❌ Error initializing Firebase Storage:', error);
      this.logger.error('Error details:', error instanceof Error ? error.stack : String(error));
      // No lanzamos el error aquí para que la app pueda iniciar
      // pero el bucket quedará undefined y fallará cuando se intente usar
      this.logger.warn('⚠️ File uploads will not work until Firebase is properly configured');
      this.bucket = undefined as any; // Asegurar que bucket es undefined
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadResponse> {
    if (!this.bucket) {
      const errorMsg = `Firebase Storage not initialized. Please check:
1. That FIREBASE_CREDENTIALS is set in .env file
2. That the file exists at the specified path
3. That the file contains valid Firebase service account credentials
4. Check the logs above for more details`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Generar un nombre único para el archivo
      const timestamp = Date.now();
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const destination = `products/${timestamp}-${sanitizedName}`;

      const fileRef = this.bucket.file(destination);

      // Subir el buffer del archivo
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype || 'image/jpeg',
          cacheControl: 'public,max-age=31536000',
        },
      });

      // Hacer el archivo público
      await fileRef.makePublic();

      // Obtener la URL pública
      const publicUrl = fileRef.publicUrl();

      this.logger.log(`File uploaded successfully: ${destination}`);

      return {
        url: publicUrl,
        secure_url: publicUrl, // Mantenemos compatibilidad
      };
    } catch (error) {
      this.logger.error('Error uploading file to Firebase Storage:', error);
      throw new Error(
        `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
