import { IOnlinePayment, TSelectOnlinePayment } from '@/interfaces/onlinepayment.interface'
import { InsertData, SelectFields, SortCriteria, UpdateQuery, WhereQuery } from '@/types/model.types';
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class OnlinePaymentModel {
  private table = 'onlinepayment'

  public async getOnlinePayment(
    where: Record<string, any>,
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IOnlinePayment[] | null> {
    try {
      const db = getKnexInstance();
      
      // Fetch data from the database
      const onlinePayments = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue);
  
      // Ensure `onlinePayments` is an array before checking length
      if (!Array.isArray(onlinePayments) || onlinePayments.length === 0) {
        return null;
      }
  
      return onlinePayments; // Return the array of online payments if found
    } catch (error) {
      logger.error(
        `Error in getOnlinePayment: ${JSON.stringify(where)}, order: ${JSON.stringify(order)}`,
        error,
      );
      return null; // Explicitly return null in case of error
    }
  }
  
  public async countOnlinePayment(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(this.table).where(where).count()
      let count = razorpayEMOrder[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside onlinepayment.ts countOnlinePayment function',
        error,
      )
    }
  }
  public async insert(data: {
    name: string
    email: string
    phone: bigint
    service: string
    typeProduct: string
    toValue: number
    message: string
    razorpayOrderId: string
    razorpayPaymentId: string
    paymentStatus: string
    makerstamp: Date
    updatestamp: Date
    status: string
    paymentType: string
    method: string
    leadID: number
  }): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table).insert(data).returning('id')
      return insertedID
    } catch (error) {
      logger.error('Error Inside onlinepayment.ts insert function', error)
    }
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      let onlinePayment = await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside onlinepayment.ts findOneAndUpdate function',
        error,
      )
    }
  }
  async create(data: InsertData<IOnlinePayment>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  public async findOneAndUpdateOnlinepayment(
    where: WhereQuery<IOnlinePayment>,
    update: UpdateQuery<IOnlinePayment>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async findOneOnlinePayment(
    where: WhereQuery<IOnlinePayment>,
    select: SelectFields<TSelectOnlinePayment> = ['*'],
    order?: SortCriteria<TSelectOnlinePayment>,
    whereNot?: WhereQuery<IOnlinePayment>,
  ): Promise<IOnlinePayment> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (whereNot) {
      query.whereNot(whereNot)
    }
    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }
}
