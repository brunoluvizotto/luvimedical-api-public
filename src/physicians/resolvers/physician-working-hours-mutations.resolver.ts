import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { DeleteResponse } from '~common/types/delete-response.type'
import { PhysicianWorkingHours } from '~physicians/entities/physician-working-hours.entity'
import { PhysicianWorkingHoursService } from '~physicians/physician-working-hours.service'
import { PhysiciansService } from '~physicians/physicians.service'
import {
  CreatePhysicianWorkingHoursInput,
  PhysicianWorkingHoursResponse,
  UpdatePhysicianWorkingHoursPayload,
} from '~physicians/types/physician-working-hours.type'

@Resolver(() => PhysicianWorkingHours)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PhysicianWorkingHoursMutationsResolver {
  constructor(
    private physicianWorkingHoursService: PhysicianWorkingHoursService,
    private physiciansService: PhysiciansService
  ) {}

  @Mutation(() => PhysicianWorkingHoursResponse)
  @Permissions('physician-working-hours.create')
  async createPhysicianWorkingHours(
    @Args('input', { type: () => CreatePhysicianWorkingHoursInput })
    input: CreatePhysicianWorkingHoursInput
  ) {
    const physician = await this.physiciansService.findOneById(input.physicianId)
    if (!physician) {
      throw new NotFoundException({ input }, 'physician not found')
    }

    const workingHours = await this.physicianWorkingHoursService.create(input)
    return { physicianWorkingHours: workingHours }
  }

  @Mutation(() => PhysicianWorkingHoursResponse)
  @Permissions('physician-working-hours.update')
  async updatePhysicianWorkingHours(
    @Args('id')
    id: string,
    @Args('payload', { type: () => UpdatePhysicianWorkingHoursPayload })
    payload: UpdatePhysicianWorkingHoursPayload
  ) {
    const physicianWorkingHours = await this.physicianWorkingHoursService.findOneById(id)
    if (!physicianWorkingHours) {
      throw new NotFoundException({ id, payload }, 'physicianWorkingHours not found')
    }

    const updatedWorkingHours = await this.physicianWorkingHoursService.update(physicianWorkingHours.id, payload)
    return { physicianWorkingHours: updatedWorkingHours }
  }

  @Mutation(() => DeleteResponse)
  @Permissions('physician-working-hours.delete')
  async deletePhysicianWorkingHours(
    @Args('id')
    id: string
  ): Promise<DeleteResponse> {
    const workingHours = await this.physicianWorkingHoursService.findOneById(id)
    if (!workingHours) {
      throw new NotFoundException({ workingHours: { id } }, 'workingHours not found')
    }

    const result = await this.physicianWorkingHoursService.deleteById(id)
    return { success: !!result }
  }
}
