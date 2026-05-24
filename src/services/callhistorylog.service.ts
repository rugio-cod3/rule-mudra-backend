import CallHistoryLogModel from '@/database/mysql/callhistorylogs'
import { ICallHistoryLog } from '@/interfaces/callhistorylogs.interface'
import { InsertData } from '@/types/model.types'

class CallHistoryLogService {
  private callHistoryLogModel = new CallHistoryLogModel()

  async create(
    data:InsertData<ICallHistoryLog>
  ): Promise<number[]> {
    return await this.callHistoryLogModel.insert(data)
  }
}

export default CallHistoryLogService
