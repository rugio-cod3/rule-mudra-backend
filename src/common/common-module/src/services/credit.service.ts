import CreditModel from '../database/mysql/credit'
import EMIHelper from '../helpers/emi.helpers'
import { ICredit, TSelectCredit } from '../interfaces/credit.interface'
import { IEMIDoc } from '../interfaces/emidoc.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import { SelectFields, SortCriteria, UpdateQuery, WhereQuery } from '../types/model.types'
import { logger } from '../utils/logger'

class CreditService {
  private creditModel = new CreditModel()
  private emiHelper = new EMIHelper()

  // ! Remove this
  public async getCredit(filter: {}): Promise<{} | null> {
    try {
      let credit = await this.creditModel.getCreditDataByQuery(filter)
      return credit
    } catch (error) {
      logger.error('Error Inside credit.service.ts inside getCredit', error)
      return null
    }
  }
  public async createCredit(
    customerID: number,
    leadID: number,
    productID: number,
    foir: number,
    aqb: number,
    branch: string,
    loanAmount: number,
    roi: number,
    tenure: number,
    processingFee: number,
  ): Promise<{} | null> {
    try {
      let emiDoc = (await this.emiHelper.emiGenerator(loanAmount, roi, tenure)) as IEMIDoc
      if (!emiDoc) {
        return {
          success: false,
          message: 'Error In Generating EMI',
          statusCode: 400,
        }
      }
      // console.log(emiDoc);
      let principal = emiDoc.amount
      let intrest = emiDoc?.interest
      let amountToBeRepayed = emiDoc.repaymentAmount
      let paidAmount = 0
      let repaymentAmount = 0
      let totalEmis = emiDoc.totalEMIs
      let emiLeft = emiDoc.EMILeft

      let credit = await this.creditModel.insertCreditData(
        customerID,
        leadID,
        productID,
        foir,
        aqb,
        branch,
        roi,
        tenure,
        intrest,
        paidAmount,
        repaymentAmount,
        totalEmis,
        emiLeft,
        processingFee,
        principal,
        amountToBeRepayed,
      )
      // console.log(credit)
      return {
        success: true,
        message: 'Credit Created!',
        statusCode: 200,
        credit,
      }
    } catch (error) {
      logger.error('Error Inside product.service.ts inside createProduct', error)
      return null
    }
  }
  public async create(
    customerID: number,
    leadID: number,
    productID: number,
    foir: number,
    aqb: number,
    branch: string,
    roi: number,
    tenure: number,
    processingFee: number,
    principal: number,
    firstDueDate: Date,
    gst?: number,
  ): Promise<number | ICustomResponse> {
    try {
      let emiDoc = (await this.emiHelper.emiGenerator(
        principal,
        roi,
        tenure,
        firstDueDate,
      )) as IEMIDoc

      // console.log(emiDoc);
      let principalAmount = emiDoc.amount
      let intrest = emiDoc?.interest
      let amountToBeRepayed = emiDoc.repaymentAmount
      let paidAmount = 0
      let repaymentAmount = 0
      let totalEmis = emiDoc.totalEMIs
      let emiLeft = emiDoc.EMILeft
      let insertId = await this.creditModel.insert(
        customerID,
        leadID,
        productID,
        branch,
        foir,
        aqb,
        roi,
        tenure,
        intrest,
        repaymentAmount,
        totalEmis,
        emiLeft,
        processingFee,
        paidAmount,
        0, //no of penaltyEmis = 0
        'initiated', //status
        principalAmount,
        amountToBeRepayed,
        firstDueDate,
        gst,
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
  async updateOne(where: WhereQuery<ICredit>, update: UpdateQuery<ICredit>): Promise<number> {
    return await this.creditModel.findOneAndUpdate(where, update)
  }

  async findOne(
    where: WhereQuery<ICredit>,
    select: SelectFields<TSelectCredit> = ['*'],
    order?: SortCriteria<TSelectCredit>,
  ): Promise<ICredit> {
    return await this.creditModel.findOneCredit(where, select, order)
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ICredit[] | ICustomResponse> {
    try {
      let credit = await this.creditModel.getCreditData(where, order, select)
      if (credit == null || credit.length == 0) {
        return null
      } else {
        return credit // Return the first lead if found
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

export default CreditService
export const creditService = new CreditService()
