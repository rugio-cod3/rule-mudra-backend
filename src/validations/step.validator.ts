import Joi, { ObjectSchema } from 'joi'

export const nextStepSchema: ObjectSchema = Joi.object({
  accountID: Joi.number().optional().default(null).allow(null).allow(''),
  leadID: Joi.number().optional().allow(null),
  plateform: Joi.string().optional().allow(null),
}).unknown(false)
