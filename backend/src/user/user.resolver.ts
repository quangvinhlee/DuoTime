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

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() jwtUser: JwtPayload): Promise<UserType> {
    const user = await this.userService.getUser(jwtUser.sub);
    return user as UserType;
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: UpdateProfileInput,
  ): Promise<ResponseType> {
    await this.userService.updateProfile(jwtUser.sub, input);
    return {
      success: true,
      message: 'Profile updated successfully',
    };
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  async uploadAvatar(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: UploadAvatarInput,
  ): Promise<ResponseType> {
    // Handle base64 image upload if provided
    if (input.avatarBase64) {
      await this.userService.uploadAvatar(jwtUser.sub, input.avatarBase64);
      return {
        success: true,
        message: 'Avatar uploaded successfully',
      };
    }

    // If only name is being updated
    if (input.name) {
      await this.userService.updateProfile(jwtUser.sub, { name: input.name });
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
  async deleteAvatar(
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    await this.userService.deleteAvatar(jwtUser.sub);

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
