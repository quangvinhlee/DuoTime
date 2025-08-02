import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttleConfig: ThrottlerModuleOptions = [
  {
    name: 'short',
    ttl: 60000, // 1 minute
    limit: 100, // 100 requests per minute (reasonable for production)
  },
  {
    name: 'medium',
    ttl: 600000, // 10 minutes
    limit: 500, // 500 requests per 10 minutes
  },
  {
    name: 'long',
    ttl: 3600000, // 1 hour
    limit: 2000, // 2000 requests per hour
  },
];
