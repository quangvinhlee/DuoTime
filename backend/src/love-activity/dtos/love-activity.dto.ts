import { InputType, Field, Int } from '@nestjs/graphql';
import { ActivityType } from '@prisma/client';

@InputType()
export class CreateLoveActivityInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ActivityType)
  type: ActivityType;

  @Field(() => Date)
  date: Date;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String)
  receiverId: string;
}

@InputType()
export class UpdateLoveActivityInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ActivityType, { nullable: true })
  type?: ActivityType;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => String, { nullable: true })
  location?: string;
}

@InputType()
export class GetLoveActivitiesInput {
  @Field(() => Int, { defaultValue: 20 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;

  @Field(() => ActivityType, { nullable: true })
  type?: ActivityType;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;
}

@InputType()
export class ConfirmLoveActivityInput {
  @Field(() => String)
  activityId: string;

  @Field(() => Boolean)
  confirm: boolean; // true to confirm, false to reject
}
