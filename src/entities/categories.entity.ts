import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './product.entity';

@Entity({ name: 'categories' })
export class Categories {
  @ApiProperty({
    example: 'uuid-1234',
    description: 'ID único de la categoría',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Electrodomésticos',
    description: 'Nombre de la categoría',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @ApiProperty({
    example: 'https://cdn.site.com/categoria.png',
    description: 'URL de la imagen de la categoría',
    required: false,
  })
  @Column({ type: 'text', nullable: true, unique: true })
  categoryImage?: string;

  @ApiProperty({
    type: () => [Products],
    description: 'Lista de productos asociados',
  })
  @OneToMany(() => Products, products => products.category)
  products: Products[];
}
