import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateMessageInput {
  @Field()
  body: string

  @Field({ nullable: true })
  receiverUserId?: string

  @Field({ nullable: true })
  groupId?: string
}

@InputType()
export class MessageCreatedInput {
  @Field()
  accessToken: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  subscribedGroup?: string
}

@InputType()
export class MessagesInput {
  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  groupId?: string
}

@InputType()
export class MessageErrorInput {
  @Field()
  accessToken: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  subscribedGroup?: string
}
