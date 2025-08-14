import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.getEncryptionKey();
  }

  private getEncryptionKey(): string {
    const key = this.configService.get<string>('ENCRYPTION_KEY');

    if (!key) {
      throw new Error(
        '❌ ENCRYPTION_KEY environment variable is required. Please set it in your .env file.',
      );
    }

    if (key.length < 32) {
      throw new Error(
        '❌ ENCRYPTION_KEY must be at least 32 characters long for security.',
      );
    }

    return key;
  }

  encrypt(value: string): string {
    if (!value) return value;

    try {
      return CryptoJS.AES.encrypt(value, this.secretKey).toString();
    } catch {
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedValue: string): string {
    if (!encryptedValue) return encryptedValue;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      throw new Error('Failed to decrypt data');
    }
  }

  encryptObject<T extends Record<string, any>>(
    obj: T,
    fieldsToEncrypt: (keyof T)[],
  ): T {
    const encryptedObj = { ...obj };

    for (const field of fieldsToEncrypt) {
      const value = encryptedObj[field];
      if (value && typeof value === 'string') {
        encryptedObj[field] = this.encrypt(value) as T[keyof T];
      }
    }

    return encryptedObj;
  }

  decryptObject<T extends Record<string, any>>(
    obj: T,
    fieldsToDecrypt: (keyof T)[],
  ): T {
    const decryptedObj = { ...obj };

    for (const field of fieldsToDecrypt) {
      const value = decryptedObj[field];
      if (value && typeof value === 'string') {
        decryptedObj[field] = this.decrypt(value) as T[keyof T];
      }
    }

    return decryptedObj;
  }

  isEncrypted(value: string): boolean {
    if (!value) return false;

    try {
      this.decrypt(value);
      return true;
    } catch {
      return false;
    }
  }
}
