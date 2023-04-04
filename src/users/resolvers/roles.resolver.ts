import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { Role } from 'users/entities/role.entity'
import { RolesService } from 'users/roles.service'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'

@Resolver(() => Role)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class RolesResolver {
  constructor(private rolesService: RolesService) {}

  @Query(() => [String])
  @Permissions('role.list')
  async roles(): Promise<string[]> {
    const roles = await this.rolesService.find()
    return roles.map(role => role.name)
  }
}
