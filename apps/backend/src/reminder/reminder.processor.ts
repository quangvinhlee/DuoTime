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
      const reminder = await this.prisma.reminder.findUnique({
        where: { id: reminderId },
        include: {
          createdBy: { select: { id: true, name: true } },
          recipient: { select: { id: true, name: true } },
        },
      });

      if (!reminder) return;

      const title = `Reminder: ${reminder.title}`;
      const message = reminder.description || `Time for: ${reminder.title}`;

      switch (reminder.targetType) {
        case ReminderTargetType.FOR_ME:
          await this.notificationService.createNotification(
            'REMINDER',
            title,
            message,
            reminder.createdById,
            { reminderId: reminder.id },
            reminder.id,
          );
          break;

        case ReminderTargetType.FOR_PARTNER:
          if (reminder.recipientId) {
            await this.notificationService.createNotification(
              'REMINDER',
              title,
              message,
              reminder.recipientId,
              { reminderId: reminder.id },
              reminder.id,
            );
          }
          break;

        case ReminderTargetType.FOR_BOTH:
          await this.notificationService.createNotification(
            'REMINDER',
            title,
            message,
            reminder.createdById,
            { reminderId: reminder.id },
            reminder.id,
          );
          if (reminder.recipientId) {
            await this.notificationService.createNotification(
              'REMINDER',
              title,
              message,
              reminder.recipientId,
              { reminderId: reminder.id },
              reminder.id,
            );
          }
          break;
      }

      this.logger.logBusinessEvent('reminder_notification_sent', {
        reminderId: reminder.id,
        targetType: reminder.targetType,
      });
    } catch (error) {
      console.error('Error processing reminder notification:', error);
      throw error;
    }
  }
}
