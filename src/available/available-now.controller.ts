import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AvailabeNow } from 'src/entities/availableNow.entity';
import { CreateAvailableNowDto } from './addWaitingProduct.dto';
import { AvailableNowService } from './available-now.service';

@ApiTags('available-now')
@Controller('available-now')
export class AvailableNowController {
  constructor(private readonly availableNowService: AvailableNowService) {}

  @Post()
  @ApiOperation({
    summary: 'Agregar un email a la lista de espera de un producto',
  })
  @ApiResponse({
    status: 201,
    description: 'Email agregado con éxito',
    type: AvailabeNow,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
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
    summary: 'Obtener emails en lista de espera para un producto',
  })
  @ApiParam({ name: 'productId', description: 'ID del producto', type: String })
  @ApiResponse({
    status: 200,
    description: 'Listado de emails',
    type: [AvailabeNow],
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getEmails(
    @Param('productId') productId: string
  ): Promise<AvailabeNow[]> {
    if (!productId) throw new Error('productId not received');
    return await this.availableNowService.getEmails(productId);
  }
}
