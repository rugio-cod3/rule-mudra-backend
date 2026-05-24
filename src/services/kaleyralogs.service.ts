import { KaleyraLogs } from '@/database/mongo/model/KaleyraLogs'
import IKalyeraLog from '@/interfaces/kaleyralogs.interface'
class KaleyraLogService {
  public async create(
    mobile: string,
    req_url: string,
    api_request: string,
    api_response: string,
    curl_error: string,
  ): Promise<IKalyeraLog> {
    try {
      let kalyeraLog = await KaleyraLogs.create({
        mobile,
        req_url,
        api_request,
        api_response,
        curl_error,
      })
      return kalyeraLog
    } catch (error) {
      console.error('Error In KaleyraLogService in create function:', error)
      return null
    }
  }
}

export default KaleyraLogService
