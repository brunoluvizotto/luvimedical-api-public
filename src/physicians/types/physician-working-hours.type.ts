import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { PhysicianWorkingHoursDayEnum } from '@prisma/client'
import { PhysicianWorkingHours } from '~physicians/entities/physician-working-hours.entity'

@InputType()
export class CreatePhysicianWorkingHoursInput extends OmitType(
  PhysicianWorkingHours,
  ['id', 'createdAt', 'updatedAt', 'physician', 'startTime', 'endTime'] as const,
  InputType
) {
  @Field()
  startTime: string

  @Field()
  endTime: string
}

@InputType()
export class UpdatePhysicianWorkingHoursPayload extends OmitType(CreatePhysicianWorkingHoursInput, [
  'physicianId',
  'day',
  'startTime',
  'endTime',
] as const) {
  @Field(() => PhysicianWorkingHoursDayEnum, { nullable: true })
  day: PhysicianWorkingHoursDayEnum

  @Field({ nullable: true })
  startTime: string

  @Field({ nullable: true })
  endTime: string
}

@ObjectType()
export class PhysicianWorkingHoursResponse {
  @Field(() => PhysicianWorkingHours)
  physicianWorkingHours: PhysicianWorkingHours
}
