import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { RedisPubSubService } from './redis-pubsub.service';
import { PubSub } from 'graphql-subscriptions';

export interface PartnerBindingNotificationJob {
  bindingId: string;
  senderId: string;
  receiverId?: string;
  invitationCode: string;
  type: 'BINDING_CREATED' | 'BINDING_ACCEPTED' | 'BINDING_REJECTED';
}

@Injectable()
@Processor('notifications')
export class NotificationProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisPubSub: RedisPubSubService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Process('partner-binding')
  async handlePartnerBindingNotification(
    job: Job<PartnerBindingNotificationJob>,
  ) {
    const { bindingId, senderId, receiverId, invitationCode, type } = job.data;

    console.log('🔔 Processing notification job:', {
      type,
      bindingId,
      senderId,
      receiverId,
    });

    try {
      switch (type) {
        case 'BINDING_CREATED':
          console.log('🔔 Handling BINDING_CREATED notification');
          await this.handleBindingCreated(
            bindingId,
            senderId,
            receiverId,
            invitationCode,
          );
          break;
        case 'BINDING_ACCEPTED':
          if (receiverId) {
            await this.handleBindingAccepted(bindingId, senderId, receiverId);
          }
          break;
        case 'BINDING_REJECTED':
          if (receiverId) {
            await this.handleBindingRejected(bindingId, senderId, receiverId);
          }
          break;
      }
    } catch (error) {
      console.error('Error processing notification:', error);
      throw error;
    }
  }

  private async handleBindingCreated(
    bindingId: string,
    senderId: string,
    receiverId: string | undefined,
    invitationCode: string,
  ) {
    // Get sender details
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true, email: true },
    });

    if (!sender) return;

    // If there's a specific receiver, notify them
    if (receiverId) {
      await this.prisma.notification.create({
        data: {
          type: NotificationType.PARTNER_ACTIVITY,
          title: 'Partner Binding Request',
          message: `${sender.name || 'Someone'} wants to connect with you! Use invitation code: ${invitationCode}`,
          userId: receiverId,
        },
      });
    }

    // Also notify the sender that their binding was created
    await this.prisma.notification.create({
      data: {
        type: NotificationType.PARTNER_ACTIVITY,
        title: 'Binding Created',
        message: `Your partner binding request has been created. Invitation code: ${invitationCode}`,
        userId: senderId,
      },
    });

    // Publish to Redis for real-time updates
    await this.redisPubSub.publish('partner-binding-created', {
      bindingId,
      senderId,
      receiverId,
      invitationCode,
      senderName: sender.name,
    });

    // Publish to GraphQL subscription
    console.log(
      '🔔 Publishing to GraphQL subscription for receiverId:',
      receiverId,
    );
    await this.pubSub.publish('notificationReceived', {
      notificationReceived: {
        id: 'temp-id',
        type: 'PARTNER_ACTIVITY',
        title: 'Partner Binding Request',
        message: `${sender.name || 'Someone'} wants to connect with you!`,
        isRead: false,
        sentAt: new Date(),
        userId: receiverId,
      },
    });
    console.log('🔔 Published to GraphQL subscription successfully');
  }

  private async handleBindingAccepted(
    bindingId: string,
    senderId: string,
    receiverId: string,
  ) {
    const [sender, receiver] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: senderId },
        select: { id: true, name: true },
      }),
      this.prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true, name: true },
      }),
    ]);

    if (!sender || !receiver) return;

    // Notify both users
    await Promise.all([
      this.prisma.notification.create({
        data: {
          type: NotificationType.PARTNER_ACTIVITY,
          title: 'Partner Connected!',
          message: `You are now connected with ${receiver.name || 'your partner'}!`,
          userId: senderId,
        },
      }),
      this.prisma.notification.create({
        data: {
          type: NotificationType.PARTNER_ACTIVITY,
          title: 'Partner Connected!',
          message: `You are now connected with ${sender.name || 'your partner'}!`,
          userId: receiverId,
        },
      }),
    ]);

    // Publish to Redis for real-time updates
    await this.redisPubSub.publish('partner-binding-accepted', {
      bindingId,
      senderId,
      receiverId,
      senderName: sender.name,
      receiverName: receiver.name,
    });

    // Publish to GraphQL subscription for both users
    await Promise.all([
      this.pubSub.publish('notificationReceived', {
        notificationReceived: {
          id: 'temp-id-1',
          type: 'PARTNER_ACTIVITY',
          title: 'Partner Connected!',
          message: `You are now connected with ${receiver.name || 'your partner'}!`,
          isRead: false,
          sentAt: new Date(),
          userId: senderId,
        },
      }),
      this.pubSub.publish('notificationReceived', {
        notificationReceived: {
          id: 'temp-id-2',
          type: 'PARTNER_ACTIVITY',
          title: 'Partner Connected!',
          message: `You are now connected with ${sender.name || 'your partner'}!`,
          isRead: false,
          sentAt: new Date(),
          userId: receiverId,
        },
      }),
    ]);
  }

  private async handleBindingRejected(
    bindingId: string,
    senderId: string,
    receiverId: string,
  ) {
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true },
    });

    if (!sender) return;

    // Notify the sender
    await this.prisma.notification.create({
      data: {
        type: NotificationType.PARTNER_ACTIVITY,
        title: 'Binding Rejected',
        message: 'Your partner binding request was rejected.',
        userId: senderId,
      },
    });

    // Publish to Redis for real-time updates
    await this.redisPubSub.publish('partner-binding-rejected', {
      bindingId,
      senderId,
      receiverId,
    });

    // Publish to GraphQL subscription
    await this.pubSub.publish('notificationReceived', {
      notificationReceived: {
        id: 'temp-id-3',
        type: 'PARTNER_ACTIVITY',
        title: 'Binding Rejected',
        message: 'Your partner binding request was rejected.',
        isRead: false,
        sentAt: new Date(),
        userId: senderId,
      },
    });
  }
}
