import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { MailTemplatesContactMethodEnum } from '@prisma/client'
import { MailTemplate } from '~mailer/entities/mail-template.entity'

@InputType()
export class CreateMailTemplateInput extends OmitType(
  MailTemplate,
  ['id', 'createdAt', 'updatedAt', 'mailSchedules'] as const,
  InputType
) {}

@InputType()
export class UpdateMailTemplatePayload extends OmitType(CreateMailTemplateInput, [
  'name',
  'body',
  'subject',
  'contactMethod',
]) {
  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  body: string

  @Field({ nullable: true })
  subject: string

  @Field(() => MailTemplatesContactMethodEnum, { nullable: true })
  contactMethod: MailTemplatesContactMethodEnum
}

@ObjectType()
export class MailTemplateResponse {
  @Field(() => MailTemplate)
  mailTemplate: MailTemplate
}
