import config from '@/config/default'
import { HttpStatusCode } from 'axios'
import moment from 'moment'
import { blackListCustomerPancardModel } from '../database/mysql/blacklistCustomerPancard'
import { customerModel } from '../database/mysql/customer'
import { documentFinboxmodel } from '../database/mysql/documentFinbox'
import { finboxNameMatchModel } from '../database/mysql/finboxNameMatch'
import { leadsApiLogModel } from '../database/mysql/leadApiLogs'
import { leadModel } from '../database/mysql/leads'
import { stepTrackerModel } from '../database/mysql/stepTracker'
import UserMetaDataModel from '../database/mysql/userMetadata'
import {
  ApiSupplierType,
  DecentroApiUrl,
  LeadLogApiType,
  StepName,
  SurePassApiUrl,
} from '../enums/common.enum'
import {
  FinBoxBankConnectProgressStatus,
  FinboxUrls,
  NameSimilarityStatus,
} from '../enums/finbox.enum'
import { AddressStatus, AddressType } from '../enums/lead.enum'
import { LeadStatus } from '../enums/leadStatus.enum'
import { Products } from '../enums/product.enum'
import { LeadSteps } from '../enums/step.enum'
import { BadRequestError, NotFoundError } from '../errors'
import { IAddress } from '../interfaces/address.interface'
import { CkycStatus, ICustomer } from '../interfaces/customer.interface'
import { IDocumentFinboxInterfaceModel } from '../interfaces/documentFinbox.interface'
import { IIdentityAccount } from '../interfaces/finbox.interface'
import {
  ICheckNamePercentage,
  IFinboxNameMatchModel,
} from '../interfaces/finboxNameMatch.interface'
import { ILeadsApiLog } from '../interfaces/leadApiLogs.interface'
import {
  IAadharVerificationInitiateDigiLockerPayload,
  IAadharVerificationWebhookDigiLocker,
  ICkycFetchPayload,
  IDecentroEaadharResponse,
  IFinboxBankConnectPayload,
  IFinboxCreateUrlPayload,
  IPanFetchPayload,
  ISurePassSendAadharOtpPayload,
  ISurePassValidatePanResponse,
  ISurePassVerifyAadharResponse,
  IVerifyAadharOtpSurePassPayload,
} from '../interfaces/onboarding.interface'
import { IServiceResponse } from '../interfaces/service.interface'
import AddressService from '../services/address.service'
import { customerService } from '../services/customer.service'
import ResponseService from '../services/response.service'
import DigilockerService from '../services/thirdParty/digilocker.service'
import { finboxService } from '../services/thirdParty/finbox.service'
import SurepassService from '../services/thirdParty/surepass.service'
import { InsertData, UpdateQuery } from '../types/model.types'
import { logger } from '../utils/logger'
import { getKnexInstance } from '../utils/mysql'
import { onboardAadharPanMatch } from '../utils/nameMatch.utils'
import {
  ckycDownload,
  ckycSearch,
  verifyPanSurePass,
} from '../utils/surePass.utils'
import { generateFinboxLinkId, isObjectEmpty, maskString } from '../utils/util'
import LeadApiLogService from './leadApiLog.service'
import LeadApiLogMongoDBService from './leadApiLogMongo.service'

export class OnboardingService extends ResponseService {
  private readonly leadApiLogService = new LeadApiLogService()
  private readonly customerService = customerService
  private readonly stepTrackermodel = stepTrackerModel
  private readonly blackListCustomerPancardModel = blackListCustomerPancardModel
  private readonly customerModel = customerModel
  private readonly surepassService = new SurepassService()
  private readonly digiLockerService = new DigilockerService()
  private readonly findBoxService = finboxService
  private readonly leadsApiLogModel = leadsApiLogModel
  private readonly finboxNameMatchmodel = finboxNameMatchModel
  private readonly documentFinboxmodel = documentFinboxmodel
  private readonly leadModel = leadModel
  private readonly addressService = new AddressService()
  private readonly userMetaDataModel = new UserMetaDataModel()
  private readonly leadApiLogMongoDBService = new LeadApiLogMongoDBService()
  constructor() {
    super()
  }
  onboardPanVerification = async (
    payload: IPanFetchPayload,
  ): Promise<IServiceResponse> => {
    const { panNumber, customerID, mobileNo, customerPanCardNo } = payload

    // Check if pan-card is blacklisted one
    const isBlackListedPan =
      await this.blackListCustomerPancardModel.isBlackListedCustomer(panNumber)

    if (isBlackListedPan) throw new BadRequestError('You cannot apply for loan')

    // If customer's pancard is already linked, send that data
    if (customerPanCardNo && payload?.pan_cust_verified === 1) {
      const panLeadApiLogData =
        await this.leadApiLogService.findPanComprehensiveResponse(
          customerPanCardNo,
          String(mobileNo),
        )
      // If the details exist then send it as payload
      if (panLeadApiLogData) {
        return this.serviceResponse(
          200,
          panLeadApiLogData,
          'PAN Already Linked, Details fetched',
        )
      }
    }

    // Check if customer already has pannumber linked
    // Check if the pannumber entered is of same customer or not
    const customer = await this.customerModel.findOneCustomer(
      { pancard: panNumber },
      ['mobile'],
    )

    if (customer) {
      // Check if mobileNo of customer is same, if same then only proceed further with lead_api_log
      // If not same then pan is linked to another customer
      if (customer.mobile !== mobileNo) {
        logger.error(
          `PAN no ${panNumber} is already linked to another mobile ${customer.mobile}`,
        )
        throw new BadRequestError(
          'This PAN number is associated with another existing account',
          {
            data: {
              mobileNo: maskString(String(customer.mobile), 6),
            },
          },
        )
      }

      // proceed with further checks
      // if (mobileNo === customer.mobile) case

      // Now check lead log api table

      const panLeadApiLogData =
        await this.leadApiLogService.findPanComprehensiveResponse(
          panNumber,
          String(mobileNo),
        )
      // If the details exist then send it as payload
      if (panLeadApiLogData) {
        await Promise.all([
          this.stepTrackermodel.completeStep(
            customerID,
            StepName.PAN_VERIFICATION,
            Products.PAYDAY,
          ),
          this.customerModel.findOneAndUpdate(
            { customerID },
            { step: LeadSteps.PAN_VERIFICATION },
          ),
        ])

        return this.serviceResponse(
          200,
          panLeadApiLogData,
          'PAN Details fetched',
        )
      }

      // The details don't exist in lead_log, proceed to hit surepass

      const surePassData = await verifyPanSurePass({
        panNumber,
        customerId: customerID,
        mobileNo,
      })

      if (!surePassData.success)
        throw new BadRequestError(
          surePassData.statusCode === HttpStatusCode.UnprocessableEntity
            ? surePassData.data?.message
            : 'Pan fetch failure',
          {
            data: {
              clientId: surePassData.data?.data?.client_id,
            },
          },
        )

      // Update step

      await Promise.all([
        this.stepTrackermodel.completeStep(
          customerID,
          StepName.PAN_VERIFICATION,
          Products.PAYDAY,
        ),
        this.customerModel.findOneAndUpdate(
          { customerID },
          { step: LeadSteps.PAN_VERIFICATION },
        ),
      ])

      return this.serviceResponse(200, surePassData.data.data, 'PAN Details')

      // Journey ended for this condtion
    }

    // ! If customer is not found with the above condition
    // Check if data available in lead Api log

    const panLeadApiLogData =
      await this.leadApiLogService.findPanComprehensiveResponse(
        panNumber,
        String(mobileNo),
      )

    // If the details exist then send it as payload
    if (panLeadApiLogData) {
      await Promise.all([
        this.stepTrackermodel.completeStep(
          customerID,
          StepName.PAN_VERIFICATION,
          Products.PAYDAY,
        ),
        this.customerModel.findOneAndUpdate(
          { customerID },
          { step: LeadSteps.PAN_VERIFICATION },
        ),
      ])
      return this.serviceResponse(200, panLeadApiLogData, 'PAN Details fetched')
    }

    // If not exists then hit surepass

    const surePassData = await verifyPanSurePass({
      panNumber,
      customerId: customerID,
      mobileNo,
    })

    if (!surePassData.success)
      throw new BadRequestError(
        surePassData.statusCode === HttpStatusCode.UnprocessableEntity
          ? surePassData.data?.message
          : 'Pan fetch failure',
        {
          data: {
            clientId: surePassData.data?.data?.client_id,
          },
        },
      )

    // Update step

    await Promise.all([
      this.stepTrackermodel.completeStep(
        customerID,
        StepName.PAN_VERIFICATION,
        Products.PAYDAY,
      ),
      this.customerModel.findOneAndUpdate(
        { customerID },
        { step: LeadSteps.PAN_VERIFICATION },
      ),
    ])

    return this.serviceResponse(200, surePassData.data.data, 'PAN Details')
  }

  onboardAadharVerificationGenerateOtp = async (
    payload: ISurePassSendAadharOtpPayload,
  ) => {
    const { aadharNo, customerID, mobileNo, customerAadharNo } = payload

    // Check if
    if (
      customerAadharNo &&
      (payload?.dob_digit_match !== null || payload?.dob_digit_match == '1')
    ) {
      throw new BadRequestError('Customer Aadhar is already linked')
    }

    // Check if this aadhar already linked with another customer

    const surepassCheck = await leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
        api_supplier: ApiSupplierType.SUREPASS,
        aadharNo,
      },
      ['mobile_no'],
      [{ column: 'id', order: 'desc' }],
    )

    if (surepassCheck && surepassCheck.mobile_no !== String(mobileNo)) {
      throw new BadRequestError(
        'This aadhaar number is associated with another existing account',
        {
          data: {
            mobileNo: maskString(surepassCheck.mobile_no, 6),
          },
        },
      )
    }

    // ! Also check digilocker - ! Removed due to expensive query
    // await this.checkDigilockerAadharExists(
    //   aadharNo,
    //   mobileNo,
    //   customerID,
    //   false,
    // )

    // Send OTP

    const resp = await this.surepassService.generateAadharOtpSurepass({
      aadharNo,
      customerID,
      mobileNo,
    })

    if (!resp.success) {
      throw new BadRequestError(
        'Aadhaar Verification Service is facing an issue, Please try other service',
        {
          data: {
            clientId: resp.data?.data?.client_id,
          },
        },
      )
    }

    return this.serviceResponse(200, {}, 'OTP sent to your registered mobile')
  }

  onboardAadharVerificationVerifyOtp = async (
    payload: IVerifyAadharOtpSurePassPayload,
  ) => {
    const { customerID, mobileNo, customerAadharNo, otp, aadharNo } = payload
    // const { step_order, product_id, step_id, is_completed } = payload.userStep

    // Check if
    if (
      customerAadharNo &&
      (payload?.dob_digit_match !== null || payload?.dob_digit_match == '1')
    )
      throw new BadRequestError('Customer Aadhar is already linked')

    // Check if customer already has aadhar linked
    // Check if the aadhar entered is of same customer or not
    const customer = await this.customerModel.findOneCustomer(
      { aadharNo: Number(aadharNo) },
      ['mobile'],
    )

    if (customer && customer?.mobile !== mobileNo) {
      logger.error(
        `Aadhar no ${aadharNo} is already linked to another mobile ${customer.mobile}`,
      )
      throw new BadRequestError(
        'This Aadhar Number is already linked with another account, Please enter a different Aadhar number',
      )
    }

    // Get the Send OTP response
    const leadLogs = await this.leadApiLogService.findAadharV2SendOtpResponse(
      aadharNo,
      String(mobileNo),
    )

    if (!leadLogs) {
      logger.error(
        `No data found for surepass ${LeadLogApiType.AADHAR_V2_GENERATE_OTP} for customer with id ${customerID}`,
      )
      throw new BadRequestError(
        'There was an issue in verifying your OTP, Please contact the administrator',
      )
    }

    const resp = await this.surepassService.verifyAadharOtpSurepass({
      client_id: leadLogs.client_id,
      customerID,
      mobileNo,
      otp,
      aadharNo,
    })

    if (!resp.success) {
      logger.error(
        `Surepass submit otp hit error: ${
          resp?.data?.message ?? 'Verify failure'
        }, with data ${JSON.stringify(resp.data)}`,
      )
      let errorMessage =
        'Aadhaar Verification Service is facing an issue, Please try other service'

      if (resp?.data?.message === 'OTP Already Submitted.') {
        errorMessage = 'Your OTP has expired. Please request a new one.'
      }

      throw new BadRequestError(errorMessage)
    }

    // // Also check digilocker
    // await this.checkDigilockerAadharExists(
    //   aadharNo,
    //   mobileNo,
    //   customerID,
    //   false,
    // )

    let saveObject: InsertData<ILeadsApiLog> = {
      customerID: customerID,
      api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
      api_supplier: ApiSupplierType.SUREPASS,
      api_response: JSON.stringify(resp.data),
      status: resp.success ? 1 : 0,
      api_endpoint_url: config.surePassApi + SurePassApiUrl.AADHAR_SUBMIT,
      api_method: 'POST',
      api_headers: JSON.stringify({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        otp,
        client_id: leadLogs.client_id,
        aadhaar_pdf_generate: true,
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

    return this.serviceResponse(200, {}, 'Aadhar details saved')
  }

  onboardAadharInitiateDigiLocker = async (
    payload: IAadharVerificationInitiateDigiLockerPayload,
  ) => {
    const { customerID, mobile, customerAadharNo, callBackUrl } = payload

    if (
      customerAadharNo &&
      (payload?.dob_digit_match !== null || payload?.dob_digit_match == '1')
    ) {
      throw new BadRequestError('Customer Aadhar is already linked')
    }

    // Call digilocker-decentro api

    const resp = await this.digiLockerService.initiateDigiLockerAadhar(
      customerID,
      mobile,
      callBackUrl,
    )

    if (!resp.success) {
      logger.error('Error in Decentro API: ' + JSON.stringify(resp.data))
      throw new BadRequestError('DigiLocker service is currently unavailable')
    }

    return this.serviceResponse(
      200,
      { url: resp.data.data.authorizationUrl },
      'Initiate Digilocker URL',
    )
  }

  aadharVerificationWebhookDigiLocker = async (
    payload: IAadharVerificationWebhookDigiLocker,
  ) => {
    const { state, code, customerID, mobile } = payload

    const resp = await this.digiLockerService.generateDecentroAccessToken(
      state,
      code,
      customerID,
      mobile,
    )

    if (!resp.success)
      throw new BadRequestError(
        resp.data.message ?? 'Failed to verify aadhar',
        { data: resp.data },
      )

    const resp2 = await this.digiLockerService.getEaadharData(
      state,
      customerID,
      mobile,
    )

    if (!resp.success)
      throw new BadRequestError(
        resp2.data.message ?? 'Failed to verify aadhar',
        {
          data: resp2.data,
        },
      )

    // Check if this aadhar number exists for any customer who did surepass aadhar

    const aadharNo = resp2.data.data.aadhaarUid.slice(-4)

    await this.checkDigilockerAadharExists(aadharNo, +mobile, customerID, true)

    // Save here

    const saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
      api_supplier: ApiSupplierType.DECENTRO,
      api_response: JSON.stringify(resp2.data),
      status: resp2.success ? 1 : 0,
      api_endpoint_url: config.decentroBaseUrl + DecentroApiUrl.EAADHAR,
      api_method: 'POST',
      api_headers: JSON.stringify({
        accept: 'application/json',
        client_id: config.decentro_client_id,
        client_secret: config.decentro_client_secret,
        module_secret: config.decentro_module_secret,
        'content-type': 'application/json',
      }),
      api_request: JSON.stringify({
        initial_decentro_transaction_id: state,
        consent: true,
        consent_purpose: 'For Bank Account Purpose Only',
        reference_id: Date.now().toString(),
        generate_xml: false,
      }),
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

    return this.serviceResponse(200, {}, 'Success')
  }
  async checkDigilockerAadharExists(
    aadharNo: string,
    mobileNo: number,
    customerID: number,
    isSurepass: boolean,
  ) {
    const panDetails = await leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
        api_supplier: ApiSupplierType.SUREPASS,
        mobile_no: String(mobileNo),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )
    let db = getKnexInstance()
    switch (isSurepass) {
      case false:
        const digilockerCheck: ILeadsApiLog = await db('leads_api_log')
          .select('mobile_no', 'api_response') // Selecting all fields
          .where('api_type', 'digilocker_eaadhaar') // Filtering by api_type
          .whereRaw('JSON_VALID(api_response)') // Ensuring the JSON is valid
          .whereRaw(
            "RIGHT(JSON_UNQUOTE(JSON_EXTRACT(api_response, '$.data.aadhaarUid')), 4) = ?",
            [aadharNo.slice(-4)],
          )
          .first()
        // Name match and dob match
        if (digilockerCheck) {
          const aadarResponse = <IDecentroEaadharResponse['data']>(
            JSON.parse(digilockerCheck.api_response).data
          )
          const {
            proofOfIdentity: { dob: aadharDob, name: aadharFullName },
          } = aadarResponse

          // Do dob match first, should be 100 %

          if (panDetails) {
            const panResponse = <ISurePassValidatePanResponse['data']>(
              JSON.parse(panDetails.api_response).data
            )

            const { full_name: panFullName, dob: panDob } = panResponse

            const aadharDobFormatted = moment(aadharDob, 'DD-MM-YYYY').format(
              'YYYY-MM-DD',
            )

            // compare dob

            const dobMatch = await this.findBoxService.checkNamePercentage(
              {
                firstName: panDob,
                secondName: aadharDobFormatted,
                type: 'panDOB - aadharDOB',
                leadId: 0,
                customerID,
                customerMobileNo: String(mobileNo),
              },
              false,
            )

            if (dobMatch.percentageResult === 100) {
              // If dob Match is 100, then after that check for name
              const nameMatch =
                await this.findBoxService.checkNamePercentageByRajatApi(
                  {
                    firstName: panFullName,
                    secondName: aadharFullName,
                    type: 'pan - aadhar',
                    leadId: 0,
                    customerID,
                    customerMobileNo: String(mobileNo),
                  },
                  false,
                )

              if (nameMatch.percentageResult === 100) {
                // If 100% match then aadhar already exists
                throw new BadRequestError(
                  'This aadhaar number is associated with another existing account',
                  {
                    data: {
                      mobileNo: maskString(digilockerCheck.mobile_no, 6),
                    },
                  },
                )
              }
            }
          }
        }
        break
      case true:
        // In this we don't have to check for digilocker in lead_api_log
        // but if surepass found, again do name and dob checks

        const aadhar: ICustomer =
          await this.customerModel.CustomerKnex.whereRaw(
            'RIGHT(aadharNo,4) = ?',
            [aadharNo],
          )
            .select('mobile')
            .first()

        if (aadhar && aadhar?.mobile !== mobileNo && panDetails) {
          const aadhaarDetails = await leadsApiLogModel.findOneLeadsApiLog(
            {
              status: 1,
              api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
              api_supplier: ApiSupplierType.SUREPASS,
              mobile_no: String(aadhar.mobile),
            },
            ['api_response', 'mobile_no'],
            [{ column: 'id', order: 'desc' }],
          )

          if (!aadhaarDetails) return

          const aadarResponse = <ISurePassVerifyAadharResponse['data']>(
            JSON.parse(aadhaarDetails.api_response).data
          )

          const panResponse = <ISurePassValidatePanResponse['data']>(
            JSON.parse(panDetails.api_response).data
          )
          const { full_name: aadharFullName, dob: aadharDob } = aadarResponse

          const { full_name: panFullName, dob: panDob } = panResponse

          // compare dob

          const dobMatch = await this.findBoxService.checkNamePercentage(
            {
              firstName: panDob,
              secondName: aadharDob,
              type: 'panDOB - aadharDOB',
              leadId: 0,
              customerID,
              customerMobileNo: String(mobileNo),
            },
            false,
          )

          if (dobMatch.percentageResult === 100) {
            // If dob Match is 100, then after that check for name
            const nameMatch =
              await this.findBoxService.checkNamePercentageByRajatApi(
                {
                  firstName: panFullName,
                  secondName: aadharFullName,
                  type: 'pan - aadhar',
                  leadId: 0,
                  customerID,
                  customerMobileNo: String(mobileNo),
                },
                false,
              )

            if (nameMatch.percentageResult === 100) {
              // If 100% match then aadhar already exists
              throw new BadRequestError(
                'This aadhaar number is associated with another existing account',
                {
                  data: {
                    mobileNo: maskString(aadhaarDetails.mobile_no, 6),
                  },
                },
              )
            }
          }
        }
        break
      default:
        break
    }
  }

  async ckycFetch(payload: ICkycFetchPayload) {
    const { pancard, mobileNo, customerID, dob } = payload

    // Check if data already exists for ckyc

    let ckycDownloadResp = await leadsApiLogModel.findCkycDownloadResponse(
      pancard,
    )

    // If already exists send as response
    if (!ckycDownloadResp) {
      // If does not exist, then make api calls

      // Make search API call
      const ckycSearchResponse = await ckycSearch(
        { id_number: pancard },
        customerID,
        mobileNo,
      )

      if (!ckycSearchResponse.success) {
        logger.error(
          'Error in CKYC search API ' + JSON.stringify(ckycSearchResponse.data),
        )
        throw new BadRequestError(
          'An error occured in initialising your CKYC process, Please try again!',
        )
      }

      // After successful call of CKYC search API
      // Call Download API

      const ckycDownloadResponse = await ckycDownload(
        {
          client_id: ckycSearchResponse.data.client_id,
          dob,
        },
        customerID,
        mobileNo,
        pancard,
      )

      if (!ckycDownloadResponse.success) {
        logger.error(
          'Error in CKYC search API ' + JSON.stringify(ckycSearchResponse.data),
        )
        throw new BadRequestError(
          'An error occured in initialising your CKYC process, Please try again!',
        )
      }

      ckycDownloadResp = ckycDownloadResponse.data
    }

    // After successful Download API response
    // CKYC Checks

    const isChecksPassed = await this.ckycChecks(
      pancard,
      customerID,
      String(mobileNo),
    )

    // Update CKYC in customer table

    const updateCustomer: UpdateQuery<ICustomer> = {
      ckyc_status: CkycStatus.SUCCESS,
    }

    if (!isChecksPassed) {
      updateCustomer.dob_digit_match = null
      updateCustomer.is_pan_aadhar_linked = 'Not'
      updateCustomer.is_dob_match = 'Not'
      updateCustomer.ckyc_status = CkycStatus.CKYC_FAILED
    }

    await this.customerModel.findOneAndUpdate({ customerID }, updateCustomer)

    return this.serviceResponse(
      HttpStatusCode.Ok,
      { success: isChecksPassed },
      isChecksPassed ? 'Success' : 'Failure',
    )
  }

  async ckycChecks(pancard: string, customerID: number, mobileNo: string) {
    let isMatched = true
    const ckycData = await leadsApiLogModel.findCkycDataForMatch(pancard)

    const mobileNoMatch = await this.findBoxService.checkNamePercentage({
      firstName: mobileNo,
      secondName: ckycData.cykcMobile,
      type: 'mobileNumber - ckycMobileNumber',
      leadId: 0,
      customerID,
      customerMobileNo: mobileNo,
    })

    // Check if image exists or not

    if (mobileNoMatch.percentageResult !== 100 || !ckycData.ckycImage) {
      isMatched = false
    }

    return isMatched
  }

  fetchThirdPartyDetails = async (customerID: number) => {
    const customer = await this.customerModel.findOneCustomer(
      { customerID: customerID },
      ['*'],
    )
    if (!customer) {
      throw new BadRequestError('customer not found')
    }
    let panDetails = await leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
        api_supplier: ApiSupplierType.SUREPASS,
        mobile_no: String(customer.mobile),
      },
      ['*'],
      [{ column: 'id', order: 'desc' }],
    )
    let aadharDetails = await leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
        api_supplier: ApiSupplierType.SUREPASS,
        aadharNo: String(customer.aadharNo),
      },
      ['*'],
      [{ column: 'id', order: 'desc' }],
    )
    const ckycDetailsDownload = await leadsApiLogModel.findOneLeadsApiLog(
      {
        api_supplier: ApiSupplierType.SUREPASS,
        status: 1,
        api_type: LeadLogApiType.CKYC_DOWNLOAD,
        pancard: customer.pancard,
      },
      ['api_response'],
    )
    const ckycDetailsSearch = await leadsApiLogModel.findOneLeadsApiLog(
      {
        api_supplier: ApiSupplierType.SUREPASS,
        status: 1,
        api_type: LeadLogApiType.CKYC_SEARCH,
        pancard: customer.pancard,
      },
      ['api_response'],
    )
    return this.serviceResponse(
      200,
      { panDetails, aadharDetails, ckycDetailsDownload, ckycDetailsSearch },
      'Fetched details ',
    )
  }
  finboxCreateUrl = async (
    payload: IFinboxCreateUrlPayload,
  ): Promise<IServiceResponse> => {
    const { mobileNo, callBackUrl, customerID } = payload

    const redirect_url = callBackUrl
      ? callBackUrl
      : `${config.frontendBaseUrl}${FinboxUrls.CREATE_URL}`
    const logo_url = `${config.frontendBaseUrl}/${FinboxUrls.LOGO_URL}`

    const response = await finboxService.bankConnect({
      link_id: generateFinboxLinkId(+customerID, 'rf'),
      redirect_url,
      logo_url,
    })

    if (!response.is_success)
      throw new BadRequestError('Failed to create a url', {
        data: response.apimsg,
      })

    return this.serviceResponse(200, response.apimsg, 'Url created')
  }
  finboxBankConnect = async (
    payload: IFinboxBankConnectPayload,
  ): Promise<IServiceResponse> => {
    const {
      entityId,
      mobileNo,
      leadID,
      aadharNo,
      customerID,
      pancard,
      step,
      email,
    } = payload

    const lead = await this.leadsApiLogModel.findOneLeadsApiLog({ leadID })

    if (!lead) throw new NotFoundError('Lead not found')

    let predictors: { sync_result: string }

    const identityReportResponse = await finboxService.bankConnectIdentity({
      entityId,
    })

    let status = identityReportResponse.is_success ? 1 : 0

    let bankConnectName: string
    let customerName: string

    const saveObject: InsertData<ILeadsApiLog> = {
      api_type: LeadLogApiType.IDENTITY,
      api_supplier: 2,
      leadID: 0,
      api_response: JSON.stringify(identityReportResponse.apimsg),
      entity_id: entityId,
      status,
      customerID,
    }
    await this.leadApiLogService.create(saveObject)

    try {
      await this.leadApiLogMongoDBService.create('finbox', saveObject)
    } catch (error) {
      logger.error('Error while saving to MongoDB collection : finbox', error)
    }

    if (!identityReportResponse.is_success) {
      logger.error(
        'Finbox 3rd party API: Identity Error for entity id: ' + entityId,
      )

      throw new BadRequestError(
        "We're facing technical issues with Finbox Bank Connect. Our team is working on it",
        { data: identityReportResponse.apimsg },
      )
    }

    // if identity api is successful, proceed
    const identityProgress = identityReportResponse.apimsg?.progress
    const isProgressArray = Array.isArray(identityProgress)
    const progressArrayLength = isProgressArray ? identityProgress.length : 0
    if (identityProgress && isProgressArray && identityProgress.length > 0) {
      const lastProgress = identityProgress[identityProgress.length - 1]

      if (lastProgress.status === FinBoxBankConnectProgressStatus.PROCESSING) {
        logger.error(
          `Last progress status: ${FinBoxBankConnectProgressStatus.PROCESSING} for entity id: ${entityId}`,
        )

        throw new BadRequestError(
          "We're facing technical issues with Finbox Bank Connect. Our team is working on it",
          {
            data: {
              apiStatus: lastProgress.status,
              status: 0,
              finboxName: '',
              kycName: '',
              pageName: 'dashboard',
              route: '/dashboard',
            },
          },
        )
      } else if (
        lastProgress.status === FinBoxBankConnectProgressStatus.FAILED
      ) {
        logger.error(
          `Last progress status: ${FinBoxBankConnectProgressStatus.FAILED} for entity id: ${entityId}`,
        )
        throw new BadRequestError(
          'Invalid bank statement. Please upload a valid one.',
          {
            data: {
              apiStatus: lastProgress.status,
              status: 0,
              finboxName: '',
              kycName: '',
              pageName: 'dashboard',
              route: '/dashboard',
            },
          },
        )
      }
    }

    if (
      identityReportResponse.is_success &&
      identityProgress &&
      Array.isArray(identityProgress) &&
      progressArrayLength > 0
    ) {
      const saveObject: InsertData<ILeadsApiLog> = {
        api_type: LeadLogApiType.IDENTITY,
        api_supplier: 2,
        leadID: leadID,
        api_response: JSON.stringify(identityReportResponse.apimsg),
        entity_id: entityId,
        status,
        customerID,
      }

      let predictors = await finboxService.predictors(
        mobileNo,
        entityId,
        leadID,
        customerID,
      )

      const leadApiLogs = await this.leadsApiLogModel.findOneLeadsApiLog({
        entity_id: entityId,
        api_type: LeadLogApiType.IDENTITY,
      })

      if (!leadApiLogs) {
        await this.leadApiLogService.create(saveObject)

        try {
          await this.leadApiLogMongoDBService.create('finbox', saveObject)
        } catch (error) {
          logger.error(
            'Error while saving to MongoDB collection : finbox',
            error,
          )
        }
      } else {
        await this.leadApiLogService.updateOne(
          {
            entity_id: entityId,
          },
          saveObject,
        )
      }

      let aadharData: ILeadsApiLog
      let digilocker: ILeadsApiLog

      let pancardDetails = await this.leadsApiLogModel.findOneLeadsApiLog(
        {
          status: 1,
          api_type: LeadLogApiType.PAN_COMPREHENSIVE,
          pancard,
        },
        ['api_response'],
        [{ column: 'id', order: 'desc' }],
      )

      let checkNameType: string

      if (pancardDetails) {
        const pancardJson = JSON.parse(pancardDetails.api_response)
        customerName = pancardJson?.data?.full_name
          ? pancardJson?.data?.full_name
          : ''
        checkNameType = 'finbox - pancard'
      }

      customerName = customerName.toLowerCase()

      const identity = identityReportResponse.apimsg.identity // identity is an array
      let foundIdentity: IIdentityAccount = {} as IIdentityAccount
      if (identity && Array.isArray(identity)) {
        foundIdentity = finboxService.findLastUpdatedAccount(
          identityReportResponse.apimsg,
        )

        if (!isObjectEmpty(foundIdentity)) {
          bankConnectName = foundIdentity.name

          if (
            bankConnectName !== 'summary' ||
            (identity.length == 1 && bankConnectName == 'summary')
          ) {
            const accountNo = foundIdentity?.account_number ?? ''
            let checkFinboxNameMatch: IFinboxNameMatchModel

            if (accountNo) {
              // TODO : Create finbox_name_match model
              checkFinboxNameMatch =
                await this.finboxNameMatchmodel.findOneFinboxNameMatch(
                  { customerID, leadID, status: 1, accountNo },
                  ['*'],
                  [{ column: 'id', order: 'desc' }],
                )
            }
            if (!checkFinboxNameMatch) {
              if (customerName && bankConnectName) {
                const nameMatchObj: ICheckNamePercentage = {
                  leadId: leadID || 0,
                  customerID: customerID || 0,
                  customerMobileNo: mobileNo || '0',
                  type: checkNameType,
                  firstName: bankConnectName,
                  secondName: customerName,
                }

                const checkSimilarNamePercentage =
                  await finboxService.checkNamePercentage(nameMatchObj)

                if (
                  checkSimilarNamePercentage.errorCode === 0 &&
                  checkSimilarNamePercentage.status ===
                    NameSimilarityStatus.REJECT
                ) {
                  // PAN failed, Aadhar to be checked now
                  if (aadharNo) {
                    aadharData = await this.leadsApiLogModel.findOneLeadsApiLog(
                      {
                        status: 1,
                        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                        aadharNo: aadharNo.toString(),
                      },
                      ['api_response'],
                      [{ column: 'id', order: 'desc' }],
                    )
                  }
                  if (!aadharData) {
                    digilocker = await this.leadsApiLogModel.findOneLeadsApiLog(
                      {
                        status: 1,
                        api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                        mobile_no: mobileNo,
                      },
                      ['api_response'],
                      [{ column: 'id', order: 'desc' }],
                    )
                  }

                  if (aadharData) {
                    const aadharDataJson = JSON.parse(aadharData.api_response)
                    customerName = aadharDataJson?.data?.full_name
                      ? aadharDataJson.data.full_name
                      : ''
                    checkNameType = 'finbox - aadhar'
                  } else if (digilocker) {
                    const digilockerJson = JSON.parse(digilocker.api_response)
                    customerName = digilockerJson?.data?.proofOfIdentity?.name
                      ? digilockerJson?.data?.proofOfIdentity?.name
                      : ''
                    checkNameType = 'finbox - digilocker'
                  }

                  customerName = customerName.toLowerCase()

                  const nameMatchObj: ICheckNamePercentage = {
                    leadId: leadID || 0,
                    customerID: customerID || 0,
                    customerMobileNo: mobileNo || '0',
                    type: checkNameType,
                    firstName: bankConnectName,
                    secondName: customerName,
                  }

                  const checkSimilarNamePercentage =
                    await finboxService.checkNamePercentage(nameMatchObj)

                  if (
                    checkSimilarNamePercentage.errorCode === 0 &&
                    checkSimilarNamePercentage.status ===
                      NameSimilarityStatus.REJECT
                  ) {
                    const data: InsertData<IFinboxNameMatchModel> = {
                      leadID,
                      customerID,
                      accountNo,
                      firstName: bankConnectName,
                      secondName: customerName,
                      pecentageMatch:
                        checkSimilarNamePercentage.percentageResult,
                    }

                    // Check finbox name match exist for user
                    const checkFinboxNameMatch =
                      await this.finboxNameMatchmodel.findOneFinboxNameMatch({
                        customerID,
                        leadID,
                        accountNo,
                      })

                    // If does not exist then insert
                    if (!checkFinboxNameMatch)
                      await this.finboxNameMatchmodel.insert(data)

                    throw new BadRequestError(
                      'Bank Statement Name and Aadhar/Digilocker/Pancard Name is Mismatch',
                      {
                        data: {
                          status: 0,
                          apiStatus: 0,
                          finboxName: bankConnectName,
                          kycName: customerName,
                          pageName: 'dashboard',
                          route: '/dashboard',
                        },
                      },
                    )
                  }
                }
              } else {
                const data: InsertData<IFinboxNameMatchModel> = {
                  leadID,
                  customerID,
                  accountNo,
                  firstName: bankConnectName,
                  secondName: customerName,
                  pecentageMatch: 0.0,
                }

                // Check finbox name match exist for user
                const checkFinboxNameMatch =
                  await this.finboxNameMatchmodel.findOneFinboxNameMatch({
                    customerID,
                    leadID,
                    accountNo,
                  })

                // If does not exist then insert
                if (!checkFinboxNameMatch)
                  await this.finboxNameMatchmodel.insert(data)

                throw new BadRequestError(
                  'Bank Statement Name and Aadhar/Digilocker/Pancard Name is Mismatch',
                  {
                    data: {
                      status: 0,
                      apiStatus: 0,
                      finboxName: bankConnectName,
                      kycName: customerName,
                      pageName: 'dashboard',
                      route: '/dashboard',
                    },
                  },
                )
              }
            }
          }
        }
      }

      // Active writing
    } else {
      throw new BadRequestError('Something went wrong!', {
        data: {
          status: 1,
          apiStatus: '',
          finboxName: '',
          kycName: '',
          pageName: 'dashboard',
          route: '/dashboard',
          identity: {
            ...identityReportResponse.apimsg,
          },
        },
      })
    }

    let bankConnectXlsxReportResponse =
      await finboxService.bankConnectXlsxReport(entityId, customerID)

    let bankConnectXlsxProgress = bankConnectXlsxReportResponse.apimsg?.progress
    if (
      bankConnectXlsxReportResponse.is_success &&
      bankConnectXlsxProgress &&
      Array.isArray(bankConnectXlsxProgress)
    ) {
      let bankConnectXlsxReport =
        bankConnectXlsxReportResponse.apimsg?.reports[0]?.link

      if (!bankConnectXlsxReport) {
        await new Promise((resolve) => setTimeout(resolve, 6000))
        bankConnectXlsxReportResponse =
          await finboxService.bankConnectXlsxReport(entityId, customerID)
      }
      bankConnectXlsxProgress = bankConnectXlsxReportResponse.apimsg?.progress

      bankConnectXlsxReport =
        bankConnectXlsxReportResponse.apimsg?.reports[0]?.link

      if (bankConnectXlsxProgress && bankConnectXlsxProgress?.length > 0) {
        const statementId = bankConnectXlsxProgress[0].statement_id
        const source = bankConnectXlsxProgress[0].source
        let link = '--'

        if (bankConnectXlsxReport) {
          link = bankConnectXlsxReport
        }

        let checkdocumentFinbox =
          await this.documentFinboxmodel.findOneDocumentFinbox({
            leadID,
            entityID: entityId,
          })

        let documentFinboxData: IDocumentFinboxInterfaceModel =
          {} as IDocumentFinboxInterfaceModel
        if (!checkdocumentFinbox) {
          documentFinboxData.customerID = customerID
          documentFinboxData.leadID = leadID
          documentFinboxData.entityID = entityId
          documentFinboxData.type = source
          documentFinboxData.statement_id = statementId
          documentFinboxData.documentType = 'Bank Statement'
          documentFinboxData.documentFile = link
          documentFinboxData.verifiedBy = 'finbox'
          documentFinboxData.verifiedDate = new Date()

          // save to document finbox
          await this.documentFinboxmodel.insert(documentFinboxData)
          await finboxService.leadStatusChangedDocumentReceivedNew(leadID)
        }
      }
    }
    if (step && leadID) {
      await leadModel.findOneAndUpdate({ leadID }, { step })
    }

    // if (email) {
    //   await this.sendApplyMail(email)
    // }

    predictors = await finboxService.predictors(
      mobileNo,
      entityId,
      leadID,
      customerID,
    )
    status = 0
    let isPredictorSuccess = 'processing'

    let check = await this.leadsApiLogModel.findOneLeadsApiLog({
      status: 1,
      api_supplier: 2,
      mobile_no: mobileNo,
      leadID: leadID,
      entity_id: entityId,
    })

    if (check) {
      status = 1
      isPredictorSuccess = ''
    }

    let approvedStatus = await leadModel.findOneLead({ leadID })

    let pageName: string
    let route: string
    if (
      approvedStatus &&
      approvedStatus.status === LeadStatus.APPROVED_PROCESS
    ) {
      pageName = 'approval'
      route = '/loan-approval'
    } else if (
      approvedStatus &&
      (approvedStatus.status === LeadStatus.REJECTED ||
        approvedStatus.status === LeadStatus.REJECTED_PROCESS)
    ) {
      pageName = 'rejected'
      route = '/finbox-reject'
    } else {
      pageName = 'dashboard'
      route = '/dashboard'
    }
    await this.stepTrackermodel.completeStep(
      customerID,
      StepName.FINBOX,
      Products.PAYDAY,
      leadID,
    )
    // }

    return this.serviceResponse(
      200,
      {
        status,
        api_status: isPredictorSuccess,
        finboxName: bankConnectName,
        kycName: customerName,
        pageName,
        finboxResult: predictors.sync_result,
        route,
      },
      'Success',
    )
  }
  aadharPanVerifyMatch = async (customerID: number, mobile: string) => {
    const matches = await onboardAadharPanMatch(mobile, customerID)

    // match should be 100
    const customerTableUpdate: Partial<ICustomer> = {
      dob_digit_match: '0',
      is_dob_match: 'No',
      is_pan_aadhar_linked: 'No',
      aadharNo: null,
    }

    let addressData: InsertData<IAddress>

    let errorResponseData = {
      isAadharLinked: false,
      isDobNameMatch: false,
      route: '/dashboard',
    }

    matches.isSurePassAadhar
      ? (addressData = {
          customerID,
          address: `${matches.surePassAadharData?.address?.house ?? ''} . ${
            matches.surePassAadharData?.address?.street ?? ''
          } ${matches.surePassAadharData?.address?.subdist ?? ''} ${
            matches.surePassAadharData?.address?.po ?? ''
          }`,
          city: matches.surePassAadharData?.address?.dist ?? '',
          state: matches.surePassAadharData?.address?.state,
          pincode: matches.surePassAadharData?.zip
            ? Number(matches.surePassAadharData?.zip)
            : 0,
          status: AddressStatus.VERIFIED,
          type: AddressType.PERMANENT_ADDRESS,
        })
      : (addressData = {
          customerID,
          address: `${
            matches.digilockerAadharData?.proofOfAddress?.careOf ?? ''
          } . ${matches.digilockerAadharData?.proofOfAddress?.house ?? ''} ${
            matches.digilockerAadharData?.proofOfAddress?.street ?? ''
          } ${matches.digilockerAadharData?.proofOfAddress?.locality ?? ''}`,
          city: matches.digilockerAadharData?.proofOfAddress?.district ?? '',
          state: matches.digilockerAadharData?.proofOfAddress?.state,
          pincode: matches.digilockerAadharData?.proofOfAddress?.pincode
            ? Number(matches.digilockerAadharData?.proofOfAddress?.pincode)
            : 0,
          status: AddressStatus.VERIFIED,
          type: AddressType.PERMANENT_ADDRESS,
        })

    await Promise.all([
      this.addressService.create(addressData),
      matches.isSurePassAadhar
        ? this.userMetaDataModel.createOrUpdateUserMeta({
            customerID,
            type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
            data: matches.surePassAadharData,
            mobile,
          })
        : this.userMetaDataModel.createOrUpdateUserMeta({
            customerID,
            type: LeadLogApiType.DIGILOCKER_EAADHAR,
            data: matches.digilockerAadharData,
            mobile,
          }),
    ])

    if (!matches.aadharExistsInPan) {
      // ! Customer need to reverify PAN,[Surepass will be hit again]

      // if aadhar not in pan, but name match, and dob match , then we will complete aadhar step else not complete it

      if (matches.dobMatch === 100) {
        const promises: any[] = [
          this.customerModel.findOneAndUpdate(
            { customerID },
            {
              dob_digit_match: '0',
              is_dob_match: 'Yes',
              is_pan_aadhar_linked: 'No',
              aadharNo: matches.isSurePassAadhar
                ? Number(matches.surePassAadharData.aadhaar_number)
                : null,
            },
          ),
        ]

        await Promise.all(promises)

        errorResponseData.isDobNameMatch = true
      } else {
        // Aadhar details are not fine, hence step will not be completed

        customerTableUpdate.aadharNo = matches.isSurePassAadhar
          ? Number(matches.surePassAadharData.aadhaar_number)
          : null

        await this.customerModel.findOneAndUpdate(
          {
            customerID,
          },
          customerTableUpdate,
        )

        // await this.stepTrackermodel.completeStep(
        //   customerID,
        //   StepName.AADHAR_CONFIRMATION,
        //   Products.PAYDAY,
        // )
      }

      throw new BadRequestError(
        'Your PAN is not linked with your aadhar, Please Re-Verify',
        {
          data: errorResponseData,
        },
      )
    }

    if (matches.dobMatch === 100) {
      customerTableUpdate.is_dob_match = 'Yes'

      await this.customerModel.findOneAndUpdate(
        { customerID },
        customerTableUpdate,
      )
    }

    if (matches.dobMatch !== 100) {
      errorResponseData.isAadharLinked = true

      await this.customerModel.findOneAndUpdate(
        { customerID },
        {
          dob_digit_match: '0',
          is_dob_match: 'No',
          is_pan_aadhar_linked: 'Yes',
          aadharNo: matches.isSurePassAadhar
            ? Number(matches.surePassAadharData.aadhaar_number)
            : null,
        },
      )

      throw new BadRequestError(
        "Your Aadhar DOB does not match your PAN's DOB",
        {
          data: errorResponseData,
        },
      )
    }
    if (matches.lastDigitsMatch !== 100) {
      errorResponseData.isAadharLinked = true

      await this.customerModel.findOneAndUpdate(
        { customerID },
        {
          dob_digit_match: '0',
          is_dob_match: 'Yes',
          is_pan_aadhar_linked: 'Yes',
          aadharNo: matches.isSurePassAadhar
            ? Number(matches.surePassAadharData.aadhaar_number)
            : null,
        },
      )
      throw new BadRequestError('Your Aadhar/PAN is unverified', {
        data: errorResponseData,
      })
    }
    // if (matches.nameMatch !== 100) {
    //   errorResponseData.isAadharLinked = true
    //   throw new BadRequestError("Your Aadhar and PAN's name do not match", {
    //     data: errorResponseData,
    //   })
    // }

    // Update record in db telling customer table that everything is verified

    // Save Aadhar address to DB

    // Add data to userMeta

    const promises: any[] = [
      this.customerModel.findOneAndUpdate(
        { customerID },
        {
          dob_digit_match: '1',
          is_dob_match: 'Yes',
          is_pan_aadhar_linked: 'Yes',
          aadharNo: matches.isSurePassAadhar
            ? Number(matches.surePassAadharData.aadhaar_number)
            : null,
        },
      ),
      this.stepTrackermodel.completeStep(
        customerID,
        StepName.AADHAR_CONFIRMATION,
        Products.PAYDAY,
      ),
    ]

    await Promise.all(promises)

    return this.serviceResponse(200, {}, 'Aadhar/PAN Verified')
  }
}

export const onboardingservice = new OnboardingService()
