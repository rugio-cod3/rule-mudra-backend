import {
  ICallHistoryModel,
  TSelectCallHistory,
} from '@/interfaces/callHistory.interace'
import { ILeadsApiLog } from '@/interfaces/lead_api_log.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

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
}

export const callHistorymodel = new CallHistoryModel()
