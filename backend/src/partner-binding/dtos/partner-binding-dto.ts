// backend/src/partner-binding/dtos/partner-binding-dto.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePartnerBindingDto {
  @Field({ nullable: true })
  receiverId?: string;
}

@InputType()
export class AcceptPartnerBindingDto {
  @Field()
  invitationCode: string;
}
