import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';

// Define which fields to encrypt for each model
export const ENCRYPTION_CONFIG = {
  user: ['email', 'pushToken'],
  loveNote: ['message'],
  reminder: ['description'],
  loveActivity: ['description'],
} as const;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    this.logger.logBusinessEvent('prisma_connecting', {}, 'info');
    await this.$connect();
    this.logger.logBusinessEvent('prisma_connected', {}, 'info');
  }

  async onModuleDestroy() {
    this.logger.logBusinessEvent('prisma_disconnecting', {}, 'info');
    await this.$disconnect();
    this.logger.logBusinessEvent('prisma_disconnected', {}, 'info');
  }

  // Helper method to log database operations
  async loggedQuery<T>(
    operation: string,
    table: string,
    queryFn: () => Promise<T>,
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;
      this.logger.logDatabaseOperation(operation, table, duration);
      return result;
    } catch (error) {
      const errorInstance =
        error instanceof Error ? error : new Error(String(error));
      this.logger.logDatabaseError(operation, table, errorInstance);
      throw error;
    }
  }
}
