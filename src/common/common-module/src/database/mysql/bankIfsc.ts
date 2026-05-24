import { IBankIfscModel, TSelectBankIfscModel } from '../../interfaces/bankIfsc.interface'
import { InsertData, KnexFindParams, UpdateQuery, WhereQuery } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class BankIfscModel {
  private table = 'bank_ifsc'

  async insert(data: InsertData<IBankIfscModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneAndUpdate(
    where: WhereQuery<IBankIfscModel>,
    update: UpdateQuery<IBankIfscModel>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async findOne(
    params: KnexFindParams<IBankIfscModel, TSelectBankIfscModel>,
  ): Promise<IBankIfscModel> {
    const { order, select = ['*'], where, whereIn, whereNot } = params
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

    if (order) query.orderBy(order)

    return await query.first()
  }

  async find(
    params: KnexFindParams<IBankIfscModel, TSelectBankIfscModel>,
  ): Promise<IBankIfscModel[]> {
    const { order, select = ['*'], where, whereIn, whereNot, distinct, paginate } = params
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
    if (distinct) {
      query.distinct(...select)
    } else {
      query.select(...select)
    }

    if (whereIn) {
      whereIn.forEach(condition => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }
    if (paginate) {
      if (paginate) {
        query.limit(paginate.perPage).offset(paginate.page)
      }
    }
    if (order) query.orderBy(order)

    return await query
  }
}

export const bankIfscModel = new BankIfscModel()
