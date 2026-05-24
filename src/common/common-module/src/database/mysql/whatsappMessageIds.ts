import {
  IWhatsappMessageIds,
  TSelectWhatsappMessageIds,
} from '../../interfaces/whatsappMessageIds.interface'
import { KnexFindParams, UpdateQuery, WhereQuery } from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class WhatsappMessageIdsModel {
  private table = 'whatsapp_message_ids'

  async findOneMessage(
    where: Partial<IWhatsappMessageIds>,
    select: TSelectWhatsappMessageIds[] | ['*'] = ['*'],
    order?: TSelectWhatsappMessageIds[] | ['*'],
  ): Promise<IWhatsappMessageIds> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)
    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }

  async findOneAndUpdate(
    where: WhereQuery<IWhatsappMessageIds>,
    update: UpdateQuery<IWhatsappMessageIds>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async insert(data: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let result = await db(this.table).insert(data)
      let insertedID = result[0]
      return insertedID
    } catch (error) {
      logger.error('Error Inside leads.ts insert function', error)
      return null
    }
  }

  async find(
    params: KnexFindParams<IWhatsappMessageIds, TSelectWhatsappMessageIds>,
  ): Promise<IWhatsappMessageIds[]> {
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

  async findOne(
    params: KnexFindParams<IWhatsappMessageIds, TSelectWhatsappMessageIds>,
  ): Promise<IWhatsappMessageIds> {
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
    params: KnexFindParams<IWhatsappMessageIds, TSelectWhatsappMessageIds>,
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

export const whatsappMessageIdsModel = new WhatsappMessageIdsModel()
