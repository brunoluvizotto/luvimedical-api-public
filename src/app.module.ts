import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AddressesModule } from 'addresses/addresses.module'
import { AppointmentsModule } from 'appointments/appointments.module'
import GraphQLJSON from 'graphql-type-json'
import { MessagingModule } from 'messaging/messaging.module'
import { join } from 'path'
import { PatientRecordsModule } from 'patient-records/patient-records.module'
import { PatientsModule } from 'patients/patients.module'
import { PhysiciansModule } from 'physicians/physicians.module'
import { CommonModule } from '~common/common.module'
import { Config } from '~common/config'
import { AuthModule } from './auth/auth.module'
import { MailerModule } from './mailer/mailer.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (config: ConfigService<Config>) => ({
        debug: config.get('env') === 'dev',
        playground: ['dev', 'staging'].includes(config.get('env')),
        installSubscriptionHandlers: true,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        resolvers: { JSON: GraphQLJSON },
      }),
    }),
    CommonModule,
    PatientsModule,
    PhysiciansModule,
    PatientRecordsModule,
    AppointmentsModule,
    AddressesModule,
    AuthModule,
    UsersModule,
    MessagingModule,
    MailerModule,
  ],
})
export class AppModule {}
