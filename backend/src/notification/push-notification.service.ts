import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/services/redis.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {
    void this.initializePushNotifications();
  }

  private initializePushNotifications() {
    // Listen to notification events
    this.redisService.subscribe('notification-created', (data) => {
      void (async () => {
        try {
          const notification = JSON.parse(String(data));
          await this.sendPushNotification(notification);
        } catch (error) {
          console.error('Error processing push notification:', error);
        }
      })();
    });
  }

  private async sendPushNotification(notification: {
    notificationId: string;
    type: string;
    title: string;
    message: string;
    userId: string;
    metadata?: any;
    reminderId?: string;
  }) {
    try {
      // Get user's push token from database
      const user = await this.getUserPushToken(notification.userId);

      if (!user?.pushToken) {
        console.log(`No push token for user ${notification.userId}`);
        return;
      }

      console.log(
        `📱 Processing push notification for user ${notification.userId}`,
      );
      console.log(
        `📱 Token: ${user.pushToken ? user.pushToken.substring(0, 30) + '...' : 'null'}`,
      );

      // Configure push notification based on type
      const isReminderNotification = notification.type === 'REMINDER';

      await this.sendToExpoPushService({
        to: user.pushToken,
        title: notification.title,
        body: notification.message,
        data: {
          notificationId: notification.notificationId,
          type: notification.type,
          metadata: notification.metadata,
          reminderId: notification.reminderId,
        },
        // Make reminder notifications high-priority like alarms
        sound: isReminderNotification ? 'default' : 'default',
        badge: 1,
        priority: isReminderNotification ? 'high' : 'normal',
        // Make reminder notifications show as alerts that require action
        ...(isReminderNotification && {
          channelId: 'reminders',
          categoryId: 'reminder',
          // Use system notification sound
          sound: 'default',
        }),
      });

      console.log(`📱 Push notification sent to user ${notification.userId}`);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  private async getUserPushToken(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, pushToken: true },
    });
  }

  private async sendToExpoPushService(pushMessage: {
    to: string;
    title: string;
    body: string;
    data?: any;
    sound?: string;
    badge?: number;
    priority?: string;
    channelId?: string;
    categoryId?: string;
  }) {
    try {
      // Send to Expo Push API
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(pushMessage),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('📱 Push notification sent successfully:', result);
      } else {
        console.error('📱 Push notification failed:', result);
      }
    } catch (error) {
      console.error('📱 Error sending push notification:', error);
    }
  }
}
