/* eslint-disable prettier/prettier */
import toStream = require('buffer-to-stream');
import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config(); // carga las variables del .env

// Configuración de Cloudinary
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

@Injectable()
export class FileUploadRepository {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            resolve(result!);
          }
        }
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
