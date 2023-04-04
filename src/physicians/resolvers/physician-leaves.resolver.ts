import { UseGuards } from '@nestjs/common'
import { Args, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { PhysicianLeave } from 'physicians/entities/physician-leave.entity'
import { PhysicianLeavesService } from 'physicians/physician-leaves.service'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { Physician } from '~physicians/entities/physician.entity'

@Resolver(() => Physician)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PhysicianLeavesResolver {
  constructor(private physicianLeavesService: PhysicianLeavesService) {}

  @ResolveField(() => [PhysicianLeave])
  @Permissions('physician-leave.list')
  async leaves(
    @Root() physician: Physician,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date
  ) {
    return this.physicianLeavesService.findByDateInterval(physician.id, startDate, endDate)
  }
}
