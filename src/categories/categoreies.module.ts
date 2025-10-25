/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { ImagesService } from '../images/images.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories]),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, ImagesService],
  exports: [CategoriesService], // Exportar el servicio para uso en otros módulos
})
export class CategoreiesModule {}
