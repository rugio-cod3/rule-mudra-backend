import CustomerAppModel from '@/database/mysql/customerApp'
import {
  ICustomerApp,
  TSelectCustomerApp,
} from '@/interfaces/customerApp.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class CustomerAppService {
  private customerAppModel = new CustomerAppModel()

  async findOne(
    where: Partial<ICustomerApp>,
    select: TSelectCustomerApp[] | ['*'] = ['*'],
  ): Promise<ICustomerApp> {
    return await this.customerAppModel.findOneCustomerApp(where, select)
  }

  // public async find(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ICustomerApp[] | ICustomResponse> {
  //   try {
  //     let customerApp = await this.customerAppModel.getCustomerApps(
  //       where,
  //       order,
  //       select,
  //     )
  //     if (customerApp == null || customerApp.length == 0) {
  //       return null
  //     } else {
  //       return customerApp // Return the first lead if found
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

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let customerApp_count = await this.customerAppModel.countCustomerApp(
        where,
      )
      if (customerApp_count == null) {
        return 0
      } else {
        return customerApp_count // Return the first lead if found
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

  public async create(data: {}): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.customerAppModel.insert(data)
      return insertId
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async updateOne(where: {}, update: {}): Promise<boolean> {
    try {
      await this.customerAppModel.findOneAndUpdate(where, update)
      return true
    } catch (error) {
      logger.error(error)
      return false
    }
  }

  public async findByFilter(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
    page: number,
    perPage: number,
  ): Promise<ICustomerApp[] | ICustomResponse> {
    try {
      let customerApp = await this.customerAppModel.getCustomerAppsByFilter(
        where,
        order,
        select,
        page,
        perPage,
      )
      if (customerApp == null || customerApp.length == 0) {
        return null
      } else {
        return customerApp // Return the first lead if found
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

export default CustomerAppService
