import moment, { Moment } from 'moment-timezone'
import { BadRequestError } from '../errors'

export const timestampsForEmiAutoPay = async (): Promise<{
  startTimeStramp: Date
  endTimeStramp: Date
}> => {
  let startTimeStramp = new Date(Date.now())
  startTimeStramp.setDate(startTimeStramp.getDate() - 1)
  startTimeStramp.setHours(18, 30, 0, 0)
  let endTimeStramp = new Date(Date.now())
  endTimeStramp.setHours(18, 30, 0, 0)
  return Promise.resolve({ startTimeStramp, endTimeStramp })
}

export const dateCheck = (firstDueDate: Date) => {
  const dueDate: Date = new Date(firstDueDate)
  const currentDate: Date = new Date()
  const differenceInMillis: number = dueDate.getTime() - currentDate.getTime()
  const differenceInDays: number = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24))
  return differenceInDays
}

export function compareDates(date1: Date | number, date2: Date | number) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  // Extract DDMMYY parts
  const dd1 = d1.getDate()
  const mm1 = d1.getMonth()
  const yy1 = d1.getFullYear()

  const dd2 = d2.getDate()
  const mm2 = d2.getMonth()
  const yy2 = d2.getFullYear()

  // Create new dates from extracted parts (ignoring time)
  const datePart1 = new Date(yy1, mm1, dd1)
  const datePart2 = new Date(yy2, mm2, dd2)

  // Compare dates
  return datePart1 < datePart2
}

export const getTimeInIst = (date?: Date): Date => {
  const options = { timeZone: 'Asia/Kolkata', hour12: false }
  return new Date(
    date ? date.toLocaleString('en-US', options) : new Date().toLocaleString('en-US', options),
  )
}

export const getDifferenceInDays = (date1: Date, date2?: Date) => {
  const now = moment().tz('Asia/Kolkata')

  return date2 ? moment(date2).diff(moment(date1), 'days') : now.diff(moment(date1), 'days')
}

export const isDateAfter = (date: Date, date2: Date, same = false) => {
  return same ? moment(date).isSameOrAfter(moment(date2)) : moment(date).isAfter(moment(date2))
}

export const convertToDate = (dateString: string | null): Date | null => {
  // console.log('dateString', dateString)

  if (!dateString) {
    return null
  }

  const months: { [key: string]: number } = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  }

  const [day, month, year] = dateString.split('-')
  const dayNum = parseInt(day, 10)
  const monthIndex = months[month]
  const yearNum = parseInt(year, 10)

  if (isNaN(dayNum) || isNaN(monthIndex) || isNaN(yearNum)) {
    return null
  }
  return new Date(yearNum, monthIndex, dayNum)
}

export const convertToSeconds = (time: string): number | null => {
  if (!time || !time.includes(':')) return null
  const [hours, minutes, seconds] = time.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null
  return hours * 3600 + minutes * 60 + seconds
}

export const convertToMySQLDateTime = (dateTime: string): string | null => {
  if (!dateTime || !dateTime.includes(' ')) return null

  const [datePart, timePart] = dateTime.split(' ')
  const [day, month, year] = datePart.split('-')

  if (!day || !month || !year) return null

  return `${year}-${month}-${day} ${timePart}`
}

export const convertToMySQLDateTimePro = (dateTime: string): string | null => {
  if (!dateTime || !dateTime.includes(' ')) return null

  const [datePart, timePart] = dateTime.split(' ')

  const [year, month, day] = datePart.split('-')

  if (!day || !month || !year || !timePart) return null

  if (isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) return null

  const timeParts = timePart?.split(':')
  if (timeParts.length !== 3 || timeParts.some(part => isNaN(Number(part)))) return null

  return `${year}-${month}-${day} ${timePart}`
}

export const checkUploadTimeIST = () => {
  const currentDateUTC = new Date()

  const ISTOffset = 5.5 * 60 * 60 * 1000
  const currentDateIST = new Date(currentDateUTC.getTime() + ISTOffset)

  const currentHourIST = currentDateIST.getUTCHours()
  const currentMinuteIST = currentDateIST.getUTCMinutes()

  const cutoffHourIST = 21 //21
  const cutoffMinuteIST = 30 //30

  if (
    currentHourIST > cutoffHourIST ||
    (currentHourIST === cutoffHourIST && currentMinuteIST > cutoffMinuteIST)
  ) {
    throw new BadRequestError('Please upload the file before 9:30 PM IST.')
    //return false
  }
}

export const addMonthNoOverflow = (date: Moment, day: number): Moment => {
  // Clone the date to avoid mutating the original
  let newDate = date.clone()

  // Add one month
  newDate.add(1, 'month')

  // Ensure the day does not overflow
  const daysInMonth = newDate.daysInMonth()
  newDate.date(Math.min(day, daysInMonth))

  return newDate
}

export const addMonthsToDate = (date: Moment, months: number): Moment => {
  return moment(date).add(months, 'month')
}

export const subtractDayFromDate = (date: Moment, day: number): Moment => {
  return moment(date).subtract(day, 'day')
}

export const addDaysToDate = (date: Date, daysToAdd: number) => {
  return moment(date).add(daysToAdd, 'days')
}

export const getCurrentTime = (withTime = true) => {
  return withTime ? new Date() : new Date(new Date().setHours(0, 0, 0, 0))
}
