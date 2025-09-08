import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAvailableNowDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString({ message: 'productId must be a string' })
  @IsNotEmpty({ message: 'productId is required' })
  productId: string;
}
