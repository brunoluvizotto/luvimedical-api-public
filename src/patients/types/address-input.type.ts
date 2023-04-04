import { InputType, OmitType } from '@nestjs/graphql'
import { Address } from '~addresses/entities/address.entity'

@InputType()
export class AddressInput extends OmitType(
  Address,
  ['id', 'createdAt', 'updatedAt', 'patient'] as const,
  InputType
) {}
