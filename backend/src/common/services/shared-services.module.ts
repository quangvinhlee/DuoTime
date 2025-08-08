import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptionService } from './encryption.service';
import { LoggerService } from './logger.service';
import { RedisService } from './redis.service';
import { EncryptionUtils } from '../utils/encryption.utils';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [EncryptionService, LoggerService, RedisService, EncryptionUtils],
  exports: [EncryptionService, LoggerService, RedisService, EncryptionUtils],
})
export class SharedServicesModule {}
