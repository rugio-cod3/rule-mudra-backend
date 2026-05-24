import OnlinePaymentModel from '@/database/mysql/onlinepayment'
import { IOnlinePayment } from '@/interfaces/onlinepayment.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class OnlinePaymentService {
  private onlinePaymentModel = new OnlinePaymentModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IOnlinePayment | ICustomResponse> {
    try {
      let razorpay_emOrder = await this.onlinePaymentModel.getOnlinePayment(
        where,
        order,
        select,
      )
      if (razorpay_emOrder.length == 0) {
        return null
      } else {
        return razorpay_emOrder[0] // Return the first lead if found
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
  ): Promise<IOnlinePayment[] | ICustomResponse> {
    try {
      let razorpay_emOrder = await this.onlinePaymentModel.getOnlinePayment(
        where,
        order,
        select,
      )
      if (razorpay_emOrder.length == 0) {
        return null
      } else {
        return razorpay_emOrder // Return the first lead if found
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
      let razorpay_emOrder_count =
        await this.onlinePaymentModel.countOnlinePayment(where)
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

  public async create(data: {
    name: string
    email: string
    phone: bigint
    service: string
    typeProduct: string
    toValue: number
    message: string
    razorpayOrderId: string
    razorpayPaymentId: string
    paymentStatus: string
    makerstamp: Date
    updatestamp: Date
    status: string
    paymentType: string
    method: string
    leadID: number
  }): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.onlinePaymentModel.insert(data)
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
      await this.onlinePaymentModel.findOneAndUpdate(where, update)
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

export default OnlinePaymentService
