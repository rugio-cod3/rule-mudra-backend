import config from '@/config/default'
import axios from 'axios'
import moment from 'moment'
import { apiByPassModel } from '../../database/mysql/apiBypass'
import { approvalModel } from '../../database/mysql/approval'
import { callHistorymodel } from '../../database/mysql/callHistory'
import { callHistoryLogsModel } from '../../database/mysql/callhistorylogs'
import { customerModel } from '../../database/mysql/customer'
import { customerNameMatchmodel } from '../../database/mysql/customerNameMatch'
import { documentFinboxmodel } from '../../database/mysql/documentFinbox'
import { leadsApiLogModel } from '../../database/mysql/leadApiLogs'
import { leadModel } from '../../database/mysql/leads'
import { mobileTokenModel } from '../../database/mysql/mobileToken'
import { repayDateHolidaymodel } from '../../database/mysql/repayDateHoliday'
import { thirdPartylogs } from '../../database/mysql/thirdPartyLogs'
import { ApprovalStatus } from '../../enums/approvalStatus.enums'
import { BranchName, CallType, LeadLogApiType } from '../../enums/common.enum'
import {
  DateDifference,
  nameCheckPercentage,
  NameSimilarityStatus,
} from '../../enums/finbox.enum'
import { LeadStatus } from '../../enums/leadStatus.enum'
import { BadRequestError, NotFoundError } from '../../errors'
import { commonHelper } from '../../helpers/common'
import { IApproval } from '../../interfaces/approval.interface'
import { ICustomerNameMatchModel } from '../../interfaces/customerNameMatch.interface'
import {
  IBankConnectIdentityReportPayload,
  IFinboxBankConnectPayload,
  IIdentityAccount,
} from '../../interfaces/finbox.interface'
import {
  ICheckNamePercentage,
  ICheckNamePercentageResponse,
} from '../../interfaces/finboxNameMatch.interface'
import { ILeadsApiLog } from '../../interfaces/leadApiLogs.interface'
import AxiosService from '../../services/api.service'
import {
  addMonthNoOverflow,
  addMonthsToDate,
  subtractDayFromDate,
} from '../../utils/dateTimeFunction'
import { logger } from '../../utils/logger'
import { replaceNameClippingsRe, similarityPercent } from '../../utils/util'
import { approvalService } from '../approval.service'
import { LeadService } from '../lead.service'
import LeadApiLogMongoDBService from '../leadApiLogMongo.service'

class FinboxService {
  private apiUrl = 'https://apis.bankconnect.finbox.in/'

  // Dev
  private devEnv = 0
  private devApiKey = '54bXP1Uqz63XTzfhK64PElmp0ilzNnPqXkEK1dGc'
  private devServerHash = 'b81c9a328e4b409f9b41dce4777244d2'

  // Live
  private liveEnv = 1
  private liveApiKey = '5NPxJjy6s5fUtsZD12JbusM4c7fo5AzW0LXy83CU'
  private liveServerHash = '4c18063c3b9d4482b48e40192766e07f'

  // Env
  private activeEnv =
    config.nodeEnv === 'development' ? this.devEnv : this.liveEnv
  private XAPIKEY =
    this.activeEnv === this.devEnv ? this.devApiKey : this.liveApiKey
  private SERVERHASH =
    this.activeEnv === this.devEnv ? this.devServerHash : this.liveServerHash

  private STATUS_ACCEPT = 'ACCEPT'
  private STATUS_REJECT = 'REJECT'

  private readonly customerNameMatchmodel = customerNameMatchmodel
  private readonly leadsApiLogModel = leadsApiLogModel
  private readonly mobileTokenModel = mobileTokenModel
  private readonly commonHelper = commonHelper
  private readonly callHistorymodel = callHistorymodel
  private readonly callHistoryLogsModel = callHistoryLogsModel
  private readonly repayDateHolidaymodel = repayDateHolidaymodel
  private readonly approvalService = approvalService
  private readonly documentFinboxModel = documentFinboxmodel
  private leadApiLogMongoDBService = new LeadApiLogMongoDBService()

  private headers() {
    return {
      'content-type': 'application/json',
      'x-api-key': this.XAPIKEY,
      'server-hash': this.SERVERHASH,
    }
  }

  async checkNamePercentageByRajatApi(
    payload: ICheckNamePercentage,
    shouldSave = true,
  ): Promise<Partial<ICheckNamePercentageResponse>> {
    let { customerID, customerMobileNo, firstName, leadId, secondName, type } =
      payload

    let firstNameLower = firstName ? firstName.trim().toLowerCase() : ''
    let secondNameLower = secondName ? secondName.trim().toLowerCase() : ''
    let typeLower = type ? type.toLowerCase() : ''

    firstNameLower = replaceNameClippingsRe(firstNameLower)
    secondNameLower = replaceNameClippingsRe(secondNameLower)

    if (!firstNameLower) {
      return {
        errorCode: 1,
        errorMsg: 'First Name empty',
      }
    }

    if (!secondNameLower) {
      return {
        errorCode: 1,
        errorMsg: 'Second Name empty',
      }
    }

    if (!typeLower) {
      return {
        errorCode: 1,
        errorMsg: 'Type empty',
      }
    }

    leadId = leadId ? leadId : 0
    customerID = customerID ? customerID : 0

    customerMobileNo = customerMobileNo ? customerMobileNo : ''

    const url = `${config.gatorUrl}api/name_match`
    const method = 'POST'
    const headers = {
      'x-auth-token': `${config.gatorToken}`,
      'x-client-id': `${config.clientId}`,
      'Content-Type': 'application/json',
    }
    const body = {
      user_id: customerID.toString(),
      source_name: firstName,
      target_name: secondName,
      reversible: true,
      first_name_order_not_important: true,
    }

    let res
    try {
      res = await this.apiCall(url, method, headers, body)
      if (!res?.is_success) {
        throw new BadRequestError(
          'Finbox API returned error',
          res?.apimsg || {},
        )
      }
    } catch (error) {
      throw new BadRequestError(
        'Failed to fetch name match score from Finbox API',
        error,
      )
    }

    const apiNameMatchScore = res.apimsg.name_match_score || 0

    const status =
      apiNameMatchScore >= nameCheckPercentage
        ? NameSimilarityStatus.ACCEPT
        : NameSimilarityStatus.REJECT

    const percentageData: ICheckNamePercentageResponse = {
      errorCode: 0,
      errorMsg: 'Successfully',
      firstName: firstNameLower,
      secondName: secondNameLower,
      percentageConditionCheck: nameCheckPercentage,
      percentageResult: apiNameMatchScore,
      status,
    }

    const saveData: Omit<
      ICustomerNameMatchModel,
      'is_proceed' | 'created_at' | 'id'
    > = {
      lead_id: leadId,
      customer_id: customerID,
      mobile_no: customerMobileNo,
      type,
      first_name: firstNameLower,
      second_name: secondNameLower,
      percentage: String(apiNameMatchScore),
      percentage_data: JSON.stringify(percentageData),
      status: status === NameSimilarityStatus.ACCEPT ? 1 : 0,
    }

    if (shouldSave) {
      await this.customerNameMatchmodel.insert(saveData)
      await thirdPartylogs.insert({
        customerID,
        leadID: leadId,
        api_supplier: 12,
        api_type: 'name_match',
        api_endpoint_url: url,
        api_method: method,
        api_request: JSON.stringify(body),
        api_response: JSON.stringify(res),
        status: apiNameMatchScore >= nameCheckPercentage ? 1 : 0,
      })
    }
    return percentageData
  }

  async checkNamePercentage(
    payload: ICheckNamePercentage,
    shouldSave = true,
  ): Promise<Partial<ICheckNamePercentageResponse>> {
    let { customerID, customerMobileNo, firstName, leadId, secondName, type } =
      payload

    let firstNameLower = firstName ? firstName.trim().toLowerCase() : ''
    let secondNameLower = secondName ? secondName.trim().toLowerCase() : ''
    let typeLower = type ? type.toLowerCase() : ''

    firstNameLower = replaceNameClippingsRe(firstNameLower)
    secondNameLower = replaceNameClippingsRe(secondNameLower)

    if (!firstNameLower) {
      return {
        errorCode: 1,
        errorMsg: 'First Name empty',
      }
    }

    if (!secondNameLower) {
      return {
        errorCode: 1,
        errorMsg: 'Second Name empty',
      }
    }

    if (!typeLower) {
      return {
        errorCode: 1,
        errorMsg: 'Type empty',
      }
    }

    leadId = leadId ? leadId : 0
    customerID = customerID ? customerID : 0

    customerMobileNo = customerMobileNo ? customerMobileNo : ''

    // Text similarity percentage

    const percentage = similarityPercent(firstNameLower, secondNameLower)
    // Round off to 2 decimal places

    const percentResult = Number(percentage.toFixed(2))

    const status =
      percentResult >= nameCheckPercentage
        ? NameSimilarityStatus.ACCEPT
        : NameSimilarityStatus.REJECT

    const percentageData: ICheckNamePercentageResponse = {
      errorCode: 0,
      errorMsg: 'Successfully',
      firstName: firstNameLower,
      secondName: secondNameLower,
      percentageConditionCheck: nameCheckPercentage,
      percentageResult: percentResult,
      status,
    }

    const saveData: Omit<
      ICustomerNameMatchModel,
      'is_proceed' | 'created_at' | 'id'
    > = {
      lead_id: leadId,
      customer_id: customerID,
      mobile_no: customerMobileNo,
      type,
      first_name: firstNameLower,
      second_name: secondNameLower,
      percentage: String(percentResult),
      percentage_data: JSON.stringify(percentageData),
      status: status === NameSimilarityStatus.ACCEPT ? 1 : 0,
    }

    if (shouldSave) await this.customerNameMatchmodel.insert(saveData)
    return percentageData
  }

  async bankConnect(payload: IFinboxBankConnectPayload) {
    const { link_id, logo_url, redirect_url } = payload

    const url = `${this.apiUrl}bank-connect/v1/session/`
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 3)
    const formattedStartDate = `${String(startDate.getDate()).padStart(
      2,
      '0',
    )}/${String(startDate.getMonth() + 1).padStart(
      2,
      '0',
    )}/${startDate.getFullYear()}`

    const endDate = new Date()
    const formattedEndDate = `${String(endDate.getDate()).padStart(
      2,
      '0',
    )}/${String(endDate.getMonth() + 1).padStart(
      2,
      '0',
    )}/${endDate.getFullYear()}`
    const body = {
      link_id: link_id,
      api_key: this.XAPIKEY,
      redirect_url: redirect_url,
      logo_url: logo_url,
      from_date: formattedStartDate,
      to_date: formattedEndDate,
    }
    return await this.apiCall(url, 'POST', this.headers(), body)
  }

  private async apiCall(url: string, method: string, headers: {}, body: {}) {
    try {
      console.log(method, url, headers, body)
      const response = await axios({
        method: method,
        url: url,
        headers: headers,
        data: body,
      })
      return {
        is_success: true,
        apimsg: response.data,
      }
    } catch (error) {
      console.log('Error in Finbox api call: ', error.response)
      return {
        is_success: false,
        apimsg: error?.response?.data,
      }
    }
  }

  async predictors(
    mobile: string,
    entity_id: string,
    leadID: number,
    customerID: number,
  ): Promise<{ sync_result: string }> {
    try {
      let check = await this.leadsApiLogModel.findOneLeadsApiLog(
        {
          status: 1,
          api_supplier: 2,
          mobile_no: String(mobile),
          entity_id: entity_id,
        },
        ['sync_result'],
      )
      if (check) {
        return { sync_result: check.sync_result }
      }
      const finalArray = {}
      let acceptReject = this.STATUS_ACCEPT
      const predictorsHitResult = await this.predictorshit(entity_id)
      if (
        predictorsHitResult.is_success &&
        predictorsHitResult.apimsg?.predictors &&
        Array.isArray(predictorsHitResult.apimsg.predictors) &&
        predictorsHitResult.apimsg.predictors[0]?.predictors
      ) {
        const predictorsData =
          predictorsHitResult.apimsg.predictors[0].predictors
        const predictArray = [
          'total_inward_chq_bounces_insuff_fund_0',
          'total_inward_chq_bounces_insuff_fund_1',
          'total_inward_chq_bounces_insuff_fund_2',
          'total_inward_chq_bounces_insuff_fund_3',
          'total_inward_chq_bounces_insuff_fund_4',
          'total_inward_chq_bounces_insuff_fund_5',
          'total_inward_chq_bounces_insuff_fund_6',
          'total_inward_payment_bounce_0',
          'total_inward_payment_bounce_1',
          'total_inward_payment_bounce_2',
          'total_inward_payment_bounce_3',
          'total_inward_payment_bounce_4',
          'total_inward_payment_bounce_5',
          'total_inward_payment_bounce_6',
          'total_emi_bounce_0',
          'total_emi_bounce_1',
          'total_emi_bounce_2',
          'total_emi_bounce_3',
          'total_emi_bounce_4',
          'total_emi_bounce_5',
          'total_emi_bounce_6',
          'inward_chq_bounces_insuff_fund_0',
          'inward_chq_bounces_insuff_fund_1',
          'inward_chq_bounces_insuff_fund_2',
          'inward_chq_bounces_insuff_fund_3',
          'inward_chq_bounces_insuff_fund_4',
          'inward_chq_bounces_insuff_fund_5',
          'inward_chq_bounces_insuff_fund_6',
          'emi_bounce_0',
          'emi_bounce_1',
          'emi_bounce_2',
          'emi_bounce_3',
          'emi_bounce_4',
          'emi_bounce_5',
          'emi_bounce_6',
          'cnt_ach_bounce_charge_in_3_months',
          'cnt_ach_bounce_charge_in_6_months',
          'emi_check_returns_last_3_months',
          'emi_check_returns_last_6_months',
        ]

        for (const thisKey of predictArray) {
          if (
            predictorsData[thisKey] !== undefined ||
            predictorsData[thisKey] === null
          ) {
            const res = predictorsData[thisKey]
            finalArray[thisKey] = res
            if (acceptReject !== this.STATUS_REJECT) {
              if (res > 0) acceptReject = this.STATUS_REJECT
            }
          }
        }

        const transactions = await this.transactionsdata(entity_id)
        // success or failure response
        // transactions {
        //   lender_transactions: [],
        //   ach_bounce_charge: [],
        //   nach_setup_charge: [],
        //   min_bal_charge: []
        // }

        const finalObj = Object.assign(finalArray, transactions)
        // Continue from here
        if (acceptReject === this.STATUS_ACCEPT) {
          if (transactions.lender_transactions.length > 0) {
            acceptReject = this.STATUS_REJECT
          }
        }

        if (acceptReject === this.STATUS_ACCEPT) {
          if (transactions.ach_bounce_charge.length > 0) {
            acceptReject = this.STATUS_REJECT
          }
        }

        if (acceptReject === this.STATUS_ACCEPT) {
          if (transactions.nach_setup_charge.length > 0) {
            acceptReject = this.STATUS_REJECT
          }
        }

        if (acceptReject === this.STATUS_ACCEPT) {
          if (transactions.min_bal_charge.length > 0) {
            acceptReject = this.STATUS_REJECT
          }
        }

        const saveArray: Omit<ILeadsApiLog, 'created_at'> = {
          api_type: 'predictors',
          api_supplier: 2,
          leadID: leadID,
          mobile_no: mobile,
          api_response: JSON.stringify(predictorsHitResult),
          entity_id: entity_id,
          sync_data: JSON.stringify(finalObj),
          sync_result: acceptReject,
          status: 1,
          customerID,
        }

        await this.leadsApiLogModel.insert(saveArray)

        try {
          await this.leadApiLogMongoDBService.create('finbox', saveArray)
        } catch (error) {
          logger.error(
            'Error while saving to MongoDB collection : finbox',
            error,
          )
        }

        return { sync_result: acceptReject }
      }
      return { sync_result: acceptReject }
    } catch (error) {
      throw error
    }
  }

  public async bankConnectIdentity(payload: IBankConnectIdentityReportPayload) {
    const { entityId } = payload

    const url = `${this.apiUrl}bank-connect/v1/entity/${entityId}/identity/`
    const response = await this.apiCall(url, 'GET', this.headers(), {})
    const status = response.is_success ? 1 : 0

    const saveObject = {
      api_type: 'identity',
      api_supplier: 2,
      leadID: 0,
      api_response: JSON.stringify(response.apimsg),
      entity_id: entityId,
      status: status,
    }
    await this.leadsApiLogModel.insert(saveObject)

    try {
      await this.leadApiLogMongoDBService.create('finbox', saveObject)
    } catch (error) {
      logger.error('Error while saving to MongoDB collection : finbox', error)
    }
    return response
  }

  public async predictorshit(entity_id: string) {
    const url = `${this.apiUrl}bank-connect/v1/entity/${entity_id}/predictors/`
    let response = await this.apiCall(url, 'GET', this.headers(), {})
    return response
  }

  public async transactionsdata(entity_id: string) {
    const lenderTransactions = []
    const achBounceCharge = []
    const nachSetupCharge = []
    const minBalCharge = []
    const transactions = await this.bankConnectTransactionsReport(entity_id)
    if (transactions.is_success && transactions.apimsg?.transactions) {
      for (const txn of transactions.apimsg.transactions) {
        if (
          txn.transaction_channel === 'auto_debit_payment' &&
          txn.description === 'lender_transactions'
        ) {
          lenderTransactions.push(txn)
        } else if (
          txn.transaction_channel === 'bank_charge' &&
          txn.description === 'ach_bounce_charge'
        ) {
          achBounceCharge.push(txn)
        } else if (
          txn.transaction_channel === 'bank_charge' &&
          txn.description === 'nach_setup_charge'
        ) {
          nachSetupCharge.push(txn)
        } else if (
          txn.transaction_channel === 'bank_charge' &&
          txn.description === 'min_bal_charge'
        ) {
          minBalCharge.push(txn)
        }
      }
    }

    return {
      lender_transactions: lenderTransactions,
      ach_bounce_charge: achBounceCharge,
      nach_setup_charge: nachSetupCharge,
      min_bal_charge: minBalCharge,
    }
  }

  public async bankConnectTransactionsReport(entity_id) {
    const url = `${this.apiUrl}bank-connect/v1/entity/${entity_id}/transactions/`
    const response = await this.apiCall(url, 'GET', this.headers(), {})
    const status = response.is_success ? 1 : 0

    const saveObject: ILeadsApiLog = {
      api_type: 'transactions',
      api_supplier: 2,
      leadID: 0,
      api_response: JSON.stringify(response.apimsg),
      entity_id: entity_id,
      status,
    }
    await this.leadsApiLogModel.insert(saveObject)

    try {
      await this.leadApiLogMongoDBService.create('finbox', saveObject)
    } catch (error) {
      logger.error('Error while saving to MongoDB collection : finbox', error)
    }

    return response
  }

  findLastUpdatedAccount(payload: any): IIdentityAccount {
    // TODO : Define types
    let foundIdentity: IIdentityAccount = {} as IIdentityAccount

    if (payload.accounts && payload.identity) {
      const accounts = payload.accounts
      const identity = payload.identity

      accounts.sort(
        (a, b) =>
          new Date(b.last_updated).getTime() -
          new Date(a.last_updated).getTime(),
      )

      const accountId = accounts[0].account_id

      foundIdentity = identity.find((id) => id.account_id === accountId) || {}
    }

    return foundIdentity
  }

  async bankConnectXlsxReport(entityId: string, customerID: number) {
    const url = `${this.apiUrl}bank-connect/v1/entity/${entityId}/xlsx_report/`
    const response = await this.apiCall(url, 'GET', this.headers(), {})

    const status = response.is_success ? 1 : 0

    const saveData: ILeadsApiLog = {
      api_type: LeadLogApiType.XLSX_REPORT,
      api_supplier: 2,
      leadID: 0,
      api_response: JSON.stringify(response.apimsg),
      entity_id: entityId,
      status,
      customerID,
    }

    await this.leadsApiLogModel.insert(saveData)

    try {
      await this.leadApiLogMongoDBService.create('finbox', saveData)
    } catch (error) {
      logger.error('Error while saving to MongoDB collection : finbox', error)
    }

    return response
  }

  async leadStatusChangedDocumentReceivedNew(leadID: number) {
    const leaddetails = await leadModel.findOneLead({ leadID })

    if (
      (leaddetails && leaddetails.status === LeadStatus.FRESH_LEAD) ||
      leaddetails.status === LeadStatus.DOCUMENT_RECEIVED ||
      leaddetails.status === LeadStatus.CALLBACK ||
      leaddetails.status === LeadStatus.INTERESTED ||
      leaddetails.status === LeadStatus.NO_ANSWER ||
      leaddetails.status === LeadStatus.INCOMPLETE_DOCUMENTS ||
      leaddetails.status === LeadStatus.DNC
    ) {
      const customerID = leaddetails.customerID

      await leadModel.findOneAndUpdate(
        { leadID },
        { status: LeadStatus.DOCUMENT_RECEIVED },
      )

      const remarkStatus = LeadStatus.DOCUMENT_RECEIVED
      const noteliStatus = LeadStatus.DOCUMENT_RECEIVED

      await Promise.all([
        this.callHistorymodel.insert({
          customerID,
          leadID,
          callType: CallType.IVR,
          status: remarkStatus,
          noteli: noteliStatus,
          callbackTime: new Date(),
          calledBy: 221,
          remark: remarkStatus,
        }),
        this.callHistoryLogsModel.insert({
          customerID,
          leadID,
          callType: CallType.IVR,
          status: remarkStatus,
          noteli: noteliStatus,
          callbackTime: new Date(),
          calledBy: 221,
          remark: remarkStatus,
        }),
      ])

      const leadDataForApprovedProcess = await leadModel.findOneLead(
        { leadID },
        ['*'],
        [{ column: 'leadID', order: 'desc' }],
      )

      const customerId = leadDataForApprovedProcess.customerID

      if (
        leadDataForApprovedProcess &&
        leadDataForApprovedProcess?.status === LeadStatus.DOCUMENT_RECEIVED
      ) {
        if (
          leadDataForApprovedProcess.fbLeads &&
          ['Existing Case', 'New Case'].includes(
            leadDataForApprovedProcess.fbLeads,
          )
        ) {
          await this.bankingChecksForFinbox(leadID, customerID)
        } else if (
          leadDataForApprovedProcess.fbLeads &&
          leadDataForApprovedProcess.fbLeads === 'Repeat Case'
        ) {
          await this.approvalService.autoApproveRepeatCustomer(
            leadID,
            leaddetails.customerID,
          )
        }
      }
    }
  }

  async bankingChecksForFinbox(leadID: number, customerID: number) {
    const baseUrl = this.commonHelper.getBaseUrl()
    const apiCall = new AxiosService(baseUrl)

    const mobileToken = await this.mobileTokenModel.findOneMobileToken(
      { customerID: String(customerID) },
      ['access_token'],
      [{ column: 'id', order: 'desc' }],
    )
    const body = {
      leadID: leadID,
      access_token: mobileToken.access_token,
    }

    const apiData = await apiCall.call<
      undefined,
      {
        leadID: number
        access_token: string
      },
      undefined
    >('post', `/${config.bankingChecksForFinbox}`, body, undefined, {
      'Content-Type': 'application/json',
    })

    return apiData
  }

  async repayDateFind(salaryDate: string) {
    // Convert to moment
    let currentDate = moment()
    const convertedSalaryDate = Number(salaryDate)

    const currentDay = currentDate.date() // Get current day
    const daysInMonth = currentDate.daysInMonth() // Get max days in current month

    let targetDate = currentDate.clone() // Clone the current date to avoid mutation

    if (convertedSalaryDate >= currentDay) {
      targetDate.date(convertedSalaryDate)
    } else {
      targetDate = addMonthNoOverflow(targetDate, convertedSalaryDate)
    }

    let formattedDate = targetDate.format('YYYY-MM-DD')

    // Get the current date
    let now = moment()

    // Calculate the difference in days between the target date and the current date
    let difference = targetDate.diff(now, 'days')

    if (difference < DateDifference.LESSER) {
      targetDate = addMonthsToDate(targetDate, 1)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference = targetDate.diff(moment().format('YYYY-MM-DD'), 'days')
    }

    if (difference > DateDifference.GREATER) {
      currentDate = moment()
      targetDate = addMonthsToDate(currentDate, 1).day(
        convertedSalaryDate - daysInMonth,
      )
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference = targetDate.diff(currentDate, 'days')
      difference++
    }

    // Handle the case when $salaryDate is 31
    if (convertedSalaryDate === 31 && daysInMonth === 30) {
      targetDate = subtractDayFromDate(targetDate, 1)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference--
    }
    // Subtract 2 from days
    if (convertedSalaryDate === 31 && daysInMonth === 29) {
      targetDate = subtractDayFromDate(targetDate, 2)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference -= 2
    }

    // Subtract 3 from days
    if (convertedSalaryDate === 31 && daysInMonth === 28) {
      targetDate = subtractDayFromDate(targetDate, 3)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference -= 3
    }

    if (convertedSalaryDate === 30 && daysInMonth === 29) {
      targetDate = subtractDayFromDate(targetDate, 1)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference--
    }

    if (convertedSalaryDate === 30 && daysInMonth === 28) {
      targetDate = subtractDayFromDate(targetDate, 2)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference -= 2
    }
    // Find the day of the week for formattedDate
    let dayOfWeek = targetDate.format('dddd')

    // Adjust formattedDate based on the day of the week

    if (dayOfWeek === 'Sunday') {
      targetDate = subtractDayFromDate(targetDate, 2)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference -= 2
    }

    if (dayOfWeek === 'Saturday') {
      targetDate = subtractDayFromDate(targetDate, 1)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference--
    }

    let holidayCount =
      await this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
        repaydate: targetDate.format('YYYY-MM-DD'),
      })

    currentDate = moment(formattedDate)
    let repayDay = currentDate.format('dddd')

    while (holidayCount > 0) {
      targetDate = subtractDayFromDate(targetDate, 1)
      formattedDate = targetDate.format('YYYY-MM-DD')
      difference--

      currentDate = moment(formattedDate)
      repayDay = currentDate.format('dddd')

      holidayCount =
        await this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
          repaydate: targetDate.format('YYYY-MM-DD'),
        })

      if (repayDay === 'Sunday') {
        targetDate = subtractDayFromDate(targetDate, 2)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference -= 2
        currentDate = moment(formattedDate)
        repayDay = currentDate.format('dddd')
        holidayCount =
          await this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
            repaydate: targetDate.format('YYYY-MM-DD'),
          })
      }

      if (repayDay === 'Saturday') {
        targetDate = subtractDayFromDate(targetDate, 1)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference--
        currentDate = moment(formattedDate)
        repayDay = currentDate.format('dddd')
        holidayCount =
          await this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
            repaydate: targetDate.format('YYYY-MM-DD'),
          })
      }
    }

    // TODO : Check if logic is repeating or not
    if (difference < DateDifference.LESSER) {
      if (convertedSalaryDate >= currentDay) {
        targetDate.date(convertedSalaryDate)
      } else {
        targetDate = addMonthNoOverflow(targetDate, convertedSalaryDate)
      }

      formattedDate = targetDate.format('YYYY-MM-DD')

      // Get the current date
      now = moment()

      // Calculate the difference in days between the target date and the current date
      difference = targetDate.diff(now, 'days')

      // Handle the case when $salaryDate is 31
      if (convertedSalaryDate === 31 && daysInMonth === 30) {
        targetDate = subtractDayFromDate(targetDate, 1)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference--
      }
      // Subtract 2 from days
      if (convertedSalaryDate === 31 && daysInMonth === 29) {
        targetDate = subtractDayFromDate(targetDate, 2)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference -= 2
      }

      // Subtract 3 from days
      if (convertedSalaryDate === 31 && daysInMonth === 28) {
        targetDate = subtractDayFromDate(targetDate, 3)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference -= 3
      }

      if (convertedSalaryDate === 30 && daysInMonth === 29) {
        targetDate = subtractDayFromDate(targetDate, 1)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference--
      }

      if (convertedSalaryDate === 30 && daysInMonth === 28) {
        targetDate = subtractDayFromDate(targetDate, 2)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference -= 2
      }

      let dayOfWeek = targetDate.format('dddd')

      // Adjust formattedDate based on the day of the week

      if (dayOfWeek === 'Sunday') {
        targetDate = subtractDayFromDate(targetDate, 2)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference -= 2
      }

      if (dayOfWeek === 'Saturday') {
        targetDate = subtractDayFromDate(targetDate, 1)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference--
      }

      holidayCount =
        await this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
          repaydate: targetDate.format('YYYY-MM-DD'),
        })

      currentDate = moment(formattedDate)
      repayDay = currentDate.format('dddd')

      while (holidayCount > 0) {
        targetDate = subtractDayFromDate(targetDate, 1)
        formattedDate = targetDate.format('YYYY-MM-DD')
        difference--

        currentDate = moment(formattedDate)
        repayDay = currentDate.format('dddd')

        holidayCount =
          await this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
            repaydate: targetDate.format('YYYY-MM-DD'),
          })

        if (repayDay === 'Sunday') {
          targetDate = subtractDayFromDate(targetDate, 2)
          formattedDate = targetDate.format('YYYY-MM-DD')
          difference -= 2
          currentDate = moment(formattedDate)
          repayDay = currentDate.format('dddd')
          holidayCount =
            await this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
              repaydate: targetDate.format('YYYY-MM-DD'),
            })
        }

        if (repayDay === 'Saturday') {
          targetDate = subtractDayFromDate(targetDate, 1)
          formattedDate = targetDate.format('YYYY-MM-DD')
          difference--
          currentDate = moment(formattedDate)
          repayDay = currentDate.format('dddd')
          holidayCount =
            await this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
              repaydate: targetDate.format('YYYY-MM-DD'),
            })
        }
      }
    }
    return {
      formattedDate: formattedDate,
      difference: difference,
    }
  }

  public async bankEntityProgress(entity_id) {
    const url = `${this.apiUrl}bank-connect/v1/entity/${entity_id}/progress/`
    const response = await this.apiCall(url, 'GET', this.headers(), {})
    const status = response.is_success ? 1 : 0

    const saveObject = {
      api_type: 'progress',
      api_supplier: 2,
      leadID: 0,
      api_response: JSON.stringify(response.apimsg),
      entity_id: entity_id,
      status: status,
    }
    // await this.leadApiLogService.create(saveObject)   to be un comment

    return response
  }

  public async isProgressDone(entity_id) {
    const result = await this.bankEntityProgress(entity_id)

    if (result.is_success && result.apimsg.progress) {
      const progressData = result.apimsg.progress

      if (progressData.length > 0) {
        const lastProgress = progressData[progressData.length - 1]
        const {
          identity_status,
          transaction_status,
          processing_status,
          fraud_status,
        } = lastProgress
        if (
          [
            identity_status,
            transaction_status,
            processing_status,
            fraud_status,
          ].includes('failed')
        ) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
    return false
  }

  async apiByPassForTesting<T>(apiName: string, type: string): Promise<T> {
    if (apiName === 'check_fraud_transaction') {
      return {} as T
    }

    const response = await apiByPassModel.find({
      where: { api_name: apiName, type, status: 1 },
      select: ['api_response'],
    })

    if (response.length === 0) {
      throw new NotFoundError(
        'No response found for the given API name and type.',
      )
    }

    const responseArray = response.map((row) => row.api_response)
    const randomApiResponse =
      responseArray[Math.floor(Math.random() * responseArray.length)]
    const output = JSON.parse(randomApiResponse)

    return output as T
  }

  async newCustomerAutoApproveFinbox(
    leadID: number,
    ammountOffered: number,
    remarkApprove: string,
  ) {
    try {
      const response = {
        status: 0,
        data: { DataCode: leadID },
      }

      const leadsService = new LeadService()

      const customerLead = await leadsService.findOne({ leadID })

      if (!customerLead) return response

      // if customerLead found
      const customer = await customerModel.findOneCustomer({
        customerID: customerLead.customerID,
      })

      if (!customer) return response

      let salaryDate = customer.salary_date ?? '5'
      let checkEmptyDate = 0

      const data = await this.repayDateFind(salaryDate)
      let formattedDate = data.formattedDate
      let difference = data.difference

      const adminfee = (ammountOffered * 10) / 100
      const gstOfAdminFee = (adminfee * 18) / 100

      const approvedLoan = await approvalModel.findOneApproval({
        customerID: customer.customerID,
        leadID,
      })

      if (!approvedLoan) {
        const data: IApproval = {
          customerID: customer.customerID,
          leadID,
          branch: BranchName.DELHI,
          loanAmtApproved: ammountOffered,
          tenure: checkEmptyDate === 0 ? difference : 0,
          roi: 1,
          repayDate: checkEmptyDate === 0 ? formattedDate : '0000-00-00',
          adminFee: adminfee,
          GstOfAdminFee: gstOfAdminFee,
          alternateMobile: String(customer.mobile),
          officialEmail: customer.email,
          cibil: 0,
          activeLoans: 0,
          status: ApprovalStatus.ApprovedProcess,
          remark: remarkApprove,
          creditedBy: 221,
          employmentType: customer.employeeType,
          createdDate: new Date(),
        }

        await approvalModel.insert(data)

        await leadsService.updateOne(
          { customerID: customer.customerID, leadID },
          { status: LeadStatus.APPROVED_PROCESS },
        )
      } else {
        if (approvedLoan.loanAmtApproved < ammountOffered) {
          await approvalModel.findOneAndUpdateApproval(
            {
              approvalID: approvedLoan.approvalID,
              customerID: customer.customerID,
              leadID,
            },
            {
              loanAmtApproved: ammountOffered,
              tenure: checkEmptyDate === 0 ? difference : 0,
              repayDate: checkEmptyDate === 0 ? formattedDate : '0000-00-00',
              adminFee: adminfee,
              GstOfAdminFee: gstOfAdminFee,
            },
          )
          await leadsService.updateOne(
            { customerID: customer.customerID, leadID },
            { status: LeadStatus.APPROVED_PROCESS },
          )
        }
      }

      // Start from Call history Logs
      await this.callHistoryLogsModel.insert({
        customerID: customer.customerID,
        leadID,
        callType: 'IVR',
        status: LeadStatus.APPROVED_PROCESS,
        appAmount: String(ammountOffered),
        noteli: LeadStatus.APPROVED_PROCESS,
        remark: remarkApprove,
        callbackTime: new Date(),
        calledBy: 221,
      })

      response.status = 1
      response.data.DataCode = leadID

      return response
    } catch (error) {
      logger.error('Error in breNewFlowRajatApi:', error)
    }
  }

  async checkAccountAggregator(customerID: number) {
    return await this.documentFinboxModel.DocumentFinboxKnex.select('entityID')
      .where('customerID', customerID)
      .whereRaw('TIMESTAMPDIFF(MONTH, verifiedDate, NOW()) <= 11')
      .where('entityID', '!=', '')
      .where('type', 'aa')
      .orderBy('documentID', 'DESC')
      .first()
  }

  public async bankConnectRecurring(
    link_id: string,
    redirect_url: string,
    logo_url: string,
    bankName: string,
    mobile: number,
  ) {
    const url = `${this.apiUrl}bank-connect/v1/session/`
    const startDate = `01/${new Date()
      .toLocaleString('default', { month: '2-digit', year: 'numeric' })
      .replace('/', '/')}`
    const endDate = `${new Date().toLocaleDateString('default', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`
    const body = {
      link_id: link_id,
      api_key: this.XAPIKEY,
      redirect_url: redirect_url,
      logo_url: logo_url,
      from_date: startDate,
      to_date: endDate,
      bank_name: bankName,
      mode: 'aa',
      mobile_number: mobile,
      aa_journey_mode: 'once_with_recurring',
      aa_recurring_tenure_month_count: 12,
      aa_recurring_frequency_unit: 'month',
      aa_recurring_frequency_value: 3,
    }
    let response = await this.apiCall(url, 'POST', this.headers(), body)

    console.log(
      '********************bankConnectRecurring response:****************************',
      response,
    )
    return response
  }
}

export default FinboxService

export const finboxService = new FinboxService()
