/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AvailabeNow } from './availableNow.entity';
import { Categories } from './categories.entity';

@Entity({ name: 'products' })
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 55,
    nullable: false
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false
  })
  color: string;

  @Column({
    type: 'uuid',
    nullable: false
  })
  categoryId: string;

  @ManyToOne(() => Categories, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Categories;

  @Column({
    type: 'int',
    nullable: false
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false
  })
  stock: number;

  @Column('text', { array: true, nullable: true })
  imgs: string[];

  @Column({
    type: 'boolean',
    nullable: false,
    default: false
  })
  onSale: boolean;

  @Column({
    type: 'int',
    nullable: true
  })
  priceOnSale?: number;

  @Column({
    type: 'varchar',
    nullable: true
  })
  size?: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true
  })
  available?: boolean;

  @OneToMany(()=>AvailabeNow,(availableNow)=>availableNow.product)
  availableNow:AvailabeNow[]
}
