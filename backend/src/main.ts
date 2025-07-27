import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aquí damos permiso CORS para ese origen específico:
  app.enableCors({
    origin: 'http://localhost:3001', // solo ese dominio puede acceder
    methods: 'GET,POST,PUT,DELETE',
    // credentials: true, // si usas cookies o headers de autenticación
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
