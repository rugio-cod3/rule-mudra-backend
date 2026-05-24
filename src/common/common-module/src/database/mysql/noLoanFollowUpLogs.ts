import { INoLoanFollowUpLogs, TSelectNoLoanFollowUpLogs } from '../../interfaces/lead.interface'
import { KnexFindParams } from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export type responseType = {}
export default class NoLoanFollowUpLogModel {
  private table = 'no_loan_follow_up_logs'

  get NoLoanFollowUpLogsKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async find(
    params: KnexFindParams<INoLoanFollowUpLogs, TSelectNoLoanFollowUpLogs>,
  ): Promise<INoLoanFollowUpLogs[]> {
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

  public async insert(data: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let result = await db(this.table).insert(data)
      let insertedID = result[0]
      return insertedID
    } catch (error) {
      logger.error('Error Inside no_loan_follow_up_logs.ts insert function', error)
      return null
    }
  }

  async findOne(
    params: KnexFindParams<INoLoanFollowUpLogs, TSelectNoLoanFollowUpLogs>,
  ): Promise<INoLoanFollowUpLogs> {
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

  async count(
    params: KnexFindParams<INoLoanFollowUpLogs, TSelectNoLoanFollowUpLogs>,
  ): Promise<number> {
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
}

export const noLoanFollowUpLogModel = new NoLoanFollowUpLogModel()
