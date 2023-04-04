import { Injectable } from '@nestjs/common'
import { MailTemplatesContactMethodEnum, Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateMailTemplateInput } from '~mailer/types/mail-template.type'
import { MailTemplate } from '../entities/mail-template.entity'

const include = { mailSchedules: true }

@Injectable()
export class MailTemplateService {
  constructor(private prisma: PrismaService) {}

  async find(options: Prisma.MailTemplateFindManyArgs) {
    return this.prisma.mailTemplate.findMany(options)
  }

  async findOneById(id: string) {
    return this.prisma.mailTemplate.findUnique({ where: { id }, include })
  }

  async findOneByNameAndContactMethod(name: string, contactMethod: MailTemplatesContactMethodEnum) {
    return this.prisma.mailTemplate.findUnique({
      where: {
        name_contactMethod: { name, contactMethod },
      },
      include,
    })
  }

  async findByIds(ids: string[]) {
    return this.prisma.mailTemplate.findMany({ where: { id: { in: ids } }, include })
  }

  async create(payload: CreateMailTemplateInput) {
    return this.prisma.mailTemplate.create({
      data: payload,
      include,
    })
  }

  async update(id: string, payload: Partial<MailTemplate>) {
    const { mailSchedules, ...rest } = payload
    return this.prisma.mailTemplate.update({
      where: { id },
      data: rest,
      include,
    })
  }

  async softDeleteById(id: string) {
    return this.prisma.mailTemplate.delete({ where: { id } })
  }
}

/**
 * 
        ...(roleIds && {
          roles: {
            disconnect: user.roles.map(role => ({
              id: role.id,
            })),
            connect: roleIds.map(roleId => ({ id: roleId })),
          },
        }),
 */
