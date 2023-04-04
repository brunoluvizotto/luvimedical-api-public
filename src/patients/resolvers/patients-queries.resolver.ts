import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { QueryOptionsType } from '~common/types/query-options.type'
import { PatientsResponse } from '~patients/types/patient.type'
import { Patient } from '../entities/patient.entity'
import { PatientsService } from '../patients.service'

@Resolver(() => Patient)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PatientsQueriesResolver {
  constructor(private patientsService: PatientsService) {}

  @Query(() => PatientsResponse)
  @Permissions('patient.list')
  async patients(
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<Patient>
  ) {
    return this.patientsService.findAndCount(options)
  }

  @Query(() => Patient)
  @Permissions('patient.get')
  async patientById(
    @Args('id', { type: () => String })
    id: string
  ) {
    const patient = await this.patientsService.findOneById(id)
    if (!patient) {
      throw new NotFoundException({ patient: { id } }, 'patient not found')
    }

    return patient
  }
}
