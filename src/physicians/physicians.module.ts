import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PrismaModule } from 'prisma/prisma.module'
import { AppointmentsModule } from '~appointments/appointments.module'
import { EnvironmentVariables } from '~common/config'
import { API_RBMQ_PROXY_TOKEN } from '~common/constants'
import { PhysicianLeavesService } from './physician-leaves.service'
import { PhysicianWorkingHoursService } from './physician-working-hours.service'
import { PhysiciansService } from './physicians.service'
import { PhysicianAppointmentsResolver } from './resolvers/appointments.resolver'
import { PhysicianLeavesMutationsResolver } from './resolvers/physician-leaves-mutations.resolver'
import { PhysicianLeavesResolver } from './resolvers/physician-leaves.resolver'
import { PhysicianWorkingHoursMutationsResolver } from './resolvers/physician-working-hours-mutations.resolver'
import { PhysiciansMutationsResolver } from './resolvers/physicians-mutations.resolver'
import { PhysiciansQueriesResolver } from './resolvers/physicians-queries.resolver'

@Module({
  imports: [
    AppointmentsModule,
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
  providers: [
    PhysiciansQueriesResolver,
    PhysiciansMutationsResolver,
    PhysicianLeavesResolver,
    PhysicianLeavesMutationsResolver,
    PhysicianAppointmentsResolver,
    PhysicianWorkingHoursMutationsResolver,
    PhysiciansService,
    PhysicianLeavesService,
    PhysicianWorkingHoursService,
  ],
  exports: [PhysiciansService],
})
export class PhysiciansModule {}
