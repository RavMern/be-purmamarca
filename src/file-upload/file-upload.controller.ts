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
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';

@ApiTags('files')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiBearerAuth()
  @Post('uploadimages/:id')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Subir imágenes de producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Archivos de imagen a subir (max 10)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imágenes subidas exitosamente' })
  @ApiResponse({ status: 400, description: 'Archivos inválidos o no enviados' })
  async uploadFiles(
    @Param('id') productId: string,
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
    files: Express.Multer.File[]
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    return await this.fileUploadService.uploadFiles(files, productId);
  }
}
