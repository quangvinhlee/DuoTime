import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GoogleLoginInput } from './dtos/auth.dto';
import { AuthResponse } from './responses/auth.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async googleLogin(
    @Args('googleLoginInput') googleLoginInput: GoogleLoginInput,
  ): Promise<AuthResponse> {
    return this.authService.googleLogin(googleLoginInput);
  }
}
