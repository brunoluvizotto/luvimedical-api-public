import { Field, ObjectType } from '@nestjs/graphql'
import { Appointment } from '~appointments/entities/appointment.entity'
import { PatientRecord } from '~patient-records/entities/patient-record.entity'
import { PhysicianLeave } from './physician-leave.entity'
import { PhysicianWorkingHours } from './physician-working-hours.entity'

@ObjectType()
export class Physician {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  deletedAt: Date

  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  dateOfBirth: Date

  @Field()
  phoneNumber: string

  @Field()
  cpf: string

  @Field()
  crm: string

  @Field(() => [PatientRecord])
  patientRecords: PatientRecord[]

  @Field(() => [PhysicianWorkingHours])
  workingHours: PhysicianWorkingHours[]

  @Field(() => [PhysicianLeave])
  leaves: PhysicianLeave[]

  @Field(() => [Appointment])
  appointments: Appointment[]
}
