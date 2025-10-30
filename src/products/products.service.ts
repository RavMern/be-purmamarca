/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvailableNowService } from 'src/available/available-now.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Products } from 'src/entities/product.entity';
import { Promotion } from 'src/entities/promotion.entity';
import { Repository } from 'typeorm';
import { createProductDto, updateProductDto } from './dto/products.dto';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products) private productsRepository: Repository<Products>,
         @InjectRepository(Promotion) private promotionsRepository: Repository<Promotion>,
        private readonly availableNowService: AvailableNowService,
        private readonly categoriesService: CategoriesService,
    ){}
    async getProducts() {
    const products = await this.productsRepository.find({
      relations: ['category'],
    });

    const today = new Date();
    const activePromos = await this.promotionsRepository
      .createQueryBuilder('promo')
      .where(':today BETWEEN promo.start_date AND promo.expiration_date', { today })
      .getMany();
    const data = products.map((product) => {
  const promo = activePromos.find((p) => {
    if (!p.category_ids) return false;
    const categories = Array.isArray(p.category_ids)
      ? p.category_ids
      : String(p.category_ids).replace(/[{}]/g, '').split(',');
    return categories.includes(product.category.id);
  });

  return {
    ...product,
    promotion: promo
      ? {
          name: promo.name,
          promo_percentage: promo.promo_percentage,
          start_date: promo.start_date,
          expiration_date: promo.expiration_date,
        }
      : null,
  };
});
    return data
  }

    async createProducts(data: createProductDto): Promise<Products> {
        // Validar que la categoría existe
        if (!data.categoryId) {
            throw new BadRequestException('La categoría es requerida');
        }

        try {
            // Verificar que la categoría existe
            await this.categoriesService.findOne(data.categoryId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Categoría con ID ${data.categoryId} no encontrada`);
            }
            throw error;
        }

        const createProductDB = await this.productsRepository.create(data);
        return await this.productsRepository.save(createProductDB);
    }
    async getProductsById(id: string): Promise<Products> {
        const foundedProduct = await this.productsRepository.findOne({
            where: { id },
            relations: ['category']
        });

        if (!foundedProduct) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        const today = new Date()
        const activePromos = await this.promotionsRepository
      .createQueryBuilder('promo')
      .where(':today BETWEEN promo.start_date AND promo.expiration_date', { today })
      .getMany();

      function asignData(foundedProduct){
        const promo = activePromos.find((p) => {
            if (!p.category_ids) return false;
            const categories = Array.isArray(p.category_ids)
                ? p.category_ids
                : String(p.category_ids).replace(/[{}]/g, '').split(',');
            return categories.includes(foundedProduct.category.id);
        });

        return {
            ...foundedProduct,
            promotion: promo
            ? {
                name: promo.name,
                promo_percentage: promo.promo_percentage,
                start_date: promo.start_date,
                expiration_date: promo.expiration_date,
                }
            : null,
        }}
      const data =asignData(foundedProduct)
    return data
    }
    async updateProductsById(id: string, data: updateProductDto) {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException(`No se encontró el producto con id: ${id}`);

        // Si se está actualizando la categoría, validar que existe
        if (data.categoryId) {
            try {
                await this.categoriesService.findOne(data.categoryId);
            } catch (error) {
                if (error instanceof NotFoundException) {
                    throw new NotFoundException(`Categoría con ID ${data.categoryId} no encontrada`);
                }
                throw error;
            }
        }

        console.log("data.stock", data.stock);

        if (data.stock) {
            const checkStock = await this.productsRepository.findOne({ where: { id } });
            console.log("checkStock.stock", checkStock?.stock);

            if (checkStock?.stock === 0) {
                console.log("El stock de este producto era 0 antes de ser actualizado");
                await this.availableNowService.notifyUsersWhenStockRestored(id);
            }
        }

        return await this.productsRepository.update(id, data);
    }
    patchProductsById(id: string) {
        throw new Error('Method not implemented.');
        return this.productsRepository.update(id, { available: false });
    }

    async deleteProductsById(id: string) {
        const findProduct = await this.productsRepository.findOne({ where: { id } });
        if (!findProduct) throw new NotFoundException(`No se encontró el producto con id: ${id}`);

        return await this.productsRepository.delete(id);
    }

}
