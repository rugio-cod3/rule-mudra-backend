import {
  IExperianBureauDetailsPayload,
  IExperianCrmDetailsPayload,
  IExperianUserDetailsPayload,
} from '@/common/common-module/src/interfaces/common.interface'
import {
  ICheckAndApplyTemporaryWaiverPayday,
  ICustomerDetailsPayload,
  IGetBankDetailsPayload,
  IivrMenuOnePayload,
  IivrMenuTwoPayload,
  ILeadStatus,
  ILoanVerification,
} from '@/interfaces/common.interface'
import Joi, { ObjectSchema } from 'joi'

export const ivrMenuOneSchema: ObjectSchema<IivrMenuOnePayload> = Joi.object<IivrMenuOnePayload>({
  mobile: Joi.number().required(),
}).unknown(false)

export const ivrMenuTwoSchema: ObjectSchema<IivrMenuTwoPayload> = Joi.object<IivrMenuTwoPayload>({
  mobile: Joi.number().required().options({ convert: false }),
  press: Joi.number().required().options({ convert: false }),
}).unknown(false)

export const customerDetailsSchema: ObjectSchema<ICustomerDetailsPayload> =
  Joi.object<ICustomerDetailsPayload>({
    mobile: Joi.number().required(),
  }).unknown(false)

export const getBankDetailsSchema: ObjectSchema<IGetBankDetailsPayload> =
  Joi.object<IGetBankDetailsPayload>({
    ifsc: Joi.string().required(),
  }).unknown(false)

export const loanVerificationSchema: ObjectSchema<ILoanVerification> =
  Joi.object<ILoanVerification>({
    mobile: Joi.number().required(),
    loanlastfourdigit: Joi.number().integer().min(1000).max(9999).required().messages({
      'number.min': 'Last four digits must be exactly 4 digits',
      'number.max': 'Last four digits must be exactly 4 digits',
    }),
  }).unknown(false)

export const LeadStatusSchema: ObjectSchema<ILeadStatus> = Joi.object<ILeadStatus>({
  mobile: Joi.number().required(),
}).unknown(false)
export const experianUserDetailsSchema: ObjectSchema<IExperianUserDetailsPayload> =
  Joi.object<IExperianUserDetailsPayload>({
    customerID: Joi.number().required(),
    leadID: Joi.number().required(),
  }).unknown(false)

export const experianCrmDetailsSchema: ObjectSchema<IExperianCrmDetailsPayload> =
  Joi.object<IExperianCrmDetailsPayload>({
    leadID: Joi.number().required(),
  }).unknown(false)

export const experianBureauDetailsSchema: ObjectSchema<IExperianBureauDetailsPayload> =
  Joi.object<IExperianBureauDetailsPayload>({
    user_id: Joi.number().required(),
    loan_id: Joi.number().required(),
  })

export const checkAndApplyWaiverSchema: ObjectSchema<ICheckAndApplyTemporaryWaiverPayday> =
  Joi.object<ICheckAndApplyTemporaryWaiverPayday>({
    lead: Joi.object({
      ipc: Joi.number().required(),
      productID: Joi.number().required(),
      customerID: Joi.number().required(),
      leadID: Joi.number().required(),
    }).required(),
    remainingAmount: Joi.number().required(),
    payingAmount: Joi.number().required(),
    waiverReference: Joi.string().required(),
  })
