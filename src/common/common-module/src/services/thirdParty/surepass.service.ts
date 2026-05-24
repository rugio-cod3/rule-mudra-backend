import config from '@/config/default'
import axios from 'axios'
import { leadsApiLogModel } from '../../database/mysql/leadApiLogs'
import UserMetaDataService from '../../database/mysql/userMetadata'
import { ApiSupplierType, SurePassApiUrl } from '../../enums/common.enum'
import { LeadLogApiType } from '../../enums/leadApiLogs.enum'
import { ILeadsApiLog } from '../../interfaces/leadApiLogs.interface'
import {
  ISurePassSendAadharOtp,
  ISurePassSendAadharOtpResponse,
  ISurePassVerifyAadhar,
  ISurePassVerifyAadharResponse,
} from '../../interfaces/onboarding.interface'
import { IUserMetadata } from '../../interfaces/userMetadata.interface'
import { InsertData } from '../../types/model.types'
import { logger } from '../../utils/logger'
import AxiosService from '..//api.service'
import LeadApiLogService from '../leadApiLog.service'
import LeadApiLogMongoDBService from '../leadApiLogMongo.service'
import S3Service from './s3.service'
class SurepassService {
  private leadApiLogService = new LeadApiLogService()
  private userMetaDataService = new UserMetaDataService()
  private leadApiLogMongoDBService = new LeadApiLogMongoDBService()
  private s3Service = new S3Service()
  private baseUrl = `${config.surePassApi}/api/v1`
  private headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.surePassToken}`,
    }
  }
  private readonly apiService = new AxiosService(config.surePassApi)
  //UT Done
  private async apiCall(url: string, method: string, headers: {}, body: {}) {
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: headers,
        data: body,
      })
      return response
    } catch (error) {
      return error.response
    }
  }

  async generateAadharOtpSurepass(payload: ISurePassSendAadharOtp) {
    const { aadharNo, customerID, mobileNo } = payload

    const result = await this.apiService.call<
      ISurePassSendAadharOtpResponse,
      { id_number: string },
      undefined
    >(
      'post',
      SurePassApiUrl.AADHAR_SEND_OTP,
      {
        id_number: aadharNo,
      },
      undefined,
      this.headers(),
    )

    let saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.AADHAR_V2_GENERATE_OTP,
      api_supplier: ApiSupplierType.SUREPASS,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url: config.surePassApi + SurePassApiUrl.AADHAR_SEND_OTP,
      api_method: 'POST',
      api_headers: JSON.stringify(this.headers()),
      api_request: JSON.stringify({
        id_number: aadharNo,
      }),
      mobile_no: String(mobileNo),
      aadharNo,
    }

    await this.leadApiLogService.create(saveObject)

    try {
      await this.leadApiLogMongoDBService.create('aadhaarKYC', saveObject)
    } catch (error) {
      logger.error(
        'Error while saving to MongoDB collection : aadhaarKYC',
        error,
      )
    }

    return result
  }

  async verifyAadharOtpSurepass(payload: ISurePassVerifyAadhar) {
    const { client_id, otp, customerID, mobileNo, aadharNo } = payload

    const result = await this.apiService.call<
      ISurePassVerifyAadharResponse,
      { otp: string; client_id: string; aadhaar_pdf_generate: boolean },
      undefined
    >(
      'post',
      SurePassApiUrl.AADHAR_SUBMIT,
      {
        otp,
        client_id,
        aadhaar_pdf_generate: true,
      },
      undefined,
      this.headers(),
    )

    // We will not save aadhar data here

    return result
  }

  public async verifyAadharOtpBySurepass(
    otp: string,
    customerID: number,
    mobile: number,
  ): Promise<{ succuss: boolean; message: string; code: number }> {
    try {
      const folder = `documents/aadhar_image/${customerID}`
      let logData = await leadsApiLogModel.findOneLeadsApiLog(
        { customerID, status: 1, api_type: 'aadhaar-v2-generate-otp' },
        ['api_response'],
        [{ column: 'id', order: 'desc' }],
      )
      const apiResponse = JSON.parse(logData.api_response)
      let response = await this.apiCall(
        `${this.baseUrl}/aadhaar-v2/submit-otp`,
        'POST',
        this.headers(),
        {
          otp,
          client_id: apiResponse?.data.client_id,
          aadhaar_pdf_generate: true,
        },
      )

      if (response.data.data.profile_image) {
        const imageData = response?.data?.data?.profile_image
        let filename = `${customerID.toString()}.jpg`

        try {
          const uploadRes = await this.s3Service.uploadDocument(
            null,
            folder,
            filename,
            true,
            imageData,
          )
          response.data.data.profile_image = uploadRes.Key
        } catch (uploadErr) {
          logger.error('Profile image upload failed:', uploadErr)
        }
      }

      let saveObject = {
        customerID: customerID,
        api_type: 'aadhaar-v2-submit-otp',
        api_supplier: 4,
        api_response: JSON.stringify(response.data),
        status: 1,
        api_endpoint_url: `${this.baseUrl}/aadhaar-v2/submit-otp`,
        api_method: 'POST',
        api_headers: JSON.stringify(this.headers()),
        api_request: JSON.stringify({
          otp,
          client_id: apiResponse?.data.client_id,
        }),
      }
      await this.leadApiLogService.create(saveObject)

      try {
        await this.leadApiLogMongoDBService.create('aadhaarKYC', saveObject)
      } catch (error) {
        logger.error(
          'Error while saving to MongoDB collection : aadhaarKYC',
          error,
        )
      }

      if (response.status == 200) {
        let uploadedImageKey = response?.data?.data?.profile_image
        let user_metadata = (await this.userMetaDataService.getUserMetaData(
          { mobile: mobile.toString() },
          { orderKey: 'id', orderValue: 'desc' },
          ['*'],
        )) as IUserMetadata

        if (user_metadata && user_metadata.mobile) {
          let metaJSON = JSON.parse(user_metadata.metaJSON) || {}
          let address = response?.data?.data?.address
          ;(metaJSON['aadhaar-v2-submit-otp'] = {
            aadhar_no: response?.data?.data?.aadhaar_number,
            fullName: response?.data?.data?.full_name,
            email: '',
            phone: '',
            maskAadhar: `XXXXXXXX${response?.data?.data?.aadhaar_number?.slice(
              -4,
            )}`,
            gender: response?.data?.data?.gender,
            dob: response?.data?.data?.dob,
            address: `${address.country}/${address.dist}/${address.state}/${address.po}/${address.loc}/${address.vtc}/${address.subdist}/${address.street}/${address.house}/${address.landmark}`,
            address_json: address,
            aadhar_image: uploadedImageKey,
            aadhar_pdf: response?.data?.data?.aadhaar_pdf,
          }),
            await this.userMetaDataService.findOneAndUpdate(
              { mobile: String(mobile) },
              {
                aadharVerify: response?.data?.data?.aadhaar_number,
                metaJSON: JSON.stringify(metaJSON),
                profile_image: uploadedImageKey,
              },
            )
        } else {
          // CREATE ENTRY
          let address = response?.data?.data?.address
          let metaJSON = {
            'aadhaar-v2-submit-otp': {
              aadhar_no: response?.data?.data?.aadhaar_number,
              fullName: response?.data?.data?.full_name,
              email: '',
              phone: '',
              maskAadhar: `XXXXXXXX${response?.data?.data?.aadhaar_number?.slice(
                -4,
              )}`,
              gender: response?.data?.data?.gender,
              dob: response?.data?.data?.dob,
              address: `${address.country}/${address.dist}/${address.state}/${address.po}/${address.loc}/${address.vtc}/${address.subdist}/${address.street}/${address.house}/${address.landmark}`,
              address_json: address,
              aadhar_image: uploadedImageKey,
              aadhar_pdf: response?.data?.data?.aadhaar_pdf,
            },
          }
          await this.userMetaDataService.insert({
            customerID,
            mobile: String(mobile),
            panVerify: '',
            aadharVerify: response?.data?.data?.aadhaar_number,
            metaJSON: JSON.stringify(metaJSON),
            profile_image: uploadedImageKey,
            aadhar_mask: '',
          })
          // id: number
          // customerID: number
          // mobile: string
          // panVerify: string
          // aadharVerify: string
          // aadhar_mask: string
          // metaJSON: string
          // profile_image: string
          // created_at: Date
          // updated_at: Date
        }
        return Promise.resolve({
          succuss: true,
          message: 'Fetched Successfully',
          code: 200,
        })
      } else {
        return Promise.resolve({
          succuss: false,
          message: response?.data?.message || 'Issue In Surepass',
          code: response?.data?.status_code || 400,
        })
      }
    } catch (error) {
      console.log('Error In Verifying Otp', error)
    }
  }
}

export default SurepassService
