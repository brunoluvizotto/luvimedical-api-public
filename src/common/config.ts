export type Config = ReturnType<typeof config>

export interface EnvironmentVariables {
  env: string
  port: number
  jwtSecret: string
  defaultUserPassword: string
  postgres: {
    url: string
  }
  broker: {
    uri: string
    messagesQueue: string
    mailingQueue: string
    physicianQueue: string
  }
  server: {
    timezone: string
  }
  mailer: {
    email: {
      mailJet: {
        apiKey: string
        apiSecret: string
      }
      sender: {
        email: string
        name: string
      }
    }
  }
}

export function config(): EnvironmentVariables {
  return {
    env: process.env.NODE_ENV || 'dev',
    port: parseInt(process.env.PORT),
    jwtSecret: process.env.JWT_SECRET,
    defaultUserPassword: process.env.DEFAULT_USER_PASSWORD,
    postgres: {
      url: process.env.POSTGRES_URL,
    },
    broker: {
      uri: process.env.BROKER_URI,
      messagesQueue: process.env.MESSAGES_QUEUE,
      mailingQueue: process.env.MAILING_QUEUE,
      physicianQueue: process.env.PHYSICIAN_QUEUE,
    },
    server: {
      timezone: process.env.TIMEZONE || 'America/Sao_Paulo',
    },
    mailer: {
      email: {
        mailJet: {
          apiKey: process.env.MJ_APIKEY_PUBLIC,
          apiSecret: process.env.MJ_APIKEY_PRIVATE,
        },
        sender: {
          email: process.env.SENDER_EMAIL,
          name: process.env.SENDER_NAME,
        },
      },
    },
  }
}
