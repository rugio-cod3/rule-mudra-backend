import config from '@/config/default'
import axios from 'axios'
import {
  ApiSupplierType,
  DecentroApiUrl,
  LeadLogApiType,
} from '../../enums/common.enum'
import CommonHelper from '../../helpers/common'
import { ILeadsApiLog } from '../../interfaces/leadApiLogs.interface'
import {
  IDecentroAadharInititateResponse,
  IDecentroEaadharResponse,
} from '../../interfaces/onboarding.interface'
import { InsertData } from '../../types/model.types'
import { logger } from '../../utils/logger'
import AxiosService from '../api.service'
import LeadApiLogService from '../leadApiLog.service'
import LeadApiLogMongoDBService from '../leadApiLogMongo.service'
import UserMetaDataService from '../userMetadata.service'
class DigilockerService {
  private leadApiLogService = new LeadApiLogService()
  private userMetaDataService = new UserMetaDataService()
  private leadApiLogMongoDBService = new LeadApiLogMongoDBService()
  private commonHelper = new CommonHelper()

  private url = config.decentro_api
  private headers() {
    return {
      accept: 'application/json',
      client_id: config.decentro_client_id,
      client_secret: config.decentro_client_secret,
      module_secret: config.decentro_module_secret,
      'content-type': 'application/json',
    }
  }
  private readonly apiService = new AxiosService(config.decentroBaseUrl)
  //UT Done
  private async apiCall(url: string, method: string, headers: {}, body: {}) {
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: headers,
        data: body,
        maxBodyLength: Infinity,
      })
      return response
    } catch (error) {
      return error.response
    }
  }

  async initiateDigiLockerAadhar(
    customerID: number,
    mobileNo: number,
    callBackUrl: string,
  ) {
    const reference_id = customerID.toString() + Date.now()
    let baseUrl = this.commonHelper.getBaseUrl()

    const requestBody = {
      reference_id,
      consent: true,
      consent_purpose: 'For Bank Account Purpose Only',
      redirect_url: callBackUrl,
      // redirect_url: `${baseUrl}/new-api/customer_onboarding/aadhar-verification-webhook-digilocker?customerID=${customerID}&mobile=${mobileNo}`,
      // redirect_url: `https://fintest.loca.lt/customer_onboarding/aadhar-verification-webhook-digilocker?customerID=${customerID}&mobile=${mobileNo}`,
      redirect_to_signup: true,
    }

    const result = await this.apiService.call<
      IDecentroAadharInititateResponse,
      {
        reference_id: string
        consent: boolean
        consent_purpose: string
        redirect_url: string
        redirect_to_signup: boolean
      },
      undefined
    >(
      'post',
      DecentroApiUrl.AADHAR_INITIATE,
      requestBody,
      undefined,
      this.headers(),
    )

    let saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.DIGILOCKER_INITIATE_AADHAR,
      api_supplier: ApiSupplierType.DECENTRO,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url: config.decentroBaseUrl + DecentroApiUrl.AADHAR_INITIATE,
      api_method: 'POST',
      api_headers: JSON.stringify(this.headers()),
      api_request: JSON.stringify(requestBody),
      mobile_no: mobileNo.toString(),
    }

    await this.leadApiLogService.create(saveObject)

    try {
      await this.leadApiLogMongoDBService.create('Digilocker', saveObject)
    } catch (error) {
      logger.error(
        'Error while saving to MongoDB collection : Digilocker',
        error,
      )
    }

    return result
  }

  async generateDecentroAccessToken(
    state: string,
    code: string,
    customerID: number,
    mobile: string,
  ) {
    // TODO : Check result
    const requestBody = {
      reference_id: Date.now().toString(),
      initial_decentro_transaction_id: state,
      consent: true,
      consent_purpose: 'For Bank Account Purpose Only',
      digilocker_code: code,
    }

    const result = await this.apiService.call<
      IDecentroAadharInititateResponse, // TODO : Add interface
      {
        reference_id: string
        consent: boolean
        consent_purpose: string
        initial_decentro_transaction_id: string
        digilocker_code: string
      },
      undefined
    >(
      'post',
      DecentroApiUrl.GET_ACCESS_TOKEN,
      requestBody,
      undefined,
      this.headers(),
    )

    const saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.DIGILOCKER_ACCESS_TOKEN,
      api_supplier: ApiSupplierType.DECENTRO,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url:
        config.decentroBaseUrl + DecentroApiUrl.GET_ACCESS_TOKEN,
      api_method: 'POST',
      api_headers: JSON.stringify(this.headers()),
      api_request: JSON.stringify(requestBody),
      mobile_no: mobile.toString(),
    }

    await this.leadApiLogService.create(saveObject)

    try {
      await this.leadApiLogMongoDBService.create('digilocker', saveObject)
    } catch (error) {
      logger.error(
        'Error while saving to MongoDB collection : digilocker',
        error,
      )
    }

    return result
  }

  // ! Depracated
  // public async getAccessTokenDigilocker(
  //   state: string,
  //   code: string,
  //   customerID: number,
  //   mobile: string,
  // ): Promise<{ success: boolean; message: string; code: number; data: {} }> {
  //   try {
  //     const url = config.decentro_access_token_Api
  //     const referenceId = Date.now().toString()
  //     const initial_decentro_transaction_id = state

  //     const Data = JSON.stringify({
  //       initial_decentro_transaction_id: initial_decentro_transaction_id,
  //       consent: true,
  //       consent_purpose: 'For Bank Account Purpose Only',
  //       reference_id: String(referenceId),
  //       digilocker_code: code,
  //     })
  //     const response = await this.apiCall(url, 'POST', this.headers(), Data)
  //     let saveObject = {
  //       customerID: customerID,
  //       api_type: 'digilocker_access_token',
  //       api_supplier: 1,
  //       api_response: JSON.stringify(response.data),
  //       status: 1,
  //       api_endpoint_url: url,
  //       api_method: 'POST',
  //       api_headers: JSON.stringify(this.headers()),
  //       api_request: JSON.stringify({
  //         initial_decentro_transaction_id: initial_decentro_transaction_id,
  //         consent: true,
  //         consent_purpose: 'For Bank Account Purpose Only',
  //         reference_id: String(referenceId),
  //         digilocker_code: code,
  //       }),
  //       mobile_no: mobile,
  //     }
  //     await this.leadApiLogService.create(saveObject)
  //     if (response?.status == 200) {
  //       return {
  //         success: true,
  //         message: response?.data?.message,
  //         code: response?.status || 400,
  //         data: response?.data,
  //       }
  //     } else {
  //       return {
  //         success: false,
  //         message: response?.data?.message,
  //         code: response?.status || 400,
  //         data: response?.data,
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching access token from Digilocker:', error)
  //     throw error
  //   }
  // }

  async getEaadharData(state: string, customerID: number, mobile: string) {
    const requestBody = {
      initial_decentro_transaction_id: state,
      consent: true,
      consent_purpose: 'For Bank Account Purpose Only',
      reference_id: Date.now().toString(),
      generate_xml: false,
    }

    const result = await this.apiService.call<
      IDecentroEaadharResponse,
      {
        initial_decentro_transaction_id: string
        consent: boolean
        consent_purpose: string
        reference_id: string
        generate_xml: boolean
      },
      undefined
    >('post', DecentroApiUrl.EAADHAR, requestBody, undefined, this.headers())

    // Not to save here

    return result
  }
  // ! Depracated
  // public async getUserAadharData(
  //   state: string,
  //   customerID: number,
  //   mobile: string,
  // ): Promise<{ success: boolean; message: string; code: number; data: {} }> {
  //   try {
  //     const referenceId = Date.now().toString()
  //     const url = config.decentro_eAadharApi
  //     const initial_decentro_transaction_id = state

  //     const Data = JSON.stringify({
  //       initial_decentro_transaction_id: initial_decentro_transaction_id,
  //       consent: true,
  //       consent_purpose: 'For bank account purpose only',
  //       reference_id: String(referenceId),
  //       generate_xml: false,
  //       generate_pdf: true,
  //     })
  //     const response = await this.apiCall(url, 'POST', this.headers(), Data)
  //     let saveObject = {
  //       customerID: customerID,
  //       api_type: 'digilocker_eaadhaar',
  //       api_supplier: 1,
  //       api_response: JSON.stringify(response.data),
  //       status: 1,
  //       api_endpoint_url: url,
  //       api_method: 'POST',
  //       api_headers: JSON.stringify(this.headers()),
  //       api_request: JSON.stringify({
  //         initial_decentro_transaction_id: initial_decentro_transaction_id,
  //         consent: true,
  //         consent_purpose: 'For bank account purpose only',
  //         reference_id: String(referenceId),
  //         generate_xml: false,
  //         generate_pdf: true,
  //       }),
  //       mobile_no: mobile.toString(),
  //     }
  //     await this.leadApiLogService.create(saveObject)
  //     if (response?.status == 200) {
  //       //metadata logic
  //       // let user_metadata = (await this.userMetaDataService.findOne(
  //       //   { mobile: mobile },
  //       //   { orderKey: 'id', orderValue: 'desc' },
  //       //   ['*'],
  //       // )) as IUserMetadata
  //       // if (user_metadata && user_metadata.mobile) {
  //       //   let metaJSON = JSON.parse(user_metadata.metaJSON) || {}
  //       //   let data = response?.data?.data
  //       //   let address = data?.proofOfAddress
  //       //   metaJSON['digilocker_eaadhaar'] = {
  //       //     aadhar_no: data?.aadhaarUid,
  //       //     fullName: data?.proofOfIdentity?.name,
  //       //     email: '',
  //       //     phone: '',
  //       //     maskAadhar: data?.aadhaarUid,
  //       //     gender: data?.proofOfIdentity?.gender,
  //       //     dob: data?.proofOfIdentity?.dob,
  //       //     address: `${address?.careOf}/${address?.country}/${address?.district}/${address.house}/${address.landmark}/${address.locality}/${address.pincode}/${address.postOffice}/${address.state}/${address.street}/${address.subDistrict}/${address.vtc}`,
  //       //     address_json: address,
  //       //     aadhar_image: data?.image,
  //       //     aadhar_pdf: data?.pdf,
  //       //   }
  //       //   let dataToUpdate = {
  //       //     metaJSON: JSON.stringify(metaJSON),
  //       //   } as { metaJSON: string; profile_image: string; aadharVerify: string }
  //       //   user_metadata?.profile_image
  //       //     ? null
  //       //     : (dataToUpdate.profile_image = data?.image)
  //       //   user_metadata?.aadharVerify
  //       //     ? null
  //       //     : (dataToUpdate.aadharVerify = data?.aadhaarUid)
  //       //   console.log('Data To Update', dataToUpdate)
  //       //   await this.userMetaDataService.updateOne({ mobile }, dataToUpdate)
  //       // } else {
  //       //   // CREATE ENTRY
  //       //   let data = response?.data?.data?.data
  //       //   let address = data?.proofOfAddress
  //       //   let metaJSON = {
  //       //     digilocker_eaadhaar: {
  //       //       aadhar_no: data?.aadhaarUid,
  //       //       fullName: data?.proofOfIdentity?.name,
  //       //       email: '',
  //       //       phone: '',
  //       //       maskAadhar: data?.aadhaarUid,
  //       //       gender: data?.proofOfIdentity?.gender,
  //       //       dob: data?.proofOfIdentity?.dob,
  //       //       address: `${address?.careOf}/${address?.country}/${address?.district}/${address.house}/${address.landmark}/${address.locality}/${address.pincode}/${address.postOffice}/${address.state}/${address.street}/${address.subDistrict}/${address.vtc}`,
  //       //       address_json: address,
  //       //       aadhar_image: data?.image,
  //       //       aadhar_pdf: data?.pdf,
  //       //     },
  //       //   }
  //       //   await this.userMetaDataService.create({
  //       //     customerID,
  //       //     mobile,
  //       //     panVerify: '',
  //       //     aadharVerify: data?.aadhaarUid,
  //       //     metaJSON: JSON.stringify(metaJSON),
  //       //     profile_image: data?.image,
  //       //     aadhar_mask: '',
  //       //   })
  //       // }
  //       return {
  //         success: true,
  //         message: response?.data?.message,
  //         code: response?.status || 400,
  //         data: response?.data?.data,
  //       }
  //     } else {
  //       return {
  //         success: false,
  //         message: response?.data?.message,
  //         code: response?.status || 400,
  //         data: response?.data,
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user data Digilocker:', error)
  //     throw error
  //   }
  // }
}

export default DigilockerService
