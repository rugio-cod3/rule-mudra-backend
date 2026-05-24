import { ICrProfileRepaymentData,TSelectCrProfileRepaymentData} from '@/interfaces/cr_profile_repayment_data'
import { SelectFields, SortCriteria, WhereNotNull, WhereQuery } from '@/types/model.types';
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class CrProfileRepaymentDataModel {
  private table = 'cr_profile_repayment_data'

 
  async findOneCrProfileRepaymentData(
    where: WhereQuery<ICrProfileRepaymentData>,
    select: SelectFields<TSelectCrProfileRepaymentData> = ['*'],
    order?: SortCriteria<TSelectCrProfileRepaymentData>,
    whereNotNull?:WhereNotNull<TSelectCrProfileRepaymentData>
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
    where: WhereQuery<ICrProfileRepaymentData>,
    select: SelectFields<TSelectCrProfileRepaymentData> = ['*'],
    order: SortCriteria<TSelectCrProfileRepaymentData>,
  ): Promise<ICrProfileRepaymentData[]> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .orderBy(order)
  }
}
