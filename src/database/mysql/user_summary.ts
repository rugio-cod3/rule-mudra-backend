import {
  IUserSummary,
  TSelectUserSummary,
} from '@/interfaces/user_summary.interface'
import { InsertData, SortCriteria } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class UserSummaryModel {
  private table = 'user_summary'

  // New Code
  async findOneSummary(
    where: Partial<IUserSummary>,
    select: TSelectUserSummary[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectUserSummary>,
    dateRange?: { start: Date; end: Date },
  ): Promise<IUserSummary> {

    const db = getKnexInstance()
    const query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (dateRange) {
      query
        .andWhere('created_at', '>=', dateRange.start)
        .andWhere('created_at', '<=', dateRange.end)
    }

    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }
  // ! Remove this
  public async getUserSummaries(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IUserSummary[] | []> {
    try {
      let db = getKnexInstance()
      let user_summary = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (user_summary == null || user_summary.length == 0) {
        return []
      } else {
        return user_summary // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside user_summary.ts getUserSummaries function',
        error,
      )
    }
  }

  insert = async (data: InsertData<IUserSummary>): Promise<number[]> => {
    let db = getKnexInstance()
    return await db(this.table).insert({
      ...data,
    })
  }
}
