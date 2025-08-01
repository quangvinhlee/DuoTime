import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PartnerBindingService } from './partner-binding.service';
import { PartnerBindingResponse } from './responses/partner-binding-responses';
import {
  CreatePartnerBindingDto,
  AcceptPartnerBindingDto,
  RejectPartnerBindingDto,
} from './dtos/partner-binding-dto';
import { ResponseType } from '../shared/graphql/types';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtPayload } from '../shared/interfaces';

@Resolver()
export class PartnerBindingResolver {
  constructor(private readonly partnerBindingService: PartnerBindingService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PartnerBindingResponse)
  async createPartnerBinding(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('createPartnerBindingDto')
    createPartnerBindingDto: CreatePartnerBindingDto,
  ): Promise<PartnerBindingResponse> {
    return this.partnerBindingService.createPartnerBinding({
      ...createPartnerBindingDto,
      senderId: jwtUser.sub,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PartnerBindingResponse)
  async acceptPartnerBinding(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('acceptPartnerBindingDto')
    acceptPartnerBindingDto: AcceptPartnerBindingDto,
  ): Promise<PartnerBindingResponse> {
    return this.partnerBindingService.acceptPartnerBinding({
      ...acceptPartnerBindingDto,
      receiverId: jwtUser.sub,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseType)
  async rejectPartnerBinding(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('rejectPartnerBindingDto')
    rejectPartnerBindingDto: RejectPartnerBindingDto,
  ): Promise<ResponseType> {
    return this.partnerBindingService.rejectPartnerBinding({
      ...rejectPartnerBindingDto,
      userId: jwtUser.sub,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseType)
  async removePartner(
    @CurrentUser() jwtUser: JwtPayload,
  ): Promise<ResponseType> {
    return this.partnerBindingService.removePartner(jwtUser.sub);
  }
}
