import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt'
import { randomBytes } from 'crypto'
import { DateTime } from 'luxon'
import { PrismaService } from 'prisma/prisma.service'
import { EnvironmentVariables } from '~common/config'
import { EmailSenderService } from '~mailer/services/email-sender.service'
import { User } from './entities/user.entity'
import { CreateUserInput } from './types/user.type'

const include = {
  physician: {
    include: {
      appointments: true,
      leaves: true,
      patientRecords: true,
      workingHours: true,
    },
  },
  roles: {
    include: { permissions: true },
  },
}

@Injectable()
export class UsersService {
  protected timezone: string
  protected defaultPassword: string

  constructor(
    private prisma: PrismaService,
    private readonly emailSenderService: EmailSenderService,
    private config: ConfigService
  ) {
    this.timezone = this.config.get<EnvironmentVariables['server']['timezone']>('server.timezone')
    this.defaultPassword = this.config.get<EnvironmentVariables['defaultUserPassword']>('defaultUserPassword')
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include,
    })
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include,
    })
  }

  async find(options: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany({ ...options, include })
  }

  async getChatUsers(currentUserId: string) {
    return this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        name: { not: 'Master Admin' },
        activated: true,
      },
      include,
    })
  }

  async checkIfNewEmail(email: string) {
    const count = await this.prisma.user.count({ where: { email } })
    return count === 0
  }

  async create(payload: CreateUserInput, roleIds?: string[]) {
    const hashedPassword = await hashPassword(payload.password || this.defaultPassword)
    const activationToken = randomBytes(48).toString('hex')
    const activationTokenExpirationDate = DateTime.now().setZone(this.timezone).plus({ days: 2 }).toISO()

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        ...(roleIds && { roles: { connect: roleIds.map(roleId => ({ id: roleId })) } }),
        password: hashedPassword,
        activationToken,
        activationTokenExpirationDate,
      },
      include,
    })

    await this.emailSenderService.sendUserActivationEmail(user)

    return user
  }

  async update(user: User, payload: Prisma.UserUpdateInput, roleIds?: string[]) {
    const password = await hashPassword(payload.password)
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...payload,
        ...(password && { password }),
        ...(roleIds && {
          roles: {
            disconnect: user.roles.map(role => ({
              id: role.id,
            })),
            connect: roleIds.map(roleId => ({ id: roleId })),
          },
        }),
      },
      include,
    })
  }

  async activate(token: string, password: string) {
    const now = DateTime.now().setZone(this.timezone)

    const user = await this.prisma.user.findFirst({
      where: {
        activated: false,
        activationToken: token,
      },
    })

    if (!user) {
      throw new NotFoundException({ message: 'User not found' })
    }

    const tokenExpiration = DateTime.fromJSDate(user.activationTokenExpirationDate).setZone(this.timezone)
    if (tokenExpiration < now) {
      throw new ForbiddenException({ message: 'Token expired' })
    }

    const hashedPassword = await hashPassword(password)
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        activated: true,
        activationToken: null,
        activationTokenExpirationDate: null,
      },
      include,
    })
  }
}

function hashPassword(password?: Prisma.StringFieldUpdateOperationsInput | string) {
  if (!password) {
    return
  }

  const stringPassword = typeof password === 'string' ? password : password.set
  return hash(stringPassword, 12)
}
