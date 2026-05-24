import config from '@/config/default'
import { CreditStatus } from '@/enums/credit.enum'
import axios, { HttpStatusCode } from 'axios'
import csvParser from 'csv-parser'
import { differenceInCalendarDays, format } from 'date-fns'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid'
import { approvalModel } from '../database/mysql/approval'
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs'
import { customerModel } from '../database/mysql/customer'
import { customerAccountModel } from '../database/mysql/customerAccount'
import EmiModel from '../database/mysql/emi'
import { ProductID } from '../enums/emi.enum'
import { LeadStatus } from '../enums/lead.enum'
import { BadRequestError, NotFoundError } from '../errors'
import CommonHelper from '../helpers/common'
import EMIHelper from '../helpers/emi.helpers'
import {
  IApplyPenaltyPayload,
  ICreditDetailsPayload,
  ICSVGeneration,
  IEmiCalculatorPayload,
  IErrorLog,
  IExselMandate,
  IFileUploadPayload,
  IFileUrlPayload,
  IGenerateEmiPayload,
  IGetAmountToBeDisbursedPayload,
  IGetDocsRequirementsPayload,
  IGetEmiLoanDetailsPayload,
  IGetEmisPayload,
  ILeadUpdatePayload,
  ILoanInfo,
  ILoanQueryResult,
  IMandatePayload,
  IPancard,
  IPostRazorpayRequest,
  IRazorpayRequestData,
  IStatusInfo,
  IUpdatePaymentPayload,
} from '../interfaces/crm.interface'
import { IEmi } from '../interfaces/emi.interface'
import { IEMIDoc } from '../interfaces/emidoc.interface'
import { IServiceResponse } from '../interfaces/service.interface'
import { projectionService } from '../services/projection.service'
import { checkUploadTimeIST, compareDates, dateCheck } from '../utils/dateTimeFunction'
import {
  calculateTotalRepayPaydayAmountIPC,
  calculateTotalRepayPaydayAmountNonIPC,
} from '../utils/ipcCalculation'
import { getKnexInstance } from '../utils/mysql'
import RazorpayPG from '../utils/razorpayClient.utils'
import { IFileUrlPayloadProjection } from '../validations/projection.validator'
import CallHistoryLogService from './callhistorylog.service'
import CollectionService from './collection.service'
import CreditService from './credit.service'
import { EmiService } from './emi.service'
import { LeadService } from './lead.service'
import { loanService } from './loan.service'
import OtherChargesService from './otherCharges.service'
import ResponseService from './response.service'
import S3Service from './thirdParty/s3.service'
import TransactionService from './transaction.service'

class CrmService extends ResponseService {
  private leadService: LeadService
  private readonly emiHelper = new EMIHelper()
  private readonly creditService = new CreditService()
  private readonly emiModel = new EmiModel()
  private readonly emiService = new EmiService()
  private readonly transactionService = new TransactionService()
  private readonly collectionService = new CollectionService()
  private readonly callHistoryLogService = new CallHistoryLogService()
  private readonly otherChargesService = new OtherChargesService()
  private readonly s3Service = new S3Service()
  private readonly razorpayPg = new RazorpayPG()
  private readonly projectionService = projectionService
  private readonly customerAccountModel = customerAccountModel
  private readonly approvalModel = approvalModel
  private readonly callHistoryLogsModel = callHistoryLogsModel
  private readonly customerModel = customerModel

  constructor() {
    super()
    this.getLeadService()
  }

  async getLeadService() {
    const { leadService } = await import('../services/lead.service')
    this.leadService = leadService
  }

  // New code
  async leadUpdate(payload: ILeadUpdatePayload): Promise<IServiceResponse> {
    const { leadID } = payload

    let lead = await this.leadService.findOne({ leadID }, ['*'])

    if (!lead) throw new NotFoundError('No Lead Found')

    if (lead.status == LeadStatus.FRESH_LEAD)
      throw new BadRequestError('Emi Loan Is Only For Repeted Users For Now')

    await this.leadService.updateOne({ leadID }, { productID: 1 })

    return this.serviceResponse(200, {}, 'Lead Updates To Product Type: EMI')
  }

  // New code
  async emiCalculator(payload: IEmiCalculatorPayload): Promise<IServiceResponse> {
    const { loanAmount, roi, tenure } = payload

    let emiDoc = await this.emiHelper.emiGenerator(loanAmount, roi, tenure)

    return this.serviceResponse(200, emiDoc, 'Here Is The Proposed EMI Breakdown')
  }

  // New code
  async creditDetails(payload: ICreditDetailsPayload): Promise<IServiceResponse> {
    const {
      adminFee,
      aqb,
      branch,
      customer_id,
      firstDueDate,
      foir,
      lead_id,
      loanAmtApproved,
      roi,
      tenure,
    } = payload

    let customerID = customer_id
    let leadID = lead_id
    let loanAmount = loanAmtApproved
    let processingFee = adminFee
    // check if credit already exist for this lead
    let credit = await this.creditService.findOne({ leadID, customerID }, ['*'])

    if (credit) throw new BadRequestError('Credit with this lead already exist')

    // find lead
    let lead = await this.leadService.findOne({ leadID, productID: 1, customerID }, ['*'])

    if (!lead) throw new BadRequestError('Lead Not Found of EMI Type')

    // roi check
    if (roi < 12 && roi > 60)
      throw new BadRequestError('Rate Of Intrest Can only be in Between 12% - 60%')
    //tenure check
    if (tenure < 3 && tenure > 12)
      throw new BadRequestError('Allowed Tenure: 3 months to 12 months')

    let days = dateCheck(firstDueDate)
    if (days > 50) {
      throw new BadRequestError('Invalid Date: Should Be Less Then 50 Days From Now')
    } else if (days < 30) {
      throw new BadRequestError('Invalid Date: Should Be Greater Then 30 Days From Now')
    }
    await this.creditService.create(
      customerID,
      leadID,
      1,
      foir,
      aqb,
      branch,
      roi,
      tenure,
      processingFee,
      loanAmount,
      new Date(firstDueDate),
    )
    return this.serviceResponse(200, {}, 'Credit Details Recorded')
  }

  // New code
  async getAmountToDisbursed(payload: IGetAmountToBeDisbursedPayload): Promise<IServiceResponse> {
    const { creditID } = payload

    let credit = await this.creditService.findOne({ creditID }, ['*'])

    if (!credit) throw new NotFoundError('Credit not found')

    let amount = credit.principal - credit.processingFee
    let brokenPeriodIntrest = await this.emiHelper.bpiCalculator(
      credit.principal,
      credit.roi,
      credit.firstDueDate,
    )
    amount = amount - brokenPeriodIntrest

    await this.creditService.updateOne(
      { creditID },
      {
        brokenPeriodIntrest,
      },
    )
    return this.serviceResponse(200, { amount }, 'Amount to be disbursed')
  }

  // New code
  async generateEMI(payload: IGenerateEmiPayload): Promise<IServiceResponse> {
    const { creditID, createdBy, gateway, loanNo, mode, order_id, referanceId, updatedBy } = payload

    let credit = await this.creditService.findOne({ creditID })

    if (!credit) throw new NotFoundError('Credit not found')

    let emi = await this.emiModel.findAll(
      { creditID },
      [{ column: 'emiID', order: 'desc' }],
      ['creditID', 'emiID'],
    )
    if (emi.length > 0) throw new BadRequestError('EMIs Already Exists')

    let emiDoc = (await this.emiHelper.emiGenerator(
      credit.principal,
      credit.roi,
      credit.tenure,
    )) as IEMIDoc
    if (!emiDoc) throw new BadRequestError('Error In Generating EMI')

    let openingBalance = emiDoc.amount
    let dueDate = credit.firstDueDate
    for (let emi of emiDoc?.emiBreakdown) {
      // create emi documents
      await this.emiService.createEMI(
        credit.creditID,
        credit.customerID,
        credit.leadID,
        credit.productID,
        emi.principal,
        emi.interest,
        openingBalance,
        emi.remainingPrincipal,
        emi.month, //eminumber
        credit.roi,
        credit.firstDueDate,
      )
      openingBalance = emi.remainingPrincipal
      dueDate.setMonth(dueDate.getMonth() + 1)
    }
    let emis = await this.emiModel.findAll({ creditID }, [{ column: 'emiID', order: 'asc' }], ['*'])
    //UPDATE Credit Status To Disbursed
    await this.creditService.updateOne(
      { creditID: creditID },
      {
        status: CreditStatus.DISBURSED,
        //disbusralDate: new Date(Date.now()),
      },
    )

    //INSERT Transection
    await this.transactionService.create(
      credit.customerID,
      credit.leadID,
      loanNo,
      100, //status
      CreditStatus.DISBURSED, //type
      mode,
      referanceId,
      order_id,
      0, //deleted
      gateway,
      new Date(Date.now()),
      new Date(Date.now()),
      createdBy,
      updatedBy,
      credit.principal,
    )

    return this.serviceResponse(200, emis, 'EMI Generated')
  }

  // New code
  async updatePayment(payload: IUpdatePaymentPayload): Promise<IServiceResponse> {
    const { creditID, amount, gateway, method } = payload

    let credit = await this.creditService.findOne({ creditID: creditID }, ['*'])

    if (amount > credit.amountToBeRepayed)
      throw new BadRequestError('Amount Should Be Less Then Outstanding')

    let lastEmi = await this.emiService.findOne({ creditID }, ['*'])

    //FIND LOAN NO FOR COLLECTION
    let loan = await loanService.findOne({ leadID: credit.leadID }, ['loanNo'])
    let emis = (await this.emiService.find(
      knex =>
        knex
          .where(function () {
            this.where('status', 'partial-paid').orWhere('status', 'due')
          })
          .andWhere('creditID', creditID),
      [{ column: 'emiID', order: 'desc' }],
      ['*'],
    )) as IEmi[]
    let amountRemains = amount
    let payingEmiCount = 0
    if (emis) {
      for (let emi of emis) {
        let delayDays =
          Math.floor(new Date(Date.now()).getTime() - new Date(emi.dueDate).getTime()) /
          (1000 * 60 * 60 * 24)
        if (amountRemains > emi.amountRemains) {
          await this.emiService.updateOne(
            {
              emiID: emi.emiID,
            },
            {
              status: 'paid',
              actualPaymentDate: new Date(Date.now()),
              delayDays,
              // paymentID: paymentdetails.id,
              amountRemains: 0,
            } as IEmi,
          )
          //TRANSECTION HANDELLER
          if (Math.round(emi.amountRemains) > Math.round(emi.panelty || 0)) {
            //INSERT TRANSECTION
            await this.transactionService.create(
              credit.customerID,
              credit.leadID,
              loan.loanNo,
              100, //status
              'collection', //type
              method,
              `refid/${emi.emiID}`,
              `order_id`,
              0, //deleted
              'razorpay',
              new Date(Date.now()),
              new Date(Date.now()),
              221,
              221,
              Math.round(emi.amountRemains) - Math.round(emi.panelty || 0), //amount
            )
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                100, //status
                'panelty', //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                'razorpay',
                new Date(Date.now()),
                new Date(Date.now()),
                221,
                221,
                Math.round(emi.panelty), //amount
              )
            }
          } else {
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                100, //status
                'panelty', //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                'razorpay',
                new Date(Date.now()),
                new Date(Date.now()),
                221,
                221,
                Math.round(emi.amountRemains), //amount
              )
            }
          }
          payingEmiCount += 1
        } else if (amountRemains < emi.amountRemains) {
          let updateemi = await this.emiService.updateOne(
            {
              emiID: emi.emiID,
            },
            {
              status: 'partially-paid',
              actualPaymentDate: new Date(Date.now()),
              delayDays,
              // paymentID: paymentdetails.id,
              amountRemains: emi.amountRemains - amountRemains,
            } as IEmi,
          )
          //TRANSECTION HANDELLER
          if (Math.round(emi.amountRemains) > Math.round(emi.panelty || 0)) {
            //INSERT TRANSECTION
            await this.transactionService.create(
              credit.customerID,
              credit.leadID,
              loan.loanNo,
              100, //status
              'collection', //type
              method,
              `refid/${emi.emiID}`,
              `order_id`,
              0, //deleted
              'razorpay',
              new Date(Date.now()),
              new Date(Date.now()),
              221,
              221,
              Math.round(emi.amountRemains) - Math.round(emi.panelty || 0), //amount
            )
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                100, //status
                'panelty', //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                'razorpay',
                new Date(Date.now()),
                new Date(Date.now()),
                221,
                221,
                Math.round(emi.panelty), //amount
              )
            }
          } else {
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                100, //status
                'panelty', //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                'razorpay',
                new Date(Date.now()),
                new Date(Date.now()),
                221,
                221,
                Math.round(emi.amountRemains), //amount
              )
            }
          }
          payingEmiCount += 1
          break
        } else {
          await this.emiService.updateOne(
            {
              emiID: emi.emiID,
            },
            {
              status: 'paid',
              actualPaymentDate: new Date(Date.now()),
              delayDays,
              // paymentID: paymentdetails.id,
              amountRemains: 0,
            } as IEmi,
          )
          //TRANSECTION HANDELLER
          if (Math.round(emi.amountRemains) > Math.round(emi.panelty || 0)) {
            //INSERT TRANSECTION
            await this.transactionService.create(
              credit.customerID,
              credit.leadID,
              loan.loanNo,
              100, //status
              'collection', //type
              method,
              `refid/${emi.emiID}`,
              `order_id`,
              0, //deleted
              'razorpay',
              new Date(Date.now()),
              new Date(Date.now()),
              221,
              221,
              Math.round(emi.amountRemains) - Math.round(emi.panelty || 0), //amount
            )
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                100, //status
                'panelty', //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                'razorpay',
                new Date(Date.now()),
                new Date(Date.now()),
                221,
                221,
                Math.round(emi.panelty), //amount
              )
            }
          } else {
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                100, //status
                'panelty', //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                'razorpay',
                new Date(Date.now()),
                new Date(Date.now()),
                221,
                221,
                Math.round(emi.amountRemains), //amount
              )
            }
          }
          payingEmiCount += 1
          break
        }
        //INSERT MASTER TRANSECTION ENTRY
        if (payingEmiCount > 1) {
          await this.transactionService.create(
            credit.customerID,
            credit.leadID,
            loan.loanNo,
            100, //status
            'collection', //type
            method,
            `REFID/${emi.emiID}`,
            'order_id',
            0, //deleted
            gateway,
            new Date(Date.now()),
            new Date(Date.now()),
            221,
            221,
            amount,
          )
        }
        await this.collectionService.create(
          credit.customerID,
          credit.leadID,
          loan.loanNo,
          amount,
          'Payment Gateway',
          new Date(Date.now()),
          'orderid',
          // paymentdetails.order_id,
          0.0,
          0.0,
          amountRemains >= emi.amountRemains ? 'Closed' : 'Part Payment',
          'EMI Manual Paid',
          1001,
          new Date(Date.now()),
          'Approved',
          'no',
          'orderid',
          // paymentdetails.order_id,
        )
      }
      let emiRemains = (await this.emiService.countRows(query =>
        query
          .where(function () {
            this.where('status', 'partial-paid').orWhere('status', 'due')
          })
          .andWhere('creditID', credit.creditID),
      )) as number
      let updateCredit = await this.creditService.updateOne(
        { creditID: creditID },
        {
          emiLeft: emiRemains,
          paidAmount: credit.paidAmount + amount,
          amountToBeRepayed: credit.amountToBeRepayed - amount,
        },
      )
      let lead = await this.leadService.findOne({ leadID: credit.leadID }, ['status'])
      await this.callHistoryLogService.create(
        credit.customerID,
        credit.leadID,
        'IVR',
        lead.status,
        String(amount),
        lead.status,
        'Manual EMI Payment',
        new Date(Date.now()),
        1001,
        new Date(Date.now()),
      )

      await CommonHelper.lastEMIUpdater(
        emiRemains,
        credit.creditID,
        lastEmi.dueDate,
        credit.actualTenure,
        credit.leadID,
      )
    }

    return this.serviceResponse(200, {}, 'Payment Update')
  }

  // New code
  async applyPanelty(payload: IApplyPenaltyPayload): Promise<IServiceResponse> {
    const { amount, emiID } = payload

    //find emi if it is partially paid or due only then panelty can be applied
    let emi = await this.emiService.findOne(
      knex =>
        knex
          .where(function () {
            this.where('status', 'partial-paid').orWhere('status', 'due')
          })
          .andWhere('emiID', emiID),
      ['*'],
    )
    if (!emi) throw new NotFoundError('Emi is Paid Or Wrong EMI Id')

    //find credit for some calculations

    if (compareDates(emi.dueDate, Date.now()))
      throw new BadRequestError('Emi is not Applicable For Paneltys')

    let credit = await this.creditService.findOne({ creditID: emi.creditID }, ['*'])
    //insert panelty doc
    let panelty = await this.otherChargesService.create(
      emiID,
      emi.creditID,
      amount,
      emi.customerID,
      0,
      'panelty',
    )
    //update emi
    await this.emiService.updateOne(
      { emiID },
      {
        panelty: emi.panelty || 0 + amount,
        amountPayable: emi.amountPayable + amount,
        paneltyID: panelty,
        amountRemains: emi.amountRemains + amount,
      },
    )
    //update credit
    await this.creditService.updateOne(
      { creditID: emi.creditID },
      {
        paneltyEmis: credit.paneltyEmis ? (credit.paneltyEmis += 1) : 1,
        amountToBeRepayed: credit.amountToBeRepayed + amount,
      },
    )
    return this.serviceResponse(200, {}, 'Penalty Applied')
  }

  // New code
  async getEmis(payload: IGetEmisPayload): Promise<IServiceResponse> {
    const { customerID } = payload

    let credit = await this.creditService.findOne({ customerID, status: CreditStatus.DISBURSED }, [
      'creditID',
    ])
    if (!credit) throw new NotFoundError('No Active Emi Loan Found')

    let getEmis = await this.emiService.find(
      { creditID: credit.creditID },
      [{ column: 'customerID', order: 'desc' }],
      [
        'creditID',
        'customerID',
        'principal',
        'interest',
        'panelty',
        'amountPayable',
        'openingBalance',
        'closingBalance',
        'dueDate',
        'status',
        'amountRemains',
      ],
    )

    return this.serviceResponse(200, getEmis, 'Here is the list of all emis')
  }

  // New code
  async getDocsRequirements(payload: IGetDocsRequirementsPayload): Promise<IServiceResponse> {
    let { loanAmount, roi, tenure, creditId } = payload

    let credit = await this.creditService.findOne({ creditID: creditId }, [
      'creditID',
      'processingFee',
      'principal',
      'firstDueDate',
      'brokenPeriodIntrest',
      'roi',
      'gst',
      'created_at',
      'leadID',
    ])

    if (!credit) throw new NotFoundError('No Active Emi Loan Found')

    let processingFee = credit.processingFee
    let principal = credit.principal
    let firstDueDate = new Date(format(credit.firstDueDate, 'yyyy-MM-dd'))
    //let brokenPeriodIntrest = credit.brokenPeriodIntrest
    let Roi = credit.roi
    let gst = credit.gst
    let bpiCharges = await this.emiHelper.bpiCalculator(principal, Roi, firstDueDate)
    //let brokenPeriodInterest = bpiCharges
    let netDisbursedAmount = principal - processingFee - gst
    let loan = await loanService.findOne({ leadID: credit.leadID }, ['loanNo', 'disbursalDate'])

    const isValidDate = (date: any): boolean => {
      const parsedDate = typeof date === 'string' ? new Date(date) : date
      return (
        parsedDate instanceof Date &&
        !isNaN(parsedDate.getTime()) &&
        parsedDate.getFullYear() > 1900
      )
    }
    let emiDoc: IEMIDoc
    if (!loan || !isValidDate(loan.disbursalDate)) {
      emiDoc = (await this.emiHelper.emiGenerator(
        +loanAmount,
        +roi,
        +tenure,
        firstDueDate,
      )) as IEMIDoc
    } else {
      emiDoc = (await this.emiHelper.emiGenerator(
        +loanAmount,
        +roi,
        +tenure,
        firstDueDate,
        loan.disbursalDate,
      )) as IEMIDoc
    }
    // throw new BadRequestError('Error In Generating EMI[loan not Found]')

    // let emiDoc = (await this.emiHelper.emiGenerator(
    //   +loanAmount,
    //   +roi,
    //   +tenure,
    //   firstDueDate,
    // )) as IEMIDoc

    let amountToBeRepayed = emiDoc.repaymentAmount
    await this.creditService.updateOne(
      { creditID: creditId },
      {
        // actually when bpiCharges is negative then this is not bpi as discussed with arvindSir
        brokenPeriodIntrest: bpiCharges < 0 ? 0 : bpiCharges,
        amountToBeRepayed: amountToBeRepayed,
        interest: emiDoc.interest,
      },
    )

    emiDoc.emiBreakdown.forEach((emi, index) => {
      const dueDate = new Date(firstDueDate)
      dueDate.setMonth(dueDate.getMonth() + index)
      emi.dueDate = new Date(format(new Date(dueDate), 'yyyy-MM-dd'))
      emi['status'] = 'due'
    })
    let finalEmiDoc = {
      ...emiDoc,
      processingFee: processingFee,
      firstDueDate: firstDueDate,
      brokenPeriodInterest: bpiCharges < 0 ? 0 : bpiCharges,
      netDisbursedAmount: netDisbursedAmount,
      gst: gst,
    }

    return this.serviceResponse(200, finalEmiDoc, 'Final EMI docs')
  }

  // New code
  async getEmiLoanDetails(payload: IGetEmiLoanDetailsPayload): Promise<IServiceResponse> {
    const { leadID, customerID } = payload

    let lead = await this.leadService.findOne({ leadID, customerID }, ['leadID', 'status'])

    if (!lead) throw new NotFoundError('No lead data found')

    let credit = await this.creditService.findOne({ customerID, leadID }, ['*'])

    if (!credit) throw new NotFoundError("Emi Loan Not Found'")

    let db = getKnexInstance()

    let getEmis = await db('equated_monthly_installments as emi')
      .where({ 'emi.creditID': credit.creditID })
      .leftJoin('other_charges as oc', 'emi.emiID', 'oc.emiID')
      .select(
        'emi.emiID',
        db.raw("DATE_FORMAT(emi.dueDate, '%d/%m/%Y') as dueDate"),
        'emi.actualPaymentDate',
        'emi.creditID',
        'emi.principal',
        'emi.interest',
        'emi.amountPayable',
        'emi.status',
        'emi.amountRemains',
        'oc.id as other_charge_id',
        'oc.amount as other_charge_amount',
        'oc.discription as other_charge_discription',
        'oc.status as other_charge_status',
      )
    let totalPaneltyAmount = 0
    let totalBouncingAmount = 0
    let paneltyEmis = 0
    for (let emi of getEmis) {
      if (emi.other_charge_amount) {
        paneltyEmis += 1
        totalPaneltyAmount += emi.other_charge_amount
        emi.other_charge_discription == 'Bouns Charge'
          ? (totalBouncingAmount += emi.other_charge_amount)
          : null
      }
    }
    let loanDetails = {
      branch: credit.branch,
      loanDisbursed: credit.principal - credit.processingFee - credit.brokenPeriodIntrest,
      principle: credit.principal,
      tenure: credit.tenure,
      actualTenure: credit.actualTenure,
      roi: credit.roi,
      intrest: credit.interest,
      paneltyAmount: totalPaneltyAmount,
      bouncingPenalty: totalBouncingAmount,
      paidAmount: credit.repaymentAmount,
      dueAmount: credit.amountToBeRepayed,
      totalEmis: credit.totalEMIs,
      emiLeft: credit.emiLeft,
      peneltyEmis: paneltyEmis,
      proccessingFee: credit.processingFee,
    }
    for (let emi of getEmis) {
      let dueDateSplit = emi.dueDate.split('/')
      let dueDate = new Date(dueDateSplit[2], dueDateSplit[1] - 1, dueDateSplit[0])
      console.log(dueDate, new Date(Date.now()), dueDate.getTime() < new Date(Date.now()).getTime())
      if (dueDate.getTime() < new Date(Date.now()).getTime()) {
        emi.dpd = Math.floor(
          (new Date(Date.now()).getTime() - dueDate.getTime()) / (1000 * 24 * 60 * 60),
        )
      } else {
        emi.dpd = 0
      }
    }

    return this.serviceResponse(200, { loanDetails, emiList: getEmis }, 'EMI Loan Details')
  }
  private validateCSVHeaders = (header: string[]): boolean => {
    const pattern = /[^a-zA-Z0-9\s]/g // Remove special characters
    const loanHeader = header[0] ? header[0].replace(pattern, '') : 'column1'
    const amountHeader = header[1] ? header[1].replace(pattern, '') : 'column2'

    return header.length === 2 && loanHeader.trim() === 'loanNo' && amountHeader.trim() === 'amount'
  }
  async uploadBulkMandateFile(payload: IFileUploadPayload): Promise<IServiceResponse> {
    const { image, userId, name } = payload
    const results: any[] = []
    const db = getKnexInstance()
    const uploadedTrack = uuidv4()
    let message: string = 'File uploaded successfully.'
    checkUploadTimeIST()

    if (image.size > 2 * 1024 * 1024) {
      throw new BadRequestError('File size must be less than 2MB.')
    }

    const fileStream = Readable.from(image.buffer)

    try {
      await new Promise<void>((resolve, reject) => {
        fileStream
          .pipe(csvParser())
          .on('data', data => {
            results.push(data)
          })
          .on('end', () => {
            resolve()
          })
          .on('error', err => {
            message = 'Error processing the file.'
            reject(err)
          })
      })

      if (results.length > 10000) {
        return this.serviceResponse(400, {}, 'Max upload limit is 10000 rows.')
      }

      const header = Object.keys(results[0])
      if (!this.validateCSVHeaders(header)) {
        return this.serviceResponse(400, {}, 'Column header should be loanNo and amount.')
      }

      const filename = `${Math.floor(Date.now() / 1000)}/${uploadedTrack}.${image.originalname}`
      const folder = `documents/csv`
      const s3UploadResponse = await this.s3Service.uploadDocument(image.buffer, folder, filename)
      if (!s3UploadResponse) {
        return this.serviceResponse(400, {}, 'File extension is not allowed.')
      }

      const newfilename = `${uploadedTrack}.${image!.originalname}`
      const key = `${folder}/${filename}`
      const csvlink = await this.s3Service.getPresignedUrl(key)

      const insertData: IExselMandate[] = []
      const errorLog: IErrorLog[] = []
      let errorFileName: string = ''
      let logData: {}
      let totalRepayAmount = null
      let loanQuery: ILoanQueryResult

      for (const row of results) {
        const normalizedRow: Record<string, any> = {}
        for (const key in row) {
          normalizedRow[key.trim().toLowerCase()] = row[key]
        }

        const loanNo = normalizedRow['loanno']
        const amount = parseFloat(row['amount'])
        if (loanNo && amount) {
          const loanQuery = await db('loan AS ll')
            .leftJoin('leads', 'leads.leadID', '=', 'll.leadID')
            .select(
              'leads.leadID',
              'll.loanNo',
              'leads.customerID',
              'leads.productID',
              'leads.ipc',
              'leads.status',
              'leads.em_id',
              'll.accountNo',
            )
            .whereIn('leads.status', ['Disbursed', 'Part Payment'])
            .where('ll.status', 'Disbursed')
            .where('ll.loanNo', loanNo)
            .first()

          if (loanQuery) {
            const ema = await db('razorpay_mandate')
              .where('status', 'paid')
              .whereNotNull('customerID')
              .where('customerID', loanQuery.customerID)
              .orderBy('id', 'desc')
              .first()
            let active: string
            if (!ema) {
              errorLog.push({
                LoanNumber: loanNo,
                Amount: amount,
                message: 'Mandate not found',
                uploadDate: new Date(),
              })
            } else {
              let ifscData = await db('bank_ifsc')
                .where('IFSC', ema?.ifsc)
                .orderBy('id', 'desc')
                .first()
              active = ifscData ? ifscData.is_active : '1'
            }
            if (ema && active === '1') {
              if (loanQuery.productID === ProductID.PAYDAY) {
                if (loanQuery.ipc === 1) {
                  totalRepayAmount = await calculateTotalRepayPaydayAmountIPC(
                    loanQuery.leadID,
                    loanQuery.status,
                  )
                } else {
                  totalRepayAmount = await calculateTotalRepayPaydayAmountNonIPC(loanQuery.leadID)
                }
              } else {
                // totalRepayAmount = await calculateTotalRepayEmiAmount(
                //   loanQuery.leadID,
                //   loanQuery.customerID,
                // )
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
                  [loanQuery.leadID],
                )
                // console.log("query",query)
                totalRepayAmount = query[0]?.[0]?.Repay_Amount ?? 0
                console.log('totalRepayamount', totalRepayAmount)
              }

              const maxAmount = ema?.emMaxamount ?? -1
              const expiryDate = new Date(
                new Date(ema?.credated_date).getTime() + 270 * 24 * 60 * 60 * 1000,
              )
              if (expiryDate > new Date() || ema?.status === 'expired') {
                if (amount <= maxAmount && amount > 100 && amount <= totalRepayAmount) {
                  insertData.push({
                    loanNo: loanQuery.loanNo,
                    leadID: loanQuery.leadID,
                    track: uploadedTrack,
                    userID: userId,
                    emandateID: ema.id,
                    status: '0',
                    customerID: loanQuery.customerID,
                    accountNo: loanQuery.accountNo,
                    collectable_amount: amount,
                    productID: loanQuery.productID,
                  })
                  const agentName = name
                  logData = {
                    customerID: loanQuery.customerID,
                    leadID: loanQuery.leadID,
                    callType: 'IVR',
                    status: 'In Queue',
                    remark: `Loan Number (${loanQuery.loanNo}) added in Queue for mandate by ${agentName}`,
                    appAmount: amount,
                    noteli: '',
                    callbackTime: new Date(),
                    calledBy: userId,
                  }
                } else {
                  errorLog.push({
                    LoanNumber: loanNo,
                    Amount: amount,
                    message: `Amount ${amount} is not within acceptable range.`,
                    uploadDate: new Date(),
                  })
                }
              } else {
                errorLog.push({
                  LoanNumber: loanNo,
                  Amount: amount,
                  message: 'Mandate Expired',
                  uploadDate: new Date(),
                })
              }
            } else {
              errorLog.push({
                LoanNumber: loanNo,
                Amount: amount,
                message: 'Emandate status must be paid or bank must be active',
                uploadDate: new Date(),
              })
            }
          } else {
            errorLog.push({
              LoanNumber: loanNo,
              Amount: amount,
              message: 'This loan number does not match certain conditions.',
              uploadDate: new Date(),
            })
          }
        }
      }

      if (errorLog.length > 0) {
        errorFileName = `Errorlist${uploadedTrack}${new Date().toISOString().split('T')[0]}.csv`
        const errorFileS3 = await this.generateAndUploadCSV({
          data: errorLog,
          headers: ['LoanNumber', 'Amount', 'message', 'uploadDate'],
          filename: errorFileName,
          folder: `documents/errorcsv`,
        })

        if (!errorFileS3) {
          return this.serviceResponse(400, {}, 'Failed to upload error file.')
        }
      }
      await db('exsl_filelog').insert({
        fileName: filename,
        uploadStatus: 'uploaded',
        processStatus: 'In Queue',
        error: `documents/errorcsv/${errorFileName}`,
        errorfilelink: `${folder}/${uploadedTrack}.csv`,
        filelink: csvlink,
        succesfile: uploadedTrack,
        cron_status: 0,
        userID: userId,
        productID: loanQuery?.productID,
      })
      if (insertData.length === 0) {
        message = 'No valid records found.'
        return this.serviceResponse(400, {}, message)
      }
      if (insertData.length > 0) {
        await db('exsl_mandate').insert(insertData)
        await db('callhistoryLogs').insert(logData)
      }

      message = `File uploaded successfully. ${insertData.length} entries added.`
      return this.serviceResponse(200, {}, message)
    } catch (err) {
      console.error(err)
      return this.serviceResponse(500, {}, 'An error occurred while processing the file.')
    }
  }

  async callSetBulkMandate(): Promise<void> {
    const db = getKnexInstance()
    const mandateList = await db('exsl_filelog')
      .whereNotNull('succesfile')
      .where('cron_status', 0)
      .whereNot('succesfile', '')
      .whereNot('succesfile', 'like', '%documents/successcsv%')
      .orderBy('id', 'desc')
      .first()
    if (mandateList && mandateList.succesfile) {
      await db('exsl_filelog')
        .where('succesfile', mandateList.succesfile)
        .update({ cron_status: 1 })

      await this.setBulkMandate(mandateList.succesfile)
    }
  }

  async setBulkMandate(track: string): Promise<IStatusInfo[]> {
    const db = getKnexInstance()
    if (!db) {
      console.error('Failed to initialize the Knex instance.')
    }

    const mandateList = await db('exsl_mandate AS bemd')
      .join('leads AS l1', 'l1.leadID', '=', 'bemd.leadID')
      .join('razorpay_mandate', 'razorpay_mandate.customerID', '=', 'bemd.customerID')
      .join('leads AS l2', 'l2.em_id', '=', 'razorpay_mandate.id')
      .join('loan', 'loan.accountNo', '=', 'razorpay_mandate.accountNo')
      .select(
        'bemd.leadID',
        'bemd.emandateID',
        'bemd.loanNo',
        'bemd.collectable_amount',
        'bemd.accountNo',
        'bemd.customerID',
        'bemd.productID',
      )
      .whereIn('l1.status', ['Disbursed', 'Part Payment'])
      .where('razorpay_mandate.status', 'paid')
      .where('bemd.status', '0')
      .where('bemd.track', track)
      .distinct()
    if (!mandateList || mandateList.length === 0) {
      console.log('No mandates found for the given conditions.')
    }
    let out: IStatusInfo[] = []
    let loan_data: ILoanInfo[] = []
    for (const mnd of mandateList) {
      const ebulkemd = await this.submitEmdCharge(
        mnd.customerID,
        mnd.leadID,
        mnd.emandateID,
        mnd.collectable_amount,
      )
      const statusKey = ebulkemd?.status ?? 'In Process'

      const data = {
        customerID: mnd.customerID,
        leadID: mnd.leadID,
        callType: 'IVR',
        status: statusKey,
        remark: ebulkemd.message ?? `Loan Number (${mnd.loanNo}) in Processed for mandate`,
        noteli: ' ',
        appAmount: mnd.collectable_amount ?? 0,
        callbackTime: new Date().toISOString().split('T')[0],
        calledBy: 221,
        createdDate: new Date(),
      }

      const calllog = await db('callhistoryLogs')
        .where('customerID', mnd.customerID)
        .where('leadID', mnd.leadID)
        .first()

      const message = ebulkemd.message ?? `Loan Number (${mnd.loanNo}) in Processed for mandate`
      loan_data.push({
        LoanNumber: mnd.loanNo,
        Amount: mnd.collectable_amount,
        Status: statusKey,
        message: message,
        date_of_emandate: new Date().toISOString(),
      })

      await db('exsl_mandate')
        .where('leadID', mnd.leadID)
        .where('productID', mnd.productID)
        .where('status', '0')
        .orderBy('id', 'desc')
        .update({ status: statusKey })
        .limit(1)

      await db('callhistoryLogs').insert(data)

      out.push(ebulkemd)
    }

    if (loan_data.length > 0) {
      const folder = 'documents/successcsv'
      const loanheader = ['LoanNumber', 'Amount', 'Status', 'message', 'date_of_emandate']
      const loanfile = `Loanlist${track}${new Date().toISOString().split('T')[0]}.csv`
      const successFileS3Path = await this.generateAndUploadCSV({
        data: loan_data,
        headers: loanheader,
        filename: loanfile,
        folder: folder,
      })
      if (!successFileS3Path) {
        throw new BadRequestError('Failed to upload Loanlist.')
      }
      await db('exsl_filelog').where('succesfile', track).update({
        uploadStatus: 'uploaded',
        processStatus: 'Success',
        succesfile: track,
      })
    }

    return out
  }

  private writeFile = promisify(fs.writeFile)
  private unlinkFile = promisify(fs.unlink)

  async generateAndUploadCSV({
    data,
    headers,
    filename,
    folder,
  }: ICSVGeneration): Promise<Record<any, any>> {
    const filePath = path.join(__dirname, `${filename}`)
    const fileStream = fs.createWriteStream(filePath)

    fileStream.write(`${headers.join(',')}\n`)

    data.forEach(row => {
      const csvRow = headers.map(header => row[header] ?? '').join(',')
      fileStream.write(`${csvRow}\n`)
    })

    fileStream.end()

    await new Promise(resolve => fileStream.on('finish', resolve))

    const s3FileName = path.basename(filePath)
    const s3UploadResponse = await this.s3Service.uploadDocument(
      fs.readFileSync(filePath),
      folder,
      s3FileName,
    )

    await this.unlinkFile(filePath)

    return s3UploadResponse
  }

  async submitEmdCharge(customerID: number, leadId: number, emID: string, emAmount: number) {
    const db = getKnexInstance()
    // Check if the user has created 3 e-mandates this month
    // const rbi = await db('razorpay_emOrder')
    //   .where('leadID', leadId)
    //   .whereRaw("DATE_FORMAT(createdDate, '%Y-%m') = ?", [
    //     new Date().toISOString().slice(0, 7),
    //   ])
    //   .whereNotNull('razorpay_payment_id')
    //   .count('* as count')
    // const emandateCount = parseInt(rbi[0].count as string, 10)

    // if (emandateCount >= 3) {
    //   return {
    //     status: '3',
    //     leadId,
    //     customerID,
    //     message: 'This user has already created 3 e-mandates this month.',
    //   }
    // }

    const ema = await db('razorpay_mandate').where('id', emID).first()
    const collectedPayment = await db('onlinepayment')
      .where('paymentStatus', 'success')
      .where('method', 'E-mandate')
      .where('leadID', leadId)
      .sum('toValue as total')
    let emMaxAmount = ema?.emMaxamount ?? -1

    if (collectedPayment[0].total < emMaxAmount && emMaxAmount > 0) {
      emMaxAmount -= collectedPayment[0].total
    }

    if (collectedPayment[0].total < 1 && emMaxAmount < 1) {
      const loan = await db('loan').where('customerID', customerID).where('leadID', leadId).first()
      emMaxAmount = (loan?.disbursalAmount ?? 0) * 2
    }

    if (emAmount > emMaxAmount) {
      return {
        status: 'Failed',
        leadId,
        customerID,
        message: `Max chargeable amount is ${emMaxAmount}rs.`,
      }
    }

    if (emAmount < 100) {
      return {
        status: 'Failed',
        leadId,
        customerID,
        message: `Minimum amount is 100rs.`,
      }
    }

    let totalRepayAmount: number = 0
    const leadData = await this.leadService.findOne({ leadID: leadId }, [
      'customerID',
      'leadID',
      'status',
    ])

    const data1 = {
      amount: +emAmount * 100,
      currency: 'INR',
      payment_capture: true,
      leadID: leadId,
      customerID: customerID,
      customer_id: ema?.customer_id ?? customerID,
      receipt: 'INR',
      notes: {
        notes_key_1: ema?.cust_name ?? '',
        notes_key_2: ema?.cust_name ?? '',
      },
    }
    const orderResponse = await this.sendRazorpayRequestNew(
      `${config.razorPayBaseUrl}/orders/`,
      data1,
      'e-mandate nach orders',
    )

    if (orderResponse.error && orderResponse.error.description) {
      const message = orderResponse.error.description ?? 'data error by third party'
      return {
        status: 'Failed',
        leadId,
        customerID,
        message: 'Mandate is not active[Error received from razorpay]',
      }
    }

    let orderID = await db('razorpay_emOrder').insert({
      emID: ema?.id ?? emID,
      customerID: customerID,
      leadID: leadId,
      orderID: orderResponse.id,
      entity: orderResponse.entity,
      amount: orderResponse.amount / 100,
      amount_paid: orderResponse.amount_paid,
      amount_due: orderResponse.amount_due / 100,
      currency: orderResponse.currency,
      receipt: orderResponse.receipt,
      status: orderResponse.status,
      razorpay_payment_id: 'no payment',
      razorpay_signature: 'no signature',
      razorpay_order_id: orderResponse.id ?? 'no order',
      notes_key_1: orderResponse.notes.notes_key_1,
      tokenID: ema?.token_id ?? 'token_XYZ',
      uid: 221,
      createdDate: new Date(),
      remarks: 'Auto Collect',
    })

    if (!orderID) {
      return {
        status: 'Failed',
        leadId,
        customerID,
        message: 'Order insertion failed',
      }
    }

    const data2 = {
      email: ema?.cust_email ?? '',
      contact: ema?.cust_contact ?? '',
      leadID: leadId,
      amount: emAmount * 100,
      currency: 'INR',
      order_id: orderResponse.id,
      customerID: customerID,
      customer_id: ema?.customer_id ?? '',
      token: ema?.token_id ?? 'token_XYZ',
      recurring: '1',
      description: ema?.cust_name ?? '',
      notes: {
        notes_key_1: ema?.cust_name ?? '',
        notes_key_2: ema?.cust_name ?? '',
      },
    }
    const paymentResponse = await this.sendRazorpayRequestNew(
      `${config.razorPayBaseUrl}/payments/create/recurring/`,
      data2,
      'e-mandate nach recurring',
    )
    if (paymentResponse.error && paymentResponse.error.description) {
      const message = paymentResponse.error.description ?? 'data error by third party'
      return {
        status: 'Failed',
        leadId,
        customerID,
        message: 'Mandate is not active[Error received from razorpay]',
      }
    }

    let orderIDValue: number

    if (Array.isArray(orderID) && orderID.length > 0) {
      orderIDValue = orderID[0]
    }
    await db('razorpay_emOrder')
      .where('id', orderIDValue)
      .update({
        razorpay_payment_id: paymentResponse.razorpay_payment_id ?? 'no payment id',
        razorpay_order_id: orderResponse.id,
        razorpay_signature: paymentResponse.razorpay_signature,
      })

    const customerData = await db('customer').where('customerID', customerID).first()
    await db('onlinepayment').insert({
      name: customerData?.name ?? '',
      email: customerData?.email ?? '',
      phone: customerData?.mobile ?? '',
      service: 'Ramfincorp',
      typeProduct: 'E-mandate',
      toValue: orderResponse.amount / 100,
      message: customerData?.pancard ?? '',
      razorpayOrderId: orderResponse.id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id ?? 'no payment id',
      paymentStatus: 'PENDING',
      makerstamp: new Date(),
      updatestamp: new Date(),
      status: 'no',
      paymentType: 'E-mandate Charge',
      method: 'E-mandate',
      leadID: leadId,
    })
    return {
      status: 'Success',
      leadId,
      customerID,
      message: 'Success',
    }
  }

  async sendRazorpayRequestNew(
    url: string,
    data: IRazorpayRequestData,
    apiType: string,
  ): Promise<any> {
    this.prepareRequestData(data, apiType)
    const jsonResponse = await this.postRazorpayRequest(url, data)
    if (!jsonResponse.success) {
      return {
        error: {
          description: jsonResponse.message,
        },
      }
    }
    return jsonResponse
  }
  async prepareRequestData(data: IRazorpayRequestData, apiType: string): Promise<void> {
    if (apiType !== 'e-mandate nach recurring') {
      delete data.customer_id
    }
    delete data.customerID
    delete data.leadID
  }
  async postRazorpayRequest(
    url: string,
    data: IRazorpayRequestData,
  ): Promise<IPostRazorpayRequest> {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Basic ${this.razorpayPg.auth}`,
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
        maxRedirects: 10,
      })
      return {
        success: true,
        ...response.data,
      }
    } catch (error) {
      console.error(
        'Error in Razorpay request:',
        error.response ? error.response.data : error.message,
      )
      return {
        success: false,
        message: error.response?.data || 'Error in Razorpay Request',
      }
    }
  }

  async getBulkMandateData(payload: IMandatePayload): Promise<IServiceResponse> {
    let { page = 1, limit = 20 } = payload
    const db = getKnexInstance()
    const pageTitle = 'Bulk E-mandate by Excel'
    const currentPage = page
    const offset = (currentPage - 1) * limit

    const fileData = await db('exsl_filelog')
      .where('uploadStatus', 'uploaded')
      .orderBy('id', 'DESC')
      .limit(limit)
      .offset(offset)
    const fileDataTotal = await db('exsl_filelog')
      .where('uploadStatus', 'uploaded')
      .count({ count: '*' })
      .first()

    const insertData = await db('exsl_mandate')
      .join('customer', 'exsl_mandate.customerID', '=', 'customer.customerID')
      .select('exsl_mandate.*', 'customer.name')
      .whereIn('exsl_mandate.status', ['0', '1', '2', '3', '4'])
      .orderBy('exsl_mandate.id', 'DESC')
      .limit(limit)
      .offset(offset)

    const insertDataTotal = await db('exsl_mandate')
      .join('customer', 'exsl_mandate.customerID', '=', 'customer.customerID')
      .whereIn('exsl_mandate.status', ['0', '1', '2', '3', '4'])
      .count({ count: '*' })
      .first()

    const fileDataTotalPages = Math.ceil(fileDataTotal?.count / limit)
    const insertDataTotalPages = Math.ceil(insertDataTotal?.count / limit)

    return this.serviceResponse(
      200,
      {
        insertData,
        fileData,
        pageTitle,
        currentPage,
        fileDataTotalPages,
        insertDataTotalPages,
        fileDataTotal: fileDataTotal.count,
        insertDataTotal: insertDataTotal.count,
      },
      'Data for bulk mandate ',
    )
  }
  async getUrlforBulkMandateFile(payload: IFileUrlPayload): Promise<IServiceResponse> {
    let { fileName } = payload
    let csvlink = await this.s3Service.getPresignedUrl(fileName)

    return this.serviceResponse(
      200,
      {
        csvlink,
      },
      'url',
    )
  }
  private sanitizeXLSXData(parsedData: any[]): any[] {
    return parsedData.map(row => ({
      mobile: row['customer_cid'] || null,
      disposition: row['primary_dispo'] || null,
    }))
  }

  async uploadNotRequiredFile(payload: IFileUrlPayloadProjection): Promise<IServiceResponse> {
    const { image, userId } = payload
    const db = getKnexInstance()
    let parsedData: any[] = []

    parsedData = projectionService.parseXLSX(image.buffer)

    if (parsedData.length === 0) {
      throw new BadRequestError('No data available for insertion')
    }

    const validXLSXHeaders = ['customer_cid', 'primary_dispo']
    const headers = Object.keys(parsedData[0])

    const isValid = headers.every(header => validXLSXHeaders.includes(header))
    const hasNoExtraHeaders = headers.length === validXLSXHeaders.length

    if (!isValid || !hasNoExtraHeaders) {
      throw new BadRequestError(
        `Invalid headers in XLSX file. Expected headers: ${validXLSXHeaders.join(', ')}`,
      )
    }

    let normalizedData = parsedData.map(row => {
      const normalizedRow: Record<string, any> = {}
      Object.keys(row).forEach(key => {
        normalizedRow[key.trim()] = row[key]
      })
      return normalizedRow
    })

    try {
      const sanitizedData = this.sanitizeXLSXData(normalizedData)
      const uploadedTrack = uuidv4()
      const filename = `${Math.floor(Date.now() / 1000)}/${uploadedTrack}.${image.originalname}`
      const folder = `documents/notRequiredLeads/csv`
      const s3UploadResponse = await this.s3Service.uploadDocument(image.buffer, folder, filename)
      if (!s3UploadResponse) {
        throw new BadRequestError('File extension is not allowed.')
      }

      const key = `${folder}/${filename}`
      const csvlink = await this.s3Service.getPresignedUrl(key)

      await db.transaction(async trx => {
        const CHUNK_SIZE = 1000

        for (let i = 0; i < sanitizedData.length; i += CHUNK_SIZE) {
          const chunk = sanitizedData.slice(i, i + CHUNK_SIZE)
          await this.processChunk(chunk, trx, uploadedTrack, userId, filename, csvlink)
        }
      })

      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          totalRecords: parsedData.length,
          totalSuccessful: parsedData.length,
          failedRecord: 0,
        },
        'File data successfully uploaded and inserted into the database',
      )
    } catch (error) {
      console.error('Transaction failed:', error.message)
      throw error
    } finally {
      if (image.buffer) {
        image.buffer = null
        console.log('Buffer cleared successfully')
      }
    }
  }

  private processChunk = async (
    chunk: any[],
    trx: any,
    uploadedTrack: string,
    userID: number,
    fileName: string,
    csvlink: string,
  ): Promise<void> => {
    const db = getKnexInstance()

    const phoneNumbers = chunk.map(row => row.mobile).filter(Boolean)

    try {
      const loanData = await trx('customer')
        .whereIn('mobile', phoneNumbers)
        .join('leads', 'customer.customerID', '=', 'leads.customerID')
        .where('leads.status', 'Approved Process')
        .select('customer.mobile', 'leads.leadID', 'leads.customerID')
        .orderBy('leads.leadID', 'desc')

      const loanMap = loanData.reduce((acc, { mobile, leadID, customerID }) => {
        acc[mobile] = { leadID, customerID }
        return acc
      }, {})

      const insertBatch = []

      for (const row of chunk) {
        //const leadID = loanMap[row.mobile] || null
        const { leadID, customerID } = loanMap[row.mobile] || {}

        if (!leadID) {
          insertBatch.push({
            leadID: null,
            fileId: uploadedTrack,
            status: 'failed',
            mobile: row.mobile,
            disposition: row.disposition ? row.disposition : '',
          })
        } else {
          await this.leadService.updateOne(
            { leadID },
            { status: LeadStatus.NOT_REQUIRED, sanctionalloUID: userID },
          )
          this.approvalModel.findOneAndUpdateApproval(
            { leadID: leadID },
            {
              status: LeadStatus.NOT_REQUIRED,
              rejectionReason: 'Not Required Now',
              remark: 'Not Required',
            },
          ),
            await this.callHistoryLogsModel.insert({
              customerID: customerID,
              leadID: leadID,
              callType: 'IVR',
              status: LeadStatus.NOT_REQUIRED,
              remark: 'Not Required',
              noteli: '',
              calledBy: userID,
              appAmount: '',
              callbackTime: new Date(),
            })
          insertBatch.push({
            leadID,
            fileId: uploadedTrack,
            status: 'success',
            mobile: row.mobile,
            disposition: row.disposition,
          })
        }
      }
      let fileLogData = {
        fileName: fileName,
        userID: userID,
        filelink: csvlink,
        fileId: uploadedTrack,
      }
      if (insertBatch.length > 0) {
        await db('not_required_leads_filelog').insert(fileLogData)
        await db('not_required_leads').insert(insertBatch)
      }
    } catch (error) {
      console.error('Error processing chunk:', error)
      throw new BadRequestError('Failed to process the chunk')
    }
  }
  async webengageUsers(userData: any): Promise<IServiceResponse> {
    const WEBENGAGE_URL = `${config.webengageHost}/v1/accounts/${config.webengageLicenseCode}/users`
    const response = await axios.post(WEBENGAGE_URL, userData, {
      headers: {
        Authorization: `Bearer ${config.webengageApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    return this.serviceResponse(200, response.data, 'send user data successfully')
  }

  async webengageEvents(eventData: any): Promise<IServiceResponse> {
    const WEBENGAGE_URL = `${config.webengageHost}/v1/accounts/${config.webengageLicenseCode}/events`

    // const response = await axios.post(WEBENGAGE_URL, eventData, {
    //   headers: {
    //     Authorization: `Bearer ${config.webengageApiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    // })
    try {
      const response = await axios.post(WEBENGAGE_URL, eventData, {
        headers: {
          Authorization: `Bearer ${config.webengageApiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.data.response.status === 'queued') {
        return this.serviceResponse(200, response.data, 'send events successfully')
      } else {
        return this.serviceResponse(500, {}, 'Error in sending events to webengage')
      }
    } catch (error: any) {
      console.error('WebEngage API Error:', error.response?.data || error.message)
      return this.serviceResponse(400, {}, 'Invalid request sent to WebEngage')
    }
  }
  async callRepayDateBulkMandate(): Promise<void> {
    const db = getKnexInstance()
    if (!db) {
      console.error('Failed to initialize the Knex instance.')
    }

    //const date = '2025-01-08'
    const date = format(new Date(), 'yyyy-MM-dd')

    const emiQuery = await db('equated_monthly_installments as emi')
      .select('emi.leadID', 'emi.customerID', 'emi.dueDate', 'emi.amountPayable', 'rm.id')
      .select(db.raw("'emi' AS source"))
      .innerJoin('razorpay_mandate as rm', function (join) {
        join
          .on('emi.customerID', '=', 'rm.customerID')
          .on('rm.status', '=', db.raw('?', ['paid']))
          .on(db.raw('DATE_ADD(rm.credated_date, INTERVAL 270 DAY) > ?', [new Date()]))
      })
      .whereRaw('DATE(emi.dueDate) = ?', [date])
      .where('emi.status', 'due')
      .union(function () {
        this.select(
          'leads.leadID',
          'leads.customerID',
          'rm.id',
          db.raw('approval.repayDate as dueDate'),
          db.raw('approval.loanAmtApproved as amountPayable'),
          db.raw("'payday' AS source"),
        )
          .from('leads')
          .innerJoin('approval', 'leads.leadID', 'approval.leadID')
          .innerJoin('razorpay_mandate as rm', function (join) {
            join
              .on('leads.customerID', '=', 'rm.customerID')
              .on('rm.status', '=', db.raw('?', ['paid']))
              .on(db.raw('DATE_ADD(rm.credated_date, INTERVAL 270 DAY) > ?', [new Date()]))
          })
          .whereRaw('DATE(approval.repayDate) = ?', [date])
          .whereIn('leads.status', ['Disbursed', 'Part Payment'])
      })

    const paydayLeadIDs = emiQuery.filter(item => item.source === 'payday').map(item => item.leadID)

    if (paydayLeadIDs.length > 0) {
      const loanDetails = await db('approval as a')
        .select(
          'a.leadID',
          'a.loanAmtApproved',
          'a.roi',
          'a.repayDate',
          'l.disbursalDate',
          'l.disbursalAmount',
        )
        .join('loan as l', 'l.leadID', 'a.leadID')
        .whereIn('a.leadID', paydayLeadIDs)

      console.log('loanDetails', loanDetails)
      emiQuery.forEach(entry => {
        if (entry.source === 'payday') {
          const loanDetail = loanDetails.find(loan => loan.leadID === entry.leadID)

          if (loanDetail) {
            const tenure = differenceInCalendarDays(
              new Date(loanDetail.repayDate),
              new Date(loanDetail.disbursalDate),
            )

            const interest = (loanDetail.roi * loanDetail.loanAmtApproved * tenure) / 100
            entry.amountPayable = +Math.round(
              interest + Number(loanDetail.loanAmtApproved),
            ).toString()
          }
        }
      })
    }

    if (!emiQuery || emiQuery.length === 0) {
      console.log('No mandates found for the given conditions.')
    }
    let loan_data: ILoanInfo[] = []
    for (const mnd of emiQuery) {
      const ebulkemd = await this.submitEmdChargeDueDate(
        mnd.customerID,
        mnd.leadID,
        mnd.id,
        mnd.amountPayable,
      )
      const statusKey = ebulkemd?.status ?? '2'
      const data = {
        customerID: mnd.customerID,
        leadID: mnd.leadID,
        callType: 'IVR',
        status: statusKey,
        remark: ebulkemd.message ?? `Lead Id (${mnd.leadID}) in Processed for mandate`,
        noteli: ' ',
        appAmount: mnd.amountPayable ?? 0,
        callbackTime: new Date().toISOString().split('T')[0],
        calledBy: 221,
        createdDate: new Date(),
      }

      await db('callhistoryLogs').insert(data)
    }
    return
  }
  async submitEmdChargeDueDate(customerID: number, leadId: number, emID: string, emAmount: number) {
    const db = getKnexInstance()
    //optimise
    const ema = await db('razorpay_mandate').where('id', emID).first()

    const data1 = {
      amount: emAmount * 100,
      currency: 'INR',
      payment_capture: true,
      leadID: leadId,
      customerID: customerID,
      customer_id: ema?.customer_id ?? customerID,
      receipt: 'INR',
      notes: {
        notes_key_1: ema?.cust_name ?? '',
        notes_key_2: ema?.cust_name ?? '',
      },
    }

    const orderResponse = await this.sendRazorpayRequestNew(
      `${config.razorPayBaseUrl}/orders/`,
      data1,
      'e-mandate nach orders',
    )
    if (orderResponse.error && orderResponse.error.description) {
      const message = orderResponse.error.description ?? 'data error by third party'
      return {
        status: '3',
        leadId,
        customerID,
        message: 'Mandate is not active[Error received from razorpay]',
      }
    }
    // optimise and use interface here
    let orderID = await db('razorpay_emOrder').insert({
      emID: ema?.id ?? emID,
      customerID: customerID,
      leadID: leadId,
      orderID: orderResponse.id,
      entity: orderResponse.entity,
      amount: orderResponse.amount / 100,
      amount_paid: orderResponse.amount_paid,
      amount_due: orderResponse.amount_due / 100,
      currency: orderResponse.currency,
      receipt: orderResponse.receipt,
      status: orderResponse.status,
      razorpay_payment_id: 'no payment',
      razorpay_signature: 'no signature',
      razorpay_order_id: orderResponse.id ?? 'no order',
      notes_key_1: orderResponse.notes.notes_key_1,
      tokenID: ema?.token_id ?? 'token_XYZ',
      uid: 221,
      createdDate: new Date(),
      remarks: 'Auto Collect',
    })

    if (!orderID) {
      return {
        status: '3',
        leadId,
        customerID,
        message: 'Order insertion failed',
      }
    }

    const data2 = {
      email: ema?.cust_email ?? '',
      contact: ema?.cust_contact ?? '',
      leadID: leadId,
      amount: emAmount * 100,
      currency: 'INR',
      order_id: orderResponse.id,
      customerID: customerID,
      customer_id: ema?.customer_id ?? '',
      token: ema?.token_id ?? 'token_XYZ',
      recurring: '1',
      description: ema?.cust_name ?? '',
      notes: {
        notes_key_1: ema?.cust_name ?? '',
        notes_key_2: ema?.cust_name ?? '',
      },
    }

    const paymentResponse = await this.sendRazorpayRequestNew(
      `${config.razorPayBaseUrl}/payments/create/recurring/`,
      data2,
      'e-mandate nach recurring',
    )
    if (paymentResponse.error && paymentResponse.error.description) {
      const message = paymentResponse.error.description ?? 'data error by third party'
      return {
        status: '3',
        leadId,
        customerID,
        message: 'Mandate is not active[Error received from razorpay]',
      }
    }

    let orderIDValue: number

    if (Array.isArray(orderID) && orderID.length > 0) {
      orderIDValue = orderID[0]
    }
    await db('razorpay_emOrder')
      .where('id', orderIDValue)
      .update({
        razorpay_payment_id: paymentResponse.razorpay_payment_id ?? 'no payment id',
        razorpay_order_id: orderResponse.id,
        razorpay_signature: paymentResponse.razorpay_signature,
      })

    const customerData = await db('customer').where('customerID', customerID).first()
    // same here
    await db('onlinepayment').insert({
      name: customerData?.name ?? '',
      email: customerData?.email ?? '',
      phone: customerData?.mobile ?? '',
      service: 'Ramfincorp',
      typeProduct: 'E-mandate',
      toValue: orderResponse.amount / 100,
      message: customerData?.pancard ?? '',
      razorpayOrderId: orderResponse.id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id ?? 'no payment id',
      paymentStatus: 'PENDING',
      makerstamp: new Date(),
      updatestamp: new Date(),
      status: 'no',
      paymentType: 'E-mandate Charge',
      method: 'E-mandate',
      leadID: leadId,
    })
    return {
      status: '4',
      leadId,
      customerID,
      message: 'Success',
    }
  }
  async fetchPaymentsFromRazorpay(from: number, to: number): Promise<any[]> {
    let payments = []
    let skip = 0
    const count = 100

    while (true) {
      try {
        const response = await axios.get(
          `${config.razorPayBaseUrl}/payments?from=${from}&to=${to}&count=${count}&skip=${skip}`,
          {
            auth: {
              username: config.razorpayDisbursalKeyId,
              password: config.razorpayDisbursalKeySecret,
            },
          },
        )

        const fetchedItems = response.data.items || []
        payments = payments.concat(fetchedItems)

        console.log(`Fetched ${fetchedItems.length} payments (Skip: ${skip})`)

        if (fetchedItems.length < count) break

        skip += count
      } catch (error) {
        console.error('Error fetching payments:', error.response?.data || error.message)
        break
      }
    }

    return payments
  }
  async processPayments(payments): Promise<void> {
    let db = getKnexInstance()
    for (const payment of payments) {
      if (payment.status === 'captured') {
        const orderId = payment.order_id
        const paymentData = await db('onlinepayment').where('razorpayOrderId', orderId).first()

        if (!paymentData || paymentData.paymentStatus !== 'SUCCESS') {
          console.log(`Calling addCollection API for order_id: ${orderId}`)
          try {
            // await axios.post(ADD_COLLECTION_API_URL, { order_id: orderId });
            console.log('calling add collection api ================>>>>>>>>>>>', orderId)
          } catch (error) {
            console.error(
              `Error calling addCollection API for order_id ${orderId}:`,
              error.response?.data || error.message,
            )
          }
        } else {
          console.log(`Order ID ${orderId} already exists with SUCCESS status.`)
        }
      }
    }
  }
  async loanDetailsByPan(payload: IPancard): Promise<IServiceResponse> {
    let { pancard } = payload
    let customer = await this.customerModel.findOneCustomer(
      {
        pancard: pancard,
      },
      ['customerID'],
      [{ column: 'customerID', order: 'desc' }],
    )
    if (!customer) {
      throw new BadRequestError('customer not found')
    }
    const leadData = await this.leadService.findOne({ customerID: customer.customerID }, [
      'customerID',
      'leadID',
      'status',
      'createdDate',
    ])
    if (!leadData) {
      throw new BadRequestError('till now leadNot Created ')
    }
    const loanData = await loanService.findOne(
      { leadID: leadData.leadID },
      ['loanNo', 'disbursalAmount', 'disbursalDate', 'createdDate', 'status'],
      [{ column: 'loanID', order: 'desc' }],
    )
    if (!loanData) {
      throw new BadRequestError('there is no loan found in ramfincorp')
    }

    const callHistoryLogs = await this.callHistoryLogsModel.findOne({
      where: { leadID: leadData.leadID },
      select: ['createdDate'],
      order: [{ column: 'callHistoryID', order: 'desc' }],
    })
    const data = {
      dateOfApplication: loanData.createdDate.toISOString().split('T')[0],
      leadID: leadData.leadID,
      loanAmount: loanData.disbursalAmount,
      status: loanData.status,
      dateOfLastStatusChange: callHistoryLogs.createdDate.toISOString().split('T')[0],
    }

    return this.serviceResponse(200, data, 'loan Data from ramfincorp')
  }
}

export const crmService = new CrmService()
