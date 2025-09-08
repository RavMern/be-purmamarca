import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './product.entity';
@Entity({ name: 'categories' })
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    unique: true,
  })
  categoryImage?: string;

  @OneToMany(() => Products, products => products.category)
  @JoinColumn()
  products: Products[];
}
