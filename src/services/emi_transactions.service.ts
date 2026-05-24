import config from '@/config/default'     
import EMITransactionModel from '@/database/mysql/emi_transactions'
import { logger } from '@/utils/logger'  
import ResponseService from './response.service'
import { ICustomResponse } from '@/interfaces/response.interface'
import { IEMITransaction } from '@/interfaces/emi_transections.interface'

class EMITransactionsService extends ResponseService {

  private readonly EMITranModel = new EMITransactionModel() 

  constructor() {
    super()
  }

   

  async create(data: IEMITransaction): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.EMITranModel.insert(
        data.transaction_id,
        data.order_id,
        data.emi_id,
        data.interest,
        data.principal,
        data.penalty,
        data.dpd_amount,
        data.transaction_date,
        data.lead_id,
        data.emi_status,
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
 
}

export default EMITransactionsService

export const EMITransactions = new EMITransactionsService()
