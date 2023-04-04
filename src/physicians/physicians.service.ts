import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { Physician } from './entities/physician.entity'
import { CreatePhysicianInput } from './types/physician.type'

const include = {
  appointments: true,
  leaves: true,
  patientRecords: true,
  user: true,
  workingHours: true,
}

@Injectable()
export class PhysiciansService {
  constructor(private prisma: PrismaService) {}

  async find(options: Prisma.PhysicianFindManyArgs) {
    return this.prisma.physician.findMany({ ...options, include })
  }

  async findOneById(id: string) {
    return this.prisma.physician.findUnique({
      where: { id },
      include,
    })
  }

  async create(payload: CreatePhysicianInput) {
    return this.prisma.physician.create({
      data: payload,
      include,
    })
  }

  async update(id: string, payload: Partial<Physician>) {
    return this.prisma.physician.update({
      where: { id },
      data: payload,
      include,
    })
  }

  async softDeleteById(id: string) {
    return this.prisma.physician.delete({ where: { id } })
  }
}
