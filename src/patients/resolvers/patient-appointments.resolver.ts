import { Args, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { AppointmentsService } from '~appointments/appointments.service'
import { Appointment } from '~appointments/entities/appointment.entity'
import { AppointmentListResponse } from '~appointments/types/appointment.type'
import { QueryOptionsType } from '~common/types/query-options.type'
import { Patient } from '~patients/entities/patient.entity'

@Resolver(() => Patient)
export class PatientAppointmentsResolver {
  constructor(private appointmentsService: AppointmentsService) {}

  @ResolveField(() => AppointmentListResponse)
  async appointments(
    @Root() patient: Patient,
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<Appointment>,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date
  ) {
    const appointments = await this.appointmentsService.findByDateInterval(
      {
        ...options,
        where: {
          ...options.where,
          patientId: patient.id,
        },
      },
      startDate,
      endDate
    )
    return {
      data: appointments,
      count: appointments.length,
    }
  }
}
