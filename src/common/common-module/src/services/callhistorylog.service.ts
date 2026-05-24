import { config } from '@/config.server'
import CallHistoryLogModel from '../database/mysql/callhistorylogs'
import { ICallHistoryModel } from '../interfaces/callHistory.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import { InsertData } from '../types/model.types'
import { logger } from '../utils/logger'
import { leadService } from './lead.service'

class CallHistoryLogService {
  private callHistoryLogMOdel = new CallHistoryLogModel()

  public async create(
    customerID: number,
    leadID: number,
    callType: string,
    status: string,
    appAmount: string,
    noteli: string,
    remark: string,
    callbackTime: Date,
    calledBy: number,
    createdDate: Date,
  ): Promise<number[] | ICustomResponse> {
    try {
      const data = {
        customerID,
        leadID,
        callType,
        status,
        appAmount,
        noteli,
        remark,
        callbackTime,
        calledBy,
        createdDate,
      }
      let insertId = await this.callHistoryLogMOdel.insert(data)
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

  async createV2(data: InsertData<ICallHistoryModel>): Promise<number[]> {
    return await this.callHistoryLogMOdel.insertv2(data)
  }

  public async insertCallHistoryLog(
    leadID: number,
    remark: string,
    userID = '',
    amount = '',
  ): Promise<number[] | ICustomResponse> {
    try {
      const lead = await leadService.findOne({ leadID })

      const data = {
        customerID: lead.customerID,
        leadID,
        callType: 'IVR',
        status: lead.status,
        noteli: lead.status,
        remark,
        callbackTime: new Date(),
        calledBy: userID ? userID : config.defaultUserId,
        createdDate: new Date(),
      }
      let insertId = await this.callHistoryLogMOdel.insert(data)
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
}

export default CallHistoryLogService
