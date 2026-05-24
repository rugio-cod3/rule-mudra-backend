import { IAddress, TSelectAddress } from '@/interfaces/address.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class AddressModel {
  private table = 'address'

  async findOneAddress(
    where: WhereQuery<IAddress>,
    select: SelectFields<TSelectAddress> = ['*'],
    order?: SortCriteria<TSelectAddress>,
  ) {
    const db = getKnexInstance()
    let query = db.table(this.table).where(where).select(...select);
    
    if (order) {
      query.orderBy(order);
    }
    
    return await query.first();
  }

  async findAll(
    where: WhereQuery<IAddress>,
    order: SortCriteria<TSelectAddress>,
    select: SelectFields<TSelectAddress> = ['*'],
  ): Promise<IAddress[]> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .orderBy(order)
  }

  public async insert(data: InsertData<IAddress>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<number> {
    try {
      let db = getKnexInstance()
      let res = await db(this.table).where(where).update(update).orderBy('addressID', 'desc')
      return res
    } catch (error) {
      logger.error('Error Inside sddress.ts findOneAndUpdate function', error)
      return 0
    }
  }

  async count(
    params: KnexFindParams<IAddress, TSelectAddress>,
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


export const addressModel = new AddressModel();