import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { ReminderTargetType } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';

export interface ReminderJob {
  reminderId: string;
}

@Injectable()
@Processor('reminders')
export class ReminderProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly logger: LoggerService,
  ) {}

  @Process('send-reminder')
  async handleSendReminder(job: Job<ReminderJob>) {
    const { reminderId } = job.data;

    try {
      await job.log('Starting reminder processing');

      // Get the reminder with user details
      const reminder = await this.prisma.reminder.findUnique({
        where: { id: reminderId },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              partnerId: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!reminder) {
        await job.log('Reminder not found');
        return;
      }

      await job.progress(25);
      await job.log('Reminder found, preparing notifications');

      const notificationTitle = `Reminder: ${reminder.title}`;
      const notificationMessage =
        reminder.description || `Time for: ${reminder.title}`;

      // Send notifications based on target type
      switch (reminder.targetType) {
        case ReminderTargetType.FOR_ME:
          await this.notificationService.createNotification(
            'REMINDER',
            notificationTitle,
            notificationMessage,
            reminder.createdById,
            { reminderId: reminder.id },
            reminder.id,
          );
          break;

        case ReminderTargetType.FOR_PARTNER:
          if (reminder.recipientId) {
            await this.notificationService.createNotification(
              'REMINDER',
              notificationTitle,
              notificationMessage,
              reminder.recipientId,
              { reminderId: reminder.id },
              reminder.id,
            );
          }
          break;

        case ReminderTargetType.FOR_BOTH:
          // Send to creator
          await this.notificationService.createNotification(
            'REMINDER',
            notificationTitle,
            notificationMessage,
            reminder.createdById,
            { reminderId: reminder.id },
            reminder.id,
          );

          // Send to partner using recipientId
          if (reminder.recipientId) {
            await this.notificationService.createNotification(
              'REMINDER',
              notificationTitle,
              notificationMessage,
              reminder.recipientId,
              { reminderId: reminder.id },
              reminder.id,
            );
          }
          break;
      }

      await job.progress(75);
      await job.log('Notifications sent successfully');

      await job.progress(100);
      await job.log('Reminder processing completed');

      // Log business event
      this.logger.logBusinessEvent('reminder_notification_sent', {
        reminderId: reminder.id,
        targetType: reminder.targetType,
        type: reminder.type,
      });
    } catch (error) {
      await job.log('Error processing reminder notification');
      console.error('Error processing reminder notification:', error);
      throw error;
    }
  }
}
