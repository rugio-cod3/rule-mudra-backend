import {
  IFinboxNameMatchModel,
  TSelectFinboxNameMatch,
} from '@/interfaces/finboxNameMatch.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

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
    return await db(this.table).insert(<IFinboxNameMatchModel>(data))
  }
}

export const finboxNameMatchmodel = new FinBoxNameMatch()
