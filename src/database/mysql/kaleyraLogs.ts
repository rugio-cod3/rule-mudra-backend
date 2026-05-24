import { logger } from '@/utils/logger'
import { getKnexInstance, runQuery } from '@/utils/mysql'

export default class KaleyraLogsModel {
  private db = getKnexInstance
  private table = 'kaleyra_logs'

  public async saveLogs(insertedData: {}) {
    const columns = Object.keys(insertedData)
    const values = Object.values(insertedData)
    const sql = `
        INSERT INTO ${this.table} (${columns.map(col => col).join(',')})
        VALUES (${values.map(() => '?').join(',')})
      `

    try {
      const insertObjResp = await runQuery(sql, values)
      return insertObjResp
    } catch (error) {
      logger.error(error)
    }
  }

  public async countOtpLogs(mobile_no) {
    const sql = `select count(id) as counts from kaleyra_logs where mobile = ${mobile_no} and iu_date>=(NOW() - INTERVAL 120 MINUTE)`

    try {
      const result = await runQuery(sql)
      return result[0][0].counts || 0
    } catch (error) {
      logger.error(error)
    }
  }
}
