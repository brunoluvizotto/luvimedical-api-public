import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { PhysicianWorkingHoursDayEnum } from '@prisma/client'
import { Physician } from './physician.entity'

@ObjectType()
export class PhysicianWorkingHours {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => PhysicianWorkingHoursDayEnum)
  day: PhysicianWorkingHoursDayEnum

  @Field(() => String)
  startTime: Date

  @Field(() => String)
  endTime: Date

  @Field()
  physicianId: string
  @Field(() => Physician)
  physician: Physician
}

registerEnumType(PhysicianWorkingHoursDayEnum, { name: 'PhysicianWorkingHoursDayEnum' })
