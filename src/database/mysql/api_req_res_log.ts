import { IApiReqResLog } from '@/interfaces/api_req_res_log.interface'
import { InsertData } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class ApiReqResLogModel {
  private table = 'api_req_res_logs'

  async insert(data: InsertData<IApiReqResLog>): Promise<number[]> {
    let db = getKnexInstance()
    if (!db) {
      logger.error('Knex instance not initialized when calling insert on api_req_res_logs')
      throw new Error('Database not ready')
    }
    return await db(this.table).insert(data)
  }

  public async findOneAndUpdate(where: {}, update: {}): Promise<number> {
    try {
      let db = getKnexInstance()
      let res = await db(this.table).where(where).update(update)
      return res
    } catch (error) {
      logger.error(
        'Error Inside api_req_res_log.ts findOneAndUpdate function',
        error,
      )
      return 0
    }
  }
}

export const apiReqResLogsModel = new ApiReqResLogModel();
