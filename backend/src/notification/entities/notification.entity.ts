import { ObjectType, Field, ID } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  type: NotificationType;

  @Field(() => String)
  title: string;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  isRead: boolean;

  @Field(() => Date)
  sentAt: Date;

  @Field(() => String, { nullable: true })
  reminderId?: string;

  @Field(() => String)
  userId: string;
}
