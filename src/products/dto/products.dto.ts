import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Camiseta Rock', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  name: string;

  @ApiProperty({
    example: 'Camiseta de algodón talla M',
    description: 'Descripción del producto',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción del producto es requerida' })
  description: string;

  @ApiProperty({ example: 'Negro', description: 'Color del producto' })
  @IsString()
  @IsNotEmpty({ message: 'El color del producto es requerido' })
  color: string;

  @ApiProperty({
    example: 'uuid-de-categoria',
    description: 'ID de la categoría del producto',
  })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsString()
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  categoryId: string;

  @ApiProperty({ example: 1999, description: 'Precio del producto en pesos' })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @ApiProperty({ example: 10, description: 'Stock disponible del producto' })
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber()
  @IsPositive({ message: 'El stock debe ser mayor a 0' })
  stock: number;

  @ApiProperty({
    example: ['img1.jpg', 'img2.jpg'],
    description: 'URLs de las imágenes del producto',
  })
  @IsArray({ message: 'Las imágenes deben ser un array' })
  @IsNotEmpty({ message: 'Las imágenes son requeridas' })
  imgs: string[];

  @ApiProperty({ example: 'M', description: 'Tamaño del producto' })
  @IsNotEmpty({ message: 'El tamaño es requerido' })
  @IsString()
  size: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el producto está en oferta',
  })
  @IsBoolean()
  onSale: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si el producto está disponible',
  })
  @IsBoolean()
  available: boolean;
}

export class updateProductDto {
  @ApiPropertyOptional({
    example: 'Camiseta Rock',
    description: 'Nombre del producto',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Camiseta de algodón talla M',
    description: 'Descripción del producto',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'uuid-de-categoria',
    description: 'ID de la categoría del producto',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  categoryId?: string;

  @ApiPropertyOptional({
    example: 1999,
    description: 'Precio del producto en pesos',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Stock disponible del producto',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'El stock debe ser mayor a 0' })
  stock?: number;

  @ApiPropertyOptional({
    example: ['img1.jpg', 'img2.jpg'],
    description: 'URLs de las imágenes del producto',
  })
  @IsArray()
  @IsOptional()
  imgs?: string[];

  @ApiPropertyOptional({ example: 'M', description: 'Tamaño del producto' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el producto está en oferta',
  })
  @IsBoolean()
  @IsOptional()
  onSale?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el producto está disponible',
  })
  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
