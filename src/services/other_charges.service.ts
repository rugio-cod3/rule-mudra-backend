import OtherChargesModel from '@/database/mysql/other_charges'
import { IOtherCharges } from '@/interfaces/other_charges.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class OtherChargesService {
  private otherChargesModel = new OtherChargesModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IOtherCharges | ICustomResponse> {
    try {
      let otherCharges = await this.otherChargesModel.getOtherCharges(
        where,
        order,
        select,
      )
      if (otherCharges == null || otherCharges.length == 0) {
        return null
      } else {
        return otherCharges[0] // Return the first lead if found
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
  ): Promise<IOtherCharges[] | ICustomResponse> {
    try {
      let otherCharges = await this.otherChargesModel.getOtherCharges(
        where,
        order,
        select,
      )
      if (otherCharges == null || otherCharges.length == 0) {
        return null
      } else {
        return otherCharges // Return the first lead if found
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
      let otherChargescount = await this.otherChargesModel.countOtherCharges(
        where,
      )
      if (otherChargescount == null) {
        return 0
      } else {
        return otherChargescount // Return the first lead if found
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
    emiID: number,
    creditID: number,
    amount: number,
    customerID: number,
    transectionID: number,
    discription: string,
    leadID:number,
    loanID:number,
    status:string = 'pending'
  ): Promise<number> {
    let insertId = await this.otherChargesModel.insert(
      emiID,
      creditID,
      amount,
      customerID,
      transectionID,
      discription,
      leadID,
      loanID,
      status
    )
    return insertId
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.otherChargesModel.findOneAndUpdate(where, update)
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

export default OtherChargesService
