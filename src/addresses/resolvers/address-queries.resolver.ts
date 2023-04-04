import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { QueryOptionsType } from '~common/types/query-options.type'
import { AddressesService } from '../addresses.service'
import { Address } from '../entities/address.entity'

@Resolver(() => Address)
@UseGuards(GqlAuthGuard)
export class AddressQueriesResolver {
  constructor(private addressesService: AddressesService) {}

  @Query(() => [Address])
  async addresses(
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<Address>
  ) {
    return this.addressesService.find({ ...options, include: { patient: true } })
  }

  @Query(() => Address)
  async addressById(
    @Args('id', { type: () => String })
    id: string
  ) {
    const address = await this.addressesService.findOne({ where: { id }, include: { patient: true } })
    if (!address) {
      throw new NotFoundException({ address: { id } }, 'address not found')
    }

    return address
  }
}
