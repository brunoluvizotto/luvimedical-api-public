import { Field, ObjectType } from '@nestjs/graphql'
import { Permission } from './permission.entity'

@ObjectType()
export class Role {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  name: string

  @Field(() => [Permission])
  permissions: Permission[]
}
