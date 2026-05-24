import { config } from '@/config.server'
import { approvalModel } from '@/database/mysql/approval'
import { creditModel } from '@/database/mysql/credit'
import { emiModel } from '@/database/mysql/emi'
import { loanModel } from '@/database/mysql/loan'
import { IEmi } from '@/interfaces/emi.interface'
import { emiService } from '@/services/emi.service'
import { differenceInCalendarDays, format, parseISO, startOfDay } from 'date-fns'
import { getKnexInstance } from './mysql'
import { toZonedTime } from 'date-fns-tz'


export async function calculateTotalRepayEmiAmount(
  leadID: number,
  customerID: number,
): Promise<number> {
  const getEmis = await emiModel.findAll(
    { leadID: leadID, is_deleted: 0 },
    [{ column: 'emiID', order: 'asc' }],
    [
      'principal',
      'interest',
      'panelty',
      'amountPayable',
      'dueDate',
      'status',
      'brokenPeriodIntrest',
      'amountRemains',
      'amountRemainsInterest',
      'amountRemainsPenalty',
      'amountRemainsBrokenPeriodIntrest',
      'paymentReceived',
      'actualPaymentDate',
      'emiID',
      'creditID',
      'customerID',
      'leadID',
      'productID',
      'is_deleted',
      'accessAmount',
      'waive_off_amount',
      'updatedAt',
    ],
  )
  const credit = await creditModel.findOneCredit({ leadID: leadID }, ['roi'])
  const totalOverdue = getEmis
    .filter((emi: IEmi) => {
      const dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'))
      const currentDate = new Date()
      const delayDays = Math.max(
        0,
        differenceInCalendarDays(currentDate, dueDate),
      )
      if (
        delayDays > 0 &&
        emi.status !== 'partially-paid' &&
        emi.status !== 'paid'
      ) {
        emi.brokenPeriodIntrest = emiService.bounceCharge()
        emi.amountRemainsInterest = 0
        emi.amountRemainsPenalty = 0
        emi.panelty = emiService.roundToTwo(
          emiService.calculatePenalty(emi.principal, delayDays, credit.roi),
        )
        emi.amountRemainsBrokenPeriodIntrest = 0
        emi.amountPayable = emiService.roundToTwo(
          emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest,
        )
      } else if (emi.status === 'partially-paid') {
        emi.panelty =
          +emi.panelty +
          emiService.calculatePenalty(emi.amountRemains, delayDays, credit.roi)
        emi.panelty = emiService.roundToTwo(emi.panelty)
        emi.amountPayable = emiService.roundToTwo(
          emi.principal +
          emi.interest +
          emi.panelty +
          emi.brokenPeriodIntrest -
          emi.paymentReceived,
        )
      }

      // Return true if EMI is still overdue
      return emi.status !== 'paid' && delayDays > 0
    })
    .reduce((total: number, emi: IEmi) => total + emi.amountPayable, 0)
  return totalOverdue
}

export async function calculateTotalRepayPaydayAmountNonIPC(leadID: number): Promise<number> {
  let db = getKnexInstance()
  const nowUTC = new Date()
  const timeZone = 'Asia/Kolkata'
  const today = startOfDay(toZonedTime(nowUTC, timeZone))
  let sanctionDiff: number = 0
  let loan = await loanModel.findOneLoan(
    { leadID: leadID },
    ['loanNo', 'disbursalDate', 'disbursalAmount'],
    [{ column: 'loanID', order: 'desc' }],
  )

  let approval = await approvalModel.findOneApproval(
    { leadID: leadID },
    ['repayDate', 'roi'],
    [{ column: 'approvalID', order: 'desc' }],
  )
  let disbursalDate =
    typeof loan.disbursalDate === 'string' ? parseISO(loan.disbursalDate) : loan.disbursalDate
  let repayDate =
    typeof approval.repayDate === 'string' ? parseISO(approval.repayDate) : approval.repayDate
  let dpdDiff: number = 0

  repayDate = startOfDay(toZonedTime(new Date(repayDate), timeZone))
  disbursalDate = startOfDay(toZonedTime(new Date(disbursalDate), timeZone))
  if (repayDate < today) {
    dpdDiff = differenceInCalendarDays(today, repayDate)
  }
  if (today <= repayDate) {
    sanctionDiff = differenceInCalendarDays(today, disbursalDate)
  } else {
    sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate)
  }
  let sanctionInterest = (loan.disbursalAmount * +config.rate_of_interest * sanctionDiff) / 100
  let dpdInterest = (loan.disbursalAmount * Number(config.dpdInterest) * dpdDiff) / 100

  let totalRepayAmount = sanctionInterest + dpdInterest + loan.disbursalAmount
  const totalCollected = await db('collection')
    .where({
      leadID: leadID,
      collectionStatus: 'Approved',
    })
    .sum('collectedAmount as tc')
    .first()
  return totalRepayAmount - totalCollected.tc
}

export async function calculateTotalRepayPaydayAmountIPC(
  leadID: number,
  status: string,
): Promise<number> {
  const db = getKnexInstance()
  const today = new Date()
  const loan = await loanModel.findOneLoan(
    { leadID: leadID },
    ['loanNo', 'disbursalDate', 'disbursalAmount', 'customerID'],
    [{ column: 'loanID', order: 'desc' }],
  )

  const approval = await approvalModel.findOneApproval(
    { leadID: leadID },
    ['repayDate', 'roi'],
    [{ column: 'approvalID', order: 'desc' }],
  )

  const principalAmount = loan.disbursalAmount
  const disbursalDate =
    typeof loan.disbursalDate === 'string'
      ? parseISO(loan.disbursalDate)
      : loan.disbursalDate
  let dpdDiff: number = 0
  let sanctionDiff: number = 0

  const repayDate =
    typeof approval.repayDate === 'string'
      ? parseISO(approval.repayDate)
      : approval.repayDate

  const dpdPenalty = Number(config.dpdPenalty)
  const dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage)
  let penaltyAmount: number = 0

  if (repayDate < today) {
    dpdDiff = differenceInCalendarDays(today, repayDate)
    penaltyAmount = dpdPenalty * (1 + dpdPenaltyGst / 100)
  }
  if (today <= repayDate) {
    sanctionDiff = differenceInCalendarDays(today, disbursalDate)
  } else {
    sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate)
  }

  let totalInterest =
    (principalAmount * (dpdDiff + sanctionDiff) * +config.rate_of_interest) / 100

  let charges =
    ((dpdDiff * Number(config.ipcDpdInterest)) / 100) * principalAmount +
    penaltyAmount

  let totalRepayAmount = principalAmount + totalInterest + charges

  if (status === 'Disbursed') {
    if (today <= repayDate) {
      sanctionDiff = differenceInCalendarDays(today, disbursalDate)
    } else {
      sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate)
      totalInterest =
        (principalAmount * (dpdDiff + sanctionDiff) * +config.rate_of_interest) / 100
      charges =
        ((dpdDiff * Number(config.ipcDpdInterest)) / 100) * principalAmount +
        penaltyAmount
    }
  } else if (status === 'Part Payment') {
    const collection = await db('collection')
      .where({
        customerID: loan.customerID,
        leadID: leadID,
        loanNo: loan.loanNo,
        status: 'Part Payment',
        collectionStatus: 'Approved',
      })
      .orderBy('collectionID', 'desc')
      .first()

    if (collection) {
      const {
        principal_amount,
        closing_balance,
        collectedDate,
        penality_charge,
        total_interest,
      } = collection
      const penaltyBalance = penality_charge

      let penaltyAmountAdjustment = penaltyBalance ? 0 : penaltyAmount
      totalInterest =
        (principal_amount * (dpdDiff + sanctionDiff) * +config.rate_of_interest) / 100

      if (today <= repayDate) {
        sanctionDiff = differenceInCalendarDays(today, collectedDate)
      } else {
        if (today >= repayDate && repayDate >= collectedDate) {
          sanctionDiff = differenceInCalendarDays(repayDate, collectedDate)
          dpdDiff = differenceInCalendarDays(today, repayDate)
        } else {
          dpdDiff = differenceInCalendarDays(today, collectedDate)
        }
      }

      charges =
        ((dpdDiff * Number(config.ipcDpdInterest)) / 100) * principal_amount +
        penaltyAmountAdjustment
      totalRepayAmount =
        Number(closing_balance ?? principal_amount) + totalInterest + charges
    }
  }

  return totalRepayAmount
}
