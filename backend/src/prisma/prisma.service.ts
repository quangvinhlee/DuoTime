import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';
import { EncryptionService } from '../common/services/encryption.service';
import { encryptionConfig } from '../common/config/encryption.config';

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
    // Logger context is handled by LoggerService internally
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
    // Use the centralized encryption configuration
    const { encryptedFields } = encryptionConfig;

    // Middleware to encrypt data before saving
    this.$use(async (params, next) => {
      const modelName = params.model;
      const config = encryptedFields[modelName as keyof typeof encryptedFields];

      if (config && params.action === 'create') {
        params.args.data = this.encryptionService.encryptObject(
          params.args.data,
          [...config], // Convert readonly array to regular array
        );
      }

      if (config && params.action === 'update') {
        if (params.args.data) {
          params.args.data = this.encryptionService.encryptObject(
            params.args.data,
            [...config], // Convert readonly array to regular array
          );
        }
      }

      if (config && params.action === 'updateMany') {
        if (params.args.data) {
          params.args.data = this.encryptionService.encryptObject(
            params.args.data,
            [...config], // Convert readonly array to regular array
          );
        }
      }

      const result = await next(params);

      // Decrypt data after reading
      if (
        config &&
        ['findMany', 'findFirst', 'findUnique'].includes(params.action)
      ) {
        if (Array.isArray(result)) {
          return result.map(
            (item) => this.encryptionService.decryptObject(item, [...config]), // Convert readonly array to regular array
          );
        } else if (result) {
          return this.encryptionService.decryptObject(result, [...config]); // Convert readonly array to regular array
        }
      }

      return result;
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
