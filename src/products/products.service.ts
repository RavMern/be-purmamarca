/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvailableNowService } from 'src/available/available-now.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Products } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { createProductDto, updateProductDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private readonly availableNowService: AvailableNowService,
    private readonly categoriesService: CategoriesService
  ) {}

  getProducts() {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async createProducts(data: createProductDto): Promise<Products> {
    if (!data.categoryId)
      throw new BadRequestException('La categoría es requerida');

    try {
      await this.categoriesService.findOne(data.categoryId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Categoría con ID ${data.categoryId} no encontrada`
        );
      }
      throw error;
    }

    const createProductDB = this.productsRepository.create(data);
    return await this.productsRepository.save(createProductDB);
  }

  async getProductsById(id: string): Promise<Products> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product)
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }

  async updateProductsById(id: string, data: updateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`No se encontró el producto con id: ${id}`);

    if (data.categoryId) {
      try {
        await this.categoriesService.findOne(data.categoryId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(
            `Categoría con ID ${data.categoryId} no encontrada`
          );
        }
        throw error;
      }
    }

    if (data.stock !== undefined && product.stock === 0 && data.stock > 0) {
      await this.availableNowService.notifyUsersWhenStockRestored(id);
    }

    await this.productsRepository.update(id, data);
    return await this.getProductsById(id);
  }

  async patchProductsById(id: string, partialData: Partial<Products>) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);

    Object.assign(product, partialData);
    await this.productsRepository.save(product);
    return product;
  }

  async deleteProductsById(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`No se encontró el producto con id: ${id}`);

    return await this.productsRepository.delete(id);
  }

  async getLatestProducts(): Promise<Products[]> {
    return await this.productsRepository.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }
}
