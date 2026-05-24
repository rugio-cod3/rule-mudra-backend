import { ReferenceRelation } from "@/enums/common.enum";
import { IDashboardPayload } from "@/interfaces/address.interface";
import {
  IBankVerifyPayload,
  IDigitalSignPayload,
  IDigitalSignReportPayload,
  IEmandatePayload,
  IFinboxBankConnectPayload,
  IFinboxCreateUrlPayload,
  IKeyFactPayload,
  ILoanApprovalPayload,
  INameEmailOnboardingPayload,
  IPanFetchPayload,
  IPennyDropInitiatePayload,
  IPennyDropVerifyPayload,
  IReferenceDetailsPayload,
  ISearchWordPayload,
  ISurePassSendAadharOtpPayload,
  IUpdateReferenceDetailsPayload,
  IVerifyAadharOtpSurePassPayload,
} from "@/interfaces/onboarding.interface";
import Joi, { ObjectSchema } from "joi";

export const finboxCreateUrlSchema: ObjectSchema<IFinboxCreateUrlPayload> =
  Joi.object<IFinboxCreateUrlPayload>({
    callBackUrl: Joi.string().required(),
    loan_id: Joi.number().required(),
    session_expire: Joi.boolean().optional(),
  }).unknown(false);

export const finboxBankConnectSchema: ObjectSchema<IFinboxBankConnectPayload> =
  Joi.object<IFinboxBankConnectPayload>({
    entityId: Joi.string().required(),
    loan_id: Joi.number().required(),
    step: Joi.string().optional(),
  }).unknown(false);

export const dashBoardSchema: ObjectSchema<IDashboardPayload> =
  Joi.object<IDashboardPayload>({
    residenceAddress: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    pincode: Joi.number().required(),
    appVersion: Joi.string().required(),
  }).unknown(false);

export const panVerificationSchema: ObjectSchema<IPanFetchPayload> =
  Joi.object<IPanFetchPayload>({
    pan: Joi.string()
      .length(10)
      .pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
      .messages({
        "string.pattern.base": "Please enter a valid PAN number.",
        "string.length": "PAN should have 10 characters.",
      })
      .required(),
  }).unknown(false);

export const panConfirmationSchema: ObjectSchema = Joi.object({
  pan: Joi.string()
    .length(10)
    .pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
    .messages({
      "string.pattern.base": "Please enter a valid PAN number.",
      "string.length": "PAN should have 10 characters.",
    })
    .required(),
  email: Joi.string()
    .pattern(
      /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/
    )
    .max(256)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid email address.",
      "string.empty": "Email is required.",
      "string.max": "Maximum allowed length for email is 256 characters.",
    }),
}).unknown(false);

export const aadharVerificationGenerateOtpSchema: ObjectSchema<ISurePassSendAadharOtpPayload> =
  Joi.object<ISurePassSendAadharOtpPayload>({
    aadharNo: Joi.string()
      .length(12)
      .custom((value, helpers) => {
        if (!/^[0-9]{12}$/.test(value)) {
          return helpers.error("string.digitsOnly");
        }
        if (!/^[2-9][0-9]{3}[0-9]{4}[0-9]{4}$/.test(value)) {
          return helpers.error("string.invalid");
        }
        return value;
      })
      .messages({
        "string.length": "Aadhar number should be 12 digits.",
        "string.digitsOnly": "Aadhar number must contain digits only.",
        "string.invalid": "Please enter a valid Aadhar number.",
      })
      .required(),
  }).unknown(false);

export const aadharVerificationVerifyOtpSchema: ObjectSchema<IVerifyAadharOtpSurePassPayload> =
  Joi.object<IVerifyAadharOtpSurePassPayload>({
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]{6}$/)
      .messages({
        "string.pattern.base": "OTP must contain digits only.",
        "string.length": "OTP must be 6 digits.",
      })
      .required(),
    aadharNo: Joi.string()
      .length(12)
      .custom((value, helpers) => {
        if (!/^[0-9]{12}$/.test(value)) {
          return helpers.error("string.digitsOnly");
        }
        if (!/^[2-9][0-9]{3}[0-9]{4}[0-9]{4}$/.test(value)) {
          return helpers.error("string.invalid");
        }
        return value;
      })
      .messages({
        "string.length": "Aadhar number should be 12 digits.",
        "string.digitsOnly": "Aadhar number must contain digits only.",
        "string.invalid": "Please enter a valid Aadhar number.",
      })
      .required(),
  }).unknown(false);

export const NameAndEmailOnboardingSchema: ObjectSchema<INameEmailOnboardingPayload> =
  Joi.object<INameEmailOnboardingPayload>({
    email: Joi.string()
      .pattern(
        /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/
      )
      .max(256)
      .required()
      .messages({
        "string.pattern.base": "Please enter a valid email address.",
        "string.empty": "Email is required.",
        "string.max": "Maximum allowed length for email is 256 characters.",
      }),
    pan: Joi.string()
      .length(10)
      .pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
      .messages({
        "string.pattern.base": "Please enter a valid PAN number.",
        "string.length": "PAN should have 10 characters.",
      })
      .required(),
  }).unknown(false);

export const pennyDropInitiateSchema: ObjectSchema<IPennyDropInitiatePayload> =
  Joi.object<IPennyDropInitiatePayload>({
    loan_id: Joi.number().strict().required(),
    account_id: Joi.number().strict().required(),
  }).unknown(false);

export const pennyDropVerifySchema: ObjectSchema<IPennyDropVerifyPayload> =
  Joi.object<IPennyDropVerifyPayload>({
    pennyDropId: Joi.number().required().options({ convert: true }),
  }).unknown(false);

export const emandateSchema: ObjectSchema<IEmandatePayload> =
  Joi.object<IEmandatePayload>({
    account_id: Joi.number().required(),
    loan_id: Joi.number().required(),
  }).unknown(false);

export const referenceDetailsSchema: ObjectSchema<IReferenceDetailsPayload> =
  Joi.object<IReferenceDetailsPayload>({
    mobile_no_1: Joi.string()
      .trim()
      .length(10)
      .pattern(/^[6-9]\d{9}$/)
      .messages({
        "string.pattern.base":
          "Mobile number must contain digits only and start with 6, 7, 8, or 9.",
        "string.length": "Mobile number must be exactly 10 digits.",
      })
      .required(),
    mobile_no_2: Joi.string()
      .trim()
      .length(10)
      .pattern(/^[6-9]\d{9}$/)
      .messages({
        "string.pattern.base":
          "Mobile number must contain digits only and start with 6, 7, 8, or 9.",
        "string.length": "Mobile number must be exactly 10 digits.",
      })
      .required(),
    name_1: Joi.string()
      .trim()
      .min(2)
      .max(40)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "string.pattern.base": "Name must contain letters only.",
        "string.min": "Name format is invalid.",
        "string.max": "Maximum 40 characters allowed for name.",
      }),
    name_2: Joi.string()
      .trim()
      .min(2)
      .max(40)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "string.pattern.base": "Name must contain letters only.",
        "string.min": "Name format is invalid.",
        "string.max": "Maximum 40 characters allowed for name.",
      }),
    relation_1: Joi.string()
      .valid(...Object.values(ReferenceRelation))
      .trim()
      .required(),
    relation_2: Joi.string()
      .valid(...Object.values(ReferenceRelation))
      .trim()
      .required(),
    loan_id: Joi.number().required(),
  })
    .custom((value, helpers) => {
      // Check if mobile numbers are the same
      if (value.mobile_no_1 === value.mobile_no_2) {
        return helpers.error("mobile.same");
      }
      // Check if names are the same
      if (
        value.name_1.replace(/\s+/g, "").toLowerCase() ===
        value.name_2.replace(/\s+/g, "").toLowerCase()
      ) {
        return helpers.error("name.same");
      }

      // Check if at least one relation is Mother, Father, Brother, Sister, or Spouse
      const requiredRelations = [
        ReferenceRelation.MOTHER,
        ReferenceRelation.FATHER,
        ReferenceRelation.BROTHER,
        ReferenceRelation.SISTER,
        ReferenceRelation.SPOUSE,
      ];
      const hasRequiredRelation =
        requiredRelations.includes(value.relation_1) ||
        requiredRelations.includes(value.relation_2);

      if (!hasRequiredRelation) {
        return helpers.error("relation.requiredrelation");
      }

      // Check if relations are the same (except Brother & Sister)
      if (
        value.relation_1 === value.relation_2 &&
        ![ReferenceRelation.BROTHER, ReferenceRelation.SISTER].includes(
          value.relation1
        )
      ) {
        return helpers.error("relation.same");
      }

      return value;
    })
    .messages({
      "mobile.same": "Mobile numbers cannot be the same.",
      "name.same": "Reference names cannot be the same.",
      "relation.requiredrelation":
        "At least one reference must be Mother, Father, Brother, Sister, or Spouse.",
      "relation.same":
        "Relationships cannot be the same for both references, except for Brother and Sister.",
    })
    .unknown(false);

export const updateReferenceDetailsSchema: ObjectSchema<IUpdateReferenceDetailsPayload> =
  Joi.object<IUpdateReferenceDetailsPayload>({
    mobile_no_1: Joi.string()
      .trim()
      .length(10)
      .pattern(/^[6-9]\d{9}$/)
      .messages({
        "string.pattern.base":
          "Mobile number must contain digits only and start with 6, 7, 8, or 9.",
        "string.length": "Mobile number must be exactly 10 digits.",
      })
      .required(),
    mobile_no_2: Joi.string()
      .trim()
      .length(10)
      .pattern(/^[6-9]\d{9}$/)
      .messages({
        "string.pattern.base":
          "Mobile number must contain digits only and start with 6, 7, 8, or 9.",
        "string.length": "Mobile number must be exactly 10 digits.",
      })
      .required(),
    name_1: Joi.string()
      .trim()
      .min(2)
      .max(40)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "string.pattern.base": "Name must contain letters only.",
        "string.min": "Name format is invalid.",
        "string.max": "Maximum 40 characters allowed for name.",
      }),
    name_2: Joi.string()
      .trim()
      .min(2)
      .max(40)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "string.pattern.base": "Name must contain letters only.",
        "string.min": "Name format is invalid.",
        "string.max": "Maximum 40 characters allowed for name.",
      }),
    relation_1: Joi.string()
      .valid(...Object.values(ReferenceRelation))
      .trim()
      .required(),
    relation_2: Joi.string()
      .valid(...Object.values(ReferenceRelation))
      .trim()
      .required(),
    id_1: Joi.number().required(),
    id_2: Joi.number().required(),
    loan_id: Joi.number().required(),
  })
    .custom((value, helpers) => {
      // Check if mobile numbers are the same
      if (value.mobile_no_1 === value.mobile_no_2) {
        return helpers.error("mobile.same");
      }
      // Check if names are the same
      if (
        value.name_1.replace(/\s+/g, "").toLowerCase() ===
        value.name_2.replace(/\s+/g, "").toLowerCase()
      ) {
        return helpers.error("name.same");
      }

      // Check if at least one relation is Mother, Father, Brother, Sister, or Spouse
      const requiredRelations = [
        ReferenceRelation.MOTHER,
        ReferenceRelation.FATHER,
        ReferenceRelation.BROTHER,
        ReferenceRelation.SISTER,
        ReferenceRelation.SPOUSE,
      ];
      const hasRequiredRelation =
        requiredRelations.includes(value.relation_1) ||
        requiredRelations.includes(value.relation_2);

      if (!hasRequiredRelation) {
        return helpers.error("relation.requiredrelation");
      }

      // Check if relations are the same (except Brother & Sister)
      if (
        value.relation_1 === value.relation_2 &&
        ![ReferenceRelation.BROTHER, ReferenceRelation.SISTER].includes(
          value.relation_1
        )
      ) {
        return helpers.error("relation.same");
      }

      return value;
    })
    .messages({
      "mobile.same": "Mobile numbers cannot be the same.",
      "name.same": "Reference names cannot be the same.",
      "relation.requiredrelation":
        "At least one reference must be Mother, Father, Brother, Sister, or Spouse.",
      "relation.same":
        "Relationships cannot be the same for both references, except for Brother and Sister.",
    })
    .unknown(false);
export const getStatesSchema: ObjectSchema<ISearchWordPayload> =
  Joi.object<ISearchWordPayload>({
    searchWord: Joi.string().required(),
  }).unknown(false);

export const approvalViewSchema: ObjectSchema = Joi.object({
  loan_id: Joi.number().required(),
}).unknown(false);

export const keyFactSchema: ObjectSchema<IKeyFactPayload> =
  Joi.object<IKeyFactPayload>({
    loan_id: Joi.number().required(),
  }).unknown(false);

export const loanApprovalSchema: ObjectSchema<ILoanApprovalPayload> =
  Joi.object<ILoanApprovalPayload>({
    loanID: Joi.number().required(),
  }).unknown(false);

export const bankVerifySchema: ObjectSchema<IBankVerifyPayload> =
  Joi.object<IBankVerifyPayload>({
    loan_id: Joi.string().required(),
    accountNo: Joi.string().required(),
    ifsc: Joi.string().required(),
  }).unknown(false);

export const digitalEsignSchema: ObjectSchema<IDigitalSignPayload> =
  Joi.object<IDigitalSignPayload>({
    callback_url: Joi.string().required(),
  }).unknown(false);

export const digitalEsignReportSchema: ObjectSchema<IDigitalSignReportPayload> =
  Joi.object<IDigitalSignReportPayload>({
    client_id: Joi.string().required(),
  }).unknown(false);
