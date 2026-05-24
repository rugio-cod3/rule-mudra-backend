import CreditReportModel from '@/database/mysql/credit_report'
import { TSelectCredit } from '@/interfaces/credit.interface'
import { ICreditReport, TSelectCreditReport } from '@/interfaces/credit_report.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { SelectFields, SortCriteria, WhereNotNull, WhereQuery } from '@/types/model.types'
import { logger } from '@/utils/logger'

class CreditReportService {
  private creditReportModel = new CreditReportModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ICreditReport | ICustomResponse> {
    try {
      let credit_reports = await this.creditReportModel.getCreditReports(
        where,
        order,
        select,
      )
      if (credit_reports == null || credit_reports.length == 0) {
        return null
      } else {
        return credit_reports[0] // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ICreditReport[] | ICustomResponse> {
    try {
      let credit_reports = await this.creditReportModel.getCreditReports(
        where,
        order,
        select,
      )
      if (credit_reports == null || credit_reports.length == 0) {
        return []
      } else {
        return credit_reports // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }
  async findOneReport(
    where: WhereQuery<ICreditReport>,
    select: SelectFields<TSelectCreditReport> = ['*'],
    order?: SortCriteria<TSelectCreditReport>,
    whereNotNull?:WhereNotNull<TSelectCreditReport>
  ): Promise<ICreditReport> {
    return await this.creditReportModel.findOneReport(where, select, order,whereNotNull)
  }
}

export default CreditReportService
