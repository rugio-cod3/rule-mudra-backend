import {
  ICustomerAccount,
  TSelectCustomerAccount,
} from '../../interfaces/customerAccount.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class CustomerAccountModel {
  private table = 'customerAccount'

  get CustomerAccountKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async insert(data: InsertData<ICustomerAccount>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error('Error Inside customerAccount.ts findOneAndUpdate function', error)
    }
  }

  public async findAndUpdate(
    where: WhereQuery<ICustomerAccount>,
    update: UpdateQuery<ICustomerAccount>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async findOneCustomerAccount(
    where: WhereQuery<ICustomerAccount>,
    order: { orderKey: TSelectCustomerAccount; orderValue: string },
    select: SelectFields<TSelectCustomerAccount> = ['*'],
  ): Promise<ICustomerAccount> {
    let db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .orderBy(order.orderKey, order.orderValue)
      .select(...select)
      .first()
  }

  async findOne(
    params: KnexFindParams<ICustomerAccount, TSelectCustomerAccount>,
  ): Promise<ICustomerAccount> {
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
    params: KnexFindParams<ICustomerAccount, TSelectCustomerAccount>,
  ): Promise<ICustomerAccount[]> {
    const { order, select = ['*'], where, whereIn, whereNot, paginate } = params
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
    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }
    if (order) query.orderBy(order)

    return await query
  }
  async count(
    where?: WhereQuery<ICustomerAccount>,
    whereNot?: WhereQuery<ICustomerAccount>,
  ): Promise<number> {
    const db = getKnexInstance()
    const query = db(this.table)

    if (where) query.where(where)
    if (whereNot) query.whereNot(whereNot)

    const result = await query.count('* as count')
    return result[0].count as number
  }
}

export const customerAccountModel = new CustomerAccountModel()
