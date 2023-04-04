import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Permission {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  name: string
}
