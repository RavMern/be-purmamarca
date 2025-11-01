import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'promotions' })
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 55,
    nullable: false
  })
  name: string;

  @Column('text', { nullable: false })
  image_url: string;

   @Column({ type: 'uuid', array: true, nullable: true })
  category_ids: string[] | null;

  @Column({
    type:"date"
  })
  start_date:Date

  @Column({
    type:"date"
  })
  expiration_date:Date

  @Column({
    type: 'int',
    nullable: true
  })
  promo_percentage: number;

}
