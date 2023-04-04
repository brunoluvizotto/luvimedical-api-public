import { Inject, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { ClientProxy } from '@nestjs/microservices'
import { User } from 'users/entities/user.entity'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { CurrentUser } from '~auth/graphql/current-user.decorator'
import { API_RBMQ_PROXY_TOKEN, PHYSICIAN_MESSAGE_PATTERNS } from '~common/constants'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { isSamePhysicianOrHasPermission } from '~common/logic/is-same-physician-or-has-permission'
import { DeleteResponse } from '~common/types/delete-response.type'
import { PhysicianCreatedDto } from '~physicians/types/physician-created.dto'
import { CreatePhysicianInput, PhysicianResponse, UpdatePhysicianPayload } from '~physicians/types/physician.type'
import { Physician } from '../entities/physician.entity'
import { PhysiciansService } from '../physicians.service'

const authorizedRoles = ['admin', 'manager']
@Resolver(() => Physician)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PhysiciansMutationsResolver {
  constructor(
    private physiciansService: PhysiciansService,
    @Inject(API_RBMQ_PROXY_TOKEN) private rbmqProxy: ClientProxy
  ) {}

  @Mutation(() => PhysicianResponse)
  @Permissions('physician.create')
  async createPhysician(
    @Args('input', { type: () => CreatePhysicianInput })
    input: CreatePhysicianInput
  ) {
    const physician = await this.physiciansService.create(input)

    await this.rbmqProxy
      .emit<string, PhysicianCreatedDto>(PHYSICIAN_MESSAGE_PATTERNS.PHYSICIAN_CREATED, { physician })
      .toPromise()

    return { physician }
  }

  @Mutation(() => PhysicianResponse)
  async updatePhysician(
    @CurrentUser() user: User,
    @Args('id')
    id: string,
    @Args('payload', { type: () => UpdatePhysicianPayload })
    payload: UpdatePhysicianPayload
  ) {
    const physician = await this.physiciansService.findOneById(id)
    if (!physician) {
      throw new NotFoundException({ id }, 'physician not found')
    }

    if (!isSamePhysicianOrHasPermission(user, physician.id, 'physician.update')) {
      throw new UnauthorizedException(
        { id, userPhysicianId: user.physicianId, physicianId: physician?.id },
        'cannot update other physician'
      )
    }

    const updatedPhysician = await this.physiciansService.update(physician.id, payload)
    return { physician: updatedPhysician }
  }

  @Mutation(() => DeleteResponse)
  @Permissions('physician.delete')
  async deletePhysician(
    @Args('id')
    id: string
  ): Promise<DeleteResponse> {
    const physician = await this.physiciansService.findOneById(id)
    if (!physician) {
      throw new NotFoundException({ physician: { id } }, 'physician not found')
    }

    const result = await this.physiciansService.softDeleteById(id)
    return { success: !!result }
  }
}
