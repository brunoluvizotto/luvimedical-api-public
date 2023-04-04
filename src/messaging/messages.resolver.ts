import { ResolveField, Resolver, Root } from '@nestjs/graphql'
import { User } from 'users/entities/user.entity'
import { CurrentUser } from '~auth/graphql/current-user.decorator'
import { MessageResponse } from './interfaces/responses'
import { MessagingService } from './messaging.service'

@Resolver(() => User)
export class MessagesResolver {
  constructor(private readonly messagingService: MessagingService) {}

  @ResolveField(() => [MessageResponse])
  async messages(@Root() fromUser: User, @CurrentUser() toUser: User): Promise<MessageResponse[]> {
    return this.messagingService.messagesBetweenUsers(fromUser.id, toUser.id)
  }
}
