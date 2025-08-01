import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { UserType } from '../graphql/types';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField(() => UserType, { nullable: true })
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
