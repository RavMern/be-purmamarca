import {Entity, Column, OneToOne, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import { Users } from "./users.entity";
import { OrderDetails } from "./orderdetails.entity";
@Entity(
    {
        name: "orders"
    }
)
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    date: Date

    @OneToOne(()=>OrderDetails, (orderDetails)=>orderDetails.order)
    orderDetails:OrderDetails;

    @ManyToOne(()=>Users,(user)=>user.orders)
    @JoinColumn({name:"user_id"})
    user:Users

}