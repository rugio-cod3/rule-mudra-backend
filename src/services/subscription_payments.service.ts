import SubscriptionPaymentModel from '@/database/mysql/subscription_payments'
import { ICustomResponse } from '@/interfaces/response.interface'
import {
  ISubscriptionPayment,
  TSelectSubscriptionPayment,
} from '@/interfaces/subscription_payments.interface'
import { logger } from '@/utils/logger'

class SubscriptionPaymentService {
  private subscriptionPaymentModel = new SubscriptionPaymentModel()

  // ! Refactored
  async findOne(
    where: Partial<ISubscriptionPayment>,
    select: TSelectSubscriptionPayment[] | ['*'] = ['*'],
  ): Promise<ISubscriptionPayment> {
    return await this.subscriptionPaymentModel.findOneSubscriptionPayment(
      where,
      select,
    )
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ISubscriptionPayment[] | ICustomResponse> {
    try {
      let subscription_payments =
        await this.subscriptionPaymentModel.getSubscriptionPayments(
          where,
          order,
          select,
        )
      if (subscription_payments == null || subscription_payments.length == 0) {
        return null
      } else {
        return subscription_payments // Return the first lead if found
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
      let subscription_payments_count =
        await this.subscriptionPaymentModel.countSubscriptionPayments(where)
      if (subscription_payments_count == null) {
        return 0
      } else {
        return subscription_payments_count // Return the first lead if found
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
    subscriptionId: number,
    orderId: string,
    paymentId: string,
    amount: number,
    gst: number,
    totalAmount: number,
    status: string,
    response: string,
  ): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.subscriptionPaymentModel.insert(
        customerID,
        subscriptionId,
        orderId,
        paymentId,
        amount,
        gst,
        totalAmount,
        status,
        response,
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
      await this.subscriptionPaymentModel.findOneAndUpdate(where, update)
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

  public async findByFilter(
    where: Partial<ISubscriptionPayment>,
    order: { orderKey: TSelectSubscriptionPayment; orderValue: string },
    select: TSelectSubscriptionPayment[] | ['*'] = ['*'],
    page: number,
    perPage: number,
  ): Promise<ISubscriptionPayment[]> {
    let subscription_payments =
      await this.subscriptionPaymentModel.getSubscriptionPaymentsByFilter(
        where,
        order,
        select,
        page,
        perPage,
      )

    return subscription_payments
  }
}

export default SubscriptionPaymentService
