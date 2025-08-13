import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/services/redis.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {
    this.initializePushNotifications();
  }

  private initializePushNotifications() {
    this.redisService.subscribe('notification-created', (data) => {
      void this.sendPushNotification(JSON.parse(String(data)));
    });
  }

  private async sendPushNotification(notification: {
    notificationId: string;
    type: string;
    title: string;
    message: string;
    userId: string;
    metadata?: Record<string, unknown>;
    reminderId?: string;
  }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: notification.userId },
        select: { pushToken: true },
      });

      if (!user?.pushToken) return;

      const isReminder = notification.type === 'REMINDER';

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.pushToken,
          title: notification.title,
          body: notification.message,
          data: {
            notificationId: notification.notificationId,
            type: notification.type,
            metadata: notification.metadata || {},
            reminderId: notification.reminderId,
          },
          sound: 'default',
          badge: 1,
          priority: isReminder ? 'high' : 'normal',
          ...(isReminder && { channelId: 'reminders' }),
        }),
      });
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }
}
