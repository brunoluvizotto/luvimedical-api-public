import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { PreferredContactMethodEnum } from '@prisma/client'
import { Address } from 'addresses/entities/address.entity'
import { Appointment } from 'appointments/entities/appointment.entity'
import { PatientRecord } from 'patient-records/entities/patient-record.entity'

@ObjectType()
export class Patient {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

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

  @Field(() => PreferredContactMethodEnum)
  preferredContactMethod: PreferredContactMethodEnum

  @Field({ nullable: true })
  addressId?: string

  @Field(() => Address, { nullable: true })
  address?: Partial<Address>

  @Field(() => [PatientRecord])
  records: PatientRecord[]
}

registerEnumType(PreferredContactMethodEnum, { name: 'PreferredContactMethodEnum' })
