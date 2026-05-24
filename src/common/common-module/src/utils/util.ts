import config from '@/config/default'
import bcrypt from 'bcrypt'
import { differenceInCalendarDays, format } from 'date-fns'
import rateLimit from 'express-rate-limit'
import momentTz from 'moment-timezone'
import reader from 'xlsx'
import { Roles } from '../enums/roles.enum'
import { logger } from './logger'
import { getKnexInstance } from './mysql'
const crypto = require('crypto')
const SALT_ROUNDS = 10

export const maskString = (
  str: string | number,
  lengthToMask: number,
  char?: string,
) => {
  if (typeof str === 'number') {
    str = String(str)
  }

  return char
    ? char.repeat(lengthToMask) + str.slice(lengthToMask)
    : 'X'.repeat(lengthToMask) + str.slice(lengthToMask)
}

/**
 * Removes title prefixes and other clippings from a name
 * @param name The name to process
 * @returns Cleaned name without prefixes or clippings
 */
export const replaceNameClippingsRe = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return ''
  }

  try {
    // Convert to lowercase for case-insensitive matching
    const normalizedName = name.toLowerCase().trim()
    if (!normalizedName) return ''

    // Title prefixes and honorifics to remove
    const clippings = [
      'mr.',
      'miss.',
      'mrs.',
      'ms.',
      'dr.',
      'prof.',
      'rev.',
      'capt.',
      'col.',
      'sgt.',
      'fr.',
      'sr.',
      'jr.',
      'adv.',
      'engr.',
      'cdr.',
      'gov.',
      'er.',
      'smt.',
      'lt.',
      'maj.',
      'gen.',
      'pt.',
      // Versions without dots
      'mr',
      'miss',
      'mrs',
      'ms',
      'dr',
      'prof',
      'rev',
      'capt',
      'col',
      'sgt',
      'fr',
      'sr',
      'jr',
      'adv',
      'engr',
      'cdr',
      'gov',
      'er',
      'smt',
      'lt',
      'maj',
      'gen',
      // Cultural and regional titles
      'swami',
      'guruji',
      'pandit',
      'panditji',
      'acharya',
      'maharaj',
      'baba',
      'dean',
      'ca',
      'cs',
      "hon'ble",
      'shri',
      'shree',
      'air cmde',
      'justice',
      'mp',
      'mla',
      'cm',
      'pm',
      'ji',
      'sahib',
      'saheb',
      'thiru',
      'seth',
      'bhai',
      'behen',
      'ben',
      'chacha',
      'tai',
    ]

    // Sort by length descending to handle longer prefixes first
    const sortedClippings = clippings.sort((a, b) => b.length - a.length)

    // Relationship markers that should terminate name processing
    const excludeClippings: Record<string, string> = {
      's/o': 's/o',
      'd/o': 'd/o',
      'w/o': 'w/o',
      'h/o': 'h/o',
      'c/o': 'c/o',
    }

    let processedName = normalizedName

    // Remove title prefixes at the beginning
    for (const clipping of sortedClippings) {
      if (
        processedName === clipping ||
        processedName.startsWith(clipping + ' ')
      ) {
        processedName = processedName.substring(clipping.length).trim()
        break
      }
    }

    // Handle relationship markers - stop processing at these boundaries
    for (const clipping in excludeClippings) {
      if (Object.prototype.hasOwnProperty.call(excludeClippings, clipping)) {
        const regex = new RegExp(
          `(^|\\s)${excludeClippings[clipping]}\\s+`,
          'i',
        )
        const matches = processedName.match(regex)
        if (matches) {
          processedName = processedName.split(regex)[0].trim()
          break
        }
      }
    }

    // Final cleanup - remove any remaining prefixes and normalize spaces
    let nameWords = processedName.split(/\s+/).filter(Boolean)
    while (nameWords.length > 0 && sortedClippings.includes(nameWords[0])) {
      nameWords.shift()
    }

    return removeDotsAndAddSpace(nameWords.join(' ')).trim()
  } catch (error) {
    logger.error(`Error processing name: ${error.message}`, { error })
    return name // Return original name if any error occurs
  }
}

/**
 * Formats a string by removing and replacing dots
 * @param str The string to format
 * @returns Formatted string with dots replaced by spaces
 */
export function removeDotsAndAddSpace(str: string): string {
  if (!str || typeof str !== 'string') {
    return ''
  }

  try {
    // Single regex to handle all dot replacements and space normalization
    return str
      .replace(/^\.+|\.+$/g, '') // Remove dots at beginning and end
      .replace(/\.+/g, ' ') // Replace dots with spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
  } catch (error) {
    logger.error(`Error removing dots: ${error.message}`, { error })
    return str
  }
}

/**
 * Calculates the similarity percentage between two strings.
 * @param first The first string to compare
 * @param second The second string to compare
 * @returns A number between 0 (no similarity) and 100 (identical)
 */
export function similarityPercent(first: string, second: string): number {
  // Handle edge cases
  if (first === second) return 100
  if (!first || !second) return 0

  try {
    const match = similarText(first, second)
    return Math.min(100, (match * 200) / (first.length + second.length))
  } catch (error) {
    logger.error(`Error calculating similarity: ${error.message}`, { error })
    return 0
  }
}

/**
 * Computes the similarity between two strings using an iterative approach
 * @param first The first string to compare
 * @param second The second string to compare
 * @returns A number representing similarity strength
 */
function similarText(first: string, second: string): number {
  if (!first || !second) return 0

  const firstLength = first.length
  const secondLength = second.length

  // Use dynamic programming to avoid recursion and potential stack overflow
  let result = 0
  const stack: [string, string][] = [[first, second]]

  while (stack.length > 0) {
    const [s1, s2] = stack.pop()!

    if (!s1 || !s2) continue

    let pos1 = 0,
      pos2 = 0,
      maxLen = 0

    // Find the longest common substring
    for (let i = 0; i < s1.length; i++) {
      for (let j = 0; j < s2.length; j++) {
        let len = 0
        while (
          i + len < s1.length &&
          j + len < s2.length &&
          s1[i + len] === s2[j + len]
        ) {
          len++
        }

        if (len > maxLen) {
          maxLen = len
          pos1 = i
          pos2 = j
        }
      }
    }

    if (maxLen > 0) {
      result += maxLen

      // Process remaining parts
      if (pos1 > 0 && pos2 > 0) {
        stack.push([s1.substring(0, pos1), s2.substring(0, pos2)])
      }

      if (pos1 + maxLen < s1.length && pos2 + maxLen < s2.length) {
        stack.push([s1.substring(pos1 + maxLen), s2.substring(pos2 + maxLen)])
      }
    }
  }

  return result
}

/**
 * Creates a memoized version of the similarityPercent function with LRU caching
 * @param options Configuration options for the memoization
 * @returns A memoized version of the similarity percentage calculator
 */
export const memoizedSimilarityPercent = (
  options: { maxCacheSize?: number } = {},
): ((first: string, second: string) => number) => {
  const { maxCacheSize = 1000 } = options
  const cache = new Map<string, { value: number; lastAccessed: number }>()
  let accessCounter = 0

  // Create consistent cache keys regardless of parameter order
  const createCacheKey = (a: string, b: string): string =>
    a.localeCompare(b) < 0 ? `${a}|${b}` : `${b}|${a}`

  // Efficiently manage cache size
  const trimCache = () => {
    if (cache.size < maxCacheSize) return

    // Convert to array for sorting
    const entries = Array.from(cache.entries())
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)

    // Remove oldest 10% to avoid frequent trimming
    const removeCount = Math.max(1, Math.floor(maxCacheSize * 0.1))
    for (let i = 0; i < removeCount && i < entries.length; i++) {
      cache.delete(entries[i][0])
    }
  }

  return (first: string, second: string): number => {
    if (first === second) return 100
    if (!first || !second) return 0

    const key = createCacheKey(first, second)

    // Check cache
    if (cache.has(key)) {
      const entry = cache.get(key)!
      entry.lastAccessed = ++accessCounter
      return entry.value
    }

    // Calculate similarity
    const result = similarityPercent(first, second)

    // Manage cache
    if (cache.size >= maxCacheSize) {
      trimCache()
    }

    cache.set(key, { value: result, lastAccessed: ++accessCounter })
    return result
  }
}

export const applyExcelRateLimit = () =>
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many download requests, please try again after 5 minutes',
  })

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (error) {
    throw new Error('Error hashing password')
  }
}

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hash)
    return match
  } catch (error) {
    throw new Error('Error comparing password')
  }
}

export const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' ')
}

export const generateRandomId = (prefix: string) => {
  // Randomly select either 15 or 16 as the string length
  const length = Math.floor(Math.random() * 2) + 15 // Generates either 15 or 16

  // Generate random bytes and convert them to hexadecimal
  let uniqueString = crypto
    .randomBytes(length)
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length) // Ensure the length is exactly 15 or 16

  return prefix + '_' + uniqueString
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

export const dateCheck = (firstDueDate: Date) => {
  const dueDate: Date = new Date(firstDueDate)
  const currentDate: Date = new Date()
  // const differenceInMillis: number = dueDate.getTime() - currentDate.getTime()
  // const differenceInDays: number = Math.ceil(
  //   differenceInMillis / (1000 * 60 * 60 * 24),
  // )
  const differenceInDays = differenceInCalendarDays(dueDate, currentDate)

  return differenceInDays
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

export function getEmiAPR(
  loanAmount: string,
  platFormFee: string,
  otherFee: string,
  tenure: string,
  roi: string,
): number {
  // Convert comma-separated values to numeric
  const periods = parseFloat(tenure.replace(/,/g, ''))
  let loanAmt = parseFloat(loanAmount.replace(/,/g, ''))
  const charges =
    parseFloat(platFormFee.replace(/,/g, '')) +
    parseFloat(otherFee.replace(/,/g, ''))

  // Calculate present value
  const present = loanAmt - charges

  // Initialize variables
  let guess = 0.01
  let future = 0
  const type = 0
  const ROI = parseFloat(roi) / 100
  const rateI = ROI / 12
  const fv = 0

  // Calculate payment amount
  const pvif = Math.pow(1 + rateI, periods)
  const pmt = (rateI / (pvif - 1)) * -(loanAmt * pvif + fv)
  const payment = pmt

  // Set maximum epsilon for end of iteration
  const epsMax = 1e-10
  // Set maximum number of iterations
  const iterMax = 10

  // Implement Newton's method
  let y = 0
  let y0 = 0
  let y1 = 0
  let x0 = 0
  let x1 = 0
  let f = 0
  let i = 0
  let rate = guess

  if (Math.abs(rate) < epsMax) {
    y =
      present * (1 + periods * rate) +
      payment * (1 + rate * type) * periods +
      future
  } else {
    f = Math.exp(periods * Math.log(1 + rate))
    y = present * f + payment * (1 / rate + type) * (f - 1) + future
  }

  y0 = present + payment * periods + future
  y1 = present * f + payment * (1 / rate + type) * (f - 1) + future
  i = x0 = 0
  x1 = rate

  while (Math.abs(y0 - y1) > epsMax && i < iterMax) {
    rate = (y1 * x0 - y0 * x1) / (y1 - y0)
    x0 = x1
    x1 = rate

    if (Math.abs(rate) < epsMax) {
      y =
        present * (1 + periods * rate) +
        payment * (1 + rate * type) * periods +
        future
    } else {
      f = Math.exp(periods * Math.log(1 + rate))
      y = present * f + payment * (1 / rate + type) * (f - 1) + future
    }

    y0 = y1
    y1 = y
    i++
  }

  const rate1 = rate * 100
  const ddk = rate1 * 12
  const APR = ddk.toFixed(2)

  // Output the result
  return +APR
}
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true
  } else if (typeof value !== 'number' && value === '') {
    return true
  } else if (typeof value === 'undefined' || value === undefined) {
    return true
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true
  } else {
    return false
  }
}

/**
 * @method formatDate
 * @param {string} date
 * @returns yyyy-MM-dd formatted date
 */
export const formatDate = (date: string): string => {
  // edge case
  if (!date) return null
  if (date.length > 10) date = date.slice(0, 10)
  const arr = date.split('/')
  if (arr.length == 1) return arr[0]
  arr.reverse()
  const newDate = arr.join('-')
  return newDate
}

/**
 * @method isGoodDate
 * @param {String } dt
 * @returns {Boolean} true & false
 * @description this dt is date format Check ie (DD-MM-YYYY)
 */
export const isGoodDate = (dt: string): boolean => {
  const reGoodDate =
    /^(0?[1-9]|[12][0-9]|3[01])[- /.]((0?[1-9]|1[012])[- /.](19|20)?[0-9]{2})*$/
  return reGoodDate.test(dt)
}

/**
 * @method formatDates
 * @param {String } dt
 * @returns {Date} true & false
 * @description dt will be formatted to (YYYY/MM/DD)
 */
export const formatDates = (dt: string): Date => {
  if (dt.includes('-')) {
    return new Date(dt.split('-').reverse().join('/'))
  }
  return new Date(dt.split('/').reverse().join('/'))
}

export const getDataFromFile = (fileParam: any): any[] => {
  const file = reader.read(fileParam.buffer, { type: 'buffer' })

  const data = []

  const sheets = file.SheetNames

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
    temp.forEach((res) => {
      data.push(res)
    })
  }

  return data
}

export const convertToNumbers = (objBody: object, paramsArr: string[]) => {
  for (const key in objBody) {
    if (paramsArr.includes(key)) objBody[key] = Number(objBody[key])
  }
}

export const convertToArray = (objBody: object, paramsArr: string[]) => {
  for (const param of paramsArr) {
    const val = objBody[param]
    if (val && !Array.isArray(val)) {
      try {
        objBody[param] = JSON.parse(val)
      } catch (err) {
        logger.error(err.stack)
      }
    }
  }
}

export function truncateString(inputString: string, maxLength = 35) {
  if (inputString.length > maxLength) {
    const truncatedString = inputString.substring(0, maxLength)
    return truncatedString
  } else {
    return inputString
  }
}

export const convertRupeesToPaise = (amount: number) => {
  return amount * 100
}

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const roundNumber = (num: number, precision?: number) => {
  if (precision) return parseFloat(num.toFixed(2))
  return Math.round(num)
}

export const calculateTotalPages = (
  totalData: number,
  limitPerPage: number,
) => {
  if (totalData === 0) return 0
  return Math.ceil(totalData / limitPerPage)
}

export function injectBindings(sql: string, bindings: string | Array<any>) {
  let index = 0
  return sql.replace(/\?/g, () => {
    const binding = bindings[index++]
    return typeof binding === 'string' ? `'${binding}'` : binding
  })
}

export const createLoanNumber = () => {
  return (
    'HC' + momentTz().format('YYYYMMDDHHmmss') + crypto.randomInt(1000, 10000)
  )
}
export function findAndParseJson(inputString: string) {
  let start = -1
  let openBraces = 0

  for (let i = 0; i < inputString.length; i++) {
    const char = inputString[i]

    if (char === '{') {
      if (openBraces === 0) start = i
      openBraces++
    } else if (char === '}') {
      openBraces--
      if (openBraces === 0 && start !== -1) {
        const jsonString = inputString.slice(start, i + 1)
        try {
          return JSON.parse(jsonString)
        } catch (error) {
          return null
        }
      }
    }
  }

  return null
}
export function convertQueryStringToJson(queryString: string) {
  const jsonObject: Record<string, string> = {}

  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=')
    jsonObject[key] = value ? decodeURIComponent(value) : ''
  })

  return jsonObject
}
export function isJson(value: any) {
  try {
    return JSON.parse(value)
  } catch (error) {
    return false
  }
}
export function processLogsApiRequest(logsData: any) {
  if (typeof logsData === 'string') {
    if (logsData.includes('=') && logsData.includes('&')) {
      return convertQueryStringToJson(logsData)
    }
  }

  const parsedJson = isJson(logsData)
  return parsedJson !== false ? parsedJson : findAndParseJson(logsData)
}
export function generateOTP() {
  const otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111
  return otp
}

export const roleAuthorizer = (role: Roles, roles: Array<Roles>) => {
  if (roles.includes(role)) {
    return true
  }

  return false
}

export const permissionAuthorizer = (
  permissions: string[],
  userPermissions: Set<String>,
) => {
  return permissions.every((item) => userPermissions.has(item))
}

export const generatePennyDropId = () => {
  // Randomly select either 15 or 16 as the string length
  const length = Math.floor(Math.random() * 2) + 15 // Generates either 15 or 16

  // Generate random bytes and convert them to hexadecimal
  let uniqueString = crypto
    .randomBytes(length)
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length) // Ensure the length is exactly 15 or 16

  return 'fav_' + uniqueString
}
export const generateFinboxLinkId = (customerID: number, env: 'km' | 'rf') => {
  if (env === 'rf') return `rf-${customerID}`
  else return `km-${customerID}`
}
export function isObjectEmpty(value: unknown) {
  if (value == null || typeof value !== 'object') {
    return false
  }

  if (Array.isArray(value)) {
    return false
  }

  return Object.keys(value).length === 0
}

export const calculateBounceCharge = (): number => {
  const fixedBounce = +config.dpdPenalty
  const gst = Math.round(fixedBounce * (+config.gst / 100))
  const totalBounce = fixedBounce + gst

  return totalBounce
}

export const calculatePenalty = (
  emiAmount: number,
  overdueDays: number,
  roi: number,
): number => {
  const perDay = roi / 365 + +config.ipcDpdInterest
  const result = ((emiAmount * perDay) / 100) * overdueDays
  const fixResult = round(result)
  return fixResult
}

export const round = (num: number) => Math.ceil(num)

export const stringifyError = (err: Error) => {
  return JSON.stringify(err, Object.getOwnPropertyNames(err))
}

export const generateWaiverId = (length = 14) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from(crypto.randomBytes(length))
    .map((byte: number) => chars[byte % chars.length])
    .join('')
}
export const roundAmountBanking = (amount: number) => {
  // Convert to integer
  amount = Math.floor(Number(amount))

  let roundedAmount
  if (amount % 1000 !== 0) {
    roundedAmount = Math.ceil(amount / 1000) * 1000
  } else {
    roundedAmount = amount
  }

  // Cap at 30000
  if (roundedAmount > 30000) {
    roundedAmount = 30000
  }

  return roundedAmount
}
