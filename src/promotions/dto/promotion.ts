/* eslint-disable prettier/prettier */
import { IsArray, IsDateString, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @Length(3, 55)
  name: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsArray()
  category_ids?: string[];

  @IsDateString()
  start_date: string;

  @IsDateString()
  expiration_date: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  promo_percentage?: number;
}

export class UpdatePromotionDto extends CreatePromotionDto {}
