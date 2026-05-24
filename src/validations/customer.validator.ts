import { IRazorpayPaydayRepayment } from "@/interfaces/collection.interface";
import {
  IRazorpayRepayment,
  IUserTransactions,
  IUtmSource,
} from "@/interfaces/common.interface";
import {
  ICustomerLoginPayload,
  IDashboardPayload,
  IEmiSoaPayload,
  IRepaymentPagePayload,
} from "@/interfaces/customer.interface";
import {
  ICustomerCheckDetails,
  ICustomerIncompleteDetailsPayload,
} from "@/interfaces/onboarding.interface";
import Joi, { ObjectSchema } from "joi";

export const leadUpdateSchema: ObjectSchema<ICustomerLoginPayload> =
  Joi.object<ICustomerLoginPayload>({
    mobile: Joi.number().required(),
  }).unknown(false);

export const loginCustomerSchema: ObjectSchema<ICustomerLoginPayload> =
  Joi.object<ICustomerLoginPayload>({
    mobile: Joi.string()
      .length(10)
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "Please enter a valid mobile number.",
        "string.empty": "Mobile number is required.",
        "string.length": "Mobile number must be 10 digits.",
      }),
    app_id: Joi.string().optional().default("N/A"),
    imei: Joi.string().optional().default("N/A"),
    plateform: Joi.string().optional().default("ramfin"),
  }).unknown(false);

export const verifyOtpSchema: ObjectSchema = Joi.object({
  request_id: Joi.string().required().messages({
    "string.empty": "request_id is mandatory",
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]*$/)
    .required()
    .messages({
      "string.length": "OTP must be 6 digits.",
      "string.pattern.base": "OTP must contain digits only.",
    }),
}).unknown(false);

export const verifyOtpPayload: ObjectSchema = Joi.object({
  req_id: Joi.string().required(),
  mobile: Joi.string()
    .length(10)
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid mobile number.",
      "string.empty": "Mobile number is required.",
      "string.length": "Mobile number must be 10 digits.",
    }),
  otp: Joi.string()
    .length(4)
    .pattern(/^[0-9]*$/)
    .required()
    .messages({
      "string.length": "OTP must be 4 digits.",
      "string.pattern.base": "OTP must contain digits only.",
    }),
}).unknown(false);

export const incompleteDetailsSchema: ObjectSchema<ICustomerIncompleteDetailsPayload> =
  Joi.object<ICustomerIncompleteDetailsPayload>({
    repeat: Joi.boolean().optional().default(false),
    step: Joi.number().optional(),

    loan_id: Joi.number().optional(),

    salary_date: Joi.number().optional(),

    loan_required: Joi.number()
      .min(1000)
      .max(1000000)
      .messages({
        "number.base": "Please enter a valid loan amount.",
        "number.min": "Minimum loan amount is ₹1,000.",
        "number.max": "Maximum loan amount is ₹10,00,000.",
      })
      .optional(),

    loan_purpose: Joi.string()
      .valid(
        "Medical Emergency",
        "Salary Delay",
        "Personal Emergency",
        "Education",
        "Rent / Bills",
        "Other"
      )
      .messages({
        "any.only": "Please select a valid loan purpose.",
      })
      .optional(),

    gender: Joi.string()
      .valid("Male", "Female", "Other")
      .messages({
        "any.only": "Please select a valid gender.",
      })
      .optional(),

    company_name: Joi.string()
      .messages({
        "string.base": "Please enter a valid company name.",
      })
      .optional(),

    office_email_id: Joi.string().email().optional(),

    designation: Joi.string()
      .valid(
        "Associate",
        "Executive",
        "Manager",
        "Senior Manager",
        "CEO",
        "Other"
      )
      .messages({
        "any.only": "Please select a valid designation.",
      })
      .optional(),

    monthly_income: Joi.number()
      .min(1000)
      .max(1000000)
      .messages({
        "number.base": "Please enter a valid income amount.",
        "number.min": "Monthly income must be at least ₹1,000.",
        "number.max": "Monthly income cannot exceed ₹10,00,000.",
      })
      .optional(),

    working_since: Joi.date().optional(),

    industry: Joi.string()
      .valid(
        "Information Technology (IT)",
        "Healthcare",
        "Education",
        "Automotive",
        "E-commerce",
        "Hospitality",
        "Other"
      )
      .messages({
        "any.only": "Please select a valid industry.",
      })
      .optional(),

    residence_type: Joi.string()
      .valid("Owned", "Rented")
      .messages({
        "any.only": "Please select a valid residence type.",
      })
      .optional(),

    residence_address: Joi.string().optional(),

    state: Joi.string().optional(),

    city: Joi.string().optional(),

    pincode: Joi.number()
      .integer()
      .min(100000)
      .messages({
        "number.base": "Please enter a valid pincode.",
        "number.min": "Pincode must be at least 6 digits.",
      })
      .optional(),

    landmark: Joi.string().allow(null).optional().empty(""),

    marrital: Joi.string()
      .valid("Single", "Married")
      .messages({
        "any.only": "Please select a valid marital status.",
      })
      .optional(),

    education: Joi.string()
      .valid(
        "Below 10th",
        "Secondary School (10th)",
        "Senior Secondary School (12th)",
        "Diploma",
        "Bachelors",
        "Masters"
      )
      .messages({
        "any.only": "Please select a valid education level.",
      })
      .optional(),

    employee_type: Joi.string()
      .valid("Salaried", "Self Employee")
      .messages({
        "any.only": "Please select a valid employee type.",
      })
      .optional(),

    salary_mode: Joi.string()
      .valid("Bank Transfer", "Cheque", "Cash")
      .messages({
        "any.only": "Please select a valid salary mode.",
      })
      .optional(),

    total_experience: Joi.string()
      .valid(
        "0 - 2 Years",
        "2 - 5 Years",
        "5 - 8 Years",
        "8 - 10 Years",
        "More than 10 years"
      )
      .messages({
        "any.only": "Please select a valid total experience.",
      })
      .optional(),
    finboxCallBackUrl: Joi.string().optional(),
  }).unknown(false);

export const dashboardSchema: ObjectSchema<IDashboardPayload> =
  Joi.object<IDashboardPayload>({
    appVersion: Joi.string().optional().allow(null).default("N/A"),
    city: Joi.string().optional().allow(null).default("N/A"),
    pincode: Joi.string()
      .length(6)
      .optional()
      .pattern(/^\d+$/)
      .allow(null)
      .default("000000")
      .messages({
        "string.pattern.base": "Please enter a valid numeric pincode.",
      }),
    residenceAddress: Joi.string().allow(null).optional().default("N/A"),
    state: Joi.string().optional().allow(null).default("N/A"),
  }).unknown(false);

export const repaymentPageSchema: ObjectSchema<IRepaymentPagePayload> =
  Joi.object<IRepaymentPagePayload>({
    leadId: Joi.number().required(),
    customer: Joi.object({
      customerID: Joi.number().required(),
    }).optional(),
  }).unknown(false);

export const getOnePageView: ObjectSchema = Joi.object({
  loan_id: Joi.number().required(),
});
export const repeatCaseSchema: ObjectSchema<ICustomerCheckDetails> =
  Joi.object<ICustomerCheckDetails>({
    company_name: Joi.string().required().messages({
      "any.required": "Company name is required.",
      "string.base": "Please enter a valid company name.",
    }),

    monthly_income: Joi.number().required().min(1000).max(1000000).messages({
      "number.base": "Enter a valid income amount",
      "number.min": "Income must be atleast 1000",
    }),

    salary_date: Joi.string().required().messages({
      "any.required": "Salary date is required.",
      "string.base": "Please enter a valid salary date.",
    }),

    loan_required: Joi.number().required().min(1000).max(1000000).messages({
      "number.base": "Please enter a valid loan amount",
      "number.min": "Minimum Loan: ₹1,000",
      "number.max": "Max Loan: ₹10,00,000",
    }),

    loan_purpose: Joi.string().required().default("N/A").messages({
      "string.base": "Please select your loan purpose.",
      "any.required": "Loan purpose is required.",
    }),

    employeeType: Joi.string().required().messages({
      "string.base": "Please select an employee type.",
      "any.required": "Employee type is required.",
      "any.only": "Please select a valid employee type.",
    }),

    modeOfPayment: Joi.string().required().messages({
      "string.base": "Please select a mode of payment.",
      "any.required": "Mode of payment is required.",
      "any.only": "Please select a valid mode of payment.",
    }),
    plateform: Joi.string().optional().default("ramfin"),
  }).unknown(false);

export const razorpayPaydayRepaymentSchema: ObjectSchema<IRazorpayPaydayRepayment> =
  Joi.object<IRazorpayPaydayRepayment>({
    leadId: Joi.number().required(),
    razorpayOrderId: Joi.string().required(),
    toValue: Joi.number().required(),
  }).unknown(false);

export const emiSoaSchema: ObjectSchema<IEmiSoaPayload> =
  Joi.object<IEmiSoaPayload>({
    customerID: Joi.number().required(),
    leadID: Joi.number().required(),
  }).unknown(false);

export const utmSourceSchema: ObjectSchema<IUtmSource> = Joi.object<IUtmSource>(
  {
    utm_source: Joi.string().optional(),
  }
).unknown(false);

export const userTransactionsSchema: ObjectSchema<IUserTransactions> =
  Joi.object<IUserTransactions>({
    loan_id: Joi.string().optional(),
  }).unknown(false);

export const razorpayRepaymentSchema: ObjectSchema<IRazorpayRepayment> =
  Joi.object<IRazorpayRepayment>({
    leadId: Joi.number().required(),
    amount: Joi.number().required(),
  }).unknown(false);
