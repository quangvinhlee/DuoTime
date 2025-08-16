import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService, ENCRYPTION_CONFIG } from '../prisma/prisma.service';
import { EncryptionService } from '../common/services/encryption.service';
import { NotificationService } from '../notification/notification.service';
import {
  CreateReminderInput,
  UpdateReminderInput,
  GetRemindersInput,
} from './dtos/reminder.dto';
import { ReminderTargetType, ReminderStatus, Reminder } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ReminderCacheService } from './reminder-cache.service';

@Injectable()
export class ReminderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly logger: LoggerService,
    private readonly reminderCacheService: ReminderCacheService,
    private readonly encryptionService: EncryptionService,
    @InjectQueue('reminders') private readonly remindersQueue: Queue,
  ) {}

  async createReminder(
    createReminderInput: CreateReminderInput,
    userId: string,
  ) {
    const { targetType, recipientId, ...reminderData } = createReminderInput;

    // Validate target type and recipient
    await this.validateReminderTarget(targetType, recipientId, userId);

    // Encrypt sensitive fields before saving
    const encryptedData = this.encryptionService.encryptObject(
      {
        ...reminderData,
        targetType,
        createdById: userId,
        recipientId:
          targetType === ReminderTargetType.FOR_ME ? null : recipientId,
      },
      [...ENCRYPTION_CONFIG.reminder],
    );

    // Create the reminder
    const reminder = await this.prisma.reminder.create({
      data: encryptedData,
    });

    this.logger.logBusinessEvent('reminder_created', {
      reminderId: reminder.id,
      userId,
      targetType,
      type: reminder.type,
    });

    // Store reminder in Redis for real-time access
    await this.reminderCacheService.storeReminder(reminder);

    // Schedule the reminder notification
    await this.scheduleReminderNotification(reminder);

    // Decrypt sensitive fields before returning
    return this.encryptionService.decryptObject(reminder, [
      ...ENCRYPTION_CONFIG.reminder,
    ]);
  }

  async updateReminder(
    reminderId: string,
    updateReminderInput: UpdateReminderInput,
    userId: string,
  ) {
    // Check if reminder exists and user has permission
    const existingReminder = await this.prisma.reminder.findFirst({
      where: {
        id: reminderId,
        createdById: userId,
      },
    });

    if (!existingReminder) {
      throw new NotFoundException(
        'Reminder not found or you do not have permission to update it',
      );
    }

    const { targetType, recipientId, ...updateData } = updateReminderInput;

    // Validate target type if it's being updated
    if (targetType) {
      await this.validateReminderTarget(targetType, recipientId, userId);
    }

    // Encrypt sensitive fields before updating
    const encryptedData = this.encryptionService.encryptObject(
      {
        ...updateData,
        recipientId:
          targetType === ReminderTargetType.FOR_PARTNER ? recipientId : null,
      },
      [...ENCRYPTION_CONFIG.reminder],
    );

    const reminder = await this.prisma.reminder.update({
      where: { id: reminderId },
      data: encryptedData,
      // No need to include user objects since we have the IDs
    });

    this.logger.logBusinessEvent('reminder_updated', {
      reminderId: reminder.id,
      userId,
      targetType: reminder.targetType,
    });

    // Re-schedule the reminder notification if scheduledAt changed
    if (updateData.scheduledAt) {
      await this.scheduleReminderNotification(reminder);
    }

    // Decrypt sensitive fields before returning
    return this.encryptionService.decryptObject(reminder, [
      ...ENCRYPTION_CONFIG.reminder,
    ]);
  }

  async deleteReminder(reminderId: string, userId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: {
        id: reminderId,
        createdById: userId,
      },
    });

    if (!reminder) {
      throw new NotFoundException(
        'Reminder not found or you do not have permission to delete it',
      );
    }

    // Remove any pending jobs for this reminder
    await this.remindersQueue.removeJobs(reminderId);

    await this.prisma.reminder.delete({
      where: { id: reminderId },
    });

    this.logger.logBusinessEvent('reminder_deleted', {
      reminderId,
      userId,
      targetType: reminder.targetType,
    });

    return { success: true, message: 'Reminder deleted successfully' };
  }

  async getReminders(userId: string, input: GetRemindersInput) {
    const { limit, offset, targetType, type } = input;

    const where: any = {
      OR: [
        { createdById: userId },
        { recipientId: userId },
        {
          createdById: userId,
          targetType: ReminderTargetType.FOR_BOTH,
        },
      ],
    };

    if (targetType) {
      where.targetType = targetType;
    }

    if (type) {
      where.type = type;
    }

    const reminders = await this.prisma.reminder.findMany({
      where,
      // No need to include user objects since we have the IDs
      orderBy: { scheduledAt: 'asc' },
      take: limit,
      skip: offset,
    });

    // Decrypt sensitive fields for all reminders
    return reminders.map((reminder) =>
      this.encryptionService.decryptObject(reminder, [
        ...ENCRYPTION_CONFIG.reminder,
      ]),
    );
  }

  async getReminder(reminderId: string, userId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: {
        id: reminderId,
        OR: [
          { createdById: userId },
          { recipientId: userId },
          {
            createdById: userId,
            targetType: ReminderTargetType.FOR_BOTH,
          },
        ],
      },
      // No need to include user objects since we have the IDs
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    // Decrypt sensitive fields before returning
    return this.encryptionService.decryptObject(reminder, [
      ...ENCRYPTION_CONFIG.reminder,
    ]);
  }

  async markReminderAsCompleted(reminderId: string, userId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: {
        id: reminderId,
        OR: [
          { createdById: userId },
          { recipientId: userId },
          {
            createdById: userId,
            targetType: ReminderTargetType.FOR_BOTH,
          },
        ],
      },
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    const updatedReminder = await this.prisma.reminder.update({
      where: { id: reminderId },
      data: { status: ReminderStatus.COMPLETED },
      // No need to include user objects since we have the IDs
    });

    this.logger.logBusinessEvent('reminder_completed', {
      reminderId,
      userId,
      targetType: reminder.targetType,
    });

    return updatedReminder;
  }

  private async validateReminderTarget(
    targetType: ReminderTargetType,
    recipientId: string | undefined,
    userId: string,
  ) {
    if (
      targetType === ReminderTargetType.FOR_PARTNER ||
      targetType === ReminderTargetType.FOR_BOTH
    ) {
      if (!recipientId) {
        throw new BadRequestException(
          'Recipient ID is required when target type is FOR_PARTNER or FOR_BOTH',
        );
      }

      // Check if recipient exists and is the user's partner
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { partner: true },
      });

      if (!user?.partner || user.partner.id !== recipientId) {
        throw new BadRequestException('Recipient must be your partner');
      }
    }
  }

  private async scheduleReminderNotification(reminder: any) {
    const scheduledAt = new Date(reminder.scheduledAt);
    const delay = scheduledAt.getTime() - Date.now();

    if (delay > 0) {
      // Schedule for future - this is the proper alarm behavior
      await this.remindersQueue.add(
        'send-reminder',
        { reminderId: reminder.id },
        {
          delay,
          jobId: reminder.id, // Use reminder ID as job ID for easy removal
        },
      );

      this.logger.logBusinessEvent('reminder_scheduled', {
        reminderId: reminder.id,
        scheduledAt: reminder.scheduledAt,
        delay,
      });
    } else {
      // If the time has already passed, log but don't send immediately
      // This prevents immediate notifications for past times
      this.logger.logBusinessEvent('reminder_past_time_ignored', {
        reminderId: reminder.id,
        scheduledAt: reminder.scheduledAt,
        delay,
        message:
          'Reminder scheduled for past time - no notification will be sent',
      });
    }

    // If it's a recurring reminder, also schedule the next occurrence
    if (reminder.isRecurring && reminder.recurringPattern) {
      await this.scheduleNextRecurringReminder(reminder);
    }
  }

  private async scheduleNextRecurringReminder(reminder: any) {
    const nextScheduledAt = this.calculateNextRecurrence(
      reminder.scheduledAt,
      reminder.recurringPattern,
    );

    if (nextScheduledAt) {
      // Create next recurring reminder
      const nextReminder = await this.prisma.reminder.create({
        data: {
          title: reminder.title,
          description: reminder.description,
          scheduledAt: nextScheduledAt,
          type: reminder.type,
          isRecurring: reminder.isRecurring,
          recurringPattern: reminder.recurringPattern,
          targetType: reminder.targetType,
          createdById: reminder.createdById,
          recipientId: reminder.recipientId,
        },
        // No need to include user objects since we have the IDs
      });

      // Schedule the next reminder
      const delay = nextScheduledAt.getTime() - Date.now();
      if (delay > 0) {
        await this.remindersQueue.add(
          'send-reminder',
          { reminderId: nextReminder.id },
          {
            delay,
            jobId: nextReminder.id,
          },
        );
      }

      this.logger.logBusinessEvent('recurring_reminder_created', {
        originalReminderId: reminder.id,
        nextReminderId: nextReminder.id,
        pattern: reminder.recurringPattern,
        nextScheduledAt,
      });
    }
  }

  private calculateNextRecurrence(
    currentDate: Date,
    pattern: string,
  ): Date | null {
    const date = new Date(currentDate);

    switch (pattern.toLowerCase()) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        return date;

      case 'weekly':
        date.setDate(date.getDate() + 7);
        return date;

      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        return date;

      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        return date;

      default:
        return null;
    }
  }
}
