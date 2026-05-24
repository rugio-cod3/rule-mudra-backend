import { RazorpayWebhookLogsModel } from '@/database/mongo/model/RazorpayWeebhookLogs'
import { IRazorpayWebhookLogs } from '@/interfaces/razorpaywebhooklogs.interface'
class RazorpayWebhookLogsService {
  public async create(
    subscriptionId: string,
    response: object,
  ): Promise<IRazorpayWebhookLogs> {
    try {
      let log = await RazorpayWebhookLogsModel.create({
        subscriptionId,
        response: JSON.stringify(response),
      })
      return log
    } catch (error) {
      console.error(
        'Error In RazorpayWebhookLogsLogService in create function:',
        error,
      )
      return null
    }
  }
}

export default RazorpayWebhookLogsService
