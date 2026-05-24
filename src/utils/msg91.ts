import config from '@/config/default'
import KaleyraLogsModel from '@/database/mysql/kaleyraLogs'
import { BadRequestError } from '@/errors'
import { IData, IMsg91OTPResponse } from '@/interfaces/otp.interface'
import AxiosService from '@/services/api.service'
import axios from 'axios'
import { format } from 'date-fns'
const msg91ApiService = new AxiosService(config.msg91BaseUrl)

export interface IApiResponse {
  status: string
  message: string
  data: {
    _id: string
    user_id: number
    count: number
    is_bulk: boolean
    email: string
    created_at: string
    updated_at: string
    result: {
      valid: boolean
      result: string
      reason: string
      is_disposable: boolean
      is_free: boolean
      is_role: boolean
    }
    summary: {
      total: number
      deliverable: number
      undeliverable: number
      risky: number
      unknown: number
    }
  }
}

export const validateEmailHelper = async (
  email: string,
): Promise<IApiResponse> => {
  try {
    const options = {
      method: 'POST',
      url: 'https://control.msg91.com/api/v5/email/validate',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authkey: config.msg91AuthKey,
      },
      data: JSON.stringify({ email }),
    }

    const apiResponse = await axios.request<IApiResponse>(options)
    return apiResponse.data
  } catch (error) {
    console.log('Error at validateEmailHelper:', error.message)
    throw new Error('Email validation failed')
  }
}
export async function sendOtptoMobileMsg91(
  mobile: number,
  otp: string,
): Promise<IMsg91OTPResponse> {
  const Logs = new KaleyraLogsModel()
  const url = 'api/v5/flow'
  const now = new Date(Date.now())

  try {
    let data: IData = {
      template_id: config.smsTemplateId,
      short_url: '0',
      recipients: [
        {
          mobiles: '91' + mobile,
          OTP: otp,
        },
      ],
    }
    const requestConfig = {
      method: 'post',
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
        authkey: config.msg91SmsAuthKey,
      },
    }

    let response = await msg91ApiService.call<
      IMsg91OTPResponse,
      IData,
      undefined
    >(
      'post',
      requestConfig.url,
      requestConfig.data,
      undefined,
      requestConfig.headers,
    )
    console.log('response', response)
    // const { message, type } = response
    await Logs.saveLogs({
      mobile: mobile,
      req_url: url,
      api_request: JSON.stringify(requestConfig),
      api_response: JSON.stringify(response),
      curl_error: null,
      type: 'MSG91-SMS',
      created_at: now,
    })
    return response.data
  } catch (error) {
    const err = await Logs.saveLogs({
      mobile: mobile,
      req_url: url,
      api_request: JSON.stringify(error.config),
      api_response: error.response ? JSON.stringify(error.response.data) : null,
      curl_error: error.message,
      type: 'MSG91-SMS',
      created_at: now,
    })
    console.log('Error', error)
    throw new Error('error in sending otp')
  }
}

export const sendOtpTextNation = async (mobile: number, otp: number) => {
  // From env: template_id, entityId
  const Logs = new KaleyraLogsModel()
  const body = `Dear customer, use this One Time Password ${otp} to log in to your Ram Fincorp account. This OTP will be valid for the next 2 mins.`

  const encodedMessage = encodeURIComponent(body)

  const entity_id = String(config.textnation_entity_id).trim()
  const template_id = String(config.textnation_template_id).trim()

  const message = `Dear customer, use this One Time Password ${otp} to log in to your Ram Fincorp account. This OTP will be valid for the next 2 mins.`
  const url = `${config.textnation_url}&api_key=${
    config.textnation_key
  }&to=91${mobile}&sender=${
    config.textnation_sender
  }&message=${encodeURIComponent(
    encodedMessage,
  )}&entity_id=${'1201162433782729973'}&template_id=${'1207170970052870884'}&format=json`

  const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

  try {
    // Make the API request using axios
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    })

    // The response data can be accessed as response.data
    // console.log('Msg send rep ====>', response.data);
    const requestConfig = {
      method: 'GET',
      url,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    // console.log('response', response);

    const logData = {
      mobile: mobile,
      templateID: config.textnation_template_id,
      api_request: JSON.stringify(requestConfig),
      api_response: JSON.stringify(response.data),
      entityID: config.textnation_entity_id,
    }

    await Logs.saveLogs({
      mobile: mobile,
      req_url: url,
      api_request: JSON.stringify(requestConfig),
      api_response: JSON.stringify(response.data),
      curl_error: null,
      type: 'TextNation-SMS',
      created_at: now,
    })

    return {
      data: response.data,
      message: 'SMS sent successfully',
      statusCode: 200,
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    throw new BadRequestError(
      'Issue in sending OTP, Please try again in a few seconds....',
    )
  }
}
