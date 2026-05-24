import { IgenerateSoaPayload, ISanctionDataPayload } from '@/interfaces/soa.interface'
import Joi, { ObjectSchema } from 'joi'

export const soaPdfSchema: ObjectSchema<IgenerateSoaPayload> =
  Joi.object<IgenerateSoaPayload>({
    leadID: Joi.number().required(),
    data: Joi.object().required(),
  }).unknown(false)

  export const sanctionDataSchema: ObjectSchema<ISanctionDataPayload> =
  Joi.object<ISanctionDataPayload>({
    leadID: Joi.number().required(),
    customerID: Joi.number().required(),
  }).unknown(false)
