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
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: Products,
  })
  async createProducts(@Body() data: createProductDto): Promise<Products> {
    if (!data) throw new BadRequestException('Data not received');
    if (!data.categoryId)
      throw new BadRequestException('La categoría es requerida');
    return await this.productsService.createProducts(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
    type: [Products],
  })
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: Products,
  })
  getProductsById(@Param('id') id: string): Promise<Products> {
    return this.productsService.getProductsById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  @ApiBody({ type: updateProductDto })
  updateProductsById(@Param('id') id: string, @Body() data: updateProductDto) {
    return this.productsService.updateProductsById(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  patchProductsByIdPatch(@Param('id') id: string) {
    return this.productsService.patchProductsById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  deleteProductsById(@Param('id') id: string) {
    return this.productsService.deleteProductsById(id);
  }
}
