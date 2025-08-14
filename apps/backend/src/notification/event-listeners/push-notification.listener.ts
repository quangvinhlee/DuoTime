import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/services/redis.service';

interface NotificationEvent {
  type: string;
  title: string;
  message: string;
  userId: string;
  metadata?: any;
  reminderId?: string;
  timestamp: string;
}

@Injectable()
export class PushNotificationListener {
  constructor(private readonly redisService: RedisService) {
    this.initializeListeners();
  }

  private initializeListeners() {
    // Listen to notification queued events
    void this.redisService.subscribe('notification-queued', (data) => {
      this.handleNotificationQueued(data).catch((error) => {
        console.error('Error handling notification queued:', error);
      });
    });

    // Listen to notification created events (from processor)
    void this.redisService.subscribe('notification-created', (data) => {
      this.handleNotificationCreated(data).catch((error) => {
        console.error('Error handling notification created:', error);
      });
    });
  }

  private async handleNotificationQueued(data: string) {
    try {
      const event: NotificationEvent = JSON.parse(data);
      console.log(
        '📱 Push notification listener: Notification queued for user',
        event.userId,
      );

      // You can add logic here to send immediate push notifications
      // or wait for the processor to create the notification
    } catch (error) {
      console.error('Error parsing notification queued event:', error);
    }
  }

  private async handleNotificationCreated(data: string) {
    try {
      const notification = JSON.parse(data);
      await this.sendPushNotification(notification);
    } catch (error) {
      console.error('Error handling notification created:', error);
    }
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

      // Send push notification
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
        sound: 'default',
        badge: 1,
      });

      console.log(`📱 Push notification sent to user ${notification.userId}`);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  private async getUserPushToken(userId: string) {
    // TODO: Implement after Prisma migration
    return {
      id: userId,
      pushToken: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]', // Mock token
    };
  }

  private async sendToExpoPushService(pushMessage: {
    to: string;
    title: string;
    body: string;
    data?: any;
    sound?: string;
    badge?: number;
  }) {
    // TODO: Implement Expo Push API call
    console.log('📱 Push notification would be sent:', pushMessage);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
