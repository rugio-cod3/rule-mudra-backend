import config from '@/config/default'
import { Buffer } from 'buffer'
import * as validator from 'class-validator'
import { format } from 'date-fns'
import { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { performance } from 'perf_hooks'
import { leadModel } from '../database/mysql/leads'
import MediaFileModel from '../database/mysql/mediaFile'
import { roleModel } from '../database/mysql/roles'
import { userModel } from '../database/mysql/users'
import { LeadStatus } from '../enums/lead.enum'
import { BadRequestError } from '../errors'
import { ICredit } from '../interfaces/credit.interface'
import { IEmailSendData } from '../interfaces/mailTemplate.interface'
import { sendSendinblueMail } from '../services/common'
import CreditService from '../services/credit.service'
import S3Service from '../services/thirdParty/s3.service'
import { logger } from '../utils/logger'
import { getKnexInstance } from '../utils/mysql'
import { calculateMonthsAndDays } from './date.helpers'
const crypto = require('crypto')
const Algorithm = 'aes-256-cbc'

export default class CommonHelper {
  private static db = getKnexInstance
  static FileModel = new MediaFileModel()
  private static creditService = new CreditService()
  private static s3Service = new S3Service()
  // private static encryptionKey1 = 'aunIZIqqJ61r9axoVHlzJlrivpTIz0mKLaKIEa27MjQ7TobK90qRys6MweJZSBLU'
  private static encryptionKey1 = crypto
    .createHash('sha256')
    .update('aunIZIqqJ61r9axoVHlzJlrivpTIz0mKLaKIEa27MjQ7TobK90qRys6MweJZSBLU')
    .digest('hex')
    .substr(0, 32)
  private static ivKey1 = 'CPhD7qM6s7JJ8ccs'
  // private static encryptionKey2 = 'SJnJ3yBvaJYY7avV5U9zxeJO2hAZyjPMKmrvmpVU6SZuVBNXkCWfSiNA3n0F7ozR'
  private static encryptionKey2 = crypto
    .createHash('sha256')
    .update('SJnJ3yBvaJYY7avV5U9zxeJO2hAZyjPMKmrvmpVU6SZuVBNXkCWfSiNA3n0F7ozR')
    .digest('hex')
    .substr(0, 32)
  private static ivKey2 = 'f79wsjljb5kn8cyr'
  public readonly roleModel = roleModel
  private readonly leadModel = leadModel

  static ucwords(str: string) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
      return $1.toUpperCase()
    })
  }
  static indianFormateAmount(x) {
    return x.toString().split('.')[0].length > 3
      ? x
          .toString()
          .substring(0, x.toString().split('.')[0].length - 3)
          .replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
          ',' +
          x.toString().substring(x.toString().split('.')[0].length - 3)
      : x.toString()
  }

  static getSuccessResponse(
    res,
    code = 200,
    message = '',
    value = true,
    result = {},
    totalCount = 0,
    tpApiAccessData?: any,
  ) {
    if (code == 200 && value == true) {
      value = true
    } else {
      value = false
    }

    const responseBody = {
      message: message,
      status: value,
      data: result,
      count: totalCount,
    }

    if (tpApiAccessData) {
      try {
        let respTime
        if (tpApiAccessData?.startTime) {
          const startTime = tpApiAccessData.startTime
          const endTime = performance.now()
          respTime = (endTime - startTime).toFixed(2)
          delete tpApiAccessData.startTime
        }
        const data = {
          ...tpApiAccessData,
          response_time: respTime || null,
          response_params: responseBody,
          request_headers: res.req.rawHeaders,
          request_params: res.req.body,
          response_status: code,
          url: res.req.url,
          created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }
        // this.apiModel.addTpApiAccessData(data);
      } catch (err) {
        logger.error(err)
      }
    }

    res.resBody = responseBody
    res.status(code).json(responseBody)
  }

  static getResponse(res, code = 200, message = '', value = true, result = {}, totalCount = 0) {
    const status = code === 200 && value

    const responseBody = {
      message,
      status,
      ...result,
      count: totalCount,
    }

    res.resBody = responseBody
    res.status(code).json(responseBody)
  }

  static commonValidations(data: Object, validatorDate: Object) {
    const errorArray = []
    if (validatorDate) {
      let specificValidationValue: string | number
      let min: any, max: any
      Object.entries(validatorDate).forEach(async ([key, value]) => {
        const validationList = value.split(' | ')
        validationList.forEach((listData: string) => {
          if (listData.indexOf(':') !== -1) {
            const specificValidationList = listData.split(':')
            listData = specificValidationList[0]
            specificValidationValue = specificValidationList[1]
            min = specificValidationValue
            if (specificValidationList[0] == 'min') {
              min = specificValidationList[1]
            } else if (specificValidationList[0] == 'max') {
              max = specificValidationList[1]
            }
          }
          switch (listData) {
            case 'required':
              if (validator.isEmpty(data[key])) {
                key = key.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2')
                key = key
                  .split(' ')
                  .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
                  .join(' ')
                errorArray.push(key + ' is a required field.')
              }
              break
            case 'numeric':
              if (!validator.isNumber(data[key])) {
                errorArray.push(key + ' should be numeric - ' + data[key])
              }
              break
            case 'string':
              if (!validator.isString(data[key])) {
                errorArray.push(key + ' should be string - ' + data[key])
              }
              break
            case 'object':
              if (!validator.isObject(data[key])) {
                errorArray.push(key + ' should be object - ' + data[key])
              }
              break
            case 'email':
              if (!validator.isEmail(data[key])) {
                errorArray.push(key + ' should be valid email - ' + data[key])
              }
              break
            case 'boolean':
              if (!validator.isBoolean(data[key])) {
                errorArray.push(key + ' should be valid boolean - ' + data[key])
              }
              break
            case 'date':
              if (!validator.isString(data[key])) {
                errorArray.push(key + ' should be valid date string- ' + data[key])
              } else if (isNaN(new Date(data[key]).getTime())) {
                errorArray.push(key + ' should be valid date- ' + data[key])
              }
              break
            case 'digits':
            case 'min':
            case 'max':
              if (!validator.isByteLength(String(data[key]), min, max)) {
                errorArray.push(
                  `${key} should be of ${
                    min && max ? 'minimum ' + min + ' and maximum ' + max : specificValidationValue
                  } digits - ${data[key]}`,
                )
              }
              break
            case 'no_start_05':
              if (/^[0-5]/.test(data[key])) {
                errorArray.push(`${key} should not start with digits 0 through 5.`)
              }
              break
          }
        })
      })
    }
    return errorArray
  }

  static async formatBytes(bytes: number) {
    const decimals = 2
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const fileSize = `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    return fileSize
  }

  static async uploadData(data: {
    base64Data: any
    filename: any
    fileformat: any
    docyTypeId: any
    docyType?: string
    lead_id: any
    user_id: any
    docType?: any
  }) {
    const localfilePath = `/tmp/${data.filename}.${data.fileformat}`

    fs.writeFile(localfilePath, data.base64Data, 'base64', async function (err) {
      if (err) {
        throw err
      } else {
        const uploadFileData = {
          localfilePath: localfilePath,
          fileFormat: data.fileformat,
          fileName: data.filename,
          docType: data.docType,
          userId: data.user_id,
          leadId: data.lead_id,
          title: data.docyType,
          docyTypeId: data.docyTypeId,
          transactionId: '0',
          s3GenerateFileName: false,
        }

        // await uploadFileOnServer(uploadFileData);
      } // writes out fiuploadFileOnServerle without error
    })
  }

  static is_valid_mobile_number(mobile_number) {
    const regex = `/^[6789]\d{9}$/`
    return regex.match(mobile_number)
  }

  static prepareDataForCsv(data: any): string {
    let csvData = ''

    const headers = Object.keys(data[0])
    const rows = data.map((user: any) => Object.values(user).join(','))

    csvData += headers.join(',') + '\r\n'
    csvData += rows.join('\r\n')

    return csvData
  }

  static async onlyDigits(s) {
    for (let i = s.length - 1; i >= 0; i--) {
      const d = s.charCodeAt(i)
      if (d < 48 || d > 57) return false
    }
    return true
  }

  static parseName(input: string) {
    const [firstName, ...restNames] = (input || '').trim().split(' ')
    const lastName = restNames.pop() || ''
    const middleName = restNames.join(' ')

    return {
      firstName,
      middleName,
      lastName,
    }
  }
  static createUserName(length: number) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return 'AK' + format(new Date(), 'yyyyMMdd') + result
  }

  static generateSHA256Hash(payload: string): string {
    return crypto.createHash('sha256').update(payload).digest('hex')
  }
  static otpCode() {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
    const randomCode = String(randomNumber).padStart(4, '0')
    return randomCode
  }

  static aesEncryption(data: string): string {
    const cipher1 = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey1, 'utf8'),
      Buffer.from(this.ivKey1, 'utf8'),
    )
    let encryptedData1 = cipher1.update(data, 'utf8', 'base64')
    encryptedData1 += cipher1.final('base64')

    const cipher2 = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey2, 'utf8'),
      Buffer.from(this.ivKey2, 'utf8'),
    )
    let encryptedData2 = cipher2.update(encryptedData1, 'base64', 'base64')
    encryptedData2 += cipher2.final('base64')

    return encryptedData2
  }

  static aesDecryption(data: string): string {
    const decipher2 = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey2, 'utf8'),
      Buffer.from(this.ivKey2, 'utf8'),
    )
    let decryptedData2 = decipher2.update(data, 'base64', 'base64')
    decryptedData2 += decipher2.final('base64')

    const decipher1 = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey1, 'utf8'),
      Buffer.from(this.ivKey1, 'utf8'),
    )
    let decryptedData1 = decipher1.update(Buffer.from(decryptedData2, 'base64'), 'base64', 'utf8')
    decryptedData1 += decipher1.final('utf8')

    return decryptedData1
  }

  public sendResponse = (
    res: Response,
    success: boolean,
    message: string,
    data: {},
    statusCode: number,
  ): Promise<Response> => {
    return Promise.resolve(
      res.status(statusCode).json({
        success: success,
        message: message,
        data: data,
      }),
    )
  }
  static lastEMIUpdater = async (
    emiRemains: number,
    creditID: number,
    lastEMIDate: Date,
    creditActualTenure: number,
    leadID: number,
  ): Promise<void> => {
    let { months, days } = await calculateMonthsAndDays(new Date(lastEMIDate), new Date(Date.now()))
    if (emiRemains == 0) {
      await this.creditService.updateOne({ creditID: creditID }, {
        status: 'closed',
        actualTenure: creditActualTenure + months + parseFloat(`0.${days}`),
        emiLeft: 0,
        amountToBeRepayed: 0,
      } as ICredit)
      await leadModel.findOneAndUpdate({ leadID: leadID }, { status: LeadStatus.CLOSED })
    }
  }
  public getBaseUrl = (): string => {
    switch (config.nodeEnv) {
      case 'development':
        return config.devBaseUrl
      case 'staging':
        return config.stagingBaseUrl
      case 'preprod':
        return config.preprodBaseUrl
      case 'production':
        return config.prodBaseUrl
      default:
        throw new Error(`Unknown environment: ${config.nodeEnv}`)
    }
  }

  public getReactBaseUrl = (): string => {
    switch (config.nodeEnv) {
      case 'development':
        return config.reactDevBaseUrl
      case 'staging':
        return config.reactStagingBaseUrl
      case 'production':
        return config.reactProdBaseUrl
      default:
        throw new Error(`Unknown environment: ${config.nodeEnv}`)
    }
  }

  // public getJWT = async (
  //   entityId: number,
  //   secret: string,
  // ): Promise<string | boolean> => {
  //   try {
  //     return await Promise.resolve(
  //       jwt.sign({ _id: entityId }, secret, {
  //         expiresIn: '15d',
  //       }),
  //     )
  //   } catch (error) {
  //     logger.debug('Error In getJWT:-', error)
  //     return false
  //   }
  // }
  // public verifyJWT = async (
  //   token: string,
  //   secret: string,
  // ): Promise<{} | boolean> => {
  //   try {
  //     let decoded = jwt.verify(token, secret)
  //     return decoded
  //   } catch (error) {
  //     logger.info('Error In VerifyJWT Function:-', error)
  //     return false
  //   }
  // }

  public getJWT = async (entityId: number, roleName: string): Promise<string> => {
    const rolePermissions = await this.roleModel.getUserPermissions(entityId, roleName)

    const payload = {
      _id: entityId,
      isp: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 15, // 15 day expiration
      roleId: rolePermissions?.role_id ?? null,
      permissions: rolePermissions?.permissions
        ? [...new Set(rolePermissions.permissions.split(','))]
        : [],
    }

    if (!payload.roleId || payload.permissions.length === 0) {
      throw new BadRequestError(
        'There is an issue with your role & permissions, please contact admin!',
      )
    }

    return jwt.sign(payload, config.jwtPrivateKey, { algorithm: 'RS256' })
  }
  public verifyJWT = async (token: string): Promise<{} | boolean> => {
    try {
      const decoded = jwt.verify(token, config.jwtPublicKey, {
        algorithms: ['RS256'],
      })
      return decoded
    } catch (error) {
      console.error('Error in verifyJWT:', error)
      return false
    }
  }

  // common function to send mail eighter aws ses or sendInBlue
  public async sendMailSwitcher(mailData: IEmailSendData): Promise<void> {
    switch (config.mailServiceProvider) {
      case 'SES':
        await CommonHelper.s3Service.sendEmail(mailData)
        break
      case 'SEND_IN_BLUE':
        await sendSendinblueMail(mailData)
        break
      default:
        throw new Error('Invalid mail service provider specified.')
    }
  }

  public getClientIp(req: Request) {
    let ipAddress =
      req.headers['x-client-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.headers['x-forwarded'] ||
      req.headers['forwarded-for'] ||
      req.headers['forwarded'] ||
      req.socket.remoteAddress ||
      req.socket.remoteAddress ||
      '0'

    if (Array.isArray(ipAddress)) {
      ipAddress = ipAddress[0]
    }

    // Handle x-forwarded-for which can be a comma-separated string
    if (typeof ipAddress === 'string' && ipAddress.includes(',')) {
      ipAddress = ipAddress.split(',')[0].trim()
    }
    if (ipAddress === '::1') {
      ipAddress = '127.0.0.1'
    }

    return ipAddress as string
  }

  /**
   * Get user names by user IDs from the database
   * @param items - Array of objects that may contain user IDs in created_by and/or updated_by fields
   * @param userFields - Array of field names to look for user IDs (default: ['created_by', 'updated_by'])
   * @returns The original items with added *_name fields for each user field
   */
  async getUserNamesByIds<T extends Record<string, any>>(
    items: T[],
    userFields: string[] = ['created_by', 'updated_by'],
  ): Promise<T[]> {
    if (!items || items.length === 0) {
      return items
    }

    // Extract unique userIDs from all specified fields
    const userIDs = new Set<number>()
    items.forEach(item => {
      userFields.forEach(field => {
        if (item[field] !== null && item[field] !== undefined) {
          if (typeof item[field] === 'number') {
            userIDs.add(item[field])
          } else if (typeof item[field] === 'string' && item[field].trim() !== '') {
            const numericId = Number(item[field])
            if (!isNaN(numericId)) {
              userIDs.add(numericId)
            }
          }
        }
      })
    })

    // If no user IDs found, return original items
    if (userIDs.size === 0) {
      return items
    }

    // Fetch user names for all collected IDs
    const users = await userModel.find({
      whereIn: [{ column: 'userID', value: Array.from(userIDs) }],
      select: ['userID', 'name'],
    })

    // Create a mapping of userID to user's name
    const userMap = users.reduce((map, user) => {
      map[user.userID] = user.name
      return map
    }, {} as Record<number, string>)

    // Enhance each item with user names
    return items.map(item => {
      // Create a new object that will contain all properties from item
      const enhancedItem = { ...item }

      // Add new fields for each user field
      userFields.forEach(field => {
        if (item[field]) {
          // Add a new field with the pattern: field_name
          const nameField = `${field}_name`
          // Use type assertion to allow adding new properties
          ;(enhancedItem as any)[nameField] = userMap[item[field]] || 'Unknown User'
        }
      })

      return enhancedItem
    })
  }

  public getCrossPlatformBaseUrl = (): string => {
    switch (config.nodeEnv) {
      case 'development':
        return config.devCrossPlatformBaseUrl
      case 'staging':
        return config.stagCrossPlatformBaseUrl
      case 'preprod':
        return config.preprodCrossPlatformBaseUrl
      case 'production':
        return config.prodCrossPlatformBaseUrl
      default:
        throw new Error(`Unknown environment: ${config.nodeEnv}`)
    }
  }
}
export const commonHelper = new CommonHelper()
