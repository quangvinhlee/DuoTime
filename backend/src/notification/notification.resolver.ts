import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { ResponseType } from '../shared/graphql/types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtPayload } from '../shared/interfaces';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

interface NotificationPayload {
  notificationReceived: {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    sentAt: Date;
    userId: string;
    reminderId?: string;
  };
}

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Notification])
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('limit', { type: () => Number, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Number, defaultValue: 0 }) offset: number,
  ) {
    return this.notificationService.getUserNotifications(
      jwtUser.id,
      limit,
      offset,
    );
  }

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  async getUnreadNotificationCount(@CurrentUser() jwtUser: JwtPayload) {
    return this.notificationService.getUnreadNotificationCount(jwtUser.id);
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  async markNotificationAsRead(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('notificationId', { type: () => String }) notificationId: string,
  ) {
    const result = await this.notificationService.markNotificationAsRead(
      notificationId,
      jwtUser.id,
    );
    return {
      success: result.count > 0,
      message:
        result.count > 0
          ? 'Notification marked as read'
          : 'Notification not found',
    };
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  async markAllNotificationsAsRead(@CurrentUser() jwtUser: JwtPayload) {
    const result = await this.notificationService.markAllNotificationsAsRead(
      jwtUser.id,
    );
    return {
      success: result.count > 0,
      message:
        result.count > 0
          ? `${result.count} notifications marked as read`
          : 'No notifications to mark as read',
    };
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  async deleteNotification(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('notificationId', { type: () => String }) notificationId: string,
  ) {
    const result = await this.notificationService.deleteNotification(
      notificationId,
      jwtUser.id,
    );
    return {
      success: result.count > 0,
      message:
        result.count > 0 ? 'Notification deleted' : 'Notification not found',
    };
  }

  @Subscription(() => Notification, {
    resolve: (payload: NotificationPayload) => {
      return payload.notificationReceived;
    },
  })
  notificationReceived(@CurrentUser() jwtUser: JwtPayload) {
    console.log('jwtUserr:', jwtUser);

    // Add null check for jwtUser
    if (!jwtUser || !jwtUser.id) {
      throw new UnauthorizedException(
        'User not authenticated for subscription',
      );
    }

    return this.pubSub.asyncIterableIterator(`notification:user:${jwtUser.id}`);
  }
}
