import { ILoan, TSelectLoan } from '@/interfaces/loan.interface'
import { KnexFindParams, SortCriteria, WhereQuery } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class LoanModel {
  private table = 'loan'

  public async getLoanData(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ILoan[] | null> {
    try {
      let db = getKnexInstance()
      let loan = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (loan == null || loan?.length == 0) {
        return null
      } else {
        return loan // Return the first loan if found
      }
    } catch (error) {
      logger.error('Error Inside loan.ts getLoanData function', error)
    }
  }

  async findOneLoan(
    where: Partial<ILoan>,
    select: TSelectLoan[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectLoan>,
  ): Promise<ILoan> {
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

  async countLoan(where?: WhereQuery<ILoan>, whereNot?: WhereQuery<ILoan>) {
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }

  async find(params: KnexFindParams<ILoan, TSelectLoan>): Promise<ILoan[]> {
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

}

export const loanModel = new LoanModel();