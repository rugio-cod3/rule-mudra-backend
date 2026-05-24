import { IRazorpayLog, TSelectRazorPayApiLog } from '../../interfaces/razorpayLogs.interface'
import { InsertData, KnexFindParams } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class RazorpayLogModel {
  private table = 'razorpay_logs'

  async insert(data: InsertData<IRazorpayLog>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async find(params: KnexFindParams<IRazorpayLog, TSelectRazorPayApiLog>): Promise<IRazorpayLog[]> {
    const { select, paginate, where } = params
    let db = getKnexInstance()

    let query = db(this.table)
    if (where) {
      query.where(where)
    }
    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }

    query.select(...select)
    return await query
  }
  async count(params: KnexFindParams<IRazorpayLog, TSelectRazorPayApiLog>): Promise<number> {
    const { where, whereNot, whereIn } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)
    if (whereIn) {
      whereIn.forEach(condition => {
        const { column, value } = condition
        count.whereIn(column, value)
      })
    }

    const data = await count.count()

    return data[0]['count(*)'] as number
  }

  async findOne(
    params: KnexFindParams<IRazorpayLog, TSelectRazorPayApiLog>,
  ): Promise<IRazorpayLog[]> {
    const { select = ['*'], where } = params
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

    return await query.first()
  }
}

export const razorPayLogsModel = new RazorpayLogModel()
