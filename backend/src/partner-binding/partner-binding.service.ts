import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerBindingDto } from './dtos/partner-binding-dto';
import { BindingStatus } from '@prisma/client';
import { PartnerBindingResponse } from './responses/partner-binding-responses';

@Injectable()
export class PartnerBindingService {
  constructor(private readonly prisma: PrismaService) {}

  async createPartnerBinding(
    createPartnerBindingDto: CreatePartnerBindingDto & { senderId: string },
  ): Promise<PartnerBindingResponse> {
    const { receiverId, senderId } = createPartnerBindingDto;

    if (!senderId) {
      throw new BadRequestException('Sender ID is required');
    }

    if (receiverId) {
      const receiver = await this.prisma.user.findUnique({
        where: { id: receiverId },
      });
      if (!receiver) {
        throw new BadRequestException('Receiver does not exist');
      }
    }

    await this.validateNoExistingPartners(senderId, receiverId);

    // Check for existing binding between these users (only if receiverId is provided)
    const existingBinding = await this.prisma.partnerBinding.findFirst({
      where: {
        senderId,
      },
    });

    // If there's an existing binding
    if (existingBinding) {
      if (existingBinding.status === BindingStatus.ACCEPTED) {
        throw new BadRequestException('User already has a partner');
      }

      // If it's pending, delete the old one
      if (existingBinding.status === BindingStatus.PENDING) {
        await this.prisma.partnerBinding.delete({
          where: { id: existingBinding.id },
        });
      }
    }

    // Generate unique invitation code
    const invitationCode = this.generateInvitationCode();

    // Create new binding
    const newBinding = await this.prisma.partnerBinding.create({
      data: {
        senderId,
        invitationCode,
        receiverId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: BindingStatus.PENDING,
      },
    });

    return {
      id: newBinding.id,
      invitationCode: newBinding.invitationCode,
      expiresAt: newBinding.expiresAt.toISOString(),
      status: newBinding.status,
    };
  }

  private generateInvitationCode(): string {
    // Generate a 6-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async validateNoExistingPartners(
    senderId: string,
    receiverId?: string,
  ) {
    const validationPromises = [
      this.checkUserHasPartner(
        senderId,
        'You already have a partner connected',
      ),
    ];

    if (receiverId) {
      validationPromises.push(
        this.checkUserHasPartner(
          receiverId,
          'The user you want to invite already has a partner',
        ),
      );
    }

    await Promise.all(validationPromises);
  }

  private async checkUserHasPartner(userId: string, errorMessage: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { partner: true },
    });

    if (user?.partnerId && user.partner) {
      throw new BadRequestException(errorMessage);
    }
  }
}
