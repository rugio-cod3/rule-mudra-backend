import { IApproval, TSelectApproval } from '../../interfaces/approval.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class ApprovalModel {
  private table = 'approval'

  get ApprovalKnex() {
    const db = getKnexInstance()
    return db(this.table)
  }

  async findOne(params: KnexFindParams<IApproval, TSelectApproval>): Promise<IApproval> {
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

  async findOneApproval(
    where: WhereQuery<IApproval>,
    select: SelectFields<TSelectApproval> = ['*'],
    order?: SortCriteria<TSelectApproval>,
  ): Promise<IApproval> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }

  // ! Remove this
  public async getApprovals(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IApproval[] | null> {
    try {
      let db = getKnexInstance()
      let approvals = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (approvals == null || approvals.length == 0) {
        return null
      } else {
        return approvals // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside approval.ts getApprovals function', error)
    }
  }
  public async getApprovalsByFilter(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
    page: number,
    perPage: number,
  ): Promise<IApproval[] | null> {
    try {
      let db = getKnexInstance()
      let query = db(this.table)
      for (let key in where) {
        if (where[key]) {
          query.where(key, where[key])
        }
      }
      query.select(...select)
      query.orderBy(order.orderKey, order.orderValue)
      const offset = (page - 1) * perPage

      // Apply limit and offset for pagination
      query.limit(perPage).offset(offset)
      let approvals = await query

      if (approvals == null || approvals.length == 0) {
        return null
      } else {
        return approvals // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside approvals.ts getApprovalsByFilter function', error)
    }
  }
  public async countApprovals(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let approvals = await db(this.table).where(where).count()
      let count = approvals[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside approval.ts countApprovals function', error)
    }
  }

  async insert(data: InsertData<IApproval>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  public async findOneAndUpdateApproval(
    where: WhereQuery<IApproval>,
    update: UpdateQuery<IApproval>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db(this.table).where(where).update(update)
  }

  async count(where?: WhereQuery<IApproval>, whereNot?: WhereQuery<IApproval>) {
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const approvalModel = new ApprovalModel()
