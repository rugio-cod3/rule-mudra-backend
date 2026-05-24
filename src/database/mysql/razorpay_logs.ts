import { IRazorpayLog } from '@/interfaces/razorpay_logs.interface'
import { InsertData } from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export default class RazorpayLogModel {
  private table = 'razorpay_logs'

  async insert(data: InsertData<IRazorpayLog>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}

export const razorPayLogsModel = new RazorpayLogModel()
