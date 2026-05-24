import { ITransection, IWhereClause } from '@/interfaces/transections.interface'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class TransectionModel {
  private table = 'transactions'

  public async getTransections(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ITransection[] | null> {
    try {
      let db = getKnexInstance()
      let transections = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (transections == null || transections.length == 0) {
        return null
      } else {
        return transections // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside transections.ts getTransections function',
        error,
      )
    }
  }

  public async getSumOfTransections(
    emiId: number
  ): Promise<number> {
    try {
      let db = getKnexInstance();

      let sumResult = await db(this.table)
        .where({ emiId: emiId, type: 'collection' })
        .sum({ total: 'amount' });

      if (sumResult == null || sumResult.length == 0) {
        return 0;
      } else {
        return sumResult[0].total || 0;
      }
    } catch (error) {
      logger.error('Error Inside transections.ts getSumTransections function', error);
      return 0;
    }
  }
  public async countTransections(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let transections = await db(this.table).where(where).count()
      let count = transections[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside transections.ts countTransections function',
        error,
      )
    }
  }
  public async insert(
    customerID: number,
    leadID: number,
    loanNo: string,
    status: number,
    type: string,
    mode: string,
    referenceNo: string,
    orderId: string,
    deleted: number,
    gateway: string,
    createdBy: number,
    updatedBy: number,
    amount: number,
    emiID: number,
    transactionDate: Date,
    remarks: string,
    payment_transaction_status: string,
    waiver: number,
    discount_type: string,
    lenderID: number,
  ): Promise<number> {
    const db = getKnexInstance()
    let [insertedID] = await db
      .table(this.table)
      .insert({
        customerID,
        leadID,
        loanNo,
        status,
        type,
        mode,
        referenceNo,
        orderId,
        deleted,
        gateway,
        createdBy,
        updatedBy,
        amount,
        emiID,
        transactionDate,
        remarks,
        payment_transaction_status,
        waiver,
        discount_type,
        lenderID
      })
      .returning('id')

    return insertedID
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside transections.ts findOneAndUpdate function',
        error,
      )
    }
  }

  public async findAndUpdate(
    where: [{ key: string; valueArray: any[] }],
    update: {},
  ): Promise<boolean | null> {
    try {
      let db = getKnexInstance()
      let transectionIds = []
      for (let obj of where) {
        let transections = await db(this.table)
          .whereIn(obj.key, obj.valueArray)
          .select('id')
        if (transections) {
          for (let t of transections) {
            transectionIds.push(t.id)
          }
        }
      }
      let transectionSet = new Set(transectionIds)
      let transectionArray = Array.from(transectionSet)
      let emi = await db(this.table)
        .whereIn('id', transectionArray)
        .update(update)
      return true
    } catch (error) {
      logger.error('Error Inside transection.ts findAndUpdate function', error)
      return false
    }
  }
  public async getUserTransections(
    where: IWhereClause,
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ITransection[] | null> {
    try {
      let db = getKnexInstance()
      let query = db(this.table)
        .where({
          customerID: where.customerID
        })
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)

      if (where.type && where.type.$in) {
        query = query.whereIn('type', where.type.$in)
      }

      let transections = await query

      if (transections == null || transections.length == 0) {
        return null
      } else {
        return transections
      }
    } catch (error) {
      logger.error(
        'Error Inside transections.ts getUserTransections function',
        error,
      )
      return null
    }
  }
}
