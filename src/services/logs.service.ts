import { InternalServerError } from '@/errors'
import { IUpdateSmsLogsPayload } from '@/interfaces/logs.interface'
import { IServiceResponse } from '@/interfaces/service.interface'
import KaleyraLogService from './kaleyralogs.service'
import ResponseService from './response.service'

export class LogsService extends ResponseService {
  private readonly kaleyraLogService = new KaleyraLogService()

  async updateSmsLogs(
    payload: IUpdateSmsLogsPayload,
  ): Promise<IServiceResponse> {
    const { mobile, api_request, api_response, curl_error, req_url } = payload

    let log = await this.kaleyraLogService.create(
      String(mobile),
      req_url,
      JSON.stringify(api_request),
      JSON.stringify(api_response),
      curl_error,
    )
    if (!log)
      throw new InternalServerError("Something Went Wrong In Log Update'")

    return this.serviceResponse(200, {}, 'Log Update')
  }
}

export const logsservice = new LogsService()
