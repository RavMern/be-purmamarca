import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable} from 'typeorm'
import { Orders } from './orders.entity';
import { Products } from './product.entity';

@Entity({name:'order_details'})
export class OrderDetails{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type:'decimal',
        precision:10,
        scale:2
    })
    price:number

    @OneToOne(()=>Orders, (order)=>order.orderDetails)
    @JoinColumn({name: 'order_id'})
    order: Orders

    @ManyToMany(()=>Products)
    @JoinTable({name:'orders_details_products'})
    products:Products[]
}