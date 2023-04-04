import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AppointmentStatusEnum } from '@prisma/client'
import { PatientRecord } from '~patient-records/entities/patient-record.entity'
import { Patient } from '~patients/entities/patient.entity'
import { Physician } from '~physicians/entities/physician.entity'

@ObjectType()
export class Appointment {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  startTime: Date

  @Field()
  endTime: Date

  @Field(() => AppointmentStatusEnum, { defaultValue: AppointmentStatusEnum.scheduled })
  status: AppointmentStatusEnum

  @Field()
  patientId: string
  @Field(() => Patient)
  patient: Patient

  @Field()
  physicianId: string
  @Field(() => Physician)
  physician: Physician

  @Field({ nullable: true })
  patientRecordId: string
  @Field(() => PatientRecord, { nullable: true })
  patientRecord: PatientRecord
}

registerEnumType(AppointmentStatusEnum, { name: 'AppointmentStatusEnum' })
