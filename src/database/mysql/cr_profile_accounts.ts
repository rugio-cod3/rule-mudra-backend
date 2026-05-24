import { ICrProfileAccounts,TSelectCrProfileAccounts } from '@/interfaces/cr_profile_accounts.interface'
import { SelectFields, SortCriteria, WhereNotNull, WhereQuery } from '@/types/model.types';
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class CrProfileAccountModel {
  private table = 'cr_profile_accounts'

 
  async findOneCrProfileAccounts(
    where: WhereQuery<ICrProfileAccounts>,
    select: SelectFields<TSelectCrProfileAccounts> = ['*'],
    order?: SortCriteria<TSelectCrProfileAccounts>,
    whereNotNull?:WhereNotNull<TSelectCrProfileAccounts>
  ) {
    const db = getKnexInstance()
    let query = db.table(this.table).where(where).select(...select);
    
    if (order) {
      query.orderBy(order);
    }
    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }
    
    return await query.first();
  }
  async findAll(
    where: WhereQuery<ICrProfileAccounts>,
    select: SelectFields<TSelectCrProfileAccounts> = ['*'],
    order: SortCriteria<TSelectCrProfileAccounts>,
  ): Promise<ICrProfileAccounts[]> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .orderBy(order)
  }
}
