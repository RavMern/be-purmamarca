import { Bucket } from '@google-cloud/storage';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagesService implements OnModuleInit {
  private bucket: Bucket;

  onModuleInit() {
    const storageUrl = process.env.STORAGE_URL;
    let serviceAccount: ServiceAccount;

    try {
      // 1. Intentar leer desde variable de entorno (JSON string o ruta de archivo)
      if (process.env.FIREBASE_CREDENTIALS) {
        const credentialsValue = process.env.FIREBASE_CREDENTIALS.trim();

        // Si es JSON (empieza con {), parsearlo directamente
        if (credentialsValue.startsWith('{')) {
          try {
            serviceAccount = JSON.parse(credentialsValue) as ServiceAccount;
          } catch (parseError) {
            // Si falla el parse, saltear inicialización
            return;
          }
        } else {
          // Si no es JSON, tratar como ruta de archivo
          const serviceAccountPath = credentialsValue;

          if (
            !fs.existsSync(serviceAccountPath) ||
            fs.lstatSync(serviceAccountPath).isDirectory()
          ) {
            return; // salteamos la inicialización
          }

          serviceAccount = JSON.parse(
            fs.readFileSync(serviceAccountPath, 'utf-8')
          ) as ServiceAccount;
        }
      } else {
        // 2. Intentar leer desde archivo en ubicación común
        const serviceAccountPath = path.resolve(
          process.cwd(),
          'firebase-service-account.json'
        );

        if (
          !fs.existsSync(serviceAccountPath) ||
          fs.lstatSync(serviceAccountPath).isDirectory()
        ) {
          return; // salteamos la inicialización
        }

        serviceAccount = JSON.parse(
          fs.readFileSync(serviceAccountPath, 'utf-8')
        ) as ServiceAccount;
      }
    } catch (error) {
      // Si hay error, salteamos la inicialización silenciosamente
      return;
    }

    // Verificar si Firebase ya está inicializado
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: storageUrl || `${serviceAccount.projectId}.appspot.com`,
      });
    }

    this.bucket = admin.storage().bucket();
  }

  async uploadFileBuffer(
    buffer: Buffer,
    destination: string,
    contentType: string
  ): Promise<string> {
    const file = this.bucket.file(destination);

    await file.save(buffer, {
      metadata: {
        contentType,
        cacheControl: 'public,max-age=31536000',
      },
    });

    await file.makePublic();
    return file.publicUrl();
  }

  async processMainImage(file: Express.Multer.File): Promise<string> {
    const destination = `main-images/${Date.now()}-${file.originalname}`;
    return this.uploadFileBuffer(file.buffer, destination, file.mimetype);
  }

  async processLocationImage(
    file: Express.Multer.File,
    type: 'ceremonia' | 'recepcion'
  ): Promise<string> {
    const destination = `locations/${type}/${Date.now()}-${file.originalname}`;
    return this.uploadFileBuffer(file.buffer, destination, file.mimetype);
  }

  async processLogoFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(
      files.map(file => {
        const destination = `logos/${Date.now()}-${file.originalname}`;
        return this.uploadFileBuffer(file.buffer, destination, file.mimetype);
      })
    );
  }

  async processCategoryImage(file: Express.Multer.File): Promise<string> {
    const destination = `categories/${Date.now()}-${file.originalname}`;
    return this.uploadFileBuffer(file.buffer, destination, file.mimetype);
  }
}
