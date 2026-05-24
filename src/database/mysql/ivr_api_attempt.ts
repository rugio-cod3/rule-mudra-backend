import {
  IAttempt,
  TSelectAttempt,
} from '@/interfaces/ivr_api_attempt.interface'
import {
  InsertData,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export default class IvrModel {
  private table = 'ivr_api_attempt'

  public async findOneAndUpdate(
    where: WhereQuery<IAttempt>,
    update: UpdateQuery<IAttempt>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async create(data: InsertData<IAttempt>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOne(
    where: Partial<IAttempt>,
    select: TSelectAttempt[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectAttempt>,
  ): Promise<IAttempt> {
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
}

export const ivrModel = new IvrModel()
