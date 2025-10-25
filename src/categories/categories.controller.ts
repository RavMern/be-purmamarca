/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Categories } from '../entities/categories.entity';
import { ImagesService } from '../images/images.service';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';

@ApiTags('categories')
@Controller('categories')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly imagesService: ImagesService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nueva categoría' })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada exitosamente',
    type: Categories,
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Categories> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({
    status: 200,
    description: 'Listado de categorías',
    type: [Categories],
  })
  async findAll(): Promise<Categories[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', type: String })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
    type: Categories,
  })
  async findOne(@Param('id') id: string): Promise<Categories> {
    return await this.categoriesService.findOne(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Obtener categoría por nombre' })
  @ApiParam({
    name: 'name',
    description: 'Nombre de la categoría',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
    type: Categories,
  })
  async findByName(@Param('name') name: string): Promise<Categories> {
    return await this.categoriesService.findByName(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada',
    type: Categories,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Categories> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiResponse({ status: 204, description: 'Categoría eliminada' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.categoriesService.remove(id);
  }

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subir imagen de categoría' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID de la categoría', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen subida exitosamente',
    schema: {
      example: {
        message: 'Imagen de categoría subida exitosamente',
        imageUrl: 'https://...',
      },
    },
  })
  async uploadCategoryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ message: string; imageUrl: string }> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ninguna imagen');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        'El archivo es demasiado grande. Máximo 5MB permitido'
      );
    }

    await this.categoriesService.findOne(id);
    const imageUrl = await this.imagesService.processCategoryImage(file);
    await this.categoriesService.updateCategoryImage(id, imageUrl);

    return { message: 'Imagen de categoría subida exitosamente', imageUrl };
  }
}
