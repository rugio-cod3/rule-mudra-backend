import {
  IThirdPartyLogsModel,
  TSelectThirdPartyLogs,
} from '@/interfaces/thirdPartyLogs.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export type responseType = {}
export default class ThirdPartyLogs {
  private table = 'thirdparty_logs'

  get ThirdPartyLogs() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async findOneThirdPartyLogs(
    where: WhereQuery<IThirdPartyLogsModel>,
    select: SelectFields<TSelectThirdPartyLogs> = ['*'],
    order?: SortCriteria<TSelectThirdPartyLogs>,
  ): Promise<IThirdPartyLogsModel> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }

  async findOneAndUpdate(
    where: WhereQuery<IThirdPartyLogsModel>,
    update: UpdateQuery<IThirdPartyLogsModel>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async insert(data: InsertData<IThirdPartyLogsModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}

export const thirdPartylogs = new ThirdPartyLogs()
