import { Query, Resolver } from '@nestjs/graphql';
import { NoThrottle } from './common/decorators/throttle.decorator';

@Resolver()
export class AppResolver {
  @Query(() => String)
  @NoThrottle() // Health check endpoint - no throttling needed
  sayHello(): string {
    return 'Hello World!';
  }
}
