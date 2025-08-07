import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType, ResponseType } from '../shared/graphql/types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import {
  QueryThrottle,
  MutationThrottle,
  SensitiveMutationThrottle,
} from '../common/decorators/throttle.decorator';
import { JwtPayload } from '../shared/interfaces';
import {
  UpdateProfileInput,
  SearchUsersInput,
  UploadAvatarInput,
} from './dtos/user.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  @QueryThrottle() // 30 requests per minute
  async getProfile(@CurrentUser() jwtUser: JwtPayload): Promise<UserType> {
    const user = await this.userService.getUser(jwtUser.id);
    return user as UserType;
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle() // 10 requests per minute
  async updateProfile(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: UpdateProfileInput,
  ): Promise<ResponseType> {
    await this.userService.updateProfile(jwtUser.id, input);
    return {
      success: true,
      message: 'Profile updated successfully',
    };
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  @SensitiveMutationThrottle() // 5 requests per minute - avatar upload is sensitive
  async uploadAvatar(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: UploadAvatarInput,
  ): Promise<ResponseType> {
    // Handle base64 image upload if provided
    if (input.avatarBase64) {
      await this.userService.uploadAvatar(jwtUser.id, input.avatarBase64);
      return {
        success: true,
        message: 'Avatar uploaded successfully',
      };
    }

    // If only name is being updated
    if (input.name) {
      await this.userService.updateProfile(jwtUser.id, { name: input.name });
      return {
        success: true,
        message: 'Profile updated successfully',
      };
    }

    // If no changes
    return {
      success: false,
      message: 'No changes provided',
    };
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle() // 10 requests per minute
  async deleteAvatar(
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    await this.userService.deleteAvatar(jwtUser.id);

    return {
      success: true,
      message: 'Avatar deleted successfully',
    };
  }

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard)
  @QueryThrottle() // 30 requests per minute
  async searchUsers(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: SearchUsersInput,
  ): Promise<UserType[]> {
    const users = await this.userService.searchUsers(
      input.query,
      input.excludeUserId || jwtUser.id,
    );
    return users as UserType[];
  }
}
