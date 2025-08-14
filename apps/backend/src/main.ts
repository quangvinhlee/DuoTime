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

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: true, // Allow all origins in development
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
  await app.listen(PORT, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`🚀 Server running on port ${PORT}`);
  logger.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
}

bootstrap().catch((error) => {
  console.error('❌ Server startup error:', error);
  process.exit(1);
});
