import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field(() => String)
  idToken: string;

  @Field(() => String, { nullable: true })
  pushToken?: string;
}

@InputType()
export class RenewTokenInput {
  @Field(() => String, { nullable: true })
  pushToken?: string;
}
