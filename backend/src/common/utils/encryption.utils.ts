import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class EncryptionUtils {
  constructor(private readonly encryptionService: EncryptionService) {}

  /**
   * Utility function to encrypt a string
   * @param value - The string to encrypt
   * @returns Encrypted string
   */
  encrypt(value: string): string {
    return this.encryptionService.encrypt(value);
  }

  /**
   * Utility function to decrypt a string
   * @param encryptedValue - The encrypted string to decrypt
   * @returns Decrypted string
   */
  decrypt(encryptedValue: string): string {
    return this.encryptionService.decrypt(encryptedValue);
  }

  /**
   * Utility function to check if a string is encrypted
   * @param value - The string to check
   * @returns True if the string appears to be encrypted
   */
  isEncrypted(value: string): boolean {
    return this.encryptionService.isEncrypted(value);
  }

  /**
   * Utility function to encrypt specific fields in an object
   * @param obj - The object to encrypt
   * @param fieldsToEncrypt - Array of field names to encrypt
   * @returns Object with specified fields encrypted
   */
  encryptObject<T extends Record<string, any>>(
    obj: T,
    fieldsToEncrypt: (keyof T)[],
  ): T {
    return this.encryptionService.encryptObject(obj, fieldsToEncrypt);
  }

  /**
   * Utility function to decrypt specific fields in an object
   * @param obj - The object to decrypt
   * @param fieldsToDecrypt - Array of field names to decrypt
   * @returns Object with specified fields decrypted
   */
  decryptObject<T extends Record<string, any>>(
    obj: T,
    fieldsToDecrypt: (keyof T)[],
  ): T {
    return this.encryptionService.decryptObject(obj, fieldsToDecrypt);
  }
}
