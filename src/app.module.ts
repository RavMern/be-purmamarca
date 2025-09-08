import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';

// Import all modules
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoreiesModule } from './categories/categoreies.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AvailableNowModule } from './available/available-now.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm')!,
      inject: [ConfigService],
    }),
    // Add all feature modules
    AuthModule,
    ProductsModule,
    CategoreiesModule,
    FileUploadModule,
    AvailableNowModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
