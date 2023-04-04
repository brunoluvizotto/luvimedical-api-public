import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Role } from 'users/entities/role.entity'
import { User } from 'users/entities/user.entity'

@InputType()
export class SignUpInput {
  @Field()
  name: string

  @Field()
  email: string

  @Field()
  password: string

  @Field({ nullable: true })
  physicianId?: string

  roles?: Role[]
}

@ObjectType()
export class SignUpResponse {
  @Field(() => User)
  user: User
}
