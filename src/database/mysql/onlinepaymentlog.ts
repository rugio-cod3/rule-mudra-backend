import { IOnlinePaymentLog, TSelectOnlinePaymentLog } from '@/interfaces/onlinepaymentlog.interface'
import { InsertData, SortCriteria } from '@/types/model.types';
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class OnlinePaymentLogModel {
  private table = 'onlinePaymentlog'

  public async getOnlinePaymentLog(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IOnlinePaymentLog[] | null> {
    try {
      let db = getKnexInstance()
      let onlinePaymentLog = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (onlinePaymentLog == null || onlinePaymentLog.length == 0) {
        return null
      } else {
        return onlinePaymentLog // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside onlinepaymentlog.ts getOnlinePaymentLog function',
        error,
      )
    }
  }
  public async countOnlinePaymentLog(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let onlinePaymentLog = await db(this.table).where(where).count()
      let count = onlinePaymentLog[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside onlinepaymentlog.ts countOnlinePaymentLog function',
        error,
      )
    }
  }
  public async insert(
    pID: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    paymentStatus: string,
    payload:string
  ): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table)
        .insert({
          pID,
          razorpayOrderId,
          razorpayPaymentId,
          paymentStatus,
          payload,
        })
        .returning('id')
      return insertedID
    } catch (error) {
      logger.error('Error Inside onlinepaymentlog.ts insert function', error)
    }
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      let onlinePaymentLog = await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside onlinepaymentlog.ts findOneAndUpdate function',
        error,
      )
    }
  }
  async create(data: InsertData<IOnlinePaymentLog>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOne(
    where: Partial<IOnlinePaymentLog>,
    select: TSelectOnlinePaymentLog[] | ['*'] = ['*'],
    order?: SortCriteria<TSelectOnlinePaymentLog>,
  ): Promise<IOnlinePaymentLog> {
    const db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }
}
