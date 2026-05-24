import config from '@/config/default'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { approvalModel } from '../database/mysql/approval'
import { loanModel } from '../database/mysql/loan'
import { NotFoundError } from '../errors'
import { IPaydayIpc } from '../interfaces/common.interface'
import { getKnexInstance } from './mysql'
import { CollectionStatus } from '../enums/collection.enum'

export async function calculateTotalRepayPaydayAmountNonIPC(
  leadID: number,
): Promise<number> {
  const db = getKnexInstance()
  const nowUTC = new Date()
  const timeZone = 'Asia/Kolkata'
  const today = toZonedTime(nowUTC, timeZone)

  const result = await db('loan')
    .join('approval', 'loan.leadID', 'approval.leadID')
    .where('loan.leadID', leadID)
    .select(
      'loan.disbursalAmount',
      'loan.disbursalDate',
      'approval.repayDate',
      'approval.roi',
    )
    .orderBy('loan.loanID', 'desc')
    .orderBy('approval.approvalID', 'desc')
    .first()

  if (!result) {
    throw new NotFoundError(
      'No loan or approval data found for the given leadID',
    )
  }

  const disbursalDate =
    typeof result.disbursalDate === 'string'
      ? parseISO(result.disbursalDate)
      : result.disbursalDate
  const repayDate =
    typeof result.repayDate === 'string'
      ? parseISO(result.repayDate)
      : result.repayDate

  let sanctionDiff = 0
  let dpdDiff = 0

  if (today <= repayDate) {
    sanctionDiff = differenceInCalendarDays(today, disbursalDate)
  } else {
    sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate)
    dpdDiff = differenceInCalendarDays(today, repayDate)
  }

  const sanctionInterest =
    (result.disbursalAmount * result.roi * sanctionDiff) / 100
  const dpdInterest =
    (result.disbursalAmount * Number(config.dpdInterest) * dpdDiff) / 100
  const totalRepayAmount =
    sanctionInterest + dpdInterest + result.disbursalAmount

  const totalCollected = await db('collection')
    .where({
      leadID: leadID,
      collectionStatus: 'Approved',
    })
    .sum('collectedAmount as tc')
    .first()

  return totalRepayAmount - (totalCollected?.tc || 0)
}
export async function calculateTotalRepayPaydayAmountIPC(
  leadID: number,
  status: string,
): Promise<IPaydayIpc> {
  const db = getKnexInstance()

  const nowUTC = new Date()
  const timeZone = 'Asia/Kolkata'
  const today = toZonedTime(nowUTC, timeZone)

  const result = await db('loan')
    .join('approval', 'loan.leadID', 'approval.leadID')
    .where('loan.leadID', leadID)
    .select(
      'loan.disbursalAmount',
      'loan.disbursalDate',
      'loan.customerID',
      'loan.loanNo',
      'approval.repayDate',
      'approval.roi',
    )
    .orderBy('loan.loanID', 'desc')
    .orderBy('approval.approvalID', 'desc')
    .first()

  if (!result) {
    throw new NotFoundError(
      'No loan or approval data found for the given leadID',
    )
  }

  const disbursalDate =
    typeof result.disbursalDate === 'string'
      ? parseISO(result.disbursalDate)
      : result.disbursalDate
  const repayDate =
    typeof result.repayDate === 'string'
      ? parseISO(result.repayDate)
      : result.repayDate

  let sanctionDiff = 0
  let dpdDiff = 0
  const principalAmount = result.disbursalAmount

  if (today <= repayDate) {
    sanctionDiff = differenceInCalendarDays(today, disbursalDate)
  } else {
    sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate)
    dpdDiff = differenceInCalendarDays(today, repayDate)
  }

  const dpdPenalty = Number(config.dpdPenalty)
  const dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage)
  const penaltyAmount = dpdDiff > 0 ? dpdPenalty * (1 + dpdPenaltyGst / 100) : 0

  let totalInterest =
    (result.disbursalAmount * (dpdDiff + sanctionDiff) * result.roi) / 100
  let charges =
    ((dpdDiff * Number(config.ipcDpdInterest)) / 100) * result.disbursalAmount +
    penaltyAmount

  let totalRepayAmount = result.disbursalAmount + totalInterest + charges

  if (status === 'Part Payment') {
    const collection = await db('collection')
      .where({
        customerID: result.customerID,
        leadID: leadID,
        loanNo: result.loanNo,
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
      } = collection
      const penaltyBalance = penality_charge

      let penaltyAmountAdjustment = penaltyBalance ? 0 : penaltyAmount
      totalInterest =
        (principal_amount * (dpdDiff + sanctionDiff) * result.roi) / 100

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
  const data: IPaydayIpc = {
    totalRepayAmount,
    totalInterest,
    charges,
    principalAmount,
  }

  return data
}

export async function calculateTotalRepayAmountEmi(
  leadID: number,
): Promise<number> {
  const db = getKnexInstance()
  const query = await db.raw(
    `
    SELECT 
        ROUND(
            CASE
                WHEN emi.status = 'due' AND emi.dueDate < CURRENT_DATE THEN
                    emi.principal + emi.interest + 
                    emi.principal * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * 
                    DATEDIFF(CURRENT_DATE, emi.dueDate) + 
                    590
                WHEN emi.status = 'part-payment' AND emi.actualPaymentDate > emi.dueDate THEN
                    emi.principal + emi.interest + emi.panelty + 
                    emi.amountRemains * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * 
                    DATEDIFF(CURRENT_DATE, emi.actualPaymentDate) + 
                    590 - emi.amountPayable
                WHEN emi.status = 'part-payment' AND emi.actualPaymentDate < emi.dueDate AND emi.dueDate < CURRENT_DATE THEN
                    emi.principal + emi.interest + 
                    emi.amountRemains * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * 
                    DATEDIFF(CURRENT_DATE, emi.dueDate) + 
                    590 - emi.amountPayable
                ELSE emi.amountPayable
            END, 2
        ) AS Repay_Amount
    FROM equated_monthly_installments emi
    LEFT JOIN credits cr ON emi.creditID = cr.creditID
    WHERE emi.leadID = ? 
    AND emi.dueDate <= CURRENT_DATE
    AND emi.status != 'paid'
`,
    [leadID],
  )
  const totalRepayAmount = query[0]?.[0]?.Repay_Amount ?? 0
  return totalRepayAmount
}

export async function calculatePaydayAmountIPC(
  leadID: number,
  status: CollectionStatus,
): Promise<IPaydayIpc> {
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
    (principalAmount * (dpdDiff + sanctionDiff) * approval.roi) / 100

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
        (principalAmount * (dpdDiff + sanctionDiff) * approval.roi) / 100
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
        (principal_amount * (dpdDiff + sanctionDiff) * approval.roi) / 100

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
  const data = {
    totalRepayAmount,
    totalInterest,
    charges,
    principalAmount,
  }

  return data
}
