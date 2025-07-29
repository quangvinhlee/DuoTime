import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GoogleLoginInput } from './dtos/auth.dto';
import { AuthResponse } from './responses/auth.response';
import { UserType } from 'src/shared/graphql/types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async googleLogin(
    @Args('googleLoginInput') googleLoginInput: GoogleLoginInput,
  ): Promise<AuthResponse> {
    const user = await this.authService.googleLogin(googleLoginInput);
    return { user: user as UserType };
  }
}
