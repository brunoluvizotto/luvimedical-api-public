import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { MailSchedule } from '~mailer/entities/mail-schedule.entity'
import { CreateMailRecipientInput } from './mail-recipient.type'

@InputType()
export class CreateMailScheduleInput extends OmitType(
  MailSchedule,
  [
    'id',
    'createdAt',
    'updatedAt',
    'lastRunAt',
    'recipientUser',
    'mailRecipients',
    'mailTemplates',
    'recipientUserId',
  ] as const,
  InputType
) {
  @Field({ nullable: true })
  recipientUserId?: string
}

@InputType()
export class UpdateMailSchedulePayload extends OmitType(
  CreateMailScheduleInput,
  ['time', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'recipientUserId'] as const,
  InputType
) {
  @Field({ nullable: true })
  time: Date

  @Field({ nullable: true })
  sunday: boolean

  @Field({ nullable: true })
  monday: boolean

  @Field({ nullable: true })
  tuesday: boolean

  @Field({ nullable: true })
  wednesday: boolean

  @Field({ nullable: true })
  thursday: boolean

  @Field({ nullable: true })
  friday: boolean

  @Field({ nullable: true })
  saturday: boolean

  @Field({ nullable: true })
  recipientUserId?: string

  @Field(() => [CreateMailRecipientInput], { nullable: true })
  mailRecipients?: CreateMailRecipientInput[]

  @Field(() => [String], { nullable: true })
  mailTemplateIds?: string[]
}

@ObjectType()
export class MailScheduleResponse {
  @Field(() => MailSchedule)
  mailSchedule: MailSchedule
}
