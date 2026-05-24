import config from '@/config/default'
import axios from 'axios'
import { leadsApiLogModel } from '../database/mysql/leadApiLogs'
import { ApiSupplierType, LeadLogApiType, SurePassApiUrl } from '../enums/common.enum'
import { ILeadsApiLog } from '../interfaces/leadApiLogs.interface'
import {
  ICkycDownloadResponse,
  ISurepassCkycDownloadRequest,
  ISurepassCkycSearchRequest,
  ISurepassCkycSearchResponse,
  ISurePassValidatePan,
  ISurePassValidatePanResponse,
} from '../interfaces/onboarding.interface'
import AxiosService from '../services/api.service'
import LeadApiLogService from '../services/leadApiLog.service'
import { InsertData } from '../types/model.types'
const leadApiLogService = new LeadApiLogService()
const apiService = new AxiosService(config.surePassApi)
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.surePassToken}`,
}

export async function generateAadharOtpBySurepass(
  aadharNo: string,
  customerID: number,
): Promise<any> {
  const url = config.surePassApi + '/api/v1/aadhaar-v2/generate-otp'
  try {
    const response = await axios.post(
      url,
      {
        id_number: aadharNo,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${config.surePassToken}`,
        },
      },
    )
    const { data } = response
    let saveObject = {
      customerID: customerID,
      api_type: 'aadhaar-v2-generate-otp',
      api_supplier: 4,
      api_response: JSON.stringify(data),
      status: 1,
      api_endpoint_url: url,
      api_method: 'POST',
      api_headers: JSON.stringify({
        'content-type': 'application/json',
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        id_number: aadharNo,
      }),
    }
    await leadApiLogService.create(saveObject)
    return data
  } catch (error) {
    console.log('Error', error.message)
    throw new Error('Error while generating otp through surePass')
  }
}

export async function verifyAadharOtpBySurepass(otp: string, customerId: number): Promise<any> {
  let logData = await leadsApiLogModel.findOneLeadsApiLog(
    { customerID: customerId, status: 1, api_type: 'aadhaar-v2-generate-otp' },
    ['api_response'],
    [{ column: 'id', order: 'desc' }],
  )
  const apiResponse = JSON.parse(logData.api_response)
  const url = config.surePassApi + '/api/v1/aadhaar-v2/submit-otp'
  try {
    const response = await axios.post(
      url,
      {
        client_id: apiResponse?.data.client_id,
        otp: otp,
        aadhaar_pdf_generate: true,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${config.surePassToken}`,
        },
      },
    )
    const { data } = response
    let saveObject = {
      customerID: customerId,
      api_type: 'aadhaar-v2-submit-otp',
      api_supplier: 4,
      api_response: JSON.stringify(data),
      status: 1,
      api_endpoint_url: url,
      api_method: 'POST',
      api_headers: JSON.stringify({
        'content-type': 'application/json',
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        client_id: apiResponse?.data?.client_id,
        otp: otp,
      }),
      aadharNo: data?.data?.aadhaar_number,
    }
    await leadApiLogService.create(saveObject)
    return data
  } catch (error) {
    console.log('Error', error)
    throw new Error('Error while verifying otp through surePass')
  }
}
export async function verifyPanSurePass(payload: ISurePassValidatePan) {
  const { panNumber, customerId, mobileNo } = payload
  const result = await apiService.call<
    ISurePassValidatePanResponse,
    { id_number: string },
    undefined
  >(
    'post',
    SurePassApiUrl.PAN_COMPREHENSIVE,
    {
      id_number: panNumber,
    },
    undefined,
    headers,
  )

  let saveObject: InsertData<ILeadsApiLog> = {
    customerID: customerId,
    api_type: LeadLogApiType.PAN_COMPREHENSIVE,
    api_supplier: ApiSupplierType.SUREPASS,
    api_response: JSON.stringify(result.data),
    status: result.success ? 1 : 0,
    api_endpoint_url: config.surePassApi + SurePassApiUrl.PAN_COMPREHENSIVE,
    api_method: 'POST',
    api_headers: JSON.stringify(headers),
    api_request: JSON.stringify({
      id_number: panNumber,
    }),
    mobile_no: String(mobileNo),
    pancard: panNumber,
  }

  await leadApiLogService.create(saveObject)

  return result
}

// ! Depracated
// export async function verifyPanBySurepass(
//   panNumber: string,
//   customerId: number,
// ): Promise<any> {
//   const url = config.surePassApi + '/api/v1/pan/pan-comprehensive'
//   try {
//     const response = await axios.post(
//       url,
//       {
//         id_number: panNumber,
//       },
//       {
//         headers: {
//           'content-type': 'application/json',
//           Authorization: `Bearer ${config.surePassToken}`,
//         },
//       },
//     )
//     const { data } = response
//     let saveObject = {
//       customerID: customerId,
//       api_type: 'pan-comprehensive',
//       api_supplier: 4,
//       api_response: JSON.stringify(data),
//       status: 1,
//       api_endpoint_url: url,
//       api_method: 'POST',
//       api_headers: JSON.stringify({
//         'content-type': 'application/json',
//         Authorization: `Bearer ${config.surePassToken}`,
//       }),
//       api_request: JSON.stringify({
//         id_number: panNumber,
//       }),
//       pancard: data?.data?.pan_number,
//     }
//     await leadApiLogService.create(saveObject)
//     return data
//   } catch (error) {
//     console.log('Error', error)
//     throw new Error('Error while verifying pan through surePass')
//   }
// }
export async function ckycSearchBySurePass(
  panNumber: string,
  customerId: number,
  mobileNumber: number,
): Promise<any> {
  const url = 'https://kyc-api.surepass.io/api/v1/ckyc/search'
  try {
    const response = await axios.post(
      url,
      {
        id_number: panNumber,
        document_type: 'PAN',
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${config.surePassToken}`,
        },
      },
    )
    const { data } = response
    let saveObject = {
      customerID: customerId,
      api_type: 'ckyc_search',
      api_supplier: 4,
      api_response: JSON.stringify(data),
      status: 1,
      api_endpoint_url: url,
      api_method: 'POST',
      api_headers: JSON.stringify({
        'content-type': 'application/json',
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        id_number: panNumber,
        document_type: 'PAN',
      }),
      pancard: panNumber,
      mobile_no: String(mobileNumber),
    }
    await leadApiLogService.create(saveObject)
    return data
  } catch (error) {
    console.log('Error', error)
    throw new Error('Error while verifying pan through surePass')
  }
}
export async function ckycDownloadBySurePass(
  dob: string,
  customerId: number,
  mobileNumber: number,
): Promise<any> {
  let logData = await leadsApiLogModel.findOneLeadsApiLog(
    { customerID: customerId, status: 1, api_type: 'ckyc_search' },
    ['api_response'],
    [{ column: 'id', order: 'desc' }],
  )
  const apiResponse = JSON.parse(logData.api_response)
  const url = 'https://kyc-api.surepass.io/api/v1/ckyc/download'
  try {
    const response = await axios.post(
      url,
      {
        client_id: apiResponse?.data.client_id,
        dob: dob,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${config.surePassToken}`,
        },
      },
    )
    const { data } = response
    let saveObject = {
      customerID: customerId,
      api_type: 'ckyc_download',
      api_supplier: 4,
      api_response: JSON.stringify(data),
      status: 1,
      api_endpoint_url: url,
      api_method: 'POST',
      api_headers: JSON.stringify({
        'content-type': 'application/json',
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        client_id: apiResponse?.data.client_id,
        dob: dob,
      }),
      mobile_no: String(mobileNumber),
    }
    await leadApiLogService.create(saveObject)
    return data
  } catch (error) {
    console.log('Error', error)
    throw new Error('Error while verifying pan through surePass')
  }
}

export async function ckycSearch(
  payload: ISurepassCkycSearchRequest,
  customerID: number,
  mobileNo: number,
) {
  const { id_number } = payload

  const result = await apiService.call<
    ISurepassCkycSearchResponse,
    ISurepassCkycSearchRequest,
    undefined
  >(
    'post',
    SurePassApiUrl.CKYC_SEARCH,
    {
      id_number,
    },
    undefined,
    headers,
  )
  let saveObject: InsertData<ILeadsApiLog> = {
    customerID,
    api_type: LeadLogApiType.CKYC_SEARCH,
    api_supplier: ApiSupplierType.SUREPASS,
    api_response: JSON.stringify(result.data),
    status: result.success ? 1 : 0,
    api_endpoint_url: config.surePassApi + SurePassApiUrl.CKYC_SEARCH,
    api_method: 'POST',
    api_headers: JSON.stringify(headers),
    api_request: JSON.stringify({
      payload,
    }),
    mobile_no: String(mobileNo),
    pancard: id_number,
    leadID: 0,
  }

  await leadApiLogService.delete([
    { column: 'api_supplier', value: ApiSupplierType.SUREPASS },
    { column: 'api_type', value: LeadLogApiType.CKYC_SEARCH },
    { column: 'pancard', value: id_number },
  ])

  await leadApiLogService.create(saveObject)

  return result
}

export async function ckycDownload(
  payload: ISurepassCkycDownloadRequest,
  customerID: number,
  mobileNo: number,
  panNumber: string,
) {
  const { client_id, dob } = payload

  const result = await apiService.call<
    ICkycDownloadResponse,
    ISurepassCkycDownloadRequest,
    undefined
  >(
    'post',
    SurePassApiUrl.CKYC_DOWNLOAD,
    {
      client_id,
      dob,
    },
    undefined,
    headers,
  )

  let saveObject: InsertData<ILeadsApiLog> = {
    customerID,
    api_type: LeadLogApiType.CKYC_DOWNLOAD,
    api_supplier: ApiSupplierType.SUREPASS,
    api_response: JSON.stringify(result.data),
    status: result.success ? 1 : 0,
    api_endpoint_url: config.surePassApi + SurePassApiUrl.CKYC_DOWNLOAD,
    api_method: 'POST',
    api_headers: JSON.stringify(headers),
    api_request: JSON.stringify({
      payload,
    }),
    mobile_no: String(mobileNo),
    pancard: panNumber,
    leadID: 0,
  }

  await leadApiLogService.create(saveObject)

  return result
}
