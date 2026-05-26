import crypto from "crypto";

interface WorldlineConfig {
  merchantCode: string;
  schemeCode: string;
  salt: string;
  deviceId: string;
  baseUrl: string;
  returnBase: string;
  mandateAmount: string;
  frequency: string;
  amountType: string;
  endDate: string;
}

export function worldlineConfig(): WorldlineConfig {
  return {
    merchantCode: process.env.WORLDLINE_MERCHANT_CODE || "",
    schemeCode: (process.env.WORLDLINE_SCHEME_CODE || "first").toLowerCase(),
    salt: process.env.WORLDLINE_SALT || "",
    deviceId: process.env.WORLDLINE_DEVICE_ID || "WEBSH2",
    baseUrl: (
      process.env.WORLDLINE_BASE_URL || "https://www.paynimo.com"
    ).replace(/\/$/, ""),
    returnBase: (
      process.env.WORLDLINE_RETURN_BASE || "https://admin.rulemudra.com"
    ).replace(/\/$/, ""),
    mandateAmount: process.env.WORLDLINE_MANDATE_AMOUNT || "1",
    frequency: process.env.WORLDLINE_MANDATE_FREQUENCY || "ADHO",
    amountType: process.env.WORLDLINE_MANDATE_AMOUNT_TYPE || "M",
    endDate: process.env.WORLDLINE_MANDATE_END_DATE || "01-01-2099",
  };
}

function hash(input: string, deviceId: string): string {
  const algo = deviceId === "WEBSH1" ? "sha256" : "sha512";

  return crypto.createHash(algo).update(input, "utf8").digest("hex");
}

export interface BuildMandateParams {
  txnId: string;
  consumerId: string;
  mobile: string;
  email: string;
  name?: string;
  accountNo?: string;
  accountType?: string;
  ifsc?: string;
  maxAmount: string | number;
  debitStartDate?: string;
  debitEndDate?: string;
  returnUrl: string;
}

function ddmmyyyy(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}`;
}

export function buildMandateRequest(params: BuildMandateParams) {
  const cfg = worldlineConfig();
  const totalAmount = String(cfg.mandateAmount);
  const maxAmount = String(params.maxAmount);
  const debitStartDate = params.debitStartDate || ddmmyyyy(new Date());
  const debitEndDate = params.debitEndDate || cfg.endDate;
  const accountNo = params.accountNo || "";

  const tokenFields = [
    cfg.merchantCode,
    params.txnId,
    totalAmount,
    accountNo,
    params.consumerId,
    params.mobile,
    params.email,
    debitStartDate,
    debitEndDate,
    maxAmount,
    cfg.amountType,
    cfg.frequency,
    "",
    "",
    "",
    "",
    cfg.salt,
  ];

  const token = hash(tokenFields.join("|"), cfg.deviceId);
  const consumerData: Record<string, any> = {
    deviceId: cfg.deviceId,
    token,
    returnUrl: params.returnUrl,
    paymentMode: "all",
    merchantId: cfg.merchantCode,
    currency: "INR",
    consumerId: params.consumerId,
    txnId: params.txnId,
    items: [
      {
        itemId: cfg.schemeCode,
        amount: totalAmount,
        comAmt: "0",
      },
    ],
    customStyle: {
      PRIMARY_COLOR_CODE: "#182bda",
      SECONDARY_COLOR_CODE: "#FFFFFF",
      BUTTON_COLOR_CODE_1: "#182bda",
      BUTTON_COLOR_CODE_2: "#FFFFFF",
    },
    accountNo,
    accountType: params.accountType || "Saving",
    ifscCode: params.ifsc || "",
    debitStartDate,
    debitEndDate,
    maxAmount,
    amountType: cfg.amountType,
    frequency: cfg.frequency,
    consumerMobileNo: params.mobile,
    consumerEmailId: params.email,
  };

  return {
    token,
    txnId: params.txnId,
    debitStartDate,
    debitEndDate,
    maxAmount,
    request: {
      features: {
        enableAbortResponse: true,
        enableExpressPay: true,
        enableMerTxnDetails: true,
        siDetailsAtMerchantEnd: true,
        enableSI: true,
      },
      consumerData,
    },
  };
}

export interface PaynimoResult {
  valid: boolean;
  success: boolean;
  status: string;
  message: string;
  errorMessage: string;
  clientTxnRef: string;
  bankCode: string;
  tpslTxnId: string;
  amount: string;
  txnTime: string;
  mandateRegNo: string;
  bankTransactionId: string;
  raw: string[];
}

export function verifyMandateResponse(pipeString: string): PaynimoResult {
  const cfg = worldlineConfig();
  const parts = String(pipeString || "").split("|");
  const receivedHash = parts[parts.length - 1] || "";
  const verifyString = parts.slice(0, -1).join("|") + "|" + cfg.salt;
  const computed = hash(verifyString, cfg.deviceId);
  const valid =
    !!receivedHash && computed.toLowerCase() === receivedHash.toLowerCase();
  const status = parts[0] || "";
  return {
    valid,
    success: valid && status === "0300",
    status,
    message: parts[1] || "",
    errorMessage: parts[2] || "",
    clientTxnRef: parts[3] || "",
    bankCode: parts[4] || "",
    tpslTxnId: parts[5] || "",
    amount: parts[6] || "",
    txnTime: parts[8] || "",
    bankTransactionId: parts[12] || "",
    mandateRegNo: parts[13] || "",
    raw: parts,
  };
}
