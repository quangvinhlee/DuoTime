import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationProcessor } from './notification.processor';
import { RedisPubSubService } from './redis-pubsub.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    PrismaModule,
  ],
  providers: [
    NotificationResolver,
    NotificationService,
    NotificationProcessor,
    RedisPubSubService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
