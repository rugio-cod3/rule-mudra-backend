import { config } from '@/config.server'
import EmiModel from '@/database/mysql/emi'
import { IEmi, TSelectEmi } from '@/interfaces/emi.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { SelectFields, SortCriteria, WhereQuery } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { differenceInCalendarDays } from 'date-fns'

class EmiService {
  private emiModel = new EmiModel()

  async findOne(
    where: WhereQuery<IEmi>,
    select: TSelectEmi[] | ['*'] = ['*'],
  ): Promise<IEmi> {
    return await this.emiModel.findOneEmi(where, select)
  }

  async find(
    where: WhereQuery<IEmi>,
    order: SortCriteria<TSelectEmi>,
    select: SelectFields<TSelectEmi>,
  ): Promise<IEmi[]> {
    return await this.emiModel.findAll(where, order, select)
  }

  public async createEMI(
    creditID: number,
    customerID: number,
    leadID: number,
    productID: number,
    principal: number,
    interest: number,
    openingBalance: number,
    closingBalance: number,
    emiNUmber: number,
    firstDueDate: Date,
  ): Promise<{}> {
    try {
      //let dueDate: Date
      // let daysInBPI: number = 0
      // let brokenPeriodIntrest = 0
      // if (emiNUmber == 1) {
      //   dueDate = new Date(firstDueDate)
      // } else {
      //   let lastEmi = await this.emiModel.findAll(
      //     { productID },
      //     [{ column: 'emiID', order: 'desc' }],
      //     ['dueDate'],
      //   )
      //   dueDate = new Date(lastEmi[0].dueDate)
      //   dueDate.setMonth(dueDate.getMonth() + 1)
      // }
      // console.log(documentToBeInserted)
      // if (emiNUmber == 1 && daysInBPI > 0) {
      //   brokenPeriodIntrest = openingBalance * (roi / 100) * (daysInBPI / 365)
      //   interest += brokenPeriodIntrest
      // }
      await this.emiModel.insertEMI(
        creditID,
        customerID,
        leadID,
        productID,
        principal,
        interest,
        openingBalance,
        closingBalance,
        firstDueDate,
      )
      return { success: true, message: 'EMI Created !', statusCode: 200 }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Something Went Wrong: Create EMI Function',
        statusCode: 500,
      }
    }
  }

  async updateOne(
    where: WhereQuery<IEmi>,
    update: Partial<IEmi>,
  ): Promise<number> {
    return await this.emiModel.findOneAndUpdate(where, update)
  }

  public async updateMany(
    where: [{ key: string; valueArray: any[] }],
    update: IEmi,
  ): Promise<boolean | ICustomResponse> {
    try {
      let result = await this.emiModel.findAndUpdate(where, update)
      return result
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
      let razorpay_emOrder_count = await this.emiModel.countEMI(where)
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
  public async getEmisForFetchPaymentCronJob(): Promise<
    IEmi[] | ICustomResponse
  > {
    try {
      let emi = await this.emiModel.getEmisQueryForFetchPaymentCronJob()
      if (emi == null || emi.length == 0) {
        return null
      } else {
        return emi // Return the first lead if found
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
  /*
  public async findForManualPayment(
    creditID: number,
  ): Promise<IEmi[] | ICustomResponse> {
    try {
      let emi = await this.emiModel.getEmisQueryForManualPayment(creditID)
      if (emi == null || emi.length == 0) {
        return null
      } else {
        return emi // Return the first lead if found
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
  */

  public async findForSinglePayment(
    creditID: number,
  ): Promise<IEmi[] | ICustomResponse> {
    try {
      const emi = await this.emiModel.getEmisQueryForManualPayment(creditID);

      if (emi == null || emi.length === 0) {
        return {
          success: false,
          message: 'No EMIs found',
          statusCode: 404,
        } as ICustomResponse;
      } else {
        return emi; // Return the EMIs if found
      }
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse;
    }
  }

 public calculatePenalty = (emiAmount: number, overdueDays: number, roi: number): number => {

    const perDay = (roi / 365) + 0.1;
    const result = (emiAmount * perDay)/100 * overdueDays;
    const fixResult = this.roundToTwo(result);
    return fixResult;
  }
  public roundToTwo = (num:number) => Math.ceil(num); 

  public bounceCharge = (): number => {
    const fixedBounce = +config.dpdPenalty;
    const gst = Math.round(fixedBounce * (+config.gst / 100));
    const totalBounce = fixedBounce + gst;

    return totalBounce;
  }




  public async findForPreClosure(
    creditID: number,
  ): Promise<IEmi[] | ICustomResponse> {
    try {
      let emi = await this.emiModel.getEmisQueryForPreClosure(creditID)
      if (emi == null || emi.length == 0) {
        return null
      } else {
        return emi // Return the first lead if found
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

  async findLastEmi(
    where: WhereQuery<IEmi>,
    select: TSelectEmi[] | ['*'] = ['*'],
  ): Promise<IEmi> {
    return await this.emiModel.findLastEmi(where, select)
  }

}

export default EmiService
export const emiService = new EmiService()

