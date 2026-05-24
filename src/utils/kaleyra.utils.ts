import KaleyraLogsModel from '@/database/mysql/kaleyraLogs'
import { IServiceResponse } from '@/interfaces/service.interface'
import axios from 'axios'
import AxiosService from '@/services/api.service'
import { commonHelper as commonHelperInstance } from '@/helpers/common'
import { IKaleyraResponse } from '@/interfaces/otp.interface'

export async function sendOtptoMobile(mobile: number, otp: number): Promise<IKaleyraResponse> {
  const Logs = new KaleyraLogsModel()
  const apiService = new AxiosService(commonHelperInstance.getBaseUrl())
  const formattedMobile = '+91' + mobile
  const msg = encodeURIComponent(
    `Dear customer, use this One Time Password ${otp} to log in to your Ram Fincorp account. This OTP will be valid for the next 2 mins. By BVJ`,
  )
  const url = 'https://api.kaleyra.io/v1/HXIN1764050109IN/messages'
  const now = new Date(Date.now())

  try {
    const response = await axios.post(
      url,
      {
        to: formattedMobile,
        type: 'OTP',
        sender: 'RAMFCP',
        body: msg,
        template_id: '1207168957066287354',
      },
      {
        headers: {
          'api-key': 'Af65b230615f37c2ce4c44c4f4b0833c1',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    )

    const { data } = response
    await Logs.saveLogs({
      mobile: mobile,
      req_url: url,
      api_request: JSON.stringify(response.config),
      api_response: JSON.stringify(data),
      curl_error: null,
      type: 'SMS',
      created_at: now,
    })
    return data
  } catch (error) {
    const err = await Logs.saveLogs({
      mobile: mobile,
      req_url: url,
      api_request: JSON.stringify(error.config),
      api_response: error.response ? JSON.stringify(error.response.data) : null,
      curl_error: error.message,
      type: 'SMS',
      created_at: now,
    })
    console.log('Error', error)
    //throw error;
  }
}
