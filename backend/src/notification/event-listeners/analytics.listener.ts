import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/services/redis.service';

@Injectable()
export class AnalyticsListener {
  constructor(private readonly redisService: RedisService) {
    this.initializeListeners();
  }

  private initializeListeners() {
    // Listen to notification queued events
    void this.redisService.subscribe('notification-queued', (data) => {
      this.handleNotificationQueued(data).catch((error) => {
        console.error(
          'Error handling analytics for notification queued:',
          error,
        );
      });
    });

    // Listen to notification read events
    void this.redisService.subscribe('notification-read', (data) => {
      this.handleNotificationRead(data).catch((error) => {
        console.error('Error handling analytics for notification read:', error);
      });
    });

    // Listen to all notifications read events
    void this.redisService.subscribe('notifications-all-read', (data) => {
      this.handleAllNotificationsRead(data).catch((error) => {
        console.error(
          'Error handling analytics for all notifications read:',
          error,
        );
      });
    });

    // Listen to notification deleted events
    void this.redisService.subscribe('notification-deleted', (data) => {
      this.handleNotificationDeleted(data).catch((error) => {
        console.error(
          'Error handling analytics for notification deleted:',
          error,
        );
      });
    });
  }

  private async handleNotificationQueued(data: string) {
    try {
      const event = JSON.parse(data);
      console.log('📊 Analytics: Notification queued', {
        type: event.type,
        userId: event.userId,
        timestamp: event.timestamp,
      });

      // Track notification creation metrics
      await this.trackNotificationCreated(event);
    } catch (error) {
      console.error('Error parsing notification queued event:', error);
    }
  }

  private async handleNotificationRead(data: string) {
    try {
      const event = JSON.parse(data);
      console.log('📊 Analytics: Notification read', {
        notificationId: event.notificationId,
        userId: event.userId,
        timestamp: event.timestamp,
      });

      // Track notification read metrics
      await this.trackNotificationRead(event);
    } catch (error) {
      console.error('Error parsing notification read event:', error);
    }
  }

  private async handleAllNotificationsRead(data: string) {
    try {
      const event = JSON.parse(data);
      console.log('📊 Analytics: All notifications read', {
        userId: event.userId,
        count: event.count,
        timestamp: event.timestamp,
      });

      // Track bulk read metrics
      await this.trackAllNotificationsRead(event);
    } catch (error) {
      console.error('Error parsing all notifications read event:', error);
    }
  }

  private async handleNotificationDeleted(data: string) {
    try {
      const event = JSON.parse(data);
      console.log('📊 Analytics: Notification deleted', {
        notificationId: event.notificationId,
        userId: event.userId,
        timestamp: event.timestamp,
      });

      // Track deletion metrics
      await this.trackNotificationDeleted(event);
    } catch (error) {
      console.error('Error parsing notification deleted event:', error);
    }
  }

  private async trackNotificationCreated(event: {
    type: string;
    userId: string;
    timestamp: string;
  }) {
    // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
    console.log('📊 Tracking: Notification created', event);
  }

  private async trackNotificationRead(event: {
    notificationId: string;
    userId: string;
    timestamp: string;
  }) {
    // TODO: Send to analytics service
    console.log('📊 Tracking: Notification read', event);
  }

  private async trackAllNotificationsRead(event: {
    userId: string;
    count: number;
    timestamp: string;
  }) {
    // TODO: Send to analytics service
    console.log('📊 Tracking: All notifications read', event);
  }

  private async trackNotificationDeleted(event: {
    notificationId: string;
    userId: string;
    timestamp: string;
  }) {
    // TODO: Send to analytics service
    console.log('📊 Tracking: Notification deleted', event);
  }
}
