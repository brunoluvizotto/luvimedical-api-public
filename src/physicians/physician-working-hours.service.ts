import { Injectable } from '@nestjs/common'
import { DateTime } from 'luxon'
import { PrismaService } from 'prisma/prisma.service'
import {
  CreatePhysicianWorkingHoursInput,
  UpdatePhysicianWorkingHoursPayload,
} from './types/physician-working-hours.type'

const include = {
  physician: true,
}

@Injectable()
export class PhysicianWorkingHoursService {
  constructor(private prisma: PrismaService) {}

  async findByDateInterval(physicianId: string, startDate: string, endDate: string) {
    return this.prisma.physicianWorkingHours.findMany({
      where: {
        physicianId,
        startTime: { gte: DateTime.fromISO(startDate).toISO() },
        endTime: { lte: DateTime.fromISO(endDate).toISO() },
      },
      orderBy: { startTime: 'asc' },
      include,
    })
  }

  async findOneById(id: string) {
    return this.prisma.physicianWorkingHours.findUnique({ where: { id }, include })
  }

  async create(payload: CreatePhysicianWorkingHoursInput) {
    const { startTime, endTime } = payload
    return this.prisma.physicianWorkingHours.create({
      data: {
        ...payload,
        startTime: DateTime.fromISO(startTime).toJSDate(),
        endTime: DateTime.fromISO(endTime).toJSDate(),
      },
      include,
    })
  }

  async update(id: string, payload: UpdatePhysicianWorkingHoursPayload) {
    const { startTime, endTime, ...restOfPayload } = payload
    return this.prisma.physicianWorkingHours.update({
      where: { id },
      data: {
        ...restOfPayload,
        startTime: DateTime.fromISO(startTime).toISO(),
        endTime: DateTime.fromISO(endTime).toISO(),
      },
      include,
    })
  }

  async deleteById(id: string) {
    return this.prisma.physicianWorkingHours.delete({ where: { id } })
  }
}
