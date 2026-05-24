import config from '@/config/default'
import axios, { HttpStatusCode } from 'axios'
import moment from 'moment-timezone'
import xml2js from 'xml2js'
import ResponseService from '../../../../../services/response.service'
import ApiBypassModel from '../../database/mysql/apiBypass'
import CreditReportModel from '../../database/mysql/creditReport'
import leadsApiLogModel from '../../database/mysql/leadApiLogs'
import StateModel from '../../database/mysql/states'
import { ApiSupplierType, LeadLogApiType } from '../../enums/common.enum'
import { LenderCredentials } from '../../enums/lender.enum'
import { NotFoundError } from '../../errors'
import { ApiBypassTypes } from '../../interfaces/api_bypass.interface'
import {
  ICAISAccountDetails,
  ICreditProfileHeader,
  IExperianHardPullGetRequest,
  IExperianRequestConfig,
  IExperianResponse,
  IExperianSoapRequest,
} from '../../interfaces/common.interface'
import { ICustomerLeadDetails } from '../../interfaces/customer.interface'
import { ILeadsApiLog } from '../../interfaces/leadApiLogs.interface'
import { IServiceResponse } from '../../interfaces/service.interface'
import { IState } from '../../interfaces/states.interface'
import { InsertData } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'
import { getCustomerDetails } from '../../utils/query.utils'
import razorpayClient from '../../utils/razorpayClient.utils'
class ExperianService extends ResponseService {
  private stateModel = new StateModel()
  private leadsApiLogModel = new leadsApiLogModel()
  private creditReportModel = new CreditReportModel()
  private apiBypassModel = new ApiBypassModel()
  private razorpayClient = new razorpayClient()

  public async hardPullExperianCustomerDetails(
    customerID: number,
    leadID: number,
    userID?: number,
  ): Promise<IServiceResponse> {
    const db = getKnexInstance()
    const customer = await db('customer as c')
      .join('leads as l', 'l.customerID', 'c.customerID')
      .where('l.leadID', '=', leadID)
      .where('c.customerID', '=', customerID)
      .where('l.customerID', '=', customerID)
      .whereIn('l.status', ['Fresh Lead', 'Document Received'])

    if (customer.length == 0) {
      throw new NotFoundError('Customer Not Found')
    }
    const lender_creds = await this.razorpayClient.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.EXPERIAN_HARD_PULL,
    )
    const data = await this.getExperianDetails(leadID, userID, customer[0].customerID, lender_creds)
    const response = this.convertToExperianResponse(data)
    return response
  }

  public async getHardPullExperianCrmDetails(
    leadID: number,
    userID?: number,
  ): Promise<IServiceResponse> {
    const db = getKnexInstance()
    const customer = await db('customer as c')
      .join('leads as l', 'l.customerID', 'c.customerID')
      .where('l.leadID', '=', leadID)

    if (customer.length == 0) {
      throw new NotFoundError('Customer Not Found')
    }
    const lender_creds = await this.razorpayClient.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.EXPERIAN_HARD_PULL,
    )
    const data = await this.getExperianDetails(leadID, userID, customer[0].customerID, lender_creds)
    const response = this.convertToExperianResponse(data)
    return response
  }

  public async getHardPullExperianBureauDetails(
    customerID: number,
    leadID: number,
    customerToken: string,
    userID?: number,
  ): Promise<IServiceResponse> {
    const db = getKnexInstance()
    const customer = await db('customer as c')
      .join('leads as l', 'l.customerID', 'c.customerID')
      .join('bureauCustomerToken as bct', 'bct.customerID', 'c.customerID')
      .where('l.leadID', '=', leadID)
      .where('c.customerID', '=', customerID)
      .where('l.customerID', '=', customerID)
      .where('bct.customerToken', '=', customerToken)
      .whereIn('l.status', ['Fresh Lead', 'Document Received'])

    if (customer.length == 0) {
      throw new NotFoundError('Customer Not Found')
    }
    const lender_creds = await this.razorpayClient.getLenderCredentialsByLeadId(
      leadID,
      LenderCredentials.EXPERIAN_HARD_PULL,
    )
    const data = await this.getExperianDetails(leadID, userID, customerID, lender_creds)
    const response = this.convertToExperianResponse(data)
    const bureauResponse = this.convertToBureauExperianResponse(response.data as IExperianResponse)
    response.data = bureauResponse
    return response
  }

  private async getExperianDetails(
    leadID: number,
    userID: number,
    customerID: number,
    lender_creds: IExperianHardPullGetRequest,
  ): Promise<IExperianResponse> {
    const db = getKnexInstance()
    const parser = new xml2js.Parser({ explicitArray: false })
    const customerDetails = await getCustomerDetails(leadID)
    const lead = await db('leads').select('lenderID').where('leadID', leadID).first()

    const GenderCode = this.getGenderCode(customerDetails.gender)

    const stateID = await this.stateModel.findOneState({ stateName: customerDetails.state }, [
      'cibil_state_code',
    ])

    if (!stateID) throw new NotFoundError('State Not Found')

    const formattedDob = moment(customerDetails.dob).format('YYYYmmDD')

    const { api_request, requestData } = this.convertToHardPullExperianRequest(
      customerDetails,
      GenderCode,
      formattedDob,
      stateID,
      lender_creds,
    )

    let output: string
    const environment: string = config.nodeEnv
    if (environment !== 'production') {
      const bypassExperianDetails = await this.apiBypassModel.findOne({
        where: {
          type: ApiBypassTypes.EXPERIAN,
          status: '1',
          lenderID: lead.lenderID,
        },
      })
      output = bypassExperianDetails?.api_response
    } else {
      const response = await axios.request(api_request)
      const xmlData = response.data
      parser.parseString(xmlData, (err: Error | null, result) => {
        if (err) {
          throw new NotFoundError('Error parsing SOAP XML:', { data: err })
        }

        // Extract the inner XML inside <ns2:out>
        const innerXml =
          result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns2:processResponse']['ns2:out']

        // Parse the inner XML separately
        parser.parseString(innerXml, (innerErr, innerResult) => {
          if (innerErr) {
            throw new NotFoundError('Error parsing inner XML:', { data: innerErr })
          }
          output = JSON.stringify(innerResult, null, 2)
        })
      })
    }
    const [savedLogId] = await this.saveLeadApiLogDetails(
      leadID,
      customerDetails,
      output,
      requestData,
      lender_creds,
    )
    const parsedOutput: IExperianResponse = JSON.parse(output)
    await this.saveCreditReportDetails(customerID, parsedOutput, userID, savedLogId)
    return parsedOutput
  }

  private async saveCreditReportDetails(
    customerID: number,
    parsedOutput: IExperianResponse,
    userID: number,
    savedLogId: number,
  ): Promise<number> {
    const creditReportDetails = {
      cr_provider: 3,
      bucket_id: null,
      customerID: customerID,
      stage_one_id:
        (
          (parsedOutput as IExperianResponse).INProfileResponse
            ?.CreditProfileHeader as ICreditProfileHeader
        )?.ReportNumber || '',
      stage_two_id: null,
      errors: null,
      status: +(parsedOutput.INProfileResponse?.UserMessage?.UserMessageText === 'Normal Response'),
      score: +parsedOutput.INProfileResponse?.SCORE?.BureauScore || 0,
      initiated_by: userID ?? +config.defaultUserId,
      created_by: userID ?? +config.defaultUserId,
      log_id: savedLogId,
      created_at: new Date(),
    }
    if (!creditReportDetails.status)
      creditReportDetails.errors =
        parsedOutput.INProfileResponse?.UserMessage?.UserMessageText || 'Error Response'
    const [savedCreditId] = await this.creditReportModel.create(creditReportDetails)
    return savedCreditId
  }

  private async saveLeadApiLogDetails(
    leadID: number,
    customerDetails: ICustomerLeadDetails,
    output: string,
    requestData: IExperianSoapRequest,
    lender_creds: IExperianHardPullGetRequest,
  ): Promise<number[]> {
    const logDetails: InsertData<ILeadsApiLog> = {
      leadID: leadID,
      customerID: customerDetails.customerID,
      api_type: LeadLogApiType.EXPERIAN_HARD_PULL,
      api_supplier: ApiSupplierType.CIBIL,
      api_response: output,
      status: 1,
      api_endpoint_url: lender_creds?.EXPERIAN_HARDPULL_URL,
      api_method: lender_creds?.EXPERIAN_HARDPULL_METHOD,
      api_request: JSON.stringify(requestData),
      mobile_no: customerDetails.mobile,
      pancard: customerDetails.pancard,
    }
    return await this.leadsApiLogModel.insert(logDetails)
  }

  private convertToHardPullExperianRequest(
    customerDetails: ICustomerLeadDetails,
    GenderCode: number,
    formattedDob: string,
    stateID: IState,
    lender_creds: IExperianHardPullGetRequest,
  ) {
    const requestData: IExperianSoapRequest = {
      'soapenv:Envelope': {
        $: {
          'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:urn': 'urn:cbv2',
        },
        'soapenv:Header': {},
        'soapenv:Body': {
          'urn:process': {
            'urn:in': {
              INProfileRequest: {
                Identification: {
                  XMLUser: lender_creds?.EXPERIAN_HARDPULL_USERNAME,
                  XMLPassword: lender_creds?.EXPERIAN_HARDPULL_PASSWORD,
                },
                Application: {
                  FTReferenceNumber: '',
                  CustomerReferenceID: '',
                  EnquiryReason: '13',
                  FinancePurpose: '99',
                  AmountFinanced: '5000',
                  DurationOfAgreement: '6',
                  ScoreFlag: '3',
                  PSVFlag: '0',
                },
                Applicant: {
                  Surname: customerDetails.lastName,
                  FirstName: customerDetails.firstName ?? customerDetails.lastName,
                  MiddleName1: customerDetails.middlename,
                  MiddleName2: '',
                  MiddleName3: '',
                  GenderCode: GenderCode,
                  IncomeTaxPAN: customerDetails.pancard,
                  PANIssueDate: '',
                  PANExpirationDate: '',
                  PassportNumber: '',
                  PassportIssueDate: '',
                  PassportExpirationDate: '',
                  VoterIdentityCard: '',
                  VoterIDIssueDate: '',
                  VoterIDExpirationDate: '',
                  DriverLicenseNumber: '',
                  DriverLicenseIssueDate: '',
                  DriverLicenseExpirationDate: '',
                  RationCardNumber: '',
                  RationCardIssueDate: '',
                  RationCardExpirationDate: '',
                  UniversalIDNumber: '',
                  UniversalIDIssueDate: '',
                  UniversalIDExpirationDate: '',
                  DateOfBirth: formattedDob,
                  STDPhoneNumber: '',
                  PhoneNumber: customerDetails.mobile,
                  TelephoneExtension: '',
                  TelephoneType: '',
                  MobilePhone: '',
                  EMailId: customerDetails.email,
                },
                Details: {
                  Income: '',
                  MaritalStatus: '',
                  EmployStatus: '',
                  TimeWithEmploy: '',
                  NumberOfMajorCreditCardHeld: '',
                },
                Address: {
                  FlatNoPlotNoHouseNo: customerDetails.address,
                  BldgNoSocietyName: customerDetails.city,
                  RoadNoNameAreaLocality: '',
                  City: customerDetails.city,
                  Landmark: '',
                  State: stateID.cibil_state_code,
                  PinCode: customerDetails.pincode,
                },
                AdditionalAddressFlag: {
                  Flag: 'N',
                },
                AdditionalAddress: {
                  FlatNoPlotNoHouseNo: '',
                  BldgNoSocietyName: '',
                  RoadNoNameAreaLocality: '',
                  City: '',
                  Landmark: '',
                  State: '',
                  PinCode: '',
                },
              },
            },
          },
        },
      },
    }

    // Convert the JavaScript object to XML
    const builder = new xml2js.Builder({ headless: true })
    const xmlRequest = builder.buildObject(requestData)

    let api_request: IExperianRequestConfig = {
      method: lender_creds?.EXPERIAN_HARDPULL_METHOD,
      url: lender_creds?.EXPERIAN_HARDPULL_URL,
      headers: {
        'Content-Type': lender_creds?.EXPERIAN_HARDPULL_CONTENT_TYPE,
      },
      data: xmlRequest,
    }
    return { api_request, requestData }
  }

  private getGenderCode(gender: string) {
    let GenderCode: number = 1 //1 for male default case
    if (gender === 'Female') {
      GenderCode = 2
    } else if (gender === 'Transgender') {
      GenderCode = 3
    }
    return GenderCode
  }

  private convertToExperianResponse(data: IExperianResponse): IServiceResponse {
    if (data.INProfileResponse?.UserMessage?.UserMessageText !== 'Normal Response') {
      // throw new BadRequestError('Unable to fetch experian data')
      return {
        statusCode: HttpStatusCode.InternalServerError,
        data: {},
        message: 'Unable to fetch experian data',
      }
    }

    return {
      statusCode: HttpStatusCode.Ok,
      data,
      message: 'Success',
    }
  }

  private convertToBureauExperianResponse(
    details: IExperianResponse,
  ): IExperianResponse | IServiceResponse {
    const accountDetails = details?.INProfileResponse?.CAIS_Account.CAIS_Account_DETAILS || null

    const transformAccountDetails = (account: ICAISAccountDetails): ICAISAccountDetails => ({
      ...account,
      CAIS_Holder_Details: {},
      CAIS_Holder_Address_Details: {},
      CAIS_Holder_Phone_Details: {},
      CAIS_Holder_ID_Details: {},
    })

    let accountDetailsResponse: ICAISAccountDetails[] | ICAISAccountDetails | string | null =
      accountDetails

    if (accountDetails) {
      if (Array.isArray(accountDetails)) {
        accountDetailsResponse = accountDetails.map(transformAccountDetails)
      } else if (typeof accountDetails === 'object') {
        accountDetailsResponse = transformAccountDetails(accountDetails as ICAISAccountDetails)
      }
    }

    if (!details || Object.keys(details).length === 0) {
      return null
    }

    return {
      ...details,
      INProfileResponse: {
        ...details.INProfileResponse,
        CreditProfileHeader: {},
        CAIS_Account: {
          ...details.INProfileResponse.CAIS_Account,
          CAIS_Account_DETAILS: accountDetailsResponse,
        },
      },
    }
  }
}

export default ExperianService
