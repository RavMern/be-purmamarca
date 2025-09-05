import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./product.entity";

@Entity()
export class AvailabeNow{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type:'varchar', nullable: false})
    name: string
    
    @Column({type:'varchar', nullable: false})
    email: string

    @ManyToOne(()=>Products, (product)=>product.availableNow)
    product:Products
}