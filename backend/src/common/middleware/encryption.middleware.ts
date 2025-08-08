import { EncryptionService } from '../services/encryption.service';
import { encryptionConfig } from '../config/encryption.config';

export class EncryptionMiddleware {
  constructor(private readonly encryptionService: EncryptionService) {}

  /**
   * Creates a Prisma middleware function for automatic encryption/decryption
   */
  createMiddleware() {
    const { encryptedFields } = encryptionConfig;

    return async (params: any, next: any) => {
      const modelName = params.model;
      const config = encryptedFields[modelName as keyof typeof encryptedFields];

      // Encrypt data before write operations
      if (
        config &&
        ['create', 'update', 'updateMany'].includes(params.action)
      ) {
        if (params.args?.data) {
          params.args.data = this.encryptionService.encryptObject(
            params.args.data,
            [...config],
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
          return result.map((item) =>
            this.encryptionService.decryptObject(item, [...config]),
          );
        } else if (result) {
          return this.encryptionService.decryptObject(result, [...config]);
        }
      }

      return result;
    };
  }
}
