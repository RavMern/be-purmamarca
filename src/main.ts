import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad básica
  // app.use(helmet());

  // Prefijo global para todos los endpoints
  app.setGlobalPrefix('api');

  // CORS configurado para tu front
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan campos extra
      transform: true, // transforma tipos automáticamente
    })
  );

  // --- Configuración Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API Distribuidora Purmamarca')
    .setDescription(
      'Documentación de la API de Distribuidora Purmamarca con Swagger'
    )
    .setVersion('1.0')
    .addBearerAuth() // Para JWT en endpoints protegidos
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // --- Fin Swagger ---

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  Logger.log(
    `Swagger disponible en http://localhost:${process.env.PORT ?? 3000}/api/docs`
  );
}
bootstrap();
