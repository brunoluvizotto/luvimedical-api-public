import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { MailTemplatesContactMethodEnum } from '@prisma/client'
import { MailSchedule } from './mail-schedule.entity'

@ObjectType()
export class MailTemplate {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  deletedAt: Date

  @Field()
  name: string

  @Field({ nullable: true })
  subject: string

  @Field()
  body: string

  @Field(() => MailTemplatesContactMethodEnum)
  contactMethod: MailTemplatesContactMethodEnum

  @Field(() => [MailSchedule])
  mailSchedules?: MailSchedule[]
}

registerEnumType(MailTemplatesContactMethodEnum, { name: 'MailTemplatesContactMethodEnum' })
