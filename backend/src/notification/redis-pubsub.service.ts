import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisPubSubService implements OnModuleDestroy {
  private publisher: Redis;
  private subscriber: Redis;

  constructor(private configService: ConfigService) {
    // Initialize Redis connections using individual config
    this.publisher = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      password:
        this.configService.get<string>('REDIS_PASSWORD') || 'duotime2024',
    });

    this.subscriber = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      password:
        this.configService.get<string>('REDIS_PASSWORD') || 'duotime2024',
    });
  }

  async publish(channel: string, message: any): Promise<void> {
    try {
      await this.publisher.publish(channel, JSON.stringify(message));
      console.log(`[REDIS PUBLISH] ${channel}:`, message);
    } catch (error) {
      console.error('Error publishing to Redis:', error);
    }
  }

  async subscribe(
    channel: string,
    callback: (message: any) => void,
  ): Promise<void> {
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) {
          try {
            const parsedMessage = JSON.parse(message);
            callback(parsedMessage);
          } catch (error) {
            console.error('Error parsing Redis message:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error subscribing to Redis channel:', error);
    }
  }

  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel);
    } catch (error) {
      console.error('Error unsubscribing from Redis channel:', error);
    }
  }

  async onModuleDestroy() {
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}
