import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private bucket: Bucket;

  onModuleInit() {
    const serviceAccountPath = process.env.FIREBASE_CREDENTIALS;

    if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
      throw new Error(
        `Firebase service account file not found at ${serviceAccountPath}`
      );
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, 'utf-8')
    ) as admin.ServiceAccount;

    const firebaseConfig: admin.AppOptions = {
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.projectId}.appspot.com`,
    };

    admin.initializeApp(firebaseConfig);

    this.bucket = admin.storage().bucket();
  }

  async uploadFile(filePath: string, destination: string): Promise<string> {
    await this.bucket.upload(filePath, {
      destination,
      metadata: {
        cacheControl: 'public,max-age=31536000',
      },
    });

    const file = this.bucket.file(destination);
    await file.makePublic();

    return file.publicUrl();
  }
}
