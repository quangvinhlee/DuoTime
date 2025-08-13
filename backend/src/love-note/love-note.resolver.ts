import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LoveNoteService } from './love-note.service';
import {
  CreateLoveNoteInput,
  UpdateLoveNoteInput,
  GetLoveNotesInput,
} from './dtos/love-note.dto';
import { LoveNoteType } from './types/love-note.types';
import { ResponseType } from '../shared/graphql/types/user.types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtPayload } from '../shared/interfaces';
import {
  MutationThrottle,
  QueryThrottle,
} from '../common/decorators/throttle.decorator';
import { Int } from '@nestjs/graphql';

@Resolver(() => LoveNoteType)
export class LoveNoteResolver {
  constructor(private readonly loveNoteService: LoveNoteService) {}

  @Mutation(() => LoveNoteType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle() // 10 requests per minute for love note operations
  async createLoveNote(
    @Args('input') createLoveNoteInput: CreateLoveNoteInput,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveNoteType> {
    return this.loveNoteService.createLoveNote(createLoveNoteInput, jwtUser.id);
  }

  @Query(() => [LoveNoteType])
  @UseGuards(JwtAuthGuard)
  @QueryThrottle() // 30 requests per minute for queries
  async getLoveNotes(
    @Args('input') input: GetLoveNotesInput,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveNoteType[]> {
    return this.loveNoteService.getLoveNotes(jwtUser.id, input);
  }

  @Query(() => LoveNoteType)
  @UseGuards(JwtAuthGuard)
  @QueryThrottle()
  async getLoveNote(
    @Args('loveNoteId') loveNoteId: string,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveNoteType> {
    return this.loveNoteService.getLoveNote(loveNoteId, jwtUser.id);
  }

  @Mutation(() => LoveNoteType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle()
  async updateLoveNote(
    @Args('loveNoteId') loveNoteId: string,
    @Args('input') updateLoveNoteInput: UpdateLoveNoteInput,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveNoteType> {
    return this.loveNoteService.updateLoveNote(
      loveNoteId,
      updateLoveNoteInput,
      jwtUser.id,
    );
  }

  @Mutation(() => ResponseType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle()
  async deleteLoveNote(
    @Args('loveNoteId') loveNoteId: string,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    return this.loveNoteService.deleteLoveNote(loveNoteId, jwtUser.id);
  }

  @Mutation(() => LoveNoteType)
  @UseGuards(JwtAuthGuard)
  @MutationThrottle()
  async markLoveNoteAsRead(
    @Args('loveNoteId') loveNoteId: string,
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<LoveNoteType> {
    return this.loveNoteService.markLoveNoteAsRead(loveNoteId, jwtUser.id);
  }

  @Query(() => Int)
  @UseGuards(JwtAuthGuard)
  @QueryThrottle()
  async getUnreadLoveNoteCount(
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<number> {
    return this.loveNoteService.getUnreadLoveNoteCount(jwtUser.id);
  }
}
