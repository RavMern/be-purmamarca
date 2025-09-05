import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./product.entity";


@Entity({name:'subproducts'})
export class Subproducts {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'int',nullable:false})
    price:number;

    @Column({type:'int',nullable:false})
    stock:number;

    @Column({type:'varchar',nullable:false})
    color:string;

    // @ManyToOne(()=>Products,(product)=>product.subproducts)
    // products:Products

}