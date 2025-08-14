export const encryptionConfig = {
  // Fields that will be automatically encrypted/decrypted by Prisma middleware
  encryptedFields: {
    User: ['email', 'pushToken'],
    LoveNote: ['message'],
    Reminder: ['description'],
    UserPreferences: ['preferredColors'],
    LoveActivity: ['description'],
  },

  // Environment variable name for the encryption key
  keyName: 'ENCRYPTION_KEY',

  // Algorithm used for encryption
  algorithm: 'aes-256-gcm',
} as const;

/**
 * Get the encryption key from environment variables
 * @returns The encryption key
 * @throws Error if ENCRYPTION_KEY is not set
 */
export function getEncryptionKey(): string {
  const key = process.env[encryptionConfig.keyName];

  if (!key) {
    throw new Error(
      `❌ ${encryptionConfig.keyName} environment variable is required. Please set it in your .env file.`,
    );
  }

  if (key.length < 32) {
    throw new Error(
      `❌ ${encryptionConfig.keyName} must be at least 32 characters long for security.`,
    );
  }

  return key;
}

/**
 * Validate that the encryption key is properly set
 * @returns True if the key is properly configured
 */
export function validateEncryptionKey(): boolean {
  try {
    getEncryptionKey();
    return true;
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'Encryption key validation failed',
    );
    return false;
  }
}
