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
    super();
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

    // Suppress deprecation warning for now
    // TODO: Migrate to client extensions when Prisma version supports it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$use(middleware);
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
