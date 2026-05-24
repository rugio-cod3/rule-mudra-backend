import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class OldCrmUsersCheckModel {
  private table = 'oldcrm_users_check'

  public async insert(data: {}): Promise<number | null> {
    try {
      const db = getKnexInstance()
      let result = await db(this.table).insert(data)
      let insertedID = result[0]
      return insertedID
    } catch (error) {
      logger.error(
        'Error Inside OldCrmUsersCheckModel.ts insert function',
        error,
      )
    }
  }
}
