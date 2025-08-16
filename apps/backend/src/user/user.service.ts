import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService, ENCRYPTION_CONFIG } from 'src/prisma/prisma.service';
import { EncryptionService } from '../common/services/encryption.service';
import {
  uploadImage,
  deleteImage,
  getPublicIdFromUrl,
} from '../common/utils/cloudinary';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

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

    // Decrypt sensitive fields
    return this.encryptionService.decryptObject(user, [
      ...ENCRYPTION_CONFIG.user,
    ]);
  }

  async updateProfile(
    id: string,
    profileData: {
      name?: string;
      avatarUrl?: string | null;
      email?: string;
      pushToken?: string;
    },
  ): Promise<User> {
    // Encrypt sensitive fields before saving
    const encryptedData = this.encryptionService.encryptObject(profileData, [
      ...ENCRYPTION_CONFIG.user,
    ]);

    const user = await this.prisma.user.update({
      where: { id },
      data: encryptedData,
      include: {
        partner: true,
        loveStats: true,
        preferences: true,
      },
    });

    // Decrypt sensitive fields after retrieving
    return this.encryptionService.decryptObject(user, [
      ...ENCRYPTION_CONFIG.user,
    ]);
  }

  async searchUsers(query: string, excludeUserId?: string): Promise<User[]> {
    const where: Prisma.UserWhereInput = {
      OR: [{ name: { contains: query, mode: 'insensitive' } }],
    };

    if (excludeUserId) {
      where.NOT = { id: excludeUserId };
    }

    const users = await this.prisma.user.findMany({
      where,
      include: { loveStats: true },
      take: 10,
    });

    // Decrypt sensitive fields for all users
    return users.map((user) =>
      this.encryptionService.decryptObject(user, [...ENCRYPTION_CONFIG.user]),
    );
  }

  async uploadAvatar(userId: string, avatarBase64: string): Promise<User> {
    const currentUser = await this.getUser(userId);

    if (currentUser.avatarUrl?.includes('cloudinary.com')) {
      const publicId = getPublicIdFromUrl(currentUser.avatarUrl);
      if (publicId) {
        try {
          await deleteImage(publicId);
        } catch {
          // Continue with upload even if deletion fails
        }
      }
    }

    const buffer = Buffer.from(avatarBase64, 'base64');
    if (buffer.length > 5 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 5MB');
    }

    const avatarUrl = await uploadImage({
      buffer,
      mimetype: 'image/jpeg',
    });

    return this.updateProfile(userId, { avatarUrl });
  }

  async deleteAvatar(userId: string): Promise<void> {
    const user = await this.getUser(userId);

    if (!user.avatarUrl) {
      throw new Error('No avatar to delete');
    }

    const publicId = getPublicIdFromUrl(user.avatarUrl);
    if (publicId) {
      await deleteImage(publicId);
    }

    await this.updateProfile(userId, { avatarUrl: null });
  }
}
