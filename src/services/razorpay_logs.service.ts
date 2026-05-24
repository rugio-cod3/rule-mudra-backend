import RazorpayLogModel from '@/database/mysql/razorpay_logs'
import { IRazorpayLog } from '@/interfaces/razorpay_logs.interface'
import { InsertData } from '@/types/model.types'

class RazorpayLogService {
  private razorpayLogModel = new RazorpayLogModel()

  public async create(data: InsertData<IRazorpayLog>): Promise<number[]> {
    let razorpayLog = await this.razorpayLogModel.insert(data)
    return razorpayLog
  }
}

export default RazorpayLogService
