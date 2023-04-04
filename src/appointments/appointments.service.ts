import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { Appointment } from './entities/appointment.entity'

const include = {
  patient: {
    include: {
      records: {
        include: {
          physician: true,
        },
      },
    },
  },
  patientRecord: true,
  physician: true,
}

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async find(options: Prisma.AppointmentFindManyArgs) {
    return this.prisma.appointment.findMany({
      ...options,
      include,
    })
  }

  async findOneById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include,
    })
  }

  async findByDateInterval(options: Prisma.AppointmentFindManyArgs, startDate?: Date, endDate?: Date) {
    const where: Prisma.AppointmentWhereInput = {
      ...options.where,
      ...(startDate && { startTime: { gte: startDate } }),
      ...(endDate && { endTime: { lte: endDate } }),
    }
    return this.prisma.appointment.findMany({
      ...options,
      where,
      include,
    })
  }

  async create(params: Prisma.AppointmentCreateArgs) {
    return this.prisma.appointment.create({ ...params, include })
  }

  async update(id: string, payload: Partial<Appointment>) {
    const { physicianId, patientRecordId, patientId, patient, ...rest } = payload
    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(physicianId && { physician: { connect: { id: physicianId } } }),
        ...(patientRecordId && { patientRecord: { connect: { id: patientRecordId } } }),
      },
      include,
    })
  }
}
