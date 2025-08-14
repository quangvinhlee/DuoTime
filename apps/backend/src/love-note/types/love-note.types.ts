import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LoveNoteUserType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;
}

@ObjectType()
export class LoveNoteType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  title?: string | null;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  isRead: boolean;

  @Field(() => String)
  senderId: string;

  @Field(() => String)
  recipientId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => LoveNoteUserType, { nullable: true })
  sender?: LoveNoteUserType | null;

  @Field(() => LoveNoteUserType, { nullable: true })
  recipient?: LoveNoteUserType | null;
}

@ObjectType()
export class LoveNoteResponse {
  @Field(() => LoveNoteType)
  loveNote: LoveNoteType;

  @Field(() => String)
  message: string;
}
