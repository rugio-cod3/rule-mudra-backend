import { ICreditReport } from '../../interfaces/creditReport.interface'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

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
      logger.error('Error Inside credit_report.ts getCreditReports function', error)
    }
  }

  public async create(creditReportDetails: ICreditReport): Promise<number[]> {
    try {
      const db = getKnexInstance()
      const details = await db(this.table).insert(creditReportDetails)
      return details
    } catch (error) {
      logger.error('Error while saving credit report details', error)
    }
  }
}
