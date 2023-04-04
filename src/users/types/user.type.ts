import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'

@InputType()
export class CreateUserInput {
  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  password?: string

  @Field(() => [String], { defaultValue: [] })
  roles?: string[]

  @Field({ nullable: true })
  physicianId?: string
}

@InputType()
export class UpdateUserPayload {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  activated?: boolean

  @Field(() => [String], { nullable: true })
  roles?: string[]

  @Field({ nullable: true })
  physicianId?: string
}

@ObjectType()
export class UserResponse {
  @Field(() => User)
  user: User
}
