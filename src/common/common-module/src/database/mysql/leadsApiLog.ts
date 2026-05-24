import { ILeadsApiLog, TSelectLeadsApiLog } from '../../interfaces/leadApiLogs.interface'
import {
  DeleteWhere,
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class LeadApiLogModel {
  private table = 'leads_api_log'

  get LeadsApiLogKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async findOneLeadsApiLog(
    where: WhereQuery<ILeadsApiLog>,
    select: SelectFields<TSelectLeadsApiLog> = ['*'],
    orderBy?: SortCriteria<TSelectLeadsApiLog>,
  ): Promise<ILeadsApiLog> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }

  public async getLeadApiLogs(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ILeadsApiLog[] | null> {
    try {
      let db = getKnexInstance()
      let lead_api_log = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (lead_api_log == null || lead_api_log.length == 0) {
        return []
      } else {
        return lead_api_log // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside lead_api_log.ts getLeadApiLogs function', error)
    }
  }
  public async getLeadApiLog(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ILeadsApiLog | null> {
    try {
      let db = getKnexInstance()
      let lead_api_log = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
        .limit(1)
      if (lead_api_log == null || lead_api_log.length == 0) {
        return null
      } else {
        return lead_api_log[0] // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside lead_api_log.ts getLeadApiLog function', error)
    }
  }

  public async insert(data: InsertData<ILeadsApiLog>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOneAndUpdate(
    where: WhereQuery<ILeadsApiLog>,
    update: UpdateQuery<ILeadsApiLog>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async findBreCheck(pancard: string): Promise<ILeadsApiLog> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where('pancard', pancard)
      .andWhere(function () {
        this.where({ api_supplier: 6, status: 1, api_type: 'bureau_sagorate' })
          .orWhere({ api_supplier: 3, status: 1, api_type: 'consumer-cir-cv' })
          .orWhere({
            api_supplier: 4,
            status: 1,
            api_type: 'pan-comprehensive',
          })
      })
      .orderBy('id', 'desc')
      .select('created_at')
      .first()
  }

  async delete(deleteWhere: DeleteWhere<TSelectLeadsApiLog>) {
    const db = getKnexInstance()
    const query = db(this.table)

    deleteWhere.forEach(element => {
      const { column, operator, value } = element

      if (operator) query.where(column, operator, value)
      else query.where(column, value)
    })

    return await query.delete()
  }

  async count(params: KnexFindParams<ILeadsApiLog, TSelectLeadsApiLog>): Promise<number> {
    const { where, whereNot } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const leadsApiLogModel = new LeadApiLogModel()
