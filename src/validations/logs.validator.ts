import { IUpdateSmsLogsPayload } from '@/interfaces/logs.interface'
import Joi, { ObjectSchema } from 'joi'

export const updateSmsLogsSchema: ObjectSchema<IUpdateSmsLogsPayload> =
  Joi.object<IUpdateSmsLogsPayload>({
    mobile: Joi.number().required(),
    req_url: Joi.string().required(),
    api_request: Joi.object().required(),
    api_response: Joi.object().required(),
    curl_error: Joi.string().required(),
  }).unknown(false)
