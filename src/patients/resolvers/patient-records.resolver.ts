import { Args, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { QueryOptionsType } from '~common/types/query-options.type'
import { PatientRecord } from '~patient-records/entities/patient-record.entity'
import { PatientRecordsService } from '~patient-records/patient-records.service'
import { Patient } from '~patients/entities/patient.entity'

@Resolver(() => Patient)
export class PatientRecordsResolver {
  constructor(private patientRecordsService: PatientRecordsService) {}

  @ResolveField(() => [PatientRecord])
  async records(
    @Root() patient: Patient,
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<Patient>
  ) {
    const where = Object.assign({ patientId: patient.id }, options.where)
    return this.patientRecordsService.find({ ...options, where })
  }
}
