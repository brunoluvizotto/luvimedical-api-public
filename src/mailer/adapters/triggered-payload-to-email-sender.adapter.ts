import { EnvironmentVariables } from '~common/config'
import { EmailSendingPayload } from '~mailer/services/email-sender.service'
import { TriggeredPayload } from './mail-schedule-to-triggered-payload.adapter'

export function triggeredPayloadToEmailSender(
  payload: TriggeredPayload,
  sender: EnvironmentVariables['mailer']['email']['sender']
): EmailSendingPayload {
  return {
    subject: payload.subject,
    body: payload.body,
    recipients: payload.recipients,
    templateName: payload.mailTemplateName,
    user: payload.user,
    sender,
  }
}
