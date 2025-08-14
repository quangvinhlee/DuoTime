import { Throttle as NestThrottle, SkipThrottle } from '@nestjs/throttler';

// Pre-defined throttle decorators for common use cases
export const AuthThrottle = () =>
  NestThrottle({ default: { limit: 20, ttl: 60000 } }); // 20 requests per minute for auth

export const QueryThrottle = () =>
  NestThrottle({ default: { limit: 30, ttl: 60000 } }); // 30 requests per minute for queries

export const MutationThrottle = () =>
  NestThrottle({ default: { limit: 10, ttl: 60000 } }); // 10 requests per minute for mutations

export const SensitiveMutationThrottle = () =>
  NestThrottle({ default: { limit: 5, ttl: 300000 } }); // 5 requests per 5 minutes for sensitive operations

export const NoThrottle = () => SkipThrottle(); // Skip throttling entirely
