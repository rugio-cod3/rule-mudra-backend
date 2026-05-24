import { IRazorpayPayoutDisbursedAmount } from '@/interfaces/razorpay_payout_disbured_amount.interface'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export type responseType = {}
export default class RazorpayPayoutDisbursedAmountModel {
  private table = 'razorpay_payout_disbured_amount'

  public async getDisbursalDatas(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayPayoutDisbursedAmount[] | null> {
    try {
      let db = getKnexInstance()
      let disbursal = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (disbursal == null || disbursal?.length == 0) {
        return null
      } else {
        return disbursal // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_payout_disbured_amount.ts getDisbursalDatas function',
        error,
      )
    }
  }

  public async getSingleDisbursalData(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayPayoutDisbursedAmount | null> {
    try {
      let db = getKnexInstance()
      let disbursal = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
        .first()
      if (disbursal == null) {
        return null
      } else {
        return disbursal // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_payout_disbured_amount.ts getSingleDisbursalData function',
        error,
      )
    }
  }

  public async findOneAndUpdate(where: {}, update: {}): Promise<{} | false> {
    try {
      let db = getKnexInstance()
      let res = await db(this.table).where(where).update(update)
      return res
    } catch (error) {
      logger.error('Error Inside lead.ts findOneAndUpdate function', error)
      return false
    }
  }
}
