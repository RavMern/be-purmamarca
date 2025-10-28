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
    if (!data) {
      throw new BadRequestException('Data not received');
    }

    if (!data.categoryId) {
      throw new BadRequestException('La categoría es requerida');
    }

    return await this.productsService.createProducts(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
    type: [Products],
  })
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Obtener los últimos 10 productos agregados' })
  @ApiResponse({
    status: 200,
    description: 'Últimos 10 productos obtenidos exitosamente',
    type: [Products],
  })
  getLatestProducts() {
    return this.productsService.getLatestProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: Products,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  getProductsById(@Param('id') id: string): Promise<Products> {
    return this.productsService.getProductsById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto completo' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  @ApiBody({ type: updateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBearerAuth()
  updateProductsById(@Param('id') id: string, @Body() data: updateProductDto) {
    return this.productsService.updateProductsById(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado parcialmente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiBearerAuth()
  patchProductsByIdPatch(@Param('id') id: string) {
    return this.productsService.patchProductsById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'string' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiBearerAuth()
  deleteProductsById(@Param('id') id: string) {
    return this.productsService.deleteProductsById(id);
  }
}
