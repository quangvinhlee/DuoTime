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
    this.logger.setContext('PrismaService');
  }

  async onModuleInit() {
    this.logger.info(
      { event: 'prisma_connecting' },
      'Connecting to database...',
    );
    await this.$connect();
    this.logger.info(
      { event: 'prisma_connected' },
      'Successfully connected to database',
    );
  }

  async onModuleDestroy() {
    this.logger.info(
      { event: 'prisma_disconnecting' },
      'Disconnecting from database...',
    );
    await this.$disconnect();
    this.logger.info(
      { event: 'prisma_disconnected' },
      'Successfully disconnected from database',
    );
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
