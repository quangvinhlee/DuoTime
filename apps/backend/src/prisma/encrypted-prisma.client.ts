import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '../common/services/encryption.service';

// Define which fields to encrypt for each model
const ENCRYPTION_CONFIG = {
  user: ['email', 'pushToken'],
  loveNote: ['message'],
  reminder: ['description'],
  loveActivity: ['description'],
} as const;

export function createEncryptedPrisma(encryptionService: EncryptionService) {
  const prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

  // Apply model-level extensions for each model that needs encryption
  Object.entries(ENCRYPTION_CONFIG).forEach(([modelName, fields]) => {
    prisma.$extends({
      model: {
        [modelName]: {
          async create({ args, query }) {
            if (args.data) {
              args.data = encryptionService.encryptObject(args.data, [
                ...fields,
              ]);
            }
            const result = await query(args);
            return encryptionService.decryptObject(result, [...fields]);
          },
          async update({ args, query }) {
            if (args.data) {
              args.data = encryptionService.encryptObject(args.data, [
                ...fields,
              ]);
            }
            const result = await query(args);
            return encryptionService.decryptObject(result, [...fields]);
          },
          async findUnique({ args, query }) {
            const result = await query(args);
            return result
              ? encryptionService.decryptObject(result, [...fields])
              : result;
          },
          async findMany({ args, query }) {
            const results = await query(args);
            return Array.isArray(results)
              ? results.map((item) =>
                  encryptionService.decryptObject(item, [...fields]),
                )
              : results;
          },
        },
      },
    });
  });

  return prisma;
}
