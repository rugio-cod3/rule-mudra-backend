import RazorpaySubscriptionModel from '@/database/mysql/razorpay_subscription'
import {
  IRazorPayCreateSubscription,
  IRazorpaySubscription,
  TSelectRazorpaySubscription,
} from '@/interfaces/razorpay_subscription.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { SortCriteria } from '@/types/model.types'
import { logger } from '@/utils/logger'

class RazorpaySubscriptionService {
  private razorpaySubscriptionModel = new RazorpaySubscriptionModel()

  // ! Refactored
  async findOne(
    where: Partial<IRazorpaySubscription>,
    select: TSelectRazorpaySubscription[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectRazorpaySubscription>,
  ): Promise<IRazorpaySubscription> {
    return await this.razorpaySubscriptionModel.findOneRazorPaySubscription(
      where,
      select,
      order
    )
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpaySubscription[] | ICustomResponse> {
    try {
      let razorpay_subscription =
        await this.razorpaySubscriptionModel.getRazorpaySubscription(
          where,
          order,
          select,
        )
      if (razorpay_subscription.length == 0) {
        return null
      } else {
        return razorpay_subscription // Return the first lead if found
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
      let razorpay_subscription_count =
        await this.razorpaySubscriptionModel.countRazorpaySubscription(where)
      if (razorpay_subscription_count == null) {
        return 0
      } else {
        return razorpay_subscription_count // Return the first lead if found
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

  async create(payload: IRazorPayCreateSubscription): Promise<number> {
    return await this.razorpaySubscriptionModel.insert(payload)
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.razorpaySubscriptionModel.findOneAndUpdate(where, update)
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

  async findByFilter(
    where: Partial<IRazorpaySubscription>,
    order: { orderKey: TSelectRazorpaySubscription; orderValue: string },
    select: TSelectRazorpaySubscription[] | ['*'] = ['*'],
    page: number,
    perPage: number,
  ): Promise<IRazorpaySubscription[]> {
    let razorpay_subscription =
      await this.razorpaySubscriptionModel.getRazorpaySubscriptionByFilter(
        where,
        order,
        select,
        page,
        perPage,
      )
    return razorpay_subscription
  }
}

export default RazorpaySubscriptionService
