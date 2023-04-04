import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { PhysicianLeave } from '~physicians/entities/physician-leave.entity'

@InputType()
export class CreatePhysicianLeaveInput extends OmitType(
  PhysicianLeave,
  ['id', 'createdAt', 'updatedAt', 'physician'] as const,
  InputType
) {}

@InputType()
export class UpdatePhysicianLeavePayload extends OmitType(CreatePhysicianLeaveInput, [
  'physicianId',
  'startTime',
  'endTime',
  'reason',
] as const) {
  @Field({ nullable: true })
  startTime: Date

  @Field({ nullable: true })
  endTime: Date

  @Field({ nullable: true })
  reason: string
}

@ObjectType()
export class PhysicianLeaveResponse {
  @Field(() => PhysicianLeave)
  physicianLeave: PhysicianLeave
}
