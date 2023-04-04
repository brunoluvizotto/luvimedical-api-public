import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler())
    if (!permissions) {
      return true
    }
    const ctx = GqlExecutionContext.create(context)
    const user: User = ctx.getContext().req.user
    const userPermissions = user.roles.map(role => role.permissions.map(permission => permission.name)).flat()
    const hasPermission = userPermissions.some((permission: string) => !!permissions.find(item => item === permission))

    return user && hasPermission
  }
}
