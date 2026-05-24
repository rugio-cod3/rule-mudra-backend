import Joi, { ObjectSchema } from 'joi'
import { ICallDescription, ICallDisposition } from '../interfaces/callDisposition.interface'
import { IProjectionReportPayload, IUploadedFile } from '../interfaces/crm.interface'

export interface IFileUrlPayloadProjection {
  image: IUploadedFile
  type?: 'xlsx' | 'csv'
  userId?: number
  name?: string
}
const csvFileValidation = Joi.object({
  mimetype: Joi.string()
    .pattern(/\.(xlsx|csv)$/i)
    .required(),
  size: Joi.number()
    .max(100 * 1024 * 1024) // Limit 100MB
    .messages({
      'number.max': 'The CSV file size must be less than or equal to 100MB.',
    }),
}).unknown(true)

export const FileUploadSchema: ObjectSchema<IFileUrlPayloadProjection> =
  Joi.object<IFileUrlPayloadProjection>({
    image: csvFileValidation,
    type: Joi.string().valid('xlsx', 'csv').required(),
  }).unknown(false)

export const callMonitoringSchema: ObjectSchema<ICallDisposition> = Joi.object<ICallDisposition>({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
}).unknown(false)
export const callDescriptionSchema: ObjectSchema<ICallDescription> = Joi.object<ICallDescription>({
  callDate: Joi.date().required(),
  repayDate: Joi.date().required(),
}).unknown(false)
export const ProjectionReportPayloadSchema: ObjectSchema<IProjectionReportPayload> =
  Joi.object<IProjectionReportPayload>({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }).unknown(false)
