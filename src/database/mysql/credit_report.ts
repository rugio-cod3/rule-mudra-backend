import { ICreditReport, TSelectCreditReport } from '@/interfaces/credit_report.interface'
import { SelectFields, SortCriteria, WhereNotNull, WhereQuery } from '@/types/model.types';
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class CreditReportModel {
  private table = 'credit_reports'

  public async getCreditReports(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ICreditReport[] | []> {
    try {
      let db = getKnexInstance()
      let credit_report = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (credit_report == null || credit_report.length == 0) {
        return []
      } else {
        return credit_report // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside credit_report.ts getCreditReports function',
        error,
      )
    }
  }
  async findOneReport(
    where: WhereQuery<ICreditReport>,
    select: SelectFields<TSelectCreditReport> = ['*'],
    order?: SortCriteria<TSelectCreditReport>,
    whereNotNull?: WhereNotNull<TSelectCreditReport>
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

  async create(data: any): Promise<number[]> {
    const db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}
