/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Promotion } from 'src/entities/promotion.entity';
import { Repository } from 'typeorm';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion) private readonly promosRepository: Repository<Promotion>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getPromotions(): Promise<Promotion[]> {
    return this.promosRepository.find();
  }

  async createPromotions(data: CreatePromotionDto): Promise<Promotion> {
    // Validar fechas
    if (new Date(data.start_date) > new Date(data.expiration_date)) {
      throw new BadRequestException('La fecha de inicio no puede ser mayor a la de expiración');
    }

    if (data.category_ids?.length) {
      for (const categoryId of data.category_ids) {
        try {
          await this.categoriesService.findOne(categoryId);
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada`);
          }
          throw error;
        }
      }
    }

    const newPromo = this.promosRepository.create(data);
    return await this.promosRepository.save(newPromo);
  }

  async getPromotionById(id: string): Promise<Promotion> {
    const promo = await this.promosRepository.findOne({ where: { id } });
    if (!promo) throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    return promo;
  }

  async updatePromotionById(id: string, data: UpdatePromotionDto) {
    const promo = await this.promosRepository.findOne({ where: { id } });
    if (!promo) throw new NotFoundException(`Promoción con ID ${id} no encontrada`);

    if (data.start_date && data.expiration_date && new Date(data.start_date) > new Date(data.expiration_date)) {
      throw new BadRequestException('La fecha de inicio no puede ser mayor a la de expiración');
    }

    if (data.category_ids?.length) {
      for (const categoryId of data.category_ids) {
        try {
          await this.categoriesService.findOne(categoryId);
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada`);
          }
          throw error;
        }
      }
    }

    await this.promosRepository.update(id, data);
    return await this.promosRepository.findOne({ where: { id } });
  }

  async patchPromotionById(id: string, data: Partial<UpdatePromotionDto>) {
    const promo = await this.promosRepository.findOne({ where: { id } });
    if (!promo) throw new NotFoundException(`Promoción con ID ${id} no encontrada`);

    await this.promosRepository.update(id, data);
    return await this.promosRepository.findOne({ where: { id } });
  }

  async deletePromotionById(id: string) {
    const promo = await this.promosRepository.findOne({ where: { id } });
    if (!promo) throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    return await this.promosRepository.delete(id);
  }
}
