import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailableNowModule } from 'src/available/available-now.module';
import { CategoreiesModule } from 'src/categories/categoreies.module';
import { Products } from 'src/entities/product.entity';
import { Promotion } from 'src/entities/promotion.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products,Promotion]),
    AvailableNowModule,
    CategoreiesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
