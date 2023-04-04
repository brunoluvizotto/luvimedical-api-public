import { Module } from '@nestjs/common'
import { PrismaModule } from 'prisma/prisma.module'
import { AppointmentsModule } from '~appointments/appointments.module'
import { PatientRecordsService } from './patient-records.service'
import { PatientRecordsMutationsResolver } from './resolvers/patient-records-mutations.resolver'
import { PatientRecordQueriesResolver } from './resolvers/patient-records-queries.resolver'

@Module({
  imports: [AppointmentsModule, PrismaModule],
  providers: [PatientRecordQueriesResolver, PatientRecordsMutationsResolver, PatientRecordsService],
  exports: [PatientRecordsService],
})
export class PatientRecordsModule {}
