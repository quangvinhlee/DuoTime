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

    await this.notificationsQueue.add('generic', jobData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }

  async getUserNotifications(userId: string, limit = 20, offset = 0) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadNotificationCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }
}
