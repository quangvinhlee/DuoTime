import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  ReminderType,
  ReminderStatus,
  ReminderTargetType,
} from '@prisma/client';
import { UserType } from '../../shared/graphql/types';

// Register GraphQL enums
registerEnumType(ReminderType, {
  name: 'ReminderType',
  description: 'The type of reminder',
});

registerEnumType(ReminderStatus, {
  name: 'ReminderStatus',
  description: 'The status of a reminder',
});

registerEnumType(ReminderTargetType, {
  name: 'ReminderTargetType',
  description: 'Who the reminder is for',
});

@ObjectType()
export class ReminderGraphQLType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Date)
  scheduledAt: Date;

  @Field(() => ReminderType)
  type: ReminderType;

  @Field(() => ReminderStatus)
  status: ReminderStatus;

  @Field(() => Boolean)
  isRecurring: boolean;

  @Field(() => String, { nullable: true })
  recurringPattern?: string | null;

  @Field(() => ReminderTargetType)
  targetType: ReminderTargetType;

  @Field(() => String)
  createdById: string;

  @Field(() => String, { nullable: true })
  recipientId?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => UserType, { nullable: true })
  createdBy?: UserType | null;

  @Field(() => UserType, { nullable: true })
  recipient?: UserType | null;
}
