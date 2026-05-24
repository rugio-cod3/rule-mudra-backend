import {
  IConfirmBankAccountPayload,
  IGetCustomerBankAccountsPayload,
  ISaveBankAccountPayload,
} from "@/interfaces/customerBankAccount.interface";
import Joi, { ObjectSchema } from "joi";

export const getBankAccoutListSchema: ObjectSchema<IGetCustomerBankAccountsPayload> =
  Joi.object<IGetCustomerBankAccountsPayload>({
    leadID: Joi.number().required(),
  }).unknown(false);

export const confirmBankAccountSchema: ObjectSchema<IConfirmBankAccountPayload> =
  Joi.object<IConfirmBankAccountPayload>({
    loan_id: Joi.number().required(),
    mandate_id: Joi.number().optional().default(null),
    account_id: Joi.number().required(),
  }).unknown(false);

export const saveBankDetailsSchema: ObjectSchema<ISaveBankAccountPayload> =
  Joi.object<ISaveBankAccountPayload>({
    loan_id: Joi.number().options({ convert: false }).required(),
    account_no: Joi.string()
      .min(10)
      .max(18)
      .messages({
        "string.empty": "Account number is required",
        "string.min": "Invalid Account number",
        "string.max": "Invalid Account number",
      })
      .options({ convert: false })
      .required(),
    confirmed_account_no: Joi.string()
      .options({ convert: false })
      .messages({
        "string.empty": "Please confirm your account number",
      })
      .required(),
    ifsc: Joi.string()
      .uppercase()
      .length(11)
      .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .options({ convert: true })
      .messages({
        "string.length": "Invalid IFSC code",
        "string.pattern.base": "Invalid IFSC code",
      })
      .required(),
    bank_name: Joi.string().options({ convert: false }).required(),
    account_holders_name: Joi.string().options({ convert: false }).required(),
    account_status: Joi.string().optional(),
  }).unknown(false);
