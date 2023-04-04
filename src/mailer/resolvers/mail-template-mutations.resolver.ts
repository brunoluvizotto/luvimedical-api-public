import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { Permissions } from '~common/decorators/permissions.decorator'
import { PermissionsGuard } from '~common/guards/permissions.guard'
import { DeleteResponse } from '~common/types/delete-response.type'
import { MailTemplateService } from '~mailer/services/mail-template.service'
import {
  CreateMailTemplateInput,
  MailTemplateResponse,
  UpdateMailTemplatePayload,
} from '~mailer/types/mail-template.type'
import { MailTemplate } from '../entities/mail-template.entity'

const authorizedRoles = ['admin', 'manager']

@Resolver(() => MailTemplate)
@UseGuards(PermissionsGuard)
@UseGuards(GqlAuthGuard)
export class MailTemplateMutationsResolver {
  constructor(private mailTemplateService: MailTemplateService) {}

  @Mutation(() => MailTemplateResponse)
  @Permissions('mail-template.create')
  async createMailTemplate(
    @Args('input', { type: () => CreateMailTemplateInput })
    input: CreateMailTemplateInput
  ) {
    const mailTemplate = await this.mailTemplateService.create(input)
    return { mailTemplate }
  }

  @Mutation(() => MailTemplateResponse)
  @Permissions('mail-template.update')
  async updateMailTemplate(
    @Args('id')
    id: string,
    @Args('payload', { type: () => UpdateMailTemplatePayload })
    payload: UpdateMailTemplatePayload
  ) {
    const mailTemplate = await this.mailTemplateService.findOneById(id)
    if (!mailTemplate) {
      throw new NotFoundException({ id }, 'mail template not found')
    }

    const updatedMailTemplate = await this.mailTemplateService.update(mailTemplate.id, payload)
    return { mailTemplate: updatedMailTemplate }
  }

  @Mutation(() => DeleteResponse)
  @Permissions('mail-template.delete')
  async deleteMailTemplate(
    @Args('id')
    id: string
  ): Promise<DeleteResponse> {
    const mailTemplate = await this.mailTemplateService.findOneById(id)
    if (!mailTemplate) {
      throw new NotFoundException({ mailTemplate: { id } }, 'mail template not found')
    }

    const result = await this.mailTemplateService.softDeleteById(id)
    return { success: !!result }
  }
}
