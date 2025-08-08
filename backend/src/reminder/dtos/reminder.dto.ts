import { InputType, Field, Int } from '@nestjs/graphql';
import { ReminderType, ReminderTargetType } from '@prisma/client';

@InputType()
export class CreateReminderInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  scheduledAt: Date;

  @Field(() => ReminderType)
  type: ReminderType;

  @Field(() => ReminderTargetType, { defaultValue: ReminderTargetType.FOR_ME })
  targetType: ReminderTargetType;

  @Field(() => String, { nullable: true })
  recipientId?: string;

  @Field(() => Boolean, { defaultValue: false })
  isRecurring: boolean;

  @Field(() => String, { nullable: true })
  recurringPattern?: string;
}

@InputType()
export class UpdateReminderInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  scheduledAt?: Date;

  @Field(() => ReminderType, { nullable: true })
  type?: ReminderType;

  @Field(() => ReminderTargetType, { nullable: true })
  targetType?: ReminderTargetType;

  @Field(() => String, { nullable: true })
  recipientId?: string;

  @Field(() => Boolean, { nullable: true })
  isRecurring?: boolean;

  @Field(() => String, { nullable: true })
  recurringPattern?: string;
}

@InputType()
export class GetRemindersInput {
  @Field(() => Int, { defaultValue: 20 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;

  @Field(() => ReminderTargetType, { nullable: true })
  targetType?: ReminderTargetType;

  @Field(() => ReminderType, { nullable: true })
  type?: ReminderType;
}
