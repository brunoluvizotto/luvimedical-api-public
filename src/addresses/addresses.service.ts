import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findOne(options: Prisma.AddressFindUniqueArgs) {
    return this.prisma.address.findUnique(options)
  }

  async find(options: Prisma.AddressFindManyArgs) {
    return this.prisma.address.findMany(options)
  }
}
