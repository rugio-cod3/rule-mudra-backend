import { ITransactionModel, TSelectTransaction } from '@/interfaces/collectionCrm.interface'
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
export default class TransactionModel {
  private table = 'transactions'

  async findOne(
    where: WhereQuery<ITransactionModel>,
    select: SelectFields<TSelectTransaction> = ['*'],
    orderBy?: SortCriteria<TSelectTransaction>,
  ): Promise<ITransactionModel> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }

  async findAll(
    where: WhereQuery<ITransactionModel>,
    select: SelectFields<TSelectTransaction> = ['*'],
    orderBy?: { orderKey: string; orderValue: string },

  ): Promise<ITransactionModel[]> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)
      .orderBy('id', 'desc')

    if (orderBy) query.orderBy(orderBy.orderKey, orderBy.orderValue)

    return await query
  }
  

  async insert(data: InsertData<TSelectTransaction>): Promise<number[]> {
    let db = getKnexInstance()

    return await db(this.table).insert(data)
  }

}
