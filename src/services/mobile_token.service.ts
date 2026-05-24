import MoblieTokenModel from '@/database/mysql/mobileToken'
import {
  IMobileToken,
  TSelectMobileToken,
} from '@/interfaces/mobileToken.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { SelectFields, SortCriteria, WhereQuery } from '@/types/model.types'
import { logger } from '@/utils/logger'

class MobileTokenService {
  private moblieTokenModel = new MoblieTokenModel()

  async findOne(
    where: WhereQuery<IMobileToken>,
    select: SelectFields<TSelectMobileToken>,
    order?: SortCriteria<TSelectMobileToken>,
  ): Promise<IMobileToken> {
    let mobileToken = await this.moblieTokenModel.findOneMobileToken(
      where,
      select,
      order,
    )

    return mobileToken
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IMobileToken[] | ICustomResponse> {
    try {
      let mobileToken = await this.moblieTokenModel.getMobileTokens(
        where,
        order,
        select,
      )
      if (mobileToken == null || mobileToken.length == 0) {
        return []
      } else {
        return mobileToken // Return the first lead if found
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

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.moblieTokenModel.findOneAndUpdate(where, update)
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
  public async create(data: {}): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.moblieTokenModel.insert(data)
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
}

export default MobileTokenService
