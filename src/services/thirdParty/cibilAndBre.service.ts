import config from '@/config/default'
import CrProfileAccountModel from '@/database/mysql/cr_profile_accounts'
import CrProfileRepaymentDataModel from '@/database/mysql/cr_profile_repayment_data'
import {
  IDtreeBreResponse,
  IOutputStatus,
} from '@/interfaces/bureauData.interface'
import {
  IAccount,
  ICreditReportData,
  IExperianReportData,
} from '@/interfaces/cibil.interface'
import {
  IAccountFormateData,
  IPaymentHistory,
} from '@/interfaces/php.interface'
import ApprovalService from '@/services/approval.service'
import { bureauDataservice } from '@/services/bureauData.service'
import LeadApiLogServivce from '@/services/lead_api_log.service'
import FinboxService, { finboxService } from '@/services/thirdParty/finbox.service'
import { getKnexInstance } from '@/utils/mysql'
import axios from 'axios'
import { format } from 'date-fns'
const leadApiLogService = new LeadApiLogServivce()
// const finboxService = new FinboxService()
const crProfileAccountModel = new CrProfileAccountModel()
const crProfileRepaymentModel = new CrProfileRepaymentDataModel()
//const approvalService = new ApprovalService()

export async function autoApproveNewCustomerUsingCibilAndBRE(
  leadID: number,
  mobile: string,
  id_number: string,
  pincode: string,
  state: string,
  name: string,
  address: string,
): Promise<IOutputStatus> {
  const output: IOutputStatus = {
    status: '0',
    message: '',
    score: 0,
  }
  address = trimAddressCibil(address)

  const approvalService = new ApprovalService()
  const access_token = 'null'
  const api_url = `${config.assetUrl}` + 'ramfincorp_api/get_cibil'
  const response = await axios.post(
    api_url,
    {
      access_token1: access_token,
      mobile_no: mobile,
      id_number: id_number,
      pincode: pincode,
      state: state,
      name: name,
      address: address,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const responseData = response?.data
  console.log('responseData', responseData)

  if (
    (responseData.errorcode === '1' &&
      responseData.errorMsg === 'Successfully') ||
    (responseData.status === '1' &&
      responseData.message === 'Successfully Cibil Fetch')
  ) {
    let score = 0

    let checkCibilRecord = await leadApiLogService.findOne(
      {
        api_supplier: 3,
        api_type: 'consumer-cir-cv',
        pancard: id_number,
        status: 1,
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )
    if (checkCibilRecord) {
      if (checkCibilRecord) {
        const jsonData = checkCibilRecord.api_response
        const cibilData = JSON.parse(jsonData)
        console.log('cibildata', cibilData)
        score = cibilData.apimsg.consumerCreditData[0]?.scores[0]?.score ?? 0
        console.log('score', score)
        if (score >= 300 && score <= 600) {
          return { status: '0', message: 'Cibil Rejected', score }
        }
      }
    }
    if (score >= 700) {
      const countgap = await bureauDataservice.findSwitchPercentageUser()
      console.log('countgap', countgap, config.bureau_api_switch_percentage)
      if (countgap >= parseInt(config.bureau_api_switch_percentage)) {
        let output = await bureauDataservice.bureauV1(leadID)
        console.log('bureauV1', output)
        if (!output) {
          const output = await rajatOldApiWithBre(leadID, mobile, id_number)
          console.log('rajatOldApi with bre', output)
          return output
        } else {
          if (output.Decision === 'Approve' && output.offerAmount > 999) {
            const remarkApprove = 'Approved from New BRE V1.'
            const amount_offered = output.offerAmount
            const finboxverify =
              await finboxService.newCustomerAutoApproveFinbox(
                leadID,
                amount_offered,
                remarkApprove,
              )
            console.log('finboxverify', finboxverify)
            return { status: '1', message: 'Approved' }
          } else if (output.Decision === 'Proceed to Bank') {
            return { status: '1', message: 'Proceed to Bank' }
          } else if (output.Decision === 'Reject') {
            const rejectremark = 'Reject from BRE V1'
            await approvalService.rejectProcessCustomer(leadID, rejectremark)
            return { status: '1', message: 'Reject' }
          } else {
            const output = await rajatOldApiWithBre(leadID, mobile, id_number)
            return output
          }
        }
      } else {
        console.log('entry in rajat old apiwith bre')
        const output = await rajatOldApiWithBre(leadID, mobile, id_number)
        return output
      }
    } else {
      const output = await rajatOldApiWithBre(leadID, mobile, id_number)
      return output
    }
  } else {
    if (responseData.errorcode && responseData.errorMsg) {
      return { status: responseData.errorcode, message: responseData.errorMsg }
    }
    if (responseData.status && responseData.message) {
      return { status: responseData.status, message: responseData.message }
    }
  }
}

export function trimAddressCibil(fullAddress: string): string {
  const maxCharacters = 40
  let address: string

  if (fullAddress.length > maxCharacters) {
    let trimmedAddress = fullAddress.substring(0, maxCharacters)
    const lastSpacePos = trimmedAddress.lastIndexOf(' ')

    if (lastSpacePos !== -1) {
      trimmedAddress = trimmedAddress.substring(0, lastSpacePos)
    }

    address = trimmedAddress
  } else {
    address = fullAddress
  }

  return address
}

export async function rajatOldApiWithBre(
  leadID: number,
  mobile: string,
  id_number: string,
) {
  let score: number = 0
  let checkCibilRecord = await leadApiLogService.findOne(
    {
      api_supplier: 3,
      api_type: 'consumer-cir-cv',
      pancard: id_number,
      status: 1,
    },
    ['api_response'],
    [{ column: 'id', order: 'desc' }],
  )
  if (checkCibilRecord) {
    if (checkCibilRecord) {
      const jsonData = checkCibilRecord.api_response
      const cibilData = JSON.parse(jsonData)

      score = +(cibilData.apimsg.consumerCreditData[0]?.scores[0]?.score ?? 0)
      if (score >= 300 && score <= 600) {
        return { status: '0', message: 'Cibil Rejected', score }
      }
    }
  }
  if (score >= 601) {
    try {
      const api_url = config.assetUrl + 'ramfincorp_api/get_bureau'
      const response = await axios.post(
        api_url,
        {
          access_token1: 'sdfsfd',
          mobile_no: mobile,
          leadID: leadID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      let responseArr = response?.data
      console.log('responseArrRajatOld', responseArr)

      if (config.nodeEnv !== 'production') {
        const apiName = 'rajat_amount'
        const type = 'bureau'
        responseArr = await finboxService.apiByPassForTesting<{
          status: string
          ammount_offered: number
        }>(apiName, type)
      }

      if (responseArr.status == '1' && responseArr.amount_offered > 999) {
        const remarkApprove = 'Approved from BRE.'
        const amountOffered = responseArr.amount_offered
        await finboxService.newCustomerAutoApproveFinbox(
          leadID,
          amountOffered,
          remarkApprove,
        )
        return { status: '1', message: 'BRE Accepted' }
      } else {
        const dtree = await getDtreeBre(mobile, leadID, responseArr)
        console.log('dtree', dtree)
        if (dtree.status === '1') {
          return { status: '1', message: 'Dtree Bre Accepted' }
        } else if (dtree.status === '0') {
          return {
            status: '0',
            message: 'Dtree Bre Rejected (stop now)',
            reason: dtree.rejectReason,
          }
        } else {
          return { status: '0', message: 'Dtree Bre Accepted' }
        }
      }
    } catch (error) {
      console.error('Error in API request:', error)
      return { status: '0', message: 'BRE Rejected' }
    }
  } else {
    return { status: '0', message: 'Score is less than 601' }
  }
}

async function getDtreeBre(
  mobile: string,
  leadID: number,
  breresponseArr: any,
): Promise<IDtreeBreResponse> {
  console.log('hi111111')
  const api_url = 'http://13.127.7.146:5000/dtree_bre'
  console.log(mobile)
  try {
    const response = await axios.post(
      api_url,
      {
        mobile_no: mobile,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    console.log('hi222')
    let status = '0'
    let apiStatus = '0'
    let message = ''
    let rejectReason = ''
    let responseArr: any = []
    console.log('getDtreeBre', response.data)
    if (response.status === 200) {
      apiStatus = '1'
      responseArr = response.data

      if (
        responseArr.results &&
        Array.isArray(responseArr.results) &&
        responseArr.results.length > 0
      ) {
        const result = responseArr.results[0]

        if (
          result.inputs?.active_loans_lt_15000_max_dpd_gt_30 === 0 &&
          result.inputs?.score > 700 &&
          result.inputs?.max_loan_amount_serviced_last_3_months > 17000 &&
          result.inputs?.max_loan_amount_serviced_last_6_months > 40000 &&
          result.inputs?.overdue_to_balance_ratio < 0.0001
        ) {
          const amount_offered = await bureauDataservice.bureau(leadID)

          if (amount_offered > 999) {
            const remarkApprove = 'Accepted from BRE.'
            await finboxService.newCustomerAutoApproveFinbox(
              leadID,
              amount_offered,
              remarkApprove,
            )
            status = '1'
            message = 'Success'
          } else {
            status = '0'
            rejectReason = await DtreeRejectedReason(result.inputs)
            message = `Success to retrieve DtreeBre information for mobile: ${mobile}`
          }
        } else if (result.status === 'Reject') {
          status = '0'
          rejectReason = await DtreeRejectedReason(result.inputs)
          message = `Success to retrieve DtreeBre information for mobile: ${mobile}`
        } else {
          message = `Success to retrieve DtreeBre information for mobile: ${mobile}`
        }
      } else {
        message = `Results not found in DtreeBre response for mobile: ${mobile}`
      }
    } else {
      responseArr = response.data
      message = `Failed to retrieve DtreeBre information for mobile: ${mobile}`
    }
    let saveObject = {
      api_supplier: 9,
      api_type: 'dtree_bre',
      api_response: JSON.stringify(responseArr),
      status: Number(apiStatus),
      mobile_no: mobile,
      api_endpoint_url: api_url,
      pancard: '',
    }
    await leadApiLogService.create(saveObject)
    return { status, message, rejectReason }
  } catch (error) {
    console.error('Error in API request:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
    }
    return {
      status: '0',
      message: `Failed to retrieve DtreeBre information for mobile: ${mobile}`,
    }
  }
}
async function DtreeRejectedReason(data: Record<string, any>): Promise<string> {
  if (
    data['active_loans_lt_15000_max_dpd_gt_30'] !== undefined &&
    data['active_loans_lt_15000_max_dpd_gt_30'] > 3
  ) {
    return 'active_loans_lt_15000_max_dpd_gt_30'
  }
  if (
    data['max_loan_amount_serviced_last_6_months'] !== undefined &&
    data['max_loan_amount_serviced_last_6_months'] < 10000
  ) {
    return 'max_loan_amount_serviced_last_6_months'
  }
  if (
    data['overdue_to_balance_ratio'] !== undefined &&
    data['overdue_to_balance_ratio'] > 0.3
  ) {
    return 'overdue_to_balance_ratio'
  }
  if (data['score'] !== undefined && data['score'] < 650) {
    return 'score'
  }
  if (
    data['max_loan_amount_serviced_last_3_months'] !== undefined &&
    data['max_loan_amount_serviced_last_3_months'] < 250
  ) {
    return 'max_loan_amount_serviced_last_3_months'
  }
  return undefined
}

async function getCreditReportData(
  reportId: number,
): Promise<ICreditReportData[]> {
  let db = getKnexInstance()
  await db.raw(
    "SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))",
  )
  const result = await db
    .select(
      db.raw(`
        round(ifnull(
          (sum(CASE WHEN closing_date is null and account_type=10 then loan_amount else 0 end) / 
          sum(CASE WHEN closing_date is null and account_type=10 then credit_limit else 0 end)) * 100, 0), 2) 
        as utilization_percent,
        sum(CASE WHEN closing_date is null and account_type=10 then credit_limit else 0 end) as tot_credit_limit,
        DATEDIFF(now(), MIN(opening_date)) as credit_age,
        sum(CASE WHEN closing_date is null then 1 else 0 end) as active_accounts,
        sum(CASE WHEN closing_date is not null then 1 else 0 end) as closed_accounts,
        (select count(*) from cr_profile_enquiry where report_id=cr_profile_accounts.report_id) as tot_enquiry,
        (select count(*) from cr_profile_enquiry where report_id=cr_profile_accounts.report_id and account_type=10) as credit_card_enquiry,
        (select count(*) from cr_profile_enquiry where report_id=cr_profile_accounts.report_id and account_type<>10) as loan_enquiry,
        (select round(ifnull(sum(CASE WHEN repayment_status='000' or repayment_status='XXX' THEN 1 ELSE 0 END) / count(*), 1) * 100, 2) 
          from cr_profile_repayment_data 
          where report_id=cr_profile_accounts.report_id) as payment_percentage,
        (select count(*) from cr_profile_repayment_data where report_id=cr_profile_accounts.report_id and 
          (repayment_status <> '000' and repayment_status <> 'XXX')) as delay_payment_count,
        (select score from credit_reports where id=cr_profile_accounts.report_id  and cr_provider = 1) as score,
        (select group_concat(distinct concat(DATE_FORMAT(created_at,'%b'),'-',score)) 
          from credit_reports where customerID=cr_profile_accounts.customerID and score is not null  and cr_provider = 1) as monthwise_score,
        (select DATE_FORMAT(max(created_at), '%d %b %Y') 
          from credit_reports where customerID=cr_profile_accounts.customerID and score is not null  and cr_provider = 1) as last_pull_date
      `),
    )
    .from('cr_profile_accounts')
    .where('report_id', reportId)

  return result
}

const determineStatusAndColor = (score: number) => {
  let status = ''
  let color = ''

  if (score >= 780) {
    status = 'Excellent'
    color = '#0EBB53' // Green
  } else if (score >= 706 && score <= 779) {
    status = 'Good'
    color = '#FFCF54' // Yellow
  } else if (score >= 631 && score <= 705) {
    status = 'Average'
    color = '#5BE893' // Light Green
  } else if (score >= 300 && score <= 630) {
    status = 'Poor'
    color = '#F33C3C' // Red
  } else {
    status = 'Unknown'
    color = '#000000'
  }

  return { status, color }
}
const getStatusFromPercentage = (percentage: number) => {
  const statusRanges = [
    { min: 99, max: 100, status: 'Excellent' },
    { min: 95, max: 98, status: 'Good' },
    { min: 85, max: 94, status: 'Poor' },
    { min: 75, max: 84, status: 'Bad' },
    { min: 0, max: 74, status: 'Very Bad' },
  ]

  const status = statusRanges.find(
    (range) => percentage >= range.min && percentage <= range.max,
  )

  return status ? status.status : 'Unknown'
}
const getCreditUsageStatus = (utilizationPercent: number): string => {
  const usageRanges = [
    { min: 0, max: 10, status: 'Excellent' },
    { min: 11, max: 30, status: 'Good' },
    { min: 31, max: 50, status: 'Poor' },
    { min: 51, max: 70, status: 'Bad' },
    { min: 71, max: 100, status: 'Very Bad' },
  ]

  const status = usageRanges.find(
    (range) =>
      utilizationPercent >= range.min && utilizationPercent <= range.max,
  )

  return status ? status.status : 'Unknown'
}
const getCreditAgeStatus = (age: number): string => {
  const ageRanges = [
    { min: 11, max: Infinity, status: 'Excellent' }, // > 10 years
    { min: 7, max: 10, status: 'Good' }, // 7 - 10 years
    { min: 4, max: 6, status: 'Poor' }, // 4 - 6 years
    { min: 2, max: 3, status: 'Bad' }, // 2 - 3 years
    { min: 0, max: 1, status: 'Very Bad' }, // < 2 years
  ]

  const status = ageRanges.find((range) => age >= range.min && age <= range.max)

  return status ? status.status : 'Unknown' // Return the found status or 'Unknown' if not found
}

const getAccountStatus = (activeAccounts: number): string => {
  const accountRanges = [
    { min: 11, max: Infinity, status: 'Excellent' }, // 11+ accounts
    { min: 6, max: 10, status: 'Good' }, // 6 - 10 accounts
    { min: 3, max: 5, status: 'Poor' }, // 3 - 5 accounts
    { min: 1, max: 2, status: 'Bad' }, // 1 - 2 accounts
    { min: 0, max: 0, status: 'Very Bad' }, // 0 accounts
  ]

  const status = accountRanges.find(
    (range) => activeAccounts >= range.min && activeAccounts <= range.max,
  )

  return status ? status.status : 'Unknown' // Return the found status or 'Unknown' if not found
}
const getInquiryStatus = (totalInquiries: number): string => {
  const inquiryRanges = [
    { min: 0, max: 2, status: 'Excellent' }, // 0 - 2 inquiries
    { min: 3, max: 5, status: 'Good' }, // 3 - 5 inquiries
    { min: 6, max: 8, status: 'Poor' }, // 6 - 8 inquiries
    { min: 9, max: 11, status: 'Bad' }, // 9 - 11 inquiries
    { min: 12, max: Infinity, status: 'Very Bad' }, // > 11 inquiries
  ]

  const status = inquiryRanges.find(
    (range) => totalInquiries >= range.min && totalInquiries <= range.max,
  )

  return status ? status.status : 'Unknown' // Return the found status or 'Unknown' if not found
}

export async function makeCreditReport(
  reportId: number,
  name: string,
): Promise<IExperianReportData> {
  let reportData = await getCreditReportData(reportId)
  let age = Math.floor(reportData[0].credit_age / 365)
  let remainingDays = reportData[0].credit_age % 365
  let ageInMonths = Math.floor(remainingDays / 30)

  let ageFormatted = `${age}y ${ageInMonths}m`
  let monthwiseScore = reportData[0].monthwise_score
  let monthlyScores = monthwiseScore?.split(',').map((item: string) => {
    let [month, score] = item.split('-')
    return {
      month: month,
      score: parseInt(score, 10),
    }
  })
  let usedLimit = Math.round(
    (parseInt(reportData[0].tot_credit_limit) *
      parseInt(reportData[0].utilization_percent)) /
      100,
  )
  const score: number = reportData[0].score
  const activeAccounts = parseInt(reportData[0].active_accounts, 10)
  const { status, color } = determineStatusAndColor(score)
  const paymentStatus = getStatusFromPercentage(
    Math.round(Number(reportData[0]?.payment_percentage)),
  )
  const creditStatus = getCreditUsageStatus(
    Math.round(Number(reportData[0].utilization_percent)),
  )
  const ageStatus = getCreditAgeStatus(age)
  const accountStatus = getAccountStatus(activeAccounts)
  const enquiryStatus = getInquiryStatus(
    parseInt(reportData[0].tot_credit_limit),
  )
  let experianReportData = {
    experian: {
      whatChanged: [
        {
          id: '1',
          icon: 'P',
          name: 'Payment',
          value: `${parseFloat(reportData[0].payment_percentage).toFixed(0)}%`,
          impact: 'High Impact',
          ontime: true,
          remark: 'Timely Payment',
          impacts: {
            status: paymentStatus, //d arvind sir give me reference for this
            paymentText: 'Payments on time',
            percentText: 'Late Payments(%)',
            percentOnTime:Number(reportData[0].delay_payment_count), //d
            latePaymentsCount: reportData[0].payment_percentage, //d
          },
          message: 'All payments are on time', //d
        },
        {
          id: '2',
          icon: 'L',
          name: 'Limit',
          value: `${parseFloat(reportData[0].utilization_percent).toFixed(0)}%`,
          impact: 'High Impact',
          ontime: false,
          remark: 'credit limit used',
          impacts: {
            status: creditStatus, //d
            paymentText: 'Limit Utilisation',
            percentText: 'Total Credit Limit',
            percentOnTime: parseInt(reportData[0].tot_credit_limit), //discuss
            latePaymentsCount: reportData[0].utilization_percent, //discuss
            usedLimit: usedLimit,
            //latePaymentsCount: 5
          },
          message: 'All payments are not on time',
        },
        {
          id: '3',
          icon: 'A',
          name: 'Age',
          value: ageFormatted,
          impact: 'Medium Impact',
          ontime: false,
          remark: 'Age of Accounts',
          impacts: {
            status: ageStatus,
            paymentText: 'Age of Accounts',
            percentText: 'Active Accounts',
            percentOnTime: parseInt(reportData[0].active_accounts), //discuss
            latePaymentsCount: ageFormatted,
            // percentOnTime: 80,
            //latePaymentsCount: 5
          },
          message: 'All payments are not on time',
        },
        {
          id: '4',
          icon: 'A',
          name: 'Accounts',
          value: `${reportData[0].active_accounts} Active`,
          impact: 'Low Impact',
          ontime: true,
          remark: 'Active Accounts',
          impacts: {
            status: accountStatus,
            paymentText: 'Closed Accounts',
            percentText: 'Active Accounts',
            percentOnTime: parseInt(reportData[0].active_accounts),
            latePaymentsCount: reportData[0].closed_accounts,
            //percentOnTime: 80,
            //latePaymentsCount: 5
          },
          message: 'All payments are on time',
        },
        {
          id: '5',
          icon: 'E',
          name: 'Enquiries',
          value: reportData[0].tot_enquiry,
          impact: 'Low Impact',
          ontime: true,
          remark: 'Total Enquiries',
          impacts: {
            status: enquiryStatus,
            paymentText: 'For Credit Cards',
            percentText: 'Enquiries for Loans',
            percentOnTime: reportData[0].loan_enquiry,
            latePaymentsCount: String(reportData[0].credit_card_enquiry),
            // percentOnTime: 80,
            //latePaymentsCount: 5
          },
          message: 'All payments are on time',
        },
      ],

      //
      currentScore: {
        //color: "#4AD170",//discuss how to decide
        customerName: name,
        color: color,
        score: reportData[0].score,
        status: status, // discuss , arvind sir give me logic for this to decide status
        lastPullDate: reportData[0].last_pull_date,
      },
      monthlyScores: monthlyScores,
    },
  }
  // store data everytime or update means in each pull of 8th of every months
  return experianReportData
}

export async function getAccountData(
  reportId: number,
): Promise<Record<any, any>> {
  let accountDetails = crProfileAccountModel.findAll(
    { report_id: reportId },
    [
      'id',
      'customerID',
      'account_no',
      'closing_date',
      'opening_date',
      'last_payment',
      'bank_name',
      'loan_amount',
      'credit_limit',
      'current_balance',
      'account_type',
      'account_status',
      'on_time_payments',
      'due_date_payments',
    ],
    [{ column: 'id', order: 'desc' }],
  )
  return accountDetails
}
const getBankLogo = async (bankName: string): Promise<string | null> => {
  let db = getKnexInstance()
  const result = await db.raw(
    'SELECT pngIcon FROM bankList WHERE LOWER(bankName) = LOWER(?)',
    [bankName?.trim()],
  )
  if (result && result[0][0]?.pngIcon) {
    return result[0][0]?.pngIcon
  } else {
    return null
  }
}

export async function makeAccountDetails(
  reportId: number,
): Promise<Record<string, any>> {
  let accountData = await getAccountData(reportId)
  //console.log("accountData",accountData)
  // const transformedData = accountData.map(
  //   (account: IAccount, index: number) => {
  //     return {
  //       id: (index + 1).toString(),
  //       icon: 'P',
  //       name: account.bank_name,
  //       remark: 'Timely Payment',
  //       issueOn: account.opening_date.toISOString().split('T')[0],
  //       payment: `${account.on_time_payments}/${
  //         account.on_time_payments + account.due_date_payments
  //       }`,
  //       bankUtil: account.account_type === 10 ? 'Credit Card' : 'Loan',
  //       isActive: account.account_status === 2 ? false : true,
  //       statusText: 'Status',
  //       statusValue: account.account_status === 2 ? 'In-Active' : 'Active',
  //       isExpandable: true,
  //       bankUtilValue: account.account_no,
  //     }
  //   },
  // )
  const transformedData = await Promise.all(
    accountData.map(async (account: IAccount, index: number) => {
      return {
        id: (index + 1).toString(),
        icon:
          (await getBankLogo(account.bank_name)) ??
          config.defaultBankLogoExperian,
        name: account.bank_name,
        remark: 'Timely Payment',
        issueOn: account.opening_date.toISOString().split('T')[0],
        payment: `${account.on_time_payments}/${
          account.on_time_payments + account.due_date_payments
        }`,
        bankUtil: account.account_type === 10 ? 'Credit Card' : 'Loan',
        isActive: account.account_status === 2 ? false : true,
        statusText: 'Status',
        statusValue: account.account_status === 2 ? 'In-Active' : 'Active',
        isExpandable: true,
        bankUtilValue: account.account_no,
      }
    }),
  )
  const usedPercentages = accountData.map((account: IAccount) => {
    if (account.credit_limit > 0) {
      return (
        ((account.credit_limit - account.current_balance) /
          account.credit_limit) *
        100
      ).toFixed(0)
    } else {
      return '0'
    }
  })
  // const transformedDataForCreditUsage = accountData.map(
  //   (account: IAccount, index: number) => {
  //     return {
  //       id: (index + 1).toString(),
  //       icon: 'P',
  //       name: account.bank_name,
  //       remark: 'Credit Usage',
  //       issueOn: account.opening_date.toISOString().split('T')[0],
  //       payment: `${usedPercentages[index]}%`,
  //       bankUtil: account.account_type === 10 ? 'Credit Card' : 'Loan',
  //       isActive: account.account_status === 2 ? false : true,
  //       statusText: 'Status',
  //       statusValue: account.account_status === 2 ? 'In-Active' : 'Active',
  //       isExpandable: true,
  //       bankUtilValue: account.account_no,
  //     }
  //   },
  // )
  const transformedDataForCreditUsage = await Promise.all(
    accountData.map(async (account: IAccount, index: number) => {
      return {
        id: (index + 1).toString(),
        icon:
          (await getBankLogo(account.bank_name)) ??
          config.defaultBankLogoExperian,
        name: account.bank_name,
        remark: 'Credit Usage',
        issueOn: account.opening_date.toISOString().split('T')[0],
        payment: `${usedPercentages[index]}%`,
        bankUtil: account.account_type === 10 ? 'Credit Card' : 'Loan',
        isActive: account.account_status === 2 ? false : true,
        statusText: 'Status',
        statusValue: account.account_status === 2 ? 'In-Active' : 'Active',
        isExpandable: true,
        bankUtilValue: account.account_no,
      }
    }),
  )

  // console.log('usedPercentage', usedPercentages)
  const finalData = {
    '1': {
      accounts: transformedData,
    },
    '2': {
      accounts: transformedDataForCreditUsage,
    },
    '3': {
      accounts: transformedData,
    },
    '4': {
      accounts: transformedData,
    },
    '5': {
      accounts: transformedData,
    },
  }

  return finalData
}

export async function getRepaymentData(
  reportId: number,
): Promise<IPaymentHistory[]> {
  let paymentHistory = await crProfileRepaymentModel.findAll(
    { report_id: reportId },
    [
      'profile_account_id',
      'repayment_status',
      'repayment_date',
      'account_type',
      'customerID',
    ],
    [{ column: 'id', order: 'desc' }],
  )
  paymentHistory = paymentHistory.map((payment) => {
    payment.repayment_date = new Date(
      format(new Date(payment.repayment_date), 'yyyy-MM-dd'),
    )
    return payment
  })
  return paymentHistory
}
export async function getDataForRepayment(
  reportId: number,
): Promise<IAccountFormateData[]> {
  let accountDetails = await crProfileAccountModel.findAll(
    { report_id: reportId },
    [
      'id',
      'loan_amount',
      'credit_limit',
      'current_balance',
      'account_type',
      'account_status',
    ],
    [{ column: 'id', order: 'desc' }],
  )
  return accountDetails
}
export async function generateDataForViewImpact(
  dateFormateData: IAccountFormateData[],
  paymentHistory: IPaymentHistory[],
): Promise<Record<string, any>> {
  const result: Record<string, any> = {}

  dateFormateData.forEach((data, index) => {
    const paymentHistoryForAccount = paymentHistory.filter(
      (payment) => payment.profile_account_id === data.id,
    )

    const paymentHistoryByYear: Record<string, (boolean | null)[]> = {}

    paymentHistoryForAccount.forEach((payment) => {
      const year = payment.repayment_date.getFullYear().toString()
      const month = payment.repayment_date.getMonth()
      // verify this data
      if (!paymentHistoryByYear[year]) {
        paymentHistoryByYear[year] = new Array(12).fill(null)
      }

      paymentHistoryByYear[year][month] =
        payment.repayment_status === '000' || payment.repayment_status === 'XXX'
          ? true
          : false
    })
    const usedLimit = data.credit_limit
      ? data.credit_limit - data.current_balance
      : 0
    const usedPercentage = data.credit_limit
      ? ((usedLimit / data.credit_limit) * 100).toFixed(0)
      : '0'
    result[(index + 1).toString()] = {
      details: {
        data: [
          { key: 'Used Percentage', value: `${usedPercentage}%` }, // need to improve here
          {
            key: 'Limit Used',
            value: `₹${usedLimit?.toLocaleString()}`, // need to improve here also
          },
          {
            key: 'Credit Limit',
            value: data.credit_limit
              ? `₹${data?.credit_limit?.toLocaleString()}`
              : '0',
          },
        ],
        heading: 'Credit Utilisation',
      },
      isCredit: data.account_type === 10,
      paymentHistory: paymentHistoryByYear,
    }
  })

  return result
}
