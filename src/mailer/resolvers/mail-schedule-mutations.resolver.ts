import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import * as R from 'ramda'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { DeleteResponse } from '~common/types/delete-response.type'
import { MailSchedule } from '~mailer/entities/mail-schedule.entity'
import { MailRecipientService } from '~mailer/services/mail-recipient.service'
import { MailScheduleService } from '~mailer/services/mail-schedule.service'
import { MailTemplateService } from '~mailer/services/mail-template.service'
import {
  CreateMailScheduleInput,
  MailScheduleResponse,
  UpdateMailSchedulePayload,
} from '~mailer/types/mail-schedule.type'

@Resolver(() => MailSchedule)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class MailScheduleMutationsResolver {
  constructor(
    private mailScheduleService: MailScheduleService,
    private mailRecipientService: MailRecipientService,
    private mailTemplateService: MailTemplateService
  ) {}

  @Mutation(() => MailScheduleResponse)
  @Permissions('mail-schedule.create')
  async createMailSchedule(
    @Args('input', { type: () => CreateMailScheduleInput })
    input: CreateMailScheduleInput
  ) {
    const mailSchedule = await this.mailScheduleService.create(input)
    return { mailSchedule }
  }

  @Mutation(() => MailScheduleResponse)
  @Permissions('mail-schedule.update')
  async updateMailSchedule(
    @Args('id')
    id: string,
    @Args('payload', { type: () => UpdateMailSchedulePayload })
    payload: UpdateMailSchedulePayload
  ) {
    const mailSchedule = await this.mailScheduleService.findOneById(id)
    if (!mailSchedule) {
      throw new NotFoundException({ id }, 'mail schedule not found')
    }

    const { mailRecipients, mailTemplateIds, ...restOfPayload } = payload
    if (mailRecipients) {
      await this.mailRecipientService.createMany(mailRecipients, mailSchedule.id)
    }

    const newMailRecipients = await this.mailRecipientService.find({
      where: {
        mailScheduleId: mailSchedule.id,
        AND: mailRecipients.map(recipient => ({ email: recipient.email, phoneNumber: recipient.phoneNumber })),
      },
    })
    const mailRecipientIds = newMailRecipients?.map?.(mailRecipient => mailRecipient.id)

    const updatedMailSchedule = await this.mailScheduleService.update(
      mailSchedule,
      {
        ...R.omit(['mailRecipients, mailTemplates'], restOfPayload),
      },
      mailRecipientIds,
      mailTemplateIds
    )

    return { mailSchedule: updatedMailSchedule }
  }

  @Mutation(() => DeleteResponse)
  @Permissions('mail-schedule.delete')
  async deleteMailSchedule(
    @Args('id')
    id: string
  ): Promise<DeleteResponse> {
    const mailSchedule = await this.mailScheduleService.findOneById(id)
    if (!mailSchedule) {
      throw new NotFoundException({ mailSchedule: { id } }, 'mail schedule not found')
    }

    const result = await this.mailScheduleService.softDeleteById(id)
    return { success: !!result }
  }
}
