import { UseGuards } from '@nestjs/common'
import { Args, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { AppointmentsService } from '~appointments/appointments.service'
import { Appointment } from '~appointments/entities/appointment.entity'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { Physician } from '~physicians/entities/physician.entity'

@Resolver(() => Physician)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class PhysicianAppointmentsResolver {
  constructor(private appointmentsService: AppointmentsService) {}

  @ResolveField(() => [Appointment])
  @Permissions('appointment.list')
  async appointments(
    @Root() physician: Physician,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date
  ) {
    const appointments = await this.appointmentsService.findByDateInterval(
      {
        where: {
          physicianId: physician.id,
        },
      },
      startDate,
      endDate
    )
    return appointments
  }
}
