import {
  ICustomerNameMatchModel,
  TSelectCustomerNameMatch,
} from '@/interfaces/customerNameMatch.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

class CustomerNameMatch {
  private readonly table = 'customer_name_match'

  findOneCustomerNameMatch = async (
    where: WhereQuery<ICustomerNameMatchModel>,
    select: SelectFields<TSelectCustomerNameMatch> = ['*'],
    order?: SortCriteria<TSelectCustomerNameMatch>,
  ): Promise<ICustomerNameMatchModel> => {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }

  insert = async (
    data: InsertData<ICustomerNameMatchModel>,
  ): Promise<number[]> => {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}

export const customerNameMatchmodel = new CustomerNameMatch()
