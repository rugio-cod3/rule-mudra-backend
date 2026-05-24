import { StatusCode } from '@/enums/common.enum'
import { apiLogService } from '@/services/api_req_res_log.service'
import { sanitizeData } from '@/utils/util'
import { NextFunction, Request, Response } from 'express'

export const saveApiLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const _res = res.json.bind(res)
    res.json = (response) => {
      //TODO: Exclude verify_otp and login
      if (req.url.includes(''))
        apiLogService.create({
          customerID: req.customer?.customerID
            ? String(req.customer?.customerID)
            : null,
          mobile: req.customer?.mobile ? String(req.customer?.mobile) : null,
          api_request: JSON.stringify(sanitizeData(req.body)),
          api_response: JSON.stringify(sanitizeData(response)),
          status: Object.values(StatusCode).includes(response.statusCode)
            ? '1'
            : '0',
          message: response.message,
          api_name: req.url,
        })
      return _res(response)
    }
    next()
  } catch (error) {
    next(error)
  }
}
