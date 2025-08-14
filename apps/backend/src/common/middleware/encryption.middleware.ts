import { EncryptionService } from '../services/encryption.service';
import { encryptionConfig } from '../config/encryption.config';

// Type definitions for Prisma middleware
interface PrismaMiddlewareParams {
  model?: string;
  action: string;
  args: {
    data?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

type PrismaMiddlewareNext = (
  params: PrismaMiddlewareParams,
) => Promise<unknown>;

export class EncryptionMiddleware {
  constructor(private readonly encryptionService: EncryptionService) {}

  /**
   * Creates a Prisma middleware function for automatic encryption/decryption
   */
  createMiddleware() {
    const { encryptedFields } = encryptionConfig;

    return async (
      params: PrismaMiddlewareParams,
      next: PrismaMiddlewareNext,
    ) => {
      const modelName = params.model;
      const config = encryptedFields[modelName as keyof typeof encryptedFields];

      // Encrypt data before write operations
      if (
        config &&
        ['create', 'update', 'updateMany'].includes(params.action)
      ) {
        if (params.args?.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params.args.data = this.encryptionService.encryptObject(
            params.args.data as any,
            Array.from(config),
          );
        }
      }

      // Execute the query
      const result = await next(params);

      // Decrypt data after read operations
      if (
        config &&
        ['findMany', 'findFirst', 'findUnique'].includes(params.action)
      ) {
        if (Array.isArray(result)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return result.map((item: any) =>
            this.encryptionService.decryptObject(item, Array.from(config)),
          );
        } else if (result) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return this.encryptionService.decryptObject(
            result as any,
            Array.from(config),
          );
        }
      }

      return result;
    };
  }
}
