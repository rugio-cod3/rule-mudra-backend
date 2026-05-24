import { EmiAutoPaymentCronLog } from '@/database/mongo/model/EmiAutoPaymentCronLog'
import {
  IEmiAutoPaymentCronLog,
  IIndividualRecord,
} from '@/interfaces/emiautopaycronlog.interface'
class EmiAutoPaymentCronLogService {
  public async create(emiIDs: number[]): Promise<IEmiAutoPaymentCronLog> {
    try {
      let log = await EmiAutoPaymentCronLog.create({
        emiIDs,
      })
      return log
    } catch (error) {
      console.error(
        'Error In EmiAutoPaymentCronLogService in create function:',
        error,
      )
      return null
    }
  }
  public async updateOne(
    logID: string,
    update: IIndividualRecord,
  ): Promise<IEmiAutoPaymentCronLog> {
    try {
      let log = await EmiAutoPaymentCronLog.findById(logID)
      console.log(log)
      if (log) {
        log.individualRecord.push(update)
        await log.save()
      }
      return log
    } catch (error) {
      console.error(
        'Error In EmiAutoPaymentCronLogService in updateOne function:',
        error,
      )
      return null
    }
  }
}

export default EmiAutoPaymentCronLogService
