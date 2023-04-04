import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'

@ObjectType()
export class Message {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  senderUserId: string
  @Field(() => User)
  senderUser: User

  @Field({ nullable: true })
  receiverUserId: string
  @Field(() => User, { nullable: true })
  receiverUser?: User

  @Field({ nullable: true })
  groupId?: string

  @Field()
  body: string

  @Field({ nullable: true })
  viewedAt: Date
}
