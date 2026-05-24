import {
  IRazorpayMandate,
  TSelectRazorPayMandate,
} from '@/interfaces/razorpay_mandate.interface'
import { InsertData, KnexFindParams, UpdateQuery, WhereQuery } from '@/types/model.types'
import { getTimeInIst } from '@/utils/dateTimeFunctions'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class RazorpayMandateModel {
  private table = 'razorpay_mandate'

  get RpayMandateKnex() {
    let db = getKnexInstance()

    return db(this.table)
  }

  async findOne(
    params: KnexFindParams<IRazorpayMandate, TSelectRazorPayMandate>,
  ): Promise<IRazorpayMandate> {
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

    return await query.first()
  }

  public async getRazorpayMandate(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayMandate[] | null> {
    try {
      let db = getKnexInstance()
      let razorpayMandate = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (razorpayMandate == null || razorpayMandate?.length == 0) {
        return null
      } else {
        return razorpayMandate // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_mandate.ts getRazorpayMandate function',
        error,
      )
    }
  }

  public async getRazorpayMandateForAsferaIVR(
    customerID: number,
    leadID: number,
  ): Promise<IRazorpayMandate[] | null> {
    try {
      let db = getKnexInstance()
      let razorpayMandate = await db(this.table)
        .where({ customerID: customerID, leadID: leadID })
        .andWhere('inv_id', '!=', '')
        .select([
          'accountNo',
          'ifsc',
          'accountType',
          'emMaxamount',
          'credated_date',
          'status',
        ])
      if (razorpayMandate == null || razorpayMandate?.length == 0) {
        return []
      } else {
        return razorpayMandate // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_mandate.ts getRazorpayMandate function',
        error,
      )
    }
  }

   async insert(data: InsertData<IRazorpayMandate>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert({
      ...data,
      credated_date: getTimeInIst(),
    })
  }

  async findOneAndUpdate(
    where: WhereQuery<IRazorpayMandate>,
    update: UpdateQuery<IRazorpayMandate>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async count(
    params: KnexFindParams<IRazorpayMandate, TSelectRazorPayMandate>,
  ): Promise<number> {
    const { where, whereNot } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }

}

export const razorpayMandateModel = new RazorpayMandateModel()
