import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class EncryptionUtils {
  constructor(private readonly encryptionService: EncryptionService) {}

  encrypt(value: string): string {
    return this.encryptionService.encrypt(value);
  }

  decrypt(encryptedValue: string): string {
    return this.encryptionService.decrypt(encryptedValue);
  }

  isEncrypted(value: string): boolean {
    return this.encryptionService.isEncrypted(value);
  }

  encryptObject<T extends Record<string, any>>(
    obj: T,
    fieldsToEncrypt: (keyof T)[],
  ): T {
    return this.encryptionService.encryptObject(obj, fieldsToEncrypt);
  }

  decryptObject<T extends Record<string, any>>(
    obj: T,
    fieldsToDecrypt: (keyof T)[],
  ): T {
    return this.encryptionService.decryptObject(obj, fieldsToDecrypt);
  }
}
