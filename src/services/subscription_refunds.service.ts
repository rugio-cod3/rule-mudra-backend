import SubscriptionRefundsModel from '@/database/mysql/subscription_refund'
import { ICustomResponse } from '@/interfaces/response.interface'
import { ISubscriptionRefund } from '@/interfaces/subscription_refunds.interface'
import { logger } from '@/utils/logger'

class SubscriptionRefundsService {
  private subscriptionRefundsModel = new SubscriptionRefundsModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ISubscriptionRefund | ICustomResponse> {
    try {
      let subscription_refunds =
        await this.subscriptionRefundsModel.getSubscriptionRefunds(
          where,
          order,
          select,
        )
      if (subscription_refunds == null || subscription_refunds.length == 0) {
        return null
      } else {
        return subscription_refunds[0] // Return the first lead if found
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
  ): Promise<ISubscriptionRefund[] | ICustomResponse> {
    try {
      let subscription_refunds =
        await this.subscriptionRefundsModel.getSubscriptionRefunds(
          where,
          order,
          select,
        )
      if (subscription_refunds == null || subscription_refunds.length == 0) {
        return []
      } else {
        return subscription_refunds // Return the first lead if found
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

  public async create(data: {}): Promise<boolean> {
    try {
      await this.subscriptionRefundsModel.insert(data)
      return true
    } catch (error) {
      logger.error(error)
      return false
    }
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.subscriptionRefundsModel.findOneAndUpdate(where, update)
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

export default SubscriptionRefundsService
