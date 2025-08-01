import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserType, ResponseType } from '../shared/graphql/types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'common/guards/auth.guard';
import { CurrentUser } from 'common/decorators/user.decorator';
import { JwtPayload } from 'interfaces';
import {
  UpdateProfileInput,
  SearchUsersInput,
  UploadAvatarInput,
} from './dtos/user.dto';
import {
  uploadImage,
  deleteImage,
  getPublicIdFromUrl,
} from '../shared/utils/cloudinary';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() jwtUser: JwtPayload): Promise<UserType> {
    const user = await this.userService.getUser(jwtUser.sub);
    return user as UserType;
  }

  @Mutation(() => UserType)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: UpdateProfileInput,
  ): Promise<UserType> {
    const user = await this.userService.updateProfile(jwtUser.sub, input);
    return user as UserType;
  }

  @Mutation(() => UserType)
  @UseGuards(JwtAuthGuard)
  async uploadAvatar(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: UploadAvatarInput,
  ): Promise<UserType> {
    const updateData: { name?: string; avatarUrl?: string } = {};

    // Add name if provided
    if (input.name) {
      updateData.name = input.name;
    }

    // Handle base64 image upload if provided
    if (input.avatarBase64) {
      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(input.avatarBase64, 'base64');

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
        updateData.avatarUrl = avatarUrl;
      } catch (error) {
        throw new Error('Failed to upload image: ' + error.message);
      }
    }

    const user = await this.userService.updateProfile(jwtUser.sub, updateData);
    return user as UserType;
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    // Get current user to check if they have an avatar
    const user = await this.userService.getUser(jwtUser.sub);

    if (!user.avatarUrl) {
      throw new Error('No avatar to delete');
    }

    console.log('Deleting avatar for user:', jwtUser.sub);
    console.log('Avatar URL:', user.avatarUrl);

    // Delete from Cloudinary
    const publicId = getPublicIdFromUrl(user.avatarUrl);
    console.log('Extracted public ID:', publicId);

    if (publicId) {
      console.log('Deleting from Cloudinary with public ID:', publicId);
      await deleteImage(publicId);
      console.log('Successfully deleted from Cloudinary');
    } else {
      console.log('Could not extract public ID from URL');
    }

    // Update user profile to remove avatar URL
    console.log('Updating user profile to remove avatar URL');
    await this.userService.updateProfile(jwtUser.sub, {
      avatarUrl: undefined,
    });
    console.log('Successfully updated user profile');

    return {
      success: true,
      message: 'Avatar deleted successfully',
    };
  }

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard)
  async searchUsers(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: SearchUsersInput,
  ): Promise<UserType[]> {
    const users = await this.userService.searchUsers(
      input.query,
      input.excludeUserId || jwtUser.sub,
    );
    return users as UserType[];
  }
}
