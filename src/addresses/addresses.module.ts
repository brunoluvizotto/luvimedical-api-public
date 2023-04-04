import { Module } from '@nestjs/common'
import { PrismaModule } from 'prisma/prisma.module'
import { AddressesService } from './addresses.service'
import { AddressQueriesResolver } from './resolvers/address-queries.resolver'

@Module({
  imports: [PrismaModule],
  providers: [AddressQueriesResolver, AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
