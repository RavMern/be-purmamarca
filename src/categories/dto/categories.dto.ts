/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
    @MaxLength(50, { message: 'El nombre de la categoría no puede exceder 50 caracteres' })
    name: string;
}

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'El nombre de la categoría no puede exceder 50 caracteres' })
    name?: string;
}
