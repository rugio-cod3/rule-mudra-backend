import { IRazorpayEMOrder } from '@/interfaces/razorpay_emOrder'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class RazorpayEMOrderModel {
  private table = 'razorpay_emOrder'

  public async getRazorpayEMOrder(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayEMOrder[] | null> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (razorpayEMOrder.length == 0) {
        return null
      } else {
        return razorpayEMOrder // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_emOrder.ts getRazorpayEMOrder function',
        error,
      )
    }
  }
  public async countRazorpayEMOrder(where: {}): Promise<number | null> {
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
        'Error Inside razorpay_emOrder.ts getRazorpayEMOrder function',
        error,
      )
    }
  }
  public async insert(
    emID: number,
    customerID: number,
    leadID: number,
    orderID: string,
    entity: string,
    amount: number,
    amount_paid: number,
    amount_due: number,
    currency: string,
    receipt: string,
    status: string,
    notes_key_1: string,
    tokenID: string,
    uid: number,
    remarks: string,
  ): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table)
        .insert({
          emID,
          customerID,
          leadID,
          orderID,
          razorpay_order_id: orderID,
          entity,
          amount,
          amount_paid,
          amount_due,
          currency,
          receipt,
          status,
          notes_key_1,
          tokenID,
          uid,
          remarks,
        })
        .returning('id')
      return insertedID
    } catch (error) {
      logger.error(
        'Error Inside razorpay_emOrder.ts getRazorpayEMOrder function',
        error,
      )
    }
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside razorpay_emOrder.ts getRazorpayEMOrder function',
        error,
      )
    }
  }
  public async getRazorpayEMOrderAsferaIVR(
    customerID: number,
    leadID: number,
  ): Promise<IRazorpayEMOrder[] | []> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(`${this.table} as eord`)
        .join('razorpay_mandate as mss', 'eord.emID', 'mss.id')
        .join('onlinepayment as one', 'eord.orderID', 'one.razorpayOrderId')
        .where({ 'eord.customerID': customerID, 'eord.leadID': leadID })
        // .select('one.*', 'mss.*', 'eord.*')
        .select([
          'mss.inv_id',
          'one.razorpayOrderId',
          'one.razorpayPaymentId',
          'one.toValue',
          'eord.createdDate',
          'one.paymentStatus',
        ])
      if (razorpayEMOrder.length == 0) {
        return []
      } else {
        return razorpayEMOrder // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_emOrder.ts getRazorpayEMOrderAsferaIVR function',
        error,
      )
    }
  }
}
