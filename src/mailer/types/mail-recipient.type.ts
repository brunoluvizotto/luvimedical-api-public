import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateMailRecipientInput {
  @Field({ nullable: true })
  email: string

  @Field({ nullable: true })
  phoneNumber: string
}

@InputType()
export class UpdateMailRecipientPayload extends CreateMailRecipientInput {}
