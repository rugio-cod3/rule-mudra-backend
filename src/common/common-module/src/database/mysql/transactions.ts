import {
  ITransaction,
  IWhereClause,
  TSelectTransaction,
} from '../../interfaces/transactions.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class TransactionModel {
  private table = 'transactions'

  async create(data: InsertData<ITransaction>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  public async getTransactions(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ITransaction[] | null> {
    try {
      let db = getKnexInstance()
      let transactions = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (transactions == null || transactions.length == 0) {
        return null
      } else {
        return transactions // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside transactions.ts getTransactions function', error)
    }
  }
  public async countTransactions(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let transactions = await db(this.table).where(where).count()
      let count = transactions[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside transactions.ts countTransactions function', error)
    }
  }
  public async insert(
    customerID: number,
    leadID: number,
    loanNo: string,
    status: number,
    type: string,
    mode: string,
    referenceNo: string,
    orderId: string,
    deleted: number,
    gateway: string,
    createdAt: Date,
    updatedAt: Date,
    createdBy: number,
    updatedBy: number,
    amount: number,
  ): Promise<number> {
    const db = getKnexInstance()
    let [insertedID] = await db
      .table(this.table)
      .insert({
        customerID,
        leadID,
        loanNo,
        status,
        type,
        mode,
        referenceNo,
        orderId,
        deleted,
        gateway,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
        amount,
      })
      .returning('id')

    return insertedID
  }

  public async insertV2(
    customerID: number,
    leadID: number,
    loanNo: string,
    status: number,
    type: string,
    mode: string,
    referenceNo: string,
    orderId: string,
    deleted: number,
    gateway: string,
    createdBy: number,
    updatedBy: number,
    amount: number,
    emiID: number,
    transactionDate: Date,
    remarks: string,
    payment_transaction_status: string,
    waiver: number,
    discount_type: string,
  ): Promise<number> {
    const db = getKnexInstance()
    let [insertedID] = await db
      .table(this.table)
      .insert({
        customerID,
        leadID,
        loanNo,
        status,
        type,
        mode,
        referenceNo,
        orderId,
        deleted,
        gateway,
        createdBy,
        updatedBy,
        amount,
        emiID,
        transactionDate,
        remarks,
        payment_transaction_status,
        waiver,
        discount_type,
      })
      .returning('id')

    return insertedID
  }

  async findOneAndUpdate(
    where: Partial<ITransaction>,
    update: Partial<ITransaction>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  public async findAndUpdate(
    where: { key: string; valueArray: any[] }[],
    update: {},
  ): Promise<boolean | null> {
    try {
      let db = getKnexInstance()
      let transectionIds = []
      for (let obj of where) {
        let transactions = await db(this.table).whereIn(obj.key, obj.valueArray).select('id')
        if (transactions) {
          for (let t of transactions) {
            transectionIds.push(t.id)
          }
        }
      }
      let transactionset = new Set(transectionIds)
      let transectionArray = Array.from(transactionset)
      let emi = await db(this.table).whereIn('id', transectionArray).update(update)
      return true
    } catch (error) {
      logger.error('Error Inside transection.ts findAndUpdate function', error)
      return false
    }
  }
  public async getUserTransactions(
    where: IWhereClause,
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ITransaction[] | null> {
    try {
      let db = getKnexInstance()
      let query = db(this.table)
        .where({
          customerID: where.customerID,
          status: where.status,
        })
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)

      if (where.type && where.type.$in) {
        query = query.whereIn('type', where.type.$in)
      }

      let transactions = await query

      if (transactions == null || transactions.length == 0) {
        return null
      } else {
        return transactions
      }
    } catch (error) {
      logger.error('Error Inside transactions.ts getUserTransactions function', error)
      return null
    }
  }

  public async getUserTransactions2(
    where: Omit<IWhereClause, 'status'>,
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ITransaction[] | null> {
    try {
      let db = getKnexInstance()
      let query = db(this.table)
        .where({
          customerID: where.customerID,
        })
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)

      if (where.type && where.type.$in) {
        query = query.whereIn('type', where.type.$in)
      }

      let transactions = await query

      if (transactions == null || transactions.length == 0) {
        return null
      } else {
        return transactions
      }
    } catch (error) {
      logger.error('Error Inside transactions.ts getUserTransactions function', error)
      return null
    }
  }
  async find(params: KnexFindParams<ITransaction, TSelectTransaction>): Promise<ITransaction[]> {
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

    // if (paginate) {
    //   const offset = (paginate.page - 1) * paginate.perPage
    //   query.limit(paginate.perPage).offset(offset)
    // }

    return await query
  }
  async count(
    where?: WhereQuery<ITransaction>,
    whereNot?: WhereQuery<ITransaction>,
    whereRaw?: Array<{ rawQuery: string; values: any[] }>,
  ): Promise<number> {
    const db = getKnexInstance()
    const query = db(this.table)

    if (where) query.where(where)
    if (whereNot) query.whereNot(whereNot)
    if (whereRaw) {
      whereRaw.forEach(condition => {
        query.whereRaw(condition.rawQuery, condition.values)
      })
    }

    const result = await query.count('* as count')
    return result[0].count as number
  }
  async findOneTransaction(
    where: WhereQuery<ITransaction>,
    select: SelectFields<TSelectTransaction> = ['*'],
    order?: SortCriteria<TSelectTransaction>,
  ): Promise<ITransaction> {
    const db = getKnexInstance()
    const query = db.table(this.table).where(where)

    if (order) query.orderBy(order)

    return await query.select(...select).first()
  }
}

export const transactionModel = new TransactionModel()
