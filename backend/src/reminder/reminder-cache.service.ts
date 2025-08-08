import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/services/redis.service';
import { LoggerService } from '../common/services/logger.service';
import { Reminder } from '@prisma/client';

@Injectable()
export class ReminderCacheService {
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async storeReminder(reminder: Reminder): Promise<void> {
    try {
      const reminderKey = `reminder:${reminder.id}`;

      await this.redisService.set(
        reminderKey,
        JSON.stringify(this.serializeReminder(reminder)),
        86400, // 24 hours TTL
      );

      await this.addToUserReminders(reminder.createdById, reminder.id);

      if (reminder.recipientId) {
        await this.addToUserReminders(reminder.recipientId, reminder.id);
      }

      await this.publishReminderEvent('reminder-created', reminder);

      this.logger.logBusinessEvent('reminder_stored_in_redis', {
        reminderId: reminder.id,
        userId: reminder.createdById,
      });
    } catch (error) {
      this.logger.logBusinessEvent('reminder_redis_error', {
        reminderId: reminder.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async updateReminder(reminder: Reminder): Promise<void> {
    try {
      const reminderKey = `reminder:${reminder.id}`;

      // Update the reminder data
      await this.redisService.set(
        reminderKey,
        JSON.stringify(this.serializeReminder(reminder)),
        86400,
      );

      // Publish update event
      await this.publishReminderEvent('reminder-updated', reminder);

      this.logger.logBusinessEvent('reminder_updated_in_redis', {
        reminderId: reminder.id,
        userId: reminder.createdById,
      });
    } catch (error) {
      this.logger.logBusinessEvent('reminder_redis_update_error', {
        reminderId: reminder.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async deleteReminder(reminderId: string, userId: string): Promise<void> {
    try {
      const reminderKey = `reminder:${reminderId}`;

      // Delete reminder data
      await this.redisService.del(reminderKey);

      // Remove from user's reminder list
      await this.removeFromUserReminders(userId, reminderId);

      // Publish delete event
      await this.redisService.publish(
        'reminder-deleted',
        JSON.stringify({
          reminderId,
          userId,
          timestamp: new Date().toISOString(),
        }),
      );

      this.logger.logBusinessEvent('reminder_deleted_from_redis', {
        reminderId,
        userId,
      });
    } catch (error) {
      this.logger.logBusinessEvent('reminder_redis_delete_error', {
        reminderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async getReminder(reminderId: string): Promise<Reminder | null> {
    try {
      const reminderKey = `reminder:${reminderId}`;
      const reminderData = await this.redisService.get(reminderKey);

      if (reminderData) {
        return JSON.parse(reminderData) as Reminder;
      }

      return null;
    } catch (error) {
      this.logger.logBusinessEvent('reminder_redis_get_error', {
        reminderId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  async getUserReminders(userId: string): Promise<string[]> {
    try {
      const userRemindersKey = `user:${userId}:reminders`;
      const remindersData = await this.redisService.get(userRemindersKey);

      if (remindersData) {
        return JSON.parse(remindersData) as string[];
      }

      return [];
    } catch (error) {
      this.logger.logBusinessEvent('user_reminders_redis_get_error', {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  private serializeReminder(reminder: Reminder): Record<string, any> {
    return {
      id: reminder.id,
      title: reminder.title,
      description: reminder.description,
      scheduledAt: reminder.scheduledAt,
      type: reminder.type,
      status: reminder.status,
      isRecurring: reminder.isRecurring,
      recurringPattern: reminder.recurringPattern,
      targetType: reminder.targetType,
      createdById: reminder.createdById,
      recipientId: reminder.recipientId,
      createdAt: reminder.createdAt,
      updatedAt: reminder.updatedAt,
    };
  }

  private async addToUserReminders(
    userId: string,
    reminderId: string,
  ): Promise<void> {
    const userRemindersKey = `user:${userId}:reminders`;
    const existingReminders = await this.getUserReminders(userId);

    if (!existingReminders.includes(reminderId)) {
      existingReminders.push(reminderId);
      await this.redisService.set(
        userRemindersKey,
        JSON.stringify(existingReminders),
        86400,
      );
    }
  }

  private async removeFromUserReminders(
    userId: string,
    reminderId: string,
  ): Promise<void> {
    const userRemindersKey = `user:${userId}:reminders`;
    const existingReminders = await this.getUserReminders(userId);

    const updatedReminders = existingReminders.filter(
      (id) => id !== reminderId,
    );
    await this.redisService.set(
      userRemindersKey,
      JSON.stringify(updatedReminders),
      86400,
    );
  }

  private async publishReminderEvent(
    eventType: string,
    reminder: Reminder,
  ): Promise<void> {
    await this.redisService.publish(
      eventType,
      JSON.stringify({
        reminderId: reminder.id,
        userId: reminder.createdById,
        targetType: reminder.targetType,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
