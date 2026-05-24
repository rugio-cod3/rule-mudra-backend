import { IUpdateSmsLogsPayload } from '@/interfaces/logs.interface'
import { logsservice } from '@/services/logs.service'
import ResponseService from '@/services/response.service'
import { NextFunction, Request, Response } from 'express'

class LogsController extends ResponseService {
  private readonly logsService = logsservice

  async updateSMSLogs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let { api_request, api_response, curl_error, mobile, req_url } =
        req.body as IUpdateSmsLogsPayload

      const payload: IUpdateSmsLogsPayload = {
        api_request,
        api_response,
        curl_error,
        mobile,
        req_url,
      }

      const { data, message, statusCode } =
        await this.logsService.updateSmsLogs(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
}

export default LogsController
