import config from "@/config/default";
import { STATES } from "@/constants/months.constant";
import { apiReqResLogsModel } from "@/database/mysql/api_req_res_log";
import ApprovalModel from "@/database/mysql/approval";
import { callHistorymodel } from "@/database/mysql/callHistory";
import CallHistoryLogModel from "@/database/mysql/callhistorylogs";
import { customerModel } from "@/database/mysql/customer";
import { customerAccountModel } from "@/database/mysql/customerAccount";
import { emandateNotRequiredLogs } from "@/database/mysql/emandate_not_required_logs";
import { leadModel } from "@/database/mysql/leads";
import { leadsApiLogModel } from "@/database/mysql/lead_api_log";
import { loanModel } from "@/database/mysql/loan";
import { pennyDropModel } from "@/database/mysql/penny_drop";
import { razorpayMandateModel } from "@/database/mysql/razorpay_mandate";
import { razorpayMandateStatusModel } from "@/database/mysql/razorpay_mandate_status";
import { razorpayPayoutAccountsModel } from "@/database/mysql/razorpay_payout_accounts";
import { referenceModel } from "@/database/mysql/reference";
import { stepTrackerModel } from "@/database/mysql/step_tracker";
import UserMetaDataModel from "@/database/mysql/user_metadata";
import { ApprovalStatus } from "@/enums/approvalStatus.enum";
import { CallType } from "@/enums/callHistory.enum";
import {
  AddressType,
  ApiSupplierType,
  BranchName,
  StatusCode,
  StepName,
  SurePassApiUrl,
  SurepassDigilockerApiUrl,
} from "@/enums/common.enum";
import { BankAccountStatus } from "@/enums/customerBankAccount.enum";
import { FinboxUrls } from "@/enums/finbox.enum";
import {
  NameMatchType,
  NameSimilarityStatus,
} from "@/enums/finboxNameMatch.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { LoanStatus } from "@/enums/loan.enum";
import { PennyStatus } from "@/enums/penny_drop.enum";
import {
  RazorPayContactType,
  RazorPayMandateVerification,
  RazorPayValidateStatus,
} from "@/enums/razorpay.enum";
import { BadRequestError, InternalServerError, NotFoundError } from "@/errors";
import CommonHelper from "@/helpers/common";
import { IAddress } from "@/interfaces/address.interface";
import { IPagination } from "@/interfaces/common.interface";
import { ICustomer } from "@/interfaces/customer.interface";
import { ICustomerAccount } from "@/interfaces/customerAccount.interface";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import { IEmailSendData } from "@/interfaces/mail_template.interface";
import { IMobileToken } from "@/interfaces/mobileToken.interface";
import {
  IAadharVerificationInitiateDigiLockerPayload,
  IAadharVerificationInitiateSurepassDigiLockerPayload,
  IAadharVerificationWebhookDigiLockerDigitap,
  IAadharVerificationWebhookDigiLockerSurepass,
  IApprovalView,
  IDecentroEaadharResponse,
  IEmandatePayload,
  IFinboxCreateUrlPayload,
  IKeyFactPayload,
  ILoanApprovalPayload,
  ILoanData,
  INewCustomerOnboardingInput,
  INewCustomerOnboardingResponse,
  IPanConfirmationPayload,
  IPanFetchPayload,
  IPanFetchPayloadDigitap,
  IPennyDropInitiatePayload,
  IPennyDropNameMatchPayload,
  IReferenceDetailsPayload,
  ISearchWordPayload,
  ISurePassSendAadharOtpPayload,
  ISurePassValidatePanResponse,
  ISurePassVerifyAadharResponse,
  IUpdateReferenceDetailsPayload,
  IVerifyAadharOtpSurePassPayload,
} from "@/interfaces/onboarding.interface";
import { PennyDropNameMatchStatus } from "@/interfaces/penny_drop.interface";
import { IFetchPaymentPayload } from "@/interfaces/razorpay.interface";
import { IRazorpayMandate } from "@/interfaces/razorpay_mandate.interface";
import {
  IRazorPayContactsRequest,
  IRazorPayCreateFundAccountRequest,
  IRazorPayValidateAccountRequest,
} from "@/interfaces/razorpay_payout_accounts.interface";
import { IReferenceModel } from "@/interfaces/reference.interface";
import { IServiceResponse } from "@/interfaces/service.interface";
import { IStepTrackerJoinStepControl } from "@/interfaces/step-tracker";
import { autoApproveNewCustomerUsingCibilAndBRE } from "@/services/thirdParty/cibilAndBre.service";
import S3Service from "@/services/thirdParty/s3.service";
import { InsertData } from "@/types/model.types";
import {
  addDaysToDate,
  getCurrentTime,
  getDifferenceInDays,
  getTimeInIst,
} from "@/utils/dateTimeFunctions";
import { logger } from "@/utils/logger";
import { getKnexInstance } from "@/utils/mysql";
import { razorPayPayments } from "@/utils/razorpayClient.utils";
import {
  getNameMatchPercentage,
  matchPanAadhaarDob,
  verifyPanDigitap,
} from "@/utils/surePass.utils";
import {
  generatePennyDropId,
  generateRandomNumber,
  isPincodeBlocked,
  maskString,
  roundNumber,
  sampleReferencePayload,
  sanitizeData,
} from "@/utils/util";
import axios, { HttpStatusCode } from "axios";
import ejs from "ejs";
import moment from "moment";
import momentTz from "moment-timezone";
import path from "path";
import xml2js from "xml2js";
import AddressService from "./address.service";
import { approvalService } from "./approval.service";
import { crmService } from "./crm.service";
import CustomerService from "./customer.service";
import { documentFinboxservice } from "./documentFinbox.service";
import { finboxNameMatchservice } from "./finboxNameMatch.service";
import LeadService from "./lead.service";
import LeadApiLogService from "./lead_api_log.service";
import { loanService } from "./loan.service";
import MobileTokenService from "./mobile_token.service";
import ResponseService from "./response.service";
import DigilockerService from "./thirdParty/digilocker.service";
import FinboxService from "./thirdParty/finbox.service";
import SurepassService from "./thirdParty/surepass.service";

import { documentModel } from "@/database/mysql/document";
import { IApproval } from "@/interfaces/approval.interface";
import { IFinboxSessionBankConnectPayload } from "@/interfaces/finbox_new.interface";
import { createStepTrackerEntry } from "@/middlewares/stepCheck2.middleware";
import { BureauType, CredForgeBreService } from "@/utils/credforge";
import { CrifSoftPullService } from "@/utils/crif_softpull";
import { digitapAABankConnect, digitapAACreateUrl } from "@/utils/digitap_aa";
import {
  buildMandateRequest,
  verifyMandateResponse,
  worldlineConfig,
} from "@/utils/worldline_mandate";
import * as fs from "fs";
import puppeteer from "puppeteer";
import { Readable } from "stream";
import {
  finboxBankConnectInitiate,
  finboxInitiateSession,
} from "../utils/finbox";
import CallHistoryLogService from "./callhistorylog.service";
import { customerNameMatchservice } from "./customerNameMatch.service";
import DigitapNewService from "./thirdParty/digitap_new.service";
import redisClient from "./thirdParty/ioredis";

export class OnboardingService extends ResponseService {
  private readonly leadService = new LeadService();
  private readonly leadApiLogService = new LeadApiLogService();
  private readonly finboxNameMatchService = finboxNameMatchservice;
  private readonly documentFinboxService = documentFinboxservice;
  private readonly customerService = new CustomerService();
  private readonly addressService = new AddressService();
  private readonly surepassService = new SurepassService();
  private readonly findBoxService = new FinboxService();
  private readonly digiLockerService = new DigilockerService();
  private readonly approvalModel = new ApprovalModel();
  private readonly callhistoryLogModel = new CallHistoryLogModel();
  private readonly stepTrackermodel = stepTrackerModel;
  private readonly userMetaModel = new UserMetaDataModel();
  private readonly razorpayPayoutAccountsModel = razorpayPayoutAccountsModel;
  private readonly pennyDropModel = pennyDropModel;
  private readonly razorPayPayments = razorPayPayments;
  private readonly razorpayMandateModel = razorpayMandateModel;
  private readonly customerAccountModel = customerAccountModel;
  private readonly emandateNotRequiredLogs = emandateNotRequiredLogs;
  private readonly customerModel = customerModel;
  private readonly callHistoryModel = callHistorymodel;
  private readonly leadModel = leadModel;
  private readonly referenceModel = referenceModel;
  private readonly loanModel = loanModel;
  private readonly loanService = loanService;
  private readonly approvalService = approvalService;
  private readonly mobileTokenService = new MobileTokenService();
  private readonly commonHelper = new CommonHelper();
  private readonly leadsApiLogModel = leadsApiLogModel;
  private readonly razorpayMandateStatusModel = razorpayMandateStatusModel;
  private readonly apiReqResLogsModel = apiReqResLogsModel;
  private readonly crmService = crmService;
  private readonly callHistoryLogsService = new CallHistoryLogService();
  private readonly digitapNewService = new DigitapNewService();
  private s3Service = new S3Service();

  constructor() {
    super();
  }

  /* finboxCreateUrl = async (
    payload: IFinboxCreateUrlPayload,
  ): Promise<IServiceResponse> => {
    const { mobileNo, callBackUrl, customerID, session_expire } = payload;

    const finboxService = new FinboxService();

    const redirect_url = callBackUrl
      ? callBackUrl
      : `${config.frontendBaseUrl}${FinboxUrls.CREATE_URL}`;
    const logo_url = `${config.frontendBaseUrl}/${FinboxUrls.LOGO_URL}`;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const formattedStartDate = `${String(startDate.getDate()).padStart(
      2,
      "0",
    )}/${String(startDate.getMonth() + 1).padStart(
      2,
      "0",
    )}/${startDate.getFullYear()}`;

    const endDate = new Date();
    const formattedEndDate = `${String(endDate.getDate()).padStart(
      2,
      "0",
    )}/${String(endDate.getMonth() + 1).padStart(
      2,
      "0",
    )}/${endDate.getFullYear()}`;

    const response = await finboxInitiateSession({
      link_id: customerID.toString(),
      from_date: formattedStartDate,
      to_date: formattedEndDate,
      customerID: customerID.toString(),
      redirect_url: redirect_url,
      session_expire,
    });

    return this.serviceResponse(200, response.data, response.message);
  }; */

  finboxCreateUrl = async (
    payload: IFinboxCreateUrlPayload,
  ): Promise<IServiceResponse> => {
    const {
      mobileNo,
      callBackUrl,
      customerID,
      leadID,
      session_expire,
      provider,
    } = payload;

    const selectedProvider =
      provider || process.env.bankAggregatorProvider || "digitap";

    const redirectUrl = callBackUrl
      ? callBackUrl
      : `${config.frontendBaseUrl}${FinboxUrls.CREATE_URL}`;

    /**
     * DIGITAP AA FLOW
     */
    if (selectedProvider === "digitap") {
      const response = await digitapAACreateUrl({
        customerID,
        leadID: Number(leadID),
        mobileNo,
        callBackUrl: redirectUrl,
        session_expire,
      });

      if (!response.status) {
        return this.serviceResponse(
          400,
          response.data || null,
          response.message || "Unable to create Digitap AA URL",
        );
      }

      return this.serviceResponse(
        200,
        {
          redirect_url: response.data?.redirect_url,
          request_id: response.data?.request_id,
          provider: "digitap",
        },
        response.message,
      );
    }

    /**
     * EXISTING FINBOX FLOW
     */
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    const formattedStartDate = `${String(startDate.getDate()).padStart(
      2,
      "0",
    )}/${String(startDate.getMonth() + 1).padStart(
      2,
      "0",
    )}/${startDate.getFullYear()}`;

    const endDate = new Date();

    const formattedEndDate = `${String(endDate.getDate()).padStart(
      2,
      "0",
    )}/${String(endDate.getMonth() + 1).padStart(
      2,
      "0",
    )}/${endDate.getFullYear()}`;

    const response = await finboxInitiateSession({
      link_id: customerID.toString(),
      from_date: formattedStartDate,
      to_date: formattedEndDate,
      customerID: customerID.toString(),
      redirect_url: redirectUrl,
      session_expire,
    });

    return this.serviceResponse(
      200,
      {
        ...response.data,
        provider: "finbox",
      },
      response.message,
    );
  };

  /* finboxBankConnect = async (
    payload: IFinboxSessionBankConnectPayload,
  ): Promise<any> => {
    const { entityId, loan_id, customerID } = payload;
    let leadID = loan_id;
    const getSessionFromRedis = await redisClient.getKey(
      `finbox_session_${customerID}`,
    );

    if (!getSessionFromRedis) throw new NotFoundError("Session ID not found");

    const lead = await this.leadService.findOne({ leadID });
    if (!lead) throw new NotFoundError("Lead not found");

    const bankConnectResponse = await finboxBankConnectInitiate(
      entityId,
      customerID,
      leadID,
    );

    if (
      !bankConnectResponse.status &&
      bankConnectResponse?.data?.offerAmount === null
    ) {
      return this.serviceResponse(
        409,
        bankConnectResponse.data || null,
        bankConnectResponse.message || "Finbox Reject",
      );
    } else if (bankConnectResponse?.data?.retry) {
      return this.serviceResponse(
        400,
        bankConnectResponse.data || null,
        bankConnectResponse.message || "Retry after 3 sec",
      );
    } else {
      return this.serviceResponse(
        200,
        bankConnectResponse.data,
        bankConnectResponse.message,
      );
    }
  }; */

  finboxBankConnect = async (
    payload: IFinboxSessionBankConnectPayload,
  ): Promise<IServiceResponse> => {
    const { entityId, loan_id, customerID, provider, txn_id } = payload;

    const leadID = Number(loan_id);

    const selectedProvider = "digitap";

    const lead = await this.leadService.findOne({ leadID });

    if (!lead) {
      throw new NotFoundError("Lead not found");
    }

    /**
     * DIGITAP AA FLOW
     *
     * entityId = request_id
     */
    if (selectedProvider === "digitap") {
      const digitapBankConnectResponse = await digitapAABankConnect({
        customerID: Number(customerID),
        leadID,
        requestId: entityId,
        txn_id,
      });

      if (
        !digitapBankConnectResponse.status &&
        digitapBankConnectResponse?.data?.offerAmount === null
      ) {
        return this.serviceResponse(
          409,
          digitapBankConnectResponse.data || null,
          digitapBankConnectResponse.message || "Digitap AA Reject",
        );
      }

      if (digitapBankConnectResponse?.data?.retry) {
        return this.serviceResponse(
          400,
          digitapBankConnectResponse.data || null,
          digitapBankConnectResponse.message || "Retry after 3 sec",
        );
      }

      return this.serviceResponse(
        200,
        digitapBankConnectResponse.data || {},
        digitapBankConnectResponse.message,
      );
    }

    /**
     * EXISTING FINBOX FLOW
     *
     * entityId = session_id
     */
    const getSessionFromRedis = await redisClient.getKey(
      `finbox_session_${customerID}`,
    );

    if (!getSessionFromRedis) {
      throw new NotFoundError("Session ID not found");
    }

    const bankConnectResponse = await finboxBankConnectInitiate(
      entityId,
      customerID,
      leadID,
    );

    if (
      !bankConnectResponse.status &&
      bankConnectResponse?.data?.offerAmount === null
    ) {
      return this.serviceResponse(
        409,
        bankConnectResponse.data || null,
        bankConnectResponse.message || "Finbox Reject",
      );
    }

    if (bankConnectResponse?.data?.retry) {
      return this.serviceResponse(
        400,
        bankConnectResponse.data || null,
        bankConnectResponse.message || "Retry after 3 sec",
      );
    }

    return this.serviceResponse(
      200,
      bankConnectResponse.data,
      bankConnectResponse.message,
    );
  };

  sendApplyMail = async (email: string) => {
    const commonHelper = new CommonHelper();
    const msg = config.welcomeEmailMsg;
    const to = email;
    const subject = "Welcome to Ramfin Corp";

    const emailData: IEmailSendData = {
      to,
      from: config.senderEmail,
      subject,
      body: msg,
    };

    await commonHelper.sendMailSwitcher(emailData);
  };

  onboardPanVerification = async (
    payload: IPanFetchPayload,
  ): Promise<IServiceResponse> => {
    const { pan, customerID, mobileNo, customerPanCardNo } = payload;
    if (customerPanCardNo && payload?.pan_cust_verified === 1) {
      const panLeadApiLogData =
        await this.leadApiLogService.findPanComprehensiveResponseDigitap(
          customerPanCardNo,
          String(mobileNo),
        );
      if (panLeadApiLogData) {
        return this.serviceResponse(
          200,
          panLeadApiLogData,
          "PAN Already Linked, Details fetched",
        );
      }
    }
    const customer = await this.customerService.findOne({ pancard: pan }, [
      "mobile",
    ]);

    if (customer) {
      if (customer.mobile !== mobileNo) {
        logger.error(
          `PAN no ${pan} is already linked to another mobile ${customer.mobile}`,
        );
        throw new BadRequestError(
          "This PAN number is associated with another existing account",
          {
            data: {
              mobileNo: maskString(String(customer.mobile), 6),
            },
          },
        );
      }
      const panLeadApiLogData =
        await this.leadApiLogService.findPanComprehensiveResponseDigitap(
          pan,
          String(mobileNo),
        );
      if (panLeadApiLogData) {
        return this.serviceResponse(
          200,
          panLeadApiLogData,
          "PAN Details fetched",
        );
      }

      // The details don't exist in lead_log, proceed to hit Digitap

      const digitapData = await this.digitapNewService.verifyPanDigitap({
        panNumber: pan,
        customerId: customerID,
        mobileNo,
      });

      if (!digitapData.success)
        throw new BadRequestError(
          digitapData.statusCode === HttpStatusCode.UnprocessableEntity
            ? digitapData.data?.message
            : "Pan fetch failure",
          {
            data: {
              // clientId: digitapData.data?.data?.client_id,
            },
          },
        );
      return this.serviceResponse(200, digitapData.data.data, "PAN Details");
    }

    const panLeadApiLogData =
      await this.leadApiLogService.findPanComprehensiveResponseDigitap(
        pan,
        String(mobileNo),
      );
    if (panLeadApiLogData) {
      return this.serviceResponse(
        200,
        panLeadApiLogData,
        "PAN Details fetched",
      );
    }
    const digitapData = await this.digitapNewService.verifyPanDigitap({
      panNumber: pan,
      customerId: customerID,
      mobileNo,
    });

    if (!digitapData.success)
      throw new BadRequestError(
        digitapData.statusCode === HttpStatusCode.UnprocessableEntity
          ? digitapData.data?.message
          : "Pan fetch failure",
        {
          data: {
            // clientId: digitapData.data?.data?.client_id,
          },
        },
      );

    return this.serviceResponse(200, digitapData.data.data, "PAN Details");
  };

  onboardPanConfirmation = async (payload: IPanConfirmationPayload) => {
    const { panNumber, mobileNo, customerID, email } = payload;
    // const { step_order, product_id, step_id, is_completed } = payload.userStep

    // Check if data exists in leadApiLogs

    const leadApiLogsApiResponse =
      await this.leadApiLogService.findPanComprehensiveResponseDigitap(
        panNumber,
        String(mobileNo),
      );

    if (!leadApiLogsApiResponse) {
      logger.error(
        "PAN details not found for customer with Mobile No: " +
          String(mobileNo) +
          " in lead_logs_api table",
      );
      throw new BadRequestError(
        "An Issue occured while saving PAN details, Please try again later.",
      );
    }

    const { dob, gender, full_name, full_name_split, masked_aadhaar } =
      leadApiLogsApiResponse;

    if (!gender || !dob) {
      logger.error(
        "Incomplete PAN details for customer with Mobile No: " +
          String(mobileNo) +
          "Missing: " +
          "gender or dob",
      );
      throw new BadRequestError("Eligibility criteria failed.");
    }

    const age = moment().diff(moment(dob, "YYYY-MM-DD"), "years");

    const loanCount = await this.loanModel.countLoan({
      customerID,
      status: LoanStatus.DISBURSED,
    });
    const customerType = loanCount > 0 ? "Repeat Case" : "New Case";

    if (customerType === "New Case" && (age < 18 || age > 58)) {
      throw new BadRequestError("Eligibility criteria failed.");
    } else if (customerType === "Repeat Case" && (age < 18 || age > 65)) {
      throw new BadRequestError("Eligibility criteria failed.");
    }

    const { pan_number } = leadApiLogsApiResponse;

    // If masked aadhar not available give error

    if (!leadApiLogsApiResponse.dob) {
      await this.leadApiLogService.delete([
        { column: "mobile_no", value: String(mobileNo) },
        { column: "api_type", value: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP },
        { column: "pancard", value: panNumber },
      ]);

      throw new BadRequestError("Incomplete information in PAN");
    }

    // Update the panNumberin the customer table of user
    // Delete all the data where the this customer's mobile no is equal but not equal to pancard supplied
    // Save address
    // Add data to userMeta

    const promises: Array<any> = [
      this.customerService.updateOne(
        { customerID },
        {
          pancard: pan_number,
          pan_cust_verified: 1,
          dob: leadApiLogsApiResponse.dob as unknown as Date,
          email,
          name: full_name,
          firstName: full_name_split[0],
          middleName: full_name_split[1] ? full_name_split[1] : "",
          lastName: full_name_split[2] ? full_name_split[2] : "",
          aadharNo: masked_aadhaar ? masked_aadhaar.slice(-4) : null,
          gender: gender === "M" ? "Male" : "Female",
        },
      ),
      this.leadApiLogService.delete([
        { column: "mobile_no", value: String(mobileNo) },
        { column: "api_type", value: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP },
        { column: "pancard", operator: "!=", value: pan_number },
      ]),
      this.userMetaModel.createOrUpdateUserMeta({
        customerID,
        type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
        data: leadApiLogsApiResponse,
        mobile: String(mobileNo),
      }),
    ];

    // if (address) {
    //   const addressData: InsertData<IAddress> = {
    //     customerID,
    //     address: address?.full,
    //     city: address?.city,
    //     state: address?.state,
    //     pincode: Number(address?.zip),
    //     status: "Verified",
    //     type: AddressType.PERMANENT_ADDRESS,
    //   };

    //   promises.push(this.addressService.create(addressData));
    // }

    await Promise.all(promises);

    // ! Update Step[OLD]
    // const stepDetails = await this.stepTrackermodel.createStepForLoanOnboarding(
    //   {
    //     currentStepOrder: step_order,
    //     customerID,
    //     productId: product_id,
    //     stepId: step_id,
    //     isCompleted: is_completed,
    //   },
    // )

    // ! Update Step[NEW]

    // await this.stepTrackermodel.completeStep(
    //   customerID,
    //   StepName.PAN_CONFIRMATION,
    //   Products.PAYDAY
    // );

    return this.serviceResponse(200, {}, "PAN details updated successfully.");
  };

  onBoardPanFetch = async (mobile: number, panNumber: string) => {
    const leadApiLogsApiResponse =
      await this.leadApiLogService.findPanComprehensiveResponseDigitap(
        panNumber,
        String(mobile),
      );

    return this.serviceResponse(
      200,
      leadApiLogsApiResponse ? leadApiLogsApiResponse : {},
      "PAN Details",
    );
  };

  onboardAadharVerificationGenerateOtp = async (
    payload: ISurePassSendAadharOtpPayload,
  ) => {
    const { aadharNo, customerID, mobileNo, customerAadharNo } = payload;

    // Check if
    if (
      customerAadharNo &&
      (payload?.dob_digit_match !== null || payload?.dob_digit_match == "1")
    ) {
      throw new BadRequestError("Customer Aadhar is already linked");
    }

    // Check if this aadhar already linked with another customer

    const surepassCheck = await this.leadApiLogService.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
        api_supplier: ApiSupplierType.SUREPASS,
        aadharNo: String(aadharNo),
      },
      ["mobile_no"],
      [{ column: "id", order: "desc" }],
    );

    if (surepassCheck && surepassCheck.mobile_no !== String(mobileNo)) {
      throw new BadRequestError(
        "This aadhaar number is associated with another existing account",
        {
          data: {
            mobileNo: maskString(surepassCheck.mobile_no, 6),
          },
        },
      );
    }

    // ! Also check digilocker - ! Removed due to expensive query
    // await this.checkDigilockerAadharExists(
    //   aadharNo,
    //   mobileNo,
    //   customerID,
    //   false,
    // )

    // Send OTP

    const resp = await this.surepassService.generateAadharOtpSurepass({
      aadharNo,
      customerID,
      mobileNo,
    });

    if (!resp.success) {
      throw new BadRequestError(
        "Aadhaar Verification Service is facing an issue, Please try other service",
        {
          data: {
            clientId: resp.data?.data?.client_id,
          },
        },
      );
    }

    return this.serviceResponse(200, {}, "OTP sent successfully.");
  };

  onboardAadharVerificationVerifyOtp = async (
    payload: IVerifyAadharOtpSurePassPayload,
  ) => {
    const { customerID, mobileNo, customerAadharNo, otp, aadharNo } = payload;
    // const { step_order, product_id, step_id, is_completed } = payload.userStep

    // Check if
    if (
      customerAadharNo &&
      (payload?.dob_digit_match !== null || payload?.dob_digit_match == "1")
    )
      throw new BadRequestError("Customer Aadhar is already linked");

    // Check if customer already has aadhar linked
    // Check if the aadhar entered is of same customer or not
    const customer = await this.customerService.findOne({ aadharNo }, [
      "mobile",
    ]);

    if (customer && customer?.mobile !== mobileNo) {
      logger.error(
        `Aadhar no ${aadharNo} is already linked to another mobile ${customer.mobile}`,
      );
      throw new BadRequestError(
        "This Aadhar Number is already linked with another account, Please enter a different Aadhar number",
      );
    }

    // Get the Send OTP response
    const leadLogs = await this.leadApiLogService.findAadharV2SendOtpResponse(
      aadharNo,
      String(mobileNo),
    );

    if (!leadLogs) {
      logger.error(
        `No data found for surepass ${LeadLogApiType.AADHAR_V2_GENERATE_OTP} for customer with id ${customerID}`,
      );
      throw new BadRequestError(
        "There was an issue in verifying your OTP. Please contact the administrator.",
      );
    }

    const resp = await this.surepassService.verifyAadharOtpSurepass({
      client_id: leadLogs.client_id,
      customerID,
      mobileNo,
      otp,
      aadharNo,
    });

    if (!resp.success) {
      logger.error(
        `Surepass submit otp hit error: ${
          resp?.data?.message ?? "Verify failure"
        }, with data ${JSON.stringify(resp.data)}`,
      );
      let errorMessage =
        "Aadhaar Verification Service is facing an issue. Please try other service.";

      if (resp?.data?.message === "OTP Already Submitted.") {
        errorMessage = "Your OTP has expired. Please request a new one.";
      }

      throw new BadRequestError(errorMessage);
    }

    // // Also check digilocker
    // await this.checkDigilockerAadharExists(
    //   aadharNo,
    //   mobileNo,
    //   customerID,
    //   false,
    // )

    let saveObject: InsertData<ILeadsApiLog> = {
      customerID: customerID,
      api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
      api_supplier: ApiSupplierType.SUREPASS,
      api_response: JSON.stringify(resp.data),
      status: resp.success ? 1 : 0,
      api_endpoint_url: config.surePassApi + SurePassApiUrl.AADHAR_SUBMIT,
      api_method: "POST",
      api_headers: JSON.stringify({
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.surePassToken}`,
      }),
      api_request: JSON.stringify({
        otp,
        client_id: leadLogs.client_id,
        aadhaar_pdf_generate: true,
      }),
      mobile_no: String(mobileNo),
      aadharNo,
    };

    // Create New Lead Here
    const newLeadId = await this.leadService.createNewLead(
      customerID,
      "New Case",
      payload.userIp,
    );

    let response = {
      loan_id: newLeadId.leadID,
      status: newLeadId.status,
    };

    await Promise.all([
      this.leadApiLogService.create(saveObject),
      this.customerModel.findOneAndUpdate({ customerID }, { aadharNo }),
    ]);

    return this.serviceResponse(
      200,
      response,
      "Aadhar details saved successfully.",
    );
  };

  onboardAadharPanMatch = async (
    mobileNo: string,
    customerID: number,
  ): Promise<{
    dobMatch: number;
    nameMatch: number;
    lastDigitsMatch: number;
    aadharNo?: string;
    isSurePassAadhar?: boolean;
    surePassAadharData: ISurePassVerifyAadharResponse["data"];
    digilockerAadharData: IDecentroEaadharResponse["data"];
    aadharExistsInPan: boolean;
  }> => {
    // Find aadhar and pan details from lead log
    let isSurePassAadhar = true;

    const matches = {
      dobMatch: 0,
      nameMatch: 0,
      lastDigitsMatch: 0,
      aadharNo: "XXXXXXXXXXXX",
      isSurePassAadhar: true,
      surePassAadharData: null,
      digilockerAadharData: null,
      aadharExistsInPan: true,
    };

    let [panDetails, aadhaarDetails, aadhaarDetailsDigilocker] =
      await Promise.all([
        this.leadApiLogService.findOne(
          {
            status: 1,
            api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
            api_supplier: ApiSupplierType.DIGITAP,
            mobile_no: mobileNo,
          },
          ["api_response"],
          [{ column: "id", order: "desc" }],
        ),
        this.leadApiLogService.findOne(
          {
            status: 1,
            api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
            api_supplier: ApiSupplierType.SUREPASS,
            mobile_no: String(mobileNo),
          },
          ["api_response"],
          [{ column: "id", order: "desc" }],
        ),
        this.leadApiLogService.findOne(
          {
            status: 1,
            api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
            api_supplier: ApiSupplierType.DECENTRO,
            mobile_no: String(mobileNo),
          },
          ["api_response"],
          [{ column: "id", order: "desc" }],
        ),
      ]);

    if (!panDetails) {
      panDetails = await this.leadApiLogService.findOne(
        {
          status: 1,
          api_type: LeadLogApiType.PAN_COMPREHENSIVE,
          api_supplier: ApiSupplierType.SUREPASS,
          mobile_no: mobileNo,
        },
        ["api_response"],
        [{ column: "id", order: "desc" }],
      );
    }

    if (!panDetails) {
      logger.warn(
        "Error in pan-aadhar match: Pan/Aadhar details don't exist in lead_log table for mobileNo: " +
          mobileNo,
      );
      return matches;
    }

    if (!aadhaarDetails && !aadhaarDetailsDigilocker) {
      logger.warn(
        "Error in pan-aadhar match: Pan/Aadhar details don't exist in lead_log table for mobileNo: " +
          mobileNo,
      );
      return matches;
    }

    if (!panDetails?.api_response) {
      logger.warn(
        "Error in pan-aadhar match: Pan/Aadhar api_response details don't exist in lead_log table for mobileNo: " +
          mobileNo,
      );

      return matches;
    }

    if (
      !aadhaarDetails?.api_response &&
      !aadhaarDetailsDigilocker?.api_response
    ) {
      logger.warn(
        "Error in pan-aadhar match: Pan/Aadhar api_response details don't exist in lead_log table for mobileNo: " +
          mobileNo,
      );

      return matches;
    }

    // Check which aadhar details exist

    if (!aadhaarDetails) {
      // This means aadharDigiLocker data exist
      isSurePassAadhar = false;
    }

    // If both aadhar details - surepass and digilocker exist, choose the latest entry
    if (aadhaarDetails && aadhaarDetailsDigilocker) {
      if (aadhaarDetails.id < aadhaarDetailsDigilocker.id) {
        isSurePassAadhar = false;
      }
      // else true, surepass wins
    }

    // Parse PAN response format (supports both Digitap and Surepass)
    const response = JSON.parse(panDetails.api_response);

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const convertDateFormat = (dateStr: string): string => {
      if (!dateStr) return "";
      try {
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      } catch (error) {
        return dateStr;
      }
    };

    let panResponse: {
      full_name: string;
      dob: string;
      masked_aadhaar: string;
    };

    // Check if it's Digitap format (has 'result' field)
    if (response.result) {
      const digitapResult = response.result;
      panResponse = {
        full_name: digitapResult.fullname,
        dob: convertDateFormat(digitapResult.dob),
        masked_aadhaar: digitapResult.aadhaar_number,
      };
    }
    // Check if it's Surepass format (has 'data' field)
    else if (response.data) {
      const surepassData = response.data;
      panResponse = {
        full_name: surepassData.full_name,
        dob: surepassData.dob, // Surepass already returns YYYY-MM-DD format
        masked_aadhaar: surepassData.masked_aadhaar,
      };
    } else {
      logger.error(
        "Invalid PAN response structure - neither Digitap nor Surepass format found",
      );
      return matches;
    }

    const {
      full_name: panFullName,
      dob: panDob,
      masked_aadhaar: panMaskedAadharNo,
    } = panResponse;

    // ! If aadhar not linked with pan / masked aadhar does not exist
    if (!panMaskedAadharNo) {
      matches.aadharExistsInPan = false;
    }

    if (isSurePassAadhar) {
      const aadarResponse = <ISurePassVerifyAadharResponse["data"]>(
        JSON.parse(aadhaarDetails.api_response).data
      );
      const {
        full_name: aadharFullName,
        dob: aadharDob,
        aadhaar_number: aadharNo,
      } = aadarResponse;

      let panAadhar = panMaskedAadharNo.slice(-4);
      let lastFourDigitsAadhar = aadharNo.slice(-4);

      // lastDIgitsMatch type = panLastDigit - aadharLastDigit
      const [nameMatch, dobMatch, lastDigitsMatch] = await Promise.all([
        await this.findBoxService.checkNamePercentage({
          firstName: panFullName,
          secondName: aadharFullName,
          type: "pan - aadhar",
          leadId: 0,
          customerID,
          customerMobileNo: mobileNo,
        }),
        await this.findBoxService.checkNamePercentage({
          firstName: panDob,
          secondName: aadharDob,
          type: "panDOB - aadharDOB",
          leadId: 0,
          customerID,
          customerMobileNo: mobileNo,
        }),
        await this.findBoxService.checkNamePercentage({
          firstName: panAadhar,
          secondName: lastFourDigitsAadhar,
          type: "panLastDigit - aadharLastDigit",
          leadId: 0,
          customerID,
          customerMobileNo: mobileNo,
        }),
      ]);

      matches.nameMatch = nameMatch.percentageResult;
      matches.dobMatch = dobMatch.percentageResult;
      matches.lastDigitsMatch = lastDigitsMatch.percentageResult;
      matches.surePassAadharData = aadarResponse;

      return matches;
    } else {
      const aadarResponse = <IDecentroEaadharResponse["data"]>(
        JSON.parse(aadhaarDetailsDigilocker.api_response).data
      );

      const {
        proofOfIdentity: { dob: aadharDob, name: aadharFullName },
        aadhaarUid: aadharNo,
      } = aadarResponse;

      let panAadhar = panMaskedAadharNo.slice(-4);
      let lastFourDigitsAadhar = aadharNo.slice(-4);

      const aadharDobFormatted = moment(aadharDob, "DD-MM-YYYY").format(
        "YYYY-MM-DD",
      );

      const [nameMatch, dobMatch, lastDigitsMatch] = await Promise.all([
        await this.findBoxService.checkNamePercentage({
          firstName: panFullName,
          secondName: aadharFullName,
          type: "pan - aadhar",
          leadId: 0,
          customerID,
          customerMobileNo: mobileNo,
        }),
        await this.findBoxService.checkNamePercentage({
          firstName: panDob,
          secondName: aadharDobFormatted,
          type: "panDOB - aadharDOB",
          leadId: 0,
          customerID,
          customerMobileNo: mobileNo,
        }),
        await this.findBoxService.checkNamePercentage({
          firstName: panAadhar,
          secondName: lastFourDigitsAadhar,
          type: "panLastDigit - aadharLastDigit",
          leadId: 0,
          customerID,
          customerMobileNo: mobileNo,
        }),
      ]);

      matches.nameMatch = nameMatch.percentageResult;
      matches.dobMatch = dobMatch.percentageResult;
      matches.lastDigitsMatch = lastDigitsMatch.percentageResult;
      matches.aadharNo = aadharNo;
      matches.isSurePassAadhar = false;
      matches.digilockerAadharData = aadarResponse;

      return matches;
    }
  };

  onboardAadharInitiateDigiLocker = async (
    payload: IAadharVerificationInitiateDigiLockerPayload,
  ) => {
    const { customerID, mobile, callBackUrl, customerAadharNo } = payload;

    if (
      customerAadharNo &&
      (payload?.dob_digit_match !== null || payload?.dob_digit_match == "1")
    ) {
      throw new BadRequestError("Customer Aadhar is already linked");
    }

    // Call digilocker-decentro api

    const resp = await this.digiLockerService.initiateDigiLockerAadhar(
      customerID,
      mobile,
      callBackUrl,
    );

    if (!resp.success) {
      logger.error("Error in Decentro API: " + JSON.stringify(resp.data));
      throw new BadRequestError("DigiLocker service is currently unavailable");
    }

    return this.serviceResponse(
      200,
      { url: resp.data.data.authorizationUrl },
      "Initiate Digilocker URL",
    );
  };

  onboardAadharInitiateDigiLockerSurepass = async (
    payload: IAadharVerificationInitiateSurepassDigiLockerPayload,
  ) => {
    const { customerID, mobile, name, email, callBackUrl, customerAadharNo } =
      payload;

    if (
      customerAadharNo &&
      (payload?.dob_digit_match !== null || payload?.dob_digit_match == "1")
    ) {
      throw new BadRequestError("Customer Aadhar is already linked");
    }

    // Call digilocker-decentro api

    /* const resp = await this.surepassService.initiateDigiLockerAadhar(
      customerID,
      mobile.toString(),
      callBackUrl,
      name,
      email,
    ); */

    const resp = await this.digitapNewService.initiateDigitapDigiLockerAadhar(
      customerID,
      mobile.toString(),
      callBackUrl,
      name,
      email,
    );

    console.log("=================>Initiate Digilocker", resp);

    if (!resp.success) {
      logger.error("Error in Decentro API: " + JSON.stringify(resp.data));
      throw new BadRequestError("DigiLocker service is currently unavailable");
    }

    return this.serviceResponse(
      200,
      { url: resp.data.url },
      "Initiate Digilocker URL",
    );
  };

  aadharVerificationWebhookDigiLocker = async (
    payload: IAadharVerificationWebhookDigiLockerSurepass,
  ) => {
    try {
      const { state, client_id, customerID, mobile } = payload;

      const digilockerStatusResponse =
        await this.digiLockerService.getSurepassDigilockerStatus(
          client_id,
          customerID,
          mobile,
        );

      if (
        !digilockerStatusResponse.success ||
        !digilockerStatusResponse.data.data.completed
      ) {
        throw new BadRequestError(
          digilockerStatusResponse.data.message ??
            "Failed to get the aadhaar download status",
          { data: digilockerStatusResponse.data },
        );
      }

      const digilockerDocumentListResponse =
        await this.digiLockerService.getSurepassDigilockerDocumentList(
          client_id,
          customerID,
          mobile,
        );
      const { success, data } = digilockerDocumentListResponse;
      const documents = data?.data?.documents ?? [];

      if (!success || documents.length === 0) {
        throw new BadRequestError(
          data.message || "Failed to get the Aadhaar document",
          { data },
        );
      }

      const aadhaarDocXml = documents.find(
        (doc) =>
          doc.doc_type === "ADHAR" && doc.file_id.startsWith("digilocker"),
      );

      const aadhaarDocPdf = documents.find(
        (doc) => doc.doc_type === "ADHAR" && doc.file_id.startsWith("aadhaar"),
      );

      if (!aadhaarDocXml) {
        throw new BadRequestError("Aadhaar Document does not exist");
      }

      const document_id = aadhaarDocXml.file_id;

      const digilockerDocumentDownloadResponse =
        await this.digiLockerService.downloadSurepassDigilockerDocument(
          client_id,
          document_id,
          customerID,
          mobile,
        );
      const { success: downloadSuccess, data: downloadData } =
        digilockerDocumentDownloadResponse;

      const downloadUrlXml = downloadData?.data?.download_url;
      if (!downloadSuccess || !downloadUrlXml) {
        throw new BadRequestError(
          downloadData.message || "Failed to download Aadhaar document",
          { data: downloadData },
        );
      }

      const responseXmlData = await axios.get(downloadUrlXml, {
        responseType: "text",
        headers: {
          Accept: "application/xml",
        },
      });

      const xmlData = responseXmlData.data;
      let aadhaarNumber = "";
      let aadhaarDob = "";
      let aadhaarGender = "";
      let aadhaarName = "";
      let customerAddress = "";
      let customerCity = "";
      let customerState = "";
      let customerPincode = null;
      let surePassAadhaarResponse = "";
      let customerHouse = "";
      let status = 1;
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(xmlData);
      if (result?.Certificate?.CertificateData?.KycRes) {
        surePassAadhaarResponse = result.Certificate.CertificateData.KycRes;
        const aadhaarData = result?.Certificate?.CertificateData?.KycRes;
        if (aadhaarData?.UidData) {
          const { UidData } = aadhaarData;
          const { $: uidAttributes, Poi, Poa } = UidData;

          aadhaarNumber = uidAttributes?.uid || "";
          aadhaarDob = Poi?.["$"]?.dob || "";
          aadhaarGender = Poi?.["$"]?.gender || "";
          aadhaarName = Poi?.["$"]?.name || "";

          const address = Poa?.["$"] || {};
          const {
            co = "",
            house = "",
            street = "",
            lm = "",
            loc = "",
            po = "",
            vtc = "",
            subdist = "",
            dist = "",
            state = "",
            pc = "",
            country = "",
          } = address;

          const parts = [
            co,
            house,
            street,
            lm || loc,
            po,
            vtc,
            subdist,
            dist,
            state,
            pc,
            country,
          ].filter(Boolean);
          customerAddress = parts.join(", ");
          customerHouse = house;
          customerCity = vtc || dist;
          customerState = state;
          customerPincode = pc;
        }

        // Check pincode is servicesable or not

        if (isPincodeBlocked(customerPincode)) {
          throw new BadRequestError("Service not available in this area", {
            data: {
              pincode: customerPincode,
            },
          });
        }

        const getCustomerData = await this.customerService.findOne({
          customerID,
        });

        if (aadhaarName) {
          await this.customerService.updateOne(
            { customerID },
            { aadhaarName: aadhaarName },
          );
        }

        // DOB Match (100%)
        const panLeadApiLogData =
          await this.leadApiLogService.findPanComprehensiveResponseByCustomerIDDigitap(
            customerID,
          );
        if (!panLeadApiLogData) {
          throw new BadRequestError("Failed to get PAN CARD data", {
            data: null,
          });
        }
        const dobMatchResponse = await matchPanAadhaarDob(
          aadhaarDob,
          panLeadApiLogData.dob,
        );
        if (!dobMatchResponse) {
          throw new BadRequestError("Aadhaar DOB and PAN DOB didn't match");
        }
        /* if (
          aadhaarNumber.slice(-4) !== panLeadApiLogData.masked_aadhaar.slice(-4)
        ) {
          throw new BadRequestError("Aadhaar Number didn't match");
        } */

        // --------------------
        // Aadhaar Number Match Logic (With Fallback)
        // --------------------

        const fullAadhaar = String(aadhaarNumber || "").replace(/\s/g, "");
        const maskedAadhaar = String(
          panLeadApiLogData.masked_aadhaar || "",
        ).replace(/\s/g, "");

        let aadhaarMatched = false;

        // 1️⃣ Primary Check → Last 4 digits
        if (
          fullAadhaar.slice(-4) === maskedAadhaar.slice(-4) &&
          /^\d{4}$/.test(maskedAadhaar.slice(-4))
        ) {
          aadhaarMatched = true;
        }

        // 2️⃣ Fallback → First 2 + Last 2
        if (!aadhaarMatched) {
          const first2Full = fullAadhaar.slice(0, 2);
          const last2Full = fullAadhaar.slice(-2);

          const first2Masked = maskedAadhaar.slice(0, 2);
          const last2Masked = maskedAadhaar.slice(-2);

          if (
            /^\d{2}$/.test(first2Masked) &&
            /^\d{2}$/.test(last2Masked) &&
            first2Full === first2Masked &&
            last2Full === last2Masked
          ) {
            aadhaarMatched = true;
          }
        }

        // 3️⃣ Fallback → Only Last 2
        if (!aadhaarMatched) {
          const last2Full = fullAadhaar.slice(-2);
          const last2Masked = maskedAadhaar.slice(-2);

          if (/^\d{2}$/.test(last2Masked) && last2Full === last2Masked) {
            aadhaarMatched = true;
          }
        }

        // Final Decision
        if (!aadhaarMatched) {
          throw new BadRequestError("Aadhaar Number didn't match");
        }
        const nameMatchResponse = await getNameMatchPercentage(
          getCustomerData.name,
          aadhaarName,
        );
        if (nameMatchResponse < 70) {
          throw new BadRequestError("Aadhaar Name didn't match with PAN Name");
        }
        const baseRecordData = {
          customer_id: customerID,
          lead_id: 0,
          mobile_no: mobile.toString(),
        };
        const recordsToCreate = [
          // DOB match record
          {
            ...baseRecordData,
            type: NameMatchType.AADHAAR_PAN_DOB_DIGILOCKER,
            first_name: aadhaarDob,
            second_name: panLeadApiLogData.dob,
            percentage: "100",
            percentage_data: JSON.stringify({
              pandob: panLeadApiLogData.dob,
              aadhaardob: aadhaarDob,
              percentage: 100,
            }),
            status: 1,
          },
          // Name match record
          {
            ...baseRecordData,
            type: NameMatchType.AADHAAR_PAN_NAME_DIGILOCKER,
            first_name: panLeadApiLogData.full_name,
            second_name: aadhaarName,
            percentage: String(nameMatchResponse),
            percentage_data: JSON.stringify({
              panName: panLeadApiLogData.full_name,
              aadhaarName,
              percentage: nameMatchResponse,
            }),
            status: nameMatchResponse >= 70 ? 1 : 0,
          },
        ];
        await Promise.all(
          recordsToCreate.map((record) =>
            customerNameMatchservice.create(record),
          ),
        );
      } else {
        throw new BadRequestError("Unable to fetch Aadhaar Details");
      }
      const saveObject: InsertData<ILeadsApiLog> = {
        customerID,
        api_type: LeadLogApiType.SUREPASS_DIGILOCKER_EAADHAAR,
        api_supplier: ApiSupplierType.SUREPASS,
        api_response: JSON.stringify(surePassAadhaarResponse),
        status: status,
        api_endpoint_url:
          config.surePassApi + SurepassDigilockerApiUrl.DOWNLOAD,
        api_method: "POST",
        api_headers: JSON.stringify({
          accept: "application/json",
          "content-type": "application/json",
        }),
        api_request: "",
        mobile_no: mobile.toString(),
        entity_id: state,
        aadharNo: aadhaarNumber.slice(-4),
      };

      await this.leadApiLogService.create(saveObject);

      const folder = `surepass/digilocker/aadhaar/${customerID}`;
      if (downloadUrlXml) {
        await this.s3Service.uploadFromSignedUrl(
          downloadUrlXml,
          folder,
          `${customerID}_aadhaar_xml`,
          true,
        );
      }
      let customerAadhaar;
      if (aadhaarDocPdf) {
        const document_id_pdf = aadhaarDocPdf.file_id;

        const digilockerDocumentDownloadResponsePdf =
          await this.digiLockerService.downloadSurepassDigilockerDocument(
            client_id,
            document_id_pdf,
            customerID,
            mobile,
          );
        const { success: downloadSuccessPdf, data: downloadDataPdf } =
          digilockerDocumentDownloadResponsePdf;

        const downloadUrlPdf = downloadDataPdf?.data?.download_url;
        if (!downloadSuccessPdf || !downloadUrlPdf) {
          throw new BadRequestError(
            downloadDataPdf.message ||
              "Failed to download Aadhaar document pdf format",
            { data: downloadDataPdf },
          );
        }

        customerAadhaar = await this.s3Service.uploadFromSignedUrl(
          downloadUrlPdf,
          folder,
          `${customerID}_aadhaar.pdf`,
          false,
        );
      }

      // TODO: RAJESH
      if (customerAadhaar) {
        await documentModel.insert({
          customerID,
          type: "Aadhar Card",
          documentType: "Aadhar Card",
          documentFile: customerAadhaar.Key,
          status: "Verified",
          uploadBy: customerID,
          uploadedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          verifiedBy: customerID,
          verifiedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          upload_platform: "S3",
        });
      }

      const existingAddress = await this.addressService.findOne(
        { customerID },
        ["addressID"],
        [{ column: "addressID", order: "desc" }],
      );

      const addressPayload = {
        customerID,
        address: customerAddress,
        city: customerCity || "",
        state: customerState || "",
        pincode: customerPincode,
        landmark: "",
        fetchedBy: "DigiLocker Surepass",
        status: "Verified" as const,
        verifiedBy: 1,
        type: existingAddress ? existingAddress.type : "Current Address",
      };

      if (existingAddress) {
        await this.addressService.updateOne({ customerID }, addressPayload);
      } else {
        await this.addressService.create(addressPayload);
      }

      return this.serviceResponse(200, {}, "Success");
    } catch (error) {
      if (error instanceof Error) {
        return this.serviceResponse(400, {}, error.message);
      }
      return this.serviceResponse(400, {}, "Unknown error");
    }
  };

  aadharPanVerifyMatch = async (customerID: number, mobile: string) => {
    const matches = await this.onboardAadharPanMatch(mobile, customerID);

    // match should be 100
    const customerTableUpdate: Partial<ICustomer> = {
      dob_digit_match: "0",
      is_dob_match: "No",
      is_pan_aadhar_linked: "No",
      // aadharNo: null,
    };

    let addressData: InsertData<IAddress>;

    let errorResponseData = {
      isAadharLinked: false,
      isDobNameMatch: false,
      route: "/dashboard",
    };

    matches.isSurePassAadhar
      ? (addressData = {
          customerID,
          address: `${matches.surePassAadharData?.address?.house ?? ""} . ${
            matches.surePassAadharData?.address?.street ?? ""
          } ${matches.surePassAadharData?.address?.subdist ?? ""} ${
            matches.surePassAadharData?.address?.po ?? ""
          }`,
          city: matches.surePassAadharData?.address?.dist ?? "",
          state: matches.surePassAadharData?.address?.state,
          pincode: matches.surePassAadharData?.zip
            ? Number(matches.surePassAadharData?.zip)
            : 0,
          status: "Verified",
          type: AddressType.PERMANENT_ADDRESS,
        })
      : (addressData = {
          customerID,
          address: `${
            matches.digilockerAadharData?.proofOfAddress?.careOf ?? ""
          } . ${matches.digilockerAadharData?.proofOfAddress?.house ?? ""} ${
            matches.digilockerAadharData?.proofOfAddress?.street ?? ""
          } ${matches.digilockerAadharData?.proofOfAddress?.locality ?? ""}`,
          city: matches.digilockerAadharData?.proofOfAddress?.district ?? "",
          state: matches.digilockerAadharData?.proofOfAddress?.state,
          pincode: matches.digilockerAadharData?.proofOfAddress?.pincode
            ? Number(matches.digilockerAadharData?.proofOfAddress?.pincode)
            : 0,
          status: "Verified",
          type: AddressType.PERMANENT_ADDRESS,
        });

    await Promise.all([
      this.addressService.create(addressData),
      matches.isSurePassAadhar
        ? this.userMetaModel.createOrUpdateUserMeta({
            customerID,
            type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
            data: matches.surePassAadharData,
            mobile,
          })
        : this.userMetaModel.createOrUpdateUserMeta({
            customerID,
            type: LeadLogApiType.DIGILOCKER_EAADHAR,
            data: matches.digilockerAadharData,
            mobile,
          }),
    ]);

    if (!matches.aadharExistsInPan) {
      // ! Customer need to reverify PAN,[Surepass will be hit again]

      // if aadhar not in pan, but name match, and dob match , then we will complete aadhar step else not complete it

      if (matches.dobMatch === 100) {
        const promises: any[] = [
          this.customerService.updateOne(
            { customerID },
            {
              dob_digit_match: "0",
              is_dob_match: "Yes",
              is_pan_aadhar_linked: "No",
              // aadharNo: matches.isSurePassAadhar
              //   ? matches.surePassAadharData.aadhaar_number
              //   : null,
            },
          ),
        ];

        await Promise.all(promises);

        errorResponseData.isDobNameMatch = true;
      } else {
        // Aadhar details are not fine, hence step will not be completed

        // customerTableUpdate.aadharNo = matches.isSurePassAadhar
        //   ? matches.surePassAadharData.aadhaar_number
        //   : null

        await this.customerService.updateOne(
          {
            customerID,
          },
          customerTableUpdate,
        );

        // await this.stepTrackermodel.completeStep(
        //   customerID,
        //   StepName.AADHAR_CONFIRMATION,
        //   Products.PAYDAY,
        // )
      }

      throw new BadRequestError(
        "Your PAN is not linked with your aadhar, Please Re-Verify",
        {
          data: errorResponseData,
        },
      );
    }

    if (matches.dobMatch === 100) {
      customerTableUpdate.is_dob_match = "Yes";

      await this.customerService.updateOne({ customerID }, customerTableUpdate);
    }

    if (matches.dobMatch !== 100) {
      errorResponseData.isAadharLinked = true;

      await this.customerService.updateOne(
        { customerID },
        {
          dob_digit_match: "0",
          is_dob_match: "No",
          is_pan_aadhar_linked: "Yes",
          // aadharNo: matches.isSurePassAadhar
          //   ? matches.surePassAadharData.aadhaar_number
          //   : null,
        },
      );

      throw new BadRequestError(
        "Your Aadhar DOB does not match your PAN's DOB",
        { data: errorResponseData },
      );
    }
    if (matches.lastDigitsMatch !== 100) {
      errorResponseData.isAadharLinked = true;

      await this.customerService.updateOne(
        { customerID },
        {
          dob_digit_match: "0",
          is_dob_match: "Yes",
          is_pan_aadhar_linked: "Yes",
          // aadharNo: matches.isSurePassAadhar
          //   ? matches.surePassAadharData.aadhaar_number
          //   : null,
        },
      );
      throw new BadRequestError("Your Aadhar/PAN is unverified", {
        data: errorResponseData,
      });
    }
    // if (matches.nameMatch !== 100) {
    //   errorResponseData.isAadharLinked = true
    //   throw new BadRequestError("Your Aadhar and PAN's name do not match", {
    //     data: errorResponseData,
    //   })
    // }

    // Update record in db telling customer table that everything is verified

    // Save Aadhar address to DB

    // Add data to userMeta

    const promises: any[] = [
      this.customerService.updateOne(
        { customerID },
        {
          dob_digit_match: "1",
          is_dob_match: "Yes",
          is_pan_aadhar_linked: "Yes",
          // aadharNo: matches.isSurePassAadhar
          //   ? matches.surePassAadharData.aadhaar_number
          //   : null,
        },
      ),
      // this.stepTrackermodel.completeStep(
      //   customerID,
      //   StepName.AADHAR_CONFIRMATION,
      //   Products.PAYDAY
      // ),
    ];

    await Promise.all(promises);

    return this.serviceResponse(200, {}, "Aadhar/PAN Verified");
  };

  aadharPanReverify = async (
    customer: ICustomer,
  ): Promise<IServiceResponse> => {
    // ! TO_TEST
    const { customerID, is_pan_aadhar_linked, pancard, mobile } = customer;

    if (is_pan_aadhar_linked === "Yes") {
      return this.serviceResponse(
        HttpStatusCode.Ok,
        { status: 1 },
        "PAN is already linked with aadhar",
      );
    }

    if (!pancard) {
      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          status: 0,
          route: "/enter-your-pan",
        },
        "PAN details not found",
      );
    }

    // Remove existing

    // 1. Remove current pan details from lead api logs

    await this.leadApiLogService.delete([
      { column: "api_type", value: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP },
      { column: "mobile_no", value: String(customer.mobile) },
      { column: "pancard", value: pancard },
    ]);

    // 2. After deleting, re-fetch PAN details from surepass

    await this.onboardPanVerification({
      customerID,
      customerPanCardNo: pancard,
      mobileNo: +mobile,
      pan: pancard,
    });

    // 3. dob Mismatch logic will hit again

    const { data, message, statusCode } = await this.aadharPanVerifyMatch(
      customerID,
      String(mobile),
    );

    await this.callhistoryLogModel.insert({
      customerID,
      leadID: 0,
      callType: CallType.IVR,
      status: "Pan Aadhaar Linked Checks",
      remark: message,
      noteli: message,
      callbackTime: momentTz
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss") as unknown as Date,
      calledBy: +config.defaultUserId,
      createdDate: momentTz
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss") as unknown as Date,
      appAmount: "",
    });

    return this.serviceResponse(statusCode, data, message);
  };

  newCustomerOnboardingV1 = async ({
    customerId,
    residenceAddress,
    city,
    state,
    pincode,
    finboxCallBackUrl,
  }: INewCustomerOnboardingInput): Promise<INewCustomerOnboardingResponse> => {
    try {
      const finboxService = new FinboxService();
      const customerData = await this.customerService.findOne(
        { customerID: customerId },
        ["*"],
      );
      const dob = new Date(customerData.dob);
      const currentDate = new Date(Date.now());
      const age = currentDate.getFullYear() - dob.getFullYear();

      if (age < 18 || age > 58) {
        return {
          statusCode: 0,
          MessageCode: "Oops! Please Contact Customer Care.",
        };
      }
      const mobile = String(customerData.mobile);
      const leadData = await this.leadService.findOne(
        { customerID: customerId },
        ["*"],
        [{ column: "leadID", order: "desc" }],
      );
      let leadID = leadData.leadID;
      if (
        leadData.monthlyIncome >= 20000 &&
        leadData.salaryMode === "Bank Transfer"
      ) {
        if (leadData) {
          let finboxBankConnect: any = {};
          const rspo = await autoApproveNewCustomerUsingCibilAndBRE(
            leadID,
            mobile,
            customerData.pancard,
            pincode,
            state,
            customerData.name,
            residenceAddress,
          );

          let pageName: string;
          let DataCode: {};

          if (rspo.status === "1" && rspo.message === "Approved") {
            pageName = "approval";
            DataCode = { leadID, pageName };
          } else if (
            rspo.status === "1" &&
            rspo.message === "Proceed to Bank"
          ) {
            pageName = "finbox";
            DataCode = { leadID, pageName };
          } else if (rspo.status === "1" && rspo.message === "Reject") {
            pageName = "rejected";
            DataCode = { leadID, pageName };
          } else if (rspo.status === "1") {
            finboxBankConnect = {};
            pageName = "approval";
          } else {
            const redirect_url =
              finboxCallBackUrl ??
              `${config.frontendBaseUrl}${FinboxUrls.CREATE_URL}`;
            if (
              rspo.message === "Cibil Rejected" ||
              rspo.message === "Dtree Bre Rejected"
            ) {
              pageName = "rejected";
              await this.leadService.updateOne(
                { leadID },
                { status: LeadStatus.REJECTED_PROCESS, sanctionalloUID: 1 },
              );
              const now = new Date();
              const sixDaysDate = new Date(now);
              sixDaysDate.setDate(now.getDate() + 6);
              let saveDataApproval = {
                customerID: customerData.customerID,
                leadID,
                branch: "Delhi",
                loanAmtApproved: 0,
                tenure: 6,
                roi: +config.rate_of_interest,
                repayDate: sixDaysDate,
                adminFee: 0,
                GstOfAdminFee: 0,
                alternateMobile: mobile,
                officialEmail: customerData.email,
                cibil: 0,
                activeLoans: 0,
                status: ApprovalStatus.RejectedProcess,
                creditedBy: 1,
                createdDate: currentDate,
                remark: rspo.score
                  ? "Cibil score below 600"
                  : "Rejected from BRE.",
                employmentType: customerData.employeeType,
              };
              await this.approvalModel.insert(saveDataApproval);
              let saveDataCallHistoryLog = {
                customerID: customerData.customerID,
                leadID,
                callType: "IVR",
                status: "Rejected Process",
                noteli: "Rejected Process",
                remark: rspo.score
                  ? `Cibil ${rspo.score}`
                  : "Rejected from BRE.",
                callbackTime: currentDate,
                calledBy: 1,
                createdDate: currentDate,
              };
              await this.callhistoryLogModel.insert(saveDataCallHistoryLog);

              finboxBankConnect = {
                apimsg: {
                  redirect_url:
                    finboxCallBackUrl ??
                    "https://www.ramfincorp.com/back_to_application",
                },
              };
            } else {
              const logo_url = `${redirect_url}/public/logo.png`;

              finboxBankConnect = await finboxService.bankConnect({
                link_id: mobile,
                redirect_url,
                logo_url,
              });
              pageName = "finbox";
            }
          }

          DataCode = { leadID, Finbox_URL: finboxBankConnect, pageName };
          return {
            statusCode: 1,
            MessageCode: "Customer Approved",
            DataCode,
          };
        }
      } else {
        return {
          statusCode: 0,
          MessageCode: "Sorry, You Are Not Eligible For Loan",
        };
      }
    } catch (error) {
      console.error("Error during new customer onboarding:", error);
      return { statusCode: 0, MessageCode: "Internal Server Error" };
    }
  };

  // Penny Drop - 1

  pennyDrop = async (payload: IPennyDropInitiatePayload) => {
    const {
      loan_id: leadId,
      account_id: accountId,
      customer: { customerID, name, mobile, email, aadharNo, pancard },
    } = payload;

    // Find User's payout account details
    const userAccount = await this.customerAccountModel.findOne({
      where: { accountID: accountId, customerID },
      select: ["accountNo", "bankIfsc", "leadID", "bank"],
    });

    if (!userAccount) throw new NotFoundError("User account details not found");

    // Penny Drop bypass
    if (config.nodeEnv !== "production") {
      const pennyIdDummy = await this.pennyDropModel.insert({
        account_number: userAccount.accountNo,
        bank_name: userAccount.bank,
        customerID: String(customerID),
        ifsc: userAccount.bankIfsc,
        leadID: String(leadId),
        logs: JSON.stringify({ bypass: true }),
        name,
        p_id: generatePennyDropId(),
        penny_status: "completed", // completed
        uid: config.defaultUserId,
        account_status: "active", // active
        registered_name: name,
      });

      // await this.stepTrackermodel.completeStep(
      //   customerID,
      //   StepName.PENNY_DROP,
      //   Products.PAYDAY,
      //   leadId
      // );

      return this.serviceResponse(
        200,
        {
          pennyStatus: "completed",
          metaData: {
            pennyDropId: pennyIdDummy[0],
          },
        },
        "Your Bank Details have been verified",
      );
    }

    // Get any existing penny drop details

    const userPennyDrop = await this.pennyDropModel.findOne({
      where: (query) => {
        query.where("customerID", customerID);
        query.where("account_number", userAccount.accountNo);
        query.where(function (innerQuery) {
          innerQuery
            .where(function (insideQuery) {
              insideQuery
                .where("penny_status", PennyStatus.COMPLETED)
                .whereNotNull("account_status");
            })
            .orWhere("penny_status", PennyStatus.CREATED);
        });
      },
      order: [{ column: "id", order: "desc" }],
      select: [
        "penny_status",
        "id",
        "penny_drop_name_match",
        "account_status",
        "p_id",
        "leadID",
      ],
    });

    // If penny drop exists for the user then

    if (
      userPennyDrop?.penny_drop_name_match === PennyDropNameMatchStatus.REJECT
    ) {
      logger.error("Penny Drop rejected");
      throw new BadRequestError("Your account has been rejected", {
        data: {
          pennyStatus: PennyStatus.REJECTED,
          metaData: {
            pennyDropId: userPennyDrop.id,
          },
        },
      });
    } else if (
      userPennyDrop?.penny_drop_name_match ===
      PennyDropNameMatchStatus.NAME_MISMATCH
    ) {
      logger.error("Penny Drop name mismatch");
      throw new BadRequestError(
        "Your Bank name and PAN/Aadhar name are not matching, Please contact customer support",
        {
          data: {
            pennyStatus: PennyStatus.NAME_MISMATCH,
            metaData: {
              pennyDropId: userPennyDrop.id,
            },
          },
        },
      );
    }

    if (
      userPennyDrop?.penny_drop_name_match ===
      PennyDropNameMatchStatus.ALLOW_NAME_MISMATCH
    ) {
      await this.pennyDropModel.findOneAndUpdate(
        { id: userPennyDrop.id },
        {
          penny_status: PennyStatus.COMPLETED,
          penny_drop_name_match: PennyDropNameMatchStatus.ACCEPTED,
        },
      );

      // await this.stepTrackermodel.completeStep(
      //   customerID,
      //   StepName.PENNY_DROP,
      //   Products.PAYDAY,
      //   leadId
      // );

      return this.serviceResponse(
        200,
        {
          pennyStatus: PennyStatus.COMPLETED,
          metaData: {
            pennyDropId: userPennyDrop.id,
          },
        },
        "Your Bank Details have been verified",
      );
    }

    // Hit razorPay Api to check latest status:

    if (userPennyDrop?.penny_status === PennyStatus.CREATED) {
      // Re Verify updated status
      const verifyTransactionPayload =
        await this.razorPayPayments.verifyFundTransaction(
          customerID,
          Number(userPennyDrop.leadID),
          { p_id: userPennyDrop.p_id },
        );

      if (!verifyTransactionPayload.success) {
        logger.error("Error in RazorPay Validate Transacation API");
        throw new BadRequestError(
          "An Issue occured in verifying your bank account",
          {
            data: {
              pennyStatus: PennyStatus.CREATED,
              metaData: {
                pennyDropId: userPennyDrop.id,
              },
            },
          },
        );
      }
      // If validate failed then throw error
      if (
        verifyTransactionPayload.data.status === RazorPayValidateStatus.FAILED
      ) {
        logger.error("RazorPay Validate Account API sent status of FAILED");

        await this.pennyDropModel.findOneAndUpdate(
          { id: userPennyDrop.id },
          {
            penny_status: PennyStatus.FAILED,
          },
        );
        throw new BadRequestError(
          "Failed to validate your bank details. Please try again in a few minutes.",
          {
            data: {
              pennyStatus: PennyStatus.FAILED,
              metaData: {
                pennyDropId: userPennyDrop.id,
              },
            },
          },
        );
      }

      // If validate created then
      if (
        verifyTransactionPayload.data.status === RazorPayValidateStatus.CREATED
      ) {
        logger.warn("RazorPay Validate Account API sent status of CREATED");
        return this.serviceResponse(
          200,
          {
            pennyStatus: PennyStatus.CREATED,
            metaData: {
              pennyDropId: userPennyDrop.id,
            },
          },
          "Account Validation in progress",
        );
      }

      // Rpay gave Status of Completed
      // Account status has null value, which means bank details are invalid
      if (!verifyTransactionPayload.data?.results?.account_status) {
        throw new BadRequestError("Account is invalid", {
          data: {
            pennyStatus: PennyStatus.INVALID,
            metaData: { pennyDropId: userPennyDrop.id },
          },
        });
      }

      if (verifyTransactionPayload.data?.results?.account_status == "invalid") {
        throw new BadRequestError("Bank details provided are invalid", {
          data: {
            pennyStatus: PennyStatus.INVALID,
            metaData: { pennyDropId: userPennyDrop.id },
          },
        });
      }

      const isNameMatch = await this.pennyDropNameMatch({
        aadharNo,
        customerID,
        leadID: Number(leadId),
        mobile: String(mobile),
        pancard,
        verifyTransactionPayload: verifyTransactionPayload.data,
      });

      if (!isNameMatch) {
        logger.error("Bank Name mismatch with PAN/Aadhar");

        await this.pennyDropModel.findOneAndUpdate(
          { id: userPennyDrop.id },
          {
            account_status:
              verifyTransactionPayload.data?.results?.account_status,
            registered_name:
              verifyTransactionPayload.data?.results?.registered_name,
            penny_drop_name_match: PennyDropNameMatchStatus.NAME_MISMATCH,
          },
        );

        // If registered name not found
        if (!verifyTransactionPayload.data?.results?.registered_name) {
          throw new BadRequestError(
            "Could not find any registered name linked with your bank account at the moment, Please try again later",
            {
              data: {
                pennyStatus: PennyStatus.INVALID,
                metaData: { pennyDropId: userPennyDrop.id },
              },
            },
          );
        }

        throw new BadRequestError(
          "Your Bank name and PAN/Aadhar name are not matching, Please contact customer support",
          {
            data: {
              pennyStatus: PennyStatus.NAME_MISMATCH,
              metaData: {
                pennyDropId: userPennyDrop.id,
              },
            },
          },
        );
      }

      await this.pennyDropModel.findOneAndUpdate(
        { id: userPennyDrop.id },
        {
          account_status:
            verifyTransactionPayload.data?.results?.account_status,
          registered_name:
            verifyTransactionPayload.data?.results?.registered_name,
          penny_status: verifyTransactionPayload.data?.status,
        },
      );

      // await this.stepTrackermodel.completeStep(
      //   customerID,
      //   StepName.PENNY_DROP,
      //   Products.PAYDAY,
      //   leadId
      // );

      return this.serviceResponse(
        200,
        {
          pennyStatus: verifyTransactionPayload.data.status,
          metaData: {
            pennyDropId: userPennyDrop.id,
          },
        },
        "Your Bank Details have been verified",
      );
    }

    // If penny drop status is already completed
    if (userPennyDrop?.penny_status === PennyStatus.COMPLETED) {
      logger.info("User penny drop is already completed");

      // await this.stepTrackermodel.completeStep(
      //   customerID,
      //   StepName.PENNY_DROP,
      //   Products.PAYDAY,
      //   leadId
      // );

      return this.serviceResponse(
        200,
        {
          pennyStatus: PennyStatus.COMPLETED,
          metaData: {
            pennyDropId: userPennyDrop.id,
          },
        },
        "Your account has been already validated'",
      );
    }

    // If penny drop does not exist or if failed case , hit razorpay flow

    const note = `${name}-${leadId}-${generateRandomNumber(1111, 9999)}`;
    const referenceId = `${name}-${mobile}`;

    const createContactPayload: IRazorPayContactsRequest = {
      contact: mobile,
      email,
      name,
      notes: {
        notes_key_1: note,
        notes_key_2: note,
      },
      reference_id: referenceId.substring(0, 39),
      type: RazorPayContactType.CUSTOMER,
    };

    const contactResp = await this.razorPayPayments.createContact(
      customerID,
      Number(leadId),
      createContactPayload,
    );

    if (!contactResp.success) {
      logger.error("Error in RazorPay Contacts API");
      throw new BadRequestError(
        "An Issue occured in initializing the bank verification process",
        {
          data: {
            pennyStatus: PennyStatus.INCOMPLETE,
            metaData: {
              pennyDropId: null,
            },
          },
        },
      );
    }

    // Now hit fund_account to create user's fund account
    const createFundAccountPayload: IRazorPayCreateFundAccountRequest = {
      contact_id: contactResp.data.id,
      account_type: "bank_account",
      bank_account: {
        account_number: userAccount.accountNo,
        ifsc: userAccount.bankIfsc,
        name,
      },
    };

    const createFundAccountResp = await this.razorPayPayments.createFundAccount(
      customerID,
      Number(leadId),
      createFundAccountPayload,
    );

    if (!createFundAccountResp.success) {
      logger.error("Error in RazorPay Fund Account API");
      throw new BadRequestError(
        "An Issue occured initializing the bank verification process",
        {
          data: {
            pennyStatus: PennyStatus.INCOMPLETE,
            metaData: {
              pennyDropId: null,
            },
          },
        },
      );
    }

    // Now hit validate account api to make the penny drop

    const validateFundAccountPayload: IRazorPayValidateAccountRequest = {
      account_number: config.razorPayPennyDropAccountNo,
      amount: Number(config.pennyDropAmount), // in paisa
      currency: "INR",
      notes: {
        random_key_1: name,
        random_key_2: "Payouts Account Validation",
      },
      fund_account: {
        id: createFundAccountResp.data.id,
      },
    };

    const validateFundAccountResp = await this.razorPayPayments.validateAccount(
      customerID,
      Number(leadId),
      validateFundAccountPayload,
    );

    if (!validateFundAccountResp.success) {
      logger.error("Error in RazorPay Validate Account API");
      throw new BadRequestError(
        "An Issue occured initializing the bank verification process",
        {
          data: {
            pennyStatus: PennyStatus.INCOMPLETE,
            metaData: {
              pennyDropId: null,
            },
          },
        },
      );
    }

    // If validate failed then throw error
    if (validateFundAccountResp.data.status === RazorPayValidateStatus.FAILED) {
      logger.error("RazorPay Validate Account API sent status of FAILED");

      // Need to create fresh credentials failed scenario
      const pennyId = await this.pennyDropModel.insert({
        account_number: userAccount.accountNo,
        bank_name: userAccount.bank,
        customerID: String(customerID),
        ifsc: userAccount.bankIfsc,
        leadID: String(leadId),
        logs: JSON.stringify(validateFundAccountResp.data),
        name,
        p_id: validateFundAccountResp.data.id,
        penny_status: validateFundAccountResp.data.status,
        uid: config.defaultUserId,
        account_status: validateFundAccountResp.data?.results?.account_status,
        registered_name: validateFundAccountResp.data?.results?.registered_name,
      });

      throw new BadRequestError(
        "Failed to validate your bank details, Please try again in a few minutes",
        {
          data: {
            pennyStatus: PennyStatus.FAILED,
            metaData: { pennyDropId: pennyId[0] },
          },
        },
      );
    }

    // Save in penny_drop

    const pennyId = await this.pennyDropModel.insert({
      account_number: userAccount.accountNo,
      bank_name: userAccount.bank,
      customerID: String(customerID),
      ifsc: userAccount.bankIfsc,
      leadID: String(leadId),
      logs: JSON.stringify(validateFundAccountResp.data),
      name,
      p_id: validateFundAccountResp.data.id,
      penny_status: validateFundAccountResp.data.status,
      uid: config.defaultUserId,
      account_status: validateFundAccountResp.data?.results?.account_status,
      registered_name: validateFundAccountResp.data?.results?.registered_name,
    });

    // If penny_status is completed, then we can initiate name match flow here it self

    // Initiate name match
    if (
      validateFundAccountResp.data.status === RazorPayValidateStatus.COMPLETED
    ) {
      if (!validateFundAccountResp.data?.results?.account_status) {
        throw new BadRequestError("Bank details provided are incorrect", {
          data: {
            pennyStatus: PennyStatus.INVALID,
            metaData: { pennyDropId: pennyId[0] },
          },
        });
      }

      if (validateFundAccountResp.data?.results?.account_status == "invalid") {
        throw new BadRequestError("Bank details provided are invalid", {
          data: {
            pennyStatus: PennyStatus.INVALID,
            metaData: { pennyDropId: pennyId[0] },
          },
        });
      }

      const isNameMatch = await this.pennyDropNameMatch({
        aadharNo,
        customerID,
        leadID: Number(leadId),
        mobile: String(mobile),
        pancard,
        verifyTransactionPayload: validateFundAccountResp.data,
      });

      if (!isNameMatch) {
        logger.error("Bank Name mismatch with PAN/Aadhar");

        if (!validateFundAccountResp.data?.results?.registered_name) {
          throw new BadRequestError(
            "Could not find any registered name linked with the bank account",
            {
              data: {
                pennyStatus: PennyStatus.INVALID,
                metaData: { pennyDropId: pennyId[0] },
              },
            },
          );
        }

        throw new BadRequestError(
          "Bank Registered Name and Aadhar/Digilocker Name is Mismatch",
          {
            data: {
              pennyStatus: PennyStatus.NAME_MISMATCH,
              metaData: { pennyDropId: pennyId[0] },
            },
          },
        );
      }

      // await this.stepTrackermodel.completeStep(
      //   customerID,
      //   StepName.PENNY_DROP,
      //   Products.PAYDAY,
      //   leadId
      // );

      return this.serviceResponse(
        200,
        {
          pennyStatus: validateFundAccountResp.data.status,
          metaData: {
            pennyDropId: pennyId[0],
          },
        },
        "Your Bank Details have been verified",
      );
    }

    return this.serviceResponse(
      200,
      {
        pennyStatus: PennyStatus.CREATED,
        metaData: {
          pennyDropId: pennyId[0],
        },
      },
      "Account Validation in progress",
    );
  };

  pennyDropNameMatch = async (
    payload: IPennyDropNameMatchPayload,
  ): Promise<boolean> => {
    const {
      pancard,
      aadharNo,
      verifyTransactionPayload,
      mobile,
      customerID,
      leadID,
    } = payload;
    let isNameMatched = false;
    // Start name match flow, Prefer PAN

    const panDetails = pancard
      ? await this.leadApiLogService.findPanComprehensiveResponseDigitap(
          pancard,
          String(mobile),
        )
      : null;

    // If pan details exist , start pan name match flow
    if (panDetails && panDetails?.full_name) {
      const nameMatch = await this.findBoxService.checkNamePercentage({
        customerID,
        leadId: leadID,
        customerMobileNo: mobile,
        secondName: panDetails.full_name,
        firstName: verifyTransactionPayload.results.registered_name,
        type: NameMatchType.PENNY_DROP_PAN,
      });

      if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
        isNameMatched = true;
      }
    }
    // Now check if nameMatch is false only then do this logic
    // Check if Aadhar is of surepass or digilocker
    // We can do this by checking

    if (!isNameMatched) {
      // ! OLD Logic
      // if (!aadharNo) {
      //   throw new BadRequestError('PAN/Aadhar/Digilocker Not Verify.')
      // }

      // let isSurePassAadhar = !aadharNo.includes('X')
      // const aadharData = await this.leadApiLogService.getUserAadharDetails(
      //   aadharNo,
      //   String(mobile),
      //   isSurePassAadhar,
      // )

      // if (!aadharData)
      //   throw new BadRequestError('PAN/Aadhar/Digilocker Not Verify.')

      // // Now go for nameMatch

      // const nameMatch = await this.findBoxService.checkNamePercentage({
      //   customerID,
      //   leadId: leadID,
      //   customerMobileNo: mobile,
      //   firstName:
      //     aadharData.type === ApiSupplierType.SUREPASS
      //       ? aadharData.data.full_name ?? ''
      //       : aadharData.data.proofOfIdentity.name ?? '',
      //   secondName: verifyTransactionPayload.results.registered_name,
      //   type: NameMatchType.PENNY_DROP_AADHAR,
      // })

      // if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
      //   isNameMatched = true
      // }

      // Digilocker case

      if (aadharNo) {
        const aadharData = await this.leadApiLogService.getUserAadharDetails(
          aadharNo,
          String(mobile),
          true,
        );

        if (aadharData) {
          const nameMatch = await this.findBoxService.checkNamePercentage({
            customerID,
            leadId: leadID,
            customerMobileNo: mobile,
            secondName:
              aadharData.type === ApiSupplierType.SUREPASS
                ? aadharData?.data?.full_name ?? ""
                : aadharData?.data?.proofOfIdentity?.name ?? "",
            firstName: verifyTransactionPayload?.results?.registered_name,
            type: NameMatchType.PENNY_DROP_AADHAR,
          });

          if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
            isNameMatched = true;
          }

          return isNameMatched;
        } else {
          // Check digilocker
          const digilockerAadhar =
            await this.leadsApiLogModel.findOneLeadsApiLog(
              {
                status: 1,
                api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                api_supplier: ApiSupplierType.DECENTRO,
                mobile_no: String(mobile),
              },
              ["api_response"],
              [{ column: "id", order: "desc" }],
            );

          if (digilockerAadhar && digilockerAadhar?.api_response) {
            const digilocker = <IDecentroEaadharResponse["data"]>(
              JSON.parse(digilockerAadhar.api_response).data
            );

            const nameMatch = await this.findBoxService.checkNamePercentage({
              customerID,
              leadId: leadID,
              customerMobileNo: mobile,
              secondName: digilocker?.proofOfIdentity?.name ?? "",
              firstName: verifyTransactionPayload?.results?.registered_name,
              type: NameMatchType.PENNY_DROP_AADHAR,
            });

            if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
              isNameMatched = true;
            }

            return isNameMatched;
          }
        }
      } else {
        // Else if aadharNo not in customer Table then user must be digilocker
        const digilockerAadhar = await this.leadsApiLogModel.findOneLeadsApiLog(
          {
            status: 1,
            api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
            api_supplier: ApiSupplierType.DECENTRO,
            mobile_no: String(mobile),
          },
          ["api_response"],
          [{ column: "id", order: "desc" }],
        );

        if (digilockerAadhar && digilockerAadhar?.api_response) {
          const digilocker = <IDecentroEaadharResponse["data"]>(
            JSON.parse(digilockerAadhar.api_response).data
          );

          const nameMatch = await this.findBoxService.checkNamePercentage({
            customerID,
            leadId: leadID,
            customerMobileNo: mobile,
            secondName: digilocker?.proofOfIdentity?.name ?? "",
            firstName: verifyTransactionPayload?.results?.registered_name,
            type: NameMatchType.PENNY_DROP_AADHAR,
          });

          if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
            isNameMatched = true;
          }

          return isNameMatched;
        }
      }
    }

    return isNameMatched;
  };

  // ! OLD Emandate via payment link
  setEmandate = async (
    payload: IEmandatePayload,
  ): Promise<IServiceResponse> => {
    const {
      account_id: accountId,
      customerEmail,
      customerId,
      customerMobile,
      customerName,
      emandateRequired,
      loan_id: leadId,
    } = payload;
    const emandAmount = Number(config.emandateAmount);
    const customerAccount = await this.customerAccountModel.findOne({
      where: { accountID: accountId },
      select: ["accountNo", "accountType", "bankIfsc", "bank"],
    });
    if (!customerAccount) throw new NotFoundError("Customer Account not found");
    const lead = await this.leadModel.findOne({
      where: { leadID: leadId },
      whereIn: [{ column: "fbLeads", value: ["New Case", "Existing Case"] }],
    });
    if (lead) {
      await this.checkMandateRequired(String(customerId), String(leadId));
    }
    const [customer, approval] = await Promise.all([
      this.customerModel.findOneCustomer(
        {
          customerID: customerId,
        },
        ["emandate_required"],
      ),
      this.approvalModel.findOneApproval(
        {
          customerID: customerId,
          leadID: leadId,
        },
        ["loanAmtApproved"],
      ),
    ]);
    const records = await this.approvalModel.ApprovalKnex.select(
      "rm.emMaxamount",
    )
      .join("razorpay_mandate as rm", function () {
        this.on("approval.customerID", "=", "rm.customerID").on(
          "approval.leadID",
          "=",
          "rm.leadID",
        );
      })
      .join("customer as c", "approval.customerID", "=", "c.customerID")
      .where("rm.accountNo", customerAccount.accountNo)
      .where("approval.customerID", customerId)
      .where("approval.leadID", leadId)
      .where(function () {
        this.where(function () {
          this.whereNotNull("rm.emMaxamount")
            .whereRaw("LOWER(rm.status) = 'paid'")
            .where(
              "rm.credated_date",
              ">=",
              moment().subtract(270, "days").format("YYYY-MM-DD"),
            );
        })
          .orWhere("approval.loanAmtApproved", "<=", emandAmount)
          .orWhere("c.emandate_required", "1");
      })
      .orderByRaw("CAST(rm.emMaxamount AS DECIMAL) DESC")
      .first();
    let isMandateRequired = true;
    if (records) {
      if (approval && records.emMaxamount >= approval.loanAmtApproved * 2.5) {
        isMandateRequired = false;
      }
    }
    let response: {
      data: Record<any, any>;
      message: string;
      statusCode: number;
    } = {
      data: {},
      message: "",
      statusCode: 400,
    };
    if (isMandateRequired) {
      if (customer && approval) {
        const resp = await this.razorPayPayments.createEmandateAuthLink(
          customerId,
          leadId,
          {
            accountNo: customerAccount.accountNo,
            accountType: customerAccount.accountType,
            contact: customerMobile,
            email: customerEmail,
            ifsc: customerAccount.bankIfsc,
            name: customerName,
            amount: approval.loanAmtApproved,
          },
        );
        let rpay_mandate_id = 0;
        const { data } = resp;
        if (resp.success) {
          [rpay_mandate_id] = await this.razorpayMandateModel.insert({
            customerID: String(customerId),
            leadID: String(leadId),
            inv_id: data.id,
            entity: data.entity,
            receipt: data.receipt,
            invoice_number: data.invoice_number,
            customer_id: data.customer_id,
            cust_name: data.customer_details.name,
            cust_email: data.customer_details.email,
            cust_contact: data.customer_details.contact,
            order_id: data.order_id,
            status: data.status,
            sms_status: data.sms_status,
            email_status: data.email_status,
            short_url: data.short_url,
            type: data.type,
            accountNo: customerAccount.accountNo,
            accountType: customerAccount.accountType,
            bank: customerAccount.bank,
            ifsc: customerAccount.bankIfsc,
            uid: config.defaultUserId,
            emMaxamount: approval.loanAmtApproved * 3,
            etype: "0",
            token_id: "0",
            res_response: JSON.stringify(data),
          });
          await this.customerAccountModel.findAndUpdate(
            { accountID: accountId },
            { status: BankAccountStatus.VERIFIED },
          );
        }
        if (rpay_mandate_id) {
          const rpayMandate = await this.razorpayMandateModel.findOne({
            where: { id: rpay_mandate_id, customerID: String(customerId) },
          });
          if (rpayMandate) {
            response.data = {
              customerID: customerId,
              leadID: leadId,
              linkId: rpayMandate.inv_id,
              reciept: rpayMandate.receipt,
              registrationLink: rpayMandate.short_url,
              customerEmail,
              createdAt: rpayMandate.credated_date,
              status: rpayMandate.status,
              emd_id: rpayMandate.id,
            };
            if (
              approval.loanAmtApproved <= emandAmount ||
              customer.emandate_required === "1"
            ) {
              // Already emandate
              // await this.stepTrackermodel.completeStep(
              //   customerId,
              //   StepName.EMANDATE,
              //   Products.PAYDAY,
              //   leadId
              // );
              response.data = { status: 1 };
              response.message = "Already Emandate";
              response.statusCode = 200;
            } else {
              // Success
              response.data = { ...response.data, status: 1 };
              response.statusCode = 200;
              response.message = "Success";
            }
          } else {
            response.data = { status: 0 };
            response.statusCode = 400;
            response.message =
              "Invalid Account Details or Customer Information";
          }
        } else {
          response.data = { status: 0 };
          response.statusCode = 400;
          response.message = "Invalid Account Details or Customer Information";
        }
      } else {
        response.statusCode = 404;
        response.message = "Approval Not found";
        response.data = { status: 0 };
      }
    } else {
      let checkMandateNeeded: IRazorpayMandate;
      if (
        approval.loanAmtApproved > emandAmount ||
        customer.emandate_required === "0"
      ) {
        checkMandateNeeded = await this.razorpayMandateModel.findOne({
          where: {
            customerID: String(customerId),
            leadID: String(leadId),
            accountNo: customerAccount.accountNo,
          },
          whereNotNull: ["emMaxamount"],
          whereRaw: [{ rawQuery: "LOWER(status) = ?", values: ["paid"] }],
          select: ["need_another_mandate", "name_missmatch_reject"],
        });
      }
      if (
        checkMandateNeeded &&
        checkMandateNeeded.need_another_mandate === "1" &&
        customer.emandate_required === "0"
      ) {
        response.statusCode = 400;
        response.message = "You need to do another mandate.";
        response.data = { status: 4 };
      } else if (
        checkMandateNeeded &&
        checkMandateNeeded.name_missmatch_reject === "1" &&
        customer.emandate_required === "0"
      ) {
        response.statusCode = 400;
        response.message =
          "Your name in this bank account is not matching with your documents.";
        response.data = { status: 5 };
      } else {
        // await this.stepTrackermodel.completeStep(
        //   customerId,
        //   StepName.EMANDATE,
        //   Products.PAYDAY,
        //   leadId
        // );
        response.statusCode = 200;
        response.message = "Already Emandate";
        response.data = { status: 1 };
      }
    }
    return this.serviceResponse(
      response.statusCode,
      response.data,
      response.message,
    );
  };

  setEmandateV2 = async (
    payload: IEmandatePayload,
  ): Promise<IServiceResponse> => {
    const {
      account_id: accountId,
      customerEmail,
      customerId,
      customerMobile,
      customerName,
      emandateRequired,
      loan_id: leadId,
    } = payload;

    const emandAmount = Number(config.emandateAmount);
    // let customerId = 72028;
    const customerAccount = await this.customerAccountModel.findOne({
      where: { accountID: accountId },
      select: ["accountNo", "accountType", "bankIfsc", "bank"],
    });

    if (!customerAccount) throw new NotFoundError("Customer Account not found");

    const lead = await this.leadModel.findOne({
      where: { leadID: leadId },
      whereIn: [{ column: "fbLeads", value: ["New Case", "Existing Case"] }],
    });

    if (lead) {
      await this.checkMandateRequired(String(customerId), String(leadId));
    }

    const [customer, approval] = await Promise.all([
      this.customerModel.findOneCustomer(
        {
          customerID: customerId,
        },
        ["emandate_required"],
      ),
      this.approvalModel.findOneApproval(
        {
          customerID: customerId,
          leadID: leadId,
        },
        ["loanAmtApproved"],
      ),
    ]);

    const records = await this.approvalModel.ApprovalKnex.select(
      "rm.emMaxamount",
    )
      .join("razorpay_mandate as rm", function () {
        this.on("approval.customerID", "=", "rm.customerID").on(
          "approval.leadID",
          "=",
          "rm.leadID",
        );
      })
      .join("customer as c", "approval.customerID", "=", "c.customerID")
      .where("rm.accountNo", customerAccount.accountNo)
      .where("approval.customerID", customerId)
      .where("approval.leadID", leadId)
      .where(function () {
        this.where(function () {
          this.whereNotNull("rm.emMaxamount")
            .whereRaw("LOWER(rm.status) = 'paid'")
            .where(
              "rm.credated_date",
              ">=",
              moment().subtract(270, "days").format("YYYY-MM-DD"),
            );
        })
          .orWhere("approval.loanAmtApproved", "<=", emandAmount)
          .orWhere("c.emandate_required", "1");
      })
      .orderByRaw("CAST(rm.emMaxamount AS DECIMAL) DESC")
      .first();

    let isMandateRequired = true;

    if (records) {
      if (approval && records.emMaxamount >= approval.loanAmtApproved * 2.5) {
        isMandateRequired = false;
      }
    }

    let response: {
      data: Record<any, any>;
      message: string;
      statusCode: number;
    } = {
      data: {},
      message: "",
      statusCode: 400,
    };
    // if (isMandateRequired) {
    //   if (customer && approval) {
    //     // Here, we will create customer, basically emd create flow will trigger

    //     const createCustomer = await this.razorPayPayments.createCustomer(
    //       customerId,
    //       leadId,
    //       {
    //         contact: customerMobile,
    //         name: customerName,
    //         email: customerEmail,
    //       },
    //       lead.lenderID,
    //     );

    //     if (!createCustomer.success) {
    //       throw new InternalServerError(
    //         "Failed to create emandate. Please try again later.",
    //       );
    //     }

    //     // Once customer is created, now we need to create an order
    //     const maxAmount = convertRupeesToPaise(approval.loanAmtApproved * 3);

    //     const createOrder = await this.razorPayPayments.createOrder(
    //       customerId,
    //       leadId,
    //       {
    //         amount: 0,
    //         currency: "INR",
    //         customer_id: createCustomer.data.id,
    //         method: "emandate",
    //         token: {
    //           auth_type: "",
    //           expire_at: moment().add(24, "months").unix(),
    //           max_amount: maxAmount,
    //           bank_account: {
    //             account_number: customerAccount.accountNo,
    //             account_type: customerAccount.accountType.toLowerCase() + "s",
    //             ifsc_code: customerAccount.bankIfsc,
    //             beneficiary_name: customerName,
    //           },
    //         },
    //       },
    //       lead.lenderID,
    //     );

    //     // Now, we need to save response details in rpay_mandate table
    //     let rpay_mandate_id = 0;

    //     // const { data } = resp
    //     // const { data } = createOrder

    //     // Fields which are not in resp, need to be saved later
    //     if (createOrder.success) {
    //       [rpay_mandate_id] = await this.razorpayMandateModel.insert({
    //         customerID: String(customerId),
    //         leadID: String(leadId),
    //         inv_id: "0", // Not in resp,
    //         entity: createOrder.data.entity,
    //         receipt: createOrder.data.receipt,
    //         invoice_number: "0", // Not in resp
    //         customer_id: createCustomer.data.id,
    //         cust_name: createCustomer.data.name,
    //         cust_email: createCustomer.data.email,
    //         cust_contact: createCustomer.data.contact,
    //         order_id: createOrder.data.id,
    //         status: createOrder.data.status,
    //         sms_status: "pending",
    //         email_status: "pending",
    //         short_url: "N/A",
    //         type: "callback",
    //         accountNo: customerAccount.accountNo,
    //         accountType: customerAccount.accountType,
    //         bank: customerAccount.bank,
    //         ifsc: customerAccount.bankIfsc,
    //         uid: config.defaultUserId,
    //         emMaxamount: approval.loanAmtApproved * 3,
    //         etype: "0",
    //         token_id: "0",
    //         res_response: JSON.stringify(createOrder.data),
    //       });

    //       await this.customerAccountModel.findAndUpdate(
    //         { accountID: accountId },
    //         { status: BankAccountStatus.VERIFIED },
    //       );
    //     }

    //     if (rpay_mandate_id) {
    //       const rpayMandate = await this.razorpayMandateModel.findOne({
    //         where: { id: rpay_mandate_id, customerID: String(customerId) },
    //       });
    //       if (rpayMandate) {
    //         response.data = {
    //           customer_id: createCustomer.data.id,
    //           order_id: createOrder.data.id,
    //         };

    //         if (
    //           approval.loanAmtApproved <= emandAmount ||
    //           customer.emandate_required === "1"
    //         ) {
    //           response.data = { status: 1 };
    //           response.message = "Already Emandate";
    //           response.statusCode = 200;
    //         } else {
    //           response.data = { ...response.data, status: 1 };
    //           response.statusCode = 200;
    //           response.message = "Success";
    //         }
    //       } else {
    //         response.data = { status: 0 };
    //         response.statusCode = 400;
    //         response.message =
    //           "Invalid Account Details or Customer Information";
    //       }
    //     } else {
    //       response.data = { status: 0 };
    //       response.statusCode = 400;
    //       response.message = "Invalid Account Details or Customer Information";
    //     }
    //   } else {
    //     response.statusCode = 404;
    //     response.message = "Approval Not found.";
    //     response.data = { status: 0 };
    //   }
    // }
    if (isMandateRequired) {
      console.log("==================>customer", customer);
      console.log("==================>Approval", approval);
      if (customer && approval) {
        const maxAmount = approval.loanAmtApproved * 3;
        const txnId = `RM${leadId}T${Date.now()}`;
        const returnUrl = `${
          worldlineConfig().returnBase
        }/loan/e-mandate/worldline-callback`;

        const built = buildMandateRequest({
          txnId,
          consumerId: String(customerId),
          mobile: customerMobile,
          email: customerEmail,
          name: customerName,
          accountNo: customerAccount.accountNo,
          accountType: /current/i.test(customerAccount.accountType || "")
            ? "Current"
            : "Saving",
          ifsc: customerAccount.bankIfsc,
          maxAmount,
          returnUrl,
        });

        let rpay_mandate_id = 0;
        [rpay_mandate_id] = await this.razorpayMandateModel.insert({
          customerID: String(customerId),
          leadID: String(leadId),
          inv_id: "0",
          entity: "worldline_emandate",
          receipt: txnId,
          invoice_number: "0",
          customer_id: String(customerId),
          cust_name: customerName,
          cust_email: customerEmail,
          cust_contact: customerMobile,
          order_id: txnId,
          status: "created",
          sms_status: "pending",
          email_status: "pending",
          short_url: "N/A",
          type: "worldline_callback",
          accountNo: customerAccount.accountNo,
          accountType: customerAccount.accountType,
          bank: customerAccount.bank,
          ifsc: customerAccount.bankIfsc,
          uid: config.defaultUserId,
          emMaxamount: maxAmount,
          etype: "0",
          token_id: "0",
          res_response: JSON.stringify(built),
        });

        await this.customerAccountModel.findAndUpdate(
          { accountID: accountId },
          { status: BankAccountStatus.VERIFIED },
        );

        if (rpay_mandate_id) {
          const rpayMandate = await this.razorpayMandateModel.findOne({
            where: {
              id: rpay_mandate_id,
              customerID: String(customerId),
            },
          });

          if (rpayMandate) {
            if (
              approval.loanAmtApproved <= emandAmount ||
              customer.emandate_required === "1"
            ) {
              response.data = { status: 1 };
              response.message = "Already Emandate";
              response.statusCode = 200;
            } else {
              response.data = {
                provider: "worldline",
                txnId,
                request: built.request,
                status: 1,
              };
              response.statusCode = 200;
              response.message = "Success";
            }
          } else {
            response.data = { status: 0 };
            response.statusCode = 400;
            response.message =
              "Invalid Account Details or Customer Information";
          }
        } else {
          response.data = { status: 0 };
          response.statusCode = 400;
          response.message = "Invalid Account Details or Customer Information";
        }
      } else {
        response.statusCode = 404;
        response.message = "Approval Not found.";
        response.data = { status: 0 };
      }
    } else {
      let checkMandateNeeded: IRazorpayMandate;
      if (
        approval.loanAmtApproved > emandAmount ||
        customer.emandate_required === "0"
      ) {
        checkMandateNeeded = await this.razorpayMandateModel.findOne({
          where: {
            customerID: String(customerId),
            leadID: String(leadId),
            accountNo: customerAccount.accountNo,
          },
          whereNotNull: ["emMaxamount"],
          whereRaw: [{ rawQuery: "LOWER(status) = ?", values: ["paid"] }],
          select: ["need_another_mandate", "name_missmatch_reject"],
        });
      }
      if (
        checkMandateNeeded &&
        checkMandateNeeded.need_another_mandate === "1" &&
        customer.emandate_required === "0"
      ) {
        response.statusCode = 400;
        response.message = "You need to do another mandate.";
        response.data = { status: 4 };
      } else if (
        checkMandateNeeded &&
        checkMandateNeeded.name_missmatch_reject === "1" &&
        customer.emandate_required === "0"
      ) {
        response.statusCode = 400;
        response.message =
          "Your name in this bank account is not matching with your documents.";
        response.data = { status: 5 };
      } else {
        response.statusCode = 200;
        response.message = "Already Emandate";
        response.data = { status: 1 };
      }
    }

    return this.serviceResponse(
      response.statusCode,
      response.data,
      response.message,
    );
  };

  // Verify Worldline Mandate
  verifyWorldlineMandate = async (payload: {
    customerId?: number;
    loan_id?: number;
    msg?: string;
    response?: string;
    responseString?: string;
  }): Promise<IServiceResponse> => {
    const pipe =
      payload.msg || payload.response || payload.responseString || "";

    const result = verifyMandateResponse(String(pipe));
    if (!result.valid) {
      return this.serviceResponse(
        400,
        {
          status: 0,
          ...result,
        },
        "Mandate response signature invalid",
      );
    }

    if (!result.success) {
      return this.serviceResponse(
        400,
        {
          status: 0,
          ...result,
        },
        result.errorMessage || result.message || "Mandate registration failed",
      );
    }

    const txnId = result.clientTxnRef;
    const mandate = await this.razorpayMandateModel.findOne({
      where: {
        order_id: txnId,
      },
    });

    if (!mandate) {
      return this.serviceResponse(
        404,
        {
          status: 0,
          ...result,
        },
        "Mandate record not found",
      );
    }

    await this.razorpayMandateModel.findOneAndUpdate(
      {
        order_id: txnId,
      },
      {
        status: "paid",
        token_id: result.mandateRegNo || "0",
        res_response: JSON.stringify(result),
      },
    );

    await createStepTrackerEntry(
      Number(mandate.customerID),
      Number(mandate.leadID),
      0,
      StepName.EMANDATE,
      "New",
    );

    return this.serviceResponse(
      200,
      {
        status: 1,
        mandateRegNo: result.mandateRegNo,
        bankTransactionId: result.bankTransactionId,
      },
      "Mandate registered successfully",
    );
  };

  // ! OLD Emandate via payment link
  setVerifyEmandate = async (
    payload: IEmandatePayload,
    userStep: IStepTrackerJoinStepControl,
  ) => {
    const {
      account_id: accountId,
      customerId,
      emandateRequired,
      loan_id: leadId,
    } = payload;

    const customerAccount = await this.customerAccountModel.findOne({
      where: { accountID: accountId },
    });

    if (!customerAccount) throw new NotFoundError("Customer Account not found");

    const verificationStatus = await this.verifyEmandate(
      String(customerId),
      leadId,
      customerAccount,
      emandateRequired,
    );

    let response: {
      data: Record<any, any>;
      message: string;
      statusCode: number;
    } = {
      data: {},
      message: "",
      statusCode: 400,
    };

    let resp: IServiceResponse;
    if (
      verificationStatus.status === RazorPayMandateVerification.NOT_VERIFIED
    ) {
      resp = await this.setEmandate(payload);

      response.data = resp.data;
      response.statusCode = resp.statusCode;
      response.message = resp.message;
    } else {
      const pennyData = await this.pennyDropModel.findOne({
        where: {
          account_number: customerAccount.accountNo,
          customerID: String(customerId),
          account_status: "active",
          penny_status: PennyStatus.COMPLETED,
          penny_drop_name_match: PennyDropNameMatchStatus.NAME_MISMATCH,
        },
        order: [{ column: "id", order: "desc" }],
      });

      // Handle Penny

      if (pennyData) {
        response.data = { status: 0 };
        response.statusCode = 400;
        response.message =
          "Bank Registered Name and Aadhar/Digilocker Name is Mismatch";
      } else {
        response.data = { status: 1 };
        response.statusCode = 200;
        response.message = "Already Emandate";
      }
      response.data = { ...response.data, verificationStatus };
    }

    if (
      response.statusCode === HttpStatusCode.Ok &&
      response.message === "Already Emandate"
    ) {
      // Save step in this case:
      // await this.stepTrackermodel.completeStep(
      //   customerId,
      //   StepName.EMANDATE,
      //   Products.PAYDAY,
      //   leadId
      // );
    }
    return this.serviceResponse(
      response.statusCode,
      response.data,
      response.message,
    );
  };

  setVerifyEmandateV2 = async (payload: IEmandatePayload) => {
    const {
      account_id: accountId,
      customerId,
      emandateRequired,
      loan_id: leadId,
    } = payload;

    const customerAccount = await this.customerAccountModel.findOne({
      where: { accountID: accountId },
    });

    if (!customerAccount) throw new NotFoundError("Customer Account not found");

    const verificationStatus = await this.verifyEmandate(
      String(customerId),
      leadId,
      customerAccount,
      emandateRequired,
    );

    let response: {
      data: Record<any, any>;
      message: string;
      statusCode: number;
    } = {
      data: {},
      message: "",
      statusCode: 400,
    };

    let resp: IServiceResponse;
    if (
      verificationStatus.status === RazorPayMandateVerification.NOT_VERIFIED
    ) {
      resp = await this.setEmandate(payload);

      response.data = resp.data;
      response.statusCode = resp.statusCode;
      response.message = resp.message;
    } else {
      const pennyData = await this.pennyDropModel.findOne({
        where: {
          account_number: customerAccount.accountNo,
          customerID: String(customerId),
          account_status: "active",
          penny_status: PennyStatus.COMPLETED,
          penny_drop_name_match: PennyDropNameMatchStatus.NAME_MISMATCH,
        },
        order: [{ column: "id", order: "desc" }],
      });

      // Handle Penny

      if (pennyData) {
        response.data = { status: 0 };
        response.statusCode = 400;
        response.message =
          "Bank Registered Name and Aadhar/Digilocker Name is Mismatch";
      } else {
        response.data = { status: 1 };
        response.statusCode = 200;
        response.message = "Already Emandate";
      }
      response.data = { ...response.data, verificationStatus };
    }

    if (
      response.statusCode === HttpStatusCode.Ok &&
      response.message === "Already Emandate"
    ) {
      // Save step in this case:
      // await this.stepTrackermodel.completeStep(
      //   customerId,
      //   StepName.EMANDATE,
      //   Products.PAYDAY,
      //   leadId
      // );
    }
    return this.serviceResponse(
      response.statusCode,
      response.data,
      response.message,
    );
  };
  verifyEmandate = async (
    customerId: string,
    leadId: number,
    customerAccount: ICustomerAccount,
    emandateRequired: "1" | "0",
  ): Promise<{ status: RazorPayMandateVerification; mandateId: number }> => {
    const emandAmount = Number(config.emandateAmount);

    const approval = await this.approvalModel.findOneApproval(
      {
        customerID: +customerId,
        leadID: leadId,
      },
      ["loanAmtApproved"],
    );

    let rpayMandate: IRazorpayMandate;
    if (approval) {
      if (approval.loanAmtApproved <= emandAmount || emandateRequired === "1") {
        rpayMandate = await this.razorpayMandateModel.findOne({
          where: {
            customerID: customerId,
            accountNo: customerAccount.accountNo,
          },
          order: [{ column: "credated_date", order: "desc" }],
          select: [
            "accountNo",
            "name_missmatch_reject",
            "credated_date",
            "emMaxamount",
            "id",
          ],
        });
      } else {
        rpayMandate = await this.razorpayMandateModel.findOne({
          where: {
            customerID: customerId,
            accountNo: customerAccount.accountNo,
          },
          whereNotNull: ["emMaxamount"],
          whereRaw: [{ rawQuery: "LOWER(status) = ?", values: ["paid"] }],
          order: [{ column: "id", order: "desc" }],
          select: [
            "accountNo",
            "name_missmatch_reject",
            "credated_date",
            "emMaxamount",
            "id",
          ],
        });
      }
    } else {
      rpayMandate = await this.razorpayMandateModel.findOne({
        where: {
          customerID: customerId,
          accountNo: customerAccount.accountNo,
        },
        whereNotNull: ["emMaxamount"],
        whereRaw: [{ rawQuery: "LOWER(status) = ?", values: ["paid"] }],
        order: [{ column: "id", order: "desc" }],
        select: [
          "accountNo",
          "name_missmatch_reject",
          "credated_date",
          "emMaxamount",
          "id",
        ],
      });
    }

    let isVerified = {
      status: RazorPayMandateVerification.NOT_VERIFIED,
      mandateId: null,
    };
    let isRejected = false;

    if (rpayMandate) {
      if (approval) {
        const lastMandateAmnt = rpayMandate.emMaxamount;
        const diffInDays = moment().diff(
          moment(rpayMandate.credated_date),
          "days",
        );
        const newMandateAmt = approval.loanAmtApproved * 2.5;

        if (rpayMandate.name_missmatch_reject === "1") {
          isRejected = true;
        } else if (
          diffInDays > 270 &&
          approval.loanAmtApproved > emandAmount &&
          emandateRequired === "0"
        ) {
          isVerified.status = RazorPayMandateVerification.NOT_VERIFIED;
        } else if (
          lastMandateAmnt < newMandateAmt &&
          approval.loanAmtApproved > emandAmount &&
          emandateRequired === "0"
        ) {
          isVerified.status = RazorPayMandateVerification.NOT_VERIFIED;
        } else {
          const pennyData = await this.pennyDropModel.checkUserPennyDrop(
            customerId,
            rpayMandate.accountNo,
          );

          if (pennyData) {
            isVerified.status = RazorPayMandateVerification.VERIFIED;
            isVerified.mandateId = rpayMandate.id;
          } else {
            isVerified.status = RazorPayMandateVerification.NOT_VERIFIED;
          }
        }
      } else {
        isVerified.status = RazorPayMandateVerification.NOT_VERIFIED;
      }
    }

    if (isRejected) {
      isVerified.status = RazorPayMandateVerification.REJECTED;
    }

    return isVerified;
  };

  checkMandateRequired = async (customerId: string, leadId: string) => {
    const emdNotReqLog = await this.emandateNotRequiredLogs.findOne({
      whereNotNull: ["last_emandate_paid"],
      order: [{ column: "id", order: "desc" }],
      select: ["last_emandate_paid"],
    });

    if (!emdNotReqLog) return;

    const lastPaidId = emdNotReqLog.last_emandate_paid;

    const mandateCount = await this.razorpayMandateModel.RpayMandateKnex.join(
      "leads as l",
      "l.leadID",
      "=",
      "razorpay_mandate.leadID",
    )
      .whereIn("l.fbLeads", ["New Case", "Existing Case"])
      .whereRaw("LOWER(razorpay_mandate.status) = ?", ["paid"])
      .where("razorpay_mandate.id", ">", lastPaidId)
      .count();

    if (
      Number(mandateCount[0]["count(*)"]) > Number(config.emandateBypassCount)
    ) {
      const lastPaidEmd = await this.razorpayMandateModel.findOne({
        whereRaw: [{ rawQuery: "LOWER(status) = ?", values: ["paid"] }],
        order: [{ column: "id", order: "desc" }],
        select: ["id"],
      });

      if (!lastPaidEmd) return;

      // Emd not needed for user

      const currentDate = new Date();

      await Promise.all([
        this.customerModel.findOneAndUpdate(
          { customerID: Number(customerId) },
          { emandate_required: "1" },
        ),
        this.emandateNotRequiredLogs.insert({
          customerID: Number(customerId),
          nr_startBy: Number(config.defaultUserId),
          nr_startDate: getTimeInIst(currentDate),
          last_emandate_paid: lastPaidEmd.id,
        }),
        this.callHistoryModel.insert({
          customerID: Number(customerId),
          leadID: Number(leadId),
          callType: CallType.IVR,
          status: LeadStatus.APPROVED_PROCESS,
          // appAmount: '',
          noteli: "Emandate Bypassed",
          remark: "Emandate Bypassed",
          callbackTime: getTimeInIst(currentDate),
          calledBy: Number(config.defaultUserId),
        }),
      ]);
    }
  };

  verifyEmandateById = async (
    customerId: string,
    leadId: number,
    mandateId: number,
    emandateRequired: "1" | "0",
    accountID: number,
  ): Promise<{ status: RazorPayMandateVerification; mandateId: number }> => {
    const emandAmount = Number(config.emandateAmount);

    const approval = await this.approvalModel.findOneApproval(
      {
        customerID: +customerId,
        leadID: leadId,
      },
      ["loanAmtApproved"],
    );

    if (!approval) throw new NotFoundError("User has no loan approval");

    const account = await this.customerAccountModel.findOne({
      where: { customerID: +customerId, accountID },
      select: ["accountNo"],
    });

    if (!account) throw new NotFoundError("This account does not exist");

    let isVerified = {
      status: RazorPayMandateVerification.NOT_VERIFIED,
      mandateId: null,
      route: "",
    };

    if (!mandateId) {
      isVerified.route = "/emandate";
      return isVerified;
    }

    let rpayMandate = await this.razorpayMandateModel.findOne({
      where: {
        customerID: customerId,
        id: mandateId,
        accountNo: account.accountNo,
      },
      whereNotNull: ["emMaxamount"],
      select: [
        "accountNo",
        "name_missmatch_reject",
        "credated_date",
        "emMaxamount",
      ],
    });

    let isRejected = false;

    if (!rpayMandate) throw new NotFoundError("Invalid account");

    const lastMandateAmnt = rpayMandate.emMaxamount;
    const diffInDays = moment().diff(moment(rpayMandate.credated_date), "days");
    const newMandateAmt = approval.loanAmtApproved * 2.5;

    if (rpayMandate.name_missmatch_reject === "1") {
      isRejected = true;
    } else if (
      diffInDays > 270 &&
      approval.loanAmtApproved > emandAmount &&
      emandateRequired === "0"
    ) {
      isVerified.status = RazorPayMandateVerification.NOT_VERIFIED;
      isVerified.route = "/emandate";
    } else if (
      lastMandateAmnt < newMandateAmt &&
      approval.loanAmtApproved > emandAmount &&
      emandateRequired === "0"
    ) {
      isVerified.status = RazorPayMandateVerification.NOT_VERIFIED;
      isVerified.route = "/emandate";
    } else {
      const pennyData = await this.pennyDropModel.checkUserPennyDrop(
        customerId,
        rpayMandate.accountNo,
      );

      if (pennyData) {
        isVerified.status = RazorPayMandateVerification.VERIFIED;
        isVerified.mandateId = rpayMandate.id;
      } else {
        isVerified.status = RazorPayMandateVerification.NOT_VERIFIED;
        isVerified.route = "/emandate";
      }
    }

    if (isRejected) {
      isVerified.status = RazorPayMandateVerification.REJECTED;
    }

    return isVerified;
  };

  addReferenceDetails = async (
    payload: IReferenceDetailsPayload,
    customerID: number,
    mobileNo: number,
  ): Promise<IServiceResponse> => {
    const {
      mobile_no_1: mobileNo1,
      mobile_no_2: mobileNo2,
      name_1: name1,
      name_2: name2,
      relation_1: relation1,
      relation_2: relation2,
      loan_id: leadID,
    } = payload;

    if (mobileNo1 == mobileNo || mobileNo2 == mobileNo) {
      throw new BadRequestError(
        "Reference's mobile number cannot be same as your mobile number",
      );
    }

    // Check if reference already exists
    const checkReference = await this.referenceModel.find({
      where: { customerID },
      select: ["referenceID", "contactNo"],
    });

    const existingReference1 = checkReference.find((reference) => {
      if (reference.contactNo === mobileNo1) {
        return reference;
      }
    });

    const existingReference2 = checkReference.find((reference) => {
      if (reference.contactNo === mobileNo2) {
        return reference;
      }
    });

    if (existingReference1 && existingReference2) {
      return this.serviceResponse(
        HttpStatusCode.Created,
        {},
        "Your Reference details have been saved",
      );
    }

    const insertData: IReferenceModel[] = [];

    if (existingReference1) {
      insertData.push({
        customerID,
        relation: relation2,
        name: name2,
        contactNo: mobileNo2,
        createdBy: +config.defaultUserId,
        ...sampleReferencePayload,
      });
    }

    if (existingReference2) {
      insertData.push({
        customerID,
        relation: relation1,
        name: name1,
        contactNo: mobileNo1,
        createdBy: +config.defaultUserId,
        ...sampleReferencePayload,
      });
    }

    if (!existingReference1 && !existingReference2) {
      insertData.push({
        customerID,
        relation: relation2,
        name: name2,
        contactNo: mobileNo2,
        createdBy: +config.defaultUserId,
        ...sampleReferencePayload,
      });

      insertData.push({
        customerID,
        relation: relation1,
        name: name1,
        contactNo: mobileNo1,
        createdBy: +config.defaultUserId,
        ...sampleReferencePayload,
      });
    }

    await this.referenceModel.bulkInsert(insertData);

    // await this.stepTrackermodel.completeStep(
    //   customerID,
    //   StepName.REFERENCE_DETAILS,
    //   Products.PAYDAY,
    //   leadID
    // );

    return this.serviceResponse(
      HttpStatusCode.Created,
      {},
      "Your Reference details have been saved",
    );
  };

  getReferenceDetails = async (customerID: number, pagination: IPagination) => {
    const references = await this.referenceModel.find({
      where: { customerID },
      paginate: { page: pagination.skip, perPage: pagination.take },
      order: [{ column: "referenceID", order: "asc" }],
    });

    if (!references.length) {
      throw new NotFoundError("No references found for user");
    }

    const reference = {
      id1: references[0]?.referenceID ?? null,
      mobileNo1: references[0]?.contactNo ?? null,
      name1: references[0]?.name ?? null,
      relation1: references[1]?.relation ?? null,
      id2: references[1]?.referenceID ?? null,
      mobileNo2: references[1]?.contactNo ?? null,
      name2: references[1]?.name ?? null,
      relation2: references[1]?.relation ?? null,
    };

    return this.serviceResponse(
      HttpStatusCode.Ok,
      reference,
      "References fetched",
    );
  };

  updateReferenceDetails = async (
    payload: IUpdateReferenceDetailsPayload,
    customerID: number,
  ): Promise<IServiceResponse> => {
    const {
      mobile_no_1: mobileNo1,
      mobile_no_2: mobileNo2,
      name_1: name1,
      name_2: name2,
      relation_1: relation1,
      relation_2: relation2,
      loan_id: leadID,
      id_1: id1,
      id_2: id2,
    } = payload;

    const [reference1, reference2] = await Promise.all([
      this.referenceModel.findOne({ where: { referenceID: id1, customerID } }),
      this.referenceModel.findOne({ where: { referenceID: id2, customerID } }),
    ]);

    if (!reference1 || !reference2)
      throw new NotFoundError("Reference not found");

    await Promise.all([
      this.referenceModel.findOneAndUpdate(
        { referenceID: id1, customerID },
        {
          contactNo: mobileNo1,
          name: name1,
          relation: relation1,
        },
      ),
      this.referenceModel.findOneAndUpdate(
        { referenceID: id2, customerID },
        {
          contactNo: mobileNo2,
          name: name2,
          relation: relation2,
        },
      ),
    ]);

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {},
      "Your Reference details have been updated",
    );
  };

  async getStatesAutoSuggestions(payload: ISearchWordPayload) {
    const { searchWord } = payload;
    let word = searchWord?.toString()?.toLowerCase();

    if (!word) {
      throw new Error("Please enter correct states names ");
    }

    const filteredStates = STATES.filter((state) =>
      state.toLowerCase().includes(searchWord),
    );

    if (filteredStates.length > 0) {
      return this.serviceResponse(200, filteredStates, "list of states");
    } else {
      return this.serviceResponse(200, {}, "Enter correct states name");
    }
  }

  async approvalView(customer: ICustomer, leadID: number) {
    // Check if customer can upgrade loan amount

    const { customerID, salary_date, mobile } = customer;

    const approval = await this.approvalModel.findOneApproval({
      customerID,
      leadID,
    });

    if (!approval) throw new NotFoundError("Approval not found");

    const isLoanAmountUpgradable = await this.loanService.canUpgradeLoanAmount(
      customerID,
      leadID,
      String(mobile),
    );

    // Check if loan repay date is before 7 days
    const { tenure, repayDate } = await this.approvalService.findRepayDate(
      approval,
      salary_date,
    );

    const repayDateDifference = getDifferenceInDays(
      getCurrentTime(false),
      repayDate as Date,
    );

    const totalRepaymentAmount = roundNumber(
      approval.loanAmtApproved +
        roundNumber(
          approval.loanAmtApproved *
            ((+config.rate_of_interest * repayDateDifference) / 100),
        ),
    );

    let processingFee =
      approval.loanAmtApproved != 0
        ? roundNumber((approval.adminFee * 100) / approval.loanAmtApproved, 2)
        : 0;

    const expiryDate = addDaysToDate(
      approval.createdDate,
      +config.approvalExpiry,
    ).toDate();

    const response: IApprovalView = {
      totalAmount: approval.loanAmtApproved,
      roi: +config.rate_of_interest,
      processingFee,
      gst: +config.gst,
      processingAmount: approval.adminFee,
      gstOfAdminFee: approval.GstOfAdminFee,
      finalAmount:
        approval.loanAmtApproved - approval.adminFee - approval.GstOfAdminFee,
      repayDate: repayDate as Date,
      tenure,
      expiryDate,
      repayAmount: totalRepaymentAmount,
      isLoanAmountUpgradable,
      isSalaried: customer.employeeType === "Salaried",
    };

    return this.serviceResponse(HttpStatusCode.Ok, response, "Approval Data");
  }

  RepayDateFind = async (salaryDate: number) => {
    const currentDate = moment();
    const currentDay = currentDate.date();
    const maxDayInMonth = currentDate.daysInMonth();
    const db = getKnexInstance();

    let targetDate;

    // Check if salary date is greater than or equal to the current day
    if (salaryDate >= currentDay) {
      targetDate = currentDate.date(salaryDate);
    } else {
      targetDate = currentDate.add(1, "month").date(salaryDate);
    }

    let formattedDate = targetDate.format("YYYY-MM-DD");
    let difference = targetDate.diff(moment(), "days");

    // If the difference is less than 6 days, push the target date to the next month
    if (difference < 15) {
      targetDate = targetDate.add(1, "month");
      formattedDate = targetDate.format("YYYY-MM-DD");
      difference = targetDate.diff(moment(), "days");
    }

    // Handle cases where salary date is 31 but the month has fewer days
    if (salaryDate === 31 && maxDayInMonth < 31) {
      targetDate = targetDate.subtract(31 - maxDayInMonth, "days");
      formattedDate = targetDate.format("YYYY-MM-DD");
      difference = targetDate.diff(moment(), "days");
    }

    // If the salary date is 30 and the month has less than 30 days, adjust
    if (salaryDate === 30 && maxDayInMonth < 30) {
      targetDate = targetDate.subtract(30 - maxDayInMonth, "days");
      formattedDate = targetDate.format("YYYY-MM-DD");
      difference = targetDate.diff(moment(), "days");
    }

    // Adjust date for weekends (Saturday/Sunday)
    let dayOfWeek = targetDate.format("dddd");

    if (dayOfWeek === "Sunday") {
      targetDate = targetDate.subtract(1, "days");
      dayOfWeek = targetDate.format("dddd");
      formattedDate = targetDate.format("YYYY-MM-DD");
      difference--;
    }

    if (dayOfWeek === "Saturday") {
      targetDate = targetDate.subtract(1, "days");
      formattedDate = targetDate.format("YYYY-MM-DD");
      difference--;
    }

    // Check for holidays in the database
    let findHolidayResult = await db("repaydate_holiday")
      .where("repaydate", formattedDate)
      .count({ count: "*" });

    let findHoliday = Number(findHolidayResult[0].count);
    while (findHoliday > 0) {
      targetDate = targetDate.subtract(1, "days");
      formattedDate = targetDate.format("YYYY-MM-DD");
      difference--;
      findHoliday = await db("repaydate_holiday")
        .where("repaydate", formattedDate)
        .count();
    }

    return {
      formattedDate,
      difference,
    };
  };

  generatePaydayKfs = async (
    payload: IKeyFactPayload,
  ): Promise<IServiceResponse> => {
    const { leadId, uploadDocs } = payload;
    let browser;
    const db = getKnexInstance();
    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const lead_detail = await db("leads").where("leadID", leadId).first();

    const lender_detail = await db("lender")
      .where("lenderID", lead_detail.lenderID)
      .first();
    const customer_detail = await db("customer")
      .where("customerID", lead_detail.customerID)
      .first();
    // TODO: RAJESH add loan creation here
    const now_date = moment().format("YYYY-MM-DD");
    const checkLoanExists = await db("loan")
      .where("leadID", leadId)
      .andWhere("status", "Disbursal Sheet Send")
      .first();
    const approval_details = await approvalService.findOne({
      customerID: lead_detail.customerID,
      leadID: leadId,
    });
    if (!checkLoanExists) {
      let createNewLoanNo = await this.generateLoanNumber(
        db,
        lead_detail.lenderID,
      );
      const customerAccountDetails: any = await db("customerAccount")
        .join("razorpay_mandate", function () {
          this.on(
            "customerAccount.customerID",
            "=",
            "razorpay_mandate.customerID",
          ).andOn(
            "customerAccount.accountNo",
            "=",
            "razorpay_mandate.accountNo",
          );
        })
        .where("customerAccount.leadID", leadId)
        .andWhere("customerAccount.customerID", lead_detail.customerID)
        .andWhere("customerAccount.status", "Verified")
        .andWhere("razorpay_mandate.status", "paid")
        .orderBy("customerAccount.accountID", "desc")
        .select("customerAccount.*")
        .first();

      await db("loan").insert({
        leadID: leadId,
        loanNo: createNewLoanNo,
        customerID: lead_detail.customerID,
        disbursalAmount: approval_details.loanAmtApproved,
        disbursalDate: "0000-00-00",
        disbursalRefrenceNo: "",
        accountNo: customerAccountDetails.accountNo,
        accountType: customerAccountDetails.accountType,
        bankIfsc: customerAccountDetails.bankIfsc,
        bank: customerAccountDetails.bank,
        bankBranch: "",
        chequeDetails: "",
        pdDate: now_date,
        pdDoneBy: 1,
        deduction: approval_details.adminFee + approval_details.GstOfAdminFee,
        remarks: "",
        status: "Disbursal Sheet Send",
        companyAccountNo: "YES BANK-0665",
        disbursedBy: 1,
        createdDate: now,
      });
    }
    const loan_detail = await db("loan")
      .where("customerID", lead_detail.customerID)
      .where("leadID", leadId)
      .first();
    const approval_detail = await db("approval")
      .where("customerID", lead_detail.customerID)
      .where("leadID", leadId)
      .first();
    const address = await db("address")
      .where("customerID", customer_detail.customerID)
      .orderBy("addressID", "desc")
      .first();

    if (approval_detail && approval_detail.repayDate) {
      const repay1 = moment(now).unix();
      const repay2 = moment(approval_detail.repayDate).unix();
      if ((repay2 - repay1) / (60 * 60 * 24) <= 15) {
        if (
          !customer_detail.salary_date ||
          customer_detail.salary_date === null
        ) {
          customer_detail.salary_date = 1;
        }
        const finboxService = new FinboxService();
        const data = await finboxService.repayDateFind(
          String(customer_detail.salary_date),
        );
        approval_detail.repayDate = data.formattedDate;
        approval_detail.tenure = data.difference;
      }
    }

    approval_detail.createdDate = moment().format("YYYY-MM-DD");

    // Fetching account details
    let account_detail = await db("penny_drop")
      .where("customerID", customer_detail.customerID)
      .first();

    if (account_detail) {
      account_detail.bankIfsc = account_detail.ifsc;
    }

    // Calculate disbursal amount, interest, and other financials
    const disbursalAmount = approval_detail.loanAmtApproved;
    const rep = disbursalAmount * (+config.rate_of_interest / 100);
    const rep1 = Math.round(disbursalAmount + rep * approval_detail.tenure);
    const inte = +(rep * 30);
    const intem = +(rep * approval_detail.tenure);
    const inte1 = inte * 12;
    const adm = approval_detail.adminFee;
    const gst = +(adm * (18 / 100));
    const tam = adm + gst;
    const purpose = lead_detail.purpose;
    const apr = this.getIPR(
      disbursalAmount,
      approval_detail.adminFee,
      gst,
      approval_detail.tenure,
      +config.rate_of_interest,
    );

    const fdb = disbursalAmount - tam;
    const ipcDpdInt = 0.1;
    const dpdPenality = 500;
    const dpdPenalityGstPercentage = 90;

    // Override ROI with config value for template
    approval_detail.roi = +config.rate_of_interest;

    // Prepare mail data
    const mail_data = {
      lead_detail,
      lender_detail,
      customer_detail,
      address,
      loan_detail,
      approval_detail,
      account_detail,
      intem,
      gst,
      apr,
      fdb,
      rep1,
      ipcDpdInt,
      dpdPenality,
      dpdPenalityGstPercentage,
      purpose,
    };
    console.log(
      "mail data -------------------------------------------------> ",
      mail_data,
    );

    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "loansDocs",
      "sanction_payday.ejs",
    );
    let renderedHtml = await ejs.renderFile(templatePath, mail_data);
    renderedHtml = renderedHtml.replace(/\n/g, "");

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(renderedHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();
    if (pdfBuffer) {
      const s3FolderName = `document/sanction/${lead_detail.customerID}`;
      const imageName = `sanction_${Math.floor(Date.now() / 1000)}.pdf`;
      const res = await this.s3Service.uploadDocument(
        pdfBuffer,
        s3FolderName,
        imageName,
      );
      if (uploadDocs && res && res?.Key !== null && res.Key !== "") {
        await documentModel.insert({
          customerID: lead_detail.customerID,
          type: "Sanction",
          documentType: "Sanction",
          documentFile: res.Key,
          leadId: lead_detail.leadID,
          status: "Verified",
          uploadBy: lead_detail.customerID,
          uploadedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          verifiedBy: lead_detail.customerID,
          verifiedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          upload_platform: "S3",
        });
      }
    }

    const pdfStream = new Readable();
    pdfStream.push(pdfBuffer);
    pdfStream.push(null);

    return this.serviceResponse(
      200,
      renderedHtml,
      "KFS payday rendered successfully.",
    );
  };

  async keyFactsAcceptance(payload: IKeyFactPayload) {
    const { leadId, mobile, customerId } = payload;
    let mobileToken = (await this.mobileTokenService.findOne(
      { mobile: String(mobile) },
      ["access_token"],
    )) as IMobileToken;

    if (!mobileToken) throw new NotFoundError("mobileToken not found");

    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const now_date = moment().format("YYYY-MM-DD");
    let DataCode: any = {};
    let leadData = await this.leadService.findOne({ leadID: leadId });
    if (!leadData) {
      throw new NotFoundError("Lead not found");
    }
    const customerDetail = await this.customerService.findOne({
      customerID: customerId,
    });

    if (!customerDetail) {
      throw new NotFoundError("Customer not found");
    }
    const approvalDetail = await approvalService.findOne({
      customerID: customerId,
      leadID: leadId,
    });
    if (!approvalDetail) {
      throw new NotFoundError("Approval not found");
    }
    if (approvalDetail?.repayDate) {
      const repay1 = moment(now);
      const repay2 = moment(approvalDetail.repayDate);
      if (repay2.diff(repay1, "days") <= 16) {
        if (!customerDetail.salary_date) {
          customerDetail.salary_date = "1";
        }
        const finboxService = new FinboxService();

        const { formattedDate, difference } = await finboxService.repayDateFind(
          String(customerDetail.salary_date),
        );
        if (formattedDate && difference) {
          // await approvalService.updateOne(
          //   {
          //     customerID: customerId,
          //     leadID: leadId,
          //   },
          //   { repayDate: formattedDate, tenure: difference }
          // );
          console.log("approval update removed");
        }
      }
    }
    const approval_details = await approvalService.findOne({
      customerID: customerId,
      leadID: leadId,
    });
    let db = getKnexInstance();

    const checkloan = await db("loan")
      .where("leadID", leadId)
      .andWhere("status", "Disbursal Sheet Send")
      .first();

    const lender_detail = await db("lender")
      .where("lenderID", leadData.lenderID)
      .first();
    if (!checkloan) {
      let createNewLoanNo = await this.generateLoanNumber(
        db,
        lender_detail.lenderID,
      );
      const customerAccountDetails: any = await db("customerAccount")
        .where("leadID", leadId)
        .andWhere("customerID", customerId)
        .andWhere("status", "Verified")
        .orderBy("accountID", "desc")
        .first();
      console.log("customerAccountDetails", customerAccountDetails);
      //const customerAccountDetails = customerAccountData
      await db("loan").insert({
        leadID: leadId,
        loanNo: createNewLoanNo,
        customerID: customerId,
        disbursalAmount: approval_details.loanAmtApproved,
        disbursalDate: "0000-00-00",
        disbursalRefrenceNo: "",
        accountNo: customerAccountDetails.accountNo,
        accountType: customerAccountDetails.accountType,
        bankIfsc: customerAccountDetails.bankIfsc,
        bank: customerAccountDetails.bank,
        bankBranch: "",
        chequeDetails: "",
        pdDate: now_date,
        pdDoneBy: 1,
        deduction: approval_details.adminFee + approval_details.GstOfAdminFee,
        remarks: "",
        status: "Disbursal Sheet Send",
        companyAccountNo: "YES BANK-0665",
        disbursedBy: 1,
        createdDate: now,
      });

      await this.leadService.updateOne(
        { customerID: customerId, leadID: leadId },
        { status: LeadStatus.DISBURSAL_SHEET_SEND },
      );
    }

    await this.leadService.updateOne(
      { customerID: customerId, leadID: leadId },
      { status: LeadStatus.DISBURSAL_SHEET_SEND },
    );

    const c_repayDate = approval_details.repayDate;
    const ctenure = approval_details.tenure;
    const dpd_Interest = +config.dpdInterest;
    let delay_interest = 0;

    const re_pay_date = moment(approval_details.repayDate, "YYYY-MM-DD");
    const curr_date = moment();

    if (curr_date.isAfter(re_pay_date)) {
      const dpd_days = Number(curr_date.diff(re_pay_date, "days"));
      delay_interest =
        approval_details.loanAmtApproved * (dpd_Interest / 100) * dpd_days;
    }
    const roicheck =
      leadData.productID === 1
        ? +config.rate_of_interest / 12
        : +config.rate_of_interest;

    const loanAmtApproved = approval_details.loanAmtApproved ?? 0;
    const sanction_intrest = loanAmtApproved * (roicheck / 100) * ctenure;
    const total_amount = loanAmtApproved + sanction_intrest + delay_interest;

    DataCode.total_payable_amount = Number((total_amount ?? 0).toFixed(2));
    DataCode.repayDate = c_repayDate ?? null;
    DataCode.disbursed_amount = Number(
      (approval_details.loanAmtApproved ?? 0).toFixed(2),
    );
    DataCode.tenure = approval_details.tenure ?? 0;

    const updatedLeadData = await this.leadService.findOne({
      customerID: customerId,
      leadID: leadId,
    });
    leadData = updatedLeadData;
    if (
      leadData.status === "Approved Process" ||
      leadData.status === "Bank Update Rejected"
    ) {
      const leadUpdateData: any = {
        kfs: "1",
        ipc: 1,
        // kfs_ip: getClientIp(req),
      };
      if (leadData.status === "Bank Update Rejected") {
        await this.leadService.updateOne(
          {
            customerID: customerId,
            leadID: leadId,
          },
          { ...leadUpdateData },
        );
      } else {
        await this.leadService.updateOne(
          {
            customerID: customerId,
            leadID: leadId,
          },
          {
            ...leadUpdateData,
            status: "Approved",
          },
        );
      }

      await this.callHistoryLogsService.create({
        customerID: customerId,
        leadID: leadId,
        callType: "IVR",
        status:
          leadData.status === "Bank Update Rejected"
            ? "Bank Update Rejected"
            : "Approved",
        noteli: "KFS Done",
        remark: "KFS Done - Approved",
        callbackTime: moment().format("YYYY-MM-DD") as unknown as Date,
        calledBy: 1,
        createdDate: moment().toDate(),
      });
    } else {
      await this.leadService.updateOne(
        { customerID: customerId, leadID: leadId },
        { kfs: "1", ipc: 1 },
      );
    }

    // createAutoDisbursal Entry
    const alreadyDisbursalRows = await this.leadService.countLeads(
      {
        leadID: leadId,
      },
      undefined,
      {
        status: [
          LeadStatus.DISBURSED,
          LeadStatus.PART_PAYMENT,
          LeadStatus.SETTLEMENT,
        ],
      },
    );
    const alreadyDisbursed = alreadyDisbursalRows[0]?.count || 0;

    const loanDetailsRows = await loanService.findLoan({
      where: [
        { column: "leadID", value: leadId },
        { column: "disbursalRefrenceNo", value: "" },
        { column: "status", value: LeadStatus.DISBURSAL_SHEET_SEND },
      ],
      order: [{ column: "loanID", order: "desc" }],
      select: ["*"],
    });
    const loanDetails = loanDetailsRows[0];
    const loanDetailsCount = loanDetailsRows.length;

    if (!loanDetails) throw new NotFoundError("Loan Details not found");

    const accountNo = loanDetails.accountNo;
    const ifsc = loanDetails.bankIfsc;
    const loanNo = loanDetails.loanNo;
    const loanID = loanDetails.loanID;
    const dAmount = loanDetails.disbursalAmount - loanDetails.deduction;
    const companyAcc = loanDetails.companyAccountNo;
    const customerID = loanDetails.customerID;

    const alreadyInitiatedRows = await db("disbursal_jobs")
      .where({
        customerID: customerID,
        leadID: leadId,
        loanID: loanID,
      })
      .count<{ count: number }[]>({ count: "*" });

    const checkAlreadyInitiated = Number(alreadyInitiatedRows[0].count);

    if (
      alreadyDisbursed === 0 &&
      loanDetailsCount === 1 &&
      checkAlreadyInitiated === 0
    ) {
      await db("disbursal_jobs").insert({
        customerID,
        leadID: leadId,
        loanID,
        loanNo,
        accountNo,
        ifsc,
        actualDisbAmount: dAmount,
        custName: customerDetail.name,
        custMobile: customerDetail.mobile,
        custEmail: customerDetail.email,
        companyAcc,
        userID: 1,
        createdDate: db.fn.now(),
        currentStatus: 0,
      });
      // Insert into auto_disbursal_log
      await db("auto_disbursal_log").insert({
        customerID,
        leadID: leadId,
        userID: 1,
        status: "disbursal initiation",
        createdDate: db.fn.now(),
      });
    }
    apiReqResLogsModel.insert({
      customerID: String(customerId),
      mobile: null,
      api_request: JSON.stringify({ leadId }),
      api_response: JSON.stringify(
        sanitizeData(
          this.serviceResponse(200, DataCode, "key facts acceptance"),
        ),
      ),
      status: Object.values(StatusCode).includes(200) ? "1" : "0",
      message: "key facts acceptance",
      api_name: "node_key_facts_acceptance",
    });
    DataCode.disbursement_date = loanDetails.disbursalDate;

    return this.serviceResponse(200, DataCode, "key facts acceptance");
  }
  async bankingSurrogate(payload: IKeyFactPayload) {
    const { leadId, pancard, mobile } = payload;

    const requestBody = {
      pancard: pancard,
      leadID: leadId,
      mobile: mobile,
    };
    let baseUrl = this.commonHelper.getBaseUrl();
    const response = await axios.post(
      `${baseUrl}/loanapply/ramfincorp_api/banking_surrogate_api`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return this.serviceResponse(200, response.data, "banking surrogate");
  }
  private calculateIRR(cashFlows: number[], guess = 0.1): number {
    const precision = 1e-6; // Desired precision
    let iteration = 0;
    const maxIteration = 1000; // Maximum iterations to avoid infinite loops.
    let rate = guess;

    do {
      iteration++;
      let npv = 0; // Net Present Value (NPV).
      let derivative = 0;

      // Calculate NPV and its derivative using cash flows.
      cashFlows.forEach((cashFlow, t) => {
        npv += cashFlow / Math.pow(1 + rate, t);
        derivative += -(t * cashFlow) / Math.pow(1 + rate, t + 1);
      });

      const newRate = rate - npv / derivative; // Update rate using Newton-Raphson.
      if (Math.abs(newRate - rate) < precision) {
        // Check if difference is within the desired precision.
        break;
      }

      rate = newRate;
    } while (iteration < maxIteration);

    return rate;
  }

  private getIPR(
    loanAmount: number,
    platFormFee: number,
    otherFee: number,
    tenure: number,
    roi: number,
  ): number {
    const per_roi = roi / 100;

    const first_balance = -(loanAmount - platFormFee - otherFee);

    const second_balance = loanAmount + loanAmount * per_roi * tenure;

    const cashFlows = [first_balance, second_balance];

    const apr = this.calculateIRR(cashFlows, per_roi) * 100 * 12;

    return Math.round(apr);
  }

  async checkDigilockerAadharExists(
    aadharNo: string,
    mobileNo: number,
    customerID: number,
    isSurepass: boolean,
  ) {
    let panDetails = await this.leadApiLogService.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
        api_supplier: ApiSupplierType.DIGITAP,
        mobile_no: String(mobileNo),
      },
      ["api_response"],
      [{ column: "id", order: "desc" }],
    );

    if (!panDetails) {
      panDetails = await this.leadApiLogService.findOne(
        {
          status: 1,
          api_type: LeadLogApiType.PAN_COMPREHENSIVE,
          api_supplier: ApiSupplierType.SUREPASS,
          mobile_no: String(mobileNo),
        },
        ["api_response"],
        [{ column: "id", order: "desc" }],
      );
    }

    switch (isSurepass) {
      case false:
        const digilockerCheck: ILeadsApiLog =
          await this.leadsApiLogModel.LeadsApiLogKnex.select(
            "mobile_no",
            "api_response",
          ) // Selecting all fields
            .where("api_type", "digilocker_eaadhaar") // Filtering by api_type
            .whereRaw("JSON_VALID(api_response)") // Ensuring the JSON is valid
            .whereRaw(
              "RIGHT(JSON_UNQUOTE(JSON_EXTRACT(api_response, '$.data.aadhaarUid')), 4) = ?",
              [aadharNo.slice(-4)],
            )
            .first();

        // Name match and dob match
        if (digilockerCheck) {
          const aadarResponse = <IDecentroEaadharResponse["data"]>(
            JSON.parse(digilockerCheck.api_response).data
          );
          const {
            proofOfIdentity: { dob: aadharDob, name: aadharFullName },
          } = aadarResponse;

          // Do dob match first, should be 100 %

          if (panDetails) {
            // Parse PAN response format (supports both Digitap and Surepass)
            const response = JSON.parse(panDetails.api_response);

            // Convert DD/MM/YYYY to YYYY-MM-DD
            const convertDateFormat = (dateStr: string): string => {
              if (!dateStr) return "";
              try {
                const parts = dateStr.split("/");
                if (parts.length === 3) {
                  const day = parts[0].padStart(2, "0");
                  const month = parts[1].padStart(2, "0");
                  const year = parts[2];
                  return `${year}-${month}-${day}`;
                }
                return dateStr;
              } catch (error) {
                return dateStr;
              }
            };

            let panResponse: {
              full_name: string;
              dob: string;
            };

            // Check if it's Digitap format (has 'result' field)
            if (response.result) {
              const digitapResult = response.result;
              panResponse = {
                full_name: digitapResult.fullname,
                dob: convertDateFormat(digitapResult.dob),
              };
            }
            // Check if it's Surepass format (has 'data' field)
            else if (response.data) {
              const surepassData = response.data;
              panResponse = {
                full_name: surepassData.full_name,
                dob: surepassData.dob, // Surepass already returns YYYY-MM-DD format
              };
            } else {
              logger.error(
                "Invalid PAN response structure - neither Digitap nor Surepass format found",
              );
              return false;
            }

            const { full_name: panFullName, dob: panDob } = panResponse;

            const aadharDobFormatted = moment(aadharDob, "DD-MM-YYYY").format(
              "YYYY-MM-DD",
            );

            // compare dob

            const dobMatch = await this.findBoxService.checkNamePercentage(
              {
                firstName: panDob,
                secondName: aadharDobFormatted,
                type: "panDOB - aadharDOB",
                leadId: 0,
                customerID,
                customerMobileNo: String(mobileNo),
              },
              false,
            );

            if (dobMatch.percentageResult === 100) {
              // If dob Match is 100, then after that check for name
              const nameMatch = await this.findBoxService.checkNamePercentage(
                {
                  firstName: panFullName,
                  secondName: aadharFullName,
                  type: "pan - aadhar",
                  leadId: 0,
                  customerID,
                  customerMobileNo: String(mobileNo),
                },
                false,
              );

              if (nameMatch.percentageResult === 100) {
                // If 100% match then aadhar already exists
                throw new BadRequestError(
                  "This aadhaar number is associated with another existing account",
                  {
                    data: {
                      mobileNo: maskString(digilockerCheck.mobile_no, 6),
                    },
                  },
                );
              }
            }
          }
        }
        break;
      case true:
        // In this we don't have to check for digilocker in lead_api_log
        // but if surepass found, again do name and dob checks

        const aadhar: ICustomer =
          await this.customerModel.CustomerKnex.whereRaw(
            "RIGHT(aadharNo,4) = ?",
            [aadharNo],
          )
            .select("mobile")
            .first();

        if (aadhar && aadhar?.mobile !== mobileNo && panDetails) {
          const aadhaarDetails = await this.leadApiLogService.findOne(
            {
              status: 1,
              api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
              api_supplier: ApiSupplierType.SUREPASS,
              mobile_no: String(aadhar.mobile),
            },
            ["api_response", "mobile_no"],
            [{ column: "id", order: "desc" }],
          );

          if (!aadhaarDetails) return;

          const aadarResponse = <ISurePassVerifyAadharResponse["data"]>(
            JSON.parse(aadhaarDetails.api_response).data
          );

          const panResponse = <ISurePassValidatePanResponse["data"]>(
            JSON.parse(panDetails.api_response).data
          );
          const { full_name: aadharFullName, dob: aadharDob } = aadarResponse;

          const { full_name: panFullName, dob: panDob } = panResponse;

          // compare dob

          const dobMatch = await this.findBoxService.checkNamePercentage(
            {
              firstName: panDob,
              secondName: aadharDob,
              type: "panDOB - aadharDOB",
              leadId: 0,
              customerID,
              customerMobileNo: String(mobileNo),
            },
            false,
          );

          if (dobMatch.percentageResult === 100) {
            // If dob Match is 100, then after that check for name
            const nameMatch = await this.findBoxService.checkNamePercentage(
              {
                firstName: panFullName,
                secondName: aadharFullName,
                type: "pan - aadhar",
                leadId: 0,
                customerID,
                customerMobileNo: String(mobileNo),
              },
              false,
            );

            if (nameMatch.percentageResult === 100) {
              // If 100% match then aadhar already exists
              throw new BadRequestError(
                "This aadhaar number is associated with another existing account",
                {
                  data: {
                    mobileNo: maskString(aadhaarDetails.mobile_no, 6),
                  },
                },
              );
            }
          }
        }
        break;
      default:
        break;
    }
  }
  onboardPanVerificationByDigitap = async (
    payload: IPanFetchPayloadDigitap,
  ): Promise<IServiceResponse> => {
    const { panNumber, customerID, mobileNo, customerPanCardNo } = payload;

    if (customerPanCardNo) {
      const panLeadApiLogData =
        await this.leadApiLogService.findPanComprehensiveResponseDigitap(
          customerPanCardNo,
          String(mobileNo),
        );
      if (panLeadApiLogData) {
        return this.serviceResponse(
          200,
          panLeadApiLogData,
          "PAN Already Linked, Details fetched",
        );
      }
    }

    const customer = await this.customerService.findOne(
      { pancard: panNumber },
      ["mobile"],
    );

    if (customer) {
      if (customer.mobile !== mobileNo) {
        logger.error(
          `PAN no ${panNumber} is already linked to another mobile ${customer.mobile}`,
        );
        throw new BadRequestError(
          "This PAN number is associated with another existing account",
          {
            data: {
              mobileNo: maskString(String(customer.mobile), 6),
            },
          },
        );
      }

      const panLeadApiLogData =
        await this.leadApiLogService.findPanComprehensiveResponseDigitap(
          panNumber,
          String(mobileNo),
        );
      if (panLeadApiLogData) {
        return this.serviceResponse(
          200,
          panLeadApiLogData,
          "PAN Details fetched",
        );
      }
      const DigitapData = await verifyPanDigitap({
        panNumber,
        customerId: customerID,
        mobileNo,
      });
      if (DigitapData.data.http_response_code != 200)
        throw new BadRequestError("pan fetch failure");

      return this.serviceResponse(200, DigitapData.data, "PAN Details");
    }

    const panLeadApiLogData =
      await this.leadApiLogService.findPanComprehensiveResponseDigitap(
        panNumber,
        String(mobileNo),
      );
    if (panLeadApiLogData) {
      return this.serviceResponse(
        200,
        panLeadApiLogData,
        "PAN Details fetched",
      );
    }
    const DigitapData = await verifyPanDigitap({
      panNumber,
      customerId: customerID,
      mobileNo,
    });
    if (DigitapData.data.http_response_code != 200)
      throw new BadRequestError("Pan details fetch failure");

    return this.serviceResponse(200, DigitapData.data, "PAN Details");
  };

  async fetchEmandateInvoice(
    // { customerID, email, mobile, name, emandate_required }: ICustomer,
    payload: IFetchPaymentPayload,
  ) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      payload;

    // First verify the signature

    const isVerified = this.razorPayPayments.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!isVerified) throw new BadRequestError("Invalid signature");

    // Find user mandate details

    const rpayMandate = await this.razorpayMandateModel.findOne({
      where: { order_id: razorpay_order_id },
      select: [
        "customerID",
        "leadID",
        "id",
        "customer_id",
        "accountNo",
        "accountType",
        "bank",
        "ifsc",
      ],
    });

    if (!rpayMandate) throw new NotFoundError("Mandate details not found");

    const customer = await this.customerModel.findOneCustomer(
      { customerID: +rpayMandate.customerID },
      ["email", "mobile", "name", "emandate_required"],
    );

    if (!customer) throw new NotFoundError("Customer not found");

    const payment = await this.razorPayPayments.fetchPayment(
      +rpayMandate.customerID,
      +rpayMandate.leadID,
      razorpay_payment_id,
    );

    if (!payment.success)
      throw new InternalServerError(
        "Their was an issue with your emandate, Please try again.",
      );

    const { data: paymentData } = payment;

    // Fetch invoice details via API
    const invoice = await this.razorPayPayments.fetchInvoice(
      +rpayMandate.customerID,
      +rpayMandate.leadID,
      paymentData.invoice_id,
    );

    if (!invoice.success)
      throw new InternalServerError(
        "Their was an issue with your emandate, Please try again.",
      );

    const { data: invoiceData } = invoice;

    // Now we update this table

    await Promise.all([
      this.razorpayMandateStatusModel.insert({
        customer_id: rpayMandate.customer_id,
        emId: String(rpayMandate.id),
        emstatus: invoiceData.status,
        inv_id: invoiceData.id,
        leadID: rpayMandate.leadID,
        tokenID: paymentData.token_id,
        accountNo: rpayMandate.accountNo,
        accountType: rpayMandate.accountType,
        bank: rpayMandate.bank,
        ifsc: rpayMandate.ifsc,
      }),
      this.razorpayMandateModel.findOneAndUpdate(
        {
          id: rpayMandate.id,
        },
        {
          inv_id: invoiceData.id,
          invoice_number:
            invoiceData.invoice_number ?? rpayMandate.invoice_number,
          token_id: paymentData.token_id,
          status: invoiceData.status,
          short_url: invoiceData.short_url,
        },
      ),
    ]);

    // Find accountId

    const customerAccount = await this.customerAccountModel.findOne({
      where: {
        accountNo: rpayMandate.accountNo,
        customerID: +rpayMandate.customerID,
      },
      select: ["accountID"],
    });

    // Call this method

    const { data, message, statusCode } = await this.setVerifyEmandateV2({
      account_id: customerAccount.accountID,
      customerEmail: customer.email,
      customerId: +rpayMandate.customerID,
      customerMobile: String(customer.mobile),
      customerName: customer.name,
      emandateRequired: customer.emandate_required,
      loan_id: +rpayMandate.leadID,
    });

    return this.serviceResponse(statusCode, data, message);
  }

  // async fetchEmandateInvoiceWithToken(
  //   { customerID, email, mobile, name, emandate_required }: ICustomer,
  //   payload: IFetchPaymentPayload,
  // ) {
  //   const {
  //     razorpay_order_id,
  //     razorpay_payment_id,
  //     leadID,
  //     accountID,
  //     razorpay_signature,
  //   } = payload

  //   // First verify the signature

  //   const isVerified = this.razorPayPayments.verifySignature(
  //     razorpay_order_id,
  //     razorpay_payment_id,
  //     razorpay_signature,
  //   )

  //   if (!isVerified) throw new BadRequestError('Invalid signature')

  //   // Find user mandate details

  //   const rpayMandate = await this.razorpayMandateModel.findOne({
  //     where: { order_id: razorpay_order_id, customerID: String(customerID) },
  //     select: [
  //       'customerID',
  //       'leadID',
  //       'id',
  //       'customer_id',
  //       'accountNo',
  //       'accountType',
  //       'bank',
  //       'ifsc',
  //     ],
  //   })

  //   if (!rpayMandate) throw new NotFoundError('Mandate details not found')

  //   const payment = await this.razorPayPayments.fetchPayment(
  //     customerID,
  //     leadID,
  //     razorpay_payment_id,
  //   )

  //   if (!payment.success)
  //     throw new InternalServerError(
  //       'Their was an issue with your emandate, Please try again.',
  //     )

  //   const { data: paymentData } = payment

  //   // Fetch invoice details via API
  //   const invoice = await this.razorPayPayments.fetchInvoice(
  //     customerID,
  //     leadID,
  //     paymentData.invoice_id,
  //   )

  //   if (!invoice.success)
  //     throw new InternalServerError(
  //       'Their was an issue with your emandate, Please try again.',
  //     )

  //   const { data: invoiceData } = invoice

  //   // Now we update this table

  //   await Promise.all([
  //     this.razorpayMandateStatusModel.insert({
  //       customer_id: rpayMandate.customer_id,
  //       emId: String(rpayMandate.id),
  //       emstatus: invoiceData.status,
  //       inv_id: invoiceData.id,
  //       leadID: rpayMandate.leadID,
  //       tokenID: paymentData.token_id,
  //       accountNo: rpayMandate.accountNo,
  //       accountType: rpayMandate.accountType,
  //       bank: rpayMandate.bank,
  //       ifsc: rpayMandate.ifsc,
  //     }),
  //     this.razorpayMandateModel.findOneAndUpdate(
  //       {
  //         id: rpayMandate.id,
  //       },
  //       {
  //         inv_id: invoiceData.id,
  //         invoice_number:
  //           invoiceData.invoice_number ?? rpayMandate.invoice_number,
  //         token_id: paymentData.token_id,
  //         status: invoiceData.status,
  //         short_url: invoiceData.short_url,
  //       },
  //     ),
  //   ])

  //   // Call this method

  //   const { data, message, statusCode } = await this.setVerifyEmandateV2({
  //     accountId: accountID,
  //     customerEmail: email,
  //     customerId: customerID,
  //     customerMobile: String(mobile),
  //     customerName: name,
  //     emandateRequired: emandate_required,
  //     leadID,
  //   })

  //   return this.serviceResponse(statusCode, data, message)
  // }

  generateEmiKfs = async (
    payload: IKeyFactPayload,
  ): Promise<IServiceResponse> => {
    const { leadId } = payload;
    const db = getKnexInstance();
    const now = moment();
    const leadDetail = await db("leads").where("leadID", leadId).first();

    const lenderDetail = await db("lender")
      .where("lenderID", leadDetail.lenderID)
      .first();
    const customerDetail = await db("customer")
      .where("customerID", leadDetail.customerID)
      .first();
    const loanDetail = await db("loan")
      .where("customerID", leadDetail.customerID)
      .where("leadID", leadId)
      .first();
    const approvalDetail = await db("approval")
      .where("customerID", leadDetail.customerID)
      .where("leadID", leadId)
      .first();

    if (approvalDetail?.repayDate) {
      const repay1 = now.toDate().getTime();
      const repay2 = new Date(approvalDetail.repayDate).getTime();

      if ((repay2 - repay1) / (1000 * 60 * 60 * 24) <= 6) {
        if (!customerDetail.salary_date) {
          customerDetail.salary_date = 1;
        }

        const finboxService = new FinboxService();
        const data = await finboxService.repayDateFind(
          customerDetail.salary_date,
        );
        approvalDetail.repayDate = data.formattedDate;
        approvalDetail.tenure = data.difference;
      }
    }

    approvalDetail.createdDate = now.toISOString().split("T")[0];
    const accountDetail = await db("razorpay_mandate")
      .where("id", leadDetail.em_id)
      .first();

    if (accountDetail) {
      accountDetail.bankIfsc = accountDetail.ifsc;
    }

    const disbursalAmount = approvalDetail.loanAmtApproved;
    const rep = Math.round(disbursalAmount * (+config.rate_of_interest / 100));
    const rep1 = disbursalAmount + rep * approvalDetail.tenure;
    const inte = rep * 30;
    const intem = rep * approvalDetail.tenure;
    const inte1 = inte * 12;
    const adm = approvalDetail.adminFee;
    const gst = Math.round(adm * 0.18);
    const tam = adm + gst;
    const fdb = approvalDetail.loanAmtApproved - tam;

    const address = await db("address")
      .where("customerID", customerDetail.customerID)
      .orderBy("addressID", "desc")
      .first();

    const credits = await db("credits")
      .where("customerID", customerDetail.customerID)
      .where("leadID", leadId)
      .orderBy("creditID", "desc")
      .first();

    if (!credits) {
      throw new BadRequestError("Emi Details not found");
    }
    const Data = {
      loanAmount: credits.principal,
      roi: credits.roi,
      tenure: credits.tenure,
      creditId: credits.creditID,
    };
    const apiResponse = await this.crmService.getDocsRequirements(Data);
    let apiData: ILoanData;

    if (apiResponse.statusCode === 200) {
      apiData = apiResponse.data as ILoanData;
    } else {
      throw new BadRequestError("Error in fetching reponse");
    }
    const penalRatePerDay = 0.1;
    const p = penalRatePerDay * 365;
    const delayedCharge = +config.rate_of_interest + p;

    const apr = parseFloat(
      this.getEmiAPR(
        apiData.amount,
        apiData.processingFee,
        apiData.gst,
        apiData.tenure,
        apiData.roi,
      ),
    );

    const mailData = {
      lead_detail: leadDetail,
      lender_detail: lenderDetail,
      customer_detail: customerDetail,
      loan_detail: loanDetail,
      approval_detail: approvalDetail,
      account_detail: accountDetail,
      intem,
      gst,
      apr,
      fdb,
      rep1,
      address,
      credits,
      api_response: apiData,
      payment_schedule: [],
      delayedCharge,
    };

    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "loansDocs",
      "sanction_emi.ejs",
    );
    let renderedHtml = await ejs.renderFile(templatePath, mailData);
    renderedHtml = renderedHtml.replace(/\n/g, "");

    // const templatePath = path.join(
    //   __dirname,
    //   '..',
    //   'views',
    //   'loansDocs',
    //   'Kfs_Emi.ejs',
    // )
    // let renderedHtml = await ejs.renderFile(templatePath, mailData)
    // renderedHtml = renderedHtml.replace(/\n/g, '')

    return this.serviceResponse(
      200,
      renderedHtml,
      "KFS emi rendered successfully.",
    );
  };

  public getEmiAPR(
    loanAmount: string | number,
    platFormFee: number,
    otherFee: number,
    tenure: string | number,
    roi: number,
  ): string {
    const sanitizeNumber = (value: string | number): number => {
      if (typeof value === "string") {
        return parseFloat(value.replace(/,/g, "")) || 0;
      }
      return value;
    };

    const loanAmt = sanitizeNumber(loanAmount);
    const tenurePeriods = sanitizeNumber(tenure);
    let charges = platFormFee + otherFee;
    charges = sanitizeNumber(charges);

    const present = loanAmt - charges;

    let guess = 0.01;
    let future = 0;
    let type = 0;
    const ROI = roi / 100;
    const rateI = ROI / 12;
    let fv = 0;

    const pvif = Math.pow(1 + rateI, tenurePeriods);
    const pmt = (rateI / (pvif - 1)) * -(loanAmt * pvif + fv);
    const payment = pmt;

    const epsMax = 1e-10;
    const iterMax = 10;

    let y = 0;
    let y0 = 0;
    let y1 = 0;
    let x0 = 0;
    let x1 = guess;
    let f = 0;
    let i = 0;
    let rate = guess;

    if (Math.abs(rate) < epsMax) {
      y =
        present * (1 + tenurePeriods * rate) +
        payment * (1 + rate * type) * tenurePeriods +
        future;
    } else {
      f = Math.exp(tenurePeriods * Math.log(1 + rate));
      y = present * f + payment * (1 / rate + type) * (f - 1) + future;
    }

    y0 = present + payment * tenurePeriods + future;
    y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
    i = 0;
    x0 = 0;

    while (Math.abs(y0 - y1) > epsMax && i < iterMax) {
      rate = (y1 * x0 - y0 * x1) / (y1 - y0);
      x0 = x1;
      x1 = rate;

      if (Math.abs(rate) < epsMax) {
        y =
          present * (1 + tenurePeriods * rate) +
          payment * (1 + rate * type) * tenurePeriods +
          future;
      } else {
        f = Math.exp(tenurePeriods * Math.log(1 + rate));
        y = present * f + payment * (1 / rate + type) * (f - 1) + future;
      }

      y0 = y1;
      y1 = y;
      i++;
    }

    const rate1 = rate * 100;
    const ddk = rate1 * 12;
    const APR = `${ddk.toFixed(2)}%`;

    return APR;
  }

  /* async loanApprovalService(payload: ILoanApprovalPayload) {
    const { loanID, customerID } = payload;
    const getCustomerInfo = await this.customerService.findOne({ customerID });
    if (!getCustomerInfo) {
      throw new BadRequestError("Customer information not found!");
    }
    let getLeadsInfo = await this.leadService.findOne(
      { customerID, leadID: loanID },
      ["*"],
      [{ column: "leadID", order: "desc" }],
    );

    if (!getLeadsInfo) {
      throw new BadRequestError("Lead information not found!");
    }

    const { monthlyIncome, lenderID } = getLeadsInfo;

    const crifService = new CrifSoftPullService({
      // appID: process.env.CRIF_APP_ID!,
      // merchantID: process.env.CRIF_MERCHANT_ID!,
      // username: process.env.CRIF_USERNAME!,
      // secretKey: process.env.CRIF_SECRET_KEY!,
      // productCode: "BBC CONSUMER SCORE#2.0",

      appID: "AGFLBBCDETAILS36997464544",
      merchantID: "NBF0003540",
      username: "uat@kredbharat",
      secretKey: "5A3F6A7712C6E404478DB4C171DE89644BD14E50",
      productCode: "BBC_CONSUMER_SCORE#85#2.0",
    });

    const response = await crifService.softPull({
      firstName: "JAVED",
      lastName: "KHAN",
      dob: "11-07-1981",
      mobile: "6637689861",
      email: "abc@abc.com",
      pan: "VLMPQ2307O",
      address: "VILLAGE PIPAKA TAURU SUB POST OFFICE SEHSAULA",
      city: "GURGAON",
      district: "GURGAON",
      state: "HARYANA",
      pincode: "122105",
      country: "india",
    });

    console.log("IN SERVICE====================>", JSON.stringify(response));
    if (response) {
      const credForgeBreService = new CredForgeBreService({
        baseURL: process.env.CREDFORGE_BASE_URL!,
        clientID: process.env.CREDFORGE_CLIENT_ID!,
        apiKey: process.env.CREDFORGE_API_KEY!,
      });

      const bureauBreResponse = await credForgeBreService.executeBureauBre({
        userId: customerID.toString(),
        referenceId: loanID.toString(),
        leadId: loanID.toString(),
        declaredIncome: Number(monthlyIncome),
        bureauType: BureauType.CRIF,
        rawBureauData: response,
      });

      if (!bureauBreResponse.success) {
        throw new BadRequestError("Failed to get Bureau BRE decision");
      }

      let decision = bureauBreResponse.decision;
      let offerAmount = bureauBreResponse.offerAmount;

      if (offerAmount && offerAmount < config.min_loan_amount) {
        offerAmount = config.min_loan_amount;
      }

      let loanAmount;
      if (decision === "Approve") {
        const approvedLoan = await approvalService.findOne({
          customerID,
          leadID: getLeadsInfo.leadID,
        });

        let salaryDate = getCustomerInfo.salary_date ?? "5";
        let checkEmptyDate = 0;

        const finboxService = new FinboxService();
        const repayDateData = await finboxService.repayDateFind(
          String(salaryDate),
        );
        let formattedDate = repayDateData.formattedDate;
        let difference = repayDateData.difference;

        let maxLoanAmount = config.max_loan_amount || 18000;

        let loanAmtApproved =
          offerAmount && offerAmount > (getLeadsInfo?.loanRequeried || 0)
            ? getLeadsInfo?.loanRequeried
            : offerAmount || 0;
        loanAmount =
          Number(loanAmtApproved || 0) > Number(maxLoanAmount || 0)
            ? Number(maxLoanAmount || 0)
            : Number(loanAmtApproved || 0);

        let finalOfferAmount = 0;
        if (loanAmount) {
          const modOfferAmount = loanAmount % 1000;
          if (modOfferAmount < 500) {
            finalOfferAmount = loanAmount - modOfferAmount;
          } else {
            finalOfferAmount = loanAmount + 1000 - modOfferAmount;
          }
        }
        loanAmount = finalOfferAmount;

        const adminfee = (loanAmount * 10) / 100;
        const gstOfAdminFee = (adminfee * 18) / 100;
        if (!approvedLoan) {
          const data: IApproval = {
            customerID,
            leadID: Number(getLeadsInfo.leadID),
            branch: BranchName.NOIDA,
            loanAmtApproved: loanAmount,
            tenure: checkEmptyDate === 0 ? difference : 0,
            roi: +config.rate_of_interest,
            repayDate: checkEmptyDate === 0 ? formattedDate : "0000-00-00",
            adminFee: adminfee,
            GstOfAdminFee: gstOfAdminFee,
            alternateMobile: String(getCustomerInfo.mobile),
            officialEmail: getCustomerInfo.email,
            cibil: 0,
            activeLoans: 0,
            status: ApprovalStatus.ApprovedProcess,
            remark: "",
            creditedBy: 1,
            employmentType: getCustomerInfo.employeeType,
          };
          await approvalService.create(data);
          await this.leadService.updateOne(
            {
              customerID: customerID,
              leadID: getLeadsInfo.leadID,
            },
            {
              status: LeadStatus.APPROVED_PROCESS,
            },
          );
        } else {
          if (offerAmount && approvedLoan.loanAmtApproved < offerAmount) {
            let loanAmtApproved =
              Number(offerAmount || 0) >
              Number(getLeadsInfo?.loanRequeried || 0)
                ? Number(getLeadsInfo?.loanRequeried || 0)
                : Number(offerAmount || 0);

            let loanAmount =
              loanAmtApproved > maxLoanAmount ? maxLoanAmount : loanAmtApproved;

            await approvalService.updateOne(
              {
                approvalID: approvedLoan.approvalID,
                customerID: getCustomerInfo.customerID,
                leadID: getLeadsInfo.leadID,
              },
              {
                loanAmtApproved: loanAmount,
                tenure: checkEmptyDate === 0 ? difference : 0,
                repayDate: checkEmptyDate === 0 ? formattedDate : "0000-00-00",
                adminFee: adminfee,
                GstOfAdminFee: gstOfAdminFee,
              },
            );
            await this.leadService.updateOne(
              {
                customerID: getCustomerInfo.customerID,
                leadID: getLeadsInfo.leadID,
              },
              { status: LeadStatus.APPROVED_PROCESS },
            );
          } else {
          }
        }
      } else if (decision === "Proceed to Bank") {
        return this.serviceResponse(
          HttpStatusCode.UnprocessableEntity,
          { message: "Proceed to Bank" },
          "Proceed to Bank",
        );
      } else if (decision === "Reject") {
        await this.leadService.updateOne(
          { customerID, leadID: loanID },
          { status: LeadStatus.REJECTED, iu_date: new Date() },
        );
        return this.serviceResponse(
          HttpStatusCode.Conflict,
          { message: "Loan Rejected" },
          "Loan Rejected",
        );
      }
      const finalResponse = {
        loanID,
        status: true,
        decision,
        offerAmount: loanAmount,
        finboxRedirect: decision === "Proceed to Bank",
      };
    }

    const finalResponse = {};
    return this.serviceResponse(
      HttpStatusCode.Ok,
      finalResponse,
      "Loan Approval Response",
    );
  } */

  async loanApprovalService(payload: ILoanApprovalPayload) {
    const { loanID, customerID } = payload;

    const getCustomerInfo = await this.customerService.findOne({ customerID });
    if (!getCustomerInfo) {
      throw new BadRequestError("Customer information not found!");
    }

    const getCustomerAddress = await this.addressService.findOne({
      customerID,
    });

    if (!getCustomerAddress) {
      throw new BadRequestError("Customer Address information not found!");
    }

    const getLeadsInfo = await this.leadService.findOne(
      { customerID, leadID: loanID },
      ["*"],
      [{ column: "leadID", order: "desc" }],
    );

    if (!getLeadsInfo) {
      throw new BadRequestError("Lead information not found!");
    }

    const { monthlyIncome } = getLeadsInfo;

    /**
     * BUSINESS SWITCH
     *
     * OLD FLOW:
     * bankAggregatorRequiredOn = ["Proceed to Bank", "PTB"]
     *
     * NEW FLOW:
     * bankAggregatorRequiredOn = ["Approve", "Proceed to Bank", "PTB"]
     */
    const bankAggregatorRequiredOn = ["Approve", "Proceed to Bank", "PTB"];

    const crifService = new CrifSoftPullService({
      appID: process.env.CRIF_APP_ID!,
      merchantID: process.env.CRIF_MERCHANT_ID!,
      username: process.env.CRIF_USERNAME!,
      secretKey: process.env.CRIF_SECRET_KEY!,
      productCode: process.env.CRIF_PRODUCT_CODE || "BBC_CONSUMER_SCORE#85#2.0",
    });

    const crifResponse = await crifService.softPull({
      firstName: getCustomerInfo.firstName || "",
      lastName: getCustomerInfo.lastName || "",
      dob: moment(getCustomerInfo.dob).format("DD-MM-YYYY"),
      mobile: String(getCustomerInfo.mobile),
      email: getCustomerInfo.email,
      pan: getCustomerInfo.pancard,
      address: getCustomerAddress.address || "",
      city: getCustomerAddress.city || "",
      district: getCustomerAddress.city || "",
      state: getCustomerAddress.state || "",
      pincode: String(getCustomerAddress.pincode || ""),
      country: "india",
      customerID,
      leadID: loanID,
    });
    console.log("crifResponse=============>", crifResponse);
    if (!crifResponse?.success) {
      throw new BadRequestError("Unable to retrieve CRIF bureau data");
    }

    const credForgeBreService = new CredForgeBreService({
      baseURL: process.env.CREDFORGE_BASE_URL!,
      clientID: process.env.CREDU_CLIENT_ID!,
      apiKey: process.env.CREDU_API_KEY!,
    });

    const bureauBreResponse = await credForgeBreService.executeBureauBre({
      userId: customerID.toString(),
      referenceId: loanID.toString(),
      leadId: loanID.toString(),
      declaredIncome: Number(monthlyIncome || 0),
      bureauType: BureauType.CRIF,
      rawBureauData: crifResponse,
    });

    if (!bureauBreResponse.success) {
      throw new BadRequestError("Failed to get Bureau BRE decision");
    }
    console.log(
      "==============================>bureauBreResponse",
      bureauBreResponse,
    );
    const decision = bureauBreResponse.decision;
    let offerAmount = bureauBreResponse.offerAmount;

    if (!decision) {
      throw new BadRequestError("Decision missing from Bureau BRE response");
    }

    if (offerAmount == null) {
      offerAmount = 0;
    }

    if (offerAmount < config.min_loan_amount) {
      offerAmount = config.min_loan_amount;
    }

    /**
     * REJECT CASE
     */
    if (decision === "Reject") {
      await this.leadService.updateOne(
        { customerID, leadID: loanID },
        { status: LeadStatus.REJECTED, iu_date: new Date() },
      );

      return this.serviceResponse(
        HttpStatusCode.Conflict,
        {
          message: "Loan Rejected",
          bureauDecision: decision,
        },
        "Loan Rejected",
      );
    }

    /**
     * NEW / OLD ROUTING LOGIC
     */
    const shouldRunBankAggregator = bankAggregatorRequiredOn.includes(decision);

    if (shouldRunBankAggregator) {
      return this.serviceResponse(
        HttpStatusCode.UnprocessableEntity,
        {
          message: "Proceed to Bank",
          bureauDecision: decision,
          offerAmount,
          finboxRedirect: true,
        },
        "Proceed to Bank",
      );
    }

    /**
     * OLD FLOW ONLY:
     * If bankAggregatorRequiredOn = ["Proceed to Bank", "PTB"],
     * then Approve will reach here and approval will be created.
     */
    if (decision === "Approve") {
      const approvedLoan = await approvalService.findOne({
        customerID,
        leadID: getLeadsInfo.leadID,
      });

      const salaryDate = getCustomerInfo.salary_date ?? "5";

      const finboxService = new FinboxService();
      const repayDateData = await finboxService.repayDateFind(
        String(salaryDate),
      );

      const formattedDate = repayDateData.formattedDate;
      const difference = repayDateData.difference;

      const maxLoanAmount = Number(config.max_loan_amount || 18000);
      const requestedAmount = Number(getLeadsInfo?.loanRequeried || 0);
      const finalOfferAmount = Number(offerAmount || 0);

      let loanAmtApproved =
        finalOfferAmount > requestedAmount ? requestedAmount : finalOfferAmount;

      let loanAmount =
        loanAmtApproved > maxLoanAmount ? maxLoanAmount : loanAmtApproved;

      let roundedLoanAmount = 0;

      if (loanAmount) {
        const modOfferAmount = loanAmount % 1000;

        if (modOfferAmount < 500) {
          roundedLoanAmount = loanAmount - modOfferAmount;
        } else {
          roundedLoanAmount = loanAmount + 1000 - modOfferAmount;
        }
      }

      loanAmount = roundedLoanAmount;

      const adminfee = (loanAmount * 10) / 100;
      const gstOfAdminFee = (adminfee * 18) / 100;

      if (!approvedLoan) {
        const data: IApproval = {
          customerID,
          leadID: Number(getLeadsInfo.leadID),
          branch: BranchName.NOIDA,
          loanAmtApproved: loanAmount,
          tenure: difference,
          roi: +config.rate_of_interest,
          repayDate: formattedDate,
          adminFee: adminfee,
          GstOfAdminFee: gstOfAdminFee,
          alternateMobile: String(getCustomerInfo.mobile),
          officialEmail: getCustomerInfo.email,
          cibil: 0,
          activeLoans: 0,
          status: ApprovalStatus.ApprovedProcess,
          remark: "",
          creditedBy: 1,
          employmentType: getCustomerInfo.employeeType,
        };

        await approvalService.create(data);
      } else if (Number(approvedLoan.loanAmtApproved || 0) < loanAmount) {
        await approvalService.updateOne(
          {
            approvalID: approvedLoan.approvalID,
            customerID: getCustomerInfo.customerID,
            leadID: getLeadsInfo.leadID,
          },
          {
            loanAmtApproved: loanAmount,
            tenure: difference,
            repayDate: formattedDate,
            adminFee: adminfee,
            GstOfAdminFee: gstOfAdminFee,
          },
        );
      }

      await this.leadService.updateOne(
        {
          customerID,
          leadID: getLeadsInfo.leadID,
        },
        {
          status: LeadStatus.APPROVED_PROCESS,
        },
      );

      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          loanID,
          status: true,
          decision,
          bureauDecision: decision,
          offerAmount: loanAmount,
          finboxRedirect: false,
        },
        "Loan Approval Response",
      );
    }

    throw new BadRequestError(`Unhandled Bureau BRE decision: ${decision}`);
  }

  generateLoanNumber = async (db, lenderID) => {
    const currentDate = moment().format("YYYYMMDD");
    const counterKey = "Loan Number";

    try {
      let counterRecord = await db("counters")
        .where("counter_key", counterKey)
        .first();

      if (!counterRecord) {
        await db("counters").insert({
          counter_key: counterKey,
          counter_value: 1,
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        if (lenderID == 2) {
          return `N${currentDate}00001`;
        } else {
          return `Y${currentDate}00001`;
        }
      }

      const lastUpdateDate = moment(counterRecord.updated_at).format(
        "YYYYMMDD",
      );

      console.log("Current date:", currentDate);
      console.log("Last update date:", lastUpdateDate);
      console.log("Current counter value:", counterRecord.counter_value);

      let newCounterValue;

      if (lastUpdateDate !== currentDate) {
        console.log("Different day detected, resetting counter to 1");
        newCounterValue = 1;
      } else {
        console.log("Same day, incrementing counter");
        newCounterValue = counterRecord.counter_value + 1;
      }

      await db("counters")
        .where("counter_key", counterKey)
        .update({
          counter_value: newCounterValue,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        });

      console.log("Updated counter value:", newCounterValue);

      const paddedCounter = newCounterValue.toString().padStart(5, "0");
      let loanNumber = "";
      if (lenderID == 2) {
        loanNumber = `N${currentDate}${paddedCounter}`;
      } else {
        loanNumber = `Y${currentDate}${paddedCounter}`;
      }

      console.log("Generated loan number:", loanNumber);
      return loanNumber;
    } catch (error) {
      console.error("Error generating loan number:", error);
      throw new Error("Failed to generate loan number");
    }
  };

  async reprocessRejectedCustomers(limit: number = 50) {
    try {
      const startDate = new Date("2025-10-01");
      const endDate = new Date("2025-10-15 23:59:59");

      // console.log(`🔍 Fetching rejected customers from Oct 1-15, 2024 with limit: ${limit}`);

      const rejectedLeadsResult = await this.leadModel.LeadsKnex.join(
        "customer as c",
        "leads.customerID",
        "=",
        "c.customerID",
      )
        .where("leads.status", LeadStatus.REJECTED)
        .whereBetween("leads.iu_date", [startDate, endDate])
        .select([
          "leads.leadID",
          "leads.customerID",
          "leads.loanRequeried",
          "c.name as customerName",
          "c.mobile as customerMobile",
        ])
        .orderBy("leads.leadID", "desc")
        .limit(limit);

      const rejectedLeads = rejectedLeadsResult as any[];

      if (!rejectedLeads || rejectedLeads.length === 0) {
        // console.log('❌ No rejected customers found for the specified date range');
        return {
          statusCode: 200,
          data: {
            processed: 0,
            approved: 0,
            rejected: 0,
            totalFound: 0,
            approvedLeadIds: [],
            rejectedLeadIds: [],
            reportFile: null,
            reportPath: null,
          },
          message: "No rejected customers found for the specified date range",
        };
      }

      // console.log(`📋 Found ${rejectedLeads.length} rejected customers to reprocess`);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `reprocess-rejected-customers-${timestamp}.csv`;
      const filePath = path.join(process.cwd(), "logs", fileName);

      const logsDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      const csvHeader =
        "LeadID,CustomerID,CustomerName,CustomerMobile,LoanRequested,Status,Decision,ProcessedAt,Remarks\n";
      fs.writeFileSync(filePath, csvHeader);

      // console.log(`📄 Created tracking file: ${fileName}`);

      let processedCount = 0;
      let approvedCount = 0;
      let rejectedCount = 0;
      let approvedLeadIds: number[] = [];
      let rejectedLeadIds: number[] = [];

      for (const lead of rejectedLeads) {
        try {
          // console.log(`🔄 Processing Customer ${lead.customerID} (${lead.customerName}) - Lead ${lead.leadID}`);

          const initialCsvRow = `${lead.leadID},${lead.customerID},"${
            lead.customerName
          }",${lead.customerMobile},${
            lead.loanRequeried || 0
          },Processing,Pending,${new Date().toISOString()},Started processing\n`;
          fs.appendFileSync(filePath, initialCsvRow);

          const approvalResult = await this.loanApprovalService({
            loanID: lead.leadID,
            customerID: lead.customerID,
          });

          // console.log(`📊 Approval result for Customer ${lead.customerID}: Status ${approvalResult.statusCode}`);

          processedCount++;

          if (approvalResult.statusCode === 200) {
            approvedCount++;
            approvedLeadIds.push(lead.leadID);

            await createStepTrackerEntry(
              lead.customerID,
              lead.leadID,
              5,
              StepName.LOAN_APPROVAL,
              "New",
            );

            const successCsvRow = `${lead.leadID},${lead.customerID},"${
              lead.customerName
            }",${lead.customerMobile},${
              lead.loanRequeried || 0
            },Completed,Approved,${new Date().toISOString()},"Loan approved successfully"\n`;
            fs.appendFileSync(filePath, successCsvRow);

            // console.log(`✅ Customer ${lead.customerID} approved on reprocessing`);
          } else if (approvalResult.statusCode === 409) {
            rejectedCount++;
            rejectedLeadIds.push(lead.leadID);

            const rejectionCsvRow = `${lead.leadID},${lead.customerID},"${
              lead.customerName
            }",${lead.customerMobile},${
              lead.loanRequeried || 0
            },Completed,Rejected,${new Date().toISOString()},"Rejected after reprocessing - lead status updated"\n`;
            fs.appendFileSync(filePath, rejectionCsvRow);

            // console.log(`❌ Customer ${lead.customerID} rejected on reprocessing - lead status updated`);
          } else if (approvalResult.statusCode === 422) {
            rejectedCount++;
            rejectedLeadIds.push(lead.leadID);

            const proceedToBankCsvRow = `${lead.leadID},${lead.customerID},"${
              lead.customerName
            }",${lead.customerMobile},${
              lead.loanRequeried || 0
            },Completed,Proceed to Bank,${new Date().toISOString()},"Proceed to Bank decision"\n`;
            fs.appendFileSync(filePath, proceedToBankCsvRow);

            // console.log(`🏦 Customer ${lead.customerID} - Proceed to Bank decision`);
          } else {
            rejectedCount++;
            rejectedLeadIds.push(lead.leadID);

            const rejectionCsvRow = `${lead.leadID},${lead.customerID},"${
              lead.customerName
            }",${lead.customerMobile},${
              lead.loanRequeried || 0
            },Completed,Rejected,${new Date().toISOString()},"Rejected with status code ${
              approvalResult.statusCode
            }"\n`;
            fs.appendFileSync(filePath, rejectionCsvRow);

            // console.log(`❌ Customer ${lead.customerID} rejected with status code ${approvalResult.statusCode}`);
          }
        } catch (error) {
          // console.error(`💥 Error processing customer ${lead.customerID}:`, error);

          const errorCsvRow = `${lead.leadID},${lead.customerID},"${
            lead.customerName
          }",${lead.customerMobile},${
            lead.loanRequeried || 0
          },Error,Failed,${new Date().toISOString()},"Error: ${
            error.message || "Unknown error"
          }"\n`;
          fs.appendFileSync(filePath, errorCsvRow);

          rejectedCount++;
          rejectedLeadIds.push(lead.leadID);
        }
      }

      const summaryRow = `\nSUMMARY:,Total Found: ${
        rejectedLeads.length
      },Processed: ${processedCount},Approved: ${approvedCount},Rejected: ${rejectedCount},,${new Date().toISOString()},Processing completed\n`;
      fs.appendFileSync(filePath, summaryRow);

      // console.log(`📊 SUMMARY: Processed ${processedCount}/${rejectedLeads.length} customers`);
      // console.log(`✅ Approved: ${approvedCount} | ❌ Rejected: ${rejectedCount}`);
      // console.log(`📄 Detailed report saved to: ${fileName}`);

      return {
        statusCode: 200,
        data: {
          processed: processedCount,
          approved: approvedCount,
          rejected: rejectedCount,
          totalFound: rejectedLeads ? rejectedLeads.length : 0,
          approvedLeadIds: approvedLeadIds,
          rejectedLeadIds: rejectedLeadIds,
          reportFile: fileName,
          reportPath: filePath,
        },
        message: `Reprocessed ${processedCount} customers. ${approvedCount} approved, ${rejectedCount} rejected. Report saved to ${fileName}`,
      };
    } catch (error) {
      // console.error('Error in reprocessRejectedCustomers:', error);
      return {
        statusCode: 500,
        data: null,
        message: "Internal server error while reprocessing customers",
      };
    }
  }

  aadharVerificationWebhookDigiLockerDigitap = async (
    payload: IAadharVerificationWebhookDigiLockerDigitap,
  ) => {
    try {
      const { transactionId, customerID, mobile, state } = payload;

      const digitapResponse =
        await this.digitapNewService.getDigitapDigiLockerDetails(
          customerID,
          transactionId,
          mobile,
        );

      if (!digitapResponse.success) {
        throw new BadRequestError(
          digitapResponse.data?.msg || "Failed to get DigiLocker details",
          { data: digitapResponse.data },
        );
      }

      const model = digitapResponse.data?.model;

      if (!model || model.status !== "s") {
        throw new BadRequestError("DigiLocker verification not completed", {
          data: digitapResponse.data,
        });
      }

      const aadhaarNumber = String(model.maskedAdharNumber || "");
      const aadhaarDob = model.dob || "";
      const aadhaarGender = model.gender || "";
      const aadhaarName = model.name || "";

      const address = model.address || {};

      const {
        house = "",
        street = "",
        landmark = "",
        loc = "",
        po = "",
        vtc = "",
        subdist = "",
        dist = "",
        state: aadhaarState = "",
        pc = "",
        country = "",
      } = address;

      const parts = [
        model.careOf,
        house,
        street,
        landmark || loc,
        po,
        vtc,
        subdist,
        dist,
        aadhaarState,
        pc,
        country,
      ].filter(Boolean);

      const customerAddress = parts.join(", ");
      const customerHouse = house;
      const customerCity = vtc || dist;
      const customerState = aadhaarState;
      const customerPincode = pc || null;

      if (isPincodeBlocked(customerPincode)) {
        throw new BadRequestError("Service not available in this area", {
          data: {
            pincode: customerPincode,
          },
        });
      }

      const getCustomerData = await this.customerService.findOne({
        customerID,
      });

      if (aadhaarName) {
        await this.customerService.updateOne({ customerID }, { aadhaarName });
      }

      const panLeadApiLogData =
        await this.leadApiLogService.findPanComprehensiveResponseByCustomerIDDigitap(
          customerID,
        );

      if (!panLeadApiLogData) {
        throw new BadRequestError("Failed to get PAN CARD data", {
          data: null,
        });
      }

      const dobMatchResponse = await matchPanAadhaarDob(
        aadhaarDob,
        panLeadApiLogData.dob,
      );

      if (!dobMatchResponse) {
        throw new BadRequestError("Aadhaar DOB and PAN DOB didn't match");
      }

      const maskedAadhaar = String(
        panLeadApiLogData.masked_aadhaar || "",
      ).replace(/\s/g, "");

      const digitapMaskedAadhaar = String(aadhaarNumber || "").replace(
        /\s/g,
        "",
      );

      let aadhaarMatched = false;

      if (
        digitapMaskedAadhaar.slice(-4) === maskedAadhaar.slice(-4) &&
        /^\d{4}$/.test(maskedAadhaar.slice(-4))
      ) {
        aadhaarMatched = true;
      }

      if (!aadhaarMatched) {
        const last2Digitap = digitapMaskedAadhaar.slice(-2);
        const last2Pan = maskedAadhaar.slice(-2);

        if (/^\d{2}$/.test(last2Pan) && last2Digitap === last2Pan) {
          aadhaarMatched = true;
        }
      }

      if (!aadhaarMatched) {
        throw new BadRequestError("Aadhaar Number didn't match");
      }

      const nameMatchResponse = await getNameMatchPercentage(
        getCustomerData.name,
        aadhaarName,
      );

      if (nameMatchResponse < 70) {
        throw new BadRequestError("Aadhaar Name didn't match with PAN Name");
      }

      const baseRecordData = {
        customer_id: customerID,
        lead_id: 0,
        mobile_no: mobile.toString(),
      };

      await Promise.all([
        customerNameMatchservice.create({
          ...baseRecordData,
          type: NameMatchType.AADHAAR_PAN_DOB_DIGILOCKER,
          first_name: aadhaarDob,
          second_name: panLeadApiLogData.dob,
          percentage: "100",
          percentage_data: JSON.stringify({
            pandob: panLeadApiLogData.dob,
            aadhaardob: aadhaarDob,
            percentage: 100,
          }),
          status: 1,
        }),

        customerNameMatchservice.create({
          ...baseRecordData,
          type: NameMatchType.AADHAAR_PAN_NAME_DIGILOCKER,
          first_name: panLeadApiLogData.full_name,
          second_name: aadhaarName,
          percentage: String(nameMatchResponse),
          percentage_data: JSON.stringify({
            panName: panLeadApiLogData.full_name,
            aadhaarName,
            percentage: nameMatchResponse,
          }),
          status: nameMatchResponse >= 70 ? 1 : 0,
        }),
      ]);

      // await this.leadApiLogService.create({
      //   customerID,
      //   api_type: LeadLogApiType.DIGITAP_GET_DIGILOCKER_DETAILS,
      //   api_supplier: ApiSupplierType.DIGITAP,
      //   api_response: JSON.stringify(model),
      //   status: 1,
      //   api_endpoint_url:
      //     config.digitapApi + DigitapApiUrl.GET_DIGILOCKER_DETAILS,
      //   api_method: "POST",
      //   api_headers: JSON.stringify({}),
      //   api_request: JSON.stringify({ transactionId }),
      //   mobile_no: mobile.toString(),
      //   entity_id: state || transactionId,
      //   aadharNo: aadhaarNumber.slice(-4),
      // });

      const folder = `digitap/digilocker/aadhaar/${customerID}`;

      let customerAadhaar;

      const aadhaarPdf = model.digilockerFiles?.find(
        (file: any) =>
          ["AADHAAR", "DIGILOCKER_PDF"].includes(file.docType) &&
          file.docExtension === "pdf",
      );

      const aadhaarXml = model.digilockerFiles?.find(
        (file: any) =>
          file.docType === "AADHAAR" && file.docExtension === "xml",
      );

      if (aadhaarXml?.docLink) {
        await this.s3Service.uploadFromSignedUrl(
          aadhaarXml.docLink,
          folder,
          `${customerID}_aadhaar_xml`,
          true,
        );
      }

      if (aadhaarPdf?.docLink) {
        customerAadhaar = await this.s3Service.uploadFromSignedUrl(
          aadhaarPdf.docLink,
          folder,
          `${customerID}_aadhaar.pdf`,
          false,
        );
      }

      if (customerAadhaar) {
        await documentModel.insert({
          customerID,
          type: "Aadhar Card",
          documentType: "Aadhar Card",
          documentFile: customerAadhaar.Key,
          status: "Verified",
          uploadBy: customerID,
          uploadedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          verifiedBy: customerID,
          verifiedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          upload_platform: "S3",
        });
      }

      const existingAddress = await this.addressService.findOne(
        { customerID },
        ["addressID", "type"],
        [{ column: "addressID", order: "desc" }],
      );

      const addressPayload = {
        customerID,
        address: customerAddress,
        city: customerCity || "",
        state: customerState || "",
        pincode: customerPincode,
        landmark: "",
        fetchedBy: "DigiLocker Digitap",
        status: "Verified" as const,
        verifiedBy: 1,
        type: existingAddress ? existingAddress.type : "Current Address",
      };

      if (existingAddress) {
        await this.addressService.updateOne({ customerID }, addressPayload);
      } else {
        await this.addressService.create(addressPayload);
      }

      return this.serviceResponse(200, {}, "Success");
    } catch (error) {
      if (error instanceof Error) {
        return this.serviceResponse(400, {}, error.message);
      }

      return this.serviceResponse(400, {}, "Unknown error");
    }
  };
}

export const onboardingservice = new OnboardingService();
