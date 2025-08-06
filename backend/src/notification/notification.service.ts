import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationJob } from './notification.processor';
import { RedisService } from '../common/services/redis.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  // Single unified notification method for ALL types
  async createNotification(
    type: NotificationType,
    title: string,
    message: string,
    userId: string,
    metadata?: Record<string, any>,
    reminderId?: string,
  ) {
    const jobData: NotificationJob = {
      type,
      title,
      message,
      userId,
      metadata,
      reminderId,
    };

    // Add job to queue for processing
    await this.notificationsQueue.add('generic', jobData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    // Publish event for other services to listen
    await this.redisService.publish(
      'notification-queued',
      JSON.stringify({
        type,
        title,
        message,
        userId,
        metadata,
        reminderId,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  // Query methods
  async getUserNotifications(userId: string, limit = 20, offset = 0) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });

    // Publish event for analytics
    await this.redisService.publish(
      'notification-read',
      JSON.stringify({
        notificationId,
        userId,
        timestamp: new Date().toISOString(),
      }),
    );

    return result;
  }

  async markAllNotificationsAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // Publish event for analytics
    await this.redisService.publish(
      'notifications-all-read',
      JSON.stringify({
        userId,
        count: result.count,
        timestamp: new Date().toISOString(),
      }),
    );

    return result;
  }

  async getUnreadNotificationCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });

    // Publish event for analytics
    await this.redisService.publish(
      'notification-deleted',
      JSON.stringify({
        notificationId,
        userId,
        timestamp: new Date().toISOString(),
      }),
    );

    return result;
  }
}
