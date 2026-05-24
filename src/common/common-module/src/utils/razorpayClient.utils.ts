import config from '@/config/default'
import {
  ICreateEmandateLink,
  IRazorPayCreateOrderRequest,
  IRazorPayCreateOrderResponse,
  IRazorPayCreateRecurringPaymentRequest,
  IRazorPayCreateRecurringPaymentResponse,
  IRazorpaySubscriptionRegistrationRequest,
  IRazorpaySubscriptionRegistrationResponse,
} from '../interfaces/razorpay.interface'
import AxiosService from '../services/api.service'

import axios from 'axios'
import crypto from 'crypto'
import moment from 'moment'
import short from 'short-uuid'
import { razorPayLogsModel } from '../database/mysql/razorpayLogs'
import { razorpayMandateModel } from '../database/mysql/razorpayMandate'
import { razorpayMandateStatusModel } from '../database/mysql/razorpayMandateStatus'
import { RazorPayApiUrl, RazorPayLogApiType } from '../enums/razorpay.enum'
import {
  IRazorPayContactsRequest,
  IRazorPayContactsResponse,
  IRazorPayCreateFundAccountRequest,
  IRazorPayCreateFundAccountResponse,
  IRazorPayValidateAccountRequest,
  IRazorPayValidateAccountResponse,
} from '../interfaces/razorpayPayoutAccounts.interface'
import { convertRupeesToPaise, generateRandomNumber, truncateString } from './util'
import { LenderCredentials, LenderStatus } from '../enums/lender.enum'
import { getDecryptedObject } from './AESEncryption'
import {lenderCredsModel} from '../database/mysql/lender_creds'
import {leadModel} from '../database/mysql/leads'
class RazorpayPG {
  baseUrl = 'https://api.razorpay.com/v1'
  auth = Buffer.from(
    `${config.razorpayDisbursalKeyId}:${config.razorpayDisbursalKeySecret}`,
  ).toString('base64')

  private pennyAuth = Buffer.from(
    `${config.razorpayPennyKeyId}:${config.razorpayPennyKeySecret}`,
  ).toString('base64')

  private readonly apiService = new AxiosService(config.razorPayBaseUrl)
  private readonly razorPayLogsModel = razorPayLogsModel
  private readonly razorpayMandateModel = razorpayMandateModel
  private readonly razorpayMandateStatusModel = razorpayMandateStatusModel
  private readonly lenderCredsModel = lenderCredsModel
  private readonly leadModel = leadModel

  get headers() {
    return {
      Authorization: `Basic ${this.auth}`,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    }
  }

  get xHeaders() {
    return {
      Authorization: `Basic ${this.pennyAuth}`,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    }
  }

  public createOrder2 = async (requestBody: {}) => {
    try {
      let apiUrl = `${this.baseUrl}/orders/`
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
      })

      return response.data
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(`Error creating order: ${error.response.status} ${error.response.statusText}`)
        console.error('Error details:', error.response.data)
      }
      return error
    }
  }

  // public createRecurringPayment = async (requestBody: {}) => {
  //   try {
  //     let apiUrl = `${this.baseUrl}/payments/create/recurring/`
  //     const response = await axios.post(apiUrl, requestBody, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Basic ${this.auth}`,
  //       },
  //     })
  //     return response.data
  //   } catch (error) {
  //     // Handle the error
  //     if (error.response) {
  //       console.error(
  //         `Error creating order: ${error.response.status} ${error.response.statusText}`,
  //       )
  //       console.error('Error details:', error.response.data)
  //     }
  //     return error
  //   }
  // }

  public createPlan = async (requestBody: {}) => {
    try {
      let apiUrl = `${this.baseUrl}/plans/`
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
      })
      // console.log(response.data)
      return response.data
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(`Error creating order: ${error.response.status} ${error.response.statusText}`)
        console.error('Error details:', error.response.data)
      }
      return error
    }
  }

  public createNormalRefund = async (requestBody: {}, paymentId: string) => {
    try {
      let apiUrl = `${this.baseUrl}/payments/${paymentId}/refund`
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
      })
      return response
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(
          `Error creating refund: ${error.response.status} ${error.response.statusText}`,
        )
        console.error('Error details:', error.response)
      }
      return error.response
    }
  }

  // ! Depracated
  // public createEmandate = async (requestBody: {
  //   name: string
  //   email: string
  //   mobile: number
  //   auth_type: string
  //   account_number: string
  //   ifsc_code: string
  //   account_type: string
  // }) => {
  //   try {
  //     let customer = await this.createCustomer({
  //       name: requestBody?.name,
  //       contact: requestBody?.mobile,
  //       email: requestBody?.email,
  //       fail_existing: '0',
  //     })
  //     if (customer.status != 200 || customer.data.hasOwnProperty('error')) {
  //       return { error: { ...customer?.data?.error } }
  //     }
  //     let currentTimestamp = Math.floor(Date.now() / 1000) // Current timestamp in seconds
  //     let fortyYearsInSeconds = 40 * 365 * 24 * 60 * 60 // 40 years in seconds
  //     let validExpireAt = currentTimestamp + fortyYearsInSeconds
  //     let order = await this.createOrder({
  //       amount: 0,
  //       currency: 'INR',
  //       payment_capture: true,
  //       method: 'emandate',
  //       customer_id: customer.data.id,
  //       token: {
  //         auth_type: requestBody?.auth_type
  //           ? requestBody?.auth_type
  //           : 'netbanking',
  //         max_amount: 100000,
  //         expire_at: validExpireAt,
  //         bank_account: {
  //           beneficiary_name: 'Tarun Sharma',
  //           account_number: 34977767419,
  //           account_type: 'savings',
  //           ifsc_code: 'SBIN0001028',
  //         },
  //       },
  //     })
  //     if (order?.id) {
  //       return { order: { ...order }, customerId: customer?.data?.id }
  //     } else {
  //       return { error: { ...order?.response?.data?.error } }
  //     }
  //   } catch (error) {
  //     // Handle the error
  //     if (error.response) {
  //       console.error(
  //         `Error creating e-mandate: ${error.response.status} ${error.response.statusText}`,
  //       )
  //       console.error('Error details:', error.response)
  //     }
  //     return error.response
  //   }
  // }

  // public createEmandateCharge = async (requestBody: {}) => {
  //   try {
  //     let order = await this.createOrder({
  //       amount: 10000,
  //       currency: 'INR',
  //       payment_capture: true,
  //     })
  //     if (order?.id) {
  //       let payment = await this.createRecurringPayment({
  //         email: 'dev1@ramfincorp.com',
  //         contact: 9410040742,
  //         amount: 10000,
  //         currency: 'INR',
  //         order_id: order.id,
  //         customer_id: 'cust_OS7OgHgcfk7o2Q',
  //         token: 'token_OSAlmXiEgOl3im',
  //         recurring: '1',
  //         description: 'Creating recurring payment for Tarun Sharma',
  //       })
  //       console.log('ppppppppppp', payment)
  //       if (payment.id) {
  //         return { payment: { ...payment } }
  //       } else {
  //         return { error: { ...payment.response.data } }
  //       }
  //     } else {
  //       return { error: { ...order?.response?.data?.error } }
  //     }
  //   } catch (error) {
  //     // Handle the error
  //     if (error.response) {
  //       console.error(
  //         `Error creating e-mandate: ${error.response.status} ${error.response.statusText}`,
  //       )
  //       console.error('Error details:', error.response)
  //     }
  //     return error.response
  //   }
  // }

  public fetchDisbursedPayment = async (id: string) => {
    try {
      let apiUrl = `${this.baseUrl}/payouts/${id}`
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
      })
      return response
    } catch (error) {
      // Handle the error
      if (error.response) {
        console.error(`Error fetching dusbursal payment: ${error?.response?.data?.message}`)
      }
      return error.response
    }
  }

  createEmandateAuthLink = async (
    customerID: number,
    leadID: number,
    payload: ICreateEmandateLink,
  ) => {
    const { email, contact, accountNo, accountType, ifsc, amount } = payload

    let { name } = payload

    name = truncateString(name)

    const maxAmount = convertRupeesToPaise(amount * 3)

    const notesData = name.substring(0, 20) + '-' + contact + '-' + generateRandomNumber(1111, 9999)

    const apiPayload: IRazorpaySubscriptionRegistrationRequest = {
      customer: {
        contact,
        email,
        name,
      },
      amount: 0,
      currency: 'INR',
      description: name,
      email_notify: 1,
      sms_notify: 1,
      expire_by: moment().add(24, 'months').unix(),
      receipt: notesData,
      type: 'link',
      subscription_registration: {
        auth_type: '',
        expire_at: moment().add(24, 'months').unix(),
        max_amount: maxAmount,
        method: 'emandate',
        bank_account: {
          account_number: accountNo,
          account_type: accountType.toLowerCase() + 's',
          beneficiary_name: name,
          ifsc_code: ifsc,
        },
      },
      notes: { note_key_1: notesData, note_key_2: notesData },
    }
    const response = await this.apiService.call<
      IRazorpaySubscriptionRegistrationResponse,
      IRazorpaySubscriptionRegistrationRequest,
      undefined
    >('post', RazorPayApiUrl.CREATE_SUBSCRIPTION_LINK, apiPayload, undefined, this.headers)

    // save the response to razorpay logs
    if (response.data.currency_symbol) delete response.data.currency_symbol

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(apiPayload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_SUBSCRIPTION_LINK,
      type: RazorPayLogApiType.EMANDATE,
    })

    return response
  }

  createOrder = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayCreateOrderRequest,
    isCustomer = false,
  ) => {
    const { amount, currency, customer_id, method, payment_capture, receipt, token, notes } =
      payload

    const apiPayload: IRazorPayCreateOrderRequest = {
      amount,
      currency,
      payment_capture: typeof payment_capture === 'undefined' ? true : false,
      notes,
      receipt: receipt ?? customerID + '-' + short.generate() + '-' + leadID,
    }

    if (token) {
      apiPayload.token = token
    }

    if (customer_id) {
      apiPayload.customer_id = customer_id
    }

    if (method) {
      apiPayload.method = method
    }
    const creds =
    await this.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.RAZORPAY_EMANDATE,
    )
   const auth = Buffer.from(`${creds.razorpay_disbursal_key_id}:${creds.razorpay_disbursal_secret_key}`).toString('base64')
   const headers = {
    Authorization: `Basic ${auth}`,
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
   }

    const response = await this.apiService.call<
      IRazorPayCreateOrderResponse,
      IRazorPayCreateOrderRequest,
      undefined
    >('post', RazorPayApiUrl.CREATE_ORDER, apiPayload, undefined, headers)

    isCustomer &&
      (await this.razorPayLogsModel.insert({
        api_request: JSON.stringify(apiPayload),
        api_response: JSON.stringify(response.data),
        customerID,
        leadID,
        req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_ORDER,
        type: RazorPayLogApiType.CREATE_ORDER,
      }))

    return response
  }

  verifySignature(orderId: string, paymentId: string, signature: string) {
    // Generate the expected signature using the order_id and payment_id
    const hmac = crypto.createHmac('sha256', config.razorpayDisbursalKeySecret)
    hmac.update(orderId + '|' + paymentId)

    const generatedSignature = hmac.digest('hex')

    return generatedSignature === signature
  }

  async createRecurringPayment(payload: IRazorPayCreateRecurringPaymentRequest) {
    const response = await this.apiService.call<
      IRazorPayCreateRecurringPaymentResponse,
      IRazorPayCreateRecurringPaymentRequest,
      undefined
    >('post', RazorPayApiUrl.RECURRING_PAYMENT, payload, undefined, this.headers)
    return response
  }
  async razorpayVirtualAccount(
    url: string,
    data: any,
  ): Promise<{ status: string; message?: string; data?: any }> {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Basic ${this.auth}`,
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        maxRedirects: 10,
        timeout: 30000, // 30 seconds
      })

      if (response.data.error) {
        return { status: 'error', message: response.data.error.description }
      }

      return { status: 'success', data: response.data }
    } catch (error) {
      return { status: 'error', message: error.message }
    }
  }

  createContact = async (customerID: number, leadID: number, payload: IRazorPayContactsRequest) => {
    const response = await this.apiService.call<
      IRazorPayContactsResponse,
      IRazorPayContactsRequest,
      undefined
    >('post', RazorPayApiUrl.CREATE_CONTACT, payload, undefined, this.xHeaders)

    // save the response to razorpay logs
    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(payload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_CONTACT,
      type: RazorPayLogApiType.CONTACTS,
    })

    return response
  }

  createFundAccount = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayCreateFundAccountRequest,
  ) => {
    const response = await this.apiService.call<
      IRazorPayCreateFundAccountResponse,
      IRazorPayCreateFundAccountRequest,
      undefined
    >('post', RazorPayApiUrl.CREATE_FUND_ACCOUNT, payload, undefined, this.xHeaders)

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(payload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_FUND_ACCOUNT,
      type: RazorPayLogApiType.FUND_ACCOUNTS,
    })

    return response
  }

  validateAccount = async (
    customerID: number,
    leadID: number,
    payload: IRazorPayValidateAccountRequest,
  ) => {
    const response = await this.apiService.call<
      IRazorPayValidateAccountResponse,
      IRazorPayValidateAccountRequest,
      undefined
    >('post', RazorPayApiUrl.VALIDATE_ACCOUNT, payload, undefined, this.xHeaders)

    await this.razorPayLogsModel.insert({
      api_request: JSON.stringify(payload),
      api_response: JSON.stringify(response.data),
      customerID,
      leadID,
      req_url: config.razorPayBaseUrl + RazorPayApiUrl.VALIDATE_ACCOUNT,
      type: RazorPayLogApiType.VALIDATE_ACCOUNT,
    })

    return response
  }
  public async getLenderCredentialsByLeadId(
      leadId: number,
      keyType: LenderCredentials,
    ): Promise<any> {
      const leadRecord = await this.leadModel.findOne({
        where: { leadID: leadId },
        select: ['lenderID'],
      })

      if (!leadRecord) {
        throw new Error(`Lead not found with ID: ${leadId}`)
      }

      const lenderRecord = await this.lenderCredsModel.findOne({
        where: { lenderID: leadRecord.lenderID ,
          cred_name:keyType,
          status:LenderStatus.ACTIVE
        },
        select: ['credentials'],
      })

      if (!lenderRecord?.credentials) {
        throw new Error(
          `Lender credentials not found with ID: ${leadRecord.lenderID}`,
        )
      }

      const decrytedCredentials=getDecryptedObject(lenderRecord.credentials);

      return decrytedCredentials;
    }
}

export default RazorpayPG

export const razorPayPayments = new RazorpayPG()
