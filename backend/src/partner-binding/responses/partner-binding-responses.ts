import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PartnerBindingResponse {
  @Field(() => String)
  id: string;

  @Field(() => String)
  invitationCode: string;

  @Field(() => String)
  status: string;

  @Field(() => String)
  expiresAt: string;
}
