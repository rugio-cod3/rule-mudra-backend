import { callHistorymodel } from '@/database/mysql/callHistory'
import {
  ICallHistoryModel,
  TSelectCallHistory,
} from '@/interfaces/callHistory.interace'
import { InsertData, SelectFields, SortCriteria, WhereQuery } from '@/types/model.types'

class CallHistoryService {
  private readonly callHistoryModel = callHistorymodel

  async findOne(
    where: WhereQuery<ICallHistoryModel>,
    select: SelectFields<TSelectCallHistory> = ['*'],
    order?: SortCriteria<TSelectCallHistory>,
  ): Promise<ICallHistoryModel> {
    return await this.callHistoryModel.findOneCallHistory(where, select, order)
  }

  async create(
    data:InsertData<ICallHistoryModel>
  ): Promise<number[]> {
    return await this.callHistoryModel.insert(data)
  }
}

export const callHistoryservice = new CallHistoryService()
