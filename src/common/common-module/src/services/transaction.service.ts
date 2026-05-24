import { HttpStatusCode } from 'axios'
import momentTz from 'moment-timezone'
import { approvalModel } from '../database/mysql/approval'
import { leadModel } from '../database/mysql/leads'
import { loanModel } from '../database/mysql/loan'
import { transactionModel } from '../database/mysql/transactions'
import { CollectedMode } from '../enums/collection.enum'
import { TransactionGateway, TransactionGatewayKey } from '../enums/transaction.enum'
import { ICustomResponse } from '../interfaces/response.interface'
import { ITransaction, IWhereClause } from '../interfaces/transactions.interface'
import { InsertData } from '../types/model.types'
import { logger } from '../utils/logger'
import ResponseService from './response.service'

export class TransactionService extends ResponseService {
  private readonly loanModel = loanModel
  private readonly approvalModel = approvalModel
  private readonly transactionModel = transactionModel
  private readonly leadModel = leadModel
  constructor() {
    super()
  }

  manageTransactions = async (payload: {
    leadID: number
    type?: 'disbursal'
    collectionID?: number
    gateway?: TransactionGateway
    status?: number
    emiID?: number
    transactionDate?: Date
    remarks?: string
    orderId?: string
    createdBy?: number
    updatedBy?: number
    amount?: number
    mode?: CollectedMode
  }) => {
    const {
      leadID,
      type = null,
      status = null,
      gateway = null,
      collectionID = null,
      emiID = null,
      transactionDate = null,
      remarks = null,
      orderId = null,
      mode = null,
      createdBy = null,
      updatedBy = null,
      amount = null,
    } = payload

    const lead = await this.leadModel.findOne({
      where: {
        leadID,
      },
      select: ['customerID'],
    })

    if (!lead) return this.serviceResponse(HttpStatusCode.NotFound, {}, 'Lead not found')

    const { customerID } = lead

    const [loan, approval] = await Promise.all([
      this.loanModel.findOneLoan({ leadID, customerID }, [
        'loanNo',
        'disbursalRefrenceNo',
        'disbursedBy',
        'disbursalAmount',
        'deduction',
      ]),
      this.approvalModel.findOneApproval({ leadID, customerID }, ['adminFee', 'GstOfAdminFee']),
    ])

    if (!loan || !approval)
      return this.serviceResponse(HttpStatusCode.NotFound, {}, 'Loan/Approval not found')

    const { loanNo, disbursalRefrenceNo, disbursedBy, disbursalAmount, deduction } = loan

    const referenceNo = disbursalRefrenceNo ?? ''
    const transactionGateway = gateway ?? TransactionGateway.RAZORPAY

    const transactionStatus =
      transactionGateway === TransactionGateway.MANUAL ? TransactionGatewayKey.MANUAL : '1'

    if (type === 'disbursal') {
      const saveData: InsertData<ITransaction> = {
        customerID,
        leadID,
        loanNo,
        status: transactionStatus,
        mode: CollectedMode.PAYOUT,
        referenceNo,
        orderId: referenceNo,
        deleted: 0,
        gateway: transactionGateway,
        createdBy: disbursedBy,
        updatedBy: disbursedBy,
        collectionID,
        emiID: emiID,
        transactionDate: transactionDate
          ? (momentTz(transactionDate).format('YYYY-MM-DD HH:mm:ss') as unknown as Date)
          : (momentTz().format('YYYY-MM-DD HH:mm:ss') as unknown as Date),
        remarks,
        amount: 0,
        type,
      }

      const amount = disbursalAmount - deduction

      delete saveData.amount
      delete saveData.type

      const [[disbursalTransactionId], [pfTransactionId], [gstTransactionId]] = await Promise.all([
        // Insert disbursal transaction
        this.transactionModel.create({
          ...saveData,
          type,
          amount,
        }),

        // Insert pf transaction
        this.transactionModel.create({
          ...saveData,
          type: 'pf',
          amount: approval.adminFee,
        }),

        // Insert gst transaction
        this.transactionModel.create({
          ...saveData,
          type: 'gst',
          amount: approval.GstOfAdminFee,
        }),
      ])

      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          disbursalTransactionId,
          pfTransactionId,
          gstTransactionId,
          type,
        },
        'Success',
      )
    }

    // For other types of transactions
    const [transactionID] = await this.transactionModel.create({
      customerID,
      leadID,
      loanNo,
      status,
      type,
      mode,
      referenceNo,
      orderId,
      deleted: 0,
      gateway,
      createdBy,
      updatedBy,
      amount,
      collectionID,
      emiID,
      transactionDate,
      remarks,
    })

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        transactionID,
        type,
      },
      'Success',
    )
  }

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ITransaction | ICustomResponse> {
    try {
      let transactions = await this.transactionModel.getTransactions(where, order, select)
      if (transactions == null || transactions.length == 0) {
        return null
      } else {
        return transactions[0] // Return the first lead if found
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

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ITransaction[] | ICustomResponse> {
    try {
      let transactions = await this.transactionModel.getTransactions(where, order, select)
      if (transactions == null || transactions.length == 0) {
        return null
      } else {
        return transactions // Return the first lead if found
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

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let transactions = await this.transactionModel.countTransactions(where)
      if (transactions == null) {
        return 0
      } else {
        return transactions // Return the first lead if found
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

  public async create(
    customerID: number,
    leadID: number,
    loanNo: string,
    status: number,
    type: string,
    mode: string,
    referenceNo: string,
    orderId: string,
    deleted: number,
    gateway: string,
    createdAt: Date,
    updatedAt: Date,
    createdBy: number,
    updatedBy: number,
    amount: number,
  ): Promise<number> {
    let insertId = await this.transactionModel.insert(
      customerID,
      leadID,
      loanNo,
      status,
      type,
      mode,
      referenceNo,
      orderId,
      deleted,
      gateway,
      createdAt,
      updatedAt,
      createdBy,
      updatedBy,
      amount,
    )
    return insertId
  }

  public async createV2(
    customerID: number,
    leadID: number,
    loanNo: string,
    status: number,
    type: string,
    mode: string,
    referenceNo: string,
    orderId: string,
    deleted: number,
    gateway: string,
    createdBy: number,
    updatedBy: number,
    amount: number,
    emiID: number = null,
    transactionDate?: Date,
    remarks?: string,
    payment_transaction_status?: string,
    waiver?: number,
    discount_type?: string,
  ): Promise<number> {
    let insertId = await this.transactionModel.insertV2(
      customerID,
      leadID,
      loanNo,
      status,
      type,
      mode,
      referenceNo,
      orderId,
      deleted,
      gateway,
      createdBy,
      updatedBy,
      amount,
      emiID,
      transactionDate,
      remarks,
      payment_transaction_status,
      waiver,
      discount_type,
    )
    return insertId
  }

  public async updateOne(where: {}, update: {}): Promise<boolean | ICustomResponse> {
    try {
      await this.transactionModel.findOneAndUpdate(where, update)
      return true
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async updateMany(
    where: [{ key: string; valueArray: any[] }],
    update: ITransaction,
  ): Promise<boolean | ICustomResponse> {
    try {
      let result = await this.transactionModel.findAndUpdate(where, update)
      return result
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }
  public async findTransaction(
    where: { [key: string]: any },
    order: { orderKey: string; orderValue: string },
    select: string[],
    types: string[],
  ): Promise<any> {
    try {
      const whereClause: IWhereClause = {
        customerID: where.customerID,
        status: where.status,
        ...(types && types.length > 0 && { type: { $in: types } }),
      }
      let transactions = await this.transactionModel.getUserTransactions(whereClause, order, select)

      if (transactions == null || transactions.length == 0) {
        return null
      } else {
        return transactions // Return the transactions if found
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

  public async findTransection(
    where: { [key: string]: any },
    order: { orderKey: string; orderValue: string },
    select: string[],
    types: string[],
  ): Promise<any> {
    try {
      const whereClause: Omit<IWhereClause, 'status'> = {
        customerID: where.customerID,
        ...(types && types.length > 0 && { type: { $in: types } }),
      }

      let transactions = await this.transactionModel.getUserTransactions2(
        whereClause,
        order,
        select,
      )

      if (transactions == null || transactions.length == 0) {
        return null
      } else {
        return transactions // Return the transactions if found
      }
    } catch (error) {
      logger.error(error)
      return null
    }
  }
}

export default TransactionService
export const transactionService = new TransactionService()
