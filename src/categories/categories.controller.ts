/* eslint-disable prettier/prettier */
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    HttpCode, 
    HttpStatus,
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';
import { Categories } from '../entities/categories.entity';

@Controller('categories')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    // CREATE - Crear nueva categoría
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Categories> {
        return await this.categoriesService.create(createCategoryDto);
    }

    // READ - Obtener todas las categorías
    @Get()
    async findAll(): Promise<Categories[]> {
        return await this.categoriesService.findAll();
    }

    // READ - Obtener categoría por ID
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Categories> {
        return await this.categoriesService.findOne(id);
    }

    // READ - Obtener categoría por nombre
    @Get('name/:name')
    async findByName(@Param('name') name: string): Promise<Categories> {
        return await this.categoriesService.findByName(name);
    }

    // UPDATE - Actualizar categoría
    @Patch(':id')
    async update(
        @Param('id') id: string, 
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<Categories> {
        return await this.categoriesService.update(id, updateCategoryDto);
    }

    // DELETE - Eliminar categoría
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return await this.categoriesService.remove(id);
    }
}
