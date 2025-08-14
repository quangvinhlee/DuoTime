import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

// Ensure enum is exposed to GraphQL schema as enum rather than String
registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'The type of notification',
});

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => NotificationType)
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
