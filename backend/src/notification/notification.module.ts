import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationProcessor } from './notification.processor';
import { RedisModule } from '../common/services/redis.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    PrismaModule,
    RedisModule,
  ],
  providers: [
    NotificationResolver,
    NotificationService,
    NotificationProcessor,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
