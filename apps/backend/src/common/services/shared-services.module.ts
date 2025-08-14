import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ConfigModule } from '@nestjs/config';
import { EncryptionService } from './encryption.service';
import { LoggerService } from './logger.service';
import { RedisService } from './redis.service';
import { EncryptionUtils } from '../utils/encryption.utils';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    EncryptionService,
    LoggerService,
    RedisService,
    EncryptionUtils,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [
    EncryptionService,
    LoggerService,
    RedisService,
    EncryptionUtils,
    'PUB_SUB',
  ],
})
export class SharedServicesModule {}
