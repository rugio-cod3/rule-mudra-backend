import momentTz from 'moment-timezone'
import ApprovalModel from '../../../../database/mysql/approval'
import LeadModel from '../../../../database/mysql/leads'
import RazorpayMandateModel from '../../../../database/mysql/razorpay_mandate'
import LeadApiLogService from '../../../../services/lead_api_log.service'
import LoanService from '../../../../services/loan.service'
import AppVideoModel from '../database/mysql/appVideo'
import PennyDropModel from '../database/mysql/pennyDrop'

import BlackListCustomerModel from '../database/mysql/blackListCustomer'
import { ApiSupplierType, LeadLogApiType } from '../enums/common.enum'
import {
  IAutoDisbursalChecks,
  IDecentroEaadharResponse,
  ISurePassVerifyAadharResponse,
} from '../interfaces/autoDisbursalChecks.interface'

import { leadsApiLogModel } from '../database/mysql/leadApiLogs'
import { CollectionStatus } from '../enums/collectionStatus.enum'
import { NameMatchType } from '../enums/finbox.enum'
import { LeadStatus, LeadType } from '../enums/leadStatus.enum'
import { PennyStatus } from '../enums/pennyDrop.enum'
import FinboxService from '../services/thirdParty/finbox.service'

const leadApiLogService = new LeadApiLogService()
const findBoxService = new FinboxService()
//const leadsApiLogModel = new LeadApiLogModel()
const approvalModel = new ApprovalModel()
const appVideoModel = new AppVideoModel()
const leadModel = new LeadModel()
const razorpayMandateModel = new RazorpayMandateModel()
const pennyDropModel = new PennyDropModel()
const loanService = new LoanService()

const blackListCustomerModel = new BlackListCustomerModel()
async function checkPanAadharLastFourDigits(
  customerID: number,
  mobile: number,
  leadID: number,
  aadharNo: string,
  pancard: string,
) {
  const panData = await leadApiLogService.findPanComprehensiveResponse(pancard, String(mobile))

  const { dob, masked_aadhaar } = panData

  if (aadharNo) {
    const aadharData = await leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
        api_supplier: ApiSupplierType.SUREPASS,
        mobile_no: String(mobile),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )

    if (aadharData) {
      const aadharResp = <ISurePassVerifyAadharResponse['data']>(
        JSON.parse(aadharData.api_response).data
      )

      const { full_name: aadharFullName, dob: aadharDob, aadhaar_number: aadharNo } = aadharResp

      let panAadhar = masked_aadhaar.slice(-4)
      let lastFourDigitsAadhar = aadharNo.slice(-4)

      const fourDigitMatch = await findBoxService.checkNamePercentage(
        {
          customerID,
          leadId: leadID,
          customerMobileNo: String(mobile),
          firstName: panAadhar,
          secondName: lastFourDigitsAadhar,
          type: NameMatchType.KFS,
        },
        false,
      )

      if (fourDigitMatch.percentageResult !== 100) return false

      const dobMatch = await findBoxService.checkNamePercentage(
        {
          customerID,
          leadId: leadID,
          customerMobileNo: String(mobile),
          firstName: dob,
          secondName: aadharDob,
          type: NameMatchType.KFS,
        },
        false,
      )

      if (dobMatch.percentageResult !== 100) return false

      return true
    } else {
      const digiAadhar = await leadsApiLogModel.findOneLeadsApiLog(
        {
          status: 1,
          api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
          api_supplier: ApiSupplierType.DECENTRO,
          mobile_no: String(mobile),
        },
        ['api_response'],
        [{ column: 'id', order: 'desc' }],
      )

      const aadarResponse = <IDecentroEaadharResponse['data']>(
        JSON.parse(digiAadhar.api_response).data
      )

      const {
        proofOfIdentity: { dob: aadharDob, name: aadharFullName },
        aadhaarUid: aadharNo,
      } = aadarResponse

      let panAadhar = masked_aadhaar.slice(-4)
      let lastFourDigitsAadhar = aadharNo.slice(-4)

      const aadharDobFormatted = momentTz(aadharDob, 'DD-MM-YYYY').format('YYYY-MM-DD')

      const fourDigitMatch = await findBoxService.checkNamePercentage(
        {
          customerID,
          leadId: leadID,
          customerMobileNo: String(mobile),
          firstName: panAadhar,
          secondName: lastFourDigitsAadhar,
          type: NameMatchType.KFS,
        },
        false,
      )

      if (fourDigitMatch.percentageResult !== 100) return false

      const dobMatch = await findBoxService.checkNamePercentage(
        {
          customerID,
          leadId: leadID,
          customerMobileNo: String(mobile),
          firstName: dob,
          secondName: aadharDobFormatted,
          type: NameMatchType.KFS,
        },
        false,
      )

      if (dobMatch.percentageResult !== 100) return false

      return true
    }
  } else {
    const digiAadhar = await leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
        api_supplier: ApiSupplierType.DECENTRO,
        mobile_no: String(mobile),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )
    if (!digiAadhar) return false

    const aadarResponse = <IDecentroEaadharResponse['data']>JSON.parse(digiAadhar.api_response).data

    const {
      proofOfIdentity: { dob: aadharDob, name: aadharFullName },
      aadhaarUid: aadharNoDigi,
    } = aadarResponse

    let panAadhar = masked_aadhaar.slice(-4)
    let lastFourDigitsAadhar = aadharNo.slice(-4)

    const aadharDobFormatted = momentTz(aadharDob, 'DD-MM-YYYY').format('YYYY-MM-DD')

    const fourDigitMatch = await findBoxService.checkNamePercentage(
      {
        customerID,
        leadId: leadID,
        customerMobileNo: String(mobile),
        firstName: panAadhar,
        secondName: lastFourDigitsAadhar,
        type: NameMatchType.KFS,
      },
      false,
    )

    if (fourDigitMatch.percentageResult !== 100) return false

    const dobMatch = await findBoxService.checkNamePercentage(
      {
        customerID,
        leadId: leadID,
        customerMobileNo: String(mobile),
        firstName: dob,
        secondName: aadharDobFormatted,
        type: NameMatchType.KFS,
      },
      false,
    )

    if (dobMatch.percentageResult !== 100) return false

    return true
  }
}

async function selfieCheck(mobile: string) {
  const data = await leadsApiLogModel.findOneLeadsApiLog(
    {
      mobile_no: mobile,
      api_supplier: ApiSupplierType.FACE_MATCH,
      status: 1,
      api_type: LeadLogApiType.FACE_MATCH,
    },
    ['api_response'],
    [{ column: 'id', order: 'desc' }],
  )

  if (data && data.api_response) {
    const decodeData = JSON.parse(data.api_response)
    if (decodeData.status === 'success' && decodeData.statusCode == '200') {
      if (decodeData.result.person_image_correctly_identified === true) {
        return true
      }
    }
  }

  return false
}
async function checkTenure(customerID: number, leadID: number) {
  const approval = await approvalModel.findOneApproval({ customerID, leadID }, ['repayDate'])
  if (approval) {
    const currentDate = momentTz().tz('Asia/Kolkata')
    const repayDate = momentTz(approval.repayDate)

    const dateDiff = currentDate.diff(repayDate, 'days')

    if (dateDiff > 5 && dateDiff <= 40) {
      return true
    }
  }
  return false
}

async function checkSalaryGapAndRepayDate(customerID: number, leadID: number, salaryDate: number) {
  const approval = await approvalModel.findOneApproval({ customerID, leadID }, ['repayDate'])

  if (approval) {
    const repayDate = momentTz(approval.repayDate)

    const repayDateDay = repayDate.day()

    const daysDiff = salaryDate - repayDateDay

    if (daysDiff > 5) {
      let currentDate = momentTz().tz('Asia/Kolkata')
      currentDate = momentTz().add(1, 'month')

      currentDate = momentTz().set({
        year: currentDate.year(),
        month: currentDate.month(),
        date: salaryDate,
      })

      const diff = currentDate.day() - repayDateDay

      if (diff > 5) {
        return false
      }
    }

    return true
  }

  return true
}

async function checkSelfieVideo(customerID: number) {
  const video = await appVideoModel.findOne({
    where: { customerID, rejected_status: '0' },
    select: ['vid'],
  })

  if (video) {
    return true
  }

  return true // always true
}

async function checkPennyDropStatusNameMatch(
  customerID: number,
  emdID: number,
  pancard: string,
  mobile: string,
  leadID: number,
  aadharNo: string,
) {
  const emandDetails = await razorpayMandateModel.findOne({
    where: { customerID: customerID, id: emdID },
    select: ['accountNo'],
  })

  if (!emandDetails) {
    return false
  }

  return await this.pennyDropStatusNameMatch(
    +customerID,
    emandDetails.accountNo,
    pancard,
    mobile,
    leadID,
    aadharNo,
  )
}

async function checkAddressEmployementReference(customerID: number, leadID: number) {
  const lead = await leadModel.LeadsKnex.join('approval as a', 'a.leadID', 'leads.leadID')
    .where('leads.customerID', customerID)
    .where('leads.leadID', leadID)
    .select('leads.fbLeads', 'a.loanAmtApproved')
    .first()

  if (
    (lead.fbLeads === LeadType.NEW_CASE || lead.fbLeads === LeadType.EXISTING_CASE) &&
    lead.loanAmtApproved <= 26000
  ) {
    return true
  }

  const referenceCount = await this.referenceModel.count({
    where: { customerID },
  })

  if (referenceCount > 0) {
    return true
  }

  return false
}

async function checkLeadStatus(customerID: number, mobile: number) {
  const [lead, blackListCustomer] = await Promise.all([
    leadModel.findOne({
      where: { customerID },
      whereIn: [
        {
          column: 'status',
          value: [
            LeadStatus.DISBURSED,
            LeadStatus.PART_PAYMENT,
            LeadStatus.SETTLEMENT,
            LeadStatus.BLACK_LISTED,
          ],
        },
      ],
      select: ['leadID'],
    }),
    blackListCustomerModel.findOne({
      where: { mobile },
      select: ['id'],
    }),
  ])

  if (!lead && !blackListCustomer) {
    return true
  }

  return false
}

async function checkMinimunProcessingFee(customerID: number, leadID: number) {
  return true
}

async function checkEmailAcceptance(customerID: number, leadID: number) {
  const lead = await leadModel.findOne({
    where: {
      customerID,
      leadID,
    },
    select: ['kfs'],
  })

  if (lead.kfs === '1') return true

  return false
}

async function checkEmandateStatus(
  customerID: number,
  leadID: number,
  emandateRequired: '1' | '0',
  emdID: number,
) {
  const approval = await approvalModel.findOneApproval({ customerID, leadID }, ['loanAmtApproved'])

  if ((approval && approval.loanAmtApproved <= 25000) || emandateRequired === '1') {
    return true
  } else if (approval.loanAmtApproved > 25000) {
    const emCount = await razorpayMandateModel.count({
      // where: { customerID: String(customerID), id:emdID },
      where: [
        { column: 'customerID', value: customerID },
        { column: 'id', value: emdID },
        {
          column: 'emMaxamount',
          operator: '>=',
          value: approval.loanAmtApproved * 1,
        },
      ],
      whereRaw: [{ rawQuery: 'LOWER(status) = ?', values: ['paid'] }],
    })

    if (emCount > 0) {
      return true
    }

    return false
  }
}

async function checkPennyDropStatus(customerID: number, leadID: number, emandateID: number) {
  const rpayMandate = await razorpayMandateModel.findOne({
    where: { customerID: customerID, id: emandateID },
  })

  if (!rpayMandate) return false
  const pennyCount = await pennyDropModel.count({
    where: {
      customerID,
      account_number: rpayMandate.accountNo,
      penny_status: PennyStatus.COMPLETED,
    },
  })

  if (pennyCount > 0) {
    return true
  }

  return false
}

async function checkLastLoanDpd(type: string, customerID: number) {
  if (type === 'New Case') {
    return 'N/A'
  }

  const lastClosedLead = await leadModel.findOne({
    where: { customerID, status: LeadStatus.CLOSED },
    order: [{ column: 'leadID', order: 'desc' }],
    select: ['leadID'],
  })

  if (!lastClosedLead) return false

  const lastClosedApproval = await approvalModel.findOneApproval(
    {
      customerID,
      leadID: lastClosedLead.leadID,
    },
    ['repayDate'],
  )

  if (!lastClosedApproval) return false

  const lastClosedLoan = await loanService.findOne({
    customerID,
    leadID: lastClosedLead.leadID,
  })

  if (!lastClosedLoan) {
    return false
  }

  const lastClosedCollection = await this.collectionModel.findOneCollection(
    {
      customerID,
      leadID: lastClosedLead.leadID,
      status: CollectionStatus.CLOSED,
      collectionStatus: CollectionStatus.APPROVED,
    },
    ['collectedDate'],
  )

  if (!lastClosedCollection) {
    return false
  }

  const lastCollectedDate = momentTz(lastClosedCollection.collectedDate).startOf('day')
  const lastApprovalRepayDate = momentTz(lastClosedApproval.repayDate).startOf('day')

  const daysDiff = lastCollectedDate.diff(lastApprovalRepayDate, 'days')

  if (daysDiff < 7) {
    return `The total DPD days for the last loan is ${daysDiff}`
  }

  return 'Last loan shows no DPD days recorded'
}

async function checkLoanAmount(customerID: number, leadID: number) {
  return true
}

async function checkApprovedAmount(customerID: number, leadID: number) {
  return true
}

async function checkPennyDropStatusOnAccount(customerID: number, leadID: number) {
  const loan = await loanService.findOne({ customerID, leadID }, ['accountNo'])

  if (!loan) return false

  const pennyStatus = await pennyDropModel.count({
    where: {
      customerID: customerID,
      account_number: loan.accountNo,
      penny_status: PennyStatus.COMPLETED,
    },
  })

  if (pennyStatus > 0) {
    return true
  }

  return false
}

export async function autoDisbursalChecks(payload: IAutoDisbursalChecks) {
  const {
    mobile,
    customerID,
    leadID,
    salaryDate,
    emandateRequired,
    emdID,
    customerType,
    aadharNo,
    pancard,
  } = payload

  const checkPanAadharLastFourDigitsData = await checkPanAadharLastFourDigits(
    customerID,
    mobile,
    leadID,
    aadharNo,
    pancard,
  )

  const selfieCheckData = await selfieCheck(mobile.toString())
  const checkTenureData = await checkTenure(customerID, leadID)
  const checkSalaryGapData = await checkSalaryGapAndRepayDate(customerID, leadID, salaryDate)

  const checkSelfieVideoData = await checkSelfieVideo(customerID)

  const checkAddressEmployementReferenceData = await checkAddressEmployementReference(
    customerID,
    leadID,
  )

  const checkLeadStatusData = await checkLeadStatus(customerID, mobile)

  const checkEmailAcceptanceData = await checkEmailAcceptance(customerID, leadID)

  const checkEmandateStatusData = await checkEmandateStatus(
    customerID,
    leadID,
    emandateRequired,
    emdID,
  )

  const checkPennyDropStatusData = await checkPennyDropStatus(customerID, leadID, emdID)

  const lastLoanDpdCheckData = await checkLastLoanDpd(customerType, customerID)

  const checkPennyDropStatusOnAccountData = await checkPennyDropStatusOnAccount(customerID, leadID)
  const checkLoanAmountData = await checkLoanAmount(customerID, leadID)
  const checkMinimunProcessingFeeData = await checkMinimunProcessingFee(customerID, leadID)
  const checkApprovedAmountData = await checkApprovedAmount(customerID, leadID)

  const returnObj = {
    selfieCheckData,
    checkTenureData,
    checkSalaryGapData,
    checkSelfieVideoData,
    checkEmailAcceptanceData,
    checkEmandateStatusData,
    checkPennyDropStatusData,
    checkAddressEmployementReferenceData,
    checkLeadStatusData,
    checkApprovedAmountData,
    checkLoanAmountData,
    checkMinimunProcessingFeeData,
    lastLoanDpdCheckData,
    checkPennyDropStatusOnAccountData,
    checkPanAadharLastFourDigitsData,
  }

  return returnObj
}
