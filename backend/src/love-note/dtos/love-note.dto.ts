import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateLoveNoteInput {
  @Field(() => String)
  title?: string;

  @Field(() => String)
  message: string;

  @Field(() => String)
  recipientId: string;
}

@InputType()
export class UpdateLoveNoteInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Boolean, { nullable: true })
  isRead?: boolean;
}

@InputType()
export class GetLoveNotesInput {
  @Field(() => Int, { defaultValue: 20 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;

  @Field(() => Boolean, { nullable: true })
  isRead?: boolean;
}
