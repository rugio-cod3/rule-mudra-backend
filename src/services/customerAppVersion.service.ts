import CustomerAppVersionModel from '@/database/mysql/customerApp_version'
import { ICustomerAppVersion, TSelectCustomerAppVersion } from '@/interfaces/customerApp_version'
import { InsertData } from '@/types/model.types'

class CustomerAppVersionService {
  private customerAppLocationModel = new CustomerAppVersionModel()

  public async findOne(
    where: Partial<ICustomerAppVersion>,
    select: TSelectCustomerAppVersion[] | ['*'] = ['*'],
  ): Promise<ICustomerAppVersion> {
    return await this.customerAppLocationModel.findOneCustomerAppVersion(where, select)
  }
  async create(
    data:InsertData<ICustomerAppVersion>
  ): Promise<number[]> {
    return await this.customerAppLocationModel.insert(data)
  }
}

export const customerAppVersionService =  new CustomerAppVersionService ()
