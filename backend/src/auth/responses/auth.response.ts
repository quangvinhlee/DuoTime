import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from '../../shared/graphql/types';

@ObjectType()
export class AuthResponse {
  @Field(() => UserType)
  user: UserType;
}
