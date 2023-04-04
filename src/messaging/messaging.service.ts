import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { MAX_MESSAGES_TO_RETURN } from './constants'

const include = {
  receiverUser: true,
  senderUser: true,
}

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string) {
    return this.prisma.message.findUnique({ where: { id }, include })
  }

  async create(payload: Prisma.MessageUncheckedCreateInput) {
    return this.prisma.message.create({
      data: payload,
      include,
    })
  }

  async messagesBetweenUsers(userId1: string, userId2: string) {
    const filter = {
      where: {
        OR: [
          {
            senderUserId: userId1,
            receiverUserId: userId2,
          },
          {
            senderUserId: userId2,
            receiverUserId: userId1,
          },
        ],
      },
    }

    const messagesCount = await this.prisma.message.count(filter)
    const skip = Math.max(messagesCount - MAX_MESSAGES_TO_RETURN, 0)

    return this.prisma.message.findMany({
      ...filter,
      orderBy: {
        createdAt: 'asc',
      },
      skip,
    })
  }

  async messagesByGroup(groupId: string) {
    const messagesCount = await this.prisma.message.count({ where: { groupId } })
    const skip = Math.max(messagesCount - MAX_MESSAGES_TO_RETURN, 0)

    return this.prisma.message.findMany({
      where: {
        groupId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip,
    })
  }

  async setMessagesViewed(ids: string[]): Promise<boolean> {
    const result = await this.prisma.message.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        viewedAt: new Date(),
      },
    })
    return result.count === ids.length
  }
}
