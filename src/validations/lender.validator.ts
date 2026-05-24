import { ILenderCreds ,IGetLenderCreds, IUpdateLenderCreds } from '@/interfaces/lender_creds.interface'
import Joi, { ObjectSchema } from 'joi'

export const addCredentialsSchema: ObjectSchema<ILenderCreds> =
  Joi.object<ILenderCreds>({
    lenderID: Joi.number().required(),
    cred_name: Joi.string().required(),
    credentials: Joi.object().required(),
    status:Joi.number().required(),
  }).unknown(false)


  export const updateCredentialsSchema: ObjectSchema<IUpdateLenderCreds> =
  Joi.object<IUpdateLenderCreds>({
    lenderID: Joi.number().required(),
    cred_name: Joi.string().required(),
    credentials: Joi.object().required(),
  }).unknown(false)

  export const getCredentialsSchema: ObjectSchema<IGetLenderCreds> =
  Joi.object<IGetLenderCreds>({
    leadID: Joi.number().required(),
  }).unknown(false)