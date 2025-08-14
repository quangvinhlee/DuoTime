# 🔐 Encryption System Setup

This document explains how to set up and use the encryption system in DuoTime.

## 🚀 Quick Setup

### 1. Environment Variables

**REQUIRED:** Add this to your `.env` file:

```env
# Generate a secure 32+ character key - THIS IS REQUIRED!
ENCRYPTION_KEY=your-super-secure-32-character-key-here
```

**⚠️ IMPORTANT:** The application will NOT start without this key set!

### 2. Generate a Secure Key

For production, generate a secure key:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator (for development only)
# https://generate-secret.vercel.app/32
```

## 📋 Currently Encrypted Fields

The following fields are automatically encrypted/decrypted:

| Model             | Field             | Description              |
| ----------------- | ----------------- | ------------------------ |
| `User`            | `googleId`        | Google OAuth ID          |
| `User`            | `email`           | User email address       |
| `User`            | `pushToken`       | Push notification tokens |
| `LoveNote`        | `message`         | Personal love messages   |
| `Reminder`        | `description`     | Private reminder details |
| `UserPreferences` | `preferredColors` | User customization data  |
| `LoveActivity`    | `description`     | Activity descriptions    |

## 🔧 How It Works

### Automatic Encryption (Recommended)

The Prisma middleware automatically handles encryption/decryption:

```typescript
// This will automatically encrypt the message field
const note = await prisma.loveNote.create({
  data: {
    message: 'I love you so much! ❤️',
    senderId: 'user-id',
    recipientId: 'partner-id',
  },
});

// This will automatically decrypt the message field
const notes = await prisma.loveNote.findMany({
  where: { recipientId: 'user-id' },
});
// notes[0].message will be decrypted automatically
```

### Manual Encryption

For cases where you need manual control:

```typescript
import { EncryptionUtils } from '../common/utils/encryption.utils';

// Inject the service
constructor(private readonly encryptionUtils: EncryptionUtils) {}

// Encrypt a single string
const encrypted = this.encryptionUtils.encrypt("sensitive data");
const decrypted = this.encryptionUtils.decrypt(encrypted);

// Encrypt specific fields in an object
const userData = {
  name: "John",
  pushToken: "device-token-123"
};

const encryptedData = this.encryptionUtils.encryptObject(userData, ['pushToken']);
const decryptedData = this.encryptionUtils.decryptObject(encryptedData, ['pushToken']);
```

## 🛡️ Security Best Practices

### ✅ Do's

- Use a strong 32+ character encryption key
- Store the key in environment variables
- Rotate keys periodically in production
- Only encrypt truly sensitive data
- Test encryption/decryption thoroughly

### ❌ Don'ts

- Don't commit encryption keys to version control
- Don't use the default key in production
- Don't encrypt fields that need to be searchable
- Don't encrypt system-generated data (IDs, timestamps)
- Don't forget to backup encrypted data

## 🔄 Adding New Encrypted Fields

To add encryption to new fields:

1. **Update the configuration:**

```typescript
// src/common/config/encryption.config.ts
export const encryptionConfig = {
  encryptedFields: {
    // ... existing fields
    NewModel: ['sensitiveField'],
  },
  // ... rest of config
};
```

1. **Update Prisma middleware:**

```typescript
// src/prisma/prisma.service.ts
const encryptionConfig = {
  // ... existing config
  NewModel: ['sensitiveField'],
};
```

1. **Create a migration if needed:**

```bash
npx prisma migrate dev --name add_sensitive_field
```

## 🧪 Testing

### Test Encryption/Decryption

```typescript
import { EncryptionUtils } from '../common/utils/encryption.utils';

// Inject the service
constructor(private readonly encryptionUtils: EncryptionUtils) {}

const original = "test message";
const encrypted = this.encryptionUtils.encrypt(original);
const decrypted = this.encryptionUtils.decrypt(encrypted);

console.log(original === decrypted); // Should be true
```

### Test Database Operations

```typescript
// Test that data is encrypted in database
const note = await prisma.loveNote.create({
  data: { message: 'secret message' },
});

// Check raw database (should be encrypted)
const rawNote = await prisma.$queryRaw`
  SELECT message FROM "LoveNote" WHERE id = ${note.id}
`;
console.log(rawNote[0].message); // Should be encrypted

// Check through Prisma (should be decrypted)
const retrievedNote = await prisma.loveNote.findUnique({
  where: { id: note.id },
});
console.log(retrievedNote.message); // Should be "secret message"
```

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to decrypt data" error**
   - Check if the encryption key is correct
   - Verify the data was encrypted with the same key

2. **Performance issues**
   - Only encrypt necessary fields
   - Consider caching for frequently accessed data

3. **Migration issues**
   - Backup data before running migrations
   - Test migrations on staging first

### Debug Mode

Enable debug logging:

```typescript
// Add to your service
console.log('Encrypting:', field, value);
console.log('Decrypting:', field, encryptedValue);
```

## 📚 Additional Resources

- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/authentication)
- [Prisma Middleware Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/middleware)
