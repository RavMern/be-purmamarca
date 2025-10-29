/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Products } from 'src/entities/product.entity';
import { createProductDto, updateProductDto } from './dto/products.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({ type: createProductDto })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: Products,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o categoría no encontrada',
  })
  @ApiBearerAuth()
  async createProducts(@Body() data: createProductDto): Promise<Products> {
    if (!data) throw new BadRequestException('Data not received');
    if (!data.categoryId)
      throw new BadRequestException('La categoría es requerida');
    return await this.productsService.createProducts(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Obtener los últimos 10 productos agregados' })
  getLatestProducts() {
    return this.productsService.getLatestProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  getProductsById(@Param('id') id: string): Promise<Products> {
    return this.productsService.getProductsById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto completo' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  @ApiBody({ type: updateProductDto })
  @ApiBearerAuth()
  updateProductsById(@Param('id') id: string, @Body() data: updateProductDto) {
    return this.productsService.updateProductsById(id, data);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Actualizar parcialmente un producto (por ejemplo disponible o stock)',
  })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  @ApiBody({
    schema: {
      example: { available: true, stock: 10 },
    },
  })
  @ApiBearerAuth()
  patchProductsById(
    @Param('id') id: string,
    @Body() partialData: Partial<Products>
  ) {
    return this.productsService.patchProductsById(id, partialData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  @ApiBearerAuth()
  deleteProductsById(@Param('id') id: string) {
    return this.productsService.deleteProductsById(id);
  }
}
