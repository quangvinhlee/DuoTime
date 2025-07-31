import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PartnerBindingService } from './partner-binding.service';
import {
  PartnerBindingResponse,
  RejectPartnerBindingResponse,
} from './responses/partner-binding-responses';
import {
  CreatePartnerBindingDto,
  AcceptPartnerBindingDto,
  RejectPartnerBindingDto,
} from './dtos/partner-binding-dto';
import { JwtAuthGuard } from 'common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'common/decorators/user.decorator';
import { JwtPayload } from 'interfaces';

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
  @Mutation(() => RejectPartnerBindingResponse)
  async rejectPartnerBinding(
    @CurrentUser() jwtUser: JwtPayload,
    @Args('rejectPartnerBindingDto')
    rejectPartnerBindingDto: RejectPartnerBindingDto,
  ): Promise<RejectPartnerBindingResponse> {
    return this.partnerBindingService.rejectPartnerBinding({
      ...rejectPartnerBindingDto,
      userId: jwtUser.sub,
    });
  }
}
