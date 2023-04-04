import { Field, ObjectType } from '@nestjs/graphql'
import { Patient } from 'patients/entities/patient.entity'

@ObjectType()
export class Address {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field({ nullable: true })
  street?: string

  @Field({ nullable: true })
  number?: string

  @Field({ nullable: true })
  complement?: string

  @Field({ nullable: true })
  neighborhood?: string

  @Field({ nullable: true })
  zipCode?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  country?: string

  @Field(() => Patient)
  patient: Patient
}
