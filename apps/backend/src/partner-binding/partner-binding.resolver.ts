import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PartnerBindingService } from './partner-binding.service';
import {
  CreatePartnerBindingDto,
  AcceptPartnerBindingDto,
  RejectPartnerBindingDto,
} from './dtos/partner-binding-dto';
import { ResponseType } from '../shared/graphql/types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import {
  MutationThrottle,
  SensitiveMutationThrottle,
} from '../common/decorators/throttle.decorator';
import { JwtPayload } from '../shared/interfaces';
import { PartnerBindingResponse } from './types/partner-binding-types';

@Resolver()
export class PartnerBindingResolver {
  constructor(private readonly partnerBindingService: PartnerBindingService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PartnerBindingResponse)
  @SensitiveMutationThrottle() // 5 requests per minute - partner creation is sensitive
  async createPartnerBinding(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('createPartnerBindingDto')
    createPartnerBindingDto: CreatePartnerBindingDto,
  ): Promise<PartnerBindingResponse> {
    return this.partnerBindingService.createPartnerBinding({
      ...createPartnerBindingDto,
      senderId: jwtUser.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PartnerBindingResponse)
  @SensitiveMutationThrottle() // 5 requests per minute - accepting partnership is sensitive
  async acceptPartnerBinding(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('acceptPartnerBindingDto')
    acceptPartnerBindingDto: AcceptPartnerBindingDto,
  ): Promise<PartnerBindingResponse> {
    return this.partnerBindingService.acceptPartnerBinding({
      ...acceptPartnerBindingDto,
      receiverId: jwtUser.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseType)
  @MutationThrottle() // 10 requests per minute - rejecting is less sensitive
  async rejectPartnerBinding(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('rejectPartnerBindingDto')
    rejectPartnerBindingDto: RejectPartnerBindingDto,
  ): Promise<ResponseType> {
    return this.partnerBindingService.rejectPartnerBinding({
      ...rejectPartnerBindingDto,
      userId: jwtUser.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseType)
  @SensitiveMutationThrottle() // 5 requests per minute - removing partner is sensitive
  async removePartner(
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    return this.partnerBindingService.removePartner(jwtUser.id);
  }
}
