import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { AppointmentStatusEnum } from '@prisma/client'
import { Appointment } from 'appointments/entities/appointment.entity'

@InputType()
export class CreateAppointmentInput extends OmitType(
  Appointment,
  ['id', 'createdAt', 'updatedAt', 'patient', 'physician', 'patientRecord'] as const,
  InputType
) {}

@InputType()
export class UpdateAppointmentPayload extends OmitType(
  CreateAppointmentInput,
  ['patientId', 'startTime', 'endTime', 'status', 'physicianId', 'patientRecordId'] as const,
  InputType
) {
  @Field({ nullable: true })
  startTime: Date

  @Field({ nullable: true })
  endTime: Date

  @Field(() => AppointmentStatusEnum, { nullable: true })
  status: AppointmentStatusEnum

  @Field({ nullable: true })
  physicianId: string

  @Field({ nullable: true })
  patientRecordId: string
}

@ObjectType()
export class AppointmentResponse {
  @Field(() => Appointment)
  appointment: Appointment
}

@ObjectType()
export class AppointmentListResponse {
  @Field(() => [Appointment])
  data: Appointment[]

  @Field()
  count: number
}
