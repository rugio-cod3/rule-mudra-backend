import { ICustomerDnd, TSelectCustomerDnd } from '../../interfaces/customerDnd.interface'
import {
  DeleteWhere,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class CustomerDndModel {
  private table = 'customer_dnd'

  async findOne(
    where: WhereQuery<ICustomerDnd>,
    select: SelectFields<TSelectCustomerDnd> = ['*'],
    order?: SortCriteria<TSelectCustomerDnd>,
  ) {
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

  async find(
    params: KnexFindParams<ICustomerDnd, TSelectCustomerDnd>,
    dateRange?: { start: Date; end: Date },
  ): Promise<ICustomerDnd[]> {
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

    if (dateRange && dateRange.start != null && dateRange.end != null) {
      query
        .andWhere('start_date', '>=', dateRange.start)
        .andWhere('expiry_date', '<=', dateRange.end)
    }

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
      logger.error('Error Inside customerDnd.ts insert function', error)
      return null
    }
  }

  public async findOneAndUpdate(where: {}, update: {}): Promise<number> {
    try {
      let db = getKnexInstance()
      let res = await db(this.table).where(where).update(update)
      return res
    } catch (error) {
      logger.error('Error Inside customerDnd.ts findOneAndUpdate function', error)
      return 0
    }
  }

  async delete(deleteWhere: DeleteWhere<TSelectCustomerDnd>) {
    const db = getKnexInstance()
    const query = db(this.table)

    deleteWhere.forEach(element => {
      const { column, operator, value } = element

      if (operator) query.where(column, operator, value)
      else query.where(column, value)
    })

    return await query.delete()
  }
}

export const customerDndModel = new CustomerDndModel()
