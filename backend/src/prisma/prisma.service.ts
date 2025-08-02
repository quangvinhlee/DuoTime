import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super();
    // Logger context is handled by LoggerService internally
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
