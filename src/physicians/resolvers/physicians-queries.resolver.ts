import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { QueryOptionsType } from '~common/types/query-options.type'
import { Physician } from '../entities/physician.entity'
import { PhysiciansService } from '../physicians.service'

@Resolver(() => Physician)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PhysiciansQueriesResolver {
  constructor(private physiciansService: PhysiciansService) {}

  @Query(() => [Physician])
  @Permissions('physician.list')
  async physicians(
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<Physician>
  ) {
    return this.physiciansService.find(options)
  }

  @Query(() => Physician)
  @Permissions('physician.get')
  async physicianById(
    @Args('id', { type: () => String })
    id: string
  ) {
    const physician = await this.physiciansService.findOneById(id)
    if (!physician) {
      throw new NotFoundException({ physician: { id } }, 'physician not found')
    }

    return physician
  }
}
