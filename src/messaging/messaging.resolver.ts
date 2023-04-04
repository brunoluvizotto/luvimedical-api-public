import { Inject, Logger, UnauthorizedException, UnprocessableEntityException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy } from '@nestjs/microservices'
import { AmqpPubSub } from 'graphql-rabbitmq-subscriptions'
import { User } from 'users/entities/user.entity'
import { UsersService } from 'users/users.service'
import { GqlAuthGuard } from '~auth/graphql/auth.guard'
import { CurrentUser } from '~auth/graphql/current-user.decorator'
import { API_RBMQ_PROXY_TOKEN } from '~common/constants'
import {
  GQL_SUBSCRIPTIONS_PUB_SUB_TOKEN,
  NEW_MESSAGE_CREATED,
  NEW_MESSAGE_ERROR_NOTIFY,
  NEW_MESSAGE_REQUEST_RECEIVED,
} from './constants'
import { ClientMessageRequestEventPayload, MessageErrorEventPayload } from './interfaces/dto'
import { CreateMessageInput, MessageCreatedInput, MessageErrorInput, MessagesInput } from './interfaces/inputs'
import { CreateMessageResponse, MessageErrorResponse, MessageResponse } from './interfaces/responses'
import { MessagingService } from './messaging.service'

@Resolver()
export class MessagingResolver {
  constructor(
    @Inject(API_RBMQ_PROXY_TOKEN) private rbmqProxy: ClientProxy,
    @Inject(GQL_SUBSCRIPTIONS_PUB_SUB_TOKEN)
    private readonly gqlSubscriptionsPubSub: AmqpPubSub,
    private readonly jwtService: JwtService,
    private readonly messagingService: MessagingService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async chatUsers(@CurrentUser() currentUser: User) {
    const users = await this.usersService.getChatUsers(currentUser.id)
    return [currentUser, ...users]
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [MessageResponse])
  async messages(@Args('input') input: MessagesInput, @CurrentUser() user: User): Promise<MessageResponse[]> {
    if (input.userId) {
      return this.messagingService.messagesBetweenUsers(user.id, input.userId)
    }

    return this.messagingService.messagesByGroup(input.groupId)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CreateMessageResponse)
  async setMessagesViewed(@Args('ids', { type: () => [String] }) ids: string[]): Promise<CreateMessageResponse> {
    if (ids.length === 0) {
      throw new UnprocessableEntityException('IDs cannot be an empty array')
    }

    const success = await this.messagingService.setMessagesViewed(ids)
    return { success }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CreateMessageResponse)
  async createMessage(
    @Args('input') input: CreateMessageInput,
    @CurrentUser() user: User
  ): Promise<CreateMessageResponse> {
    try {
      const { groupId, receiverUserId, body } = input

      await this.rbmqProxy
        .emit<string, ClientMessageRequestEventPayload>(NEW_MESSAGE_REQUEST_RECEIVED, {
          message: { body, senderUserId: user.id, receiverUserId, groupId },
        })
        .toPromise()

      return {
        success: true,
      }
    } catch (e) {
      Logger.error(`Error creating message`, e)
      return {
        success: false,
      }
    }
  }

  @Subscription(returns => MessageResponse, {
    filter: (messagePayload: { messageCreated: MessageResponse }, variables: { input: MessageCreatedInput }) => {
      const { messageCreated } = messagePayload
      if (messageCreated.groupId) {
        return variables.input.subscribedGroup === messageCreated.groupId
      }

      return [messageCreated.senderUserId, messageCreated.receiverUserId].includes(variables.input.userId)
    },
  })
  messageCreated(@Args('input') input: MessageCreatedInput) {
    try {
      this.jwtService.verify(input.accessToken)
    } catch {
      throw new UnauthorizedException()
    }

    return this.gqlSubscriptionsPubSub.asyncIterator(NEW_MESSAGE_CREATED)
  }

  @Subscription(returns => MessageErrorResponse, {
    filter: (messagePayload: { messageError: MessageErrorEventPayload }, variables: { input: MessageErrorInput }) => {
      const { messageError } = messagePayload
      if (messageError.groupId) {
        return variables.input.subscribedGroup === messageError.groupId
      }

      return [messageError.senderUserId, messageError.receiverUserId].includes(variables.input.userId)
    },
  })
  messageError(@Args('input') input: MessageErrorInput) {
    try {
      this.jwtService.verify(input.accessToken)
    } catch {
      throw new UnauthorizedException()
    }

    return this.gqlSubscriptionsPubSub.asyncIterator(NEW_MESSAGE_ERROR_NOTIFY)
  }
}
