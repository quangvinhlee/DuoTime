# Logging Implementation Guide for DuoTime Backend

## Overview

Your NestJS backend now has a comprehensive Pino-based logging system that integrates seamlessly with Fastify and GraphQL.

## Features Implemented

### 1. **Logger Configuration** (`src/common/config/logger.config.ts`)

- Custom Pino configuration for Fastify compatibility
- Pretty printing in development
- Structured JSON logs in production
- Request/response serializers that exclude sensitive data
- Custom log levels based on HTTP status codes

### 2. **Custom Logger Service** (`src/common/services/logger.service.ts`)

- Extends PinoLogger with business-specific methods
- Pre-built methods for:
  - Authentication events
  - Database operations
  - GraphQL operations
  - External API calls
  - Performance metrics
  - Security events

### 3. **GraphQL Logging Interceptor** (`src/common/interceptors/graphql-logging.interceptor.ts`)

- Automatically logs all GraphQL operations
- Captures operation type, name, duration, and user context
- Handles both successful operations and errors

### 4. **Enhanced Prisma Service** (`src/prisma/prisma.service.ts`)

- Database connection/disconnection logging
- Helper method for logging database operations
- Error tracking for database queries

## Usage Examples

### Basic Logging in Services

```typescript
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class MyService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('MyService');
  }

  async someMethod() {
    this.logger.info('Processing started');

    try {
      // Your business logic
      this.logger.logBusinessEvent('user_action', { action: 'update_profile' });
    } catch (error) {
      this.logger.error('Processing failed', error.message);
      throw error;
    }
  }
}
```

### Database Operation Logging

```typescript
// Using the loggedQuery helper
const user = await this.prisma.loggedQuery('findUnique', 'User', () =>
  this.prisma.user.findUnique({ where: { id: userId } }),
);

// Or manual logging
const startTime = Date.now();
try {
  const result = await this.prisma.user.create({ data: userData });
  this.logger.logDatabaseOperation('create', 'User', Date.now() - startTime);
  return result;
} catch (error) {
  this.logger.logDatabaseError('create', 'User', error);
  throw error;
}
```

### Authentication Logging (already implemented in AuthService)

```typescript
// Success
this.logger.logAuthSuccess(user.id, 'google', { newUser: false });

// Failure
this.logger.logAuthFailure('google', 'Invalid token', { attempt: 1 });
```

### External API Call Logging

```typescript
const startTime = Date.now();
try {
  const response = await fetch('https://api.example.com/data');
  this.logger.logExternalApiCall(
    'ExampleAPI',
    '/data',
    'GET',
    Date.now() - startTime,
    response.status,
  );
} catch (error) {
  this.logger.logExternalApiError('ExampleAPI', '/data', 'GET', error);
}
```

### Security Event Logging

```typescript
this.logger.logSecurityEvent('unauthorized_access_attempt', 'high', {
  ip: request.ip,
  userAgent: request.headers['user-agent'],
});
```

## Log Levels

- **debug**: Development queries, detailed operations
- **info**: General application flow, successful operations
- **warn**: Warning conditions, 4xx HTTP responses
- **error**: Error conditions, 5xx HTTP responses, exceptions

## Environment Variables

Add these to your `.env` file:

```env
NODE_ENV=development  # or production
LOG_LEVEL=debug       # optional, defaults based on NODE_ENV
```

## Log Output Examples

### Development (Pretty Print)

```text
[10:30:45.123] INFO (AuthService): Authentication successful for user 123 via google
    event: "auth_success"
    userId: "123"
    method: "google"
    newUser: false
    duration: 245

[10:30:45.456] DEBUG (PrismaService): Database findUnique on User completed in 12ms
```

### Production (JSON)

```json
{
  "level": 30,
  "time": 1643723445123,
  "context": "AuthService",
  "event": "auth_success",
  "userId": "123",
  "method": "google",
  "newUser": false,
  "duration": 245,
  "msg": "Authentication successful for user 123 via google"
}
```

## Best Practices

1. **Always set context** in your services:

   ```typescript
   constructor(private readonly logger: LoggerService) {
     this.logger.setContext('YourServiceName');
   }
   ```

2. **Use structured logging** with meaningful data:

   ```typescript
   this.logger.info({ userId, action, result }, 'User action completed');
   ```

3. **Log at appropriate levels**:
   - Use `debug` for detailed development info
   - Use `info` for normal operations
   - Use `warn` for concerning but non-critical issues
   - Use `error` for actual errors

4. **Don't log sensitive data**:
   - Passwords, tokens, personal data should be marked as `[REDACTED]`

5. **Include timing for performance monitoring**:

   ```typescript
   const startTime = Date.now();
   // ... operation
   this.logger.logPerformanceMetric(
     'operation_duration',
     Date.now() - startTime,
     'ms',
   );
   ```

## Log Aggregation

In production, you can send logs to services like:

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Datadog**
- **New Relic**
- **CloudWatch** (AWS)
- **Google Cloud Logging**

Simply configure Pino transports to send JSON logs to these services.
