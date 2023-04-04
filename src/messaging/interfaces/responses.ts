import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreateMessageResponse {
  @Field()
  success: boolean
}

@ObjectType()
export class MessageResponse {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  body: string

  @Field()
  senderUserId: string

  @Field({ nullable: true })
  viewedAt: Date

  @Field({ nullable: true })
  receiverUserId?: string

  @Field({ nullable: true })
  groupId?: string
}

@ObjectType()
export class MessageErrorResponse {
  @Field()
  body: string

  @Field()
  senderUserId: string

  @Field()
  senderName: string

  @Field()
  receiverUserId?: string

  @Field()
  groupId?: string
}
