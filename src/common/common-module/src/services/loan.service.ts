import { config } from '@/config.server'
import moment from 'moment-timezone'
import { approvalModel } from '../database/mysql/approval'
import { autoDisbursalLogModel } from '../database/mysql/autoDisbursalLogs'
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs'
import { collectionModel } from '../database/mysql/collection'
import { creditModel } from '../database/mysql/credit'
import { customerModel } from '../database/mysql/customer'
import { customerAccountModel } from '../database/mysql/customerAccount'
import { disbursalJobsModel } from '../database/mysql/disbursalJobs'
import { emiModel } from '../database/mysql/emi'
import { leadModel } from '../database/mysql/leads'
import LoanModel from '../database/mysql/loan'
import { razorpayMandateModel } from '../database/mysql/razorpayMandate'
import { CollectionStatus } from '../enums/collection.enum'
import { LeadStatus } from '../enums/lead.enum'
import { LoanStatus } from '../enums/loan.enum'
import { IApproval } from '../interfaces/approval.interface'
import { ICollection } from '../interfaces/collection.interface'
import { ICustomer } from '../interfaces/customer.interface'
import { ILead } from '../interfaces/lead.interface'
import { ICalculateRepayAmountIpc, ILoan, TSelectLoan } from '../interfaces/loan.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import { SortCriteria } from '../types/model.types'
import { logger } from '../utils/logger'
import { getKnexInstance } from '../utils/mysql'
import { getEmiAPR } from '../utils/util'
import S3Service from './thirdParty/s3.service'
import { documentModel } from '../database/mysql/document'
import NotificationService from './notification.service'
import ResponseService from './response.service'
import { leadService } from './lead.service'
import { creditService } from './credit.service'
import path from 'path'
import ejs from 'ejs'
import fs from 'fs'
import { Readable } from 'stream';
import { addressModel } from '../database/mysql/address'
import { leadsApiLogModel } from '../database/mysql/leadApiLogs'
import { notificationUtils } from '../utils/notification'
interface ReplaceHtmlParams {
  data: any
  html: string
  defaultDate?: string
}
export class LoanService extends ResponseService {
  private loaneModel = new LoanModel()
  private readonly collectionModel = collectionModel
  private readonly leadModel = leadModel
  private readonly callHistoryLogsModel = callHistoryLogsModel
  private readonly customerModel = customerModel
  private readonly disbursalJobsModel = disbursalJobsModel
  private readonly autoDisbursalLogModel = autoDisbursalLogModel
  private readonly approvalModel = approvalModel
  private readonly razorpayMandateModel = razorpayMandateModel
  private readonly emiModel = emiModel
  private readonly creditModel = creditModel
  private readonly customerAccountModel = customerAccountModel
  private readonly addressModel = addressModel
  private readonly leadsApiLogModel = leadsApiLogModel
  private readonly documentModel = documentModel
  private readonly s3Service = new S3Service()
  private notificationService = new NotificationService()
  private readonly leadService = leadService
  private readonly creditService = creditService
 

  public async findOne(
    where: Partial<ILoan>,
    select: TSelectLoan[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectLoan>,
  ): Promise<ILoan> {
    return await this.loaneModel.findOneLoan(where, select, order)
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ILoan[] | ICustomResponse> {
    try {
      let loan = await this.loaneModel.getLoanData(where, order, select)
      if (loan.length == 0) {
        return null
      } else {
        return loan // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  getActualLoanTenure(collectedDate: Date, disbursalDate: Date): number {
    const firstDate = moment(collectedDate).startOf('day')
    const secondDate = moment(disbursalDate).startOf('day')

    // Determine which date is later to always get a positive difference
    const [laterDate, earlierDate] = firstDate.isSameOrAfter(secondDate)
      ? [firstDate, secondDate]
      : [secondDate, firstDate]

    // Calculate difference in days
    return laterDate.diff(earlierDate, 'days')
  }

  getActualLoanTenureInMonthDay(collectedDate: Date, disbursalDate: Date): string {
    const firstDate = moment(collectedDate).startOf('day')
    const secondDate = moment(disbursalDate).startOf('day')

    // Determine which date is later to always get a positive difference
    const [laterDate, earlierDate] = firstDate.isSameOrAfter(secondDate)
      ? [firstDate, secondDate]
      : [secondDate, firstDate]

    // Calculate months difference
    const monthsDifference = laterDate.diff(earlierDate, 'months')

    // Calculate remaining days after accounting for full months
    const earlierDatePlusMonths = moment(earlierDate).add(monthsDifference, 'months')
    const remainingDays = laterDate.diff(earlierDatePlusMonths, 'days')

    // Use singular or plural forms based on values
    const monthText = monthsDifference <= 1 ? 'Month' : 'Months'
    const dayText = remainingDays <= 1 ? 'Day' : 'Days'

    return `${monthsDifference} ${monthText} / ${remainingDays} ${dayText}`
  }

  // getDpdDays(repayDate: Date, comparisonDate?: Date): number {
  //   const currentDate = moment().tz('Asia/Kolkata').startOf('day')
  //   console.log('GET DPD days method:Current Date:::: ', currentDate)
  //   console.log('GET DPD days method:Repay Date:::: ', repayDate)
  //   const repayDateFormatted = moment(repayDate).startOf('day')

  //   console.log('GET DPD days method:Repay Date Formatted:::: ', repayDateFormatted)
  //   console.log("DPD DIFF is :::::::", currentDate.diff(repayDateFormatted, 'days'))

  //   if (!comparisonDate) return currentDate.diff(repayDateFormatted, 'day')

  //   const comparisonDateFormatted = moment(comparisonDate).startOf('day')

  //   return comparisonDateFormatted.diff(repayDateFormatted, 'days')
  // }

  getDpdDays(repayDate: Date, comparisonDate?: Date): number {
    const currentDate = moment().utcOffset(330).startOf('day') // 330 mins = UTC+5:30 (IST)
    const repayDateFormatted = moment(repayDate).utcOffset(330).startOf('day')
    if (!comparisonDate) return currentDate.diff(repayDateFormatted, 'days')
    const comparisonDateFormatted = moment(comparisonDate).utcOffset(330).startOf('day')
    return comparisonDateFormatted.diff(repayDateFormatted, 'days')
  }

  getPaidAmountPayday(collections: ICollection[]) {
    let totalPaidAmount = 0
    for (let collection of collections) {
      if (collection.collectedMode != 'Waive Off') {
        totalPaidAmount += collection.collectedAmount
      }
    }

    return totalPaidAmount
  }

  getRemainingInterestPayDay(collections: ICollection[], roi: number) {
    const totalInterest = +collections[0].total_interest
    const principal_amount = +collections[0].principal_amount
    const lastCollectedDate = moment(collections[0].collectedDate).utcOffset(330).startOf('day')
    const currentDate = moment().utcOffset(330).startOf('day')
    let difference = currentDate.diff(lastCollectedDate, 'days')
    const interestPerDay = roi

    if (difference < 0) difference = 0
    return +((interestPerDay * difference * principal_amount) / 100 + totalInterest).toFixed(2)
  }

  getRemainingPenaltyPayDay(collection: ICollection, roi: number, bounceCharges: number) {
    const totalPenality = +collection.penality_charge
    const principal_amount = +collection.principal_amount
    const lastCollectedDate = moment(collection.collectedDate).utcOffset(330).startOf('day')
    const currentDate = moment().utcOffset(330).startOf('day')
    let difference = currentDate.diff(lastCollectedDate, 'days')

    if (difference < 0) difference = 0
    return +((roi * difference * principal_amount) / 100 + (totalPenality - bounceCharges)).toFixed(
      2,
    )
  }

  async getPenalInterestPayday(
    lead: ILead,
    loan: ILoan,
    approval: IApproval,
    dpdDays: number,
    bounceCharge?: number,
  ) {
    const { ipc, customerID } = lead
    const dpdInterest = +config.dpdInterest
    const ipcDpdInterest = +config.ipcDpdInterest

    if (lead.status === LeadStatus.PART_PAYMENT) {
      const collection = await this.collectionModel.findOneCollection(
        {
          customerID,
          leadID: lead.leadID,
          loanNo: loan.loanNo,
          status: CollectionStatus.PART_PAYMENT,
          collectionStatus: CollectionStatus.APPROVED.toString(),
        },
        ['principal_amount', 'penality_charge', 'collectedDate'],
        [{ column: 'collectionID', order: 'desc' }],
      )

      return this.getRemainingPenaltyPayDay(
        collection,
        ipc ? ipcDpdInterest : dpdInterest,
        bounceCharge,
      )
    } else if (lead.status === LeadStatus.DISBURSED) {
      return this.calculateInterest(
        loan.disbursalAmount,
        ipc ? ipcDpdInterest : dpdInterest,
        dpdDays,
      )
    } else if (lead.status === LeadStatus.SETTLEMENT || lead.status === LeadStatus.CLOSED) {
      const collection = await this.collectionModel.find({
        where: {
          customerID,
          leadID: lead.leadID,
          loanNo: loan.loanNo,
          collectionStatus: CollectionStatus.APPROVED.toString(),
        },
        select: ['collectedDate', 'collected_interest'],
        order: [{ column: 'collectionID', order: 'desc' }],
      })

      const difference = this.getDpdDays(
        approval.repayDate as unknown as Date,
        collection[0].collectedDate,
      )
      // First we need to find orignal interest
      const originalAmount = loan.disbursalAmount
      let totalInterestCollected = 0
      collection.forEach(colle => {
        totalInterestCollected += colle.collected_interest
      })

      const originalAmountInterest = originalAmount * (approval.roi / 100) * approval.tenure

      if (difference > 0) {
        // ! TODO : Verify
        return totalInterestCollected - originalAmountInterest
      }
    }
  }

  calculateInterest(disbursalAmount: number, roi: number, tenure: number): number {
    return disbursalAmount * (roi / 100) * tenure
  }

  async calculateRepayAmountIpc(
    lead: ILead,
    customer: ICustomer,
    approval: IApproval,
    loan: ILoan,
    calculateOnDate?: Date,
  ): Promise<ICalculateRepayAmountIpc> {
    const response: ICalculateRepayAmountIpc = {
      totalPayableAmount: 0,
      repayDate: null,
      totalInterest: 0,
      dpdCharges: 0,
      principalAmount: 0,
      totalAmount: 0,
      totalAmountInterest: 0,
      totalAmountDpdCharge: 0,
      totalAmountPrincipal: 0,
    }
    const repayDate = moment(approval.repayDate)
    const disbursalDate = moment(loan.disbursalDate)

    let principleAmount = loan.disbursalAmount
    let prevPenaltyBalance = 0
    let prevInterestBalance = 0
    const sanctionRoi = approval.roi
    let oneTimePenaltyCharge = 0
    let totalAmount = 0
    let sanctionTenure = 0
    let dpdTenure = 0
    let interest = 0
    let dpdCharges = 0
    let closingBalance: number

    const dpdPenalty = Number(config.dpdPenalty)
    const dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage)

    const penaltyAmount = dpdPenalty + dpdPenalty * (dpdPenaltyGst / 100)

    if (lead.ipc === 0) {
      return response // return dummy details;
    }

    // if lead.ipc = 1

    const calculateDate = calculateOnDate ? moment(calculateOnDate) : moment()

    let sanctionTenureForTotal = calculateDate.isSameOrBefore(repayDate, 'day')
      ? calculateDate.diff(disbursalDate, 'days')
      : repayDate.diff(disbursalDate, 'days')

    let isOverDue = calculateDate.isAfter(repayDate)

    let oneTimePenaltyChargeForTotal = isOverDue ? penaltyAmount : 0
    let dpdTenureForTotal = isOverDue ? calculateDate.diff(repayDate, 'days') : 0
    let totalCalculatedAmountForTotal = 0
    let principalForTotal = principleAmount

    let interestForTotal =
      principleAmount * (approval.roi / 100) * (sanctionTenureForTotal + dpdTenureForTotal)

    let dpdChargeForTotal =
      principleAmount * (+config.ipcDpdInterest / 100) * dpdTenureForTotal +
      oneTimePenaltyChargeForTotal
    totalCalculatedAmountForTotal = principleAmount + interestForTotal + dpdChargeForTotal

    if (lead.status === LeadStatus.PART_PAYMENT) {
      const collection = await this.collectionModel.findOneCollection(
        {
          customerID: customer.customerID,
          leadID: lead.leadID,
          loanNo: loan.loanNo,
          status: CollectionStatus.PART_PAYMENT,
          collectionStatus: CollectionStatus.APPROVED.toString(),
        },
        ['*'],
        [{ column: 'collectionID', order: 'desc' }],
      )

      if (collection) {
        closingBalance = collection.closing_balance
        principleAmount = collection.principal_amount
        const collectedDate = collection.collectedDate
        const penaltyBalance = collection.penality_charge
        prevPenaltyBalance = collection.penality_charge // ! Review
        prevInterestBalance = collection.total_interest
        oneTimePenaltyCharge = penaltyBalance ? 0 : oneTimePenaltyCharge

        const isSameOrBeforeCollectedDate = calculateDate.isSameOrBefore(repayDate, 'day')
        const isSameOrAfterRepayDate = repayDate.isSameOrAfter(collectedDate)

        //calculate tenure

        if (isSameOrBeforeCollectedDate && isSameOrAfterRepayDate) {
          sanctionTenure = calculateDate.diff(collectedDate, 'days')
        } else if (!isSameOrAfterRepayDate && isSameOrAfterRepayDate) {
          sanctionTenure = repayDate.diff(collectedDate, 'days')
          dpdTenure = calculateDate.diff(repayDate, 'days')
          oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0
        } else if (!isSameOrAfterRepayDate && !isSameOrAfterRepayDate) {
          dpdTenure = calculateDate.diff(collectedDate, 'days')
          oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0
        }

        if (moment().isBefore(repayDate)) {
          sanctionTenure = moment().diff(disbursalDate, 'days')
        }

        interest = principleAmount * (sanctionRoi / 100) * (sanctionTenure + dpdTenure)
        dpdCharges =
          principleAmount * (+config.ipcDpdInterest / 100) * (dpdTenure + oneTimePenaltyCharge)
      }
    } else if (lead.status === LeadStatus.DISBURSED) {
      sanctionTenure = calculateDate.isSameOrBefore(repayDate, 'day')
        ? calculateDate.diff(disbursalDate, 'days')
        : repayDate.diff(disbursalDate, 'days')

      if (moment().isBefore(repayDate)) {
        sanctionTenure = moment().diff(disbursalDate, 'days')
      }

      dpdTenure = isOverDue ? calculateDate.diff(repayDate, 'days') : dpdTenure
      oneTimePenaltyCharge = isOverDue ? penaltyAmount : oneTimePenaltyCharge

      interest = principleAmount * (approval.roi / 100) * (sanctionTenure + dpdTenure)
      dpdCharges =
        principleAmount * (+config.ipcDpdInterest / 100) * dpdTenure + oneTimePenaltyCharge
      // ! Handle
    }

    if (closingBalance) {
      closingBalance = +Number(closingBalance).toFixed(2)
      totalAmount = closingBalance + interest + dpdCharges
    } else {
      totalAmount = +Number(principleAmount) + interest + dpdCharges
    }

    response.totalPayableAmount = +Number(totalAmount).toFixed(2)
    response.repayDate = new Date(approval.repayDate)
    response.totalInterest = Number((Number(interest) + Number(prevInterestBalance)).toFixed(2))
    response.dpdCharges = Number((Number(dpdCharges) + Number(prevPenaltyBalance)).toFixed(2))
    response.principalAmount = +Number(principleAmount).toFixed(2)
    response.totalAmount = +Number(totalCalculatedAmountForTotal).toFixed(2)
    response.totalAmountInterest = +Number(interestForTotal).toFixed(2)
    response.totalAmountDpdCharge = +Number(dpdChargeForTotal).toFixed(2)
    response.totalAmountPrincipal = +Number(principalForTotal).toFixed(2)

    return response
  }

  async calculateRepayAmountIpcV2(
    leadID: number,
    calculateOnDate?: Date,
  ): Promise<ICalculateRepayAmountIpc> {
    const response: ICalculateRepayAmountIpc = {
      totalPayableAmount: 0,
      repayDate: null,
      totalInterest: 0,
      dpdCharges: 0,
      principalAmount: 0,
      totalAmount: 0,
      totalAmountInterest: 0,
      totalAmountDpdCharge: 0,
      totalAmountPrincipal: 0,
    }

    const db = getKnexInstance()

    const lead = <
      ILead & {
        approval: IApproval
        customer: ICustomer
        loan: ILoan
      }
    >await this.leadModel.LeadsKnex.select(db.raw(`JSON_OBJECT('repayDate', ap.repayDate ,'roi', ap.roi) as 'approval'`), db.raw(`JSON_OBJECT('customerID', c.customerID) as 'customer'`), db.raw(`JSON_OBJECT('disbursalAmount',loan.disbursalAmount,'disbursalDate',loan.disbursalDate,'loanNo',loan.loanNo) as 'loan'`), 'leads.ipc', 'leads.status', 'leads.leadID', 'leads.status').join('customer as c', 'leads.customerID', '=', 'c.customerID').join('approval as ap', 'leads.leadID', '=', 'ap.leadID').join('loan', 'leads.leadID', '=', 'loan.leadID').where('leads.leadID', leadID).whereIn('leads.status', [LeadStatus.DISBURSED, LeadStatus.PART_PAYMENT]).first()

    const { approval, customer, loan } = lead

    const repayDate = moment(approval.repayDate)
    const disbursalDate = moment(loan.disbursalDate)

    let principleAmount = loan.disbursalAmount
    let prevPenaltyBalance = 0
    let prevInterestBalance = 0
    const sanctionRoi = approval.roi
    let oneTimePenaltyCharge = 0
    let totalAmount = 0
    let sanctionTenure = 0
    let dpdTenure = 0
    let interest = 0
    let dpdCharges = 0
    let closingBalance: number

    const dpdPenalty = Number(config.dpdPenalty)
    const dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage)

    const penaltyAmount = dpdPenalty + dpdPenalty * (dpdPenaltyGst / 100)

    if (lead.ipc === 0) {
      return response // return dummy details;
    }

    // if lead.ipc = 1

    const calculateDate = calculateOnDate ? moment(calculateOnDate) : moment()
    let sanctionTenureForTotal = calculateDate.isSameOrBefore(repayDate, 'day')
      ? calculateDate.diff(disbursalDate, 'days')
      : repayDate.diff(disbursalDate, 'days')

    let isOverDue = calculateDate.isAfter(repayDate)

    let oneTimePenaltyChargeForTotal = isOverDue ? penaltyAmount : 0
    let dpdTenureForTotal = isOverDue ? calculateDate.diff(repayDate, 'days') : 0
    let totalCalculatedAmountForTotal = 0
    let principalForTotal = principleAmount

    let interestForTotal =
      principleAmount * (approval.roi / 100) * (sanctionTenureForTotal + dpdTenureForTotal)

    let dpdChargeForTotal =
      principleAmount * (+config.ipcDpdInterest / 100) * dpdTenureForTotal +
      oneTimePenaltyChargeForTotal
    totalCalculatedAmountForTotal = principleAmount + interestForTotal + dpdChargeForTotal

    if (lead.status === LeadStatus.PART_PAYMENT) {
      const collection = await this.collectionModel.findOneCollection(
        {
          customerID: customer.customerID,
          leadID: lead.leadID,
          loanNo: loan.loanNo,
          status: CollectionStatus.PART_PAYMENT,
          collectionStatus: CollectionStatus.APPROVED.toString(),
        },
        ['*'],
        [{ column: 'collectionID', order: 'desc' }],
      )

      if (collection) {
        closingBalance = collection.closing_balance
        principleAmount = collection.principal_amount
        const collectedDate = collection.collectedDate
        const penaltyBalance = collection.penality_charge
        prevPenaltyBalance = collection.penality_charge // ! Review
        prevInterestBalance = collection.total_interest
        oneTimePenaltyCharge = penaltyBalance ? 0 : oneTimePenaltyCharge

        const isSameOrBeforeCollectedDate = calculateDate.isSameOrBefore(repayDate, 'day')
        const isSameOrAfterRepayDate = repayDate.isSameOrAfter(collectedDate)

        //calculate tenure

        if (isSameOrBeforeCollectedDate && isSameOrAfterRepayDate) {
          sanctionTenure = calculateDate.diff(collectedDate, 'days')
        } else if (!isSameOrAfterRepayDate && isSameOrAfterRepayDate) {
          sanctionTenure = repayDate.diff(collectedDate, 'days')
          dpdTenure = calculateDate.diff(repayDate, 'days')
          oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0
        } else if (!isSameOrAfterRepayDate && !isSameOrAfterRepayDate) {
          dpdTenure = calculateDate.diff(collectedDate, 'days')
          oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0
        }

        interest = principleAmount * (sanctionRoi / 100) * (sanctionTenure + dpdTenure)
        dpdCharges =
          principleAmount * (+config.ipcDpdInterest / 100) * (dpdTenure + oneTimePenaltyCharge)
      }
    } else if (lead.status === LeadStatus.DISBURSED) {
      sanctionTenure = calculateDate.isSameOrBefore(repayDate, 'day')
        ? calculateDate.diff(disbursalDate, 'days')
        : repayDate.diff(disbursalDate, 'days')

      dpdTenure = isOverDue ? calculateDate.diff(repayDate, 'days') : dpdTenure
      oneTimePenaltyCharge = isOverDue ? penaltyAmount : oneTimePenaltyCharge

      interest = principleAmount * (approval.roi / 100) * (sanctionTenure + dpdTenure)
      dpdCharges =
        principleAmount * (+config.ipcDpdInterest / 100) * dpdTenure + oneTimePenaltyCharge
      // ! Handle
    }

    totalAmount = closingBalance ?? principleAmount + interest + dpdCharges

    response.totalPayableAmount = +Number(totalAmount).toFixed(2)
    response.repayDate = new Date(approval.repayDate)
    response.totalInterest = Number((Number(interest) + Number(prevInterestBalance)).toFixed(2))
    response.dpdCharges = Number((Number(dpdCharges) + Number(prevPenaltyBalance)).toFixed(2))
    response.principalAmount = +Number(principleAmount).toFixed(2)
    response.totalAmount = +Number(totalCalculatedAmountForTotal).toFixed(2)
    response.totalAmountInterest = +Number(interestForTotal).toFixed(2)
    response.totalAmountDpdCharge = +Number(dpdChargeForTotal).toFixed(2)
    response.totalAmountPrincipal = +Number(principalForTotal).toFixed(2)

    return response
  }

  async getApprovedLoanAmount(customerID: number) {
    const lead = await this.leadModel.LeadsKnex.join('approval as ap', 'leads.leadID', 'ap.leadID')
      .where('leads.customerID', customerID)
      .andWhere('leads.status', LeadStatus.CLOSED)
      .select('ap.loanAmtApproved')
      .orderBy('leads.leadID', 'desc')
      .first()

    return lead ? lead.loanAmtApproved * +config.reloanMax : null
  }

  async isReloanAmountValid(amount: number, customerID: number) {
    const approvedAmount = await this.getApprovedLoanAmount(customerID)
    if (approvedAmount && amount > approvedAmount) {
      return { status: false, amount: approvedAmount }
    }

    return { status: true, amount }
  }

  async createAutoDisbursal(leadID: number) {
    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['customerID'],
    })
    const { customerID } = lead

    try {
      const [checkDisbursed, disbCountCallHistoryCount, loan, loanCount] = await Promise.all([
        this.leadModel.count({
          where: { leadID },
          whereIn: [
            {
              column: 'status',
              value: [LeadStatus.DISBURSED, LeadStatus.PART_PAYMENT, LeadStatus.SETTLEMENT],
            },
          ],
        }),
        this.callHistoryLogsModel.CallHistoryLogsKnex.where('leadID', leadID)
          .andWhere(function () {
            this.where('status', 'Disbursed By Razorpay').orWhere('status', 'Disbursed')
          })
          .count(),
        this.loaneModel.findOneLoan(
          {
            leadID,
            disbursalRefrenceNo: '',
            status: LoanStatus.DISBURSAL_SHEET_SENT,
          },
          ['*'],
          [{ order: 'desc', column: 'loanID' }],
        ),
        this.loaneModel.countLoan({
          leadID,
          disbursalRefrenceNo: '',
          status: LoanStatus.DISBURSAL_SHEET_SENT,
        }),
      ])

      const disbursalCountCh = disbCountCallHistoryCount[0]['count(*)']
      const { accountNo, bankIfsc, loanNo, loanID, disbursalAmount, deduction, companyAccountNo } =
        loan

      const customer = await this.customerModel.findOneCustomer({
        customerID,
      })

      const countDisbursalJobs = await this.disbursalJobsModel.count({
        where: { customerID, leadID, loanID },
      })

      if (
        checkDisbursed === 0 &&
        countDisbursalJobs === 0 &&
        disbursalCountCh === 0 &&
        loanCount === 1
      ) {
        await Promise.all([
          this.disbursalJobsModel.create({
            customerID,
            leadID,
            loanID,
            loanNo,
            accountNo: +accountNo,
            ifsc: bankIfsc,
            actualDisbAmount: (disbursalAmount - deduction).str,
            custName: customer.name,
            custMobile: customer.mobile.str,
            custEmail: customer.email,
            companyAcc: companyAccountNo,
            userID: +config.defaultUserId,
          }),
          // ! Auto disbursal Log
          this.autoDisbursalLogModel.create({
            customerID,
            leadID,
            userID: +config.defaultUserId,
            status: 'disbursal initiation',
          }),
        ])
      }
    } catch (error) {
      await this.autoDisbursalLogModel.create({
        customerID,
        leadID,
        userID: +config.defaultUserId,
        status: 'disbursal initiation',
      })
    }
  }

  async calculatePaydayLoanSanctionData(leadID: number, customerID: number, userID: number) {
    const [lead, customer, loan, approval] = await Promise.all([
      this.leadModel.findOne({
        where: { leadID },
      }),
      this.customerModel.findOneCustomer({
        customerID,
      }),
      this.findOne({
        customerID,
        leadID,
      }),
      this.approvalModel.findOne({
        where: { customerID, leadID },
      }),
    ])
    let accountDetails
    accountDetails = await this.razorpayMandateModel.findOne({
      where: {
        id: lead.em_id,
      },
    })

    if (!accountDetails) {
      accountDetails = await this.customerAccountModel.findOne({
        where: {
          customerID: lead?.customerID,
        },
        order: [
          {
            column: 'accountID',
            order: 'desc',
          },
        ],
      })
    } else {
      accountDetails.bankIfsc = accountDetails?.ifsc
    }

    let tenure
    tenure = approval?.tenure
    if (approval && loan) {
      const disbursalMoment = moment(loan?.disbursalDate).startOf('day')
      const repayMoment = moment(approval?.repayDate).startOf('day')
      tenure = Math.abs(repayMoment.diff(disbursalMoment, 'days'))
    }
    const rep = Math.round(approval?.loanAmtApproved * (approval?.roi / 100))
    const rep1 = approval?.loanAmtApproved + rep * tenure
    const inte = rep * 30
    const intem = rep * tenure
    const inte1 = inte * 12
    const adm = approval?.adminFee || 0

    const gst = +(adm * (18 / 100)).toFixed(2)
    const tam = adm + gst

    const perRoi = approval?.roi / 100 // Convert ROI to decimal

    // Initial loan balance including fees
    // public function getIPR($loanAmount, $platFormFee, $otherFee, $tenure, $roi)
    const firstBalance = -(approval?.loanAmtApproved - approval.adminFee - gst)

    // Final balance including interest
    const secondBalance = approval.loanAmtApproved + approval.loanAmtApproved * perRoi * tenure

    // Cash flow array for IRR calculation
    const cashFlows = [firstBalance, secondBalance]

    const apr = +(this.calculateIRR(cashFlows, perRoi) * 100 * 12).toFixed(2)
    const fdb = approval?.loanAmtApproved - tam
    const to = customer?.email
    const subject = 'Loan Sanction Letter Ram Fincorp'
    const from = 'credit@ramfincorp.com'
    const blade = 'email.sanction'
    const mailData = {
      leadDetails: lead,
      customerDetails: customer,
      loanDetails: loan,
      approvalDetails: approval,
      accountDetails: accountDetails,
      intem: intem,
      gst: gst,
      apr: apr,
      fdb: fdb,
      rep1: rep1,
      tenure: tenure,
    }

    return mailData

    // private function calculateIRR($cashFlows, $guess = 0.1)
  }

  private calculateIRR(cashFlows: number[], guess = 0.1): number {
    const precision = 1e-6 // Desired precision
    let iteration = 0
    const maxIteration = 1000 // Maximum iterations to avoid infinite loops.
    let rate = guess

    do {
      iteration++
      let npv = 0 // Net Present Value (NPV).
      let derivative = 0

      // Calculate NPV and its derivative using cash flows.
      cashFlows.forEach((cashFlow, t) => {
        npv += cashFlow / Math.pow(1 + rate, t)
        derivative += -(t * cashFlow) / Math.pow(1 + rate, t + 1)
      })

      const newRate = rate - npv / derivative // Update rate using Newton-Raphson.
      if (Math.abs(newRate - rate) < precision) {
        // Check if difference is within the desired precision.
        break
      }

      rate = newRate
    } while (iteration < maxIteration)

    return rate
  }

  async calculateEmiLoanSanctionData(leadID: number, customerID: number, userID: number) {
    const [lead, customer, loan, approval, installments] = await Promise.all([
      this.leadModel.findOne({
        where: { leadID },
      }),

      this.customerModel.findOneCustomer({
        customerID,
      }),
      this.findOne({
        customerID,
        leadID,
      }),
      this.approvalModel.findOne({
        where: { customerID, leadID },
      }),
      this.emiModel.find({
        where: { customerID, leadID },
        order: [{ column: 'emiID', order: 'desc' }],
      }),
    ])

    const { em_id } = lead

    let accountDetails

    accountDetails = await this.razorpayMandateModel.findOne({
      where: { id: em_id },
    })

    if (!accountDetails) {
      accountDetails = await this.customerAccountModel.findOne({
        where: { customerID },
        order: [{ column: 'accountID', order: 'desc' }],
      })
    } else {
      accountDetails.bankIfsc = accountDetails.ifsc
    }

    const lastInstallment = installments[0]

    const dueDate = moment(lastInstallment.dueDate).format('YYYY-MM-DD')
    const disbursalDate = moment(loan.disbursalDate).format('YYYY-MM-DD')

    const tenureInDays = moment(dueDate).diff(disbursalDate, 'days')

    const emiDetails = await this.creditModel.findOneCredit({
      customerID,
      leadID,
    })

    const tenure = emiDetails.tenure
    const disbursalAmount = approval.loanAmtApproved
    const rep = +(disbursalAmount + approval.roi).toFixed(2)
    const rep1 = emiDetails.amountToBeRepayed ?? disbursalAmount
    const intem = emiDetails.interest ?? 0
    const adminFee = approval.adminFee

    const gst = +(adminFee * 0.18).toFixed(2)
    const tam = +(adminFee + gst).toFixed(2)

    const apr = getEmiAPR(disbursalAmount.str, adminFee.str, gst.str, tenure.str, approval.roi.str)

    const fdb = disbursalAmount - tam
    const daysDiff = moment(approval.repayDate)
      .startOf('day')
      .diff(moment(loan.disbursalDate).startOf('day'))

    let bpi = +(approval.loanAmtApproved * (approval.roi / 100) * (daysDiff * 365)).toFixed(2)

    if (bpi < 0) bpi = 0

    return {
      lead,
      customer,
      loan,
      approvalDetails: approval,
      accountDetails,
      intem,
      gst,
      apr,
      fdb,
      rep1,
      tenure,
      installments,
      credits: emiDetails,
      tenureInDays,
      bpi,
    }
  }

  public calculateGst = (adminFee: number): any => {
    let getAmt
    getAmt = (adminFee * 18) / 100
    return getAmt
  }

  async getLoanLeadDetail(leadID: number) {
    const leadDetail = await this.leadModel.findOneLead({ leadID })
    let loanDisbursed = 0
    let roi = 0
    let nod = 0
    let rd = 0
    let penDay = 0
    let toi = 0
    let penAmount = 0
    let coAmount = 0
    let gstAmount = 0
    let repayAmount = 0
    let approvalAmount = 0
    let loanTenure = 0
    let approval: IApproval
    let adminFee = 0
    let repaymentAmount = 0
    let loan: ILoan

    if (leadDetail) {
      loan = await this.loaneModel.findOneLoan({
        customerID: leadDetail.customerID,
        leadID: leadDetail.leadID,
      })

      let loanDisbursed = loan.disbursalAmount

      if (loan.disbursalRefrenceNo) {
        approval = await this.approvalModel.findOneApproval({
          customerID: leadDetail.customerID,
          leadID: leadDetail.leadID,
        })

        approvalAmount = approval.loanAmtApproved
        loanTenure = approval.tenure
        roi = approval.roi
        const sta = new Date(approval.repayDate)
        const cur = new Date()
        const mi1 = roi / 100
        const mi = Math.round(loan.disbursalAmount * mi1 * 100) / 100
        nod =
          (new Date(approval.repayDate).getTime() - new Date(loan.disbursalDate).getTime()) /
          (1000 * 60 * 60 * 24)

        if (new Date(approval.repayDate) >= cur) {
          rd = (cur.getTime() - new Date(loan.disbursalDate).getTime()) / (1000 * 60 * 60 * 24)
        } else {
          rd = nod
        }

        penDay = 0
        if (cur > sta) {
          penDay = (cur.getTime() - sta.getTime()) / (1000 * 60 * 60 * 24)
        }

        toi = mi * rd
        if (penDay > 0) {
          penAmount = (Math.round(loan.disbursalAmount * (1.25 / 100) * 100) / 100) * penDay
        } else {
          penAmount = 0
        }

        const totPay = loan.disbursalAmount + toi + penAmount

        const cola = await this.collectionModel.CollectionKnex.where({
          collectionStatus: LeadStatus.APPROVED,
          customerID: leadDetail.customerID,
          leadID: leadDetail.leadID,
        }).sum('collectedAmount')

        repaymentAmount = totPay - coAmount

        const adgst = Math.round(approval.adminFee * (18 / 100) * 100) / 100
        const svs = adgst + approval.adminFee
        const dbu = loan.disbursalAmount - svs
        gstAmount = adgst
        adminFee = approval.adminFee
        const paA = Math.round(loan.disbursalAmount * (approval.roi / 100))
        const tda = paA * approval.tenure
        repayAmount = loan.disbursalAmount + tda
      }
    }

    return {
      loan_disbursed: loanDisbursed,
      roi: roi,
      no_days: nod,
      real_days: rd,
      penalty_days: penDay,
      real_interest: toi,
      penalty_intrest: penAmount,
      paid_amount: coAmount,
      repayment_amount: repaymentAmount,
      gst_amount: gstAmount,
      admin_fee: adminFee,
      repay_amount: repayAmount,
      approval_amount: approvalAmount,
      loan_tenure: loanTenure,
      creda: approval,
      disba: loan,
    }
  }

  calculateAdminFee(loanAmount: number, adminFeePercentage: number): number {
    return loanAmount * (adminFeePercentage / 100)
  }
}

export default LoanService
export const loanService = new LoanService()
