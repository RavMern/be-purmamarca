/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';

@ApiTags('file-upload')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiBearerAuth()
  @Post('uploadimages/:id')
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files' es el nombre del campo y '10' es el máximo número de archivos
  @ApiOperation({ summary: 'Subir múltiples imágenes para un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Imágenes subidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Files uploaded successfully' },
        urls: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'https://firebasestorage.googleapis.com/...',
            'https://firebasestorage.googleapis.com/...',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Archivos inválidos o error en la subida',
  })
  async uploadFiles(
    @Param('id') productId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 20000000,
            message: 'File is too large',
          }), // Máximo tamaño permitido
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }), // Tipos de archivo permitidos
        ],
      })
    )
    files: Express.Multer.File[] // Cambiado a un array de archivos
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    return await this.fileUploadService.uploadFiles(files, productId);
  }

@Post('upload-images-no-id/temp')
@UseInterceptors(FilesInterceptor('files', 10))
@ApiOperation({ summary: 'Subir imágenes temporales (sin asociar a producto)' })
@ApiConsumes('multipart/form-data')
async uploadTempFiles(
  @UploadedFiles(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 20000000,
          message: 'File is too large',
        }),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
      ],
    })
  )
  files: Express.Multer.File[],
) {
  if (!files || files.length === 0) {
    throw new BadRequestException('Files are required');
  }

  const uploadedFiles = await this.fileUploadService.uploadTempFiles(files);
  return {
    message: 'Files uploaded successfully',
    urls: uploadedFiles,
  };
}

}
