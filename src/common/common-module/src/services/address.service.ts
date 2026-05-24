import AddressModel from '../database/mysql/address'
import { IAddress, TSelectAddress } from '../interfaces/address.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../types/model.types'
import { logger } from '../utils/logger'

class AddressService {
  private addressModel = new AddressModel()

  async findOne(
    where: WhereQuery<IAddress>,
    select: SelectFields<TSelectAddress> = ['*'],
    order?: SortCriteria<TSelectAddress>,
  ): Promise<IAddress> {
    return await this.addressModel.findOneAddress(where, select, order)
  }
  async find(
    where: WhereQuery<IAddress>,
    order: SortCriteria<TSelectAddress>,
    select: SelectFields<TSelectAddress> = ['*'],
  ): Promise<IAddress[]> {
    return await this.addressModel.findAll(where, order, select)
  }

  public async create(data: InsertData<IAddress>): Promise<number[]> {
    return await this.addressModel.insert(data)
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.addressModel.findOneAndUpdate(where, update)
      return true
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
export default AddressService
