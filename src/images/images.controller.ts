import {
  BadRequestException,
  Controller,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { FileUploadResponseDto } from './validators/file-upload.dto';
import { fileUploadOptions } from './validators/file-upload.validator';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('multiple-upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ceremonia_url_location', maxCount: 1 },
        { name: 'recepcion_url_location', maxCount: 1 },
        { name: 'image_url', maxCount: 1 },
        { name: 'logo_file_0', maxCount: 1 },
        { name: 'logo_file_1', maxCount: 1 },
        { name: 'logo_file_2', maxCount: 1 },
      ],
      fileUploadOptions()
    )
  )
  @ApiOperation({ summary: 'Subir múltiples imágenes de un evento' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ceremonia_url_location: { type: 'string', format: 'binary' },
        recepcion_url_location: { type: 'string', format: 'binary' },
        image_url: { type: 'string', format: 'binary' },
        logo_file_0: { type: 'string', format: 'binary' },
        logo_file_1: { type: 'string', format: 'binary' },
        logo_file_2: { type: 'string', format: 'binary' },
      },
      required: ['ceremonia_url_location', 'image_url'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imágenes subidas exitosamente',
    type: FileUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Archivos inválidos o faltantes' })
  async multipleUpload(
    @UploadedFiles()
    files: {
      ceremonia_url_location?: Express.Multer.File[];
      recepcion_url_location?: Express.Multer.File[];
      image_url?: Express.Multer.File[];
      logo_file_0?: Express.Multer.File[];
      logo_file_1?: Express.Multer.File[];
      logo_file_2?: Express.Multer.File[];
    }
  ): Promise<FileUploadResponseDto> {
    const ceremonia = files.ceremonia_url_location?.[0];
    const image = files.image_url?.[0];
    const recepcion = files.recepcion_url_location?.[0];
    const logos = ['logo_file_0', 'logo_file_1', 'logo_file_2']
      .map(name => files[name]?.[0])
      .filter((file): file is Express.Multer.File => Boolean(file));

    if (!ceremonia || !image) {
      throw new BadRequestException(
        'ceremonia_url_location and image_url are required'
      );
    }

    const response: FileUploadResponseDto = {
      ceremonia_url_location: await this.imagesService.processLocationImage(
        ceremonia,
        'ceremonia'
      ),
      image_url: await this.imagesService.processMainImage(image),
      logo_files: [],
    };

    if (recepcion) {
      response.recepcion_url_location =
        await this.imagesService.processLocationImage(recepcion, 'recepcion');
    }

    if (logos.length) {
      response.logo_files = await this.imagesService.processLogoFiles(logos);
    }

    return response;
  }

  @Put('update-multiple-upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ceremonia_url_location', maxCount: 1 },
        { name: 'recepcion_url_location', maxCount: 1 },
        { name: 'image_url', maxCount: 1 },
        { name: 'logo_file_0', maxCount: 1 },
        { name: 'logo_file_1', maxCount: 1 },
        { name: 'logo_file_2', maxCount: 1 },
      ],
      fileUploadOptions()
    )
  )
  @ApiOperation({ summary: 'Actualizar múltiples imágenes de un evento' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ceremonia_url_location: { type: 'string', format: 'binary' },
        recepcion_url_location: { type: 'string', format: 'binary' },
        image_url: { type: 'string', format: 'binary' },
        logo_file_0: { type: 'string', format: 'binary' },
        logo_file_1: { type: 'string', format: 'binary' },
        logo_file_2: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Imágenes actualizadas exitosamente',
    type: FileUploadResponseDto,
  })
  async updateMultipleUpload(
    @UploadedFiles()
    files: {
      ceremonia_url_location?: Express.Multer.File[];
      recepcion_url_location?: Express.Multer.File[];
      image_url?: Express.Multer.File[];
      logo_file_0?: Express.Multer.File[];
      logo_file_1?: Express.Multer.File[];
      logo_file_2?: Express.Multer.File[];
    }
  ): Promise<FileUploadResponseDto> {
    const ceremonia = files.ceremonia_url_location?.[0];
    const image = files.image_url?.[0];
    const recepcion = files.recepcion_url_location?.[0];
    const logos = ['logo_file_0', 'logo_file_1', 'logo_file_2']
      .map(name => files[name]?.[0])
      .filter((file): file is Express.Multer.File => Boolean(file));

    const response: FileUploadResponseDto = {
      ceremonia_url_location: ceremonia
        ? await this.imagesService.processLocationImage(ceremonia, 'ceremonia')
        : '',
      image_url: image ? await this.imagesService.processMainImage(image) : '',
      logo_files: [],
    };

    if (recepcion) {
      response.recepcion_url_location =
        await this.imagesService.processLocationImage(recepcion, 'recepcion');
    }

    if (logos.length) {
      response.logo_files = await this.imagesService.processLogoFiles(logos);
    }

    return response;
  }
}
