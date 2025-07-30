import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081', // Expo dev server
      'http://localhost:19006', // Expo web
      'exp://localhost:8081', // Expo dev client
      'http://192.168.4.86:8081', // Your current IP - Expo dev server
      'http://192.168.4.86:19006', // Your current IP - Expo web
      'exp://192.168.4.86:8081', // Your current IP - Expo dev client
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT, '0.0.0.0'); // Listen on all interfaces
  console.log(`Server is running on port ${PORT}`);
}

bootstrap();
