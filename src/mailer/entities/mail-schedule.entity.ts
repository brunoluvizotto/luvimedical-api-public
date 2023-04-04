import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'
import { MailRecipient } from './mail-recipient.entity'
import { MailTemplate } from './mail-template.entity'

@ObjectType()
export class MailSchedule {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  deletedAt: Date

  @Field({ nullable: true })
  lastRunAt: Date

  @Field()
  time: Date

  @Field()
  sunday: boolean

  @Field()
  monday: boolean

  @Field()
  tuesday: boolean

  @Field()
  wednesday: boolean

  @Field()
  thursday: boolean

  @Field()
  friday: boolean

  @Field()
  saturday: boolean

  @Field({ nullable: true })
  recipientUserId?: string

  @Field(() => User, { nullable: true })
  recipientUser?: User

  @Field(() => [MailRecipient], { defaultValue: [] })
  mailRecipients: MailRecipient[]

  @Field(() => [MailTemplate], { defaultValue: [] })
  mailTemplates: MailTemplate[]
}
