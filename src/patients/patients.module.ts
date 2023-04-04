import { Module } from '@nestjs/common'
import { PrismaModule } from 'prisma/prisma.module'
import { AppointmentsModule } from '~appointments/appointments.module'
import { PatientRecordsModule } from '~patient-records/patient-records.module'
import { PatientsService } from './patients.service'
import { PatientAppointmentsResolver } from './resolvers/patient-appointments.resolver'
import { PatientRecordsResolver } from './resolvers/patient-records.resolver'
import { PatientsMutationsResolver } from './resolvers/patients-mutations.resolver'
import { PatientsQueriesResolver } from './resolvers/patients-queries.resolver'

@Module({
  imports: [PatientRecordsModule, AppointmentsModule, PrismaModule],
  providers: [
    PatientsQueriesResolver,
    PatientsMutationsResolver,
    PatientRecordsResolver,
    PatientsService,
    PatientAppointmentsResolver,
  ],
  exports: [PatientsService],
})
export class PatientsModule {}
