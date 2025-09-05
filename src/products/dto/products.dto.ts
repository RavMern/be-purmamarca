/* eslint-disable prettier/prettier */
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class createProductDto{
    @IsString()
    @IsNotEmpty({ message: 'El nombre del producto es requerido' })
    name:string;
    
    @IsString()
    @IsNotEmpty({ message: 'La descripción del producto es requerida' })
    description:string
    
    @IsString()
    @IsNotEmpty({ message: 'El color del producto es requerido' })
    color:string

    @IsNotEmpty({ message: 'La categoría es requerida' })
    @IsString()
    @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
    categoryId:string
    
    
    @IsNotEmpty({ message: 'El precio es requerido' })
    @IsNumber()
    @IsPositive({ message: 'El precio debe ser mayor a 0' })
    price:number
    
    @IsNotEmpty({ message: 'El stock es requerido' })
    @IsNumber()
    @IsPositive({message:'El stock debe ser mayor a 0'})
    stock:number

    @IsArray({ message: 'Las imágenes deben ser un array' })
    @IsNotEmpty({ message: 'Las imágenes son requeridas' })
    imgs:string[]
    
    
    @IsNotEmpty({ message: 'El tamaño es requerido' })
    @IsString()
    size:string
    
    @IsBoolean()
    onSale:boolean

    @IsBoolean()
    available:boolean
}
export class updateProductDto{
    @IsString()
    @IsOptional()
    name?:string;
    
    @IsString()
    @IsOptional()
    description?:string
    
    @IsOptional()
    @IsString()
    @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
    categoryId?:string
    
    
    @IsOptional()
    @IsNumber()
    price?:number
    
    @IsOptional()
    @IsNumber()
    @IsPositive({message:'El stock debe ser mayor a 0'})
    stock?:number
    
    @IsArray()
    @IsOptional()
    imgs?:string[]
    
    
    @IsString()
    @IsOptional()
    size?:string
    
    @IsBoolean()
    @IsOptional()
    onSale?:boolean
    
    @IsBoolean()
    @IsOptional()
    available?:boolean
}