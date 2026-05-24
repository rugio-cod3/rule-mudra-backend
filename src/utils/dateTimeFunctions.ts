import { differenceInCalendarDays } from "date-fns";
import moment, { Moment } from "moment";

export const timestampsForEmiAutoPay = async (): Promise<{
  startTimeStramp: Date;
  endTimeStramp: Date;
}> => {
  let startTimeStramp = new Date(Date.now());
  startTimeStramp.setDate(startTimeStramp.getDate() - 1);
  startTimeStramp.setHours(18, 30, 0, 0);
  let endTimeStramp = new Date(Date.now());
  endTimeStramp.setHours(18, 30, 0, 0);
  return Promise.resolve({ startTimeStramp, endTimeStramp });
};

export const dateCheck = (firstDueDate: Date) => {
  const dueDate: Date = new Date(firstDueDate);
  const currentDate: Date = new Date();
  // const differenceInMillis: number = dueDate.getTime() - currentDate.getTime()
  // const differenceInDays: number = Math.ceil(
  //   differenceInMillis / (1000 * 60 * 60 * 24),
  // )
  const differenceInDays = differenceInCalendarDays(dueDate, currentDate);

  return differenceInDays;
};

export function compareDates(date1: Date | number, date2: Date | number) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Extract DDMMYY parts
  const dd1 = d1.getDate();
  const mm1 = d1.getMonth();
  const yy1 = d1.getFullYear();

  const dd2 = d2.getDate();
  const mm2 = d2.getMonth();
  const yy2 = d2.getFullYear();

  // Create new dates from extracted parts (ignoring time)
  const datePart1 = new Date(yy1, mm1, dd1);
  const datePart2 = new Date(yy2, mm2, dd2);

  // Compare dates
  return datePart1 < datePart2;
}

export const addMonthNoOverflow = (date: Moment, day: number): Moment => {
  // Clone the date to avoid mutating the original
  let newDate = date.clone();

  // Add one month
  newDate.add(1, "month");

  // Ensure the day does not overflow
  const daysInMonth = newDate.daysInMonth();
  newDate.date(Math.min(day, daysInMonth));

  return newDate;
};

export const addMonthsToDate = (date: Moment, months: number): Moment => {
  return moment(date).add(months, "month");
};

export const subtractDayFromDate = (date: Moment, day: number): Moment => {
  return moment(date).subtract(day, "day");
};

// export const getTimeInIst = (date?: Date): Date => {
//   const options = { timeZone: 'Asia/Kolkata', hour12: false }
//   return new Date(
//     date
//       ? date.toLocaleString('en-US', options)
//       : new Date().toLocaleString('en-US', options),
//   )
// }
export const getTimeInIst = (date: Date = new Date()): Date => {
  const istOffset = 330; // minutes ahead of UTC
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + istOffset * 60000);
};

export const getDifferenceInDays = (date1: Date, date2?: Date) => {
  const now = moment();

  return date2
    ? moment(date2).diff(moment(date1), "days")
    : now.diff(moment(date1), "days");
};

export const isDateAfter = (date: Date, date2: Date, same = false) => {
  return same
    ? moment(date).isSameOrAfter(moment(date2), 'day')
    : moment(date).isAfter(moment(date2), 'day');
};

export const addDaysToDate = (date: Date, daysToAdd: number) => {
  return moment(date).add(daysToAdd, "days");
};

export const getCurrentTime = (withTime = true) => {
  return withTime ? new Date() : new Date(new Date().setHours(0, 0, 0, 0));
};
