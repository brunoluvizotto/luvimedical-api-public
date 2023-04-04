import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    })

    this.$use(async (params, next) => {
      // Check incoming query type
      if (['Physician', 'MailTemplate', 'MailSchedule'].includes(params.model)) {
        const now = new Date()
        if (params.action === 'delete') {
          // Delete queries
          // Change action to an update
          params.action = 'update'
          params.args['data'] = { deletedAt: now }
        }
        if (params.action === 'deleteMany') {
          // Delete many queries
          params.action = 'updateMany'
          if (params.args.data != undefined) {
            params.args.data['deletedAt'] = now
          } else {
            params.args['data'] = { deletedAt: now }
          }
        }
      }

      const result = await next(params)

      return fixTime(['startTime', 'endTime'])(result)
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}

const UNIX_TIMESTAMP_LIMIT = 200000000

function fixTime(keys: string[]) {
  return (obj: any) => {
    if (!obj || Object.keys(obj).length === 0) {
      return obj
    }

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]
      if (obj[key] instanceof Date && obj[key].getTime() < UNIX_TIMESTAMP_LIMIT) {
        obj[key] = obj[key].toLocaleTimeString()
      }
    }

    if (Array.isArray(obj)) {
      return obj.map(fixTime(keys))
    }

    if (Object(obj) === obj) {
      return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fixTime(keys)(v)]))
    }

    return obj
  }
}
