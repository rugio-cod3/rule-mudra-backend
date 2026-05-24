import UserMetaDataModel from '@/database/mysql/user_metadata'
import { ICustomResponse } from '@/interfaces/response.interface'
import { IUserMetadata } from '@/interfaces/user_metadata.interface'
import { logger } from '@/utils/logger'

class UserMetaDataService {
  private userMetaDataModel = new UserMetaDataModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IUserMetadata | ICustomResponse> {
    try {
      let metadata = await this.userMetaDataModel.getUserMetaData(
        where,
        order,
        select,
      )
      if (metadata == null) {
        return null
      } else {
        return metadata // Return the first lead if found
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

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IUserMetadata[] | ICustomResponse> {
    try {
      let metadata = await this.userMetaDataModel.getUserMetaDatas(
        where,
        order,
        select,
      )
      if (metadata == null || metadata.length == 0) {
        return []
      } else {
        return metadata // Return the first lead if found
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

  public async create(data:IUserMetadata): Promise<boolean> {
    try {
      await this.userMetaDataModel.insert(data)
      return true
    } catch (error) {
      logger.error(error)
      return false
    }
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.userMetaDataModel.findOneAndUpdate(where, update)
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

export default UserMetaDataService
