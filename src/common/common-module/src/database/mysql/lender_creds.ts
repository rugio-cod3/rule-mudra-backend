import { ILenderCreds, TSelectLenderCreds } from '../../interfaces/lender_creds.interface'
import {
    InsertData,
  KnexFindParams,  
  WhereQuery,
  UpdateQuery
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export type responseType = {}
export default class LenderCredsModel {
  private table = 'lender_creds'

  get LenderKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }
  get Knex() {
    let db = getKnexInstance()
    return db
  }

  async find(params: KnexFindParams<ILenderCreds, TSelectLenderCreds>): Promise<ILenderCreds[]> {
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

  // Updated findOne
  async findOne(params: KnexFindParams<ILenderCreds, TSelectLenderCreds>): Promise<ILenderCreds> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
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

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }

    return await query.first()
  }

async insert(data: InsertData<ILenderCreds>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
}

public async findOneAndUpdate(where: {}, update: {}): Promise<number> {
  try {
    let db = getKnexInstance()
    let res = await db(this.table).where(where).update(update)
    return res
  } catch (error) {
    logger.error('Error Inside sddress.ts findOneAndUpdate function', error)
    throw error
  }
}
}

export const lenderCredsModel = new LenderCredsModel()