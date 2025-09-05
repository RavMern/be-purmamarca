import {
    Entity,
    Column,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import { Products } from "./product.entity"
@Entity({ name: "categories" })
export class Categories {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "varchar",
        length: 50,
        nullable: false,
        unique: true
    })
    name: string;

    @OneToMany(() => Products, (products) => products.category)
    @JoinColumn()
    products: Products[]
}