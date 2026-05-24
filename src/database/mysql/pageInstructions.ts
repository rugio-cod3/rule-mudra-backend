import { IPageInstructions, TSelectPageInstructions } from '@/interfaces/pageInstructions.interface'
import {
  DeleteWhere,
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export type responseType = {}
export default class PageInstructionModel {
  private table = 'page_instructions'

  async findOnePageInstruction(
    where: WhereQuery<IPageInstructions>,
    select: SelectFields<TSelectPageInstructions> = ['*'],
    orderBy?: SortCriteria<TSelectPageInstructions>,
  ): Promise<IPageInstructions> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }

  async insert(data: InsertData<IPageInstructions>): Promise<number[]> {
    let db = getKnexInstance()

    return await db(this.table).insert(data)
  }

}
