/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../entities/categories.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>
  ) {}

  // CREATE - Crear nueva categoría
  async create(createCategoryDto: CreateCategoryDto): Promise<Categories> {
    try {
      const category = this.categoriesRepository.create(createCategoryDto);
      return await this.categoriesRepository.save(category);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique constraint violation
        throw new ConflictException('Ya existe una categoría con este nombre');
      }
      throw error;
    }
  }

  // READ - Obtener todas las categorías
  async findAll(): Promise<Categories[]> {
    return await this.categoriesRepository.find({
      relations: ['products'],
    });
  }

  // READ - Obtener categoría por ID
  async findOne(id: string): Promise<Categories> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  // READ - Obtener categoría por nombre
  async findByName(name: string): Promise<Categories> {
    const category = await this.categoriesRepository.findOne({
      where: { name },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(
        `Categoría con nombre "${name}" no encontrada`
      );
    }

    return category;
  }

  // UPDATE - Actualizar categoría
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Categories> {
    const category = await this.findOne(id);

    try {
      await this.categoriesRepository.update(id, updateCategoryDto);
      return await this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique constraint violation
        throw new ConflictException('Ya existe una categoría con este nombre');
      }
      throw error;
    }
  }

  // DELETE - Eliminar categoría
  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    // Verificar si la categoría tiene productos asociados
    if (category.products && category.products.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la categoría porque tiene productos asociados'
      );
    }

    await this.categoriesRepository.delete(id);
  }

  // Método adicional para verificar si una categoría existe
  async exists(id: string): Promise<boolean> {
    const count = await this.categoriesRepository.count({ where: { id } });
    return count > 0;
  }

  // UPDATE - Actualizar imagen de categoría
  async updateCategoryImage(id: string, imageUrl: string): Promise<Categories> {
    await this.findOne(id); // Verificar que la categoría existe

    await this.categoriesRepository.update(id, { categoryImage: imageUrl });
    return await this.findOne(id);
  }
}
