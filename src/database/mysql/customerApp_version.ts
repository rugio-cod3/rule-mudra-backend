import { ICustomerAppVersion, TSelectCustomerAppVersion} from '@/interfaces/customerApp_version'
import { InsertData, SelectFields, UpdateQuery, WhereQuery } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export type responseType = {}
export default class CustomerAppVersionModel {
  private table = 'customerAppVersion'

  async findOneCustomerAppVersion(
    where: WhereQuery<ICustomerAppVersion>,
    select: SelectFields<TSelectCustomerAppVersion> = ['*'],
  ): Promise<ICustomerAppVersion> {
    let db = getKnexInstance()
    return await db.table(this.table)
      .where(where)
      .select(...select)
      .first()
  }
  async insert(data: InsertData<ICustomerAppVersion>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOneAndUpdate(
    where: WhereQuery<ICustomerAppVersion>,
    update: UpdateQuery<ICustomerAppVersion>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }
}

export const customerAppVersionModel = new CustomerAppVersionModel();