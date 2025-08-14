import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LoveActivityService } from './love-activity.service';
import {
  CreateLoveActivityInput,
  UpdateLoveActivityInput,
  GetLoveActivitiesInput,
  ConfirmLoveActivityInput,
} from './dtos/love-activity.dto';
import {
  LoveActivityType,
  LoveActivityStatsType,
} from './types/love-activity.types';
import { ResponseType } from '../shared/graphql/types/user.types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtPayload } from '../shared/interfaces';
import {
  MutationThrottle,
  QueryThrottle,
} from '../common/decorators/throttle.decorator';

@Resolver(() => LoveActivityType)
export class LoveActivityResolver {
  constructor(private readonly loveActivityService: LoveActivityService) {}

  @Mutation(() => LoveActivityType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle()
  async createLoveActivity(
    @Args('input') createLoveActivityInput: CreateLoveActivityInput,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveActivityType> {
    return this.loveActivityService.createLoveActivity(
      createLoveActivityInput,
      jwtUser.id,
    );
  }

  @Query(() => [LoveActivityType])
  @UseGuards(JwtAuthGuard)
  @QueryThrottle()
  async getLoveActivities(
    @Args('input') input: GetLoveActivitiesInput,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveActivityType[]> {
    return this.loveActivityService.getLoveActivities(input, jwtUser.id);
  }

  @Query(() => LoveActivityType)
  @UseGuards(JwtAuthGuard)
  @QueryThrottle()
  async getLoveActivity(
    @Args('activityId') activityId: string,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveActivityType> {
    return this.loveActivityService.getLoveActivity(activityId, jwtUser.id);
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle()
  async updateLoveActivity(
    @Args('activityId') activityId: string,
    @Args('input') updateLoveActivityInput: UpdateLoveActivityInput,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    return this.loveActivityService.updateLoveActivity(
      activityId,
      updateLoveActivityInput,
      jwtUser.id,
    );
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle()
  async deleteLoveActivity(
    @Args('activityId') activityId: string,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    return this.loveActivityService.deleteLoveActivity(activityId, jwtUser.id);
  }

  @Query(() => LoveActivityStatsType)
  @UseGuards(JwtAuthGuard)
  @QueryThrottle()
  async getLoveActivityStats(
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveActivityStatsType> {
    return this.loveActivityService.getLoveActivityStats(jwtUser.id);
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle()
  async confirmLoveActivity(
    @Args('input') confirmLoveActivityInput: ConfirmLoveActivityInput,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    return this.loveActivityService.confirmLoveActivity(
      confirmLoveActivityInput,
      jwtUser.id,
    );
  }
}
