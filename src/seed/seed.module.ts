import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Products } from 'src/entities/product.entity';
import { Categories } from 'src/entities/categories.entity';
import { ProductsModule } from 'src/products/products.module';
import { CategoreiesModule } from 'src/categories/categoreies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Categories]),
    forwardRef(() => ProductsModule),
    forwardRef(() => CategoreiesModule),
  ],
  providers: [SeedService],
})
export class SeedModule {}
