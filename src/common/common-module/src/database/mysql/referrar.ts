import { getKnexInstance } from '@/utils/mysql'
import {
  IReferrarModel,
  TSelectReferrar,
} from '../../interfaces/referrar.interface'
import {
  InsertData,
  KnexFindParams,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'

export class ReferrarModel {
  private table = 'referrar'
  private static instance: ReferrarModel

  static getInstance(): ReferrarModel {
    if (!this.instance) {
      this.instance = new ReferrarModel()
    }

    return this.instance
  }

  get ReferrerKnex() {
    let db = getKnexInstance()
    return db(`${this.table} as rfr`)
  }

  get Knex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async findOne(
    params: KnexFindParams<IReferrarModel, TSelectReferrar>,
  ): Promise<IReferrarModel> {
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
    params: KnexFindParams<IReferrarModel, TSelectReferrar>,
  ): Promise<IReferrarModel[]> {
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

  async findOneAndUpdate(
    where: WhereQuery<IReferrarModel>,
    update: UpdateQuery<IReferrarModel>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async create(data: InsertData<IReferrarModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async count(
    params: KnexFindParams<IReferrarModel, TSelectReferrar>,
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
