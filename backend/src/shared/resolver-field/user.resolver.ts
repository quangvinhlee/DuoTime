import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryThrottle } from '../../common/decorators/throttle.decorator';
import { UserType } from '../graphql/types';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField(() => UserType, { nullable: true })
  @QueryThrottle() // 30 requests per minute for field resolvers
  async partner(@Parent() user: UserType): Promise<UserType | null> {
    if (!user.partnerId) {
      return null;
    }

    const partner = await this.prisma.user.findUnique({
      where: { id: user.partnerId },
    });

    if (!partner) {
      return null;
    }

    return partner as UserType;
  }
}
