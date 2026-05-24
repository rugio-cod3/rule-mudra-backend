import CustomerAccountModel from '@/database/mysql/customerAccount'
import {
  ICustomerAccount,
  TSelectCustomerAccount,
} from '@/interfaces/customerAccount.interface'
import { InsertData } from '@/types/model.types'
import { logger } from '@/utils/logger'

class CustomerAccountService {
  private customerAccountModel = new CustomerAccountModel()

  public async create(data: InsertData<ICustomerAccount>): Promise<number[]> {
    return await this.customerAccountModel.insert(data)
  }

  public async updateOne(where: {}, update: {}): Promise<boolean> {
    try {
      await this.customerAccountModel.findOneAndUpdate(where, update)
      return true
    } catch (error) {
      logger.error(error)
      return false
    }
  }

  // public async findOne(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ICustomerAccount | ICustomResponse> {
  //   try {
  //     let customerAccount = await this.customerAccountModel.getCustomerAccount(
  //       where,
  //       order,
  //       select,
  //     )
  //     if (customerAccount == null || customerAccount.length == 0) {
  //       return null
  //     } else {
  //       return customerAccount[0]
  //     }
  //   } catch (error) {
  //     logger.error(error)
  //     return {
  //       success: false,
  //       message: 'Internal Server Error',
  //       statusCode: 500,
  //     } as ICustomResponse
  //   }
  // }
  public async findOne(
    where: Partial<ICustomerAccount>,
    order: { orderKey: TSelectCustomerAccount; orderValue: string },
    select: TSelectCustomerAccount[] | ['*'] = ['*'],
  ): Promise<ICustomerAccount> {
    return await this.customerAccountModel.findOneCustomerAccount(
      where,
      order,
      select,
    )
  }

  async checkBankAccount(customerID: number): Promise<boolean> {
    const checkBankAccount = await this.findOne(
      {
        customerID: customerID,
      },
      {
        orderKey: 'accountID',
        orderValue: 'desc',
      },
      ['accountNo', 'accountType', 'bankIfsc', 'bank', 'bankBranch', 'status'],
    )

    return checkBankAccount !== null
  }
}
export default CustomerAccountService
