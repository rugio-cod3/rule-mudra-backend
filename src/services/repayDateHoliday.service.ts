import { repayDateHolidaymodel } from '@/database/mysql/repayDateHoliday'
import {
  IRepayDateHolidayModel,
  TSelectRepayDateHoliday,
} from '@/interfaces/repayDateHoliday.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'

class RepayDateHolidayService {
  private readonly repayDateHolidayModel = repayDateHolidaymodel

  async findOne(
    where: WhereQuery<IRepayDateHolidayModel>,
    select: SelectFields<TSelectRepayDateHoliday> = ['*'],
    order?: SortCriteria<TSelectRepayDateHoliday>,
  ): Promise<IRepayDateHolidayModel> {
    return await this.repayDateHolidayModel.findOneRepayDateHoliday(
      where,
      select,
      order,
    )
  }

  async findAndCount(
    where: WhereQuery<IRepayDateHolidayModel>,
  ): Promise<number> {
    return await this.repayDateHolidayModel.findAndCountRepayDateHoliday(where)
  }

  async create(data: InsertData<IRepayDateHolidayModel>): Promise<number[]> {
    return await this.repayDateHolidayModel.insert(data)
  }
}

export const repayDateholidayservice = new RepayDateHolidayService()
