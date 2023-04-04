import { MailRecipient, MailTemplatesContactMethodEnum, User } from '@prisma/client'
import { MailScheduleWithInclude } from '~mailer/services/mail-schedule.service'

export type TriggeredPayload = {
  mailScheduleId: string
  mailTemplateName: string
  subject: string
  body: string
  recipients: string[]
  contactMethod: MailTemplatesContactMethodEnum
  user?: User
}

export async function mailScheduleToTriggeredPayloads(
  mailSchedule: MailScheduleWithInclude
): Promise<TriggeredPayload[]> {
  const user = await mailSchedule.recipientUser
  const mailTemplates = await mailSchedule.mailTemplates
  const mailRecipients = await mailSchedule.mailRecipients
  return mailTemplates.map(mailTemplate => ({
    mailScheduleId: mailSchedule.id,
    mailTemplateName: mailTemplate.name,
    subject: mailTemplate.subject,
    body: mailTemplate.body,
    recipients: getRecipients(user, mailRecipients, mailTemplate.contactMethod),
    contactMethod: mailTemplate.contactMethod,
    user,
  }))
}

function getRecipients(
  user: User,
  mailRecipients: MailRecipient[],
  contactMethod: MailTemplatesContactMethodEnum
): string[] {
  const userMailRecipient: Partial<MailRecipient> = {
    email: user?.email,
    phoneNumber: user?.phoneNumber,
  }
  const recipients = [userMailRecipient, ...mailRecipients]
  return getRecipientsContacts(recipients, contactMethod)
}

function getRecipientsContacts(recipients: Partial<MailRecipient>[], contactMethod: MailTemplatesContactMethodEnum) {
  return recipients.reduce((acc, recipient) => {
    if (
      MailTemplatesContactMethodEnum.sms === contactMethod ||
      MailTemplatesContactMethodEnum.whatsapp === contactMethod
    ) {
      acc.push(recipient.phoneNumber)
    } else {
      acc.push(recipient.email)
    }
    return acc
  }, [])
}
