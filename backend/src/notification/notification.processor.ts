import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { RedisService } from '../common/services/redis.service';
import { PubSub } from 'graphql-subscriptions';

// Single generic notification job interface
export interface NotificationJob {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  metadata?: Record<string, any>;
  reminderId?: string;
}

@Injectable()
@Processor('notifications')
export class NotificationProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Process('generic')
  async handleGenericNotification(job: Job<NotificationJob>) {
    const { type, title, message, userId, metadata, reminderId } = job.data;

    try {
      await job.log('Starting notification processing');

      await job.progress(25);

      // Create notification in database
      const notification = await this.prisma.notification.create({
        data: {
          type,
          title,
          message,
          userId,
          reminderId,
        },
      });

      await job.progress(50);
      await job.log('Notification created in database');

      // Publish to Redis for real-time updates
      await this.redisService.publish(
        'notification-created',
        JSON.stringify({
          notificationId: notification.id,
          type,
          title,
          message,
          userId,
          metadata,
          reminderId,
        }),
      );

      await job.progress(75);
      await job.log('Published to Redis');

      // Publish to GraphQL subscription
      await this.pubSub.publish('notificationReceived', {
        notificationReceived: {
          id: notification.id,
          type,
          title,
          message,
          isRead: false,
          sentAt: notification.sentAt,
          userId,
          reminderId,
        },
      });

      await job.progress(100);
      await job.log('Published to GraphQL subscription');

      console.log(`🔔 Notification processed: ${type} for user ${userId}`);
    } catch (error) {
      await job.log('Error processing notification');
      console.error('Error processing notification:', error);
      throw error;
    }
  }
}
