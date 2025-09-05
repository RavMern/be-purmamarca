/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Categories } from '../entities/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService] // Exportar el servicio para uso en otros módulos
})
export class CategoreiesModule {}
