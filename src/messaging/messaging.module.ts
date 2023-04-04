import { ConsoleLogger } from '@cdm-logger/server'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AmqpPubSub } from 'graphql-rabbitmq-subscriptions'
import { PrismaModule } from 'prisma/prisma.module'
import { AuthModule } from '~auth/auth.module'
import { CommonModule } from '~common/common.module'
import { EnvironmentVariables } from '~common/config'
import { API_RBMQ_PROXY_TOKEN } from '~common/constants'
import { UsersModule } from '../users/users.module'
import { GQL_SUBSCRIPTIONS_PUB_SUB_TOKEN } from './constants/index'
import { MessagesResolver } from './messages.resolver'
import { MessagingController } from './messaging.controller'
import { MessagingResolver } from './messaging.resolver'
import { MessagingService } from './messaging.service'

const logger: any = ConsoleLogger.create('Chat API')
@Module({
  imports: [
    ConfigModule,
    CommonModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: API_RBMQ_PROXY_TOKEN,
        useFactory: (config: ConfigService) => {
          const broker = config.get<EnvironmentVariables['broker']>('broker')
          return {
            transport: Transport.RMQ,
            options: {
              urls: [broker.uri],
              queue: broker.messagesQueue,
              queueOptions: {
                durable: false,
              },
              socketOptions: {
                heartbeatIntervalInSeconds: 2,
                reconnectTimeInSeconds: 2,
              },
            },
          }
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    MessagesResolver,
    MessagingResolver,
    MessagingService,
    {
      provide: GQL_SUBSCRIPTIONS_PUB_SUB_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const broker = config.get<EnvironmentVariables['broker']>('broker')
        return new AmqpPubSub({
          config: broker.uri,
          logger,
        })
      },
    },
  ],
  controllers: [MessagingController],
})
export class MessagingModule {}
