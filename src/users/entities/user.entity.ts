import { Field, ObjectType } from '@nestjs/graphql'
import { MailSchedule } from 'mailer/entities/mail-schedule.entity'
import { Message } from 'messaging/entities/message.entity'
import { Physician } from '~physicians/entities/physician.entity'
import { Role } from './role.entity'

@ObjectType()
export class User {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  name: string

  @Field()
  email: string

  password: string

  @Field()
  activated: boolean

  activationToken: string

  activationTokenExpirationDate: Date

  @Field({ nullable: true })
  phoneNumber: string

  @Field(() => [Role], { defaultValue: [] })
  roles: Role[]

  @Field(() => [String], { defaultValue: [] })
  roleNames: string[]

  @Field({ nullable: true })
  physicianId: string | null

  @Field(() => Physician, { nullable: true })
  physician?: Physician

  sentMessages: Promise<Message[]>

  receivedMessages: Promise<Message[]>

  mailSchedules: Promise<MailSchedule[]>
}
