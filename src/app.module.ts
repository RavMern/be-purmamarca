import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import all modules
import { AuthModule } from './auth/auth.module';
import { AvailableNowModule } from './available/available-now.module';
import { CategoreiesModule } from './categories/categoreies.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ProductsModule } from './products/products.module';
import { PromotionsModule } from './promotions/promotions.module';
import { SeedModule } from './seed/seed.module';

//!SUPABASE
import { parse } from 'pg-connection-string';

// Import all entities
import { Users } from './entities/users.entity';
import { Orders } from './entities/orders.entity';
import { OrderDetails } from './entities/orderdetails.entity';
import { Products } from './entities/product.entity';
import { Categories } from './entities/categories.entity';
import { AvailabeNow } from './entities/availableNow.entity';
import { Promotion } from './entities/promotion.entity';
import { Subproducts } from './entities/subproduct.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    //!SUPABASE (usa la DATABASE_URL de Supabase con SSL y pooler IPv4)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');

        // Si hay DATABASE_URL, usar Supabase
        if (dbUrl) {
          // Limpiar la URL removiendo query params para el parse
          // pero mantener pgbouncer=true en la URL original si existe
          const cleanUrl = dbUrl.split('?')[0];
          const parsed = parse(cleanUrl);

          // Log para debug (sin mostrar password completo)
          const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
          console.log(`🔌 Using DATABASE_URL: ${maskedUrl}`);
          console.log(`📍 Host: ${parsed.host}, Port: ${parsed.port}, Database: ${parsed.database}, User: ${parsed.user}`);

          // Verificar si es Supabase (pooler o directo)
          const isSupabase = parsed.host?.includes('supabase') || parsed.host?.includes('pooler');

          return {
            type: 'postgres' as const,
            host: parsed.host || 'localhost',
            port: Number(parsed.port) || 5432,
            username: parsed.user || 'postgres',
            password: parsed.password || '',
            database: parsed.database || 'postgres',
            entities: [Users, Orders, OrderDetails, Products, Categories, AvailabeNow, Promotion, Subproducts],
            synchronize: process.env.NODE_ENV !== 'production', // ⚠️ solo en dev
            // SSL requerido para Supabase (pooler o directo)
            ...(isSupabase && {
              ssl: { rejectUnauthorized: false },
            }),
          };
        }

        // Fallback a variables individuales
        console.log('⚠️  DATABASE_URL not found, using individual DB variables');
        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'purmamarca_db'),
          entities: [Users, Orders, OrderDetails, Products, Categories, AvailabeNow, Promotion, Subproducts],
          synchronize: process.env.NODE_ENV !== 'production',
        };
      },
    }),
    // Add all feature modules
    AuthModule,
    ProductsModule,
    CategoreiesModule,
    FileUploadModule,
    AvailableNowModule,
    PromotionsModule,
    SeedModule, // Seed module para ejecutar automáticamente
    // MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
