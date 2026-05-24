import {
  ICallHistoryModel,
  TSelectCallHistory,
} from '../../interfaces/callHistory.interface'
import { ICallHistoryLog } from '../../interfaces/callHistoryLogs.interface'
import { ILeadsApiLog } from '../../interfaces/leadApiLogs.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

class CallHistoryModel {
  private readonly table = 'callhistory'

  async findOneCallHistory(
    where: WhereQuery<ICallHistoryModel>,
    select: SelectFields<TSelectCallHistory> = ['*'],
    order?: SortCriteria<TSelectCallHistory>,
  ): Promise<ICallHistoryModel> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }

  async create(data: InsertData<ICallHistoryLog>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async insert(data: InsertData<ICallHistoryModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneAndUpdate(
    where: WhereQuery<ILeadsApiLog>,
    update: UpdateQuery<ILeadsApiLog>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }
  async findOne(
    params: KnexFindParams<ICallHistoryModel, TSelectCallHistory>,
  ): Promise<ICallHistoryLog> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
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

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query.first()
  }
}

export const callHistorymodel = new CallHistoryModel()
