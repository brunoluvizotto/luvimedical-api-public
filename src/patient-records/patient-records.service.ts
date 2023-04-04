import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

const include = {
  appointment: true,
  patient: true,
  physician: true,
}

@Injectable()
export class PatientRecordsService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string) {
    return this.prisma.patientRecord.findUnique({
      where: { id },
      include,
    })
  }

  async find(options: Prisma.PatientRecordFindManyArgs) {
    return this.prisma.patientRecord.findMany({ ...options, include })
  }

  async create(params: Prisma.PatientRecordCreateArgs) {
    return this.prisma.patientRecord.create({ ...params, include })
  }

  async update(params: { where: Prisma.PatientRecordWhereUniqueInput; data: Prisma.PatientRecordUpdateInput }) {
    const { data, where } = params
    return this.prisma.patientRecord.update({
      data,
      where,
      include,
    })
  }
}
