import { Field, InputType } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import FileUpload from 'graphql-upload/Upload.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@InputType()
export class UpdateProfileInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name must be less than 100 characters' })
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2048, { message: 'Avatar URL must be less than 2048 characters' })
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;
}

@InputType()
export class SearchUsersInput {
  @Field(() => String)
  @IsString()
  @MinLength(1, { message: 'Search query must not be empty' })
  @MaxLength(50, { message: 'Search query must be less than 50 characters' })
  query: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  excludeUserId?: string;
}

@InputType()
export class UploadAvatarInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name must be less than 100 characters' })
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  avatarBase64?: string;
}
