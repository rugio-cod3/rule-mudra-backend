import OnlinePaymentLogModel from '@/database/mysql/onlinepaymentlog'
import { IOnlinePaymentLog } from '@/interfaces/onlinepaymentlog.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class OnlinePaymentLogService {
  private onlinePaymentLogModel = new OnlinePaymentLogModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IOnlinePaymentLog | ICustomResponse> {
    try {
      let onlinePaymentLog =
        await this.onlinePaymentLogModel.getOnlinePaymentLog(
          where,
          order,
          select,
        )
      if (onlinePaymentLog == null || onlinePaymentLog.length == 0) {
        return null
      } else {
        return onlinePaymentLog[0] // Return the first lead if found
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
  ): Promise<IOnlinePaymentLog[] | ICustomResponse> {
    try {
      let onlinePaymentLog =
        await this.onlinePaymentLogModel.getOnlinePaymentLog(
          where,
          order,
          select,
        )
      if (onlinePaymentLog == null || onlinePaymentLog.length == 0) {
        return null
      } else {
        return onlinePaymentLog // Return the first lead if found
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
      let onlinePaymentLog_count =
        await this.onlinePaymentLogModel.countOnlinePaymentLog(where)
      if (onlinePaymentLog_count == null) {
        return 0
      } else {
        return onlinePaymentLog_count // Return the first lead if found
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
    pID: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    paymentStatus: string,
    payload:string
  ): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.onlinePaymentLogModel.insert(
        pID,
        razorpayOrderId,
        razorpayPaymentId,
        paymentStatus,
        payload
      )
      return insertId
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.onlinePaymentLogModel.findOneAndUpdate(where, update)
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
}

export default OnlinePaymentLogService
