import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService, ENCRYPTION_CONFIG } from '../prisma/prisma.service';
import { EncryptionService } from '../common/services/encryption.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';
import { ResponseType } from '../shared/graphql/types/user.types';
import {
  CreateLoveActivityInput,
  UpdateLoveActivityInput,
  GetLoveActivitiesInput,
  ConfirmLoveActivityInput,
} from './dtos/love-activity.dto';

@Injectable()
export class LoveActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async createLoveActivity(
    createLoveActivityInput: CreateLoveActivityInput,
    userId: string,
  ) {
    const { title, description, type, date, location, receiverId } =
      createLoveActivityInput;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { partner: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.partnerId) {
      throw new BadRequestException(
        'You need to be connected with a partner to create love activities',
      );
    }

    // Encrypt sensitive fields before saving
    const encryptedData = this.encryptionService.encryptObject(
      {
        title,
        description,
        type,
        date,
        location,
        createdById: userId,
        receiverId,
      },
      [...ENCRYPTION_CONFIG.loveActivity],
    );

    // Create the love activity
    const loveActivity = await this.prisma.loveActivity.create({
      data: encryptedData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        confirmedBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Decrypt for notification
    const decryptedActivity = this.encryptionService.decryptObject(
      loveActivity,
      [...ENCRYPTION_CONFIG.loveActivity],
    );

    // Send notification to partner to confirm the activity
    const notificationTitle = `New Love Activity to Confirm: ${title}`;
    const notificationMessage = decryptedActivity.description
      ? `${decryptedActivity.description.substring(0, 50)}${decryptedActivity.description.length > 50 ? '...' : ''}`
      : `Your partner logged a ${type.toLowerCase()} activity. Please confirm if this happened!`;

    await this.notificationService.createNotification(
      NotificationType.PARTNER_ACTIVITY,
      notificationTitle,
      notificationMessage,
      user.partnerId,
      {
        activityId: loveActivity.id,
        activityType: type,
        activityTitle: title,
        type: 'LOVE_ACTIVITY_PENDING_CONFIRMATION',
      },
    );

    // Don't update love stats yet - wait for confirmation

    return decryptedActivity;
  }

  async getLoveActivities(input: GetLoveActivitiesInput, userId: string) {
    const { limit, offset, type, startDate, endDate } = input;

    // Get user and partner info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.partnerId) {
      throw new BadRequestException(
        'You need to be connected with a partner to view love activities',
      );
    }

    // Build where clause - show activities where user is creator or receiver
    const where: any = {
      OR: [{ createdById: userId }, { receiverId: userId }],
    };

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const activities = await this.prisma.loveActivity.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        confirmedBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });

    return activities;
  }

  async getLoveActivity(activityId: string, userId: string) {
    const activity = await this.prisma.loveActivity.findUnique({
      where: { id: activityId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Love activity not found');
    }

    // Check if user has access to this activity
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      activity.createdById !== userId &&
      activity.createdById !== user.partnerId
    ) {
      throw new BadRequestException('You do not have access to this activity');
    }

    return activity;
  }

  async updateLoveActivity(
    activityId: string,
    updateLoveActivityInput: UpdateLoveActivityInput,
    userId: string,
  ): Promise<ResponseType> {
    // Check if activity exists and user owns it
    const existingActivity = await this.prisma.loveActivity.findUnique({
      where: { id: activityId },
      include: { createdBy: true },
    });

    if (!existingActivity) {
      throw new NotFoundException('Love activity not found');
    }

    if (existingActivity.createdById !== userId) {
      throw new BadRequestException(
        'You can only update activities you created',
      );
    }

    // Update the activity
    const updatedActivity = await this.prisma.loveActivity.update({
      where: { id: activityId },
      data: updateLoveActivityInput,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Send notification to partner about the update
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true },
    });

    if (user?.partnerId) {
      const notificationTitle = `Love Activity Updated: ${updatedActivity.title}`;
      const notificationMessage = `Your partner updated a ${updatedActivity.type.toLowerCase()} activity`;

      await this.notificationService.createNotification(
        NotificationType.PARTNER_ACTIVITY,
        notificationTitle,
        notificationMessage,
        user.partnerId,
        {
          activityId: updatedActivity.id,
          activityType: updatedActivity.type,
          activityTitle: updatedActivity.title,
          type: 'LOVE_ACTIVITY_UPDATED',
        },
      );
    }

    return {
      success: true,
      message: 'Love activity updated successfully',
    } as ResponseType;
  }

  async deleteLoveActivity(activityId: string, userId: string) {
    // Check if activity exists and user owns it
    const existingActivity = await this.prisma.loveActivity.findUnique({
      where: { id: activityId },
    });

    if (!existingActivity) {
      throw new NotFoundException('Love activity not found');
    }

    if (existingActivity.createdById !== userId) {
      throw new BadRequestException(
        'You can only delete activities you created',
      );
    }

    // Get user info for notification
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true },
    });

    // Delete the activity
    await this.prisma.loveActivity.delete({
      where: { id: activityId },
    });

    // Send notification to partner about the deletion
    if (user?.partnerId) {
      const notificationTitle = 'Love Activity Deleted';
      const notificationMessage = `Your partner deleted a love activity`;

      await this.notificationService.createNotification(
        NotificationType.PARTNER_ACTIVITY,
        notificationTitle,
        notificationMessage,
        user.partnerId,
        {
          activityId: activityId,
          type: 'LOVE_ACTIVITY_DELETED',
        },
      );
    }

    return { success: true, message: 'Love activity deleted successfully' };
  }

  async confirmLoveActivity(
    confirmLoveActivityInput: ConfirmLoveActivityInput,
    userId: string,
  ): Promise<ResponseType> {
    const { activityId, confirm } = confirmLoveActivityInput;

    // Get the activity
    const activity = await this.prisma.loveActivity.findUnique({
      where: { id: activityId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Love activity not found');
    }

    // Get user and partner info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is the partner of the activity creator
    if (activity.createdById !== user.partnerId) {
      throw new BadRequestException(
        'You can only confirm activities created by your partner',
      );
    }

    // Check if activity is already confirmed/rejected
    if (activity.status !== 'PENDING') {
      throw new BadRequestException(
        'Activity is already confirmed or rejected',
      );
    }

    // Update the activity status
    const updatedActivity = await this.prisma.loveActivity.update({
      where: { id: activityId },
      data: {
        status: confirm ? 'CONFIRMED' : 'REJECTED',
        confirmedById: userId,
        confirmedAt: confirm ? new Date() : null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        confirmedBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Send notification to the creator
    const notificationTitle = confirm
      ? 'Activity Confirmed! 💕'
      : 'Activity Rejected';
    const notificationMessage = confirm
      ? `Your partner confirmed: ${activity.title}`
      : `Your partner rejected: ${activity.title}`;

    await this.notificationService.createNotification(
      NotificationType.PARTNER_ACTIVITY,
      notificationTitle,
      notificationMessage,
      activity.createdById,
      {
        activityId: activity.id,
        activityType: activity.type,
        activityTitle: activity.title,
        type: confirm ? 'LOVE_ACTIVITY_CONFIRMED' : 'LOVE_ACTIVITY_REJECTED',
      },
    );

    // Update love stats if confirmed
    if (confirm) {
      await this.updateLoveStats(activity.createdById);
      await this.updateLoveStats(userId);
    }

    return {
      success: true,
      message: confirm
        ? 'Love activity confirmed successfully'
        : 'Love activity rejected',
    } as ResponseType;
  }

  async getLoveActivityStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.partnerId) {
      throw new BadRequestException(
        'You need to be connected with a partner to view love activity stats',
      );
    }

    // Get total activities
    const totalActivities = await this.prisma.loveActivity.count({
      where: {
        OR: [{ createdById: userId }, { createdById: user.partnerId }],
      },
    });

    // Get this month's activities
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthActivities = await this.prisma.loveActivity.count({
      where: {
        OR: [{ createdById: userId }, { createdById: user.partnerId }],
        date: {
          gte: startOfMonth,
        },
      },
    });

    // Duration calculation removed from Love Activity

    // Get most common activity type
    const activityCounts = await this.prisma.loveActivity.groupBy({
      by: ['type'],
      where: {
        OR: [{ createdById: userId }, { createdById: user.partnerId }],
      },
      _count: {
        type: true,
      },
      orderBy: {
        _count: {
          type: 'desc',
        },
      },
      take: 1,
    });

    const mostCommonActivity = activityCounts[0]?.type || null;

    // Get last activity date
    const lastActivity = await this.prisma.loveActivity.findFirst({
      where: {
        OR: [{ createdById: userId }, { createdById: user.partnerId }],
      },
      orderBy: { date: 'desc' },
      select: { date: true },
    });

    // Calculate streaks (simplified - you can enhance this)
    const currentStreak = 0; // TODO: Implement streak calculation
    const longestStreak = 0; // TODO: Implement streak calculation

    return {
      totalActivities,
      thisMonthActivities,
      currentStreak,
      longestStreak,
      mostCommonActivity,
      lastActivityDate: lastActivity?.date || null,
    };
  }

  private async updateLoveStats(userId: string) {
    // Get total activities for this user
    const totalActivities = await this.prisma.loveActivity.count({
      where: { createdById: userId },
    });

    // Update or create love stats
    await this.prisma.loveStats.upsert({
      where: { userId },
      update: {
        totalActivities,
        lastActivityDate: new Date(),
      },
      create: {
        userId,
        totalActivities,
        lastActivityDate: new Date(),
      },
    });
  }
}
