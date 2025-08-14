import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReminderResolver } from './reminder.resolver';
import { ReminderService } from './reminder.service';
import { ReminderProcessor } from './reminder.processor';
import { ReminderCacheService } from './reminder-cache.service';
import { NotificationModule } from '../notification/notification.module';
import { SharedServicesModule } from '../common/services/shared-services.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reminders',
    }),
    NotificationModule,
    SharedServicesModule,
  ],
  providers: [
    ReminderResolver,
    ReminderService,
    ReminderProcessor,
    ReminderCacheService,
  ],
  exports: [ReminderService],
})
export class ReminderModule {}
