import { ResolveField, Resolver, Root } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'

@Resolver(() => User)
export class RoleNamesResolver {
  @ResolveField(() => [String])
  async roleNames(@Root() user: User): Promise<string[]> {
    return user.roles.map(role => role.name)
  }
}
