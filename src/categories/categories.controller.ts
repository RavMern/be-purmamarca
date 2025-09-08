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
import { Categories } from '../entities/categories.entity';
import { ImagesService } from '../images/images.service';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';

@Controller('categories')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly imagesService: ImagesService
  ) {}

  // CREATE - Crear nueva categoría
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Categories> {
    return await this.categoriesService.create(createCategoryDto);
  }

  // READ - Obtener todas las categorías
  @Get()
  async findAll(): Promise<Categories[]> {
    return await this.categoriesService.findAll();
  }

  // READ - Obtener categoría por ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Categories> {
    return await this.categoriesService.findOne(id);
  }

  // READ - Obtener categoría por nombre
  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Categories> {
    return await this.categoriesService.findByName(name);
  }

  // UPDATE - Actualizar categoría
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Categories> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  // DELETE - Eliminar categoría
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.categoriesService.remove(id);
  }

  // UPLOAD - Subir imagen de categoría
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async uploadCategoryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ message: string; imageUrl: string }> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ninguna imagen');
    }

    // Validar tipo de archivo
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

    // Validar tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'El archivo es demasiado grande. Máximo 5MB permitido'
      );
    }

    try {
      // Verificar que la categoría existe
      await this.categoriesService.findOne(id);

      // Subir imagen a Firebase Storage
      const imageUrl = await this.imagesService.processCategoryImage(file);

      // Actualizar la categoría con la URL de la imagen
      await this.categoriesService.updateCategoryImage(id, imageUrl);

      return {
        message: 'Imagen de categoría subida exitosamente',
        imageUrl,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al subir la imagen: ${error.message}`
      );
    }
  }
}
