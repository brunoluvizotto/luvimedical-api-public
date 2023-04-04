import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PrismaModule } from 'prisma/prisma.module'
import { UsersModule } from 'users/users.module'
import { AppointmentsModule } from '~appointments/appointments.module'
import { EnvironmentVariables } from '~common/config'
import { MAILER } from './constants'
import { MailerController } from './mailer.controller'
import { MailScheduleMutationsResolver } from './resolvers/mail-schedule-mutations.resolver'
import { MailScheduleQueriesResolver } from './resolvers/mail-schedule-queries.resolver'
import { MailTemplateMutationsResolver } from './resolvers/mail-template-mutations.resolver'
import { MailTemplateQueriesResolver } from './resolvers/mail-template-queries.resolver'
import { EmailSenderService } from './services/email-sender.service'
import { MailRecipientService } from './services/mail-recipient.service'
import { MailScheduleService } from './services/mail-schedule.service'
import { MailTemplateService } from './services/mail-template.service'

@Module({
  imports: [
    ConfigModule,
    AppointmentsModule,
    PrismaModule,
    forwardRef(() => UsersModule),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: MAILER.API_RBMQ_MAILER_PROXY_TOKEN,
        useFactory: (config: ConfigService) => {
          const broker = config.get<EnvironmentVariables['broker']>('broker')
          return {
            transport: Transport.RMQ,
            options: {
              urls: [broker.uri],
              queue: broker.mailingQueue,
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
  controllers: [MailerController],
  providers: [
    MailTemplateService,
    MailTemplateMutationsResolver,
    MailTemplateQueriesResolver,
    MailScheduleService,
    MailScheduleMutationsResolver,
    MailScheduleQueriesResolver,
    MailRecipientService,
    EmailSenderService,
  ],
  exports: [EmailSenderService],
})
export class MailerModule {}
