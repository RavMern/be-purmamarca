/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoreiesModule } from 'src/categories/categoreies.module';
import { Promotion } from 'src/entities/promotion.entity';
import { PromotionsController } from './promotions.controller';
import { PromotionService } from './promotions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion]),
    CategoreiesModule,
  ],
  controllers: [PromotionsController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionsModule {}
