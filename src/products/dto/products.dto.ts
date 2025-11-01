/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class createProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Camiseta de algodón',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Camiseta de algodón 100% orgánico',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción del producto es requerida' })
  description: string;

  @ApiProperty({ description: 'Color del producto', example: 'Azul' })
  @IsString()
  @IsNotEmpty({ message: 'El color del producto es requerido' })
  color: string;

  @ApiProperty({
    description: 'ID de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsString()
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  categoryId: string;

  @ApiProperty({ description: 'Precio del producto', example: 2500 })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @ApiProperty({ description: 'Stock disponible', example: 50 })
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber()
  @IsPositive({ message: 'El stock debe ser mayor a 0' })
  stock: number;

  @ApiProperty({
    description: 'URLs de las imágenes del producto',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsArray({ message: 'Las imágenes deben ser un array' })
  @IsOptional({ message: 'Las imágenes son requeridas' })
  imgs: string[];

  @ApiProperty({ description: 'Tamaño del producto', example: 'M' })
  @IsNotEmpty({ message: 'El tamaño es requerido' })
  @IsString()
  size: string;

  @ApiProperty({
    description: 'Indica si el producto está en oferta',
    example: false,
  })
  @IsBoolean()
  onSale: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'El valor debe ser mayor a 0' })
  priceOnSale?: number;


  @ApiProperty({
    description: 'Indica si el producto está disponible',
    example: true,
  })
  @IsBoolean()
  available: boolean;
}
export class updateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Camiseta de algodón',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Camiseta de algodón 100% orgánico',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  categoryId?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 2500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'Stock disponible',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'El stock debe ser mayor a 0' })
  stock?: number;

  @ApiProperty({
    description: 'URLs de las imágenes del producto',
    example: ['https://example.com/image1.jpg'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  imgs?: string[];

  @ApiProperty({
    description: 'Tamaño del producto',
    example: 'M',
    required: false,
  })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({
    description: 'Indica si el producto está en oferta',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  onSale?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'El valor debe ser mayor a 0' })
  priceOnSale?: number;

  @ApiProperty({
    description: 'Indica si el producto está disponible',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
