import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { Physician } from '~physicians/entities/physician.entity'

@InputType()
export class CreatePhysicianInput extends OmitType(
  Physician,
  ['id', 'createdAt', 'updatedAt', 'workingHours', 'leaves', 'patientRecords', 'appointments'] as const,
  InputType
) {}

@InputType()
export class UpdatePhysicianPayload extends OmitType(CreatePhysicianInput, [
  'name',
  'email',
  'dateOfBirth',
  'phoneNumber',
  'cpf',
  'crm',
]) {
  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  email: string

  @Field({ nullable: true })
  dateOfBirth: Date

  @Field({ nullable: true })
  phoneNumber: string

  @Field({ nullable: true })
  cpf: string

  @Field({ nullable: true })
  crm: string
}

@ObjectType()
export class PhysicianResponse {
  @Field(() => Physician)
  physician: Physician
}
