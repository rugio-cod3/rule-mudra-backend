import { IAddCollectionCrmPayload, IAllCollectionPayload } from '@/interfaces/collectionCrm.interface'
import Joi, { ObjectSchema } from 'joi'

export const addCollectionSchema: ObjectSchema<IAddCollectionCrmPayload> =
  Joi.object<IAddCollectionCrmPayload>({
    customerID: Joi.number().required(),
    leadID: Joi.number().required(),
    userID: Joi.number().required(),
    status: Joi.string().required(),
    method: Joi.optional().required(),
    orderId: Joi.string().required(),
    amount: Joi.number().required(),
    gateway: Joi.number().required(),
    transactionDate: Joi.date().required(),
    remarks: Joi.optional().required(),
    waiver: Joi.optional().required(),
    payment_transaction_status: Joi.optional().required(),
    discount_type:  Joi.optional().required(),
  }).unknown(false)

export const allCollectionSchema: ObjectSchema<IAllCollectionPayload> =
  Joi.object<IAllCollectionPayload>({
    customerID: Joi.number().required(),
    leadID: Joi.number().required(),
  }).unknown(false)
