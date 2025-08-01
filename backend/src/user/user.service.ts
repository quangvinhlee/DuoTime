import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  uploadImage,
  deleteImage,
  getPublicIdFromUrl,
} from '../shared/utils/cloudinary';

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
      avatarUrl?: string | null;
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

  async uploadAvatar(userId: string, avatarBase64: string): Promise<User> {
    try {
      // Get current user to check if they have an existing avatar
      const currentUser = await this.getUser(userId);

      // If user has an existing avatar, try to delete it from Cloudinary
      if (currentUser.avatarUrl) {
        // Check if the URL is from Cloudinary (contains 'cloudinary.com')
        if (currentUser.avatarUrl.includes('cloudinary.com')) {
          const publicId = getPublicIdFromUrl(currentUser.avatarUrl);

          if (publicId) {
            try {
              await deleteImage(publicId);
            } catch {
              // Continue with upload even if deletion fails
            }
          }
        }
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(avatarBase64, 'base64');

      // Validate file size (5MB limit)
      if (buffer.length > 5 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 5MB');
      }

      // Create a simple file object for Cloudinary
      const fileData = {
        buffer,
        mimetype: 'image/jpeg', // Default to JPEG
      };

      // Upload to Cloudinary using buffer
      const avatarUrl = await uploadImage(fileData);

      // Update user profile with new avatar URL
      return await this.updateProfile(userId, { avatarUrl });
    } catch (error) {
      throw new Error('Failed to upload image: ' + error.message);
    }
  }

  async deleteAvatar(userId: string): Promise<void> {
    // Get current user to check if they have an avatar
    const user = await this.getUser(userId);

    if (!user.avatarUrl) {
      throw new Error('No avatar to delete');
    }

    // Delete from Cloudinary
    const publicId = getPublicIdFromUrl(user.avatarUrl);

    if (publicId) {
      await deleteImage(publicId);
    }

    // Update user profile to remove avatar URL
    await this.updateProfile(userId, { avatarUrl: null });
  }
}
