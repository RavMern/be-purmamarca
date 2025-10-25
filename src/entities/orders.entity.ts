import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetails } from './orderdetails.entity';
import { Users } from './users.entity';
@Entity({
  name: 'orders',
})
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @OneToOne(() => OrderDetails, orderDetails => orderDetails.order)
  orderDetails: OrderDetails;

  @ManyToOne(() => Users, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
