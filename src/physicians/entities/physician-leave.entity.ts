import { Field, ObjectType } from '@nestjs/graphql'
import { Physician } from './physician.entity'

@ObjectType()
export class PhysicianLeave {
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

  @Field({ nullable: true })
  reason: string

  @Field()
  physicianId: string
  @Field(() => Physician)
  physician: Physician
}
