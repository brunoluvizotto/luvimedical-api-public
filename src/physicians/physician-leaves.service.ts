import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { PhysicianLeave } from './entities/physician-leave.entity'
import { CreatePhysicianLeaveInput } from './types/physician-leave.type'

const include = {
  physician: true,
}

@Injectable()
export class PhysicianLeavesService {
  constructor(private prisma: PrismaService) {}

  async findByDateInterval(physicianId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.physicianLeave.findMany({
      where: {
        physicianId,
        ...(startDate && { startTime: { gte: startDate } }),
        ...(startDate &&
          endDate && {
            startTime: { lte: endDate },
            endTime: { gte: startDate },
          }),
      },
      orderBy: { startTime: 'asc' },
      include,
    })
  }

  async findOneById(id: string) {
    return this.prisma.physicianLeave.findUnique({ where: { id }, include })
  }

  async create(payload: CreatePhysicianLeaveInput) {
    const { physicianId, startTime, endTime, ...restOfPayload } = payload
    return this.prisma.physicianLeave.create({
      data: {
        ...restOfPayload,
        startTime: startTime,
        endTime: endTime,
        physician: {
          connect: { id: physicianId },
        },
      },
      include,
    })
  }

  async update(id: string, payload: Partial<PhysicianLeave>) {
    const { physicianId, physician, startTime, endTime, ...restOfPayload } = payload
    return this.prisma.physicianLeave.update({
      where: { id },
      data: {
        ...restOfPayload,
        startTime: startTime,
        endTime: endTime,
      },
      include,
    })
  }

  async deleteById(id: string) {
    return this.prisma.physicianLeave.delete({ where: { id } })
  }
}
