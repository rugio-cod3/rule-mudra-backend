import {
  ICustomerAppLocation,
  TSelectCustomerAppLocation,
} from '@/interfaces/customerApp_location.interface'
import {
  InsertData,
  SelectFields,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export type responseType = {}
export default class CustomerAppLocationModel {
  private table = 'customerAppLocation'

  async findOneCustomerAppLocation(
    where: WhereQuery<ICustomerAppLocation>,
    select: SelectFields<TSelectCustomerAppLocation> = ['*'],
  ): Promise<ICustomerAppLocation> {
    let db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .first()
  }
  async insert(data: InsertData<ICustomerAppLocation>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOneAndUpdate(
    where: WhereQuery<ICustomerAppLocation>,
    update: UpdateQuery<ICustomerAppLocation>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }
}

export const customerAppLocationModel = new CustomerAppLocationModel()
