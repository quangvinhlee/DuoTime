import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PartnerBindingEvent {
  @Field(() => ID)
  id: string;

  @Field()
  type: 'CREATED' | 'ACCEPTED' | 'REJECTED' | 'REMOVED';

  @Field(() => ID)
  senderId: string;

  @Field(() => ID)
  receiverId: string;

  @Field({ nullable: true })
  senderName?: string;

  @Field({ nullable: true })
  receiverName?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class PartnerStatusUpdate {
  @Field(() => ID)
  userId: string;

  @Field()
  hasPartner: boolean;

  @Field(() => ID, { nullable: true })
  partnerId?: string;

  @Field({ nullable: true })
  partnerName?: string;

  @Field()
  updatedAt: Date;
}
