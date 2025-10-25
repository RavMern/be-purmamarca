import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Orders } from './orders.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  password: string;

  @Column({
    default: true,
  })
  isAdmin: boolean;

  @OneToMany(() => Orders, order => order.user)
  @JoinColumn({ name: 'orders_id' })
  orders: Orders[];
}
