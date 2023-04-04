import { Controller, Inject, UnprocessableEntityException } from '@nestjs/common'
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices'
import { AmqpPubSub } from 'graphql-rabbitmq-subscriptions'
import { UsersService } from 'users/users.service'
import { API_RBMQ_PROXY_TOKEN } from '~common/constants'
import {
  GQL_SUBSCRIPTIONS_PUB_SUB_TOKEN,
  NEW_MESSAGE_CREATED,
  NEW_MESSAGE_ERROR_NOTIFY,
  NEW_MESSAGE_REQUEST_RECEIVED,
} from './constants'
import { NEW_MESSAGE_ACCEPTED, NEW_MESSAGE_ERROR } from './constants/index'
import {
  ClientMessageRequestEventPayload,
  MessageAcceptedEventPayload,
  MessageErrorEventPayload,
} from './interfaces/dto'
import { MessageErrorResponse, MessageResponse } from './interfaces/responses'
import { MessagingService } from './messaging.service'

@Controller('messaging')
export class MessagingController {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagingService: MessagingService,
    @Inject(API_RBMQ_PROXY_TOKEN) private rbmqProxy: ClientProxy,
    @Inject(GQL_SUBSCRIPTIONS_PUB_SUB_TOKEN)
    private readonly gqlSubscriptionsPubSub: AmqpPubSub
  ) {}

  @EventPattern(NEW_MESSAGE_REQUEST_RECEIVED)
  async handleClientMessageRequest(@Payload() payload: ClientMessageRequestEventPayload) {
    if (
      !payload ||
      !payload.message ||
      !payload.message.body ||
      !payload.message.senderUserId ||
      (!payload.message.receiverUserId && !payload.message.groupId)
    ) {
      return
    }

    const {
      message: { body, groupId, receiverUserId, senderUserId },
    } = payload

    const [sender, receiver] = await Promise.all([
      this.usersService.findOneById(senderUserId),
      this.usersService.findOneById(receiverUserId),
    ])

    if (!sender || !receiver) {
      throw new UnprocessableEntityException(
        { senderUserId, receiverUserId },
        'handleClientMessageRequest: sender or receiver not found'
      )
    }

    const emitPayload: MessageAcceptedEventPayload = {
      body,
      senderUserId,
      senderName: sender.name,
      receiverUserId,
      groupId,
    }
    this.rbmqProxy.emit(NEW_MESSAGE_ACCEPTED, emitPayload)
  }

  @EventPattern(NEW_MESSAGE_ACCEPTED)
  async handleMessageAccepted(@Payload() payload: MessageAcceptedEventPayload) {
    if (
      !payload ||
      !payload.body ||
      !payload.senderUserId ||
      !payload.senderName ||
      (!payload.receiverUserId && !payload.groupId)
    ) {
      return
    }

    const { body, senderUserId, receiverUserId, groupId } = payload

    const message = await this.messagingService.create({
      body,
      senderUserId,
      receiverUserId,
      groupId,
    })

    const response: MessageResponse = {
      id: message.id,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      body: message.body,
      viewedAt: message.viewedAt,
      senderUserId: message.senderUserId,
      receiverUserId,
      groupId,
    }

    this.gqlSubscriptionsPubSub.publish(NEW_MESSAGE_CREATED, {
      messageCreated: response,
    })

    return message
  }

  @EventPattern(NEW_MESSAGE_ERROR)
  async handleMessageError(@Payload() payload: MessageErrorEventPayload) {
    if (
      !payload ||
      !payload.body ||
      !payload.senderUserId ||
      !payload.senderName ||
      (!payload.senderUserId && !payload.groupId)
    ) {
      return
    }

    const { body, senderUserId, senderName, receiverUserId, groupId } = payload

    const response: MessageErrorResponse = {
      body,
      senderUserId,
      senderName,
      receiverUserId,
      groupId,
    }

    this.gqlSubscriptionsPubSub.publish(NEW_MESSAGE_ERROR_NOTIFY, {
      messageError: response,
    })
  }
}
