import {
  ISubscriptionPayment,
  TSelectSubscriptionPayment,
} from '@/interfaces/subscription_payments.interface'
import { SortCriteria } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class SubscriptionPaymentModel {
  private table = 'subscription_payments'

  async findOneSubscriptionPayment(
    where: Partial<ISubscriptionPayment>,
    select: TSelectSubscriptionPayment[] | ['*'] = ['*'],
  ): Promise<ISubscriptionPayment> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .first()
  }

  // ! Remove this
  public async getSubscriptionPayments(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ISubscriptionPayment[] | null> {
    try {
      let db = getKnexInstance()
      let subscription_payments = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (subscription_payments == null || subscription_payments.length == 0) {
        return null
      } else {
        return subscription_payments // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside subscription_payments.ts getSubscriptionPayments function',
        error,
      )
    }
  }
  public async getSubscriptionPaymentsByFilter(
    where: Partial<ISubscriptionPayment>,
    order: { orderKey: TSelectSubscriptionPayment; orderValue: string },
    select: TSelectSubscriptionPayment[] | ['*'] = ['*'],
    page: number,
    perPage: number,
  ): Promise<ISubscriptionPayment[] | null> {
    try {
      let db = getKnexInstance()

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
      let subscription_payments = await query

      if (subscription_payments == null || subscription_payments.length == 0) {
        return null
      } else {
        return subscription_payments // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside subscription_payments.ts getSubscriptionPaymentsByFilter function',
        error,
      )
    }
  }
  public async countSubscriptionPayments(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let subscription_payments = await db(this.table).where(where).count()
      let count = subscription_payments[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside subscription_payments.ts countSubscriptionPayments function',
        error,
      )
    }
  }
  public async insert(
    customerID: number,
    subscriptionId: number,
    orderId: string,
    paymentId: string,
    amount: number,
    gst: number,
    totalAmount: number,
    status: string,
    response: string,
  ): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table)
        .insert({
          customerID,
          subscriptionId,
          orderId,
          paymentId,
          amount,
          gst,
          totalAmount,
          status,
          response,
        })
        .returning('id')
      return insertedID
    } catch (error) {
      logger.error(
        'Error Inside subscription_payments.ts insert function',
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
        'Error Inside subscription_payments.ts findOneAndUpdate function',
        error,
      )
    }
  }

  async findPaymentsOfThisMonth(
    subscriptionId: string,
    currentMonth: number,
    select: TSelectSubscriptionPayment[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectSubscriptionPayment>,
  ): Promise<ISubscriptionPayment[]> {
    const db = getKnexInstance()
    let query = db.table(this.table)
      .where({ status: 'success', subscriptionId })
      .andWhere(function () {
        this.whereRaw('MONTH(createdAt) = ?', [currentMonth])
      })
      .select(...select)

    if (order) {
      query.orderBy(order)
    }

    return await query
  }
}
