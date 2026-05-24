import { InsertData, KnexFindParams, UpdateQuery, WhereQuery } from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'
import {
  IRewardTransaction,
  TSelectRewardTransaction,
} from '../../interfaces/rewardTransaction.interface'

export class RewardTransactionModel {
  private table = 'reward_transactions'
  private static instance: RewardTransactionModel

  static getInstance(): RewardTransactionModel {
    if (!this.instance) {
      this.instance = new RewardTransactionModel()
    }

    return this.instance
  }

  get RewardTransactionKnex() {
    let db = getKnexInstance()
    return db(`${this.table} as rtr`)
  }

  get Knex() {
    let db = getKnexInstance()
    return db
  }

  async findOne(
    params: KnexFindParams<IRewardTransaction, TSelectRewardTransaction>,
  ): Promise<IRewardTransaction> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull, whereRaw } = params
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

    return await query.first()
  }

  async find(
    params: KnexFindParams<IRewardTransaction, TSelectRewardTransaction>,
  ): Promise<IRewardTransaction[]> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull, whereRaw } = params
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

    return await query
  }

  async findOneAndUpdate(
    where: WhereQuery<IRewardTransaction>,
    update: UpdateQuery<IRewardTransaction>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async create(data: InsertData<IRewardTransaction>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async count(
    params: KnexFindParams<IRewardTransaction, TSelectRewardTransaction>,
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

export const rewardTransactionModel = new RewardTransactionModel()
