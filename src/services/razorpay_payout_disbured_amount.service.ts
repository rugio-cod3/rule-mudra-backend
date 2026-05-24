import RazorpayPayoutDisbursedAmountModel from '@/database/mysql/razorpay_payout_disbured_amount'
import { IRazorpayPayoutDisbursedAmount } from '@/interfaces/razorpay_payout_disbured_amount.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class RazorpayPayoutDisbursedAmountService {
  private razorpayPayoutDisbursedAmountModel =
    new RazorpayPayoutDisbursedAmountModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IRazorpayPayoutDisbursedAmount | ICustomResponse> {
    try {
      let disbursal =
        await this.razorpayPayoutDisbursedAmountModel.getSingleDisbursalData(
          where,
          order,
          select,
        )
      if (disbursal == null) {
        return null
      } else {
        return disbursal // Return the first lead if found
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
  ): Promise<IRazorpayPayoutDisbursedAmount[] | ICustomResponse> {
    try {
      let disbursal =
        await this.razorpayPayoutDisbursedAmountModel.getDisbursalDatas(
          where,
          order,
          select,
        )
      if (disbursal == null || disbursal?.length == 0) {
        return null
      } else {
        return disbursal // Return the first lead if found
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
  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.razorpayPayoutDisbursedAmountModel.findOneAndUpdate(
        where,
        update,
      )
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
}

export default RazorpayPayoutDisbursedAmountService
