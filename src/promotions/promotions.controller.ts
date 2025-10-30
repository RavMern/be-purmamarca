/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion';
import { PromotionService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promoService: PromotionService) {}

  @Get()
  async getAllProms() {
    return await this.promoService.getPromotions();
  }

  @Get(':id')
  async getPromById(@Param('id') id: string) {
    return await this.promoService.getPromotionById(id);
  }

  @Post()
  async postProm(@Body() data: CreatePromotionDto) {
    return await this.promoService.createPromotions(data);
  }

  @Put('/:id')
  async putProm(
    @Param('id') id: string,
    @Body() data: UpdatePromotionDto,
  ) {
    return await this.promoService.updatePromotionById(id, data);
  }

  @Patch(':id')
  async patchProm(
    @Param('id') id: string,
    @Body() data: Partial<UpdatePromotionDto>,
  ) {
    return await this.promoService.patchPromotionById(id, data);
  }

  @Delete(':id')
  async deleteProm(@Param('id') id: string) {
    return await this.promoService.deletePromotionById(id);
  }
}
