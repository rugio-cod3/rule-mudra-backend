import { IOnlinePayment, TSelectOnlinePayment } from '../../interfaces/onlinepayment.interface'
import { InsertData, KnexFindParams, WhereQuery } from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class OnlinePaymentModel {
  private table = 'onlinepayment'

  get Knex() {
    let db = getKnexInstance()

    return db(this.table)
  }

  public async getOnlinePayment(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IOnlinePayment[] | null> {
    try {
      let db = getKnexInstance()
      let onlinePayment = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (onlinePayment == null || onlinePayment.length == 0) {
        return null
      } else {
        return onlinePayment // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside onlinepayment.ts getOnlinePayment function', error)
    }
  }
  public async countOnlinePayment(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(this.table).where(where).count()
      let count = razorpayEMOrder[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside onlinepayment.ts countOnlinePayment function', error)
    }
  }
  async insert(data: InsertData<IOnlinePayment>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneAndUpdate(
    where: Partial<IOnlinePayment>,
    update: Partial<IOnlinePayment>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async findOne(
    params: KnexFindParams<IOnlinePayment, TSelectOnlinePayment>,
  ): Promise<IOnlinePayment> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull, whereRaw } = params
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

    if (whereRaw) {
      whereRaw.forEach(condition => {
        const { rawQuery, values } = condition
        query.whereRaw(rawQuery, values)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach(column => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query.first()
  }

  async find(
    params: KnexFindParams<IOnlinePayment, TSelectOnlinePayment>,
  ): Promise<IOnlinePayment[]> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      whereRaw,
      paginate,
    } = params
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

    if (whereRaw) {
      whereRaw.forEach(condition => {
        const { rawQuery, values } = condition
        query.whereRaw(rawQuery, values)
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

    return await query
  }
  async count(
    where?: WhereQuery<IOnlinePayment>,
    whereNot?: WhereQuery<IOnlinePayment>,
  ): Promise<number> {
    const db = getKnexInstance()
    const query = db(this.table)

    if (where) query.where(where)
    if (whereNot) query.whereNot(whereNot)

    const result = await query.count('* as count')
    return result[0].count as number
  }
}

export const onlinePaymentModel = new OnlinePaymentModel()
