import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  private readonly publisher: Redis;
  private readonly subscriber: Redis;

  constructor(private readonly configService: ConfigService) {
    // Main Redis client for general operations
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    // Dedicated publisher for publishing messages
    this.publisher = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    // Dedicated subscriber for subscribing to channels
    this.subscriber = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    // Handle connection events
    this.redis.on('connect', () => {
      console.log('🔌 Redis connected');
    });

    this.redis.on('error', (error) => {
      console.error('🔌 Redis error:', error);
    });

    this.publisher.on('connect', () => {
      console.log('🔌 Redis publisher connected');
    });

    this.subscriber.on('connect', () => {
      console.log('🔌 Redis subscriber connected');
    });
  }

  // General Redis operations
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.redis.exists(key);
  }

  // Pub/Sub operations
  async publish(channel: string, message: string): Promise<number> {
    return await this.publisher.publish(channel, message);
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        callback(message);
      }
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }

  // Pattern-based subscription
  async psubscribe(
    pattern: string,
    callback: (channel: string, message: string) => void,
  ): Promise<void> {
    await this.subscriber.psubscribe(pattern);
    this.subscriber.on('pmessage', (receivedPattern, channel, message) => {
      if (receivedPattern === pattern) {
        callback(channel, message);
      }
    });
  }

  async punsubscribe(pattern: string): Promise<void> {
    await this.subscriber.punsubscribe(pattern);
  }

  // Queue operations (for Bull)
  getRedisClient(): Redis {
    return this.redis;
  }

  // Cleanup
  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}
