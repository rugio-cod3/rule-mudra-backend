import {
  IApiBypassModel,
  TSelectApiByPassModel,
} from '@/interfaces/apiBypass.interface'
import {
  IRazorpayMandate,
  TSelectRazorPayMandate,
} from '@/interfaces/razorpay_mandate.interface'
import { InsertData, KnexFindParams } from '@/types/model.types'
import { getTimeInIst } from '@/utils/dateTimeFunctions'
import { getKnexInstance } from '@/utils/mysql'

export default class ApiByPassModel {
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

  async find(
    params: KnexFindParams<IApiBypassModel, TSelectApiByPassModel>,
  ): Promise<IApiBypassModel[]> {
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

  async insert(data: InsertData<IRazorpayMandate>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert({
      ...data,
      credated_date: getTimeInIst(),
    })
  }
}

export const apiByPassModel = new ApiByPassModel()
