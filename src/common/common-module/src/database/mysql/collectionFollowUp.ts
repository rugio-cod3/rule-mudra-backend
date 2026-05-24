import {
  ICollectionFollowUp,
  TSelectCollectionFollowUp,
} from '../../interfaces/collectionFollowUp.interface'
import { InsertData, KnexFindParams, WhereQuery } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class CollectionFollowUpModel {
  private table = 'collectionFollowup'

  async find(
    params: KnexFindParams<ICollectionFollowUp, TSelectCollectionFollowUp>,
  ): Promise<ICollectionFollowUp[]> {
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

  async count(
    where?: WhereQuery<ICollectionFollowUp>,
    whereNot?: WhereQuery<ICollectionFollowUp>,
  ): Promise<number> {
    const db = getKnexInstance()
    const query = db(this.table)

    if (where) query.where(where)
    if (whereNot) query.whereNot(whereNot)

    const result = await query.count('* as count')
    return result[0].count as number
  }
  async insert(data: InsertData<ICollectionFollowUp>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}

export const collectionFollowUpModel = new CollectionFollowUpModel()
