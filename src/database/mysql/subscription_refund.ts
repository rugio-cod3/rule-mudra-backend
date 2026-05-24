import { ISubscriptionRefund } from '@/interfaces/subscription_refunds.interface'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class SubscriptionRefundsModel {
  private table = 'subscription_refunds'

  public async getSubscriptionRefunds(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ISubscriptionRefund[] | null> {
    try {
      let db = getKnexInstance()
      let subscription_refunds = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (subscription_refunds == null || subscription_refunds.length == 0) {
        return []
      } else {
        return subscription_refunds // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside subscription_refunds.ts getSubscriptionRefunds function',
        error,
      )
    }
  }

  public async insert(data: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table).insert(data).returning('id')
      return insertedID
    } catch (error) {
      logger.error(
        'Error Inside subscription_refunds.ts insert function',
        error,
      )
    }
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside subscription_refunds.ts findOneAndUpdate function',
        error,
      )
    }
  }
}
