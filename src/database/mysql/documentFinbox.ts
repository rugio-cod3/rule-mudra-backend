import {
  IDocumentFinboxInterfaceModel,
  TSelectDocumentFinbox,
} from '@/interfaces/documentFinbox.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export default class DocumentFinboxModel {
  private table = 'documentFinbox'

  get DocumentFinboxKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async findOneDocumentFinbox(
    where: WhereQuery<IDocumentFinboxInterfaceModel>,
    select: SelectFields<TSelectDocumentFinbox> = ['*'],
    orderBy?: SortCriteria<TSelectDocumentFinbox>,
  ): Promise<IDocumentFinboxInterfaceModel> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }

  async insert(
    data: InsertData<IDocumentFinboxInterfaceModel>,
  ): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async count(
    params: KnexFindParams<
      IDocumentFinboxInterfaceModel,
      TSelectDocumentFinbox
    >,
  ): Promise<number> {
    const { where, whereNot } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const documentFinboxmodel = new DocumentFinboxModel()
