import { config } from '@/config.server'
import { differenceInCalendarDays, format } from 'date-fns'
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs'
import { creditModel } from '../database/mysql/credit'
import { emiModel } from '../database/mysql/emi'
import { emiTransactionModel } from '../database/mysql/emiTransactions'
import { leadModel } from '../database/mysql/leads'
import { otherChargesModel } from '../database/mysql/otherCharges'
import { waiverModel } from '../database/mysql/waiver'
import { EmiStatus } from '../enums/emi.enum'
import { Products } from '../enums/product.enum'
import { WaiverStatus, WaiverType } from '../enums/waiver.enum'
import CommonHelper from '../helpers/common'
import { ICredit } from '../interfaces/credit.interface'
import { IEmi, IEmiPermanentWaiverPayload, TSelectEmi } from '../interfaces/emi.interface'
import { ILoan } from '../interfaces/loan.interface'
import { IOtherCharges } from '../interfaces/other_charges.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import { SelectFields, SortCriteria, WhereQuery } from '../types/model.types'
import { logger } from '../utils/logger'
import { calculateBounceCharge, calculatePenalty, round } from '../utils/util'
import { creditService } from './credit.service'
import { loanService } from './loan.service'
import { transactionService } from './transaction.service'

export class EmiService {
  private readonly emiModel = emiModel
  private readonly otherChargesModel = otherChargesModel
  private readonly emiTransactionModel = emiTransactionModel
  private readonly leadModel = leadModel
  private readonly creditModel = creditModel
  private readonly callHistoryLogsModel = callHistoryLogsModel
  private readonly creditService = creditService
  private readonly loanService = loanService
  private readonly transactionService = transactionService
  private readonly waiverModel = waiverModel

  async findOne(where: WhereQuery<IEmi>, select: TSelectEmi[] | ['*'] = ['*']): Promise<IEmi> {
    return await this.emiModel.findOneEmi(where, select)
  }

  async updateOne(where: Partial<IEmi> | Function, update: Partial<IEmi>): Promise<number> {
    return await this.emiModel.findOneAndUpdate(where, update)
  }

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let razorpay_emOrder_count = await this.emiModel.countEMI(where)
      if (razorpay_emOrder_count == null) {
        return 0
      } else {
        return razorpay_emOrder_count // Return the first lead if found
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

  async processManualPayment(
    paymentDetails: { amount: number; paymentDate: Date },
    credit: ICredit,
  ): Promise<void> {
    const emis = await this.findDueOrPartialEmis(credit.creditID)

    let amountRemains = paymentDetails.amount

    for (let emi of emis) {
      try {
        if (amountRemains <= 0) break
        paymentDetails.paymentDate = paymentDetails.paymentDate ?? new Date()
        //const currentDate = new Date()
        // const currentDate = paymentDetails.paymentDate
        const currentDate = new Date(paymentDetails.paymentDate)
        let details = {
          interest: 0,
          principal: 0,
          penalty: 0,
          bounceCharge: 0,
          updatePenalty: 0,
          updateBrokenPeriodIntrest: 0,
          paymentReceived: 0,
        }

        // Safely compare actualPaymentDate and dueDate
        let dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'))

        if (
          emi.actualPaymentDate !== null &&
          new Date(emi.actualPaymentDate) > new Date(emi.dueDate)
        ) {
          dueDate = emi.actualPaymentDate
        }

        // Set interest, principal, penalty, and bounceCharge based on emi status
        let interest = emi.status === 'partially-paid' ? emi.amountRemainsInterest : emi.interest

        let principal = emi.status === 'partially-paid' ? emi.amountRemains : emi.principal

        let penalty = emi.status === 'partially-paid' ? emi.amountRemainsPenalty : emi.panelty

        details.updatePenalty = emi.panelty
        // Calculate bounceCharge based on the emi status

        let bounceCharge =
          emi.status === 'partially-paid' ? emi.amountRemainsBrokenPeriodIntrest : 0

        // Ensure dueDate is a valid Date object
        const emiDueDate = new Date(dueDate)

        // Calculate the delay in days between the current date and emi due date
        let delayDays = differenceInCalendarDays(currentDate, emiDueDate)
        if (delayDays < 0) {
          delayDays = 0
        }
        if (bounceCharge == 0 && emi.status === 'partially-paid' && delayDays > 0) {
          bounceCharge = +calculateBounceCharge()
        }
        // Calculate the penalty and bounceCharge if delayDays > 0
        if (delayDays > 0) {
          let penaltyAgain = round(+calculatePenalty(principal, delayDays, credit.roi))
          penalty += penaltyAgain
          await this.savePenalty(credit, emi.emiID, penaltyAgain, 'penalty')

          if (emi.status != 'partially-paid') {
            bounceCharge = +calculateBounceCharge()

            await this.savePenalty(credit, emi.emiID, bounceCharge, 'Bounce Charge')
          }

          details.updatePenalty = details.updatePenalty + penaltyAgain
        }
        if (delayDays > 0) {
          details.updateBrokenPeriodIntrest = calculateBounceCharge()
        } else {
          details.updateBrokenPeriodIntrest = emi.brokenPeriodIntrest
        }

        //details.updateBrokenPeriodIntrest = this.emiService.bounceCharge();

        if (emi.status == 'due' && delayDays > 0) {
          details.updateBrokenPeriodIntrest = calculateBounceCharge()
        } else {
          details.updateBrokenPeriodIntrest = details.updateBrokenPeriodIntrest
        }

        details.paymentReceived = +emi.paymentReceived
        // Subtract payment from interest first, then principal, then penalty
        let interestPaid = 0
        if (amountRemains > 0 && interest > 0) {
          interestPaid = Math.min(amountRemains, interest)
          interest -= interestPaid
          amountRemains -= interestPaid
          details.paymentReceived += interestPaid
        }
        details.interest = interest
        let principalPaid = 0
        if (amountRemains > 0 && principal > 0) {
          principalPaid = Math.min(amountRemains, principal)
          principal -= principalPaid
          amountRemains -= principalPaid
          details.paymentReceived += principalPaid
        }
        details.principal = principal
        let penaltyPaid = 0
        if (amountRemains > 0 && penalty > 0) {
          penaltyPaid = Math.min(amountRemains, penalty)
          penalty -= penaltyPaid
          amountRemains -= penaltyPaid
          details.paymentReceived += penaltyPaid
        }
        details.penalty = penalty
        let bounceChargePaid = 0
        if (amountRemains > 0 && bounceCharge > 0) {
          bounceChargePaid = Math.min(amountRemains, bounceCharge)
          bounceCharge -= bounceChargePaid
          amountRemains -= bounceChargePaid
          details.paymentReceived += bounceChargePaid
        }
        details.bounceCharge = bounceCharge
        const totalSum =
          details.interest + details.principal + details.penalty + details.bounceCharge
        // ! add waiver_amount field
        const status = totalSum > 0 ? 'partially-paid' : 'paid'
        // ! For waiver amount
        // ! If emi amount 10k, waiver given for 2k, means amount to be paid is 8k, now total_sum should have a value of 2k, if this amount is equal the one in waiver table, we mark the customr paid
        // ! in updatePartial function we also add waiver_amount field when saving
        await this.updateEmiStatusToPartial(
          emi,
          amountRemains,
          delayDays,
          paymentDetails,
          details,
          status,
        )
        const transSave = {
          // transaction_id: paymentDetails.trans.id,
          // order_id: paymentDetails.trans.order_id,
          transaction_id: 1,
          order_id: '2',
          emi_id: emi.emiID,
          interest: interestPaid,
          principal: principalPaid,
          penalty: penaltyPaid,
          dpd_amount: bounceChargePaid,
          transaction_date: currentDate,
          lead_id: credit.creditID,
          emi_status: status,
        }
        await this.emiTransactionModel.insert(
          transSave.transaction_id,
          transSave.order_id,
          transSave.emi_id,
          transSave.interest,
          transSave.principal,
          transSave.penalty,
          transSave.dpd_amount,
          transSave.transaction_date,
          transSave.lead_id,
          transSave.emi_status,
        )
      } catch (error) {
        console.error('Error calculating dueDate: ', error.message)
      }
      // Calculate total due, ensuring amountPayable and penalty are valid numbers
      /*
          const totalDue = Number(amountPayable) + Number(penalty);
          if (amountRemains >= totalDue) {

            amountRemains -= totalDue;
            await this.updateEmiStatusToPaid(emi, delayDays, paymentDetails, penalty);
            await this.handleTransaction(emi, paymentDetails, credit, loan);
          } else if (amountRemains > 0) {
            await this.updateEmiStatusToPartial(emi, amountRemains, delayDays, paymentDetails);
            await this.handleTransaction(emi, paymentDetails, credit, loan);
            break;
          } else {
            break;
          }

          */
    }

    try {
      const creditID = credit.creditID
      const lastEmiCollection = await this.emiModel.findLastEmi({ creditID }, [
        'emiID',
        'accessAmount',
        'dueDate',
      ])
      const accessAmount = +lastEmiCollection.accessAmount + amountRemains
      const emiID = lastEmiCollection.emiID
      if (amountRemains > 0) {
        await this.emiModel.findOneAndUpdate({ emiID }, { accessAmount })
      }

      const emiRemains = await this.countRemainingEmis(credit.creditID)

      await this.creditModel.updateCreditStatus(emiRemains, credit, paymentDetails.amount)

      const lead = await this.leadModel.findOne({ where: { leadID: credit.leadID } })

      await this.callHistoryLogsModel.createCallHistoryLog(
        credit,
        lead,
        paymentDetails.amount.toString(),
      )

      await CommonHelper.lastEMIUpdater(
        emiRemains,
        credit.creditID,
        lastEmiCollection.dueDate,
        credit.actualTenure,
        credit.leadID,
      )
    } catch (error) {
      console.error('Error calculating dueDate: ', error.message)
    }
  }

  async processEmiWaiverPermanent(payload: IEmiPermanentWaiverPayload): Promise<void> {
    const emi = await this.emiModel.findOne({
      where: { emiID: payload.emiID, leadID: payload.leadID },
      // select: ['creditID','dueDate','actualPaymentDate','amountRemainsInterest','status'],
    })

    const credit = await this.creditModel.findOneCredit({ creditID: emi.creditID })

    let amountRemains = +payload.amount.toFixed(2)

    if (amountRemains <= 0) return
    payload.paymentDate = payload.paymentDate ?? new Date()
    //const currentDate = new Date()
    // const currentDate = paymentDetails.paymentDate
    const currentDate = new Date(payload.paymentDate)
    let details = {
      interest: 0,
      principal: 0,
      penalty: 0,
      bounceCharge: 0,
      updatePenalty: 0,
      updateBrokenPeriodIntrest: 0,
      paymentReceived: 0,
    }

    // Safely compare actualPaymentDate and dueDate
    let dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'))

    if (emi.actualPaymentDate !== null && new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) {
      dueDate = emi.actualPaymentDate
    }

    // Set interest, principal, penalty, and bounceCharge based on emi status
    let interest = emi.status === 'partially-paid' ? emi.amountRemainsInterest : emi.interest

    let principal = emi.status === 'partially-paid' ? emi.amountRemains : emi.principal

    let penalty = emi.status === 'partially-paid' ? emi.amountRemainsPenalty : emi.panelty

    details.updatePenalty = emi.panelty
    // Calculate bounceCharge based on the emi status

    let bounceCharge = emi.status === 'partially-paid' ? emi.amountRemainsBrokenPeriodIntrest : 0

    // Ensure dueDate is a valid Date object
    const emiDueDate = new Date(dueDate)

    // Calculate the delay in days between the current date and emi due date
    let delayDays = differenceInCalendarDays(currentDate, emiDueDate)
    if (delayDays < 0) {
      delayDays = 0
    }
    if (bounceCharge == 0 && emi.status === 'partially-paid' && delayDays > 0) {
      bounceCharge = +calculateBounceCharge()
    }
    // Calculate the penalty and bounceCharge if delayDays > 0
    if (delayDays > 0) {
      let penaltyAgain = round(+calculatePenalty(principal, delayDays, credit.roi))
      penalty += penaltyAgain
      await this.savePenalty(credit, emi.emiID, penaltyAgain, 'penalty')

      if (emi.status != 'partially-paid') {
        bounceCharge = +calculateBounceCharge()

        await this.savePenalty(credit, emi.emiID, bounceCharge, 'Bounce Charge')
      }

      details.updatePenalty = details.updatePenalty + penaltyAgain
    }
    if (delayDays > 0) {
      details.updateBrokenPeriodIntrest = calculateBounceCharge()
    } else {
      details.updateBrokenPeriodIntrest = emi.brokenPeriodIntrest
    }

    //details.updateBrokenPeriodIntrest = this.emiService.bounceCharge();

    if (emi.status == 'due' && delayDays > 0) {
      details.updateBrokenPeriodIntrest = calculateBounceCharge()
    } else {
      details.updateBrokenPeriodIntrest = details.updateBrokenPeriodIntrest
    }

    details.paymentReceived = +emi.paymentReceived
    // Subtract payment from interest first, then principal, then penalty
    let interestPaid = 0
    if (amountRemains > 0 && interest > 0) {
      interestPaid = Math.min(amountRemains, interest)
      interest -= interestPaid
      amountRemains -= interestPaid
      details.paymentReceived += interestPaid
    }
    details.interest = interest
    let principalPaid = 0
    if (amountRemains > 0 && principal > 0) {
      principalPaid = Math.min(amountRemains, principal)
      principal -= principalPaid
      amountRemains -= principalPaid
      details.paymentReceived += principalPaid
    }
    details.principal = principal
    let penaltyPaid = 0
    if (amountRemains > 0 && penalty > 0) {
      penaltyPaid = Math.min(amountRemains, penalty)
      penalty -= penaltyPaid
      amountRemains -= penaltyPaid
      details.paymentReceived += penaltyPaid
    }
    details.penalty = penalty
    let bounceChargePaid = 0
    if (amountRemains > 0 && bounceCharge > 0) {
      bounceChargePaid = Math.min(amountRemains, bounceCharge)
      bounceCharge -= bounceChargePaid
      amountRemains -= bounceChargePaid
      details.paymentReceived += bounceChargePaid
    }
    details.bounceCharge = bounceCharge
    const totalSum = details.interest + details.principal + details.penalty + details.bounceCharge
    const status = totalSum > 0 ? 'partially-paid' : 'paid'

    await this.updateEmiStatusToPartial(
      emi,
      amountRemains,
      delayDays,
      payload,
      details,
      status,
      +payload.amount.toFixed(2),
      parseFloat(emi.waive_off_amount as unknown as string),
    )

    const creditID = credit.creditID
    const lastEmiCollection = await this.emiModel.findLastEmi({ creditID }, [
      'emiID',
      'accessAmount',
      'dueDate',
    ])
    // const accessAmount = +lastEmiCollection.accessAmount + amountRemains
    // const emiID = lastEmiCollection.emiID

    // if (amountRemains > 0) {
    //   await this.emiModel.findOneAndUpdate({ emiID }, { accessAmount })
    // }

    const emiRemains = await this.countRemainingEmis(credit.creditID)

    await this.creditModel.updateCreditStatus(emiRemains, credit, +payload.amount.toFixed(2), true)

    // const lead = await this.leadModel.findOne({ where: { leadID: credit.leadID } })

    // await this.callHistoryLogsModel.createCallHistoryLog(credit, lead, payload.amount.toString())

    await CommonHelper.lastEMIUpdater(
      emiRemains,
      credit.creditID,
      lastEmiCollection.dueDate,
      credit.actualTenure,
      credit.leadID,
    )
  }

  async findDueOrPartialEmis(creditID: number): Promise<IEmi[]> {
    return await this.emiModel.find({
      where: knex => {
        knex
          .where(query => query.where('status', 'partially-paid').orWhere('status', 'due'))
          .andWhere('creditID', creditID)
          .andWhere('is_deleted', 0)
      },
      order: [{ column: 'emiID', order: 'asc' }],
    })
  }

  async find(
    where: WhereQuery<IEmi>,
    order: SortCriteria<TSelectEmi>,
    select: SelectFields<TSelectEmi>,
  ): Promise<IEmi[]> {
    return await this.emiModel.findAll(where, order, select)
  }

  async savePenalty(
    credit,
    emiID: number,
    bounceCharge: number,
    discription: string,
  ): Promise<void> {
    await this.createOtherCharges(
      {
        creditID: credit.creditID,
        customerID: credit.customerID,
        transectionID: 0,
        discription: discription,
        loanID: 0,
        leadID: credit.leadID,
      },
      emiID,
      bounceCharge,
    )
  }

  async createOtherCharges(other: IOtherCharges, emi: number, amount: number): Promise<void> {
    await this.otherChargesModel.insert(
      emi,
      other.creditID,
      amount,
      other.customerID,
      other.transectionID,
      other.discription,
    )
  }

  public async updateEmiStatusToPartial(
    emi: IEmi,
    amountRemains: number,
    delayDays: number,
    paymentDetails: any,
    details: any,
    status: string,
    waive_off_amount?: number,
    prevWaiver?: number,
  ): Promise<void> {
    await this.emiModel.findOneAndUpdate(
      { emiID: emi.emiID },
      {
        status: status,
        // ! hasn't actually paid
        // actualPaymentDate: paymentDetails.paymentDate
        //   ? moment(paymentDetails.paymentDate).tz('Asia/Kolkata').toDate()
        //   : moment().tz('Asia/Kolkata').toDate(),
        delayDays,
        amountRemains: details.principal,
        amountRemainsInterest: details.interest,
        amountRemainsPenalty: details.penalty,
        amountRemainsBrokenPeriodIntrest: details.bounceCharge,
        panelty: details.updatePenalty,
        brokenPeriodIntrest: details.updateBrokenPeriodIntrest,
        // hasn't actually paid
        ...(waive_off_amount == undefined && { paymentReceived: details.paymentReceived }),
        ...(waive_off_amount == undefined && { paymentID: paymentDetails.id }),
        ...(waive_off_amount !== undefined && { waive_off_amount: prevWaiver + waive_off_amount }), // only adds if defined
      },
    )
  }

  public bounceCharge = (): number => {
    const fixedBounce = +config.dpdPenalty
    const gst = Math.round(fixedBounce * (+config.gst / 100))
    const totalBounce = fixedBounce + gst

    return totalBounce
  }

  // Helper function to calculate last payment date
  public calculateLastPaymentDate = transactions => {
    let lastPaymentDate = ''
    if (!transactions) {
      return lastPaymentDate
    }
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].status === 1) {
        lastPaymentDate = transactions[i].createdAt
        break // Exit the loop once the condition is met
      }
    }
    return lastPaymentDate
  }

  public calculatePenalty = (emiAmount: number, overdueDays: number, roi: number): number => {
    const perDay = roi / 365 + 0.1
    const result = ((emiAmount * perDay) / 100) * overdueDays
    const fixResult = this.roundToTwo(result)
    return fixResult
  }

  public roundToTwo = (num: number) => Math.ceil(num)

  public calculatePendingAmount = (emi: any, delayDays: number) => {
    const pendingBounce =
      emi.status == 'paid'
        ? 0
        : emi.status === 'partially-paid'
        ? emi.amountRemainsBrokenPeriodIntrest
        : delayDays > 0
        ? this.bounceCharge()
        : 0

    const pendingPenality =
      emi.status == 'paid'
        ? 0
        : emi.status === 'partially-paid'
        ? emi.amountRemainsPenalty
        : emi.panelty

    const payAmount =
      emi.status == 'paid' ? 0 : emi.status === 'partially-paid' ? emi.amountRemains : emi.principal

    const pendingInterest =
      emi.status == 'paid'
        ? 0
        : emi.status === 'partially-paid'
        ? emi.amountRemainsInterest
        : emi.interest

    return pendingPenality + payAmount + pendingBounce + pendingInterest
  }

  async countRemainingEmis(creditID: number): Promise<number> {
    const countRow = await this.emiModel.countEMI(query =>
      query
        .where(q => q.where('status', 'partially-paid').orWhere('status', 'due'))
        .andWhere('creditID', creditID),
    )
    return +countRow
  }

  public processTransaction = (transection: any) => {
    const { amount, status, mode, referenceNo, createdAt } = transection

    const formattedStatus = status === 1 ? 'Success' : 'Failed'
    const formattedDate = new Date(createdAt)
      .toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      .replace(',', '')

    return {
      amount: { text: 'Amount', value: amount, color: '#1F1F1F', bgColor: '' },
      status: {
        text: 'Status',
        value: formattedStatus,
        color: status === 1 ? '#14D44A' : '#D93C3C',
        bgColor: '',
      },
      createdAt: {
        text: 'Date & Time',
        value: formattedDate,
        color: '#585858',
        bgColor: '',
      },
      referenceNo: {
        text: 'Transaction ID',
        value: referenceNo,
        color: '#585858',
        bgColor: '',
      },
      mode: {
        text: 'Payment mode',
        value: mode,
        color: '#585858',
        bgColor: '',
      },
    }
  }

  public processEmiV2 = async (emi: any, credit: ICredit) => {
    let dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'))
    let diffDate = dueDate
    let penalityDays = 0
    let dpd = ''
    const currentDate = new Date()
    let delayDays = Math.max(0, differenceInCalendarDays(currentDate, dueDate))
    emi.actualEmiAmount = emi.amountPayable

    if (new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) {
      diffDate = emi.actualPaymentDate
      penalityDays = Math.max(0, differenceInCalendarDays(currentDate, diffDate))
    } else {
      penalityDays = delayDays
    }

    if (delayDays > 0 && emi.status !== 'partially-paid' && emi.status !== 'paid') {
      emi.brokenPeriodIntrest = this.bounceCharge()
      emi.amountRemainsInterest = 0
      emi.amountRemainsPenalty = 0
      emi.panelty = this.roundToTwo(this.calculatePenalty(emi.principal, penalityDays, credit.roi))
      //emi.panelty = this.emiService.roundToTwo(emi.panelty);
      emi.amountRemainsBrokenPeriodIntrest = 0
      emi.amountPayable = this.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest,
      )
    } else if (emi.status == 'partially-paid') {
      emi.brokenPeriodIntrest =
        emi.brokenPeriodIntrest == 0 && penalityDays > 0
          ? this.bounceCharge()
          : emi.brokenPeriodIntrest
      emi.panelty =
        +emi.panelty + this.calculatePenalty(emi.amountRemains, penalityDays, credit.roi)
      emi.panelty = this.roundToTwo(emi.panelty)
      emi.amountPayable = this.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest - emi.paymentReceived,
      )
    } else if (emi.status == 'paid') {
      emi.amountPayable = this.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest,
      )
      if (new Date(emi.actualPaymentDate) > new Date(emi.dueDate))
        dpd = String(Math.max(0, differenceInCalendarDays(emi.actualPaymentDate, emi.dueDate)))
    }

    const pendingAmount = this.roundToTwo(this.calculatePendingAmount(emi, delayDays))
    const totalPaid = this.roundToTwo(emi.paymentReceived) //await this.transectionService.sumOfTransaction(emi.emiID);
    let setBounceFee = delayDays > 0 ? this.bounceCharge() : 0
    const waiver = await this.waiverModel.findOne({
      where: {
        credit_id: credit.creditID,
        emi_id: emi.emiID,
        type: WaiverType.TEMPORARY,
        product: Products.EMI,
        status: WaiverStatus.APPROVED,
        is_paid: false,
      },
      select: ['emi_id', 'amount', 'id'],
    })

    const amountPayable = waiver
      ? this.roundToTwo(emi.amountPayable) -
        this.roundToTwo(emi.waive_off_amount) -
        this.roundToTwo(waiver.amount)
      : this.roundToTwo(emi.amountPayable) - this.roundToTwo(emi.waive_off_amount)

    emi.amountPayable = amountPayable
    emi.waive_off_amount = this.roundToTwo(emi.waive_off_amount)
    emi.tempAmountPayable = waiver ? emi.amountPayable - this.roundToTwo(waiver.amount) : 0
    emi.isTempWaiverActive = waiver ? true : false
    setBounceFee = this.roundToTwo(setBounceFee)
    // emi.status = this.updateEmiStatus(emi, delayDays);
    emi.dueDate = dueDate
    let blanceColor: string
    ;(emi as any).lists = [
      {
        text: 'Principal',
        value: `₹${emi.principal}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Interest',
        value: `₹${emi.interest}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Penalty',
        value: `₹${emi.panelty}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Bounce Charges (incl. GST)',
        value: `₹${emi.brokenPeriodIntrest}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Amount Paid',
        value: `₹${totalPaid}`,
        color: '#F33C3C',
        bgcolor: '',
      },
      {
        text: 'Balance Amount',
        value: `₹${pendingAmount}`,
        color: '#182BDA',
        bgcolor: '',
      },
    ]

    if (delayDays > 0 && emi.status != 'paid') {
      emi.status = 'Overdue'
      emi.color = '#F33C3C'
      emi.bgcolor = '#FCE0E0'
      blanceColor = '#F33C3C'
    } else {
      switch (emi.status) {
        case 'paid':
          emi.status = 'Paid'
          emi.color = '#0EBB53'
          emi.bgcolor = '#E5F6EC'
          break
        case 'partially-paid':
          emi.status = 'Part Paid'
          emi.color = '#D4AF37'
          emi.bgcolor = '#F9F5E9'
          break
        default:
          emi.status = 'Due'
          emi.color = '#182BDA'
          emi.bgcolor = '#E6E8FA'
          break
      }
    }

    ;(emi as any).lists = [
      {
        text: 'Principal',
        value: `₹${emi.principal}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Interest',
        value: `₹${emi.interest}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Penalty',
        value: `₹${emi.panelty}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Bounce Charges (incl. GST)',
        value: `₹${emi.brokenPeriodIntrest}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Amount Paid',
        value: `-₹${totalPaid}`,
        color: '#14D44A',
        bgcolor: '',
      },
      {
        text: 'Balance Amount',
        value: `₹${pendingAmount}`,
        color: blanceColor,
        bgcolor: '',
      },
    ]

    return emi
  }

  public async getRepaymentDataV2(leadId: number, customerID: number): Promise<any> {
    // Fetch credit and loan details concurrently
    const [credit, loanData] = await Promise.all([
      this.creditService.findOne({ leadID: leadId }, [
        'creditID',
        'leadID',
        'tenure',
        'amountToBeRepayed',
        'principal',
        'firstDueDate',
        'roi',
        'created_at',
      ]) as Promise<ICredit>,
      this.loanService.findOne({ leadID: leadId }, ['loanNo', 'disbursalDate']) as Promise<ILoan>,
    ])

    if (!credit) {
      throw new Error('No Active Emi Loan Found')
    }
    if (!loanData) {
      throw new Error('No loan Data found for this customer')
    }

    // Fetch EMIs and transactions concurrently
    const [getEmis, transactions] = await Promise.all([
      this.find(
        { creditID: credit.creditID, is_deleted: 0 },
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
      ),
      this.transactionService.findTransaction(
        { customerID },
        { orderKey: 'id', orderValue: 'desc' },
        ['amount', 'status', 'mode', 'referenceNo', 'createdAt'],
        ['collection'],
      ),
    ])

    if (!getEmis) {
      throw new Error('No Emis breakdown found')
    }

    // Process EMI Data
    const processedEmis = await Promise.all(
      getEmis.map(async emi => this.processEmiV2(emi, credit)),
    )

    let tempAmountPayable: number
    let isTempWaiverActive: number
    for (let i = 0; i < processedEmis.length; i++) {
      if (
        processedEmis[i].status === 'Part Paid' ||
        processedEmis[i].status === 'Due' ||
        processedEmis[i].status === 'Overdue'
      ) {
        credit.firstDueDate = processedEmis[i].dueDate
        credit.amountToBeRepayed = processedEmis[i].amountPayable
        tempAmountPayable = processedEmis[i].tempAmountPayable
        isTempWaiverActive = processedEmis[i].isTempWaiverActive
        break // Exit the loop once the condition is met
      }
    }

    let totalRepay = 0
    for (let i = 0; i < processedEmis.length; i++) {
      if (
        processedEmis[i].status === 'Part Paid' ||
        processedEmis[i].status === 'Due' ||
        processedEmis[i].status === 'Overdue'
      ) {
        totalRepay += processedEmis[i].amountPayable
      }
    }

    const lastPaymentDate = this.calculateLastPaymentDate(transactions)
    const Emi = getEmis[0]?.principal + getEmis[0]?.interest || 0
    const loanSummary = {
      ...credit,
      Emi,
      loanNumber: loanData.loanNo,
      disbursalDate: loanData.disbursalDate,
      lastPaymentDate,
      totalRepay,
    }
    // Prepare transaction details
    const getTransections = transactions
      ? transactions.map(transection => this.processTransaction(transection))
      : []

    const emiDocs = [
      {
        text: 'Loan Agreement',
        link: 'https://example.com/loan-agreement.pdf',
      },
      {
        text: 'Sanction Letter',
        link: 'https://example.com/sanction-letter.pdf',
      },
      {
        text: 'Account Statement',
        link: 'https://example.com/loan-statement.pdf',
      },
    ]

    return { loanSummary, processedEmis, getTransections, emiDocs }
  }

  public processEmi = async (emi: any, credit: ICredit) => {
    let dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'))
    let diffDate = dueDate
    let penalityDays = 0
    const currentDate = new Date()
    let delayDays = Math.max(0, differenceInCalendarDays(currentDate, dueDate))

    if (new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) {
      diffDate = emi.actualPaymentDate
      penalityDays = Math.max(0, differenceInCalendarDays(currentDate, diffDate))
    } else {
      penalityDays = delayDays
    }

    if (delayDays > 0 && emi.status !== 'partially-paid' && emi.status !== 'paid') {
      emi.brokenPeriodIntrest = this.bounceCharge()
      emi.amountRemainsInterest = 0
      emi.amountRemainsPenalty = 0
      emi.panelty = this.roundToTwo(this.calculatePenalty(emi.principal, penalityDays, credit.roi))
      //emi.panelty = this.emiService.roundToTwo(emi.panelty);
      emi.amountRemainsBrokenPeriodIntrest = 0
      emi.amountPayable = this.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest,
      )
    } else if (emi.status == 'partially-paid') {
      emi.panelty =
        +emi.panelty + this.calculatePenalty(emi.amountRemains, penalityDays, credit.roi)
      emi.panelty = this.roundToTwo(emi.panelty)
      emi.amountPayable = this.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest - emi.paymentReceived,
      )
    } else if (emi.status == 'paid') {
      emi.amountPayable = this.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest,
      )
    }

    const pendingAmount = this.roundToTwo(this.calculatePendingAmount(emi, delayDays))
    const totalPaid = this.roundToTwo(emi.paymentReceived) //await this.transectionService.sumOfTransaction(emi.emiID);
    let setBounceFee = delayDays > 0 ? this.bounceCharge() : 0
    emi.amountPayable = this.roundToTwo(emi.amountPayable)
    setBounceFee = this.roundToTwo(setBounceFee)
    // emi.status = this.updateEmiStatus(emi, delayDays);
    emi.dueDate = dueDate
    ;(emi as any).lists = [
      {
        text: 'Principal',
        value: `₹${emi.principal}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Interest',
        value: `₹${emi.interest}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Penalty',
        value: `₹${emi.panelty}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Bounce Charges (incl. GST)',
        value: `₹${emi.brokenPeriodIntrest}`,
        color: '#5A5A5A',
        bgcolor: '',
      },
      {
        text: 'Amount Paid',
        value: `₹${totalPaid}`,
        color: '#F33C3C',
        bgcolor: '',
      },
      {
        text: 'Balance Amount',
        value: `₹${pendingAmount}`,
        color: '#182BDA',
        bgcolor: '',
      },
    ]

    if (delayDays > 0 && emi.status != 'paid') {
      emi.status = 'Overdue'
      emi.color = '#F33C3C'
      emi.bgcolor = '#FCE0E0'
    } else {
      switch (emi.status) {
        case 'paid':
          emi.status = 'Paid'
          emi.color = '#0EBB53'
          emi.bgcolor = '#E5F6EC'
          break
        case 'partially-paid':
          emi.status = 'Part Paid'
          emi.color = '#D4AF37'
          emi.bgcolor = '#F9F5E9'
          break
        default:
          emi.status = 'Due'
          emi.color = '#182BDA'
          emi.bgcolor = '#E6E8FA'
          break
      }
    }
    // Add current Status value
    let currentStatus = emi.status
    if (emi.status === EmiStatus.OVERDUE && !emi.actualPaymentDate) {
      currentStatus = EmiStatus.DUE
    } else if (emi.status === EmiStatus.OVERDUE && emi.actualPaymentDate) {
      currentStatus = EmiStatus.PART_PAYMENT
    }
    const data = {
      ...emi,
      currentStatus: currentStatus,
    }
    return data
  }

  public async createEMI(
    creditID: number,
    customerID: number,
    leadID: number,
    productID: number,
    principal: number,
    interest: number,
    openingBalance: number,
    closingBalance: number,
    emiNUmber: number,
    roi: number,
    firstDueDate: Date,
  ): Promise<{}> {
    try {
      let dueDate: Date
      // let daysInBPI: number = 0
      // let brokenPeriodIntrest = 0
      if (emiNUmber == 1) {
        dueDate = new Date(firstDueDate)
      } else {
        let lastEmi = await this.emiModel.findAll(
          { productID },
          [{ column: 'emiID', order: 'desc' }],
          ['dueDate'],
        )
        dueDate = new Date(lastEmi[0].dueDate)
        dueDate.setMonth(dueDate.getMonth() + 1)
      }
      // console.log(documentToBeInserted)
      // if (emiNUmber == 1 && daysInBPI > 0) {
      //   brokenPeriodIntrest = openingBalance * (roi / 100) * (daysInBPI / 365)
      //   interest += brokenPeriodIntrest
      // }
      await this.emiModel.insertEMI(
        creditID,
        customerID,
        leadID,
        productID,
        principal,
        interest,
        openingBalance,
        closingBalance,
        dueDate,
      )
      return { success: true, message: 'EMI Created !', statusCode: 200 }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Something Went Wrong: Create EMI Function',
        statusCode: 500,
      }
    }
  }

  async findLastEmi(where: WhereQuery<IEmi>, select: TSelectEmi[] | ['*'] = ['*']) {
    return await this.emiModel.findLastEmi(where, select)
  }
}

export const emiService = new EmiService()
