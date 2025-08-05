import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationProcessor } from './notification.processor';
import { RedisPubSubService } from './redis-pubsub.service';
import { PrismaModule } from '../prisma/prisma.module';

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
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
