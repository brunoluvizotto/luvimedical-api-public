import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { PatientRecordStatusEnum } from '@prisma/client'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import {
  CreatePatientRecordInput,
  PatientRecordResponse,
  UpdatePatientRecordPayload,
} from '~patient-records/types/patient-record.type'
import { PatientRecord } from '../entities/patient-record.entity'
import { PatientRecordsService } from '../patient-records.service'

@Resolver(() => PatientRecord)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PatientRecordsMutationsResolver {
  constructor(private patientRecordsService: PatientRecordsService) {}

  @Mutation(() => PatientRecordResponse)
  @Permissions('patient-record.create')
  async createPatientRecord(
    @Args('input', { type: () => CreatePatientRecordInput })
    input: CreatePatientRecordInput
  ) {
    const patientRecord = await this.patientRecordsService.create({
      data: input,
      include: { patient: true, physician: true, appointment: true },
    })
    return { patientRecord }
  }

  @Mutation(() => PatientRecordResponse)
  @Permissions('patient-record.update')
  async updatePatientRecord(
    @Args('id')
    id: string,
    @Args('payload', { type: () => UpdatePatientRecordPayload })
    payload: UpdatePatientRecordPayload
  ) {
    const patientRecord = await this.patientRecordsService.findOneById(id)
    if (!patientRecord) {
      throw new NotFoundException({ id, payload }, 'patientRecord not found')
    }

    const updatedPatientRecord = await this.patientRecordsService.update({
      where: { id },
      data: payload,
    })

    return { patientRecord: updatedPatientRecord }
  }

  @Mutation(() => PatientRecordResponse)
  @Permissions('patient-record.update')
  async finishPatientRecord(
    @Args('id')
    id: string
  ) {
    const patientRecord = await this.patientRecordsService.findOneById(id)
    if (!patientRecord) {
      throw new NotFoundException({ id }, 'patientRecord not found')
    }

    const updatedPatientRecord = await this.patientRecordsService.update({
      where: { id },
      data: { status: PatientRecordStatusEnum.completed },
    })

    return { patientRecord: updatedPatientRecord }
  }
}
