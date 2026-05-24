import RazorpayMandateModel from '@/database/mysql/razorpay_mandate'
import { IRazorpayMandate } from '@/interfaces/razorpay_mandate.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class RazorpayMendateService {
  private razorpayMandateModel = new RazorpayMandateModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayMandate | ICustomResponse> {
    try {
      let razorpay_mendate = await this.razorpayMandateModel.getRazorpayMandate(
        where,
        order,
        select,
      )
      if (razorpay_mendate == null || razorpay_mendate?.length == 0) {
        return null
      } else {
        return razorpay_mendate[0] // Return the first lead if found
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
  ): Promise<IRazorpayMandate[] | ICustomResponse> {
    try {
      let razorpay_mendate = await this.razorpayMandateModel.getRazorpayMandate(
        where,
        order,
        select,
      )
      if (razorpay_mendate.length == 0) {
        return null
      } else {
        return razorpay_mendate // Return the first lead if found
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

  public async findeMendateChargeDetailsByRazorpayForAsferaIVR(
    customerID: number,
    leadID: number,
  ): Promise<IRazorpayMandate[] | ICustomResponse> {
    try {
      let razorpay_mendate =
        await this.razorpayMandateModel.getRazorpayMandateForAsferaIVR(
          customerID,
          leadID,
        )
      if (razorpay_mendate.length == 0) {
        return []
      } else {
        return razorpay_mendate // Return the first lead if found
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

export default RazorpayMendateService
