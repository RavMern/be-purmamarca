import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AvailabeNow } from 'src/entities/availableNow.entity';
import { CreateAvailableNowDto } from './addWaitingProduct.dto';
import { AvailableNowService } from './available-now.service';

@ApiTags('available-now')
@Controller('available-now')
export class AvailableNowController {
  constructor(private readonly availableNowService: AvailableNowService) {}

  @Post()
  @ApiOperation({
    summary: 'Agregar email a la lista de espera de un producto',
  })
  @ApiBody({ type: CreateAvailableNowDto })
  @ApiResponse({
    status: 201,
    description: 'Email agregado a la lista de espera exitosamente',
    type: AvailabeNow,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBearerAuth()
  async addEmail(
    @Body() addWaitingProduct: CreateAvailableNowDto
  ): Promise<AvailabeNow> {
    if (!addWaitingProduct) {
      throw new Error('Data not received');
    }
    return await this.availableNowService.availableNowService(
      addWaitingProduct
    );
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Obtener emails de la lista de espera de un producto',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID del producto',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de emails obtenida exitosamente',
    type: [AvailabeNow],
  })
  @ApiResponse({ status: 400, description: 'ID de producto no proporcionado' })
  @ApiBearerAuth()
  async getEmails(
    @Param('productId') productId: string
  ): Promise<AvailabeNow[]> {
    if (!productId) throw new Error('productId not received');
    return await this.availableNowService.getEmails(productId);
  }
}
