import {
  IRazorPayMandateStatusModel,
  TRazorPayMandateStatus,
} from '@/interfaces/razorpay_mandate_status.interface'
import {
  InsertData,
  KnexFindParams,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getTimeInIst } from '@/utils/dateTimeFunctions'
import { getKnexInstance } from '@/utils/mysql'

export default class RazorpayMandateStatusModel {
  private table = 'razorpay_mandate_status'

  get RpayMandateStatusKnex() {
    let db = getKnexInstance()

    return db(this.table)
  }

  async findOne(
    params: KnexFindParams<IRazorPayMandateStatusModel, TRazorPayMandateStatus>,
  ): Promise<IRazorPayMandateStatusModel> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
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

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query.first()
  }

  async insert(
    data: InsertData<IRazorPayMandateStatusModel>,
  ): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneAndUpdate(
    where: WhereQuery<IRazorPayMandateStatusModel>,
    update: UpdateQuery<IRazorPayMandateStatusModel>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }
}

export const razorpayMandateStatusModel = new RazorpayMandateStatusModel()
