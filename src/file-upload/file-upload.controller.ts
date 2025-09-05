/* eslint-disable prettier/prettier */
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post,Param, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards, UploadedFiles, BadRequestException } from '@nestjs/common';

@Controller('files')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}

    @ApiBearerAuth()
    @Post('uploadimages/:id')
    @UseInterceptors(FilesInterceptor('files', 10)) // 'files' es el nombre del campo y '10' es el máximo número de archivos
    async uploadFiles(
        @Param('id') productId: string,
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 20000000, message: 'File is too large' }), // Máximo tamaño permitido
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }), // Tipos de archivo permitidos
                ],
            }),
        ) files: Express.Multer.File[], // Cambiado a un array de archivos
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('Files are required');
        }

        return await this.fileUploadService.uploadFiles(files, productId);
    }
}
