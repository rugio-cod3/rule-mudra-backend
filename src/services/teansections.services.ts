import TransectionModel from '@/database/mysql/transections'
import { ICustomResponse } from '@/interfaces/response.interface'
import { ITransection, IWhereClause } from '@/interfaces/transections.interface'
import { logger } from '@/utils/logger'

class TransectionService {
  private transectionModle = new TransectionModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ITransection | ICustomResponse> {
    try {
      let transections = await this.transectionModle.getTransections(
        where,
        order,
        select,
      )
      if (transections == null || transections.length == 0) {
        return null
      } else {
        return transections[0] // Return the first lead if found
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
  ): Promise<ITransection[] | ICustomResponse> {
    try {
      let transections = await this.transectionModle.getTransections(
        where,
        order,
        select,
      )
      if (transections == null || transections.length == 0) {
        return null
      } else {
        return transections // Return the first lead if found
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
      let transections = await this.transectionModle.countTransections(where)
      if (transections == null) {
        return 0
      } else {
        return transections // Return the first lead if found
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
    createdBy: number,
    updatedBy: number,
    amount: number,
    emiID: number = null,
    transactionDate?: Date,
    remarks?: string,
    payment_transaction_status?: string,
    waiver?: number,
    discount_type?: string,
    lenderID?: number,
  ): Promise<number> {
    let insertId = await this.transectionModle.insert(
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
      lenderID
    )
    return insertId
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.transectionModle.findOneAndUpdate(where, update)
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
    update: ITransection,
  ): Promise<boolean | ICustomResponse> {
    try {
      let result = await this.transectionModle.findAndUpdate(where, update)
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

  public async sumOfTransaction(emiId:number){
    let totalValue = await this.transectionModle.getSumOfTransections(emiId);
    return totalValue;
  }
 /* public async findTransaction(params: KnexFindParams<ILoan, TSelectLoan>) {
    return this.transectionModle.find(params)
  }*/
 public async findTransaction(
    where: { [key: string]: any },
    order: { orderKey: string; orderValue: string },
    select: string[],
    types: string[],
  ): Promise<any> {
    try {
      console.log("sdfsdf----------------------------");
      const whereClause: IWhereClause = {
        customerID: where.customerID, 
        ...(types && types.length > 0 && { type: { $in: types } }),
      }
      let transections = await this.transectionModle.getUserTransections(
        whereClause,
        order,
        select,
      )

      if (transections == null || transections.length == 0) {
        return null
      } else {
        return transections // Return the transactions if found
      }
    } catch (error) {
      logger.error(error)
      return null
    }
  }
}

export default TransectionService
