import { Injectable, LoggerService, Scope } from '@nestjs/common'
import * as util from 'util'

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose'
type Message = string | { message?: string; [k: string]: unknown }

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  private static lastTimestamp?: number
  protected context?: string

  setContext(context: string) {
    this.context = context
  }

  debug(message: Message, context?: string) {
    this.printMessage('debug', message, context)
  }
  log(message: Message, context?: string) {
    this.printMessage('log', message, context)
  }
  verbose(message: Message, context?: string) {
    this.printMessage('verbose', message, context)
  }
  warn(message: Message, context?: string) {
    this.printMessage('warn', message, context)
  }
  error(message: Message, trace = '', context?: string) {
    this.printMessage('error', message, context)
    this.printStackTrace(trace)
  }

  private printMessage(level: LogLevel, payload: Message, messageContext = '') {
    const context = messageContext || this.context

    if (process.env.NODE_ENV === 'dev') {
      return this.printInDevMode(level, payload, context)
    }

    this.printInProdMode(level, payload, context)
  }

  private printInDevMode(level: LogLevel, payload: Message, context = '') {
    const clc = require('cli-color')

    const timestampDiff = this.updateAndGetTimestampDiff(clc)
    const contextMessage = context ? clc.xterm(245)(`[${context}] `) : ''

    const colors = {
      log: clc.green,
      error: clc.red,
      warn: clc.yellow,
      debug: clc.magentaBright,
      verbose: clc.cyanBright,
    }

    const color = colors[level]

    const { message, ...rest } = this.payloadToObject(payload)

    process.stdout.write(`${color(level.padEnd(7))} ${contextMessage}${message}${timestampDiff}\n`)

    if (Object.keys(rest).length) {
      process.stdout.write(
        `${clc.xterm(245)(util.inspect(rest, { colors: true, depth: null, compact: 2 }))}\n\n`
      )
    }
  }

  private printInProdMode(level: LogLevel, payload: Message, context = '') {
    const output = this.payloadToObject(payload)

    output.timestamp = new Date().toISOString()
    output.context = context
    output.level = level

    if (level === 'verbose') {
      console.log(JSON.stringify(output))
      return
    }

    console[level](JSON.stringify(output))
  }

  private payloadToObject(payload: Message): { message: string; [k: string]: unknown } {
    if (typeof payload === 'object') {
      const { message, ...rest } = payload

      return { ...rest, message: message || '' }
    }

    return { message: payload }
  }

  private updateAndGetTimestampDiff(clc: any): string {
    const result = Logger.lastTimestamp
      ? clc.xterm(245)(` +${Date.now() - Logger.lastTimestamp}ms`)
      : ''

    Logger.lastTimestamp = Date.now()
    return result
  }

  private printStackTrace(trace: string) {
    if (!trace) {
      return
    }
    process.stdout.write(`${trace}\n\n`)
  }
}
