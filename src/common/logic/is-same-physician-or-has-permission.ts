import { User } from 'users/entities/user.entity'

export function isSamePhysicianOrHasPermission(user: User, physicianId: string, requiredPermission?: string) {
  const userPermissions = user.roles.map(role => role.permissions.map(permission => permission.name)).flat()
  const hasPermission = userPermissions.some((permission: string) => permission === requiredPermission)
  return hasPermission || physicianId === user.physicianId
}
