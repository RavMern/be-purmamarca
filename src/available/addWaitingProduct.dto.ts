import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAvailableNowDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre de la persona interesada',
  })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @ApiProperty({ example: 'juan@mail.com', description: 'Email de contacto' })
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({ example: 'abc123', description: 'ID del producto' })
  @IsString({ message: 'productId must be a string' })
  @IsNotEmpty({ message: 'productId is required' })
  productId: string;
}
