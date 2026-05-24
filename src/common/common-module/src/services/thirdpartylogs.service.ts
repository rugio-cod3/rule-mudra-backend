import { thirdPartylogs } from '../database/mysql/thirdPartyLogs'
import {
  IThirdPartyLogsModel,
  TSelectThirdPartyLogs,
} from '../interfaces/thirdPartyLogs.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../types/model.types'

class ThirdPartyLogsService {
  private readonly thirdpartylogsModel = thirdPartylogs

  async findOne(
    where: WhereQuery<IThirdPartyLogsModel>,
    select: SelectFields<TSelectThirdPartyLogs> = ['*'],
    order?: SortCriteria<TSelectThirdPartyLogs>,
  ): Promise<IThirdPartyLogsModel> {
    return await this.thirdpartylogsModel.findOneThirdPartyLogs(
      where,
      select,
      order,
    )
  }

  //   async updateOne(
  //     where: WhereQuery<ILead>,
  //     update: UpdateQuery<ILead>,
  //   ): Promise<number> {
  //     return await this.leadModel.findOneAndUpdate(where, update)
  //   }

  async create(data: InsertData<IThirdPartyLogsModel>): Promise<number[]> {
    return await this.thirdpartylogsModel.insert(data)
  }
}

export const thirdPartyLogsservice = new ThirdPartyLogsService()
