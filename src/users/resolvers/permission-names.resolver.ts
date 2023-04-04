import { ResolveField, Resolver, Root } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'

@Resolver(() => User)
export class PermissionNamesResolver {
  @ResolveField(() => [String])
  async permissionNames(@Root() user: User): Promise<string[]> {
    return user.roles.map(role => role.permissions.map(permission => permission.name)).flat()
  }
}
