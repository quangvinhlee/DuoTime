import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import {
  CreateReminderInput,
  UpdateReminderInput,
  GetRemindersInput,
} from './dtos/reminder.dto';
import { ReminderGraphQLType } from './types/reminder.types';
import { ResponseType } from '../shared/graphql/types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtPayload } from '../shared/interfaces';
import {
  MutationThrottle,
  QueryThrottle,
} from '../common/decorators/throttle.decorator';

@Resolver(() => ReminderGraphQLType)
export class ReminderResolver {
  constructor(private readonly reminderService: ReminderService) {}

  @Mutation(() => ReminderGraphQLType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle() // 10 requests per minute
  async createReminder(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: CreateReminderInput,
  ): Promise<ReminderGraphQLType> {
    return this.reminderService.createReminder(input, jwtUser.id);
  }

  @Mutation(() => ReminderGraphQLType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle() // 10 requests per minute
  async updateReminder(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('reminderId') reminderId: string,
    @Args('input') input: UpdateReminderInput,
  ): Promise<ReminderGraphQLType> {
    return this.reminderService.updateReminder(reminderId, input, jwtUser.id);
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle() // 10 requests per minute
  async deleteReminder(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('reminderId') reminderId: string,
  ): Promise<ResponseType> {
    return this.reminderService.deleteReminder(reminderId, jwtUser.id);
  }

  @Mutation(() => ReminderGraphQLType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle() // 10 requests per minute
  async markReminderAsCompleted(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('reminderId') reminderId: string,
  ): Promise<ReminderGraphQLType> {
    return this.reminderService.markReminderAsCompleted(reminderId, jwtUser.id);
  }

  @Query(() => [ReminderGraphQLType])
  @UseGuards(JwtAuthGuard)
  @QueryThrottle() // 30 requests per minute
  async getReminders(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('input') input: GetRemindersInput,
  ): Promise<ReminderGraphQLType[]> {
    return this.reminderService.getReminders(jwtUser.id, input);
  }

  @Query(() => ReminderGraphQLType)
  @UseGuards(JwtAuthGuard)
  @QueryThrottle() // 30 requests per minute
  async getReminder(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('reminderId') reminderId: string,
  ): Promise<ReminderGraphQLType> {
    return this.reminderService.getReminder(reminderId, jwtUser.id);
  }
}
