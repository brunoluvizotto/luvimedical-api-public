import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import 'reflect-metadata'
import { AppModule } from './app.module'
import { EnvironmentVariables } from './common/config'
import { PrismaService } from './prisma/prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService: ConfigService<EnvironmentVariables> = app.get(ConfigService)
  const port = configService.get<number>('port')
  const broker = configService.get<EnvironmentVariables['broker']>('broker')
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.connectMicroservice({
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
  })

  app.connectMicroservice({
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
  })

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [broker.uri],
      queue: broker.physicianQueue,
      queueOptions: {
        durable: false,
      },
      socketOptions: {
        heartbeatIntervalInSeconds: 2,
        reconnectTimeInSeconds: 2,
      },
    },
  })

  await app.startAllMicroservices()
  await app.listen(port)
}
bootstrap()
