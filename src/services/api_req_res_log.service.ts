import ApiReqResLogModel from '@/database/mysql/api_req_res_log'
import { IApiReqResLog } from '@/interfaces/api_req_res_log.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { InsertData } from '@/types/model.types'
import { logger } from '@/utils/logger'

class ApiReqResLogService {
  private apiReqResLogModel = new ApiReqResLogModel()

  public async create(data: InsertData<IApiReqResLog>): Promise<number[]> {
    return await this.apiReqResLogModel.insert(data)
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<number | ICustomResponse> {
    try {
      let res = await this.apiReqResLogModel.findOneAndUpdate(where, update)
      return res
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

export default ApiReqResLogService
export const apiLogService = new ApiReqResLogService()
