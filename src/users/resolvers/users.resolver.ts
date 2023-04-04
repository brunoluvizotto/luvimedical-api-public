import { NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as R from 'ramda'
import { User } from 'users/entities/user.entity'
import { RolesService } from 'users/roles.service'
import { ActivateInput, ActivateResponse } from 'users/types/activate-user.type'
import { SignInInput, SignInResponse } from 'users/types/sign-in.type'
import { CreateUserInput, UpdateUserPayload, UserResponse } from 'users/types/user.type'
import { AuthService } from '~auth/auth.service'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { CurrentUser } from '~auth/graphql/current-user.decorator'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { QueryOptionsType } from '~common/types/query-options.type'
import { SignUpInput, SignUpResponse } from '../types/sign-up.type'
import { UsersService } from '../users.service'

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly authService: AuthService
  ) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async user(@CurrentUser() user: User): Promise<User> {
    return user
  }

  @Query(() => User)
  @UseGuards(PermissionsGuard)
  @UseGuards(GqlAuthGuard)
  @Permissions('user.get')
  async userById(
    @Args('id', { type: () => String })
    id: string
  ) {
    const user = await this.usersService.findOneById(id)
    if (!user) {
      throw new NotFoundException({ user: { id } }, 'user not found')
    }

    return user
  }

  @Query(() => [User])
  @UseGuards(PermissionsGuard)
  @UseGuards(GqlAuthGuard)
  @Permissions('user.list')
  async users(
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<User>
  ) {
    return this.usersService.find(options)
  }

  @Mutation(() => UserResponse)
  @UseGuards(PermissionsGuard)
  @UseGuards(GqlAuthGuard)
  @Permissions('user.create')
  async createUser(@Args('input') input: CreateUserInput) {
    const roles = input.roles && (await this.rolesService.findByNames(input.roles))
    const roleIds = roles?.map(role => role.id)

    const user = await this.usersService.create(input, roleIds)
    return { user }
  }

  @Mutation(() => UserResponse)
  @UseGuards(PermissionsGuard)
  @UseGuards(GqlAuthGuard)
  @Permissions('user.update')
  async updateUser(
    @Args('id')
    id: string,
    @Args('payload') payload: UpdateUserPayload
  ) {
    const user = (await this.usersService.findOneById(id)) as unknown as User
    if (!user) {
      throw new NotFoundException({ id, payload }, 'user not found')
    }

    const { roles: payloadRoles, ...updatePayload } = payload
    const roles = payloadRoles && (await this.rolesService.findByNames(payloadRoles))
    const roleIds = roles?.map?.(role => role.id)

    const updatedUser = await this.usersService.update(user, updatePayload, roleIds)
    return { user: updatedUser }
  }

  @Mutation(() => SignUpResponse)
  async signUp(@Args('input') input: SignUpInput) {
    const { user } = await this.createUser(R.omit(['roles'], input))

    return { user }
  }

  @Mutation(() => SignInResponse)
  async signIn(@Args('input') input: SignInInput) {
    const { email, password } = input
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException({ email }, 'Could not signin')
    }

    const tokens = await this.authService.signIn(user as unknown as User)

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }
  }

  @Mutation(() => ActivateResponse)
  async activateUser(@Args('input') input: ActivateInput) {
    const { token, password } = input
    const updatedUser = await this.usersService.activate(token, password)
    const tokens = await this.authService.signIn(updatedUser as unknown as User)

    return {
      user: updatedUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }
  }
}
