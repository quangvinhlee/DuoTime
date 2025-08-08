import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadAvatarResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;
}

@ObjectType()
export class UpdateProfileResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true })
  name?: string;
}

@ObjectType()
export class DeleteAvatarResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}
