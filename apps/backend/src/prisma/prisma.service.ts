import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';
import { EncryptionService } from '../common/services/encryption.service';
import { EncryptionMiddleware } from '../common/middleware/encryption.middleware';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: LoggerService,
    private readonly encryptionService: EncryptionService,
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
    this.setupEncryptionMiddleware();
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

  private setupEncryptionMiddleware() {
    const encryptionMiddleware = new EncryptionMiddleware(
      this.encryptionService,
    );
    const middleware = encryptionMiddleware.createMiddleware();

    // Use Prisma client extensions instead of deprecated $use
    this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            // Create params object for middleware compatibility
            const params = {
              model,
              action: operation,
              args: args as any,
            };

            // Apply encryption middleware
            return middleware(params, query as any);
          },
        },
      },
    });
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
