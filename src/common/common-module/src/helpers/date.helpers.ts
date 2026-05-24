import * as dateFns from 'date-fns'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { getKnexInstance } from '../utils/mysql'

export const isValidISOString = (dateString: string) => {
  const parsedDate = dateFns.parseISO(dateString)
  if (dateFns.isValid(parsedDate)) {
    return true
  }
  false
}

export const getSqlDateTimeFromISOString = (dateString: string) => {
  /**
   * Convert ISO string to JS date to get date in UTC format.
   * Convert JS Date to ISO string and convert it to sql DateTime.
   */
  const parsedDate = dateFns.parseISO(dateString)
  return parsedDate.toJSON().slice(0, 19).replace('T', ' ')
}

export const calculateMonthsAndDays = (
  startDate: Date,
  endDate: Date,
): { months: number; days: number } => {
  const startMs: number = startDate.getTime()
  const endMs: number = endDate.getTime()
  const differenceMs: number = endMs - startMs
  const daysDifference: number = Math.floor(differenceMs / (1000 * 60 * 60 * 24))
  let monthsDifference: number =
    endDate.getMonth() -
    startDate.getMonth() +
    12 * (endDate.getFullYear() - startDate.getFullYear())

  const remainingDays: number = daysDifference - monthsDifference * 30
  return {
    months: monthsDifference,
    days: remainingDays,
  }
}
export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const Date = `${year}-${month}-${day}`
  return Date
}

export const formatToIST = (date: Date): string => {
  const istTimeZone = 'Asia/Kolkata'
  const istDate = toZonedTime(date, istTimeZone)
  return format(istDate, 'yyyy-MM-dd HH:mm:ss')
}
export const formatToISTDate = (date: Date): string => {
  const istTimeZone = 'Asia/Kolkata'
  const istDate = toZonedTime(date, istTimeZone)
  return format(istDate, 'yyyy-MM-dd')
}
export const isWeekend = async (date: Date): Promise<boolean> => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday (0) or Saturday (6)
}
export const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0]
}
export const isHoliday = async (date: Date): Promise<boolean> => {
  const db = getKnexInstance()
  const formattedDate = formatDateToYYYYMMDD(date)
  const result = await db('repaydate_holiday')
    .whereRaw('DATE(repaydate) = ?', [formattedDate])
    .orderBy('id', 'desc')
    .first()
  return !!result
}
