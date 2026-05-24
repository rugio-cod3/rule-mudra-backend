import { leadsAutoStatusmodel } from '@/database/mysql/leadsAutoStatus'
import {
  ILeadsAutoStatusModel,
  TSelectLeadsAutoStatus,
} from '@/interfaces/leadsStatus.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'

export default class LeadsAutoStatusService {
  private readonly leadsAutoStatusModel = leadsAutoStatusmodel

  async findOne(
    where: WhereQuery<ILeadsAutoStatusModel>,
    select: SelectFields<TSelectLeadsAutoStatus> = ['*'],
    order?: SortCriteria<TSelectLeadsAutoStatus>,
  ): Promise<ILeadsAutoStatusModel> {
    return await this.leadsAutoStatusModel.findOneLeadsAutoStatus(
      where,
      select,
      order,
    )
  }

  //   async findAndCount(
  //     where: WhereQuery<IRepayDateHolidayModel>,
  //   ): Promise<number> {
  //     return await this.leadsAutoStatusModel.findAndCountRepayDateHoliday(where)
  //   }

  async create(data: InsertData<ILeadsAutoStatusModel>): Promise<number[]> {
    return await this.leadsAutoStatusModel.insert(data)
  }
}

export const leadsAutoStatusservice = new LeadsAutoStatusService()
