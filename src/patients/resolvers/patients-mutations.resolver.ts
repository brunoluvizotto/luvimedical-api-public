import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import * as R from 'ramda'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { CreatePatientInput, PatientResponse, UpdatePatientPayload } from '~patients/types/patient.type'
import { Patient } from '../entities/patient.entity'
import { PatientsService } from '../patients.service'

@Resolver(() => Patient)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PatientsMutationsResolver {
  constructor(private patientsService: PatientsService) {}

  @Mutation(() => PatientResponse)
  @Permissions('patient.create')
  async createPatient(
    @Args('input', { type: () => CreatePatientInput })
    input: CreatePatientInput
  ) {
    const patient = await this.patientsService.create({
      data: { ...input, address: { create: input.address } },
      include: {
        address: true,
      },
    })

    return { patient }
  }

  @Mutation(() => PatientResponse)
  @Permissions('patient.update')
  async updatePatient(
    @Args('id')
    id: string,
    @Args('payload', { type: () => UpdatePatientPayload })
    payload: UpdatePatientPayload
  ) {
    const patient = await this.patientsService.findOneById(id)
    if (!patient) {
      throw new NotFoundException({ id, payload }, 'patient not found')
    }

    const updatedPatient = await this.patientsService.update({
      where: { id },
      data: {
        ...R.omit(['address'], payload),
        ...(payload.address && {
          address: {
            upsert: {
              create: { ...payload.address },
              update: { ...payload.address, id: patient.addressId || '' },
            },
          },
        }),
      },
    })
    return { patient: updatedPatient }
  }
}
