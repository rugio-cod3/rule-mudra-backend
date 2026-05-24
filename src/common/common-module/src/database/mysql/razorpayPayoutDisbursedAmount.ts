import {
  IRazorpayPayoutDisbursedAmount,
  TSelectRazorpayPayoutDisbursedAmount,
} from '../../interfaces/razorpayPayoutDisbursedAmount.interface'
import { KnexFindParams } from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

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

  async findOne(
    params: KnexFindParams<IRazorpayPayoutDisbursedAmount, TSelectRazorpayPayoutDisbursedAmount>,
  ): Promise<IRazorpayPayoutDisbursedAmount> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull, paginate } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach(element => {
          const { column, operator, value } = element

          if (operator) query.where(column, operator, value)
          else query.where(column, value)
        })
      } else {
        query.where(where)
      }
    }

    query.select(...select)

    if (whereIn) {
      whereIn.forEach(condition => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach(column => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }

    return await query.first()
  }
}

export const razorpayPayoutDisbursedAmountModel = new RazorpayPayoutDisbursedAmountModel()
