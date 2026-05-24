import { customerNameMatchmodel } from '@/database/mysql/customerNameMatch'
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

class CustomerNameMatchService {
  private readonly customerNameMatchModel = customerNameMatchmodel

  async findOne(
    where: WhereQuery<ICustomerNameMatchModel>,
    select: SelectFields<TSelectCustomerNameMatch> = ['*'],
    order?: SortCriteria<TSelectCustomerNameMatch>,
  ): Promise<ICustomerNameMatchModel> {
    return await this.customerNameMatchModel.findOneCustomerNameMatch(
      where,
      select,
      order,
    )
  }

  async create(data: InsertData<ICustomerNameMatchModel>): Promise<number[]> {
    return await this.customerNameMatchModel.insert(data)
  }
}

export const customerNameMatchservice = new CustomerNameMatchService()
