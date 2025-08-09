import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { getEncryptionKey } from '../config/encryption.config';

@Injectable()
export class EncryptionService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = getEncryptionKey();
  }

  /**
   * Encrypts a string value
   * @param value - The string to encrypt
   * @returns Encrypted string
   */
  encrypt(value: string): string {
    if (!value) return value;

    try {
      return CryptoJS.AES.encrypt(value, this.secretKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts an encrypted string value
   * @param encryptedValue - The encrypted string to decrypt
   * @returns Decrypted string
   */
  decrypt(encryptedValue: string): string {
    if (!encryptedValue) return encryptedValue;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encrypts an object by encrypting specific fields
   * @param obj - The object to encrypt
   * @param fieldsToEncrypt - Array of field names to encrypt
   * @returns Object with specified fields encrypted
   */
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

  /**
   * Decrypts an object by decrypting specific fields
   * @param obj - The object to decrypt
   * @param fieldsToDecrypt - Array of field names to decrypt
   * @returns Object with specified fields decrypted
   */
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

  /**
   * Checks if a string is encrypted
   * @param value - The string to check
   * @returns True if the string appears to be encrypted
   */
  isEncrypted(value: string): boolean {
    if (!value) return false;

    try {
      // Try to decrypt - if it fails, it's probably not encrypted
      this.decrypt(value);
      return true;
    } catch {
      return false;
    }
  }
}
