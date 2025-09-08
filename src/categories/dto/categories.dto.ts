/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
    @MaxLength(50, { message: 'El nombre de la categoría no puede exceder 50 caracteres' })
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'La imagen de la categoría no puede exceder 50 caracteres' })
    categoryImage?: string;
}

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'El nombre de la categoría no puede exceder 50 caracteres' })
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'La imagen de la categoría no puede exceder 50 caracteres' })
    categoryImage?: string;
}
