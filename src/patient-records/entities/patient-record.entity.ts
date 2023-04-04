import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { PatientRecordStatusEnum } from '@prisma/client'
import { Appointment } from '~appointments/entities/appointment.entity'
import { Patient } from '~patients/entities/patient.entity'
import { Physician } from '~physicians/entities/physician.entity'

@ObjectType()
export class PatientRecord {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  record: string

  @Field(() => PatientRecordStatusEnum, { defaultValue: PatientRecordStatusEnum.draft })
  status: PatientRecordStatusEnum

  @Field()
  patientId: string
  @Field(() => Patient)
  patient: Patient

  @Field({ nullable: true })
  physicianId: string
  @Field(() => Physician, { nullable: true })
  physician: Physician

  @Field({ nullable: true })
  appointmentId: string
  @Field(() => Appointment, { nullable: true })
  appointment: Appointment
}

registerEnumType(PatientRecordStatusEnum, { name: 'PatientRecordStatusEnum' })
