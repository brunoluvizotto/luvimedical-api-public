import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'

@InputType()
export class ActivateInput {
  @Field()
  token: string

  @Field()
  password: string
}

@ObjectType()
export class ActivateResponse {
  @Field()
  accessToken: string

  @Field()
  refreshToken: string

  @Field(() => User)
  user: User
}
