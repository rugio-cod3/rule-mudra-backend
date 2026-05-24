import {
  IApplyPenaltyPayload,
  ICreditDetailsPayload,
  IEmiCalculatorPayload,
  IFileUploadPayload,
  IFileUrlPayload,
  IGenerateEmiPayload,
  IGetAmountToBeDisbursedPayload,
  IGetDocsRequirementsPayload,
  IGetEmiLoanDetailsPayload,
  ILeadUpdatePayload,
  IMandatePayload,
  IPauPaymentVerification,
  IpaydayToEmiConversionPayload,
  IPaymentVerification,
  IUpdatePaymentPayload,
} from '@/interfaces/crm.interface'
import Joi, { ObjectSchema } from 'joi'

export const leadUpdateSchema: ObjectSchema<ILeadUpdatePayload> =
  Joi.object<ILeadUpdatePayload>({
    leadID: Joi.number().required(),
  }).unknown(false)

export const emiCalculatorSchema: ObjectSchema<IEmiCalculatorPayload> =
  Joi.object<IEmiCalculatorPayload>({
    loanAmount: Joi.number().required().options({ convert: true }),
    roi: Joi.number().required().options({ convert: true }),
    tenure: Joi.number().required().options({ convert: true }),
    firstRepayDate: Joi.number().optional(),
  }).unknown(false)

export const creditDetailsPayload: ObjectSchema<ICreditDetailsPayload> =
  Joi.object<ICreditDetailsPayload>({
    adminFee: Joi.number().required(),
    customer_id: Joi.number().required(),
    lead_id: Joi.number().required(),
    foir: Joi.number().optional(),
    aqb: Joi.number().optional(),
    branch: Joi.string().required(),
    loanAmtApproved: Joi.number().required(),
    roi: Joi.number().required(),
    tenure: Joi.number().required(),
    firstDueDate: Joi.number().required(),
    gst: Joi.number().required(),
  }).unknown(false)

export const getAmountToBeDisbursedPayload: ObjectSchema<IGetAmountToBeDisbursedPayload> =
  Joi.object<IGetAmountToBeDisbursedPayload>({
    creditID: Joi.number().required().options({ convert: true }),
  }).unknown(false)

export const generateEMISchema: ObjectSchema<IGenerateEmiPayload> =
  Joi.object<IGenerateEmiPayload>({
    creditID: Joi.number().required(),
    loanNo: Joi.string().required(),
    mode: Joi.string().required(),
    referanceId: Joi.string().required(),
    order_id: Joi.string().required(),
    gateway: Joi.string().required(),
    createdBy: Joi.number().required(),
    updatedBy: Joi.number().required(),
  }).unknown(false)

export const updatePaymentSchema: ObjectSchema<IUpdatePaymentPayload> =
  Joi.object<IUpdatePaymentPayload>({
    creditID: Joi.number().required(),
    amount: Joi.number().required(),
    gateway: Joi.string().required(),
    method: Joi.string().required(),
  }).unknown(false)

export const applyPenaltyPayloadSchema: ObjectSchema<IApplyPenaltyPayload> =
  Joi.object<IApplyPenaltyPayload>({
    emiID: Joi.number().required(),
    amount: Joi.number().required(),
  }).unknown(false)

export const getDocsRequirementsSchema: ObjectSchema<IGetDocsRequirementsPayload> =
  Joi.object<IGetDocsRequirementsPayload>({
    loanAmount: Joi.number().required().options({ convert: true }),
    roi: Joi.number().required().options({ convert: true }),
    tenure: Joi.number().required().options({ convert: true }),
    creditId: Joi.number().required().options({ convert: true }),
  }).unknown(false)

export const getEmiLoanDetailsSchema: ObjectSchema<IGetEmiLoanDetailsPayload> =
  Joi.object<IGetEmiLoanDetailsPayload>({
    leadID: Joi.number().required().options({ convert: true }),
    customerID: Joi.number().required().options({ convert: true }),
  }).unknown(false)
export const paydayToEmiConversionSchema: ObjectSchema<IpaydayToEmiConversionPayload> =
  Joi.object<IpaydayToEmiConversionPayload>({
    productId: Joi.number().required(),
    adminFee: Joi.number().optional(),
    customer_id: Joi.number().required(),
    lead_id: Joi.number().required(),
    foir: Joi.number().optional(),
    aqb: Joi.number().optional(),
    branch: Joi.string().optional(),
    loanAmtApproved: Joi.number().required(),
    roi: Joi.number().required(),
    tenure: Joi.number().required(),
    firstDueDate: Joi.number().required(),
    gst: Joi.number().optional(),
    userID: Joi.number().optional(),
  }).unknown(false)

const csvFileValidation = Joi.object({
  mimetype: Joi.string()
    .valid('text/csv', 'application/vnd.ms-excel')
    .required()
    .messages({
      'string.base': 'Uploaded file must be a valid CSV.',
      'any.required': 'CSV file is required.',
      'string.valid': 'Only CSV files are allowed.',
    }),
  size: Joi.number()
    .max(2 * 1024 * 1024) // Limit 2MB
    .messages({
      'number.max': 'The CSV file size must be less than or equal to 10MB.',
    }),
}).unknown(true) // Allow unknown fields such as `path`, `originalname`, etc.

export const fileUploadSchema: ObjectSchema<IFileUploadPayload> =
  Joi.object<IFileUploadPayload>({
    image: csvFileValidation,
  }).unknown(false)

export const BulkMandateSchema: ObjectSchema<IMandatePayload> =
  Joi.object<IMandatePayload>({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  }).unknown(false)
export const UrlBulkMandateSchema: ObjectSchema<IFileUrlPayload> =
  Joi.object<IFileUrlPayload>({
    fileName: Joi.string().required(),
  }).unknown(false)
export const paymentVerificationSchema: ObjectSchema<IPaymentVerification> =
  Joi.object<IPaymentVerification>({
    from: Joi.number().required(),
    to: Joi.number().required(),
  }).unknown(false)
  export const payuPaymentVerificationSchema: ObjectSchema<IPauPaymentVerification> =
  Joi.object<IPauPaymentVerification>({
    from: Joi.string().required(),
    to: Joi.string().required(),
  }).unknown(false)
