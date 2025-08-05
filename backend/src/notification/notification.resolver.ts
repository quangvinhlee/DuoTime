import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { ResponseType } from '../shared/graphql/types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtPayload } from '../shared/interfaces';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Notification])
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(@CurrentUser() jwtUser: JwtPayload) {
    return this.notificationService.getUserNotifications(jwtUser.sub);
  }

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  async getUnreadNotificationCount(@CurrentUser() jwtUser: JwtPayload) {
    return this.notificationService.getUnreadNotificationCount(jwtUser.sub);
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  async markNotificationAsRead(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('notificationId', { type: () => String }) notificationId: string,
  ) {
    const result = await this.notificationService.markNotificationAsRead(
      notificationId,
      jwtUser.sub,
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
  async deleteNotification(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('notificationId', { type: () => String }) notificationId: string,
  ) {
    const result = await this.notificationService.deleteNotification(
      notificationId,
      jwtUser.sub,
    );
    return {
      success: result.count > 0,
      message:
        result.count > 0 ? 'Notification deleted' : 'Notification not found',
    };
  }

  @Subscription(() => Notification, {
    filter: (payload, variables, context) => {
      // For now, let's remove the filter to test if subscription works
      console.log('🔔 Subscription filter called:', { payload, context });
      return true; // Allow all notifications for testing
    },
    resolve: (payload) => {
      console.log('🔔 Subscription resolve called:', payload);
      return payload.notificationReceived;
    },
  })
  notificationReceived() {
    console.log('🔔 Subscription created for notificationReceived');
    return this.pubSub.asyncIterableIterator('notificationReceived');
  }
}
