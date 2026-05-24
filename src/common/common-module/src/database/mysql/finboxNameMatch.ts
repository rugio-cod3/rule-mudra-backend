import {
  IFinboxNameMatchModel,
  TSelectFinboxNameMatch,
} from '../../interfaces/finboxNameMatch.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance, runQuery } from '../../utils/mysql'

class FinBoxNameMatch {
  private readonly table = 'finbox_name_match'

  findOneFinboxNameMatch = async (
    where: WhereQuery<IFinboxNameMatchModel>,
    select: SelectFields<TSelectFinboxNameMatch> = ['*'],
    order?: SortCriteria<TSelectFinboxNameMatch>,
  ): Promise<IFinboxNameMatchModel> => {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }

  insert = async (
    data: InsertData<IFinboxNameMatchModel>,
  ): Promise<number[]> => {
    let db = getKnexInstance()
    return await db(this.table).insert(<IFinboxNameMatchModel>data)
  }

  public async getFinboxById(id: number) {
    const sql = `SELECT * FROM ${this.table} WHERE id=${id}`
    try {
      const getObjResp = await runQuery(sql)
      return getObjResp[0]
    } catch (error) {
      logger.error(error)
      return []
    }
  }

  async findOneAndUpdate(where: {}, update: {}): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }
}

export const finboxNameMatchModel = new FinBoxNameMatch()
