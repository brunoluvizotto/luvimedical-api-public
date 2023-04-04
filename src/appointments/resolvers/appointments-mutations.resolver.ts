import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  AppointmentResponse,
  CreateAppointmentInput,
  UpdateAppointmentPayload,
} from '~appointments/types/appointment.type'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { AppointmentsService } from '../appointments.service'
import { Appointment } from '../entities/appointment.entity'

@Resolver(() => Appointment)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class AppointmentsMutationsResolver {
  constructor(private appointmentsService: AppointmentsService) {}

  @Mutation(() => AppointmentResponse)
  @Permissions('appointment.create')
  async createAppointment(
    @Args('input', { type: () => CreateAppointmentInput })
    input: CreateAppointmentInput
  ) {
    const { patientId, physicianId, patientRecordId, ...rest } = input
    const appointment = await this.appointmentsService.create({
      data: {
        ...rest,
        patient: { connect: { id: patientId } },
        physician: { connect: { id: physicianId } },
        ...(patientRecordId && { patientRecord: { connect: { id: patientRecordId } } }),
      },
      include: { patient: true, physician: true, patientRecord: true },
    })
    return { appointment }
  }

  @Mutation(() => AppointmentResponse)
  @Permissions('appointment.update')
  async updateAppointment(
    @Args('id')
    id: string,
    @Args('payload', { type: () => UpdateAppointmentPayload })
    payload: UpdateAppointmentPayload
  ) {
    const appointment = await this.appointmentsService.findOneById(id)
    if (!appointment) {
      throw new NotFoundException({ id }, 'appointment not found')
    }

    const updatedAppointment = await this.appointmentsService.update(appointment.id, payload)
    return { appointment: updatedAppointment }
  }
}
