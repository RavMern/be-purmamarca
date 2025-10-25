/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electrodomésticos',
    description: 'Nombre de la categoría',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  name: string;

  @ApiPropertyOptional({
    example: 'https://cdn.site.com/categoria.png',
    description: 'URL de la imagen de la categoría',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La imagen no puede exceder 50 caracteres' })
  categoryImage?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Electrónica',
    description: 'Nuevo nombre de la categoría',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.site.com/categoria-nueva.png',
    description: 'Nueva URL de la imagen',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La imagen no puede exceder 50 caracteres' })
  categoryImage?: string;
}
