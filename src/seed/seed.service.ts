import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from 'src/entities/product.entity';
import { Categories } from 'src/entities/categories.entity';
import { ProductsService } from 'src/products/products.service';
import { CategoriesService } from 'src/categories/categories.service';
import { createProductDto } from 'src/products/dto/products.dto';
import { CreateCategoryDto } from 'src/categories/dto/categories.dto';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    // Solo ejecutar en desarrollo y si está habilitado
    const shouldRunSeed =
      process.env.NODE_ENV === 'development' &&
      process.env.RUN_SEED_ON_START === 'true';

    if (!shouldRunSeed) {
      this.logger.debug('Seed deshabilitado. Para habilitarlo, configura RUN_SEED_ON_START=true en .env');
      return;
    }

    // Esperar un poco para que la base de datos esté completamente lista
    await this.delay(3000);

    try {
      this.logger.log('🌱 Iniciando seed automático...');
      await this.runSeed();
    } catch (error) {
      this.logger.error('❌ Error al ejecutar seed:', error.message);
      // No lanzar error para que la app pueda seguir funcionando
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async runSeed() {
    // Verificar si ya hay datos
    const productCount = await this.productsRepository.count();
    const categoryCount = await this.categoriesRepository.count();

    if (productCount > 0 || categoryCount > 0) {
      this.logger.log(`ℹ️  Ya existen ${productCount} productos y ${categoryCount} categorías. Seed omitido.`);
      this.logger.log('💡 Para forzar el seed, configura FORCE_SEED=true en .env');

      if (process.env.FORCE_SEED !== 'true') {
        return;
      }
    }

    try {
      // 1. Datos del seed
      const categoriesData: CreateCategoryDto[] = [
        { name: 'Lámparas de Sal', categoryImage: 'https://picsum.photos/seed/Lamparas/400/300' },
        { name: 'Velas', categoryImage: 'https://picsum.photos/seed/Velas/400/300' },
        { name: 'Inciensos', categoryImage: 'https://picsum.photos/seed/Inciensos/400/300' },
        { name: 'Difusores', categoryImage: 'https://picsum.photos/seed/Difusores/400/300' },
        { name: 'Cristales', categoryImage: 'https://picsum.photos/seed/Cristales/400/300' },
        { name: 'Sahumerios', categoryImage: 'https://picsum.photos/seed/Sahumerios/400/300' },
      ];

      const productsPerCategory: createProductDto[][] = [
        [
          { name: 'CLASSWING', description: 'Lámpara CLASSWING', color: 'Blanco', price: 20, stock: 100, imgs: ['https://picsum.photos/200/200?random=1'], onSale: false, available: true, size: 'Chica', categoryId: '' },
          { name: 'MOONLIGHT', description: 'Lámpara MOONLIGHT', color: 'Rosado', price: 25, stock: 80, imgs: ['https://picsum.photos/200/200?random=2'], onSale: true, priceOnSale: 20, available: true, size: 'Mediana', categoryId: '' },
          { name: 'ZENLIGHT', description: 'Lámpara ZENLIGHT', color: 'Naranja', price: 30, stock: 60, imgs: ['https://picsum.photos/200/200?random=3'], onSale: false, available: true, size: 'Grande', categoryId: '' },
        ],
        [
          { name: 'VELA AROMA', description: 'Vela aromática', color: 'Blanco', price: 10, stock: 100, imgs: ['https://picsum.photos/200/200?random=4'], onSale: false, available: true, size: 'Chica', categoryId: '' },
          { name: 'VELA RELAX', description: 'Vela relajante', color: 'Morado', price: 12, stock: 80, imgs: ['https://picsum.photos/200/200?random=5'], onSale: true, priceOnSale: 8, available: true, size: 'Mediana', categoryId: '' },
          { name: 'VELA SPA', description: 'Vela tipo SPA', color: 'Verde', price: 15, stock: 60, imgs: ['https://picsum.photos/200/200?random=6'], onSale: false, available: true, size: 'Grande', categoryId: '' },
        ],
        [
          { name: 'Incienso Sándalo', description: 'Varilla con aroma a sándalo', color: 'Marrón', price: 5, stock: 100, imgs: ['https://picsum.photos/200/200?random=7'], onSale: false, available: true, size: 'Chica', categoryId: '' },
          { name: 'Incienso Lavanda', description: 'Varilla con aroma a lavanda', color: 'Morado', price: 6, stock: 80, imgs: ['https://picsum.photos/200/200?random=8'], onSale: true, priceOnSale: 4, available: true, size: 'Mediana', categoryId: '' },
          { name: 'Incienso Rosa', description: 'Varilla con aroma a rosas', color: 'Rosa', price: 7, stock: 70, imgs: ['https://picsum.photos/200/200?random=9'], onSale: false, available: true, size: 'Grande', categoryId: '' },
        ],
        [
          { name: 'Difusor Agua', description: 'Difusor tipo agua', color: 'Blanco', price: 18, stock: 100, imgs: ['https://picsum.photos/200/200?random=10'], onSale: false, available: true, size: 'Chica', categoryId: '' },
          { name: 'Difusor Zen', description: 'Difusor Zen', color: 'Madera', price: 22, stock: 80, imgs: ['https://picsum.photos/200/200?random=11'], onSale: true, priceOnSale: 18, available: true, size: 'Mediana', categoryId: '' },
          { name: 'Difusor Spa', description: 'Difusor SPA', color: 'Negro', price: 25, stock: 60, imgs: ['https://picsum.photos/200/200?random=12'], onSale: false, available: true, size: 'Grande', categoryId: '' },
        ],
        [
          { name: 'Cristal Cuarzo', description: 'Cristal de cuarzo', color: 'Transparente', price: 12, stock: 100, imgs: ['https://picsum.photos/200/200?random=13'], onSale: false, available: true, size: 'Chica', categoryId: '' },
          { name: 'Cristal Amatista', description: 'Cristal de amatista', color: 'Morado', price: 14, stock: 80, imgs: ['https://picsum.photos/200/200?random=14'], onSale: true, priceOnSale: 10, available: true, size: 'Mediana', categoryId: '' },
          { name: 'Cristal Citrino', description: 'Cristal de citrino', color: 'Amarillo', price: 16, stock: 60, imgs: ['https://picsum.photos/200/200?random=15'], onSale: false, available: true, size: 'Grande', categoryId: '' },
        ],
        [
          { name: 'Sahumerio Palo Santo', description: 'Palo Santo', color: 'Marrón', price: 8, stock: 100, imgs: ['https://picsum.photos/200/200?random=16'], onSale: false, available: true, size: 'Chica', categoryId: '' },
          { name: 'Sahumerio Lavanda', description: 'Lavanda', color: 'Morado', price: 9, stock: 80, imgs: ['https://picsum.photos/200/200?random=17'], onSale: true, priceOnSale: 6, available: true, size: 'Mediana', categoryId: '' },
          { name: 'Sahumerio Rosa', description: 'Rosa', color: 'Rosa', price: 10, stock: 60, imgs: ['https://picsum.photos/200/200?random=18'], onSale: false, available: true, size: 'Grande', categoryId: '' },
        ],
      ];

      // 2. Limpiar datos existentes si FORCE_SEED=true
      if (process.env.FORCE_SEED === 'true') {
        this.logger.log('🗑️  Limpiando datos existentes...');
        await this.deleteAllData();
      }

      // 3. Crear categorías
      this.logger.log('📁 Creando categorías...');
      const categoryIds: string[] = [];
      for (const cat of categoriesData) {
        try {
          const category = await this.categoriesService.create(cat);
          categoryIds.push(category.id);
          this.logger.log(`  ✅ ${cat.name}`);
        } catch (error) {
          this.logger.warn(`⚠️  Error al crear categoría ${cat.name}: ${error.message}`);
        }
      }

      // 4. Crear productos
      this.logger.log('📦 Creando productos...');
      let productCount = 0;
      for (let i = 0; i < categoryIds.length; i++) {
        const catId = categoryIds[i];
        const productsForCat = productsPerCategory[i];

        for (const p of productsForCat) {
          try {
            await this.productsService.createProducts({ ...p, categoryId: catId });
            productCount++;
            this.logger.log(`  ✅ ${p.name}`);
          } catch (error) {
            this.logger.warn(`⚠️  Error al crear producto ${p.name}: ${error.message}`);
          }
        }
      }

      this.logger.log(`🎉 Seed completado: ${categoryIds.length} categorías y ${productCount} productos creados`);
    } catch (error) {
      this.logger.error('❌ Error en seed:', error.message);
      throw error;
    }
  }

  private async deleteAllData(): Promise<void> {
    try {
      // Eliminar todos los productos
      const products = await this.productsRepository.find();
      for (const product of products) {
        await this.productsService.deleteProductsById(product.id);
      }

      // Eliminar todas las categorías (en orden inverso por si hay dependencias)
      const categories = await this.categoriesRepository.find();
      for (let i = categories.length - 1; i >= 0; i--) {
        try {
          await this.categoriesService.remove(categories[i].id);
        } catch (error) {
          // Si tiene productos, primero eliminamos los productos de esa categoría
          this.logger.warn(`⚠️  No se pudo eliminar categoría ${categories[i].name}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.warn(`Error al limpiar datos: ${error.message}`);
    }
  }
}
