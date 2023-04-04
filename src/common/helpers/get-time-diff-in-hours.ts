import { DateTime } from 'luxon'

export function getTimeDiffInHours(from: Date | DateTime, to: Date | DateTime) {
  const fromDate = from instanceof Date ? DateTime.fromJSDate(from) : from
  const toDate = to instanceof Date ? DateTime.fromJSDate(to) : to

  return Math.round(toDate.diff(fromDate).as('hours'))
}
