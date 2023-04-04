import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { QueryOptionsType } from '~common/types/query-options.type'
import { MailTemplate } from '~mailer/entities/mail-template.entity'
import { MailTemplateService } from '~mailer/services/mail-template.service'

@Resolver(() => MailTemplate)
@UseGuards(GqlAuthGuard)
export class MailTemplateQueriesResolver {
  constructor(private mailTemplateService: MailTemplateService) {}

  @Query(() => [MailTemplate])
  async mailTemplates(
    @Args('options', { type: () => QueryOptionsType, defaultValue: {} })
    options: QueryOptionsType<MailTemplate>
  ): Promise<MailTemplate[]> {
    return this.mailTemplateService.find(options)
  }

  @Query(() => MailTemplate)
  async mailTemplateById(
    @Args('id', { type: () => String })
    id: string
  ) {
    const mailTemplate = await this.mailTemplateService.findOneById(id)
    if (!mailTemplate) {
      throw new NotFoundException({ mailTemplate: { id } }, 'mail template not found')
    }

    return mailTemplate
  }
}
