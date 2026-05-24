import RazorpayEMOrderModel from '@/database/mysql/razorpay_emOrder'
import { IRazorpayEMOrder } from '@/interfaces/razorpay_emOrder'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class RazorpayEMOrderService {
  private razorpayEMOrder = new RazorpayEMOrderModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayEMOrder | ICustomResponse> {
    try {
      let razorpay_emOrder = await this.razorpayEMOrder.getRazorpayEMOrder(
        where,
        order,
        select,
      )
      if (razorpay_emOrder.length == 0) {
        return null
      } else {
        return razorpay_emOrder[0] // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayEMOrder[] | ICustomResponse> {
    try {
      let razorpay_emOrder = await this.razorpayEMOrder.getRazorpayEMOrder(
        where,
        order,
        select,
      )
      if (razorpay_emOrder.length == 0) {
        return null
      } else {
        return razorpay_emOrder // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let razorpay_emOrder_count =
        await this.razorpayEMOrder.countRazorpayEMOrder(where)
      if (razorpay_emOrder_count == null) {
        return 0
      } else {
        return razorpay_emOrder_count // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async create(
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
  ): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.razorpayEMOrder.insert(
        emID,
        customerID,
        leadID,
        orderID,
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
      )
      return insertId
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.razorpayEMOrder.findOneAndUpdate(where, update)
      return true
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async findeMendateChargeDetailsForAsferaIVR(
    customerID: number,
    leadID: number,
  ): Promise<IRazorpayEMOrder[] | ICustomResponse> {
    try {
      let razorpay_emOrder =
        await this.razorpayEMOrder.getRazorpayEMOrderAsferaIVR(
          customerID,
          leadID,
        )
      if (razorpay_emOrder.length == 0) {
        return []
      } else {
        return razorpay_emOrder // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }
}

export default RazorpayEMOrderService
