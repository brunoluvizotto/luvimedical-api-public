import { Controller } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventPattern, Payload } from '@nestjs/microservices'
import { RolesService } from 'users/roles.service'
import { PhysicianCreatedDto } from 'users/types/physician-created.dto'
import { UsersService } from 'users/users.service'
import { EnvironmentVariables } from '~common/config'
import { PHYSICIAN_MESSAGE_PATTERNS } from '~common/constants'
import { Logger } from '~common/logger'

@Controller('messaging')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private logger: Logger,
    private config: ConfigService
  ) {
    this.logger.setContext('UsersController')
  }

  @EventPattern(PHYSICIAN_MESSAGE_PATTERNS.PHYSICIAN_CREATED)
  async handlePhysicianCreated(@Payload() payload: PhysicianCreatedDto) {
    const physician = payload.physician || {}
    const { id, name, email, phoneNumber } = payload?.physician

    if (!id || !name || !email) {
      this.logger.warn({ message: 'Missing required information to create user', physician })
      return
    }

    const isNewEmail = await this.usersService.checkIfNewEmail(email)
    if (!isNewEmail) {
      this.logger.warn({ message: 'New physician already has a matching user email', physician })
      return
    }

    const roles = await this.rolesService.findByNames(['physician'])
    const roleIds = roles.map(role => role.id)

    const userPayload = {
      name,
      email,
      phoneNumber,
      physicianId: id,
      password: this.config.get<EnvironmentVariables['defaultUserPassword']>('defaultUserPassword'),
    }

    return this.usersService.create(userPayload, roleIds)
  }
}
