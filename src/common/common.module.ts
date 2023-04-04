import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { config } from './config'
import { Logger } from './logger'
import { LoggingInterceptor } from './logger/http-logger.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: getEnvFilePath(),
    }),
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [Logger],
})
export class CommonModule {}

function getEnvFilePath() {
  switch (process.env.NODE_ENV) {
    case 'test':
      return 'env/.test.env'

    case 'dev':
      return 'env/.dev.env'

    case 'local':
      return 'env/.local.env'

    default:
      return null
  }
}
