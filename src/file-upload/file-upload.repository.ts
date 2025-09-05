/* eslint-disable prettier/prettier */
import toStream = require('buffer-to-stream');
import { Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 } from 'cloudinary';


@Injectable()
export class FileUploadRepository {
    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                {resource_type: "auto"},
                (error, result) => {
                    if(error){ return reject(error);

                    }else{
                    resolve(result);
                    }
                },
            );
            toStream(file.buffer).pipe(upload);
        });
    }
}