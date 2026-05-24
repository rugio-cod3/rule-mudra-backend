import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'
import { ILender, TSelectLender } from '../../interfaces/lender.interface'

export default class LenderModel {
  private table = 'lender'

  async insert(data: InsertData<ILender>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneAndUpdate(
    where: {},
    update: {},
    order?: { orderKey: string; orderValue: string },
  ): Promise<number> {
    try {
      let db = getKnexInstance()
      // let response = await db(this.table).where(where).update(update)
      // return response

      let query = db(this.table).where(where)
      if (order) {
        query.orderBy(order.orderKey, order.orderValue)
      }
      let response = await query.update(update)
      return response
    } catch (error) {
      logger.error('Error Inside lender.ts findOneAndUpdate function', error)
      return 0
    }
  }

  async findOne(
    where: WhereQuery<ILender>,
    select: SelectFields<TSelectLender> = ['*'],
    order?: SortCriteria<TSelectLender>,
  ): Promise<ILender> {
    const db = getKnexInstance()

    let query = db
      .table(this.table)
      .where(where)
      .select(...select)
    if (order) {
      query.orderBy(order)
    }
    return await query.first()
  }

  async find(params: KnexFindParams<ILender, TSelectLender>): Promise<ILender[]> {
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
      whereNotNull.forEach(column => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }

    return await query
  }

  async count(params: KnexFindParams<ILender, TSelectLender>): Promise<number> {
    const { where, whereNot } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const lenderModel = new LenderModel()