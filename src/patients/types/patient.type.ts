import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { PreferredContactMethodEnum } from '@prisma/client'
import { Patient } from '~patients/entities/patient.entity'
import { AddressInput } from './address-input.type'

@InputType()
export class CreatePatientInput extends OmitType(
  Patient,
  ['id', 'createdAt', 'updatedAt', 'addressId', 'address', 'records'] as const,
  InputType
) {
  @Field(() => AddressInput, { nullable: true })
  address: AddressInput
}

@InputType()
export class UpdatePatientPayload extends OmitType(CreatePatientInput, [
  'name',
  'email',
  'dateOfBirth',
  'phoneNumber',
  'cpf',
  'preferredContactMethod',
  'address',
]) {
  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  email: string

  @Field({ nullable: true })
  dateOfBirth: string

  @Field({ nullable: true })
  phoneNumber: string

  @Field({ nullable: true })
  cpf: string

  @Field(() => PreferredContactMethodEnum, { nullable: true })
  preferredContactMethod: PreferredContactMethodEnum

  @Field(() => AddressInput, { nullable: true })
  address: AddressInput
}

@ObjectType()
export class PatientResponse {
  @Field(() => Patient)
  patient: Patient
}

@ObjectType()
export class PatientsResponse {
  @Field(() => [Patient])
  items: Patient[]

  @Field()
  count: number
}
