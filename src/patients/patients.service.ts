import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

const include = {
  address: true,
  records: true,
  appointments: true,
}

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async find(options: Prisma.PatientFindManyArgs) {
    return this.prisma.patient.findMany({ ...options, include })
  }

  async findAndCount(options: Prisma.PatientFindManyArgs) {
    const [items, count] = await Promise.all([
      this.prisma.patient.findMany({ ...options, include }),
      this.prisma.patient.count({ where: options.where }),
    ])
    return { items, count }
  }

  async findOneById(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include,
    })
  }

  async create(params: Prisma.PatientCreateArgs) {
    return this.prisma.patient.create(params)
  }

  async update(params: { where: Prisma.PatientWhereUniqueInput; data: Prisma.PatientUpdateInput }) {
    const { data, where } = params
    return this.prisma.patient.update({
      data,
      where,
      include: { address: true, appointments: true, records: true },
    })
  }
}
