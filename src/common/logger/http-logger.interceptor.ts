import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as R from 'ramda'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Logger } from '.'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {
    this.logger.setContext('HttpServer')
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    if (!req || req.originalUrl === '/graphql') {
      return next.handle()
    }

    this.logger.log({
      message: 'Http Request',
      requester: this.getRequester(req.headers),
      request: {
        method: req.method,
        endpoint: req.originalUrl,
        body: req.body,
        params: req.query,
      },
    })

    const now = Date.now()

    return next
      .handle()
      .pipe(
        tap(response => {
          this.logger.log({
            message: 'Http Response',
            executionTime: Date.now() - now,
            requester: this.getRequester(req.headers),
            request: {
              method: req.method,
              endpoint: req.originalUrl,
              body: req.body,
              params: req.query,
            },
            response: {
              body: response,
            },
          })
        })
      )
      .pipe(
        catchError(error => {
          this.logger.error(
            {
              message: 'Http Error',
              executionTime: Date.now() - now,
              requester: this.getRequester(req.headers),
              error: {
                message: error.message,
                code: error.code,
                stack: error.stack,
              },
              request: {
                method: req.method,
                endpoint: req.originalUrl,
                body: req.body,
                params: req.query,
              },
            },
            error.stack
          )

          return throwError(error)
        })
      )
  }

  private getRequester(headers: Record<string, any>) {
    try {
      const authHeader: string = headers?.authorization
      if (!authHeader) {
        return null
      }

      const [, token] = authHeader.split('Bearer ')
      const payload = jwt.decode(token)

      return R.pick(['sub'], payload)
    } catch {
      return null
    }
  }
}
