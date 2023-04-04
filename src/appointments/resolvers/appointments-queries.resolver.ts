import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { AppointmentListResponse } from '~appointments/types/appointment.type'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { QueryOptionsType } from '~common/types/query-options.type'
import { AppointmentsService } from '../appointments.service'
import { Appointment } from '../entities/appointment.entity'

@Resolver(() => Appointment)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class AppointmentsQueriesResolver {
  constructor(private appointmentsService: AppointmentsService) {}

  @Query(() => AppointmentListResponse)
  @Permissions('appointment.list')
  async appointments(
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<Appointment>,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date
  ) {
    const appointments = await this.appointmentsService.findByDateInterval(options, startDate, endDate)
    return {
      data: appointments,
      count: appointments.length,
    }
  }

  @Query(() => Appointment)
  @Permissions('appointment.get')
  async appointmentById(
    @Args('id', { type: () => String })
    id: string
  ) {
    const appointment = await this.appointmentsService.findOneById(id)
    if (!appointment) {
      throw new NotFoundException({ appointment: { id } }, 'appointment not found')
    }

    return appointment
  }
}
