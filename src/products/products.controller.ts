/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Products } from 'src/entities/product.entity';
import { createProductDto, updateProductDto } from './dto/products.dto';
import { ProductsService } from './products.service';

@Controller('products')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Post()
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
    getProducts() {
        return this.productsService.getProducts();
    }

    @Get(':id')
    getProductsById(@Param('id') id: string): Promise<Products> {
        return this.productsService.getProductsById(id);
    }

    @Put(':id')
    updateProductsById(
        @Param('id') id: string,
        @Body() data: updateProductDto
    ) {
        return this.productsService.updateProductsById(id, data);
    }

    @Patch(':id')
    patchProductsByIdPatch(@Param('id') id: string) {
        return this.productsService.patchProductsById(id);
    }

    @Delete(':id')
    deleteProductsById(@Param('id') id: string) {
        return this.productsService.deleteProductsById(id);
    }
}
