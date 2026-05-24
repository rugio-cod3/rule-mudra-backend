import UserSummaryModel from '@/database/mysql/user_summary'
import { ICustomResponse } from '@/interfaces/response.interface'
import {
  IUserSummary,
  TSelectUserSummary,
} from '@/interfaces/user_summary.interface'
import { SortCriteria } from '@/types/model.types'
import { logger } from '@/utils/logger'

class UserSummaryService {
  private userSummaryModel = new UserSummaryModel()

  // ! Refactored
  public async findOne(
    where: Partial<IUserSummary>,
    select: TSelectUserSummary[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectUserSummary>,
    dateRange?: { start: Date; end: Date }
  ): Promise<IUserSummary> {
    return await this.userSummaryModel.findOneSummary(where, select,order,dateRange)
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IUserSummary[] | ICustomResponse> {
    try {
      let credit_reports = await this.userSummaryModel.getUserSummaries(
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
}

export default UserSummaryService
