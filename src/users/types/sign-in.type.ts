import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'

@InputType()
export class SignInInput {
  @Field()
  email: string

  @Field()
  password: string
}

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string

  @Field()
  refreshToken: string

  @Field(() => User)
  user: User
}
