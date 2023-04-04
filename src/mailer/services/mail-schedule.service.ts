import { Injectable } from '@nestjs/common'
import { MailRecipient, MailSchedule, MailTemplate, Prisma, User } from '@prisma/client'
import { DateTime } from 'luxon'
import { PrismaService } from 'prisma/prisma.service'
import * as R from 'ramda'
import { CreateMailScheduleInput } from '~mailer/types/mail-schedule.type'
// import { MailSchedule } from '../entities/mail-schedule.entity'

export type MailScheduleWithInclude = MailSchedule & {
  mailRecipients: MailRecipient[]
  mailTemplates: MailTemplate[]
  recipientUser: User
}

const include = {
  mailRecipients: true,
  mailTemplates: true,
  recipientUser: true,
}

@Injectable()
export class MailScheduleService {
  constructor(private prisma: PrismaService) {}

  async find(options: Prisma.MailScheduleFindManyArgs) {
    const optionsObj = R.clone(options)
    return this.prisma.mailSchedule.findMany(optionsObj)
  }

  async findOneById(id: string) {
    return this.prisma.mailSchedule.findUnique({
      where: { id },
      include,
    })
  }

  async findByDateInterval(options: Prisma.MailScheduleFindManyArgs, startDate: string, endDate: string) {
    return this.prisma.mailSchedule.findMany({
      ...options,
      where: {
        OR: [
          {
            ...options.where,
            time: {
              gte: DateTime.fromISO(startDate).toFormat('HH:mm:ss ZZZ'),
              lte: DateTime.fromISO(endDate).toFormat('HH:mm:ss ZZZ'),
            },
            lastRunAt: {
              not: {
                gte: DateTime.fromISO(startDate).toISO(),
                lte: DateTime.fromISO(endDate).toISO(),
              },
            },
          },
          {
            ...options.where,
            time: {
              gte: DateTime.fromISO(startDate).toFormat('HH:mm:ss ZZZ'),
              lte: DateTime.fromISO(endDate).toFormat('HH:mm:ss ZZZ'),
            },
            lastRunAt: null,
          },
        ],
      },
      include,
    })
  }

  async create(payload: CreateMailScheduleInput) {
    return this.prisma.mailSchedule.create({
      data: payload,
      include,
    })
  }

  async update(
    mailSchedule: MailScheduleWithInclude,
    payload: Partial<MailScheduleWithInclude>,
    recipientIds: string[],
    mailTemplateIds: string[]
  ) {
    const { recipientUserId, recipientUser, mailRecipients, mailTemplates, ...restOfPayload } = payload
    return this.prisma.mailSchedule.update({
      where: { id: mailSchedule.id },
      data: {
        ...restOfPayload,
        ...(recipientIds && {
          mailRecipients: {
            disconnect: mailSchedule.mailRecipients.map(recipient => ({ id: recipient.id })),
            connect: recipientIds.map(recipientId => ({ id: recipientId })),
          },
        }),
        ...(mailTemplateIds && {
          mailTemplates: {
            disconnect: mailSchedule.mailTemplates.map(template => ({ id: template.id })),
            connect: mailTemplateIds.map(templateId => ({ id: templateId })),
          },
        }),
      },
      include,
    })
  }

  async updateMany(mailSchedules: MailScheduleWithInclude[], payload: Partial<MailScheduleWithInclude>) {
    const { mailRecipients, mailTemplates, ...restOfPayload } = payload

    const mailScheduleIds = mailSchedules.map(mailSchedule => mailSchedule.id)
    const currentMailScheduleRecipientIds = mailSchedules
      .map(mailSchedule => mailSchedule.mailRecipients.map(recipient => ({ id: recipient.id })))
      .flat()
    const currentMailScheduleTemplateIds = mailSchedules
      .map(mailSchedule => mailSchedule.mailTemplates.map(template => ({ id: template.id })))
      .flat()
    const recipientIds = mailRecipients.map(recipient => ({ id: recipient.id }))
    const templateIds = mailTemplates.map(template => ({ id: template.id }))

    return this.prisma.mailSchedule.updateMany({
      where: { id: { in: mailScheduleIds } },
      data: {
        ...restOfPayload,
        ...(recipientIds && {
          mailRecipients: {
            disconnect: currentMailScheduleRecipientIds,
            connect: recipientIds,
          },
        }),
        ...(templateIds && {
          mailTemplates: {
            disconnect: currentMailScheduleTemplateIds,
            connect: templateIds,
          },
        }),
      },
    })
  }

  async softDeleteById(id: string) {
    return this.prisma.mailSchedule.delete({ where: { id } })
  }
}
