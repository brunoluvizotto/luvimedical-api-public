import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { PatientRecordStatusEnum } from '@prisma/client'
import { PatientRecord } from 'patient-records/entities/patient-record.entity'

@InputType()
export class CreatePatientRecordInput extends OmitType(
  PatientRecord,
  ['id', 'createdAt', 'updatedAt', 'patient', 'physician', 'appointment'] as const,
  InputType
) {}

@InputType()
export class UpdatePatientRecordPayload extends OmitType(
  CreatePatientRecordInput,
  ['patientId', 'physicianId', 'appointmentId', 'record', 'status'] as const,
  InputType
) {
  @Field({ nullable: true })
  record: string

  @Field(() => PatientRecordStatusEnum, { nullable: true })
  status: PatientRecordStatusEnum
}

@ObjectType()
export class PatientRecordResponse {
  @Field(() => PatientRecord)
  patientRecord: PatientRecord
}
