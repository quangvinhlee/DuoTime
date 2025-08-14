import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { ActivityType, ActivityStatus } from '@prisma/client';

// Register enums for GraphQL
registerEnumType(ActivityType, {
  name: 'ActivityType',
  description: 'The type of love activity',
});

registerEnumType(ActivityStatus, {
  name: 'ActivityStatus',
  description: 'The status of a love activity',
});

@ObjectType()
export class LoveActivityUserType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;
}

@ObjectType()
export class LoveActivityType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => ActivityType)
  type: ActivityType;

  @Field(() => Date)
  date: Date;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => String)
  createdById: string;

  @Field(() => String)
  receiverId: string;

  @Field(() => String, { nullable: true })
  confirmedById?: string | null;

  @Field(() => ActivityStatus)
  status: ActivityStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  confirmedAt?: Date | null;

  @Field(() => LoveActivityUserType, { nullable: true })
  createdBy?: LoveActivityUserType | null;

  @Field(() => LoveActivityUserType, { nullable: true })
  confirmedBy?: LoveActivityUserType | null;
}

@ObjectType()
export class LoveActivityStatsType {
  @Field(() => Int)
  totalActivities: number;

  @Field(() => Int)
  thisMonthActivities: number;

  @Field(() => Int)
  currentStreak: number;

  @Field(() => Int)
  longestStreak: number;

  @Field(() => ActivityType, { nullable: true })
  mostCommonActivity?: ActivityType | null;

  @Field(() => Date, { nullable: true })
  lastActivityDate?: Date | null;
}
