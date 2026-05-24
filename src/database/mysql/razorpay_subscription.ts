import {
  IRazorPayCreateSubscription,
  IRazorpaySubscription,
  TSelectRazorpaySubscription,
} from '@/interfaces/razorpay_subscription.interface'
import { KnexFindParams, SortCriteria } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class RazorpaySubscriptionModel {
  private table = 'razorpay_subscription'

  // New Code
  async findOneRazorPaySubscription(
    where: Partial<IRazorpaySubscription>,
    select: TSelectRazorpaySubscription[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectRazorpaySubscription>,
  ): Promise<IRazorpaySubscription> {
    const db = getKnexInstance()
    let query = db.table(this.table).where(where).select(...select);
    if (order) {
      query.orderBy(order);
    }
    return await query.first();
  }

  // ! TO BE REMOVED
  public async getRazorpaySubscription(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpaySubscription[] | null> {
    try {
      let db = getKnexInstance()
      let razorpay_subscription = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (razorpay_subscription == null || razorpay_subscription.length == 0) {
        return null
      } else {
        return razorpay_subscription // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_subscription.ts getRazorpaySubscription function',
        error,
      )
    }
  }
  // ! Refactored
  // TODO : Test
  async getRazorpaySubscriptionByFilter(
    where: Partial<IRazorpaySubscription>,
    order: { orderKey: string; orderValue: string },
    select: TSelectRazorpaySubscription[] | ['*'] = ['*'],
    page: number,
    perPage: number,
  ): Promise<IRazorpaySubscription[]> {
    const db = getKnexInstance()

    let query = db.table(this.table)
    for (let key in where) {
      if (where[key]) {
        query.where(key, where[key])
      }
    }
    query.select(...select)
    query.orderBy(order.orderKey, order.orderValue)

    // Apply limit and offset for pagination
    query.limit(perPage).offset(page)
    let razorpay_subscription = await query

    return razorpay_subscription
  }

  public async countRazorpaySubscription(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let razorpay_subscription = await db(this.table).where(where).count()
      let count = razorpay_subscription[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_subscription.ts countRazorpaySubscription function',
        error,
      )
    }
  }

  async insert(payload: IRazorPayCreateSubscription): Promise<number> {
    const db = getKnexInstance()
    let [insertedID] = await db
      .table(this.table)
      .insert({
        ...payload,
        updatedAt: new Date(Date.now()),
      })
      .returning('id')

    return insertedID
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside razorpay_emOrder.ts findOneAndUpdate function',
        error,
      )
    }
  }
  async find(params: KnexFindParams<IRazorpaySubscription, TSelectRazorpaySubscription>): Promise<IRazorpaySubscription[]> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      whereRaw,
    } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach((element) => {
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
      whereIn.forEach((condition) => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereRaw) {
      whereRaw.forEach((condition) => {
        const { rawQuery, values } = condition
        query.whereRaw(rawQuery, values)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query
  }
}
