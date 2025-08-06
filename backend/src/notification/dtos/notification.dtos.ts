import { InputType, Field, Int } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  type: NotificationType;

  @Field(() => String)
  title: string;

  @Field(() => String)
  message: string;

  @Field(() => String)
  userId: string;

  @Field(() => String, { nullable: true })
  reminderId?: string;

  @Field(() => String, { nullable: true })
  metadata?: string; // JSON string for metadata
}

@InputType()
export class GetNotificationsInput {
  @Field(() => Int, { defaultValue: 20 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}

@InputType()
export class GetNotificationsByTypeInput {
  @Field(() => String)
  type: NotificationType;

  @Field(() => Int, { defaultValue: 20 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}

@InputType()
export class MarkNotificationAsReadInput {
  @Field(() => String)
  notificationId: string;
}

@InputType()
export class DeleteNotificationInput {
  @Field(() => String)
  notificationId: string;
}

@InputType()
export class NotificationTypeInput {
  @Field(() => String)
  type: NotificationType;
}
