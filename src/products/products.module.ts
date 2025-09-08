import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { AvailableNowModule } from 'src/available/available-now.module';
import { CategoreiesModule } from 'src/categories/categoreies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products]),
    AvailableNowModule,
    CategoreiesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
