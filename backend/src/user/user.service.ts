import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        partner: true,
        loveStats: true,
        preferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    id: string,
    profileData: {
      name?: string;
      avatarUrl?: string;
    },
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: profileData,
      include: {
        partner: true,
        loveStats: true,
        preferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async searchUsers(query: string, excludeUserId?: string): Promise<User[]> {
    const where: Prisma.UserWhereInput = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (excludeUserId) {
      where.NOT = { id: excludeUserId };
    }

    return this.prisma.user.findMany({
      where,
      include: {
        loveStats: true,
      },
      take: 10,
    });
  }
}
