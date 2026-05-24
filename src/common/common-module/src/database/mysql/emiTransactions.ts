import { getKnexInstance } from '@/utils/mysql'
import { logger } from '../../utils/logger';
import { IEMITransaction } from '../../interfaces/emiTransaction.interface';

export default class EMITransactions {
  private table = 'emi_transactions'

  public async getTransections(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IEMITransaction[] | null> {
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
      logger.error('Error Inside transections.ts getTransections function', error)
    }
  }

  public async insert(
    transaction_id: number,
    order_id: string,
    emi_id: number,
    interest: number,
    principal: number,
    penalty: number,
    dpd_amount: number,
    transaction_date: Date,
    lead_id: number,
    emi_status: string,
  ): Promise<number> {
    const db = getKnexInstance()
    let [insertedID] = await db
      .table(this.table)
      .insert({
        transaction_id,
        order_id,
        emi_id,
        interest,
        principal,
        penalty,
        dpd_amount,
        transaction_date,
        lead_id,
        emi_status,
      })
      .returning('et_id')

    return insertedID
  }
}

export const emiTransactionModel = new EMITransactions()
