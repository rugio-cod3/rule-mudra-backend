import { IDocument, TSelectDocument } from '@/interfaces/document.interface'
import {
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class DocumentModel {
  private table = 'document'

  async findOne(
    where: WhereQuery<IDocument>,
    select: SelectFields<TSelectDocument> = ['*'],
    order?: SortCriteria<TSelectDocument>,
  ): Promise<IDocument> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }

  async findAll(
    where: WhereQuery<IDocument>,
    select: SelectFields<TSelectDocument> = ['*'],
    order?: SortCriteria<TSelectDocument>,
  ): Promise<IDocument[]> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (order) {
      query.orderBy(order)
    }

    return await query
  }

  public async insert(data: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let result = await db(this.table).insert(data)
      let insertedID = result[0]
      return insertedID
    } catch (error) {
      logger.error('Error Inside leads.ts insert function', error)
      return null
    }
  }
}

export const documentModel = new DocumentModel()
