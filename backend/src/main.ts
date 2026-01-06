import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permitir CORS para el frontend
  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend
    credentials: true,
  });

  // Agregar prefijo 'api' a todas las rutas
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('');
  console.log('========================================');
  console.log('Servidor funcionando en: http://localhost:' + port);
  console.log('========================================');
  console.log('');
  console.log('📋 Endpoints disponibles:');
  console.log('');
  console.log('Auth:');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/auth/me');
  console.log('');
  console.log('Records:');
  console.log('  GET    /api/records');
  console.log('  GET    /api/records/:id');
  console.log('  POST   /api/records');
  console.log('  PUT    /api/records/:id');
  console.log('  DELETE /api/records/:id');
  console.log('');
  console.log('ETL:');
  console.log('  POST /api/etl/process');
  console.log('');
  console.log('========================================');
}

bootstrap();