import {
  IAccountDetailsPayload,
  IAnswerQuestionPayload,
  IfecthOrderDetailsPayload,
  IGetPaymentStatusPayload,
  IReportSummaryPayload,
  IUpdateJourneysPayload,
  IViewImpactPayload,
} from '@/interfaces/cibil.interface'
import Joi, { ObjectSchema } from 'joi'

export const updateJourneysSchema: ObjectSchema<IUpdateJourneysPayload> =
  Joi.object<IUpdateJourneysPayload>({
    step: Joi.number().required(),
  }).unknown(false)

export const getPaymentStatusSchema: ObjectSchema<IGetPaymentStatusPayload> =
  Joi.object<IGetPaymentStatusPayload>({
    subscriptionid: Joi.string().required(),
  }).unknown(false)

export const answerQuestionSchema: ObjectSchema<IAnswerQuestionPayload> =
  Joi.object<IAnswerQuestionPayload>({
    stgOneHitId: Joi.number().required(),
    stgTwoHitId: Joi.number().required(),
    questionId: Joi.number().required(),
    answer1: Joi.string().required(),
    answer2: Joi.string().required(),
  }).unknown(false)

export const reportSummarySchema: ObjectSchema<IReportSummaryPayload> =
  Joi.object<IReportSummaryPayload>({
    provider: Joi.string().required(),
  }).unknown(false)
  
  export const accountDetailsSchema: ObjectSchema<IAccountDetailsPayload> =
  Joi.object<IAccountDetailsPayload>({
    accountId: Joi.number().required(),
  }).unknown(false)
  export const viewImpactSchema: ObjectSchema<IViewImpactPayload> =
  Joi.object<IViewImpactPayload>({
    impactId: Joi.number().required(),
  }).unknown(false)
  export const fetchOrderDetailsSchema: ObjectSchema<IfecthOrderDetailsPayload> =
  Joi.object<IfecthOrderDetailsPayload>({
    customerId: Joi.number().required(),
  }).unknown(false)
