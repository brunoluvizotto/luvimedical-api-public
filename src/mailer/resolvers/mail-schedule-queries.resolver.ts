import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { QueryOptionsType } from '~common/types/query-options.type'
import { MailSchedule } from '~mailer/entities/mail-schedule.entity'
import { MailScheduleService } from '~mailer/services/mail-schedule.service'

@Resolver(() => MailSchedule)
@UseGuards(GqlAuthGuard)
export class MailScheduleQueriesResolver {
  constructor(private mailScheduleService: MailScheduleService) {}

  @Query(() => [MailSchedule])
  async mailSchedules(
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<MailSchedule>
  ) {
    return this.mailScheduleService.find(options)
  }

  @Query(() => MailSchedule)
  async mailScheduleById(
    @Args('id', { type: () => String })
    id: string
  ) {
    const mailSchedule = await this.mailScheduleService.findOneById(id)
    if (!mailSchedule) {
      throw new NotFoundException({ mailSchedule: { id } }, 'mail schedule not found')
    }

    return mailSchedule
  }
}
