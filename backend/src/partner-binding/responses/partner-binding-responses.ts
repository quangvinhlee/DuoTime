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

@ObjectType()
export class RejectPartnerBindingResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
export class RemovePartnerResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
