import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailTemplatesContactMethodEnum, User } from '@prisma/client'
import * as Handlebars from 'handlebars'
import { DateTime } from 'luxon'
import { Client } from 'node-mailjet'
import { AppointmentsService } from '~appointments/appointments.service'
import { EnvironmentVariables } from '~common/config'
import { EMAIL_TEMPLATE_NAMES } from '~common/constants'
import { getFirstName, getTimeDiffInHours } from '~common/helpers'
import { MailTemplateService } from './mail-template.service'
const Mailjet = require('node-mailjet')

export type EmailSendingPayload = {
  templateName: string
  subject: string
  body: string
  recipients: string[]
  sender: {
    name: string
    email: string
  }
  user?: User
}

@Injectable()
export class EmailSenderService {
  protected timezone: string
  protected mailjet: Client

  constructor(
    private config: ConfigService,
    private mailTemplateService: MailTemplateService,
    private appointmentsService: AppointmentsService
  ) {
    this.timezone = this.config.get<EnvironmentVariables['server']['timezone']>('server.timezone')
    const mailjetConfigs = this.config.get<EnvironmentVariables['mailer']['email']['mailJet']>('mailer.email.mailJet')
    this.mailjet = Mailjet.apiConnect(mailjetConfigs.apiKey, mailjetConfigs.apiSecret)
  }

  async sendUserActivationEmail(user: User) {
    const template = await this.mailTemplateService.findOneByNameAndContactMethod(
      EMAIL_TEMPLATE_NAMES.WELCOME_AND_ACTIVATE,
      MailTemplatesContactMethodEnum.email
    )

    await this.sendEmail({
      body: template.body,
      subject: template.subject,
      templateName: template.name,
      sender: {
        name: 'Luvimedical',
        email: 'brunoluvizotto@gmail.com',
      },
      recipients: [user.email],
      user,
    })
  }

  async sendEmail(payload: EmailSendingPayload, context?: Record<string, any>) {
    const templateContext = await this.getTemplateContext(payload)
    const ctx = { ...templateContext, ...context }

    const body = Handlebars.compile(payload.body)(ctx)
    const subject = Handlebars.compile(payload.subject)(ctx)

    await this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: payload.sender.email,
            Name: payload.sender.name,
          },
          To: payload.recipients.map(recipient => ({ Email: recipient })),
          Subject: subject,
          HTMLPart: body,
        },
      ],
    })
  }

  private async getTemplateContext({ templateName, user }: EmailSendingPayload) {
    const now = DateTime.now().setZone(this.timezone)

    switch (templateName) {
      case EMAIL_TEMPLATE_NAMES.PHYSICIAN_DAILY_SCHEDULE:
        const startDate = now.plus({ days: 1 }).startOf('day').toJSDate()
        const endDate = now.plus({ days: 1 }).endOf('day').toJSDate()
        const appointments = await this.appointmentsService.findByDateInterval(
          {
            where: {
              physicianId: user.physicianId,
            },
          },
          startDate,
          endDate
        )
        return { appointments }

      case EMAIL_TEMPLATE_NAMES.WELCOME_AND_ACTIVATE:
        return {
          name: getFirstName(user.name),
          activationToken: user.activationToken,
          hoursToExpire: getTimeDiffInHours(now, user.activationTokenExpirationDate),
        }

      default:
        return {}
    }
  }
}
