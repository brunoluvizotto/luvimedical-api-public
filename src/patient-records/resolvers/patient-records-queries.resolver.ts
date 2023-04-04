import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { QueryOptionsType } from '~common/types/query-options.type'
import { PatientRecord } from '../entities/patient-record.entity'
import { PatientRecordsService } from '../patient-records.service'

@Resolver(() => PatientRecord)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PatientRecordQueriesResolver {
  constructor(private patientRecordsService: PatientRecordsService) {}

  @Query(() => [PatientRecord])
  @Permissions('patient-record.list')
  async patientRecords(
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<PatientRecord>
  ) {
    return this.patientRecordsService.find({
      ...options,
      include: { appointment: true, patient: true, physician: true },
    })
  }

  @Query(() => PatientRecord)
  @Permissions('patient-record.get')
  async patientRecordById(
    @Args('id', { type: () => String })
    id: string
  ) {
    const patientRecord = await this.patientRecordsService.findOneById(id)
    if (!patientRecord) {
      throw new NotFoundException({ patientRecord: { id } }, 'patientRecord not found')
    }

    return patientRecord
  }
}
