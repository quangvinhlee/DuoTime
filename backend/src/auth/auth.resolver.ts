import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginInput } from './dtos/auth.dto';
import { AuthResponse } from './responses/auth.response';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { AuthThrottle } from '../common/decorators/throttle.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../shared/interfaces';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => AuthResponse)
  @AuthThrottle() // 5 requests per minute for auth operations
  async googleLogin(
    @Args('googleLoginInput') googleLoginInput: GoogleLoginInput,
  ): Promise<AuthResponse> {
    return this.authService.googleLogin(googleLoginInput);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  @AuthThrottle() // 5 requests per minute for auth operations
  async renewToken(@CurrentUser() jwtUser: JwtPayload): Promise<AuthResponse> {
    return this.authService.renewToken(jwtUser);
  }
}
