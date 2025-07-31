import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AcceptPartnerBindingDto,
  CreatePartnerBindingDto,
} from './dtos/partner-binding-dto';
import { BindingStatus } from '@prisma/client';
import { PartnerBindingResponse } from './responses/partner-binding-responses';
import { generateInvitationCode } from 'src/shared/utils/generateInvitationCode';

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

    const existingBinding = await this.prisma.partnerBinding.findFirst({
      where: {
        senderId,
      },
    });

    if (existingBinding) {
      if (existingBinding.status === BindingStatus.ACCEPTED) {
        throw new BadRequestException('User already has a partner');
      }

      if (existingBinding.status === BindingStatus.PENDING) {
        await this.prisma.partnerBinding.delete({
          where: { id: existingBinding.id },
        });
      }
    }

    let invitationCode = '';
    const maxAttempts = 10;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      invitationCode = generateInvitationCode();

      const existingCode = await this.prisma.partnerBinding.findUnique({
        where: { invitationCode },
      });

      if (!existingCode) {
        break;
      }

      if (attempts === maxAttempts - 1) {
        throw new BadRequestException(
          'Failed to generate unique invitation code',
        );
      }
    }

    const newBinding = await this.prisma.partnerBinding.create({
      data: {
        senderId,
        invitationCode,
        receiverId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

  async acceptPartnerBinding(
    dto: AcceptPartnerBindingDto & { receiverId: string },
  ) {
    const { invitationCode, receiverId } = dto;

    const [receiver, binding] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: receiverId } }),
      this.prisma.partnerBinding.findFirst({
        where: { invitationCode },
      }),
    ]);

    if (!receiver) {
      throw new BadRequestException('Receiver does not exist');
    }

    if (!binding) {
      throw new BadRequestException('Binding does not exist');
    }

    if (binding.status === BindingStatus.ACCEPTED) {
      throw new BadRequestException('Binding already accepted');
    }

    if (binding.expiresAt < new Date()) {
      throw new BadRequestException('Binding has expired');
    }

    const sender = await this.prisma.user.findUnique({
      where: { id: binding.senderId },
    });

    if (!sender) {
      throw new BadRequestException('Sender does not exist');
    }

    if (receiver.partnerId || sender.partnerId) {
      throw new BadRequestException('One of the users already has a partner');
    }

    const acceptedAt = new Date();

    const [updatedBinding] = await this.prisma.$transaction([
      this.prisma.partnerBinding.update({
        where: { id: binding.id },
        data: {
          status: BindingStatus.ACCEPTED,
          acceptedAt,
          receiverId, // Set the receiverId when accepting
        },
      }),
      this.prisma.user.update({
        where: { id: receiverId },
        data: { partnerId: binding.senderId },
      }),
      this.prisma.user.update({
        where: { id: binding.senderId },
        data: { partnerId: receiverId },
      }),
    ]);

    return {
      id: updatedBinding.id,
      invitationCode: updatedBinding.invitationCode,
      expiresAt: updatedBinding.expiresAt.toISOString(),
      status: updatedBinding.status,
    };
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
