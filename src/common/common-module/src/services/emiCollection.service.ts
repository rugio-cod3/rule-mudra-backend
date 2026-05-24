import { LeadStatus } from '@/enums/lead.enum'
import CommonHelper from '@/helpers/common'
import { ICredit } from '@/interfaces/credit.interface'
import { ICustomer } from '@/interfaces/customer.interface'
import { IEmi } from '@/interfaces/emi.interface'
import { ILead } from '@/interfaces/lead.interface'
import { ILoan } from '@/interfaces/loan.interface'
import { IOnlinePayment } from '@/interfaces/onlinepayment.interface'
import { ITransection } from '@/interfaces/transections.interface'
import CreditService from '@/services/credit.service'
import LoanService from '@/services/loan.service'
import OnlinePaymentService from '@/services/onlinepayment.service'
import OnlinePaymentLogService from '@/services/onlinepaymentlog.services'
import { Request } from 'express'
import moment from 'moment-timezone'
import { emiModel } from '../database/mysql/emi'
import { IEmiReCalculationResponse } from '../interfaces/emi.interface'
import { EmiService } from './emi.service'

export interface IAuthenticatedRequest extends Request {
  customer: ICustomer
}

// Interface for payment details
interface IPaymentDetails {
  interest: number
  principal: number
  penalty: number
  bounceCharge: number
  updatePenalty: number
  updateBrokenPeriodIntrest: number
  paymentReceived: number
}

class EmiCollectionService {
  [x: string]: any
  private creditService = new CreditService()
  private loanService = new LoanService()
  private emiService = new EmiService()
  private onlinePaymentLogService = new OnlinePaymentLogService()
  private onlinePaymentServices = new OnlinePaymentService()
  private readonly emiModel = emiModel

  // Payment related methods

  /**
   * Finds an online payment by its order ID
   */
  public async findOnlinePayment(orderId: string): Promise<IOnlinePayment | null> {
    return (await this.onlinePaymentServices.findOne(
      { razorpayOrderId: orderId },
      { orderKey: 'pID', orderValue: 'desc' },
      ['*'],
    )) as IOnlinePayment
  }

  /**
   * Logs payment update details
   */
  public async logPaymentUpdate(pID: any, paymentDetails: any, payload: any): Promise<void> {
    await this.onlinePaymentLogService.create(
      pID,
      paymentDetails.order_id,
      paymentDetails.id,
      paymentDetails.status,
      payload,
    )
  }

  // Data retrieval methods

  /**
   * Finds credit information by lead ID
   */
  public async findCredit(leadID: number): Promise<ICredit | null> {
    return await this.creditService.findOne({ leadID }, ['*'])
  }

  /**
   * Finds the last EMI for a credit
   */
  public async findLastEmi(creditID: number): Promise<IEmi | null> {
    return await this.emiService.findOne({ creditID }, ['*'])
  }

  /**
   * Finds loan information by lead ID
   */
  public async findLoan(leadID: number): Promise<ILoan | null> {
    return await this.loanService.findOne({ leadID }, ['loanNo'])
  }

  /**
   * Finds EMI by ID
   */
  public async findEmiById(emiID: number): Promise<IEmi | null> {
    return await this.emiService.findOne({ emiID }, ['*'])
  }

  /**
   * Processes a captured payment
   */
  public async processCapturedPayment(
    emi: IEmi,
    paymentDetails: any,
    credit: ICredit,
    lastEmi: IEmi,
    loan: ILoan,
  ): Promise<void> {
    const status = parseInt(paymentDetails.amount) < emi.amountRemains ? 'partially-paid' : 'paid'
    const delayDays = this.calculateDelayDays(emi.dueDate)

    await this.emiService.updateOne(
      { emiID: emi.emiID },
      {
        status,
        actualPaymentDate: new Date(),
        delayDays,
        paymentID: paymentDetails.id,
      },
    )

    const emiRemains = await this.countRemainingEmis(credit.creditID)
    await this.updateCreditStatus(emiRemains, credit, paymentDetails.amount)

    const lead = await this.findLead(credit.leadID)
    await this.createCallHistoryLog(credit, lead, paymentDetails.amount)

    await this.handleTransaction(paymentDetails, credit, loan, 1)

    await CommonHelper.lastEMIUpdater(
      emiRemains,
      credit.creditID,
      lastEmi.dueDate,
      credit.actualTenure,
      credit.leadID,
    )
  }

  /**
   * Processes a manual payment against EMIs in chronological order of due dates
   * Uses global variables to track excess amount and required amount across iterations
   *
   * @param transactionDetails - Payment transaction details
   * @param credit - Credit information
   * @param emis - Array of EMIs to process
   * @param resultEmis - Object to store the processed EMI results
   * @returns Object with updated EMI details
   */
  public async processManualPayment(
    transactionDetails: any,
    excessAmount: number,
    credit: ICredit,
    emis: IEmiReCalculationResponse[],
    resultEmis: { [key: string]: IEmiReCalculationResponse },
  ) {
    try {
      // Set global excess amount and current transaction amount
      let remainingTransactionAmount = Number(transactionDetails.amount) || 0

      // Process EMIs one by one, fully settling each before moving to the next
      for (let i = 0; i < emis.length; i++) {
        const emi = emis[i]

        // Skip fully paid EMIs
        if (remainingTransactionAmount <= 0) {
          break
        }

        // Process this EMI with the current transaction and excess amount
        const emiDetails = await this.processEmiPayment(
          emi,
          credit,
          transactionDetails,
          excessAmount,
          remainingTransactionAmount,
        )

        if (emiDetails.status === 'paid') {
          // Update remaining transaction amount
          remainingTransactionAmount = emiDetails.accessAmount
          emiDetails.accessAmount = 0
        } else {
          // EMI is partially paid, no excess to carry forward
          excessAmount = 0
          remainingTransactionAmount = 0
          // Update EMI details with the remaining amount
          emiDetails.accessAmount = excessAmount
        }

        // Update total amount payable for the EMI
        emiDetails.totalAmountPayable = this.emiService.roundToTwo(
          emiDetails.principal +
            emiDetails.interest +
            emiDetails.panelty +
            emiDetails.brokenPeriodIntrest,
        )

        if (emiDetails.status === 'partially-paid') {
          // Update total amount payable for the EMI
          emiDetails.totalAmountPayable = this.emiService.roundToTwo(
            emiDetails.amountRemains +
              emiDetails.amountRemainsInterest +
              emiDetails.amountRemainsPenalty +
              emiDetails.amountRemainsBrokenPeriodIntrest +
              emiDetails.paymentReceived,
          )
        }

        // Update resultEmis with the processed EMI details
        resultEmis[emi.emiID] = emiDetails
      }

      return resultEmis
    } catch (error) {
      throw error
    }
  }

  /**
   * Process payment for a single EMI using global variables for amount tracking
   * @private
   */
  private async processEmiPayment(
    emi: IEmiReCalculationResponse,
    credit: ICredit,
    transactionDetails: any,
    excessAmount: number,
    remainingTransactionAmount: number,
  ): Promise<IEmiReCalculationResponse> {
    // Initialise variables
    const transactionAmount =
      remainingTransactionAmount > 0
        ? remainingTransactionAmount
        : this.emiService.roundToTwo(transactionDetails.amount + excessAmount)
    const transactionDate =
      moment(transactionDetails.transactionDate).startOf('day') ?? moment().startOf('day')
    // Safely compare actualPaymentDate and dueDate
    let dueDateMoment = moment(emi.dueDate).startOf('day')
    if (emi.actualPaymentDate !== null) {
      const actualPaymentDateMoment = moment(emi.actualPaymentDate).startOf('day')
      if (actualPaymentDateMoment.isAfter(dueDateMoment)) {
        dueDateMoment = actualPaymentDateMoment
      }
    }

    const delayDays = this.calculateDelayDaysFromDates(transactionDate, dueDateMoment)

    const { pendingInterest, pendingPrincipal, pendingPenalty, pendingBounce } =
      this.getCurrentEmiComponents(emi, delayDays, credit.roi)

    // Allocate payment to EMI components
    const allocation = this.allocatePayment(
      transactionAmount,
      pendingInterest,
      pendingPrincipal,
      pendingPenalty,
      pendingBounce,
    )

    const totalRemaining = this.emiService.roundToTwo(
      allocation.remainingPrincipal +
        allocation.remainingInterest +
        allocation.remainingPenalty +
        allocation.remainingBounceCharge,
    )

    // Calculate how much we've actually paid towards this EMI
    const amountPaidToEmi = allocation.totalPaid

    // Calculate potential excess amount after payment
    const calculatedExcess = allocation.excessAmount

    // Determine if EMI should be marked as fully paid
    const isFullyPaid = totalRemaining <= 0 || calculatedExcess > 0

    // Prepare the remaining payment details with adjustment for small remaining amounts
    const emiRemainingAfterPayment = {
      principal: isFullyPaid ? 0 : allocation.remainingPrincipal,
      interest: isFullyPaid ? 0 : allocation.remainingInterest,
      penalty: isFullyPaid ? 0 : allocation.remainingPenalty,
      bounceCharge: isFullyPaid ? 0 : allocation.remainingBounceCharge,
    }

    // Update final status based on payment result
    const status = isFullyPaid ? 'paid' : 'partially-paid'

    // Update excess amount for next iteration
    excessAmount = calculatedExcess

    const updatedEmi: IEmiReCalculationResponse = {
      emiID: emi.emiID,
      status: status,
      actualPaymentDate: moment(transactionDate).startOf('day').toDate(),
      delayDays,
      paymentID: emi.paymentID,
      principal: emi.principal,
      interest: emi.interest,
      amountRemains: emiRemainingAfterPayment.principal,
      amountRemainsInterest: emiRemainingAfterPayment.interest,
      amountRemainsPenalty: emiRemainingAfterPayment.penalty,
      amountRemainsBrokenPeriodIntrest: emiRemainingAfterPayment.bounceCharge,
      panelty: Math.max(emi.panelty || 0, pendingPenalty),
      brokenPeriodIntrest: Math.max(emi.brokenPeriodIntrest, pendingBounce),
      paymentReceived: (emi.paymentReceived || 0) + amountPaidToEmi,
      totalAmountPayable: emi.totalAmountPayable || 0,
      dueDate: moment(emi.dueDate).startOf('day').toDate(),
      accessAmount: excessAmount,
      is_deleted: emi.is_deleted,
      waive_off_amount: emi.waive_off_amount || 0,
    }

    return updatedEmi
  }

  /**
   * Allocate payment to different EMI components with improved reliability
   * @private
   */
  private allocatePayment(
    transactionAmount: number,
    interest: number,
    principal: number,
    penalty: number,
    bounceCharge: number,
  ) {
    // Validate and normalize inputs
    const validTransactionAmount = Math.max(0, Number(transactionAmount) || 0)
    const validInterest = Math.max(0, Number(interest) || 0)
    const validPrincipal = Math.max(0, Number(principal) || 0)
    const validPenalty = Math.max(0, Number(penalty) || 0)
    const validBounceCharge = Math.max(0, Number(bounceCharge) || 0)

    let remainingPayment = validTransactionAmount
    let totalPaid = 0

    // Allocate payment to interest first
    let interestPaid = 0
    let remainingInterest = validInterest

    if (remainingPayment > 0 && validInterest > 0) {
      if (remainingPayment >= validInterest) {
        interestPaid = validInterest
        remainingPayment -= validInterest
        remainingInterest = 0
      } else {
        interestPaid = remainingPayment
        remainingInterest = validInterest - remainingPayment
        remainingPayment = 0
      }
      totalPaid += interestPaid
    }

    // Allocate remaining payment to principal
    let principalPaid = 0
    let remainingPrincipal = validPrincipal

    if (remainingPayment > 0 && validPrincipal > 0) {
      if (remainingPayment >= validPrincipal) {
        principalPaid = validPrincipal
        remainingPayment -= validPrincipal
        remainingPrincipal = 0
      } else {
        principalPaid = remainingPayment
        remainingPrincipal = validPrincipal - remainingPayment
        remainingPayment = 0
      }
      totalPaid += principalPaid
    }

    // Allocate remaining payment to penalty
    let penaltyPaid = 0
    let remainingPenalty = validPenalty

    if (remainingPayment > 0 && validPenalty > 0) {
      if (remainingPayment >= validPenalty) {
        penaltyPaid = validPenalty
        remainingPayment -= validPenalty
        remainingPenalty = 0
      } else {
        penaltyPaid = remainingPayment
        remainingPenalty = validPenalty - remainingPayment
        remainingPayment = 0
      }
      totalPaid += penaltyPaid
    }

    // Allocate remaining payment to bounce charge
    let bounceChargePaid = 0
    let remainingBounceCharge = validBounceCharge

    if (remainingPayment > 0 && validBounceCharge > 0) {
      if (remainingPayment >= validBounceCharge) {
        bounceChargePaid = validBounceCharge
        remainingPayment -= validBounceCharge
        remainingBounceCharge = 0
      } else {
        bounceChargePaid = remainingPayment
        remainingBounceCharge = validBounceCharge - remainingPayment
        remainingPayment = 0
      }
      totalPaid += bounceChargePaid
    }

    const result = {
      remainingInterest: this.emiService.roundToTwo(remainingInterest),
      remainingPrincipal: this.emiService.roundToTwo(remainingPrincipal),
      remainingPenalty: this.emiService.roundToTwo(remainingPenalty),
      remainingBounceCharge: this.emiService.roundToTwo(remainingBounceCharge),
      totalPaid: this.emiService.roundToTwo(totalPaid),
      excessAmount: this.emiService.roundToTwo(remainingPayment),
    }

    // Round all values to 2 decimal places for consistency
    return result
  }

  /**
   * Get current EMI components based on status
   * @private
   */
  private getCurrentEmiComponents(emi: IEmiReCalculationResponse, delayDays: number, roi: number) {
    let {
      pendingInterest,
      pendingPrincipal,
      pendingPenalty,
      pendingBounce,
      isPaid,
      isPartiallyPaid,
    } = this.calculatePendingEMIAmounts(emi)

    pendingPenalty = this.calculatePenaltyCharge(
      isPaid,
      isPartiallyPaid,
      pendingPenalty,
      pendingPrincipal,
      delayDays,
      roi,
    )

    pendingBounce = this.calculateBounceCharge(isPaid, isPartiallyPaid, pendingBounce, delayDays)

    return { pendingInterest, pendingPrincipal, pendingPenalty, pendingBounce }
  }

  /**
   * Calculate penalty charge for an EMI
   * @private
   */
  private calculatePenaltyCharge(
    isPaid: boolean,
    isPartiallyPaid: boolean,
    pendingPenalty: number,
    pendingPrincipal: number,
    delayDays: number,
    roi: number,
  ): number {
    // If EMI is fully paid, no additional penalty
    if (isPaid) {
      return 0
    }

    // Start with existing penalty amount
    let totalPenalty = pendingPenalty

    // If EMI is partially paid, check if there are delay days and and pending principal > 0
    if (isPartiallyPaid) {
      if (delayDays > 0 && pendingPrincipal > 0) {
        const additionalPenalty = this.emiService.calculatePenalty(pendingPrincipal, delayDays, roi)
        totalPenalty += additionalPenalty
      }
      return this.emiService.roundToTwo(totalPenalty)
    }

    // Ensure penalty is not negative and handle due case
    if (delayDays > 0) {
      const additionalPenalty = this.emiService.calculatePenalty(pendingPrincipal, delayDays, roi)
      totalPenalty += additionalPenalty
    }

    return this.emiService.roundToTwo(totalPenalty)
  }

  /**
   * Calculate bounce charge based on EMI status and delay
   * @private
   */
  private calculateBounceCharge(
    isPaid: boolean,
    isPartiallyPaid: boolean,
    pendingBounce: number,
    delayDays: number,
  ): number {
    if (isPaid) {
      return 0
    }

    // If EMI is partially paid, check if there are delay days
    if (isPartiallyPaid) {
      if (delayDays > 0 && pendingBounce === 0) {
        // If there are delay days and no pending bounce, apply bounce charge
        return this.emiService.bounceCharge()
      }
      // If there are no delay days or pending bounce, return existing bounce
      return this.emiService.roundToTwo(pendingBounce)
    }

    const bounceCharge = delayDays > 0 ? this.emiService.bounceCharge() : 0

    return bounceCharge
  }

  /**
   * Calculates delay days between payment date and due date using moment with Asia/Kolkata timezone
   * @private
   */
  private calculateDelayDaysFromDates(
    transactionMoment: moment.Moment,
    dueMoment: moment.Moment,
  ): number {
    // const transactionMoment = transactionDate.tz('Asia/Kolkata').startOf('day')
    // const dueMoment = dueDate.tz('Asia/Kolkata').startOf('day')

    if (transactionMoment.isSameOrBefore(dueMoment)) {
      return 0
    }

    const delayDays = transactionMoment.diff(dueMoment, 'days')
    return Math.max(0, delayDays)
  }

  /**
   * Saves penalty information
   */
  public async savePenalty(
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

  /**
   * Finds all EMIs for a credit
   */
  public async findEmis(creditID: number): Promise<IEmi[]> {
    return await this.emiService.find(
      knex => knex.where('creditID', creditID).andWhere('is_deleted', 0),
      [{ column: 'emiID', order: 'asc' }],
      ['*'],
    )
  }

  /**
   * Calculates delay days from due date to current date using moment with Asia/Kolkata timezone
   */
  public calculateDelayDays(dueDate: Date): number {
    const currentMoment = moment().tz('Asia/Kolkata').startOf('day')
    const dueMoment = moment(dueDate).tz('Asia/Kolkata').startOf('day')

    if (currentMoment.isSameOrBefore(dueMoment)) {
      return 0
    }

    return Math.max(0, currentMoment.diff(dueMoment, 'days'))
  }

  /**
   * Counts remaining EMIs for a credit
   */
  public async countRemainingEmis(creditID: number): Promise<number> {
    const countRow = await this.emiService.countRows(query =>
      query
        .where(q => q.where('status', 'partially-paid').orWhere('status', 'due'))
        .andWhere('creditID', creditID),
    )
    return +countRow
  }

  /**
   * Count remaining EMIs from simulated data (used during settlement simulation)
   * This counts EMIs that are not fully paid in the resultEmis object
   * @param resultEmis - Object containing simulated EMI data indexed by emiID
   * @returns Count of remaining (unpaid or partially paid) EMIs
   */
  public countRemainingEmisFromSimulation(resultEmis: { [key: string]: any }): number {
    return Object.values(resultEmis).filter(
      (emi: any) => emi.status === 'partially-paid' || emi.status === 'due',
    ).length
  }

  /**
   * Updates credit status based on remaining EMIs
   */
  public async updateCreditStatus(
    emiRemains: number,
    credit: ICredit,
    paidAmount: number,
  ): Promise<void> {
    await this.creditService.updateOne(
      { creditID: credit.creditID },
      {
        emiLeft: emiRemains,
        paidAmount: +credit.paidAmount + +paidAmount,
        amountToBeRepayed: credit.amountToBeRepayed - paidAmount,
      },
    )
  }

  /**
   * Updates an EMI's status to paid
   */
  public async updateEmiStatusToPaid(
    emi: IEmi,
    delayDays: number,
    paymentDetails: any,
    penality: any,
  ): Promise<void> {
    await this.emiService.updateOne(
      { emiID: emi.emiID },
      {
        status: 'paid',
        actualPaymentDate: new Date(),
        delayDays,
        paymentID: paymentDetails.id,
        amountRemains: 0,
        amountRemainsInterest: 0,
        panelty: penality,
      },
    )
  }

  /**
   * Updates an EMI's status to partial or paid
   */
  public async updateEmiStatusToPartial(
    emi: IEmi,
    amountRemains: number,
    delayDays: number,
    paymentDetails: any,
    details: any,
    status: string,
  ): Promise<void> {
    await this.emiService.updateOne(
      { emiID: emi.emiID },
      {
        status: status,
        actualPaymentDate: paymentDetails.paymentDate
          ? moment(paymentDetails.paymentDate).tz('Asia/Kolkata').toDate()
          : moment().tz('Asia/Kolkata').toDate(),
        delayDays,
        paymentID: paymentDetails.id,
        amountRemains: details.principal,
        amountRemainsInterest: details.interest,
        amountRemainsPenalty: details.penalty,
        amountRemainsBrokenPeriodIntrest: details.bounceCharge,
        panelty: details.updatePenalty,
        brokenPeriodIntrest: details.updateBrokenPeriodIntrest,
        paymentReceived: details.paymentReceived,
      },
    )
  }

  /**
   * Updates an EMI with custom fields
   */
  public async updateEmiManualStatus(emiID: number, update: {}): Promise<void> {
    await this.emiService.updateOne(
      { emiID: emiID },
      {
        ...update,
      },
    )
  }

  /**
   * Manages a manual payment with potential waiver
   */
  public async manageManualPayment(
    transactionDetails: any,
    resultEmis: { [key: string]: IEmiReCalculationResponse },
    credit: ICredit,
    excessAmount: number,
    settle?: boolean,
  ): Promise<{
    [key: string]: IEmiReCalculationResponse
  }> {
    let {
      amount: transactionAmount,
      waiver: waiverAmount,
      discount_type,
      trans_id,
      order_id,
      transactionDate,
    } = transactionDetails
    let lastEmi = null

    // Calculate totals for all components
    let totalComponents = {
      totalPrincipal: 0,
      totalInterest: 0,
      totalPanelty: 0,
      totalBrokenPeriodIntrest: 0,
    }

    const unpaidEmis = Object.values(resultEmis).filter(emi => emi.status !== 'paid')
    //loop through emis
    for (const emi of unpaidEmis) {
      // Skip if EMI is already paid or deleted
      if (emi.status == 'Paid' || emi.is_deleted == 1) {
        continue
      }

      // Init processing variables
      transactionDate = moment(transactionDate).startOf('day') ?? moment().startOf('day')
      // Safely compare actualPaymentDate and dueDate
      let dueDateMoment = moment(emi.dueDate).startOf('day')
      if (emi.actualPaymentDate !== null) {
        const actualPaymentDateMoment = moment(emi.actualPaymentDate).startOf('day')
        if (actualPaymentDateMoment.isAfter(dueDateMoment)) {
          dueDateMoment = actualPaymentDateMoment
        }
      }

      const delayDays = this.calculateDelayDaysFromDates(transactionDate, dueDateMoment)

      let { pendingInterest, pendingPrincipal, pendingPenalty, pendingBounce } =
        this.getCurrentEmiComponents(emi, delayDays, credit.roi)
      lastEmi = emi

      // Update total components (accumulate values across all EMIs)
      totalComponents.totalPrincipal += pendingPrincipal
      totalComponents.totalInterest += pendingInterest
      totalComponents.totalPanelty += pendingPenalty
      totalComponents.totalBrokenPeriodIntrest += pendingBounce

      // Mark EMI as deleted if settle is true
      if (settle) {
        await this.emiModel.findOneAndUpdate({ emiID: emi.emiID }, { is_deleted: 1 })
      }
      // If transaction amount is already zero, break the loop
      if (transactionAmount <= 0) {
        break
      }

      // Update is_deleted status for the EMI
      emi.is_deleted = 1
      if (emi.status === 'due') {
        emi.amountRemains = 0
        emi.amountRemainsInterest = 0
      }
    }

    // Total Available for allocation
    const totalTransactionAmount = transactionAmount + excessAmount

    // Validate the calculation logic
    const totalRequiredForAllEmis = this.emiService.roundToTwo(
      totalComponents.totalPrincipal +
        totalComponents.totalInterest +
        totalComponents.totalPanelty +
        totalComponents.totalBrokenPeriodIntrest,
    )

    // Allocate payment to different components
    const paymentAllocation = this.allocatePayment(
      totalTransactionAmount,
      totalComponents.totalInterest,
      totalComponents.totalPrincipal,
      totalComponents.totalPanelty,
      totalComponents.totalBrokenPeriodIntrest,
    )

    // Determine status based on discount type
    const status = discount_type === 'Settlement' ? 'Settlement' : discount_type
    const leadStatus = discount_type === 'Settlement' ? LeadStatus.SETTLEMENT : LeadStatus.CLOSED

    // Calculate pending and waived amounts
    const remainingAmount = this.calculateTotalRemaining(paymentAllocation)
    let extraExcessAmount = totalTransactionAmount - totalRequiredForAllEmis || 0 // Calculate excess amount
    let waive_off_amount = 0

    if (remainingAmount > 0) {
      // If there's remaining amount after payment, it needs to be waived off
      waive_off_amount = remainingAmount
      excessAmount = 0
    } else if (extraExcessAmount > 0) {
      // If remainingAmount is negative, it means there's excess payment
      excessAmount = extraExcessAmount
      waive_off_amount = 0
    } else {
      // If remainingAmount is exactly 0, payment matches requirement
      excessAmount = 0
      waive_off_amount = 0
    }

    // Use current date only once
    const currentDate =
      moment(transactionDate).startOf('day').toDate() ?? moment().startOf('day').toDate()

    // Create transaction entry if settle is true
    if (settle) {
      // Insert EMI data into the database
      // let emiID = await this.emiModel.insertEmiInDb(
      //   lastEmi.creditID,
      //   lastEmi.customerID,
      //   lastEmi.leadID,
      //   lastEmi.productID,
      //   totalComponents.totalPrincipal,
      //   totalComponents.totalInterest,
      //   totalComponents.totalPanelty,
      //   totalComponents.totalBrokenPeriodIntrest,
      //   'paid',
      //   paymentAllocation.remaningAfterPrincipal,
      //   paymentAllocation.remaningAfterInterest,
      //   paymentAllocation.remaningAfterPenalty,
      //   paymentAllocation.brokenPeriodToPay,
      //   0,
      //   0,
      //   currentDate,
      //   currentDate,
      //   0,
      //   0,
      //   '0',
      //   paymentAllocation.finalRemaningAmount,
      //   remainingAmount,
      //   waive_off_amount,
      // )

      // const transSave = {
      //   transaction_id: trans_id,
      //   order_id: order_id,
      //   emi_id: emiID,
      //   interest: paymentAllocation.interestToPay,
      //   principal: paymentAllocation.principalToPay,
      //   penalty: paymentAllocation.penaltyToPay,
      //   dpd_amount: paymentAllocation.brokenPeriodToPay,
      //   transaction_date: currentDate,
      //   lead_id: lastEmi.leadID,
      //   emi_status: 'paid',
      // }

      // Create EMI entry
      // await this.EMITransaction.create(transSave)
      // Update credit and lead status
      await this.creditService.updateOne({ creditID: lastEmi.creditID }, { status: status })
      await this.leadService.updateOne({ leadID: lastEmi.leadID }, { status: leadStatus })
    }

    const updatedEmis: { [key: string]: IEmiReCalculationResponse } = {}

    // Create the settlement EMI object with detailed logging
    const settlementEmi = {
      emiID: null, // Settlement EMI does not have a real ID
      status: 'paid',
      actualPaymentDate: currentDate,
      delayDays: 0,
      paymentID: '0', // THIS IS THE PROBLEMATIC PAYMENTID THAT SHOULD BE FILTERED OUT
      is_deleted: 0,
      principal: totalComponents.totalPrincipal,
      interest: totalComponents.totalInterest,
      amountRemains: paymentAllocation.remainingPrincipal,
      amountRemainsInterest: paymentAllocation.remainingInterest,
      amountRemainsPenalty: paymentAllocation.remainingPenalty,
      amountRemainsBrokenPeriodIntrest: paymentAllocation.remainingBounceCharge,
      panelty: totalComponents.totalPanelty,
      brokenPeriodIntrest: totalComponents.totalBrokenPeriodIntrest,
      paymentReceived: paymentAllocation.totalPaid,
      totalAmountPayable: totalRequiredForAllEmis,
      accessAmount: excessAmount,
      dueDate: currentDate,
      waive_off_amount: waive_off_amount,
    }

    updatedEmis[0] = settlementEmi

    return updatedEmis
  }

  /**
   * Allocate manual payment to different components with EMI total requirement validation
   * Allocates a payment amount across all EMI components in a specific order:
   * Interest -> Principal -> Penalty -> Broken Period Interest
   *
   * @param amount - The total payment amount to allocate
   * @param totalComponents - The total amount of each component calculated from all EMIs
   * @returns Payment allocation breakdown and remaining amounts with EMI total validation
   * @private
   */
  private allocateManualPayment(
    amount: number,
    totalComponents: {
      totalPrincipal: number
      totalInterest: number
      totalPanelty: number
      totalBrokenPeriodIntrest: number
    },
  ) {
    // Ensure amount is valid
    const validAmount = Math.max(0, +amount)

    // First interestToPay
    const [interestToPay, remaningAfterInterest] = this.calculateRemaining(
      validAmount,
      totalComponents.totalInterest,
    )
    // Then Principal
    const [principalToPay, remaningAfterPrincipal] = this.calculateRemaining(
      remaningAfterInterest,
      totalComponents.totalPrincipal,
    )
    // Then Penalty
    const [penaltyToPay, remaningAfterPenalty] = this.calculateRemaining(
      remaningAfterPrincipal,
      totalComponents.totalPanelty,
    )
    // In the last brokenPeriedToPay
    const [brokenPeriodToPay, finalRemaningAmount] = this.calculateRemaining(
      remaningAfterPenalty,
      totalComponents.totalBrokenPeriodIntrest,
    )

    return {
      principalToPay,
      interestToPay,
      penaltyToPay,
      brokenPeriodToPay,
      remaningAfterPrincipal,
      remaningAfterInterest,
      remaningAfterPenalty,
      finalRemaningAmount,
    }
  }

  /**
   * Calculate total remaining amount from payment allocation
   * @private
   */
  private calculateTotalRemaining(paymentAllocation: any): number {
    return this.emiService.roundToTwo(
      paymentAllocation.remainingPrincipal +
        paymentAllocation.remainingInterest +
        paymentAllocation.remainingPenalty +
        paymentAllocation.remainingBounceCharge,
    )
  }

  // Helper function to calculate remaining amounts
  private calculateRemaining(total: number, amount: number): [number, number] {
    const toPay = Math.min(total, amount)
    return [toPay, Math.max(0, total - toPay)]
  }

  /**
   * Gets repayment data for a loan with optimized processing
   */
  public async getRepaymentData(
    credit: ICredit,
    loanData: ILoan,
    leadData: ILead,
    emis: IEmi[],
    transactions: ITransection[],
  ): Promise<any> {
    // Process EMIs in parallel with optimized chunk processing for large EMI arrays
    const CHUNK_SIZE = 10 // Process 10 EMIs at a time for better performance
    const processedEmis = []

    if (emis.length > CHUNK_SIZE) {
      // Process in chunks for large arrays to avoid memory issues
      for (let i = 0; i < emis.length; i += CHUNK_SIZE) {
        const chunk = emis.slice(i, i + CHUNK_SIZE)
        const processedChunk = await Promise.all(
          chunk.map(async emi => this.processEmi(emi, credit)),
        )
        processedEmis.push(...processedChunk)
      }
    } else {
      // For small arrays, process all at once
      const results = await Promise.all(emis.map(async emi => this.processEmi(emi, credit)))
      processedEmis.push(...results)
    }

    // Use active status set for faster lookups
    const activeStatuses = new Set(['Part Paid', 'Due', 'Overdue'])

    // Find the first EMI that needs payment
    const activeEmi = processedEmis.find(emi => activeStatuses.has(emi.status))

    // Update credit with active EMI data if found
    let tempAmountPayable = 0
    let isTempWaiverActive = 0

    if (activeEmi) {
      credit.firstDueDate = activeEmi.dueDate
      credit.amountToBeRepayed = activeEmi.amountPayable
      tempAmountPayable = activeEmi.tempAmountPayable
      isTempWaiverActive = activeEmi.isTempWaiverActive
    }

    // Calculate total repayment amount in one pass
    const totalRepay = processedEmis.reduce((sum, emi) => {
      return activeStatuses.has(emi.status) ? sum + emi.amountPayable : sum
    }, 0)

    // Get last payment date
    const lastPaymentDate = this.calculateLastPaymentDate(transactions)

    // Calculate EMI amount
    const emiAmount = (emis[0]?.principal || 0) + (emis[0]?.interest || 0)

    // Build loan summary
    const loanSummary = {
      ...credit,
      Emi: emiAmount,
      loanNumber: loanData.loanNo,
      disbursalDate: loanData.disbursalDate,
      lastPaymentDate,
      totalRepay,
      status: leadData.status,
      tempAmountPayable,
      isTempWaiverActive,
    }

    // Format transactions in parallel if there are many
    const formattedTransactions =
      transactions?.length > 0
        ? transactions.length > 20
          ? await Promise.all(transactions.map(transaction => this.processTransaction(transaction)))
          : transactions.map(transaction => this.processTransaction(transaction))
        : []

    // Define EMI documents
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

    // Return complete repayment data
    return {
      loanSummary,
      processedEmis,
      getTransections: formattedTransactions,
      emiDocs,
    }
  }

  /**
   * Finds lead information by ID
   */
  public async findLead(leadID: number): Promise<ILead | null> {
    return await this.leadService.findOne({ leadID })
  }

  /**
   * Processes an EMI for display
   */
  public processEmi = async (emi: any, credit: ICredit): Promise<any> => {
    // Calculate dates and delays using moment with Asia/Kolkata timezone
    const dueMoment = moment(emi.dueDate).tz('Asia/Kolkata').startOf('day')
    const currentMoment = moment().tz('Asia/Kolkata').startOf('day')
    const delayDays = Math.max(0, currentMoment.diff(dueMoment, 'days'))

    // Calculate penalty days based on payment date
    let penaltyDays = delayDays
    let dpd = ''

    if (emi.actualPaymentDate) {
      const actualPaymentMoment = moment(emi.actualPaymentDate).tz('Asia/Kolkata').startOf('day')

      if (actualPaymentMoment.isAfter(dueMoment)) {
        penaltyDays = Math.max(0, currentMoment.diff(actualPaymentMoment, 'days'))

        if (emi.status === 'paid') {
          dpd = String(Math.max(0, actualPaymentMoment.diff(dueMoment, 'days')))
        }
      }
    }

    // If EMI is settled in this simulation run, set actualPaymentDate to today
    if ((emi.status === 'paid' || emi.status === 'partially-paid') && !emi.actualPaymentDate) {
      emi.actualPaymentDate = new Date()
    }

    // Update EMI values based on status and delay
    this.updateEmiValuesBasedOnStatus(emi, penaltyDays, delayDays, credit.roi)

    // Calculate amounts
    const pendingAmount = this.emiService.roundToTwo(this.calculatePendingAmount(emi, delayDays))
    const totalPaid = this.emiService.roundToTwo(emi.paymentReceived)

    // Handle waivers
    const waiver = emi.waiver

    const amountPayable = this.calculateAmountPayable(emi, waiver)
    emi.amountPayable = amountPayable
    emi.waive_off_amount = this.emiService.roundToTwo(emi.waive_off_amount || 0)
    emi.tempAmountPayable = waiver
      ? emi.amountPayable - this.emiService.roundToTwo(waiver.amount)
      : 0
    emi.isTempWaiverActive = waiver ? true : false

    // Update display properties
    emi.dueDate = dueMoment.toDate()
    emi.dpd = dpd

    // Set status and colors
    this.setEmiDisplayProperties(emi, delayDays, pendingAmount, totalPaid)

    return emi
  }

  /**
   * Updates EMI values based on status and delay
   * @private
   */
  private updateEmiValuesBasedOnStatus(
    emi: any,
    penaltyDays: number,
    delayDays: number,
    roi: number,
  ) {
    // Handles all EMI statuses and delayDays cases
    if (delayDays <= 0) {
      // On-time or early payment: no penalty or bounce charges
      emi.panelty = 0
      emi.brokenPeriodIntrest = 0
      emi.amountRemainsInterest =
        emi.status === 'partially-paid' ? emi.amountRemainsInterest : emi.interest
      emi.amountRemainsPenalty = 0
      emi.amountRemainsBrokenPeriodIntrest = 0
      emi.amountPayable = this.emiService.roundToTwo(
        emi.principal + emi.interest - emi.paymentReceived,
      )
    } else if (emi.status !== 'partially-paid' && emi.status !== 'paid') {
      // Overdue and not paid/partially-paid: apply penalty and bounce charges
      emi.brokenPeriodIntrest = this.emiService.bounceCharge()
      emi.amountRemainsInterest = 0
      emi.amountRemainsPenalty = 0
      emi.panelty = this.emiService.roundToTwo(
        this.emiService.calculatePenalty(emi.principal, penaltyDays, roi),
      )
      emi.amountRemainsBrokenPeriodIntrest = 0
      emi.amountPayable = this.emiService.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest,
      )
    } else if (emi.status === 'partially-paid') {
      // Partially paid: may have penalty/bounce for remaining overdue
      emi.brokenPeriodIntrest =
        emi.brokenPeriodIntrest === 0 && penaltyDays > 0
          ? this.emiService.bounceCharge()
          : emi.brokenPeriodIntrest

      emi.panelty =
        +emi.panelty + this.emiService.calculatePenalty(emi.amountRemains, penaltyDays, roi)
      emi.panelty = this.emiService.roundToTwo(emi.panelty)

      emi.amountPayable = this.emiService.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest - emi.paymentReceived,
      )
    } else if (emi.status === 'paid') {
      // Paid: just sum up for display
      emi.amountPayable = this.emiService.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest,
      )
    }
  }

  /**
   * Calculates final amount payable considering waivers
   * @private
   */
  private calculateAmountPayable(emi: any, waiver: any): number {
    if (waiver) {
      return (
        this.emiService.roundToTwo(emi.amountPayable) -
        this.emiService.roundToTwo(emi.waive_off_amount || 0) -
        this.emiService.roundToTwo(waiver)
      )
    } else {
      return (
        this.emiService.roundToTwo(emi.amountPayable) -
        this.emiService.roundToTwo(emi.waive_off_amount || 0)
      )
    }
  }

  /**
   * Set EMI display properties (status, colors)
   * @private
   */
  private setEmiDisplayProperties(
    emi: any,
    delayDays: number,
    pendingAmount: number,
    totalPaid: number,
  ) {
    let balanceColor = '#F33C3C'

    if (delayDays > 0 && emi.status !== 'paid') {
      // Overdue EMI
      emi.status = 'Overdue'
      emi.color = '#F33C3C'
      emi.bgcolor = '#FCE0E0'
    } else {
      // EMI status based on payment status
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

    // Build the display list for EMI components
    emi.lists = [
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
        color: balanceColor,
        bgcolor: '',
      },
    ]
  }

  /**
   * Calculate pending amount for an EMI with optimized conditional logic
   */
  public calculatePendingEMIAmounts = (emi: IEmiReCalculationResponse) => {
    // Use the status as a key for simpler conditional logic
    const isPaid = emi.status === 'paid'
    const isPartiallyPaid = emi.status === 'partially-paid'

    // Calculate components more efficiently with simplified conditions
    const pendingBounce = isPaid
      ? 0
      : isPartiallyPaid
      ? emi.amountRemainsBrokenPeriodIntrest
      : emi.brokenPeriodIntrest

    const pendingPenalty = isPaid ? 0 : isPartiallyPaid ? emi.amountRemainsPenalty : emi.panelty

    const pendingPrincipal = isPaid ? 0 : isPartiallyPaid ? emi.amountRemains : emi.principal

    const pendingInterest = isPaid ? 0 : isPartiallyPaid ? emi.amountRemainsInterest : emi.interest

    // Return total pending amount
    return {
      pendingBounce,
      pendingPenalty,
      pendingPrincipal,
      pendingInterest,
      isPaid,
      isPartiallyPaid,
    }
  }

  /**
   * Process transaction data for display using moment.js
   */
  public processTransaction = (transaction: any) => {
    const { amount, status, mode, referenceNo, createdAt } = transaction

    // Format status text and color
    const formattedStatus = status === 1 || status === 3 ? 'Success' : 'Failed'
    const statusColor = status === 1 || status === 3 ? '#14D44A' : '#D93C3C'

    // Format date for display using moment with Asia/Kolkata timezone
    const formattedDate = moment(createdAt).tz('Asia/Kolkata').format('D MMM YYYY h:mm A')

    // Return formatted transaction data
    return {
      amount: { text: 'Amount', value: amount, color: '#1F1F1F', bgColor: '' },
      status: {
        text: 'Status',
        value: formattedStatus,
        color: statusColor,
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

  /**
   * Find the last successful payment date using moment.js
   */
  public calculateLastPaymentDate = transactions => {
    if (!transactions || !transactions.length) {
      return ''
    }

    // Find all successful transactions (status 1)
    const successTransactions = transactions.filter(transaction => transaction.status === 1)

    if (!successTransactions.length) {
      return ''
    }

    // Sort by date (newest first) and get the most recent
    return successTransactions.sort(
      (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
    )[0].createdAt
  }
}

export default EmiCollectionService
