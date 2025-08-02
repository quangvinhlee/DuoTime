import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  // Use Pino logger
  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',
      'http://localhost:19006',
      'exp://localhost:8081',
      'http://192.168.4.86:8081',
      'http://192.168.4.86:19006',
      'http://192.168.4.86:3000', // Add backend IP
      'exp://192.168.4.86:8081',
      // Allow any origin for development (remove in production)
      '*',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT, '0.0.0.0'); // Listen on all interfaces

  const logger = app.get(Logger);
  logger.log(`🚀 Server is running on port ${PORT}`);
  logger.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});
