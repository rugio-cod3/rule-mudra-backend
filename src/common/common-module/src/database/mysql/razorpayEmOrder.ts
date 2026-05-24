import { IRazorpayEMOrder, TSelectRazorpayEMOrder } from '../../interfaces/razorpayEmOrder'
import { InsertData, KnexFindParams, UpdateQuery, WhereQuery } from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class RazorpayEMOrderModel {
  private table = 'razorpay_emOrder'

  get Knex() {
    let db = getKnexInstance()

    return db(this.table)
  }

  public async getRazorpayEMOrder(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayEMOrder[] | null> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (razorpayEMOrder.length == 0) {
        return null
      } else {
        return razorpayEMOrder // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside razorpay_emOrder.ts getRazorpayEMOrder function', error)
    }
  }
  public async countRazorpayEMOrder(where: {}): Promise<number | null> {
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
      logger.error('Error Inside razorpay_emOrder.ts getRazorpayEMOrder function', error)
    }
  }

  async insert(data: InsertData<IRazorpayEMOrder>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneAndUpdate(
    where: WhereQuery<IRazorpayEMOrder>,
    update: UpdateQuery<IRazorpayEMOrder>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  public async getRazorpayEMOrderAsferaIVR(
    customerID: number,
    leadID: number,
  ): Promise<IRazorpayEMOrder[] | []> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(`${this.table} as eord`)
        .join('razorpay_mandate as mss', 'eord.emID', 'mss.id')
        .join('onlinepayment as one', 'eord.orderID', 'one.razorpayOrderId')
        .where({ 'eord.customerID': customerID, 'eord.leadID': leadID })
        // .select('one.*', 'mss.*', 'eord.*')
        .select([
          'mss.inv_id',
          'one.razorpayOrderId',
          'one.razorpayPaymentId',
          'one.toValue',
          'eord.createdDate',
          'one.paymentStatus',
        ])
      if (razorpayEMOrder.length == 0) {
        return []
      } else {
        return razorpayEMOrder // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside razorpay_emOrder.ts getRazorpayEMOrderAsferaIVR function', error)
    }
  }

  async findOne(
    params: KnexFindParams<IRazorpayEMOrder, TSelectRazorpayEMOrder>,
  ): Promise<IRazorpayEMOrder> {
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
    params: KnexFindParams<IRazorpayEMOrder, TSelectRazorpayEMOrder>,
  ): Promise<IRazorpayEMOrder[]> {
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
}

export const razorpayEmOrderModel = new RazorpayEMOrderModel()
