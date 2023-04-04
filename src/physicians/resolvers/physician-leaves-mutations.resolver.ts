import { NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { CurrentUser } from '~auth/graphql/current-user.decorator'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { isSamePhysicianOrHasPermission } from '~common/logic/is-same-physician-or-has-permission'
import { DeleteResponse } from '~common/types/delete-response.type'
import { PhysicianLeave } from '~physicians/entities/physician-leave.entity'
import { PhysicianLeavesService } from '~physicians/physician-leaves.service'
import {
  CreatePhysicianLeaveInput,
  PhysicianLeaveResponse,
  UpdatePhysicianLeavePayload,
} from '~physicians/types/physician-leave.type'

@Resolver(() => PhysicianLeave)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PhysicianLeavesMutationsResolver {
  constructor(private physicianLeavesService: PhysicianLeavesService) {}

  @Mutation(() => PhysicianLeaveResponse)
  async createPhysicianLeave(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreatePhysicianLeaveInput })
    input: CreatePhysicianLeaveInput
  ) {
    const physicianLeave = await this.physicianLeavesService.create(input)

    if (!isSamePhysicianOrHasPermission(user, input.physicianId, 'physician-leave.create')) {
      throw new UnauthorizedException(
        { userPhysicianId: user.physicianId, physicianId: input.physicianId },
        'cannot create leaves for other physician'
      )
    }

    return { physicianLeave }
  }

  @Mutation(() => PhysicianLeaveResponse)
  @Permissions('physician-leave.update')
  async updatePhysicianLeave(
    @Args('id')
    id: string,
    @Args('payload', { type: () => UpdatePhysicianLeavePayload })
    payload: UpdatePhysicianLeavePayload
  ) {
    const physicianLeave = await this.physicianLeavesService.findOneById(id)
    if (!physicianLeave) {
      throw new NotFoundException({ id, payload }, 'physicianLeave not found')
    }

    const updatedPhysicianLeave = await this.physicianLeavesService.update(physicianLeave.id, payload)
    return { physicianLeave: updatedPhysicianLeave }
  }

  @Mutation(() => DeleteResponse)
  async deletePhysicianLeave(
    @CurrentUser() user: User,
    @Args('id')
    id: string
  ): Promise<DeleteResponse> {
    const physicianLeave = await this.physicianLeavesService.findOneById(id)
    if (!physicianLeave) {
      throw new NotFoundException({ leave: { id } }, 'physicianLeave not found')
    }

    if (!isSamePhysicianOrHasPermission(user, physicianLeave.physicianId, 'physician-leave.delete')) {
      throw new UnauthorizedException(
        { userPhysicianId: user.physicianId, physicianId: physicianLeave.physicianId },
        'cannot delete leaves of other physician'
      )
    }

    const result = await this.physicianLeavesService.deleteById(physicianLeave.id)
    return { success: !!result }
  }
}
