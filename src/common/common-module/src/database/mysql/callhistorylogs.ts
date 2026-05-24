import { ICallHistoryModel } from '../../interfaces/callHistory.interface'
import { ICallHistoryLog, TSelectCallHistoryLog } from '../../interfaces/callHistoryLogs.interface'
import { ICredit } from '../../interfaces/credit.interface'
import { ILead } from '../../interfaces/lead.interface'
import { InsertData, KnexFindParams } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class CallHistoryLogModel {
  private table = 'callhistoryLogs'

  get CallHistoryLogsKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async insert(data: InsertData<ICallHistoryLog>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOne(
    params: KnexFindParams<ICallHistoryLog, TSelectCallHistoryLog>,
  ): Promise<ICallHistoryLog> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach(element => {
          const { column, operator, value } = element

          if (operator) query.where(column, operator, value)
          else query.where(column, value)
        })
      } else {
        query.where(where)
      }
    }

    query.select(...select)

    if (whereIn) {
      whereIn.forEach(condition => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach(column => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query.first()
  }

  async find(
    params: KnexFindParams<ICallHistoryLog, TSelectCallHistoryLog>,
  ): Promise<ICallHistoryLog[]> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach(element => {
          const { column, operator, value } = element

          if (operator) query.where(column, operator, value)
          else query.where(column, value)
        })
      } else {
        query.where(where)
      }
    }

    query.select(...select)

    if (whereIn) {
      whereIn.forEach(condition => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach(column => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query
  }

  public async createCallHistoryLog(credit: ICredit, lead: ILead, amount: string): Promise<void> {
    const data: ICallHistoryLog = {
      customerID: credit.customerID,
      leadID: credit.leadID,
      callType: 'IVR',
      status: lead.status,
      appAmount: amount,
      noteli: lead.status,
      remark: 'Manual EMI Payment',
      callbackTime: new Date(Date.now()),
      calledBy: 1001,
    }

    await this.insert(data)
  }

  async insertv2(data: InsertData<ICallHistoryModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}

export const callHistoryLogsModel = new CallHistoryLogModel()
