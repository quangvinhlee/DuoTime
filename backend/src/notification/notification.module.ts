import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationProcessor } from './notification.processor';
import { PushNotificationService } from './push-notification.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSub } from 'graphql-subscriptions';
import { SharedServicesModule } from '../common/services/shared-services.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    PrismaModule,
    SharedServicesModule,
  ],
  providers: [
    NotificationResolver,
    NotificationService,
    NotificationProcessor,
    PushNotificationService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
