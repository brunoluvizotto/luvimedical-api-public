import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { MailRecipient } from '../entities/mail-recipient.entity'

@Injectable()
export class MailRecipientService {
  constructor(private prisma: PrismaService) {}

  async find(options: Prisma.MailRecipientFindManyArgs) {
    return this.prisma.mailRecipient.findMany(options)
  }

  async createMany(payloads: Partial<MailRecipient>[], mailScheduleId?: string) {
    return this.prisma.mailRecipient.createMany({
      data: {
        ...payloads,
        mailScheduleId,
      },
      skipDuplicates: true,
    })
  }
}
