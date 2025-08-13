import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';
import {
  CreateLoveNoteInput,
  UpdateLoveNoteInput,
  GetLoveNotesInput,
} from './dtos/love-note.dto';

@Injectable()
export class LoveNoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createLoveNote(
    createLoveNoteInput: CreateLoveNoteInput,
    senderId: string,
  ) {
    const { title, message, recipientId } = createLoveNoteInput;

    // Validate recipient exists
    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      throw new BadRequestException('Recipient not found');
    }

    // Check if sender and recipient are partners
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      include: { partner: true },
    });

    if (!sender) {
      throw new BadRequestException('Sender not found');
    }

    // Only allow sending to partner or if user has no partner (for initial connection)
    if (sender.partnerId && sender.partnerId !== recipientId) {
      throw new BadRequestException(
        'You can only send love notes to your partner',
      );
    }

    // Create the love note
    const loveNote = await this.prisma.loveNote.create({
      data: {
        title,
        message,
        senderId,
        recipientId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Send notification to recipient
    const notificationTitle = `Love Note from ${sender.name || 'Your Partner'}`;

    const notificationMessage = title
      ? `${title}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`
      : message.substring(0, 100);

    await this.notificationService.createNotification(
      NotificationType.LOVE_NOTE,
      notificationTitle,
      notificationMessage,
      recipientId,
      {
        loveNoteId: loveNote.id,
        senderId: senderId,
        senderName: sender.name,
        type: 'LOVE_NOTE_RECEIVED',
      },
    );

    // Update love stats for both users
    await this.updateLoveStats(senderId, recipientId);

    return loveNote;
  }

  async getLoveNotes(userId: string, input: GetLoveNotesInput) {
    const { limit, offset, isRead } = input;

    const where: any = {
      recipientId: userId,
    };

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    return this.prisma.loveNote.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getLoveNote(loveNoteId: string, userId: string) {
    const loveNote = await this.prisma.loveNote.findFirst({
      where: {
        id: loveNoteId,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!loveNote) {
      throw new NotFoundException('Love note not found');
    }

    return loveNote;
  }

  async updateLoveNote(
    loveNoteId: string,
    updateLoveNoteInput: UpdateLoveNoteInput,
    userId: string,
  ) {
    const loveNote = await this.prisma.loveNote.findFirst({
      where: {
        id: loveNoteId,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
    });

    if (!loveNote) {
      throw new NotFoundException('Love note not found');
    }

    // Only recipient can mark as read, only sender can update content
    const updateData: any = {};

    if (
      loveNote.recipientId === userId &&
      updateLoveNoteInput.isRead !== undefined
    ) {
      updateData.isRead = updateLoveNoteInput.isRead;
    }

    if (loveNote.senderId === userId) {
      if (updateLoveNoteInput.title !== undefined) {
        updateData.title = updateLoveNoteInput.title;
      }
      if (updateLoveNoteInput.message !== undefined) {
        updateData.message = updateLoveNoteInput.message;
      }
    }

    return this.prisma.loveNote.update({
      where: { id: loveNoteId },
      data: updateData,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async deleteLoveNote(loveNoteId: string, userId: string) {
    const loveNote = await this.prisma.loveNote.findFirst({
      where: {
        id: loveNoteId,
        senderId: userId, // Only sender can delete
      },
    });

    if (!loveNote) {
      throw new NotFoundException(
        'Love note not found or you cannot delete it',
      );
    }

    await this.prisma.loveNote.delete({
      where: { id: loveNoteId },
    });

    return { success: true, message: 'Love note deleted successfully' };
  }

  async markLoveNoteAsRead(loveNoteId: string, userId: string) {
    const loveNote = await this.prisma.loveNote.findFirst({
      where: {
        id: loveNoteId,
        recipientId: userId,
      },
    });

    if (!loveNote) {
      throw new NotFoundException('Love note not found');
    }

    return this.prisma.loveNote.update({
      where: { id: loveNoteId },
      data: { isRead: true },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async getUnreadLoveNoteCount(userId: string) {
    return this.prisma.loveNote.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
  }

  private async updateLoveStats(senderId: string, recipientId: string) {
    // Update sender's stats
    await this.prisma.loveStats.upsert({
      where: { userId: senderId },
      update: {
        totalLoveNotes: { increment: 1 },
      },
      create: {
        userId: senderId,
        totalLoveNotes: 1,
      },
    });

    // Update recipient's stats
    await this.prisma.loveStats.upsert({
      where: { userId: recipientId },
      update: {
        receivedLoveNotes: { increment: 1 },
      },
      create: {
        userId: recipientId,
        receivedLoveNotes: 1,
      },
    });
  }
}
