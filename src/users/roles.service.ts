import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findOne(options: Prisma.RoleFindUniqueArgs) {
    return this.prisma.role.findUnique(options)
  }

  async find(options?: Prisma.RoleFindManyArgs) {
    return this.prisma.role.findMany(options)
  }

  async findByNames(names?: string[]) {
    return this.prisma.role.findMany({ where: { name: { in: names } }, include: { permissions: true } })
  }

  async create(params: Prisma.RoleCreateArgs) {
    return this.prisma.role.create(params)
  }

  async update(params: { where: Prisma.RoleWhereUniqueInput; data: Prisma.RoleUpdateInput }) {
    const { data, where } = params
    return this.prisma.role.update({
      data,
      where,
      include: { permissions: true, users: true },
    })
  }
}
