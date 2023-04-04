import { Controller, Inject, Logger, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices'
import { MailTemplatesContactMethodEnum } from '@prisma/client'
import { DateTime } from 'luxon'
import { Client } from 'node-mailjet'
import { EnvironmentVariables } from '~common/config'
import {
  mailScheduleToTriggeredPayloads,
  TriggeredPayload,
} from './adapters/mail-schedule-to-triggered-payload.adapter'
import { triggeredPayloadToEmailSender } from './adapters/triggered-payload-to-email-sender.adapter'
import { MAILER, MESSAGE_PATTERNS } from './constants'
import { EmailSenderService } from './services/email-sender.service'
import { MailScheduleService, MailScheduleWithInclude } from './services/mail-schedule.service'
const Mailjet = require('node-mailjet')

@Controller('mailer')
export class MailerController {
  protected timezone: string
  protected mailjet: Client

  constructor(
    private config: ConfigService,
    private readonly mailScheduleService: MailScheduleService,
    private readonly emailSenderService: EmailSenderService,
    @Inject(MAILER.API_RBMQ_MAILER_PROXY_TOKEN) private rbmqProxy: ClientProxy
  ) {
    this.timezone = this.config.get<EnvironmentVariables['server']['timezone']>('server.timezone')
    const mailjetConfigs = this.config.get<EnvironmentVariables['mailer']['email']['mailJet']>('mailer.email.mailJet')
    this.mailjet = Mailjet.apiConnect(mailjetConfigs.apiKey, mailjetConfigs.apiSecret)
  }

  @Post('/check-for-scheduled-messages')
  async checkForScheduledMessages() {
    const schedules = await this.getSchedulesToSend()
    const scheduleMessagePayloads = await this.getScheduleMessagePayloads(schedules)
    await this.emitSendMailMessages(scheduleMessagePayloads)
    this.markSchedulesAsSent(schedules)

    return { message: `Published ${scheduleMessagePayloads.length} messages` }
  }

  private getSchedulesToSend() {
    const now = DateTime.now().setZone(this.timezone)
    const today = now.toFormat('cccc').toLowerCase()
    const rangeOffset = { seconds: 40 }
    const startOfInterval = now.minus(rangeOffset).toISO()
    const endOfInterval = now.plus(rangeOffset).toISO()

    return this.mailScheduleService.findByDateInterval(
      {
        where: {
          [today]: true,
        },
      },
      startOfInterval,
      endOfInterval
    )
  }

  private async getScheduleMessagePayloads(schedules: MailScheduleWithInclude[]) {
    const nestedTriggeredPayloads = await Promise.all(schedules.map(mailScheduleToTriggeredPayloads))
    return nestedTriggeredPayloads.flat(1)
  }

  private async emitSendMailMessages(payloads: TriggeredPayload[]) {
    payloads.forEach(payload => {
      this.rbmqProxy.emit(MESSAGE_PATTERNS.SEND_MAIL_TRIGGERED, payload)
    })
  }

  private markSchedulesAsSent(schedules: MailScheduleWithInclude[]) {
    return this.mailScheduleService.updateMany(schedules, {
      lastRunAt: DateTime.now().setZone(this.timezone).toJSDate(),
    })
  }

  @EventPattern(MESSAGE_PATTERNS.SEND_MAIL_TRIGGERED)
  async handleSendMailTriggered(@Payload() payload: TriggeredPayload) {
    if (payload.contactMethod === MailTemplatesContactMethodEnum.email) {
      try {
        const sender = this.config.get<EnvironmentVariables['mailer']['email']['sender']>('mailer.email.sender')
        await this.emailSenderService.sendEmail(triggeredPayloadToEmailSender(payload, sender))
      } catch (err) {
        Logger.error(`Error sending email`, err)
      }
    } else {
      throw new Error(`Contact method not implemented ${payload.contactMethod}`)
    }
  }
}
