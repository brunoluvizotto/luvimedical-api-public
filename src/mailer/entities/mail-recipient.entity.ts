import { Field, ObjectType } from '@nestjs/graphql'
import { MailSchedule } from './mail-schedule.entity'

@ObjectType()
export class MailRecipient {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field({ nullable: true })
  email: string

  @Field({ nullable: true })
  phoneNumber: string

  @Field(() => MailSchedule)
  mailSchedule: MailSchedule
}
