import CustomerAppLocationModel from '@/database/mysql/customerApp_location'
import { ICustomerAppLocation, TSelectCustomerAppLocation } from '@/interfaces/customerApp_location.interface'
import { ILoan, TSelectLoan } from '@/interfaces/loan.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { InsertData } from '@/types/model.types'
import { logger } from '@/utils/logger'

class CustomerAppLocationService {
  private customerAppLocationModel = new CustomerAppLocationModel()

  public async findOne(
    where: Partial<ICustomerAppLocation>,
    select: TSelectCustomerAppLocation[] | ['*'] = ['*'],
  ): Promise<ICustomerAppLocation> {
    return await this.customerAppLocationModel.findOneCustomerAppLocation(where, select)
  }
  async create(
    data:InsertData<ICustomerAppLocation>
  ): Promise<number[]> {
    return await this.customerAppLocationModel.insert(data)
  }
}

export const customerAppLocationService =  new CustomerAppLocationService ()
