import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt user sensitive data', () => {
      const testData = {
        googleId: '123456789012345678901',
        email: 'test@example.com',
        pushToken: 'device-token-123456789',
      };

      // Test individual field encryption
      const encryptedGoogleId = service.encrypt(testData.googleId);
      const encryptedEmail = service.encrypt(testData.email);
      const encryptedPushToken = service.encrypt(testData.pushToken);

      expect(encryptedGoogleId).not.toBe(testData.googleId);
      expect(encryptedEmail).not.toBe(testData.email);
      expect(encryptedPushToken).not.toBe(testData.pushToken);

      // Test decryption
      expect(service.decrypt(encryptedGoogleId)).toBe(testData.googleId);
      expect(service.decrypt(encryptedEmail)).toBe(testData.email);
      expect(service.decrypt(encryptedPushToken)).toBe(testData.pushToken);
    });

    it('should encrypt and decrypt object fields', () => {
      const userData = {
        id: 'user-123',
        googleId: '123456789012345678901',
        email: 'test@example.com',
        pushToken: 'device-token-123456789',
        name: 'Test User',
      };

      const fieldsToEncrypt = ['googleId', 'email', 'pushToken'] as const;

      const encryptedData = service.encryptObject(userData, fieldsToEncrypt);

      // Check that sensitive fields are encrypted
      expect(encryptedData.googleId).not.toBe(userData.googleId);
      expect(encryptedData.email).not.toBe(userData.email);
      expect(encryptedData.pushToken).not.toBe(userData.pushToken);

      // Check that non-sensitive fields are not encrypted
      expect(encryptedData.id).toBe(userData.id);
      expect(encryptedData.name).toBe(userData.name);

      // Test decryption
      const decryptedData = service.decryptObject(
        encryptedData,
        fieldsToEncrypt,
      );

      expect(decryptedData.googleId).toBe(userData.googleId);
      expect(decryptedData.email).toBe(userData.email);
      expect(decryptedData.pushToken).toBe(userData.pushToken);
    });

    it('should handle null and empty values', () => {
      expect(service.encrypt('')).toBe('');
      expect(service.encrypt(null as any)).toBe(null);
      expect(service.decrypt('')).toBe('');
      expect(service.decrypt(null as any)).toBe(null);
    });

    it('should detect encrypted strings', () => {
      const original = 'sensitive data';
      const encrypted = service.encrypt(original);

      expect(service.isEncrypted(encrypted)).toBe(true);
      expect(service.isEncrypted(original)).toBe(false);
      expect(service.isEncrypted('')).toBe(false);
    });
  });
});
