import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field(() => String)
  idToken: string;
}
