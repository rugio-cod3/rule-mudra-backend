import { IOtherCharges } from '@/interfaces/other_charges.interface'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class OtherChargesModel {
  private table = 'other_charges'

  public async getOtherCharges(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IOtherCharges[] | null> {
    try {
      let db = getKnexInstance()
      let otherCharges = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (otherCharges == null || otherCharges.length == 0) {
        return null
      } else {
        return otherCharges // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside other_charges.ts getOtherCharges function',
        error,
      )
    }
  }
  public async countOtherCharges(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let otherCharges = await db(this.table).where(where).count()
      let count = otherCharges[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside other_charges.ts countOtherCharges function',
        error,
      )
    }
  }
  public async insert(
    emiID: number,
    creditID: number,
    amount: number,
    customerID: number,
    transectionID: number,
    discription: string,
    leadID:number,
    loanID:number,
    status: string
  ): Promise<number> {
    let db = getKnexInstance()

    let [insertedID] = await db
      .table(this.table)
      .insert({
        emiID,
        creditID,
        amount,
        customerID,
        transectionID,
        discription,
        leadID,
        loanID,
        status
      })
      .returning('id')
    return insertedID
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      let otherCharges = await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside other_charges.ts findOneAndUpdate function',
        error,
      )
    }
  }
}
