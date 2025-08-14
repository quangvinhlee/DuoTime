import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { getEncryptionKey } from '../config/encryption.config';

@Injectable()
export class EncryptionService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = getEncryptionKey();
  }

  encrypt(value: string): string {
    if (!value) return value;

    try {
      return CryptoJS.AES.encrypt(value, this.secretKey).toString();
    } catch (error) {
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedValue: string): string {
    if (!encryptedValue) return encryptedValue;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
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
