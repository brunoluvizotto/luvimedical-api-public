import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PrismaModule } from 'prisma/prisma.module'
import { AuthModule } from '~auth/auth.module'
import { CommonModule } from '~common/common.module'
import { EnvironmentVariables } from '~common/config'
import { API_RBMQ_PROXY_TOKEN } from '~common/constants'
import { MailerModule } from '~mailer/mailer.module'
import { UsersController } from './controllers/users.controller'
import { PermissionNamesResolver } from './resolvers/permission-names.resolver'
import { RoleNamesResolver } from './resolvers/role-names.resolver'
import { RolesResolver } from './resolvers/roles.resolver'
import { UsersResolver } from './resolvers/users.resolver'
import { RolesService } from './roles.service'
import { UsersService } from './users.service'

@Module({
  imports: [
    CommonModule,
    forwardRef(() => AuthModule),
    MailerModule,
    PrismaModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: API_RBMQ_PROXY_TOKEN,
        useFactory: (config: ConfigService) => {
          const broker = config.get<EnvironmentVariables['broker']>('broker')
          return {
            transport: Transport.RMQ,
            options: {
              urls: [broker.uri],
              queue: broker.physicianQueue,
              queueOptions: {
                durable: false,
              },
              socketOptions: {
                heartbeatIntervalInSeconds: 2,
                reconnectTimeInSeconds: 2,
              },
            },
          }
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [UsersResolver, RoleNamesResolver, PermissionNamesResolver, UsersService, RolesResolver, RolesService],
  controllers: [UsersController],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
