import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PartnerBindingResponse {
  @Field()
  id: string;

  @Field()
  invitationCode: string;

  @Field()
  expiresAt: string;

  @Field()
  status: string;
}


