import { TenureMaxEmi } from '@/enums/credit.enum'
import { dateCheck } from '@/utils/dateTimeFunctions'
import { getKnexInstance } from '@/utils/mysql'
import * as dateFns from 'date-fns'
import { addDays, addMonths, differenceInCalendarDays, format } from 'date-fns'

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
  const daysDifference: number = Math.floor(
    differenceMs / (1000 * 60 * 60 * 24),
  )
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

export const getNextMonthDate = (day: number): Date => {
  const today = new Date()

  let year = today.getFullYear()
  let month = today.getMonth() + 2

  if (month > 12) {
    month = 1
    year += 1
  }

  const lastDayOfMonth = new Date(year, month, 0).getDate()
  const validDay = Math.min(day, lastDayOfMonth)
  const nextMonthDate = new Date(year, month - 1, validDay, 0, 0, 0)

  const offsetIST = 5.5 * 60 * 60 * 1000 // 5 hours 30 minutes in milliseconds
  nextMonthDate.setTime(nextMonthDate.getTime() + offsetIST)

  return nextMonthDate
}
export const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0]
}
// Helper to check if a date is a holiday
export const isHoliday = async (date: Date): Promise<boolean> => {
  const db = getKnexInstance()
  const formattedDate = formatDateToYYYYMMDD(date)
  const result = await db('repaydate_holiday')
    .whereRaw('DATE(repaydate) = ?', [formattedDate])
    .orderBy('id', 'desc')
    .first()
  return !!result
}

export const isWeekend = async (date: Date): Promise<boolean> => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday (0) or Saturday (6)
}

export const decrementDate = async (date: Date): Promise<Date> => {
  let newDate = new Date(date)
  newDate.setDate(newDate.getDate() - 1)

  // Continue decrementing if the date falls on a weekend or holiday
  while ((await isWeekend(newDate)) || (await isHoliday(newDate))) {
    newDate.setDate(newDate.getDate() - 1)
    if (!isWeekend(newDate) && !(await isHoliday(newDate))) break
  }

  return newDate
}

// Increase the date by one day
export const incrementDate = async (date: Date): Promise<Date> => {
  let newDate = new Date(date)
  newDate.setDate(newDate.getDate() + 1)
  while ((await isWeekend(newDate)) || (await isHoliday(newDate))) {
    newDate.setDate(newDate.getDate() + 1)
    if (!isWeekend(newDate) && !(await isHoliday(newDate))) break
  }

  return newDate
}

// New helper function to handle the case of 29th, 30th, and 31st
export const adjustIfEndOfMonth = async (date: Date): Promise<Date> => {
  const day = date.getDate()
  if (day >= 29) {
    date.setDate(1)
    date.setMonth(date.getMonth() + 1)
  }
  while ((await isWeekend(date)) || (await isHoliday(date))) {
    date = await incrementDate(date)
  }

  return date
}
export const adjustIfEndOfMonthSubtract = async (date: Date): Promise<Date> => {
  const day = date.getDate()
  if (day >= 29) {
    while (date.getDate() > 28) {
      date.setDate(date.getDate() - 1)
    }
  }
  while ((await isWeekend(date)) || (await isHoliday(date))) {
    date = await decrementDate(date)
  }

  return date
}
export const calculateNewDueDate = async (
  dueDate: Date,
  disbursalDate: Date,
): Promise<Date> => {
  const today = new Date()
  if (typeof disbursalDate === 'string') {
    disbursalDate = new Date(disbursalDate)
  }

  if (typeof dueDate === 'string') {
    dueDate = new Date(dueDate)
  }

  const diff = differenceInCalendarDays(dueDate, disbursalDate)
  if (diff < 15) {
    let nextMonth = new Date(dueDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    while ((await isWeekend(nextMonth)) || (await isHoliday(nextMonth))) {
      nextMonth = await decrementDate(nextMonth)
    }
    nextMonth = await adjustIfEndOfMonth(nextMonth)

    return nextMonth
  } else {
    while ((await isWeekend(dueDate)) || (await isHoliday(dueDate))) {
      dueDate = await decrementDate(dueDate)
    }
    let newDiff = differenceInCalendarDays(dueDate, disbursalDate)
    if (newDiff < 15) {
      dueDate = await incrementDate(dueDate)
      while ((await isWeekend(dueDate)) || (await isHoliday(dueDate))) {
        dueDate = await incrementDate(dueDate)
      }
    }
    dueDate = await adjustIfEndOfMonth(dueDate)

    return dueDate
  }
}

export const calculateRepayDate = async (day: number): Promise<Date> => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  let repayDate = new Date(
    format(new Date(currentYear, currentMonth, day), 'yyyy-MM-dd'),
  )
  let diff = differenceInCalendarDays(repayDate, today)
  if (diff <= 0 || diff < 15) {
    repayDate = new Date(
      format(new Date(currentYear, currentMonth + 1, day), 'yyyy-MM-dd'),
    )
    repayDate = await adjustIfEndOfMonth(repayDate)
    diff = differenceInCalendarDays(repayDate, today)
    if (diff < 15) {
      repayDate = new Date(
        format(new Date(currentYear, currentMonth + 2, day), 'yyyy-MM-dd'),
      )
      repayDate = await adjustIfEndOfMonth(repayDate)
    }
    while ((await isWeekend(repayDate)) || (await isHoliday(repayDate))) {
      repayDate = await incrementDate(repayDate)
    }
  }
  while ((await isWeekend(repayDate)) || (await isHoliday(repayDate))) {
    repayDate = await decrementDate(repayDate)
  }
  repayDate = await adjustIfEndOfMonth(repayDate)
  let days = dateCheck(repayDate)
  if (days > 45) {
    while (days > 45) {
      repayDate = await decrementDate(repayDate)
      while ((await isWeekend(repayDate)) || (await isHoliday(repayDate))) {
        repayDate = await decrementDate(repayDate)
      }
      repayDate = await adjustIfEndOfMonthSubtract(repayDate)
      days = dateCheck(repayDate)
    }
  } else if (days < 15) {
    while (days < 15) {
      repayDate = await incrementDate(repayDate)
      while ((await isWeekend(repayDate)) || (await isHoliday(repayDate))) {
        repayDate = await incrementDate(repayDate)
      }
      repayDate = await adjustIfEndOfMonth(repayDate)
      days = dateCheck(repayDate)
    }
  }
  return repayDate
}
export const getAdjustedDueDate = async (startDate: Date): Promise<Date> => {
  let repayDates = TenureMaxEmi.REPAY_DATES

  let tempDate = addDays(startDate, TenureMaxEmi.MIN_DIFF)

  let tempDay = tempDate.getDate()

  let finalDate: Date

  if (tempDay > repayDates[repayDates.length - 1]) {
    let nextMonth = addMonths(tempDate, 1)
    finalDate = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      repayDates[0],
    )
  } else {
    let selectedRepayDate = repayDates.find((date) => date >= tempDay)

    if (!selectedRepayDate) {
      selectedRepayDate = repayDates[repayDates.length - 1]
    }
    finalDate = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth(),
      selectedRepayDate,
    )
  }
  const istOffset = 5.5 * 60 * 60 * 1000
  const istDate = new Date(finalDate.getTime() + istOffset)
  const istDay = istDate.getDate()
  let adjustedIstDate: Date

  if (repayDates.includes(istDay as 1 | 8 | 18)) {
    adjustedIstDate = new Date(
      istDate.getFullYear(),
      istDate.getMonth(),
      istDay,
    )
  } else {
    let selectedRepayDate = repayDates.find((date) => date >= istDay)

    if (!selectedRepayDate) {
      selectedRepayDate = repayDates[repayDates.length - 1]
    }

    adjustedIstDate = new Date(
      istDate.getFullYear(),
      istDate.getMonth(),
      selectedRepayDate,
    )
  }
  const formattedDate = new Date(format(adjustedIstDate, 'yyyy-MM-dd'))
  return formattedDate
}
