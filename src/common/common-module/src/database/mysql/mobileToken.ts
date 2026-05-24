import {
  IMobileToken,
  TSelectMobileToken,
} from '@/interfaces/mobileToken.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance, runQuery } from '@/utils/mysql'
import { format } from 'date-fns'

export default class MoblieTokenModel {
  private table = 'mobile_token'

  public async getMobileToken(mobile: number): Promise<[]> {
    const sql = `SELECT * FROM ${this.table} WHERE mobile = ${mobile} LIMIT 1`
    try {
      const result = await runQuery(sql)
      if (result.length === 0) {
        return []
      } else {
        return result[0]
      }
    } catch (error) {
      logger.error(error)
      return []
    }
  }
  public async saveMobileToken(
    counsmer_id: number,
    mobile: number,
    appID: string,
    imei: string,
  ) {
    const insertedData = {
      customerID: counsmer_id,
      mobile: mobile,
      appID: appID,
      imei: imei,
      access_token: '',
      last_login: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      credatedDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    }

    const columns = Object.keys(insertedData)
    const values = Object.values(insertedData)
    const placeholders = values.map(() => '?').join(',')

    const sql = `
        INSERT INTO ${this.table} (${columns.join(',')})
        VALUES (${placeholders})
      `
    try {
      const insertObjResp = await runQuery(sql, values)
      return insertObjResp
    } catch (error) {
      logger.error(error)
    }
  }

  public async updateMobileToken(
    counsmer_id: number,
    mobile: number,
    appID: string,
    imei: string,
  ) {
    const insertedData = {
      customerID: counsmer_id,
      appID: appID,
      imei: imei,
      access_token: '',
      last_login: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      credatedDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    }
    try {
      const updateKeys = Object.keys(insertedData)
      const updateValues = updateKeys
        .map((column_name) => `${column_name} = ?`)
        .join(', ')
      const sql = `UPDATE ${this.table} SET ${updateValues} WHERE mobile = ?`
      const values = [...updateKeys.map((key) => insertedData[key]), mobile]
      const updateObjResp = await runQuery(sql, values)
      return updateObjResp
    } catch (error) {
      logger.error(error)
      return false
    }
  }

  public async getMobileTokens(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IMobileToken[] | []> {
    try {
      let db = getKnexInstance()
      let mobileToken = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (mobileToken == null || mobileToken.length == 0) {
        return []
      } else {
        return mobileToken // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside mobileToken.ts getMobileTokens function',
        error,
      )
    }
  }

  async findOneAndUpdate(
    where: WhereQuery<IMobileToken>,
    update: UpdateQuery<IMobileToken>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  public async insert(data: InsertData<IMobileToken>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneMobileToken(
    where: WhereQuery<IMobileToken>,
    select: SelectFields<TSelectMobileToken>,
    order?: SortCriteria<TSelectMobileToken>,
  ): Promise<IMobileToken> {
    let db = getKnexInstance()
    const query = db(this.table).where(where).select(select)

    if (order) query.orderBy(order)

    return await query.first()
  }
}

export const mobileTokenModel = new MoblieTokenModel()
