import {
  ICustomerAccount,
  TSelectCustomerAccount,
} from '@/interfaces/customerAccount.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class CustomerAccountModel {
  private table = 'customerAccount'

  async insert(data: InsertData<ICustomerAccount>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside customerAccount.ts findOneAndUpdate function',
        error,
      )
    }
  }

  public async findAndUpdate(
    where: WhereQuery<ICustomerAccount>,
    update: UpdateQuery<ICustomerAccount>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }
  // public async getCustomerAccount(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ICustomerAccount[] | null> {
  //   try {
  //     let db = getKnexInstance()
  //     let customerAccount = await db(this.table)
  //       .where(where)
  //       .select(...select)
  //       .orderBy(order.orderKey, order.orderValue)
  //     if (customerAccount == null || customerAccount?.length == 0) {
  //       return null
  //     } else {
  //       return customerAccount
  //     }
  //   } catch (error) {
  //     logger.error('Error Inside customerAccount.ts getCustomerAccount function', error)
  //     return null
  //   }
  // }
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

    if (order) query.orderBy(order)

    return await query.first()
  }

  async find(
    params: KnexFindParams<ICustomerAccount, TSelectCustomerAccount>,
  ): Promise<ICustomerAccount[]> {
    const { order, select = ['*'], where, whereIn, whereNot } = params
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

    if (order) query.orderBy(order)

    return await query
  }

  async count(
    where?: WhereQuery<ICustomerAccount>,
    whereNot?: WhereQuery<ICustomerAccount>,
  ) {
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const customerAccountModel = new CustomerAccountModel()
