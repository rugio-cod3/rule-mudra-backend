import { finboxNameMatchmodel } from '@/database/mysql/finboxNameMatch'
import {
  IFinboxNameMatchModel,
  TSelectFinboxNameMatch,
} from '@/interfaces/finboxNameMatch.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'

class FinboxNameMatchService {
  private readonly finboxNameMatchModel = finboxNameMatchmodel

  findOne = async (
    where: WhereQuery<IFinboxNameMatchModel>,
    select: SelectFields<TSelectFinboxNameMatch> = ['*'],
    order?: SortCriteria<TSelectFinboxNameMatch>,
  ): Promise<IFinboxNameMatchModel> => {
    return await this.finboxNameMatchModel.findOneFinboxNameMatch(
      where,
      select,
      order,
    )
  }

  create = async (
    data: InsertData<IFinboxNameMatchModel>,
  ): Promise<number[]> => {
    return await this.finboxNameMatchModel.insert(data)
  }
}

export const finboxNameMatchservice = new FinboxNameMatchService()
