import { IEmployer, TSelectEmployer } from '../../interfaces/employer.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class EmployerModel {
  private table = 'employer'

  public async getEmployer(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IEmployer[] | []> {
    try {
      let db = getKnexInstance()
      let employer = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (employer == null || employer.length == 0) {
        return []
      } else {
        return employer // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside employer.ts getEmployer function', error)
    }
  }

  public async countEmployer(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let employer = await db(this.table).where(where).count()
      let count = employer[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside employer.ts countEmployer function', error)
    }
  }
  async insert(data: InsertData<IEmployer>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  public async findOneAndUpdate(
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
      logger.error('Error Inside employer.ts findOneAndUpdate function', error)
      return 0
    }
  }

  async findOneEmployer(
    where: WhereQuery<IEmployer>,
    select: SelectFields<TSelectEmployer> = ['*'],
    order?: SortCriteria<TSelectEmployer>,
  ): Promise<IEmployer> {
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

  async find(params: KnexFindParams<IEmployer, TSelectEmployer>): Promise<IEmployer[]> {
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
          const { column, operator, value } = <any>element

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

  async count(params: KnexFindParams<IEmployer, TSelectEmployer>): Promise<number> {
    const { where, whereNot } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const employerModel = new EmployerModel()
