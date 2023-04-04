import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// import { User } from '@prisma/client'
import { compare } from 'bcrypt'
import { User } from 'users/entities/user.entity'
import { UsersService } from 'users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email)
    if (!user) {
      return null
    }

    const passwordMatches = await compare(pass, user.password)
    if (passwordMatches) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async signIn(user: User) {
    if (!user.activated) {
      throw new UnauthorizedException({ email: user.email, message: 'User is not activated' })
    }

    const permissions = user.roles.map(role => role.permissions.map(permission => permission.name)).flat()
    const payload = { username: user.email, sub: user.id, permissions, physicianId: user.physicianId }
    return {
      accessToken: this.jwtService.sign({ ...payload, kind: 'acc' }, { expiresIn: '7d' }),
      refreshToken: this.jwtService.sign({ ...payload, kind: 'ref' }, { expiresIn: '30d' }),
    }
  }
}
