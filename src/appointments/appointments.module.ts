import { Module } from '@nestjs/common'
import { PrismaModule } from 'prisma/prisma.module'
import { AppointmentsService } from './appointments.service'
import { AppointmentsMutationsResolver } from './resolvers/appointments-mutations.resolver'
import { AppointmentsQueriesResolver } from './resolvers/appointments-queries.resolver'

@Module({
  imports: [PrismaModule],
  providers: [AppointmentsQueriesResolver, AppointmentsMutationsResolver, AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
