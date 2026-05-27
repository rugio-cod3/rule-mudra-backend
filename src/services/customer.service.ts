import config from "@/config/default";
import CustomerModel from "@/database/mysql/customer";
import MoblieTokenModel from "@/database/mysql/mobileToken";
import { productModel } from "@/database/mysql/product";
import { stepControlModel } from "@/database/mysql/step-control";
import { stepTrackerModel } from "@/database/mysql/step_tracker";
import { BranchName, StepName } from "@/enums/common.enum";
import { DashboardLeadStatus, LeadStatus, LeadType } from "@/enums/lead.enum";
import { ProductID, Products } from "@/enums/product.enum";

import { notificationUtils } from "@/common/common-module/src/utils/notification";
import { approvalModel } from "@/database/mysql/approval";
import CallHistoryLogModel from "@/database/mysql/callhistorylogs";
import { documentFinboxmodel } from "@/database/mysql/documentFinbox";
import KaleyraLogsModel from "@/database/mysql/kaleyraLogs";
import LeadModel from "@/database/mysql/leads";
import { loanModel } from "@/database/mysql/loan";
import LoginOtpModel from "@/database/mysql/login_otp";
import { otpModel } from "@/database/mysql/otp";
import { referrerModel } from "@/database/mysql/referrer";
import { ApprovalStatus } from "@/enums/approvalStatus.enum";
import { CallType } from "@/enums/callHistory.enum";
import { FinboxUrls } from "@/enums/finbox.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { LenderList, LenderName } from "@/enums/lender.enum";
import { LoanStatus } from "@/enums/loan.enum";
import { BadRequestError, NotFoundError } from "@/errors";
import CommonHelper, {
  commonHelper as commonHelperInstance,
} from "@/helpers/common";
import {
  ICustomer,
  ICustomerCheck,
  ICustomerFinboxAccountResponse,
  ICustomerLoginPayload,
  IDashboardMessages,
  IOnePageView,
  TSelectCustomer,
} from "@/interfaces/customer.interface";
import { IDocumentFinboxInterfaceModel } from "@/interfaces/documentFinbox.interface";
import { ILead } from "@/interfaces/lead.interface";
import { IMobileToken } from "@/interfaces/mobileToken.interface";
import {
  ICustomerCheckDetails,
  INewApiCheckCustomer,
  INewApiCheckCustomerBody,
  INewApiCibilAndBre,
} from "@/interfaces/onboarding.interface";
import { ICreateOTP, IVerifyOTP } from "@/interfaces/otp.interface";
import { IServiceResponse } from "@/interfaces/service.interface";
import { IStepControlModel } from "@/interfaces/step-control.interface";
import CreditService from "@/services/credit.service";
import CustomerAccountService from "@/services/customerAccount.service";
import { documentFinboxservice } from "@/services/documentFinbox.service";
import EmiService from "@/services/emi.service";
import { leadService } from "@/services/lead.service";
import LoanService from "@/services/loan.service";
import { phpLogIn } from "@/services/php.service";
import TransectionService from "@/services/teansections.services";
import { MessageVendor } from "@/thirdPartyIntegrations/notifications/interfaces/sms.interface";
import { MessageService } from "@/thirdPartyIntegrations/notifications/services/new_sms.service";
import {
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from "@/types/model.types";
import { sendOtptoMobile } from "@/utils/kaleyra.utils";
import { logger } from "@/utils/logger";
import { sendOtpTextNation } from "@/utils/msg91";
import { getKnexInstance } from "@/utils/mysql";
import { handlePhpCustomers } from "@/utils/step.util";
import { HttpStatusCode } from "axios";
import { differenceInYears } from "date-fns";
import { Request } from "express";
import momentTz from "moment-timezone";
import AddressService from "./address.service";
import AxiosService from "./api.service";
import { approvalService } from "./approval.service";
import EmployerService from "./employer.service";
import FirebaseNotificationService from "./firebase.service";
import LeadApiLogService from "./lead_api_log.service";
import MobileTokenService from "./mobile_token.service";
import ResponseService from "./response.service";
import { stepService } from "./step.service";
import { finboxService } from "./thirdParty/finbox.service";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

class CustomerService extends ResponseService {
  private customerModel = new CustomerModel();
  private mobileToken = new MoblieTokenModel();
  private firebaseNotificationService = new FirebaseNotificationService();
  private mobileTokenService = new MobileTokenService();
  private commonHelper = commonHelperInstance;
  private leadApiLogService = new LeadApiLogService();
  private customerAccountService = new CustomerAccountService();
  private leadService = leadService;
  private addressService = new AddressService();
  private employerService = new EmployerService();
  private readonly callhistoryLogModel = new CallHistoryLogModel();
  private readonly leadModel = new LeadModel();
  private readonly documentFinboxService = documentFinboxservice;
  private readonly otpModel = otpModel;
  private readonly steptrackerModel = stepTrackerModel;
  private readonly stepControlModel = stepControlModel;
  private readonly stepService = stepService;
  private readonly approvalService = approvalService;
  private readonly documentFinboxModel = documentFinboxmodel;
  private readonly loanModel = loanModel;
  private readonly finboxService = finboxService;
  private readonly approvalModel = approvalModel;
  private creditService = new CreditService();
  private loanService = new LoanService();
  private emiService = new EmiService();
  private transectionService = new TransectionService();
  private Logs = new KaleyraLogsModel();
  private readonly referrerModel = referrerModel;
  private notificationUtil = notificationUtils;
  private loginOtpModel = new LoginOtpModel();

  public isLoggedInAnotherDevice = async (
    androidId: string,
    mobile: string,
    customerID: string,
  ): Promise<Boolean> => {
    if (!androidId) {
      return Promise.resolve(false);
    }
    let db = getKnexInstance();
    try {
      // Fetch the existing token for the mobile number from the database
      const existingToken = await db("mobile_token")
        .where("mobile", mobile)
        .first();
      if (existingToken && existingToken.android_id !== androidId) {
        // If there is an existing token with a different android_id
        if (existingToken.firebase_token !== null) {
          // Send a notification for a second device login
          await this.firebaseNotificationService.sendNotificationForSecondDeviceLogin(
            existingToken.firebase_token,
            customerID,
          );

          // Update the database to set the firebase_token to null
          await db("mobile_token")
            .where("mobile", mobile)
            .update({ firebase_token: null });
        }

        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    } catch (error) {
      console.error("Error in isLoggedInAnotherDevice:", error);
      return Promise.resolve(false);
    }
  };
  public async customerLogin(
    payload: ICustomerLoginPayload,
  ): Promise<IServiceResponse> {
    const { mobile, app_id: appID, imei } = payload;
    const otp = CommonHelper.otpCode();
    let customer_data: Array<ICustomer> = await this.customerModel.getCustomer(
      mobile,
    );
    let mobile_token_data: Array<IMobileToken>;
    let customer_id = 0;

    if (customer_data && customer_data.length > 0 && customer_data[0]) {
      mobile_token_data = await this.mobileToken.getMobileToken(mobile);
      customer_id = customer_data[0].customerID;
      await this.customerModel.updateCustomerCol(customer_id, "otp", otp);
    } else {
      const savedCustomer = await this.customerModel.saveCustomer(mobile);
      if (savedCustomer.affectedRows == 1) {
        customer_id = savedCustomer.inserappIDtId;
        // Insert Step here , and also send next step details
      }
    }

    if (mobile_token_data && mobile_token_data.length > 0) {
      await this.mobileToken.updateMobileToken(
        customer_id,
        mobile,
        appID,
        imei,
      );
    } else {
      await this.mobileToken.saveMobileToken(customer_id, mobile, appID, imei);
    }
    await this.customerModel.updateCustomerCol(customer_id, "otp", otp);
    const otpResponse = await sendOtptoMobile(mobile, +otp);
    if (otpResponse.error && Object.keys(otpResponse.error).length > 0) {
      throw new Error(`Error caught: ${JSON.stringify(otpResponse.error)}`);
    }
    return this.serviceResponse(200, {}, "OTP sent successfully.");
  }

  // public async verifyOtp(
  //   req: Request,
  //   request_id: string,
  //   otp: number
  // ): Promise<IServiceResponse> {
  //   let default_otp = +config.defaultOtp;
  //   const now: Date = new Date(Date.now());
  //   // Initialize variables
  //   let statusCode: string = "0";
  //   let messageCode: string = "Incorrect OTP. Please try again.";
  //   let accessToken: string = "";
  //   let data: object = {};
  //   let db = getKnexInstance();
  //   let queryOnOTP = db.table("otp").where("request_id", request_id);
  //   let findOtpDetails = await queryOnOTP
  //     .select("mobile_no", "expiresAt", "otp")
  //     .first();

  //   console.log("findOtpDetails", findOtpDetails);

  //   let query = db.table("customer").where("mobile", findOtpDetails.mobile_no);

  //   let findCustomer = await query
  //     .select("mobile", "customerID as user_id", "name")
  //     .first();

  //   console.log("findCustomer", findCustomer);

  //   if (!findCustomer)
  //     throw new NotFoundError(
  //       "User with mobile number " + findOtpDetails.mobile_no + " not found."
  //     );

  //   // if (otp != default_otp) {
  //   console.log("findOtpDetails", findOtpDetails);
  //   if (findOtpDetails.otp != otp) {
  //     throw new BadRequestError("Incorrect OTP. Please try again.");
  //   }
  //   // }

  //   statusCode = "1";
  //   messageCode = "OTP verified successfully.";
  //   // accessToken = loginData.access_token
  //   data = findCustomer;
  //   data = {};

  //   // Response
  //   const response = {
  //     status: statusCode,
  //     message: messageCode,
  //     access_token: accessToken,
  //     jwt_token: "",
  //     data: data,
  //   };

  //   // const apiLogs = {
  //   //   customerID: findCustomer ? findCustomer.customerID : null,
  //   //   mobile: mobile,
  //   //   api_request: JSON.stringify(req.body),
  //   //   api_response: JSON.stringify(response),
  //   //   created_at: now,
  //   //   status: statusCode,
  //   //   message: messageCode,
  //   //   api_name: 'otp_verify',
  //   // }
  //   // await apiReqResLogs(apiLogs);
  //   let token = await this.commonHelper.getJWT(
  //     findCustomer.user_id
  //     //config.jwtSecret,
  //   );
  //   response.jwt_token = token;
  //   if (token) {
  //     await this.mobileTokenService.updateOne(
  //       { mobile: findOtpDetails.mobile_no, customerID: findCustomer.user_id },
  //       { jwt_access_token: token, access_token: accessToken }
  //     );
  //   } else {
  //     logger.error("Error In Creating And Updating JWT");
  //   }

  //   const [lead, leadCount] = await Promise.all([
  //     this.leadService.getLeadDetails(findCustomer.user_id),
  //     this.leadModel.countLeads({
  //       customerID: findCustomer.user_id,
  //     }),
  //   ]);
  //   let user_type = "New Customer";
  //   if (leadCount > 1) {
  //     user_type = "Repeat Customer";
  //   }

  //   return this.serviceResponse(
  //     200,
  //     {
  //       user: data,
  //       access_token: token,
  //       loan: {
  //         loan_id: lead?.leadID ?? null,
  //         productId: lead?.productId ?? null,
  //       },
  //     },
  //     messageCode
  //   );
  // }

  public async verifyOtp(
    req: Request,
    request_id: string,
    otp: number,
  ): Promise<IServiceResponse> {
    let db = getKnexInstance();
    let data: object = {};
    let statusCode: string = "0";
    let messageCode: string = "Incorrect OTP. Please try again.";
    // harcode testing mobile and otp
    const test_mobile_no = config.testing_mobile;

    let checkDefaultMobile = await db
      .table("otp")
      .where("request_id", request_id)
      .select("mobile_no")
      .first();

    if (
      checkDefaultMobile?.mobile_no &&
      checkDefaultMobile.mobile_no == test_mobile_no
    ) {
      let query = db
        .table("customer")
        .where("mobile", checkDefaultMobile.mobile_no);
      let findCustomer = await query
        .select("mobile", "customerID as user_id", "name")
        .first();

      console.log("findCustomer", findCustomer);

      if (!findCustomer) {
        throw new NotFoundError(
          "User with mobile number " +
            checkDefaultMobile.mobile_no +
            " not found.",
        );
      }

      let token = await this.commonHelper.getJWT(findCustomer.user_id);

      if (token) {
        await this.mobileTokenService.updateOne(
          {
            mobile: checkDefaultMobile.mobile_no,
            customerID: findCustomer.user_id,
          },
          { jwt_access_token: token, access_token: "" },
        );
      } else {
        logger.error("Error In Creating And Updating JWT");
      }

      const [lead, leadCount] = await Promise.all([
        this.leadService.getLeadDetails(findCustomer.user_id),
        this.leadModel.countLeads({
          customerID: findCustomer.user_id,
        }),
      ]);
      data = findCustomer;
      messageCode = "OTP verified successfully.";
      return this.serviceResponse(
        200,
        {
          user: data,
          access_token: token,
          loan: {
            loan_id: lead?.leadID ?? null,
            productId: lead?.productId ?? null,
            loan_type: lead?.fbLeads ?? null,
          },
        },
        messageCode,
      );
    }
    let default_otp = +config.defaultOtp;
    const now: Date = new Date(Date.now());
    const MAX_FAILED_ATTEMPTS = 4;
    let accessToken: string = "";
    let queryOnOTP = db.table("otp").where("request_id", request_id);
    let findOtpDetails = await queryOnOTP
      .select("mobile_no", "expiresAt", "otp", "failed_attempts")
      .first();

    console.log("findOtpDetails", findOtpDetails);

    if (!findOtpDetails) {
      throw new NotFoundError("OTP request not found.");
    }

    if (new Date(findOtpDetails.expiresAt) < now) {
      throw new BadRequestError("OTP has expired. Please request a new one.");
    }

    const currentFailedAttempts = findOtpDetails.failed_attempts || 0;
    if (currentFailedAttempts >= MAX_FAILED_ATTEMPTS) {
      throw new BadRequestError(
        `OTP verification attempts (${MAX_FAILED_ATTEMPTS}) exceeded. Please request a new OTP.`,
      );
    }

    let query = db.table("customer").where("mobile", findOtpDetails.mobile_no);
    let findCustomer = await query
      .select("mobile", "customerID as user_id", "name")
      .first();

    console.log("findCustomer", findCustomer);

    if (!findCustomer) {
      throw new NotFoundError(
        "User with mobile number " + findOtpDetails.mobile_no + " not found.",
      );
    }

    if (findOtpDetails.otp != otp) {
      const newFailedAttempts = currentFailedAttempts + 1;

      await db.table("otp").where("request_id", request_id).update({
        failed_attempts: newFailedAttempts,
        updated_at: now,
      });

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        throw new BadRequestError(
          `Incorrect OTP. Maximum attempts (${MAX_FAILED_ATTEMPTS}) reached. Please request a new OTP.`,
        );
      }

      const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailedAttempts;
      throw new BadRequestError(
        `Incorrect OTP. ${remainingAttempts} attempt(s) remaining.`,
      );
    }

    await db.table("otp").where("request_id", request_id).update({
      failed_attempts: 0,
      updated_at: now,
    });

    statusCode = "1";
    messageCode = "OTP verified successfully.";
    data = findCustomer;

    let token = await this.commonHelper.getJWT(findCustomer.user_id);

    if (token) {
      await this.mobileTokenService.updateOne(
        { mobile: findOtpDetails.mobile_no, customerID: findCustomer.user_id },
        { jwt_access_token: token, access_token: accessToken },
      );
    } else {
      logger.error("Error In Creating And Updating JWT");
    }

    const [lead, leadCount] = await Promise.all([
      this.leadService.getLeadDetails(findCustomer.user_id),
      this.leadModel.countLeads({
        customerID: findCustomer.user_id,
      }),
    ]);

    let user_type = "New Customer";
    if (leadCount > 1) {
      user_type = "Repeat Customer";
    }

    const response = {
      status: statusCode,
      message: messageCode,
      access_token: accessToken,
      jwt_token: token,
      data: data,
    };
    // Once OTP is verified we will create entry of the source in the user_attribution table
    // To get the source we will use mobile to get the existing refferes and then store in the user_attributions
    const getReferers = await db("referrers")
      .where({
        mobile: findOtpDetails.mobile_no,
      })
      .select("referrer")
      .orderBy("id", "desc")
      .limit(1);
    const latestReferrer = getReferers?.[0]?.referrer ?? null;
    if (latestReferrer) {
      const getExistingAttributions = await db("user_attributions")
        .where({ customerID: findCustomer.user_id })
        .select("source")
        .orderBy("createdDate", "desc")
        .limit(1);
      const existingAttribution = getExistingAttributions[0];
      if (!existingAttribution) {
        await db("user_attributions").insert({
          customerID: findCustomer.user_id,
          source: latestReferrer,
          expiryDate: db.raw("DATE_ADD(NOW(), INTERVAL 30 DAY)"),
        });
      } else {
        const { source, expiryDate } = existingAttribution;
        const isExpired =
          !expiryDate || new Date(expiryDate).getTime() < Date.now();
        if (isExpired) {
          // Existing source expired → insert new
          await db("user_attributions").insert({
            customerID: findCustomer.user_id,
            source: latestReferrer,
            expiryDate: db.raw("DATE_ADD(NOW(), INTERVAL 30 DAY)"),
          });
        } else {
          console.log("Active attribution exists, skipping insert:", source);
        }
      }
    }
    return this.serviceResponse(
      200,
      {
        user: data,
        access_token: token,
        loan: {
          loan_id: lead?.leadID ?? null,
          productId: lead?.productId ?? null,
          loan_type: lead?.fbLeads ?? null,
        },
      },
      messageCode,
    );
  }

  public async findOne(
    where: WhereQuery<ICustomer>,
    select: SelectFields<TSelectCustomer> = ["*"],
    order?: SortCriteria<TSelectCustomer>,
  ): Promise<ICustomer> {
    return await this.customerModel.findOneCustomer(where, select, order);
  }

  public async updateOne(
    where: WhereQuery<ICustomer>,
    update: UpdateQuery<ICustomer>,
  ): Promise<number> {
    return await this.customerModel.findOneAndUpdate(where, update);
  }

  public async customerLoginByMsg91(
    payload: ICustomerLoginPayload,
  ): Promise<IServiceResponse> {
    const { mobile, app_id: appID, imei, utm_source, plateform } = payload;
    const OTP_EXPIRY_MINUTES = 5;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

    let customer_data = await this.customerModel.findOneCustomer({ mobile }, [
      "mobile",
      "customerID",
    ]);
    let mobile_token_data: IMobileToken;
    let customer_id = customer_data?.customerID;
    let Mobile = String(mobile);

    if (customer_data) {
      mobile_token_data = await this.mobileToken.findOneMobileToken(
        { mobile: Mobile },
        ["mobile", "customerID"],
        [{ column: "id", order: "desc" }],
      );
      await this.customerModel.updateCustomerCol(customer_id, "otp", newOtp);
    } else {
      const savedCustomer = await this.customerModel.saveCustomer(
        mobile,
        plateform,
      );
      if (savedCustomer && savedCustomer.affectedRows == 1) {
        customer_id = savedCustomer.insertId;
      }
      console.log("savedCustomer", savedCustomer);
    }

    // Handle mobile token data
    if (mobile_token_data) {
      await this.mobileToken.updateMobileToken(
        customer_id,
        mobile,
        appID,
        imei,
      );
    } else {
      await this.mobileToken.saveMobileToken(customer_id, mobile, appID, imei);
    }

    await this.customerModel.updateCustomerCol(customer_id, "otp", newOtp);

    if (utm_source) {
      logger.info("Customer came from UTM Source: " + utm_source);
      await this.referrerModel.create({
        referrer: utm_source,
        mobile,
      });
    }

    let request_id: string;
    request_id = uuidv4();
    await this.loginOtpModel.insert({
      mobile_no: mobile,
      request_id: request_id,
      otp: newOtp,
      expiresAt: expiresAt,
      created_at: new Date(),
      mobile_enc: "",
      vender_id: 1,
    });

    const smsService = new MessageService();
    const otpValidity = 5;
    await smsService.sendMessage({
      user: "hexanet",
      authKey: "92hOJEZhxZQ42",
      sender: "TWOMTF", //TWOFIN, TMINFT
      mobile: mobile.toString(),
      // message: `Otp for website Login ${newOtp} and Valid for 1 Minutes. Do not share this OTP with anyone. KredBharat`,
      message: `Your OTP for website login is ${newOtp}. This OTP is valid for 1 minute. Please do not share it with anyone. TwoMinutes Fintech`,
      templateID: "1707177969320010065",
      entityID: "1701171000580711908",
      vendor: MessageVendor.NIMBUSIT,
      rpt: 1,
    });
    https: return this.serviceResponse(
      200,
      { request_id: request_id },
      "OTP sent successfully.",
    );
  }

  // new service for create OTP
  public async createOtpService(
    payload: ICreateOTP,
  ): Promise<IServiceResponse> {
    let { mobile, req_id, otp, isVerified } = payload;
    otp = CommonHelper.otpCode();
    req_id = CommonHelper.createReqIdForOtp(25);
    let data = {};
    // Send OTP to mobile using Kaleyra
    const otpResponse = await sendOtpTextNation(mobile, +otp);

    console.log("Otp res =========>", otpResponse.data);
    const lastOtp = await this.otpModel.find({
      where: {
        mobile: mobile,
      },
      select: ["otp", "mobile", "created_at"],
      order: [{ column: "id", order: "desc" }],
    });

    if (lastOtp) {
      // Check if OTP is sent in last 30 seconds or not
      const utcDate = CommonHelper.compareTime(lastOtp["created_at"]);
      if (utcDate) throw new BadRequestError("Please try after 30 seconds");
    }

    // // Save OTP in database
    data = { mobile: mobile, req_id: req_id };
    await this.otpModel.insert({ mobile: mobile, otp: otp, req_id: req_id });

    // Return success response with OTP payload
    return this.serviceResponse(200, data, "OTP sent successfully.");
  }

  public async verifyOtpService(
    payload: IVerifyOTP,
  ): Promise<IServiceResponse> {
    let { mobile, otp, req_id, androidId, firebaseToken } = payload;
    // const otpFromDb = await this.otpModel.find({mobile: mobile, req_id: req_id}, ['otp'])
    const otpFromDb = await this.otpModel.find({
      where: {
        mobile: mobile,
        req_id: req_id,
        otp,
      },
      select: ["otp", "isVerified"],
    });

    if (otpFromDb && otpFromDb["isVerified"]) {
      throw new BadRequestError("OTP is already verified.");
    }
    if (!otpFromDb || otpFromDb["otp"] !== otp) {
      throw new BadRequestError("Incorrect OTP.");
    }
    // set isVerified as true if correct
    await this.otpModel.update(
      { mobile: mobile, req_id: req_id },
      { isVerified: true },
    );
    let customer_data = await this.customerModel.findOneCustomer({ mobile }, [
      "mobile",
      "customerID",
    ]);
    let mobile_token_data: IMobileToken;
    let Mobile = String(mobile);
    let accessToken: string = "";
    let data: object = {};
    let result: object = {};

    if (customer_data) {
      mobile_token_data = await this.mobileToken.findOneMobileToken(
        { mobile: Mobile },
        ["mobile", "customerID"],
        [{ column: "id", order: "desc" }],
      );
      let loginData = await phpLogIn(
        mobile,
        +config.defaultOtp,
        androidId,
        firebaseToken,
      );
      accessToken = loginData.access_token;
      data = customer_data;
      // Response
      const response = {
        access_token: accessToken,
        jwt_token: "",
        customer: data,
      };
      let token = await this.commonHelper.getJWT(
        customer_data.customerID,
        //config.jwtSecret,
      );
      response.jwt_token = token;
      if (token) {
        let getMobileToken = await this.mobileToken.getMobileToken(mobile);
        if (getMobileToken) {
          await this.mobileTokenService.updateOne(
            { mobile, customerID: customer_data.customerID },
            { jwt_access_token: token, access_token: accessToken },
          );
        } else {
          await this.mobileToken.saveMobileToken(
            customer_data.customerID,
            mobile,
            "",
            "",
          );
        }
        result = response;
      } else {
        logger.error("Error In Creating And Updating JWT");
      }
    } else {
      let getNewCustID = await this.customerModel.saveCustomer(mobile);
      let loginData = await phpLogIn(
        mobile,
        +config.defaultOtp,
        androidId,
        firebaseToken,
      );
      let token = await this.commonHelper.getJWT(
        getNewCustID.insertId,
        //config.jwtSecret,
      );
      result = {
        access_token: loginData.access_token,
        jwt_access_token: token,
        customer: { customerID: getNewCustID.insertId, mobile: mobile },
      };
      await this.mobileToken
        .saveMobileToken(getNewCustID.insertId, mobile, "", "")
        .then(async () => {
          await this.mobileTokenService.updateOne(
            { mobile, customerID: getNewCustID.insertId },
            { jwt_access_token: token, access_token: loginData.access_token },
          );
        });
    }
    return this.serviceResponse(200, result, "OTP verified successfully.");
  }

  public async customerCheckForDashboard(
    customerData: ICustomer,
  ): Promise<ICustomerCheck> {
    let pancard = customerData?.pancard;
    let aadharNumber = String(customerData?.aadharNo);
    let mobile = String(customerData?.mobile);
    let customerId = customerData.customerID;

    const isPanVerified = await this.leadApiLogService.checkCustomerPanStatus(
      pancard,
    );
    const isAadharVerified =
      await this.leadApiLogService.checkCustomerAadharStatus(aadharNumber);
    const isDigilockerVerified =
      await this.leadApiLogService.checkCustomerDigilockerStatus(mobile);
    const isSelfieMatched = await this.leadApiLogService.checkSelfieMatch(
      mobile,
    );

    const checkOfferAmount = await this.leadApiLogService.checkOfferAmount(
      pancard,
      mobile,
    );
    const isBankAccount = await this.customerAccountService.checkBankAccount(
      customerId,
    );
    const findLeadIdAndStatus = await this.leadService.findLeadAndStatus(
      customerId,
    );
    let leadId = findLeadIdAndStatus.leadID;
    let customerleadId: ILead | undefined;
    let utmSource: string;
    if (leadId) {
      customerleadId = await this.leadService.findOne(
        { leadID: leadId, customerID: customerId },
        [
          "leadID",
          "purpose",
          "loanRequeried",
          "monthlyIncome",
          "salaryMode",
          "status",
          "utmSource",
          "step",
          "kfs",
          "createdDate",
          "customerID",
          "ipc",
        ],
      );
    } else {
      customerleadId = await this.leadService.findOne(
        { customerID: customerId },
        [
          "leadID",
          "purpose",
          "loanRequeried",
          "monthlyIncome",
          "salaryMode",
          "status",
          "utmSource",
          "step",
          "kfs",
          "createdDate",
          "customerID",
          "ipc",
        ],
        [{ column: "leadID", order: "desc" }],
        { status: LeadStatus.DUPLICATE },
      );
      if (!customerleadId) {
        customerleadId = await this.leadService.findOne(
          { customerID: customerId },
          [
            "leadID",
            "purpose",
            "loanRequeried",
            "monthlyIncome",
            "salaryMode",
            "status",
            "utmSource",
            "step",
            "kfs",
            "createdDate",
            "customerID",
            "ipc",
          ],
        );
      }
    }
    let customerAddress = await this.addressService.findOne(
      { customerID: customerId },
      ["addressID", "type", "address", "city", "state", "pincode"],
      [{ column: "addressID", order: "desc" }],
    );
    let customerEmployer = await this.employerService.findOne(
      { customerID: customerId },
      [
        "employerID",
        "employerName",
        "currentCompany",
        "address",
        "city",
        "state",
        "pincode",
      ],
      [{ column: "employerID", order: "desc" }],
    );
    if (customerleadId) {
      utmSource = customerleadId.utmSource;
    } else {
      utmSource = global.newapp_utmSource;
    }
    const checkFinbox = await this.documentFinboxService.checkFinbox(
      customerleadId.leadID,
    );
    const isBreChecked = await this.leadApiLogService.checkBre(
      pancard,
      utmSource,
    );
    const response: ICustomerCheck = {
      is_pancard: isPanVerified,
      is_aadhar: isAadharVerified,
      is_digilocker: isDigilockerVerified,
      selfie_check: isSelfieMatched,
      bre_status: isBreChecked,
      offerAmount: checkOfferAmount,
      checkBankAccount: isBankAccount,
      finbox_status: checkFinbox,
      address: customerAddress,
      employer_details: customerEmployer,
    };

    return response;
  }

  private async getNoOfEMIs(leadID: number): Promise<number> {
    const credit = await this.creditService.findOne({ leadID }, ["tenure"]);
    return credit?.tenure || null;
  }

  dashboard = async (customer: ICustomer, userIp: string) => {
    const { customerID } = customer;

    // Find existing customer, new customer or repeat

    let lead = await this.leadService.findOneLead({
      where: {
        customerID,
      },
      order: [{ column: "leadID", order: "desc" }],
      select: ["leadID", "status", "ipc", "fbLeads"],
    });

    // If no lead then new customer

    if (!lead) {
      const messages = await this.handleNewCustomer(customer, userIp);
      return this.serviceResponse(200, messages, "Dashboard Details");
    }

    // Check duplicated lead
    lead = await this.checkDuplicateLead(customer.customerID, lead);
    // If existing lead
    // ! Function to add repeat user step control

    if (lead.fbLeads === "Repeat Case" || lead.fbLeads === "Existing Case") {
      await handlePhpCustomers(customerID, lead.leadID);
    }

    const messages = await this.handleExistingCustomer(customer, lead, userIp);
    return this.serviceResponse(200, messages, "Dashboard Details");
  };

  // async dashboardMessages(payload: IDashboardMessages) {
  //   const { customer, customerType, rejectedDaysLeft, userIp, leadType } =
  //     payload;

  //   let { lead } = payload;
  //   const { customerID } = customer;
  //   let { step } = payload;

  //   let customer_type = "New Customer";
  //   const leadCount = await this.leadModel.countLeads({ customerID });

  //   if (leadCount > 1 || leadType === "Repeat Case") {
  //     customer_type = "Repeat Customer";
  //   }

  //   let isRejected = false;
  //   let dashboardMessages: Record<string, string | Date | number> = {
  //     dashboard_message1: "",
  //     dashboard_message2: "",
  //     dashboard_message3: "",
  //     dashboard_message4: "",
  //     dashboard_message5: "",
  //     dashboard_message6: 0,
  //   };
  //   let buttonEnable = true;
  //   let showButton = true;
  //   let isKycFailure = false;
  //   let sendStep = false;
  //   let showContactPage = false;
  //   let showStepDashboardMessages = false;
  //   let showCompletionPercentage = true;
  //   let isLoanOverDue = false;
  //   let isActualDisburalStatus = false;
  //   let imageUrl =
  //     "";
  //   const stepControlSelect: Array<keyof IStepControlModel> = [
  //     "id",
  //     "current_route",
  //     "next_route",
  //     "prev_route",
  //     "product_id",
  //     "step_order",
  //     "step_name",
  //     "provider_id",
  //     "dashboard_message1",
  //     "dashboard_message2",
  //     "dashboard_message3",
  //     "dashboard_message4",
  //   ];

  //   let loanDetails = null;

  //   // ! For reKyc
  //   if (step?.step_name === StepName.PAN_REVERIFY) {
  //     sendStep = true;
  //     showStepDashboardMessages = true;
  //     buttonEnable = true;
  //     isKycFailure = true;
  //   }
  //   // if (customer.is_pan_aadhar_linked === 'No') {
  //   //   sendStep = true
  //   //   isKycFailure = true
  //   //   dashboardMessages.dashboard_message1 =
  //   //     'It appears that your PAN and Aadhaar are not currently linked.'
  //   //   dashboardMessages.dashboard_message2 =
  //   //     'Sorry, we couldn`t recognize your KYC details.'
  //   //   dashboardMessages.dashboard_message3 = 'Re-verify'

  //   //   const productData = await productModel.findOne(
  //   //     { name: Products.PAYDAY },
  //   //     ['productID'],
  //   //   )

  //   //   step = await this.stepControlModel.findOneStepControl({
  //   //     step_name: StepName.PAN_VERIFICATION,
  //   //     product_id: productData.productID,
  //   //   })

  //   //   return {
  //   //     ...dashboardMessages,
  //   //     step: sendStep ? step : null,
  //   //     showContactPage,
  //   //     buttonEnable,
  //   //     showStepDashboardMessages,
  //   //     isPanAadharLinked: false,
  //   //     lead,
  //   //   }
  //   // }

  //   if (isKycFailure) {
  //     return {
  //       ...(!showStepDashboardMessages ? dashboardMessages : {}),
  //       step: sendStep ? step : null,
  //       showContactPage,
  //       buttonEnable,
  //       showStepDashboardMessages,
  //       completionPercentage: null,
  //       lead: lead ?? null,
  //       imageUrl,
  //       isRejected,
  //       showButton,
  //       isLoanOverDue,
  //       isActualDisburalStatus,
  //       leadType,
  //       isKycFailure,
  //       customer_type,
  //       loanDetails: loanDetails ? loanDetails : null,
  //       salaryDate: customer?.salary_date ? customer.salary_date : null,
  //       productId: lead?.productID ? lead.productID : null,
  //       noOfEMIs:
  //         lead?.productID === ProductID.EMI
  //           ? await this.getNoOfEMIs(lead.leadID)
  //           : null,
  //     };
  //   }

  //   // check dob date match
  //   if (customer.dob_digit_match === "0") {
  //     isKycFailure = true;
  //     sendStep = false;
  //     showStepDashboardMessages = false;
  //     buttonEnable = false;

  //     dashboardMessages.dashboard_message1 =
  //       "Oops! There seems to be a hiccup with your KYC process.";
  //     dashboardMessages.dashboard_message2 =
  //       "Sorry, we couldn`t recognize your KYC details.";
  //     dashboardMessages.dashboard_message3 = "KYC verification failed.";

  //     console.log("dashboardMessage : ", dashboardMessages)
  //     return {
  //       ...(!showStepDashboardMessages ? dashboardMessages : {}),
  //       step: sendStep ? step : null,
  //       showContactPage,
  //       buttonEnable,
  //       showStepDashboardMessages,
  //       completionPercentage: null,
  //       lead: lead ?? null,
  //       imageUrl,
  //       isRejected,
  //       showButton,
  //       isLoanOverDue,
  //       isActualDisburalStatus,
  //       leadType,
  //       isKycFailure,
  //       customer_type,
  //       loanDetails: loanDetails ? loanDetails : null,
  //       salaryDate: customer?.salary_date ? customer.salary_date : null,
  //       productId: lead?.productID ? lead.productID : null,
  //       noOfEMIs:
  //         lead?.productID === ProductID.EMI
  //           ? await this.getNoOfEMIs(lead.leadID)
  //           : null,
  //     };
  //   }
  //   // TODO: Uncomment rekyc logic
  //   // if (customerID) {
  //   //   const services = [
  //   //     {
  //   //       api_supplier: 4,
  //   //       api_type: 'aadhaar-v2-submit-otp',
  //   //       identifier: { aadharNo: customer.aadharNo },
  //   //     },
  //   //     {
  //   //       api_supplier: 1,
  //   //       api_type: 'digilocker_eaadhaar',
  //   //       identifier: { mobile_no: String(customer.mobile) },
  //   //     },
  //   //     {
  //   //       api_supplier: 1,
  //   //       api_type: 'ckyc_download',
  //   //       identifier: { pancard: customer.pancard },
  //   //     },
  //   //   ]
  //   //   const productData = await productModel.findOne(
  //   //     { name: Products.PAYDAY },
  //   //     ['productID'],
  //   //   )

  //   //   const oneYearAgo = new Date()
  //   //   oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  //   //   for (const service of services) {
  //   //     const record = await this.leadApiLogService.findOne(
  //   //       {
  //   //         api_supplier: service.api_supplier,
  //   //         api_type: service.api_type,
  //   //         ...service.identifier,
  //   //         status: 1,
  //   //       },
  //   //       ['created_at'],
  //   //       [{ column: 'id', order: 'desc' }],
  //   //     )
  //   //     if (record && new Date(record.created_at) < oneYearAgo) {
  //   //       step = await this.stepControlModel.findOneStepControl({
  //   //         step_name: StepName.AADHAR_CONFIRMATION,
  //   //         product_id: productData.productID,
  //   //       })
  //   //       sendStep = true
  //   //       dashboardMessages.dashboard_message1 =
  //   //         'Get your personal loan in easy steps'
  //   //       dashboardMessages.dashboard_message2 =
  //   //         'Seamless loan process, crafted for you Empowering you, one simple step at a time'
  //   //       dashboardMessages.dashboard_message3 = 'Re-Kyc'
  //   //       return {
  //   //         reKYC: true,
  //   //         ...(!showStepDashboardMessages ? dashboardMessages : {}),
  //   //         step: sendStep ? step : null,
  //   //         showContactPage,
  //   //         buttonEnable,
  //   //         showStepDashboardMessages,
  //   //         lead,
  //   //       }
  //   //     }
  //   //   }

  //   //   // return {
  //   //   //   reKYC: false,
  //   //   //   ...(!showStepDashboardMessages ? dashboardMessages : {}),
  //   //   //   step: sendStep ? step : null,
  //   //   //   showContactPage,
  //   //   //   buttonEnable,
  //   //   //   showStepDashboardMessages,
  //   //   //   lead,
  //   //   // }
  //   // }

  //   switch (customerType) {
  //     case DashboardLeadStatus.FRESH_CUSTOMER:
  //       // Handle
  //       sendStep = true;
  //       showStepDashboardMessages = true;
  //       break;

  //     case DashboardLeadStatus.REJECT:
  //       // If customer is still under 45 days
  //       if (rejectedDaysLeft) {
  //         dashboardMessages.dashboard_message1 = `${rejectedDaysLeft} days left`;
  //         dashboardMessages.dashboard_message2 = `You are not eligible for a Loan`;
  //         dashboardMessages.dashboard_message3 = "Know possible reasons";
  //         dashboardMessages.dashboard_message4 =
  //           "Your application does not qualify for our credit eligibility. This has caused us to hold your application for now.";
  //         // dashboardMessages.dashboard_message5 = `${rejectedDaysLeft} days left`
  //         buttonEnable = true;
  //         showCompletionPercentage = false;
  //         imageUrl =
  //           "";
  //         isRejected = true;
  //       } else {
  //         sendStep = true;
  //         if (step?.provider_id !== "Generic") {
  //           sendStep = true;
  //           const preApprovedAmount =
  //             await approvalService.autoApproveRepeatCustomer(
  //               lead.leadID,
  //               customerID,
  //               1
  //             );

  //           if (preApprovedAmount) {
  //             step.dashboard_message4 = `₹${preApprovedAmount}`;
  //             (step as any).dashboard_message5 = "Pre Approved Loan";
  //             showStepDashboardMessages = true;
  //           } else {
  //             dashboardMessages.dashboard_message1 =
  //               "Get your personal loan in easy steps";
  //             dashboardMessages.dashboard_message2 = `Your Desire Loan Unlocked!`;
  //             dashboardMessages.dashboard_message3 = "Get Cash";
  //             dashboardMessages.dashboard_message4 =
  //               "Instant Loan upto/₹8 Lakhs";
  //           }
  //         } else {
  //           showStepDashboardMessages = true;
  //         }
  //         //   // Send the first step if generic steps are completed
  //         //   const productData = await productModel.findOne(
  //         //     { name: Products.PAYDAY },
  //         //     ['productID'],
  //         //   )

  //         //   const isApproval = await this.approvalService.checkCustomerApproval(
  //         //     customerID,
  //         //     lead,
  //         //   )
  //         //   step = await this.stepControlModel.findOneStepControl(
  //         //     {
  //         //       product_id: productData.productID,
  //         //       provider_id: isApproval
  //         //         ? StepProvider.REPEAT_CUSTOMER
  //         //         : StepProvider.NEW_EXISTING,
  //         //       is_active: true,
  //         //     },
  //         //     stepControlSelect,
  //         //     [{ column: 'step_order', order: 'asc' }],
  //         //   )

  //         //   step.dashboard_message3 = 'Get Cash'

  //         //   const newLeadId = await this.leadService.createNewLead(
  //         //     customerID,
  //         //     'Existing Case',
  //         //     userIp,
  //         //   )

  //         //   lead = await this.leadService.findOne({ leadID: newLeadId.leadID })

  //         //   // send the first step to user
  //         // }
  //       }
  //       break;
  //     case DashboardLeadStatus.CLOSED:
  //       // Closed

  //       // If provider Id is not generic by pass dashboard messages
  //       if (step?.provider_id !== "Generic") {
  //         const preApprovedAmount =
  //           await approvalService.autoApproveRepeatCustomer(
  //             lead.leadID,
  //             customerID,
  //             1
  //           );
  //         dashboardMessages.dashboard_message1 =
  //           "Get your personal loan in easy steps";
  //         dashboardMessages.dashboard_message2 = `Your Desire Loan Unlocked!`;
  //         dashboardMessages.dashboard_message3 = "Get Cash";
  //         dashboardMessages.dashboard_message4 = "Instant Loan upto/₹8 Lakhs";

  //         sendStep = true;
  //         showCompletionPercentage = false;
  //         showStepDashboardMessages = false;

  //         imageUrl =
  //           "";

  //         const productData = await productModel.findOne(
  //           { name: Products.PAYDAY },
  //           ["productID"]
  //         );

  //         step = await this.stepControlModel.findOneStepControl(
  //           {
  //             product_id: productData.productID,
  //             provider_id: "Repeat Customer",
  //           },
  //           stepControlSelect,
  //           [{ column: "step_order", order: "asc" }]
  //         );

  //         if (preApprovedAmount) {
  //           step.dashboard_message4 = `₹${preApprovedAmount}`;
  //           (step as any).dashboard_message5 = "Pre Approved Loan";
  //           showStepDashboardMessages = true;
  //         }
  //       } else {
  //         sendStep = true;
  //         showStepDashboardMessages = true;
  //       }
  //       break;
  //     case DashboardLeadStatus.OTHERS:
  //       if (lead.status === LeadStatus.DOCUMENT_RECEIVED) {
  //         dashboardMessages.dashboard_message1 = "Loan approval is in process";
  //         dashboardMessages.dashboard_message2 =
  //           "Your Approved Loan is on the Way!";
  //         dashboardMessages.dashboard_message3 = "Under Review";
  //         dashboardMessages.dashboard_message4 =
  //           "Your loan application is being reviewed. \n  We'll notify you of any updates soon. Thank you for your patience!";
  //         buttonEnable = false;
  //         imageUrl =
  //           "";
  //         break;
  //       } else if (lead.status === LeadStatus.DISBURSAL_SHEET_SEND) {
  //         const approval = await this.approvalModel.findOneApproval(
  //           { leadID: lead.leadID },
  //           ["loanAmtApproved"]
  //         );
  //         const approvedAmount = approval.loanAmtApproved;
  //         dashboardMessages.dashboard_message1 = "Please wait a moment..";
  //         dashboardMessages.dashboard_message2 =
  //           "Congratulations! Your loan has been approved successfully";
  //         dashboardMessages.dashboard_message3 = `₹${approvedAmount}`;
  //         dashboardMessages.dashboard_message4 =
  //           "We are now preparing for disbursal.\n Please wait a moment...";
  //         buttonEnable = false;
  //         showButton = false;
  //         imageUrl =
  //           "";
  //         break;
  //       } else if (lead.status === LeadStatus.FRESH_LEAD) {
  //         dashboardMessages.dashboard_message1 = "Application Under Review";
  //         dashboardMessages.dashboard_message2 =
  //           "Your Approved loan is on the way";
  //         dashboardMessages.dashboard_message3 = "Under Review";
  //         dashboardMessages.dashboard_message4 =
  //           "Your loan application is being reviewed. We'll notify you of any updates soon. Thank you for your patience!";
  //         buttonEnable = true;
  //         sendStep = true;
  //         showStepDashboardMessages = true;
  //         imageUrl =
  //           "";
  //         break;
  //       } else if (lead.status === LeadStatus.INCOMPLETE_USER) {
  //         sendStep = true;
  //         showStepDashboardMessages = true;
  //         imageUrl =
  //           "";
  //         break;
  //       } else if (
  //         lead.status === LeadStatus.NOT_INTERESTED ||
  //         lead.status === LeadStatus.NOT_REQUIRED_PROCESS ||
  //         lead.status === LeadStatus.NOT_REQUIRED ||
  //         lead.status === LeadStatus.DUPLICATE
  //       ) {
  //         // customer can re-apply for loan
  //         dashboardMessages.dashboard_message1 =
  //           "Get your personal loan in easy steps";
  //         dashboardMessages.dashboard_message2 = `Your Desire Loan Unlocked!`;
  //         dashboardMessages.dashboard_message3 = "Get Cash";
  //         dashboardMessages.dashboard_message4 = "Instant Loan upto/₹8 Lakhs";
  //         sendStep = true;

  //         const isApproval = await this.approvalService.checkCustomerApproval(
  //           customerID
  //         );
  //         if (isApproval) {
  //           const preApprovedAmount =
  //             await approvalService.autoApproveRepeatCustomer(
  //               lead.leadID,
  //               customerID,
  //               1
  //             );
  //           if (preApprovedAmount) {
  //             step.dashboard_message4 = `₹${preApprovedAmount}`;
  //             (step as any).dashboard_message5 = "Pre Approved Loan";
  //             showStepDashboardMessages = true;
  //           }
  //         }
  //         showCompletionPercentage = false;
  //         imageUrl =
  //           "";

  //         // if (step.provider_id === 'Generic') {
  //         //   sendStep = true
  //         // } else {
  //         //   const productData = await productModel.findOne(
  //         //     { name: Products.PAYDAY },
  //         //     ['productID'],
  //         //   )

  //         //   const isApproval = await this.approvalService.checkCustomerApproval(
  //         //     customerID,
  //         //     lead,
  //         //   )
  //         //   step = await this.stepControlModel.findOneStepControl(
  //         //     {
  //         //       product_id: productData.productID,
  //         //       provider_id: isApproval
  //         //         ? StepProvider.REPEAT_CUSTOMER
  //         //         : StepProvider.NEW_EXISTING,
  //         //       is_active: true,
  //         //     },
  //         //     stepControlSelect,
  //         //     [{ column: 'step_order', order: 'asc' }],
  //         //   )

  //         //   const newLeadId = await this.leadService.createNewLead(
  //         //     customerID,
  //         //     'Existing Case',
  //         //     userIp,
  //         //   )

  //         //   lead = await this.leadService.findOne({ leadID: newLeadId.leadID })
  //         // }
  //         break;
  //         // Now check if this case was Repeat Customer in step tracker-table join or New/Existing Customer, bcaz there next step will be decided as per that
  //       } else if (lead.status === LeadStatus.APPROVED_PROCESS) {
  //         const approval = await this.approvalModel.findOneApproval(
  //           { leadID: lead.leadID },
  //           ["loanAmtApproved"]
  //         );

  //         sendStep = true;
  //         showStepDashboardMessages = true;
  //         step.dashboard_message4 = `₹${approval.loanAmtApproved}`;
  //         (step as any).dashboard_message5 = "Loan Approved";
  //         imageUrl =
  //           "";
  //         break;
  //       } else if (lead.status === LeadStatus.APPROVED) {
  //         const approval = await this.approvalModel.findOneApproval(
  //           { leadID: lead.leadID },
  //           ["loanAmtApproved"]
  //         );
  //         const approvedAmount = approval.loanAmtApproved;
  //         dashboardMessages.dashboard_message1 = "Please wait a moment..";
  //         dashboardMessages.dashboard_message2 =
  //           "Congratulations! Your loan has been approved successfully";
  //         dashboardMessages.dashboard_message3 = `₹${approvedAmount}`;
  //         dashboardMessages.dashboard_message4 =
  //           "We are now preparing for disbursal.\n Please wait a moment...";
  //         buttonEnable = false;
  //         showButton = false;
  //         imageUrl =
  //           "";
  //         const { OnboardingService } = await import("./onboarding.service");
  //         const onboardingservice = new OnboardingService();
  //         loanDetails = await onboardingservice.approvalView(
  //           customer,
  //           lead.leadID
  //         );
  //         loanDetails = loanDetails?.data;
  //         break;
  //       } else if (
  //         lead.status === LeadStatus.CALLBACK ||
  //         lead.status === LeadStatus.INTERESTED ||
  //         lead.status === LeadStatus.NO_ANSWER ||
  //         lead.status === LeadStatus.INCOMPLETE_DOCUMENTS ||
  //         lead.status === LeadStatus.DNC
  //       ) {
  //         step.dashboard_message4 = "Continue where you Left";
  //         imageUrl =
  //           "";
  //         sendStep = true;
  //         showStepDashboardMessages = true;
  //         break;
  //       } else if (
  //         lead.status === LeadStatus.SETTLEMENT ||
  //         lead.status === LeadStatus.BLACK_LISTED
  //       ) {
  //         dashboardMessages.dashboard_message1 = "Sorry!!";
  //         dashboardMessages.dashboard_message2 =
  //           "You are not eligible for a Loan";
  //         dashboardMessages.dashboard_message3 = "Get Cash";
  //         buttonEnable = false;
  //         showCompletionPercentage = false;
  //         break;
  //       } else if (
  //         lead.status === LeadStatus.HOLD ||
  //         lead.status === LeadStatus.HOLD_PROCESS
  //       ) {
  //         dashboardMessages.dashboard_message1 = "Loan approval Hold";
  //         dashboardMessages.dashboard_message2 =
  //           "Your Approval Loan is on Hold!";
  //         dashboardMessages.dashboard_message3 = "Contact Us";
  //         dashboardMessages.dashboard_message4 =
  //           "Your application is currently on hold due \n to certain reasons. Please contact \n customer care for more information";
  //         imageUrl =
  //           "";
  //         showContactPage = true;
  //         showCompletionPercentage = false;
  //         break;
  //       } else if (lead.status === LeadStatus.DISBURSED) {
  //         // checkDisbursed
  //         const {
  //           dashboardMessages: partPayMessages,
  //           isLoanOverDue: loanOverDue,
  //           loanStatus: payoutStatus,
  //         } = await this.leadService.checkDisbursed(lead, customer);

  //         isLoanOverDue = loanOverDue;
  //         dashboardMessages = partPayMessages;
  //         isActualDisburalStatus = (payoutStatus && payoutStatus == 2) ? true : false;
  //         break;
  //       } else if (lead.status === LeadStatus.PART_PAYMENT) {
  //         // checkPartPayment
  //         const {
  //           dashboardMessages: partPayMessages,
  //           isLoanOverDue: loanOverDue,
  //         } = await this.leadService.checkPartPayment(lead, customer);
  //         isLoanOverDue = loanOverDue;
  //         dashboardMessages = partPayMessages;
  //         isActualDisburalStatus = true;
  //         break;
  //       }

  //       // Default case for others
  //       sendStep = true;
  //       showStepDashboardMessages = true;
  //       break;
  //     default:
  //       sendStep = true;
  //       showStepDashboardMessages = true;
  //       break;
  //   }

  //   /*let completionPercentage = await this.stepService.getStepProgress(
  //     customer.customerID,
  //     lead?.leadID
  //   );

  //   if (completionPercentage > 100) {
  //     completionPercentage = 100;
  //   }*/
  //   //completionPercentage = 100;
  //   return {
  //     ...(!showStepDashboardMessages ? dashboardMessages : {}),
  //     step: sendStep ? step : null,
  //     showContactPage,
  //     buttonEnable,
  //     showStepDashboardMessages,
  //     //completionPercentage: showCompletionPercentage
  //     // ? completionPercentage
  //     // : null,
  //     lead: lead ?? null,
  //     //imageUrl,
  //     isRejected,
  //     showButton,
  //     isLoanOverDue,
  //     isActualDisburalStatus,
  //     leadType,
  //     isKycFailure,
  //     customer_type,
  //     loanDetails: loanDetails ? loanDetails : null,
  //     salaryDate: customer?.salary_date ? customer.salary_date : null,
  //     productId: lead?.productID ? lead.productID : null,
  //     noOfEMIs:
  //       lead?.productID === ProductID.EMI
  //         ? await this.getNoOfEMIs(lead.leadID)
  //         : null,
  //   };
  // }

  async dashboardMessages(payload: IDashboardMessages) {
    const { customer, customerType, rejectedDaysLeft, userIp, leadType } =
      payload;

    let { lead } = payload;
    const { customerID } = customer;
    let { step } = payload;

    let customer_type = "New Customer";
    const leadCount = await this.leadModel.countLeads({ customerID });

    if (leadCount > 1 || leadType === "Repeat Case") {
      customer_type = "Repeat Customer";
    }

    let isRejected = false;
    let dashboardMessages: Record<string, string | Date | number> = {
      dashboard_message1: "",
      dashboard_message2: "",
      dashboard_message3: "",
      dashboard_message4: "",
      dashboard_message5: "",
      dashboard_message6: 0,
      ashboard_message10: 0,
    };

    console.log("🎯 Initial dashboardMessages:", dashboardMessages);

    let buttonEnable = true;
    let showButton = true;
    let isKycFailure = false;
    let sendStep = false;
    let showContactPage = false;
    let showStepDashboardMessages = false;
    let showCompletionPercentage = true;
    let isLoanOverDue = false;
    let isActualDisburalStatus = false;
    let imageUrl = "";
    const stepControlSelect: Array<keyof IStepControlModel> = [
      "id",
      "current_route",
      "next_route",
      "prev_route",
      "product_id",
      "step_order",
      "step_name",
      "provider_id",
      "dashboard_message1",
      "dashboard_message2",
      "dashboard_message3",
      "dashboard_message4",
    ];

    let loanDetails = null;
    let interestDetails = null;
    let overdueCharges = null;

    // ! For reKyc
    if (step?.step_name === StepName.PAN_REVERIFY) {
      sendStep = true;
      showStepDashboardMessages = true;
      buttonEnable = true;
      isKycFailure = true;
    }

    if (isKycFailure) {
      console.log("❌ Early return - isKycFailure:", dashboardMessages);
      return {
        ...(!showStepDashboardMessages ? dashboardMessages : {}),
        step: sendStep ? step : null,
        showContactPage,
        buttonEnable,
        showStepDashboardMessages,
        completionPercentage: null,
        lead: lead ?? null,
        imageUrl,
        isRejected,
        showButton,
        isLoanOverDue,
        isActualDisburalStatus,
        leadType,
        isKycFailure,
        customer_type,
        loanDetails: loanDetails ? loanDetails : null,
        salaryDate: customer?.salary_date ? customer.salary_date : null,
        productId: lead?.productID ? lead.productID : null,
        noOfEMIs:
          lead?.productID === ProductID.EMI
            ? await this.getNoOfEMIs(lead.leadID)
            : null,
      };
    }

    // check dob date match
    if (customer.dob_digit_match === "0") {
      isKycFailure = true;
      sendStep = false;
      showStepDashboardMessages = false;
      buttonEnable = false;

      dashboardMessages.dashboard_message1 =
        "Oops! There seems to be a hiccup with your KYC process.";
      dashboardMessages.dashboard_message2 =
        "Sorry, we couldn`t recognize your KYC details.";
      dashboardMessages.dashboard_message3 = "KYC verification failed.";

      console.log("❌ DOB mismatch - dashboardMessage:", dashboardMessages);
      return {
        ...(!showStepDashboardMessages ? dashboardMessages : {}),
        step: sendStep ? step : null,
        showContactPage,
        buttonEnable,
        showStepDashboardMessages,
        completionPercentage: null,
        lead: lead ?? null,
        imageUrl,
        isRejected,
        showButton,
        isLoanOverDue,
        isActualDisburalStatus,
        leadType,
        isKycFailure,
        customer_type,
        loanDetails: loanDetails ? loanDetails : null,
        salaryDate: customer?.salary_date ? customer.salary_date : null,
        productId: lead?.productID ? lead.productID : null,
        noOfEMIs:
          lead?.productID === ProductID.EMI
            ? await this.getNoOfEMIs(lead.leadID)
            : null,
      };
    }

    console.log(
      "🔄 Processing customerType:",
      customerType,
      "leadStatus:",
      lead?.status,
    );

    switch (customerType) {
      case DashboardLeadStatus.FRESH_CUSTOMER:
        // Handle
        sendStep = true;
        showStepDashboardMessages = true;
        break;

      case DashboardLeadStatus.REJECT:
        // If customer is still under 45 days
        if (rejectedDaysLeft) {
          dashboardMessages.dashboard_message1 = `${rejectedDaysLeft} days left`;
          dashboardMessages.dashboard_message2 = `You are not eligible for a Loan`;
          dashboardMessages.dashboard_message3 = "Know possible reasons";
          dashboardMessages.dashboard_message4 =
            "Your application does not qualify for our credit eligibility. This has caused us to hold your application for now.";
          // dashboardMessages.dashboard_message5 = `${rejectedDaysLeft} days left`
          buttonEnable = true;
          showCompletionPercentage = false;
          imageUrl =
            "https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Frame+1786308839.png";
          isRejected = true;
        } else {
          sendStep = true;
          if (step?.provider_id !== "Generic") {
            sendStep = true;
            const preApprovedAmount =
              await approvalService.autoApproveRepeatCustomer(
                lead.leadID,
                customerID,
                1,
              );

            if (preApprovedAmount) {
              step.dashboard_message4 = `${preApprovedAmount}`;
              (step as any).dashboard_message5 = "Pre Approved Loan";
              showStepDashboardMessages = true;
            } else {
              dashboardMessages.dashboard_message1 =
                "Get your personal loan in easy steps";
              dashboardMessages.dashboard_message2 = `Your Desire Loan Unlocked!`;
              dashboardMessages.dashboard_message3 = "Get Cash";
              dashboardMessages.dashboard_message4 =
                "Instant Loan upto/₹8 Lakhs";
            }
          } else {
            showStepDashboardMessages = true;
          }
        }
        break;

      case DashboardLeadStatus.CLOSED:
        // Closed
        if (step?.provider_id !== "Generic") {
          const preApprovedAmount =
            await approvalService.autoApproveRepeatCustomer(
              lead.leadID,
              customerID,
              1,
            );
          dashboardMessages.dashboard_message1 =
            "Get your personal loan in easy steps";
          dashboardMessages.dashboard_message2 = `Your Desire Loan Unlocked!`;
          dashboardMessages.dashboard_message3 = "Get Cash";
          dashboardMessages.dashboard_message4 = "Instant Loan upto/₹8 Lakhs";

          sendStep = true;
          showCompletionPercentage = false;
          showStepDashboardMessages = false;

          imageUrl = "";

          const productData = await productModel.findOne(
            { name: Products.PAYDAY },
            ["productID"],
          );

          step = await this.stepControlModel.findOneStepControl(
            {
              product_id: productData.productID,
              provider_id: "Repeat",
            },
            stepControlSelect,
            [{ column: "step_order", order: "asc" }],
          );

          if (preApprovedAmount) {
            step.dashboard_message4 = `${preApprovedAmount}`;
            (step as any).dashboard_message5 = "Pre Approved Loan";
            showStepDashboardMessages = true;
          }
        } else {
          sendStep = true;
          showStepDashboardMessages = true;
        }
        break;

      case DashboardLeadStatus.OTHERS:
        if (lead.status === LeadStatus.DOCUMENT_RECEIVED) {
          dashboardMessages.dashboard_message1 = "Loan approval is in process";
          dashboardMessages.dashboard_message2 =
            "Your Approved Loan is on the Way!";
          dashboardMessages.dashboard_message3 = "Under Review";
          dashboardMessages.dashboard_message4 =
            "Your loan application is being reviewed. \n  We'll notify you of any updates soon. Thank you for your patience!";
          buttonEnable = false;
          imageUrl = "";
          break;
        } else if (lead.status === LeadStatus.DISBURSAL_SHEET_SEND) {
          const approval = await this.approvalModel.findOneApproval(
            { leadID: lead.leadID },
            ["loanAmtApproved"],
          );
          const approvedAmount = approval.loanAmtApproved;
          dashboardMessages.dashboard_message1 = "Please wait a moment..";
          dashboardMessages.dashboard_message2 =
            "Congratulations! Your loan has been approved successfully";
          dashboardMessages.dashboard_message3 = `₹${approvedAmount}`;
          dashboardMessages.dashboard_message4 =
            "We are now preparing for disbursal.\n Please wait a moment...";
          buttonEnable = false;
          showButton = false;
          imageUrl = "";
          break;
        } else if (lead.status === LeadStatus.FRESH_LEAD) {
          dashboardMessages.dashboard_message1 = "Application Under Review";
          dashboardMessages.dashboard_message2 =
            "Your Approved loan is on the way";
          dashboardMessages.dashboard_message3 = "Under Review";
          dashboardMessages.dashboard_message4 =
            "Your loan application is being reviewed. We'll notify you of any updates soon. Thank you for your patience!";
          buttonEnable = true;
          sendStep = true;
          showStepDashboardMessages = true;
          imageUrl = "";
          break;
        } else if (lead.status === LeadStatus.INCOMPLETE_USER) {
          sendStep = true;
          showStepDashboardMessages = true;
          imageUrl = "";
          break;
        } else if (
          lead.status === LeadStatus.NOT_INTERESTED ||
          lead.status === LeadStatus.NOT_REQUIRED_PROCESS ||
          lead.status === LeadStatus.NOT_REQUIRED ||
          lead.status === LeadStatus.DUPLICATE
        ) {
          // customer can re-apply for loan
          dashboardMessages.dashboard_message1 =
            "Get your personal loan in easy steps";
          dashboardMessages.dashboard_message2 = `Your Desire Loan Unlocked!`;
          dashboardMessages.dashboard_message3 = "Get Cash";
          dashboardMessages.dashboard_message4 = "Instant Loan upto/₹8 Lakhs";
          sendStep = true;

          const isApproval = await approvalService.checkCustomerApproval(
            customerID,
          );
          if (isApproval) {
            const preApprovedAmount =
              await approvalService.autoApproveRepeatCustomer(
                lead.leadID,
                customerID,
                1,
              );
            if (preApprovedAmount) {
              step.dashboard_message4 = `${preApprovedAmount}`;
              (step as any).dashboard_message5 = "Pre Approved Loan";
              showStepDashboardMessages = true;
            }
          }
          showCompletionPercentage = false;
          imageUrl = "";
          break;
        } else if (lead.status === LeadStatus.APPROVED_PROCESS) {
          const approval = await this.approvalModel.findOneApproval(
            { leadID: lead.leadID },
            ["loanAmtApproved"],
          );

          sendStep = true;
          showStepDashboardMessages = true;
          step.dashboard_message4 = `${approval.loanAmtApproved}`;
          (step as any).dashboard_message5 = "Loan Approved";
          imageUrl = "";
          break;
        } else if (lead.status === LeadStatus.APPROVED) {
          const approval = await this.approvalModel.findOneApproval(
            { leadID: lead.leadID },
            ["loanAmtApproved"],
          );
          const approvedAmount = approval.loanAmtApproved;
          dashboardMessages.dashboard_message1 = "Please wait a moment..";
          dashboardMessages.dashboard_message2 =
            "Congratulations! Your loan has been approved successfully";
          dashboardMessages.dashboard_message3 = `₹${approvedAmount}`;
          dashboardMessages.dashboard_message4 =
            "We are now preparing for disbursal.\n Please wait a moment...";
          buttonEnable = false;
          showButton = false;
          imageUrl = "";
          const { OnboardingService } = await import("./onboarding.service");
          const onboardingservice = new OnboardingService();
          loanDetails = await onboardingservice.approvalView(
            customer,
            lead.leadID,
          );
          loanDetails = loanDetails?.data;
          break;
        } else if (
          lead.status === LeadStatus.CALLBACK ||
          lead.status === LeadStatus.INTERESTED ||
          lead.status === LeadStatus.NO_ANSWER ||
          lead.status === LeadStatus.INCOMPLETE_DOCUMENTS ||
          lead.status === LeadStatus.DNC
        ) {
          step.dashboard_message4 = "Continue where you Left";
          imageUrl = "";
          sendStep = true;
          showStepDashboardMessages = true;
          break;
        } else if (
          lead.status === LeadStatus.SETTLEMENT ||
          lead.status === LeadStatus.BLACK_LISTED
        ) {
          dashboardMessages.dashboard_message1 = "Sorry!!";
          dashboardMessages.dashboard_message2 =
            "You are not eligible for a Loan";
          dashboardMessages.dashboard_message3 = "Get Cash";
          buttonEnable = false;
          showCompletionPercentage = false;
          break;
        } else if (
          lead.status === LeadStatus.HOLD ||
          lead.status === LeadStatus.HOLD_PROCESS
        ) {
          dashboardMessages.dashboard_message1 = "Loan approval Hold";
          dashboardMessages.dashboard_message2 =
            "Your Approval Loan is on Hold!";
          dashboardMessages.dashboard_message3 = "Contact Us";
          dashboardMessages.dashboard_message4 =
            "Your application is currently on hold due \n to certain reasons. Please contact \n customer care for more information";
          imageUrl = "";
          showContactPage = true;
          showCompletionPercentage = false;
          break;
        } else if (lead.status === LeadStatus.DISBURSED) {
          console.log(
            "💰 Processing DISBURSED status - calling checkDisbursed",
          );
          // checkDisbursed
          const {
            dashboardMessages: partPayMessages,
            isLoanOverDue: loanOverDue,
            loanStatus: payoutStatus,
            loanDetails: fetchedLoanDetails,
            interestDetails: disbursalInterestDetails,
            overdueCharges: disbursalOverdueCharges,
          } = await this.leadService.checkDisbursed(lead, customer);
          console.log("📊 checkDisbursed result:", {
            partPayMessages,
            loanOverDue,
            payoutStatus,
            dashboard_message6: partPayMessages?.dashboard_message6,
            loanDetails: fetchedLoanDetails,
            interestDetails: disbursalInterestDetails,
            overdueCharges: disbursalOverdueCharges,
          });

          isLoanOverDue = loanOverDue;
          dashboardMessages = partPayMessages;
          isActualDisburalStatus =
            payoutStatus && payoutStatus == 2 ? true : false;
          loanDetails = fetchedLoanDetails;
          interestDetails = disbursalInterestDetails;
          overdueCharges = disbursalOverdueCharges;
          break;
        } else if (lead.status === LeadStatus.PART_PAYMENT) {
          console.log(
            "💰 Processing PART_PAYMENT status - calling checkPartPayment",
          );
          // checkPartPayment
          const {
            dashboardMessages: partPayMessages,
            isLoanOverDue: loanOverDue,
            loanDetails: partPaymentLoanDetails,
            interestDetails: partPaymentInterestDetails,
            overdueCharges: partPaymentOverdueCharges,
          } = await this.leadService.checkPartPayment(lead, customer);

          console.log("📊 checkPartPayment result:", {
            partPayMessages,
            loanOverDue,
            dashboard_message6: partPayMessages?.dashboard_message6,
            loanDetails: partPaymentLoanDetails,
            interestDetails: partPaymentInterestDetails,
            overdueCharges: partPaymentOverdueCharges,
          });

          isLoanOverDue = loanOverDue;
          dashboardMessages = partPayMessages;
          isActualDisburalStatus = true;
          loanDetails = partPaymentLoanDetails;
          interestDetails = partPaymentInterestDetails;
          overdueCharges = partPaymentOverdueCharges;
          break;
        }

        // Default case for others
        sendStep = true;
        showStepDashboardMessages = true;
        break;
      default:
        sendStep = true;
        showStepDashboardMessages = true;
        break;
    }

    console.log("🎯 Final dashboardMessages before return:", dashboardMessages);
    console.log(
      "🔍 Final dashboard_message6 value:",
      dashboardMessages.dashboard_message6,
      "loan details",
      loanDetails,
      "interestDetails",
      interestDetails,
      "overdueCharges",
      overdueCharges,
    );

    return {
      ...(!showStepDashboardMessages ? dashboardMessages : {}),
      step: sendStep ? step : null,
      showContactPage,
      buttonEnable,
      showStepDashboardMessages,
      lead: lead ?? null,
      isRejected,
      showButton,
      isLoanOverDue,
      isActualDisburalStatus,
      leadType,
      isKycFailure,
      customer_type,
      loanDetails: loanDetails ? loanDetails : null,
      salaryDate: customer?.salary_date ? customer.salary_date : null,
      productId: lead?.productID ? lead.productID : null,
      noOfEMIs:
        lead?.productID === ProductID.EMI
          ? await this.getNoOfEMIs(lead.leadID)
          : null,
      interestDetails: interestDetails ? interestDetails : null,
      overdueCharges: overdueCharges ? overdueCharges : null,
    };
  }

  private handleNewCustomer = async (customer: ICustomer, userIp: string) => {
    // const userStepData = await this.stepService.getUserStep(
    //   customer.customerID,
    //   DashboardLeadStatus.FRESH_CUSTOMER,
    //   Products.PAYDAY,
    // )

    const userStepData = await this.stepService.handleCustomers(
      customer.customerID,
      Products.PAYDAY,
    );

    const dashboardPayload: IDashboardMessages = {
      customer,
      step: userStepData.step,
      customerType: DashboardLeadStatus.FRESH_CUSTOMER,
      userIp,
      leadType: userStepData?.leadType,
    };

    if (userStepData.leadID) {
      dashboardPayload.lead = await this.leadModel.findOne({
        where: { leadID: userStepData.leadID },
        select: ["leadID", "status", "ipc"],
      });
    }

    return await this.dashboardMessages(dashboardPayload);
  };

  private handleExistingCustomer = async (
    customer: ICustomer,
    lead: ILead,
    userIp: string,
  ) => {
    const { customerID } = customer;
    const { leadID, status } = lead;
    let customerType: DashboardLeadStatus;
    let daysLeft: number;
    let isRejected: boolean;

    switch (status) {
      case LeadStatus.REJECTED:
      case LeadStatus.REJECTED_PROCESS:
      case LeadStatus.BANK_UPDATE_REJECTED:
      case LeadStatus.NOT_ELIGIBLE:
        customerType = DashboardLeadStatus.REJECT;
        const rejectionStatus = await this.leadService.checkRejectedCase(
          leadID,
          customerID,
          lead.status,
        );

        daysLeft = rejectionStatus.daysLeft;
        isRejected = rejectionStatus.isRejected;
        break;

      case LeadStatus.CLOSED:
        customerType = DashboardLeadStatus.CLOSED;
        break;

      default:
        customerType = DashboardLeadStatus.OTHERS;
        break;
    }

    const userStepData = await this.stepService.handleCustomers(
      customerID,
      Products.PAYDAY,
      lead,
      "",
      lead.leadID,
    );

    const dashboardMsgPayload: IDashboardMessages = {
      customer,
      lead,
      step: userStepData?.step,
      customerType,
      userIp,
      leadType: userStepData?.leadType,
    };

    if (isRejected) {
      dashboardMsgPayload.rejectedDaysLeft = daysLeft;
    }

    if (userStepData?.leadID) {
      dashboardMsgPayload.lead = await this.leadModel.findOne({
        where: { leadID: userStepData.leadID },
        select: ["leadID", "status", "ipc"],
      });
    }
    return await this.dashboardMessages(dashboardMsgPayload);
  };

  checkDuplicateLead = async (customerID: number, lead: ILead) => {
    // If lead count is only 1 then customer may reapply for loan

    if (lead.status !== LeadStatus.DUPLICATE) return lead;

    const leadCount = await this.leadService.count({ customerID });
    // If duplicate lead, consider 2nd last lead

    if (leadCount < 2) return lead;

    lead = await this.leadService.findOneLead({
      where: { customerID },
      order: [{ column: "leadID", order: "desc" }],
      select: ["leadID", "status", "ipc", "fbLeads"],
      paginate: { page: 1, perPage: 1 },
    });

    return lead;
  };

  sendBulkUsers = async () => {
    const WEBENGAGE_URL = `${config.webengageHost}/v1/accounts/${config.webengageLicenseCode}/bulk-users`;

    // Fetch lead data
    const data = await this.getLeadData();

    if (!data.users.length) {
      throw new Error("No users found for the last two months");
    }

    // Send data to WebEngage
    /* const response = await axios.post(WEBENGAGE_URL, data, {
       headers: {
         Authorization: `Bearer ${config.webengageApiKey}`,
         "Content-Type": "application/json",
       },
     });*/

    return this.serviceResponse(200, data, "response from webengage");
  };

  private calculateAge = (dob: Date): number => {
    return differenceInYears(new Date(), new Date(dob));
  };
  private getLeadData = async (): Promise<any> => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    let db = getKnexInstance();
    const leads = await db("leads")
      .where("leads.createdDate", ">=", twoMonthsAgo)
      .andWhere(function () {
        this.where("leads.status", "Fresh Lead").orWhere(
          "leads.status",
          "Approved Process",
        );
      })
      .join("customer", "leads.customerID", "customer.customerID")
      .join("employer", "customer.customerID", "employer.customerID")
      .select(
        "customer.mobile as userId",
        "customer.firstName",
        "customer.lastName",
        "customer.dob",
        "customer.gender",
        "customer.email",
        "customer.mobile as phone",
        "employer.employerName as company",
      );

    const formatGender = (gender: string): string => {
      if (gender === "Male") return "male";
      if (gender === "Female") return "female";
      return "other";
    };
    const users = leads.map((lead: any) => ({
      userId: lead.userId,
      firstName: lead.firstName,
      lastName: lead.lastName,
      birthDate: new Date(lead.dob).toISOString(),
      gender: formatGender(lead.gender),
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      attributes: {
        Age: this.calculateAge(lead.dob),
      },
    }));

    return { users };
  };

  onePageView = async (customer: ICustomer, leadID: number) => {
    const { customerID } = customer;

    const lead = await this.leadService.findOneLead({
      where: { customerID, leadID },
    });

    if (!lead) throw new NotFoundError("Loan not found");

    const [employer, address] = await Promise.all([
      this.employerService.findOne(
        { customerID },
        ["employerName"],
        [{ column: "employerID", order: "desc" }],
      ),
      this.addressService.findOne(
        { customerID },
        ["addressID", "type", "address", "city", "state", "pincode"],
        [{ order: "desc", column: "addressID" }],
      ),
    ]);

    const response: IOnePageView = {
      loanPurpose: lead.purpose,
      maritalStatus: customer.marrital,
      qualification: customer.education,
      employementType: customer.employeeType,
      modeOfPayment: lead.salaryMode,
      companyName: employer?.employerName,
      industry: customer.industry,
      designation: customer.designation,
      monthlySalary: lead.monthlyIncome,
      salaryDate: customer.salary_date,
      address: address ?? null, // covers residential type as well
    };

    return this.serviceResponse(
      HttpStatusCode.Ok,
      response,
      "One page view details",
    );
  };

  async getCustomerAddress(customerID: number, customerName: string) {
    const address = await this.addressService.findOne(
      { customerID },
      ["address", "city", "state", "pincode", "landmark"],
      [{ column: "addressID", order: "desc" }],
    );

    if (!address) throw new NotFoundError("Customer address details not found");

    return this.serviceResponse(
      HttpStatusCode.Ok,
      { name: customerName, ...address },
      "Customer address fetched",
    );
  }

  async getFinboxAccount(customerID: number): Promise<IServiceResponse> {
    const finboxData: IDocumentFinboxInterfaceModel =
      await this.documentFinboxModel.DocumentFinboxKnex.select("entityID")
        .where("customerID", customerID)
        .whereRaw("TIMESTAMPDIFF(MONTH, verifiedDate, NOW()) <= 11")
        .where("entityID", "!=", "")
        .orderBy("documentID", "DESC")
        .first();

    if (!finboxData) {
      throw new NotFoundError("Customer finbox bank details not found");
    }

    const checkLeadLog = await this.leadApiLogService.findOne({
      entity_id: finboxData.entityID,
      api_type: LeadLogApiType.IDENTITY,
    });

    if (!checkLeadLog) {
      throw new NotFoundError("Customer finbox bank details not found");
    }

    if (!checkLeadLog.api_response) {
      throw new NotFoundError("Customer finbox bank details not found");
    }

    const apiResponse = JSON.parse(checkLeadLog.api_response);

    const identity = apiResponse.identity;

    let resp: ICustomerFinboxAccountResponse = {
      accountNumber: null,
      bankName: null,
      ifsc: null,
      name: null,
    };

    for (let account of identity) {
      resp.accountNumber = account?.account_number
        ? account.account_number.replace(/-/g, "")
        : null;
      resp.bankName = account?.bank_name ?? null;
      resp.ifsc = account?.ifsc ?? null;
      resp.name = account?.name ?? null;
      break;
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      resp,
      "Account details fetched",
    );
  }

  async onePageReloan(
    customer: ICustomer,
    payload: ICustomerCheckDetails,
    userIp: string,
    jwtToken: string,
  ) {
    const {
      monthly_income: monthlyIncome,
      modeOfPayment,
      landmark,
      loan_purpose: loanPurpose,
      loan_required: loanRequeried,
      callBackUrl,
      plateform,
    } = payload;
    let { residenceType, city, state, pincode, residenceAddress } = payload;
    // Skip aadhar/ pan checks , because they will be covered in step control and dashboard itself

    const { customerID, mobile, pancard, name, email, employeeType } = customer;
    const currentDate = momentTz().tz("Asia/Kolkata").format("YYYY-MM-DD");

    // const salaryModeCaseChequeCount = await this.leadModel.LeadsKnex.whereIn(
    //   'fbLeads',
    //   [LeadType.NEW_CASE, LeadType.EXISTING_CASE],
    // )
    //   .whereIn('salaryMode', ['Cash', 'Cheque'])
    //   .whereRaw('DATE(createdDate) = ?', [currentDate])
    //   .count()

    // const salaryModeCount = salaryModeCaseChequeCount[0]['count(*)'] as number

    // // ENV constants
    // const SALARY_MODE_CASH_CHEQUE_COUNT = 1000
    // const CASH_MODE_SALARY_AMOUNT = 35000

    let remark = "";
    let leadStatus: LeadStatus;
    let fbLeads = "";
    let messageCode = "";
    let status = 0;
    let oldLeadId = 0;
    let leadID = 0;
    let dataCode: Record<string, any>;
    let pageName = "";
    let rejectRemark = "";
    let lastLeadAmount = 0;
    let lenderID = LenderName.RAMFINCORP;

    // if (monthlyIncome >= 20000) {
    //   if (modeOfPayment === 'Bank Transfer') {
    //     remark = LeadStatus.FRESH_LEAD
    //     leadStatus = LeadStatus.FRESH_LEAD
    //   } else if (
    //     modeOfPayment === 'Cheque' &&
    //     salaryModeCount <= SALARY_MODE_CASH_CHEQUE_COUNT
    //   ) {
    //     remark = LeadStatus.FRESH_LEAD
    //     leadStatus = LeadStatus.FRESH_LEAD
    //   } else if (
    //     modeOfPayment === 'Cash' &&
    //     monthlyIncome >= CASH_MODE_SALARY_AMOUNT &&
    //     salaryModeCount <= SALARY_MODE_CASH_CHEQUE_COUNT
    //   ) {
    //     remark = LeadStatus.FRESH_LEAD
    //     leadStatus = LeadStatus.FRESH_LEAD
    //   } else {
    //     remark = modeOfPayment
    //     leadStatus = LeadStatus.NOT_ELIGIBLE
    //   }
    // } else if (
    //   modeOfPayment === 'Cash' &&
    //   monthlyIncome >= CASH_MODE_SALARY_AMOUNT &&
    //   salaryModeCount <= SALARY_MODE_CASH_CHEQUE_COUNT
    // ) {
    remark = LeadStatus.FRESH_LEAD;
    leadStatus = LeadStatus.FRESH_LEAD;
    // } else {
    //   remark = String(monthlyIncome)
    //   leadStatus = LeadStatus.NOT_ELIGIBLE
    // }

    // Check disbursed status
    const disbursedLoanCount = await this.loanModel.countLoan({
      customerID,
      status: LoanStatus.DISBURSED,
    });

    const leadLenderID = await this.leadModel.findOne({
      where: { customerID },
      select: ["lenderID"],
    });

    if (disbursedLoanCount > 0) {
      fbLeads = LeadType.REPEAT_CASE;
      leadStatus = LeadStatus.FRESH_LEAD;
      lenderID = leadLenderID.lenderID;
    } else {
      const leadCount = await this.leadModel.countLeads({ customerID });

      if (leadCount > 0) {
        fbLeads = LeadType.EXISTING_CASE;
        lenderID = leadLenderID.lenderID;
      } else {
        fbLeads = LeadType.NEW_CASE;
      }
    }

    if (residenceType === "Rented") {
      residenceType = "Rent";
    }

    residenceType = [
      "Permanent Address",
      "Current Address",
      "Rent",
      "Owned",
    ].includes(residenceType)
      ? residenceType
      : "Current Address";

    const customerAddress = await this.addressService.findOne(
      {
        customerID,
      },
      ["addressID", "type", "address", "city", "state", "pincode", "landmark"],
      [{ column: "addressID", order: "desc" }],
    );

    if (customerAddress) {
      if (
        customerAddress?.address &&
        customerAddress?.city &&
        customerAddress?.state &&
        customerAddress?.pincode &&
        customerAddress?.address === residenceAddress &&
        customerAddress?.city === city &&
        customerAddress?.state == state &&
        customerAddress?.pincode === pincode
      ) {
        status = 1;
      } else {
        if (customerAddress?.state) {
          state = customerAddress.state;
        }

        if (customerAddress?.city) {
          city = customerAddress.city;
        }

        if (customerAddress?.pincode) {
          pincode = customerAddress.pincode as number;
        }
      }
    } else {
      // Store address in table
      await this.addressService.create({
        customerID,
        type: residenceType as
          | "Permanent Address"
          | "Current Address"
          | "Rent"
          | "Owned",
        address: residenceAddress,
        city,
        state,
        pincode,
        landmark,
        fetchedBy: "Customer",
        status: "Not Verified",
        verifiedBy: +config.defaultUserId,
      });
    }

    const leadSaveData: InsertData<ILead> = {
      customerID,
      purpose: loanPurpose,
      loanRequeried,
      monthlyIncome,
      salaryMode: modeOfPayment,
      city,
      state,
      pincode,
      status: leadStatus,
      utmSource: "app_v1",
      fbLeads,
      ip: userIp,
      callAssign: +config.defaultUserId,
      creditAssign: +config.defaultUserId,
      step: "1_page",
      lenderID,
      plateform,
    };

    if (fbLeads === LeadType.EXISTING_CASE || fbLeads === LeadType.NEW_CASE) {
      // Check if any utmSource available for this user
      const referrer = await this.referrerModel.getLastTwoMonthReferrer(
        customerID,
      );

      leadSaveData.utmSource = referrer?.referrer ?? "app_v1";
      leadSaveData.utm_assigned_date = referrer?.created_at ?? null;
    }

    const leadCheck = await this.leadModel.findOne({
      where: { customerID },
      order: [{ column: "leadID", order: "desc" }],
    });

    if (leadCheck) {
      leadStatus = leadCheck.status;
    } else {
      leadStatus = "Lead Not Found" as unknown as LeadStatus; // ! Check this
    }

    const leadStatuses = [
      LeadStatus.FRESH_LEAD,
      LeadStatus.DOCUMENT_RECEIVED,
      LeadStatus.APPROVED_PROCESS,
      LeadStatus.HOLD_PROCESS,
      LeadStatus.APPROVED,
      LeadStatus.HOLD,
      LeadStatus.BANK_UPDATE_HOLD,
      LeadStatus.DISBURSAL_SHEET_SEND,
      LeadStatus.DISBURSAL_APPROVED,
      LeadStatus.BANK_UPDATE_REJECTED,
      LeadStatus.DISBURSED,
      LeadStatus.PART_PAYMENT,
    ];

    if (leadStatuses.includes(leadStatus)) {
      oldLeadId = leadCheck.leadID;
    } else if (leadStatus === LeadStatus.NOT_ELIGIBLE) {
      const createdDate = momentTz(leadCheck.createdDate).startOf("day");
      const currentDate = momentTz().tz("Asia/Kolkata").startOf("day"); // Current date and time

      // Calculate the difference in days
      const days = currentDate.diff(createdDate, "days");

      // Check if the difference is more than 45 days
      if (days > 45) {
        // Insert the new lead and get the inserted ID
        [leadID] = await this.leadModel.create(leadSaveData);
      } else {
        oldLeadId = leadCheck.leadID;
      }
    } else {
      [leadID] = await this.leadModel.create(leadSaveData);
    }

    // End of condition

    if (leadID) {
      await this.callhistoryLogModel.insert({
        customerID,
        leadID,
        callType: CallType.IVR,
        status: leadSaveData?.status ?? leadStatus,
        appAmount: String(loanRequeried),
        noteli: leadSaveData?.status ?? leadStatus,
        remark,
        callbackTime: currentDate as unknown as Date,
        calledBy: +config.defaultUserId,
      });

      status = 1;
      messageCode = "Success";
      dataCode = { leadID };

      // ! Start of v1 api checks
      // const isEmployerReject =
      // await this.employerService.checkEmployerNameForReject(customerID)

      // if (isEmployerReject) {
      //   rejectRemark = 'Occupation Rejection'

      //   // make customer reject entries

      //   await this.approvalService.create({
      //     customerID,
      //     leadID,
      //     branch: BranchName.DELHI,
      //     loanAmtApproved: 0,
      //     tenure: 0,
      //     roi: 1,
      //     repayDate: currentDate,
      //     adminFee: 0,
      //     GstOfAdminFee: 0,
      //     alternateMobile: String(mobile),
      //     officialEmail: email,
      //     cibil: 0,
      //     activeLoans: 0,
      //     status: ApprovalStatus.RejectedProcess,
      //     creditedBy: +config.defaultUserId,
      //     remark: rejectRemark,
      //     employmentType: employeeType,
      //   })

      //   await this.leadModel.findOneAndUpdate(
      //     { customerID, leadID },
      //     { status: LeadStatus.REJECTED_PROCESS },
      //   )

      //   await this.callhistoryLogModel.insert({
      //     customerID,
      //     leadID,
      //     callType: CallType.IVR,
      //     status: LeadStatus.REJECTED_PROCESS,
      //     noteli: LeadStatus.REJECTED_PROCESS,
      //     remark: rejectRemark,
      //     callbackTime: currentDate as unknown as Date,
      //     calledBy: +config.defaultUserId,
      //     appAmount: '0',
      //   })

      //   status = 0
      //   messageCode = 'Uh Oh! You do not qualify for our credit eligibility'
      //   dataCode = { leadID, pageName: 'rejected' }
      // } else if (
      //   fbLeads === LeadType.REPEAT_CASE ||
      //   (monthlyIncome >= 20000 && modeOfPayment === 'Bank Transfer') ||
      //   (modeOfPayment === 'Cheque' &&
      //     monthlyIncome >= 20000 &&
      //     salaryModeCount <= SALARY_MODE_CASH_CHEQUE_COUNT) ||
      //   (modeOfPayment === 'Cash' &&
      //     monthlyIncome >= CASH_MODE_SALARY_AMOUNT &&
      //     salaryModeCount <= SALARY_MODE_CASH_CHEQUE_COUNT)
      // ) {
      status = 1;
      messageCode = "Customer Approved";
      pageName = "finbox";

      if (fbLeads === LeadType.EXISTING_CASE || fbLeads === LeadType.NEW_CASE) {
        // Fetch php access token
        let mobileToken = await this.mobileTokenService.findOne(
          { jwt_access_token: jwtToken, customerID: String(customerID) },
          ["access_token"],
          [
            {
              column: "id",
              order: "desc",
            },
          ],
        );
        // mobile,pancard,name
        const autoApproveResponse = await this.newCibilBrePhpApi(
          mobileToken.access_token,
          leadID,
          String(pincode),
          state,
          customerAddress?.address ?? residenceAddress,
        );

        if (
          !autoApproveResponse.success ||
          autoApproveResponse.data.status == "0"
        ) {
          pageName = "finbox";
          dataCode = { leadID, pageName };
        }

        if (
          autoApproveResponse.data.data.status === 1 &&
          autoApproveResponse.data.data.message === "Approved"
        ) {
          pageName = "approval";
          dataCode = { leadID, pageName };
        } else if (
          autoApproveResponse.data.data.status === 1 &&
          autoApproveResponse.data.data.message === "Proceed to Bank"
        ) {
          pageName = "finbox";
          dataCode = { leadID, pageName };
        } else if (
          autoApproveResponse.data.data.status === 1 &&
          autoApproveResponse.data.data.message === "Reject"
        ) {
          pageName = "rejected";
          dataCode = { leadID, pageName };
        } else if (autoApproveResponse.data.data.status === 1) {
          pageName = "approval";
          dataCode = { leadID, pageName };
        } else {
          pageName = "finbox";
          if (
            autoApproveResponse.data.data.message === "Cibil Rejected" ||
            autoApproveResponse.data.data.message === "Dtree Bre Rejected"
          ) {
            pageName = "rejected";
            await this.leadModel.findOneAndUpdate(
              {
                leadID,
              },
              {
                status: LeadStatus.REJECTED_PROCESS,
                sanctionalloUID: +config.defaultUserId,
              },
            );

            const currentDatePlus6 = momentTz()
              .tz("Asia/Kolkata")
              .add(6, "days")
              .format("YYYY-MM-DD");

            // Add data to approval table

            const score = String(
              await this.leadApiLogService.getCustomerCibilScore(pancard),
            );

            await this.approvalService.create({
              customerID,
              leadID,
              branch: BranchName.DELHI,
              loanAmtApproved: 0,
              tenure: 6,
              roi: +config.rate_of_interest,
              repayDate: currentDatePlus6,
              adminFee: 0,
              GstOfAdminFee: 0,
              alternateMobile: String(mobile),
              officialEmail: email,
              cibil: 0,
              activeLoans: 0,
              status: ApprovalStatus.RejectedProcess,
              creditedBy: +config.defaultUserId,
              remark: score ? "Cibil score below 600" : "Rejected from BRE",
              employmentType: employeeType,
            });

            await this.callhistoryLogModel.insert({
              customerID,
              leadID,
              callType: CallType.IVR,
              status: LeadStatus.REJECTED_PROCESS,
              noteli: LeadStatus.REJECTED_PROCESS,
              remark: score ? "Cibil score below 600" : "Rejected from BRE",
              callbackTime: currentDate as unknown as Date,
              calledBy: +config.defaultUserId,
            });
          }
        }
        dataCode = { leadID, pageName };
      } else if (fbLeads === LeadType.REPEAT_CASE) {
        const checkCustomerStatus = await this.checkCustomerStatusPhpApi(
          pancard,
        );

        if (checkCustomerStatus == 0) {
          await this.approvalService.create({
            customerID,
            leadID,
            branch: BranchName.DELHI,
            loanAmtApproved: 0,
            tenure: 6,
            roi: +config.rate_of_interest,
            repayDate: currentDate as unknown as Date,
            adminFee: 0,
            GstOfAdminFee: 0,
            alternateMobile: String(mobile),
            officialEmail: email,
            cibil: 0,
            activeLoans: 0,
            status: ApprovalStatus.RejectedProcess,
            creditedBy: +config.defaultUserId,
            remark: "Active loan on Partner Portal.",
            employmentType: employeeType,
          });

          await this.leadModel.findOneAndUpdate(
            { customerID, leadID },
            { status: LeadStatus.REJECTED_PROCESS },
          );

          await this.callhistoryLogModel.insert({
            customerID,
            leadID,
            callType: CallType.IVR,
            status: LeadStatus.REJECTED_PROCESS,
            noteli: LeadStatus.REJECTED_PROCESS,
            remark: "Active loan on Partner Portal.",
            callbackTime: currentDate as unknown as Date,
            calledBy: +config.defaultUserId,
          });

          status = 0;
          messageCode = "Uh Oh! You do not qualify for our credit eligibility";
          dataCode = { leadID, pageName: "rejected" };
        } else {
          let lastLeadAmount = 0;
          const breLead = await this.leadService.checkFirstBreLead(customerID);

          if (breLead === 1) {
            const offerAmount = await this.leadService.findLeadHigherAmount(
              String(mobile),
              pancard,
              customerID,
              leadID,
            );
            lastLeadAmount = offerAmount;
          }

          if (lastLeadAmount > 999) {
            const checkApproval =
              await this.approvalService.autoApproveRepeatCustomer(
                leadID,
                customerID,
                0,
                lastLeadAmount,
              );

            if (checkApproval === 1) {
              pageName = "approval";
              dataCode = { leadID, pageName };
            } else {
              dataCode = { leadID, pageName };
            }
          } else {
            const aggregatorExists =
              await this.finboxService.checkAccountAggregator(customerID);

            if (aggregatorExists) {
              const checkApproval =
                await this.approvalService.autoApproveRepeatCustomer(
                  leadID,
                  customerID,
                );
              if (checkApproval === 1) {
                pageName = "approval";
                dataCode = { leadID, pageName };
              } else {
                const needDoc = await this.leadService.checkFourthLead(
                  customerID,
                );
                const lastLeadNotRequired =
                  await this.leadService.checkCustomerLastLeadNotRequiredLeadCheck(
                    customerID,
                  );

                if (lastLeadNotRequired) {
                  const checkApproval =
                    await this.approvalService.autoApproveRepeatCustomer(
                      leadID,
                      customerID,
                    );
                  if (checkApproval === 1) {
                    pageName = "approval";
                    dataCode = { leadID, pageName };
                  } else if (!needDoc) {
                    await this.finboxService.leadStatusChangedDocumentReceivedNew(
                      leadID,
                    );
                    pageName = "dashboard";
                  } else {
                    pageName = "finbox";
                  }
                } else if (!needDoc) {
                  await this.finboxService.leadStatusChangedDocumentReceivedNew(
                    leadID,
                  );
                  pageName = "dashboard";
                } else {
                  pageName = "finbox";
                }
                dataCode = { leadID, pageName };
              }
            } else {
              const needDoc = await this.leadService.checkFourthLead(
                customerID,
              );

              const lastLeadNotRequired =
                await this.leadService.checkCustomerLastLeadNotRequiredLeadCheck(
                  customerID,
                );

              if (lastLeadNotRequired) {
                const checkApproval =
                  await this.approvalService.autoApproveRepeatCustomer(
                    leadID,
                    customerID,
                  );

                if (checkApproval === 1) {
                  pageName = "approval";
                  dataCode = { leadID, pageName };
                } else if (!needDoc) {
                  await this.finboxService.leadStatusChangedDocumentReceivedNew(
                    leadID,
                  );
                  pageName = "dashboard";
                } else {
                  pageName = "finbox";
                }
              } else if (!needDoc) {
                await this.finboxService.leadStatusChangedDocumentReceivedNew(
                  leadID,
                );
                pageName = "dashboard";
              } else {
                pageName = "finbox";
              }

              dataCode = { leadID, pageName };
            }
          }
        }
      }
      // } else {
      //   status = 0
      //   messageCode = 'Sorry you are not eligible for loan'
      //   dataCode = { leadID, pageName: 'dashboard' }
      // }
    } else if (oldLeadId) {
      status = 0;
      messageCode = "Lead Already exists";
      dataCode = { leadID: oldLeadId, pageName: "dashboard" };
    } else {
      status = 0;
      messageCode = "Something went wrong.";
    }

    if (pageName !== "rejected" && status !== 0) {
      // Step entry, completed LOAN_AMOUNT
      await this.steptrackerModel.completeStep(
        customerID,
        StepName.LOAN_AMOUNT_CLOSED,
        Products.PAYDAY,
        leadID,
      );
    }

    // ! If pageName = finbox then we have to make entry to step_tracker with is_completed = 0

    let finboxResponse = null;
    if (pageName === "finbox") {
      await this.steptrackerModel.saveFinboxIncompleteStep(
        customerID,
        leadID,
        Products.PAYDAY,
      );

      const redirect_url = callBackUrl
        ? callBackUrl
        : `${config.frontendBaseUrl}${FinboxUrls.CREATE_URL}`;
      const logo_url = `${config.frontendBaseUrl}/${FinboxUrls.LOGO_URL}`;

      finboxResponse = await this.finboxService.bankConnect({
        link_id: String(mobile),
        redirect_url,
        logo_url,
      });
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        status,
        ...dataCode,
        metaData: { finbox: finboxResponse?.apimsg ?? null },
      },
      messageCode,
    );
  }

  async newCibilBrePhpApi(
    access_token: string,
    leadID: number,
    pincode: string,
    state: string,
    residenceAddress: string,
  ): Promise<{
    success: boolean;
    statusCode: number;
    data?: INewApiCibilAndBre;
  }> {
    const baseUrl = this.commonHelper.getBaseUrl();
    const apiCall = new AxiosService(baseUrl);

    const body = {
      access_token: access_token,
      leadID: leadID,
      pincode: pincode,
      state: state,
      address: residenceAddress,
    };

    const apiData = await apiCall.call<
      INewApiCibilAndBre,
      {
        access_token: string;
        leadID: number;
        pincode: string;
        state: string;
        address: string;
      },
      undefined
    >("post", `/${config.cibilBreNewApi}`, body, undefined, {
      "Content-Type": "application/json",
    });

    return apiData;
  }

  async checkCustomerStatusPhpApi(pancard: string) {
    const baseUrl = this.commonHelper.getCrossPlatformBaseUrl();
    const apiCall = new AxiosService(baseUrl);

    const body = {
      pancard: pancard,
    };

    const apiData = await apiCall.call<
      INewApiCheckCustomer,
      INewApiCheckCustomerBody,
      undefined
    >("post", `/${config.checkCustomers}`, body, undefined, {
      "Content-Type": "application/json",
      Authorization: `Basic ${config.phpCrossPlatformKey}`,
    });
    if (!apiData.data) {
      return apiData;
    }

    let action = 1;
    const response = apiData.data;
    response["newloanAmount"] = response["loanAmount"];

    const returnData = {
      casetype: response["checkLeadType"],
      leadstatus: response["checkCurrentStatus"],
      action: action,
    };

    if (response["isRamfinCustomer"] == "Yes") {
      const nonActionableStatuses = [
        "Approved",
        "Hold",
        "Disbursal Sheet Send",
        "Disbursed",
        "Part Payment",
        "Settlement",
        "Rejected",
        "Bank Update Rejected",
        "Approved Process",
        "Hold Process",
        "Blacklisted",
        "Disbursal Approved",
        "Bank Update Hold",
        "Document Received",
      ];

      if (nonActionableStatuses.includes(response["checkCurrentStatus"])) {
        action = 0;
      }
    }

    returnData["action"] = action;

    return action;
  }

  async rekycButtonMessages(
    customerID: number,
    mobile: string,
    dob_digit_match_btn_click: "1" | "0",
  ) {
    // aahdaar_pan_mismatch

    let dynamicImport = await import("./onboarding.service");

    const onboardingservice = new dynamicImport.OnboardingService();

    const matches = await onboardingservice.onboardAadharPanMatch(
      mobile,
      customerID,
    );

    if (matches.aadharExistsInPan) {
      await this.customerModel.findOneAndUpdate(
        { customerID },
        { is_pan_aadhar_linked: "Yes" },
      );
    } else {
      await this.customerModel.findOneAndUpdate(
        { customerID },
        { is_pan_aadhar_linked: "No" },
      );
    }

    if (matches.dobMatch === 100) {
      await this.customerModel.findOneAndUpdate(
        { customerID },
        { is_dob_match: "Yes" },
      );
    } else {
      await this.customerModel.findOneAndUpdate(
        { customerID },
        { is_dob_match: "No" },
      );
    }

    if (
      matches.dobMatch === 100 &&
      matches.lastDigitsMatch === 100 &&
      matches.aadharExistsInPan
    ) {
      await this.customerModel.findOneAndUpdate(
        { customerID, mobile: +mobile },
        { dob_digit_match: "1" },
      );
    } else if (
      matches.dobMatch < 100 &&
      matches.lastDigitsMatch < 100 &&
      matches.aadharExistsInPan
    ) {
      await this.customerModel.findOneAndUpdate(
        { customerID, mobile: +mobile },
        { dob_digit_match: "0" },
      );
    } else {
      await this.customerModel.findOneAndUpdate(
        { customerID, mobile: +mobile },
        { dob_digit_match: null },
      );
    }

    if (!matches.aadharExistsInPan) {
      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          msg1: "It appears that your PAN and Aadhaar are not currently linked",
          msg2: "To proceed with the loan application, it is necessary to have your Aadhaar and PAN linked",
          msg3: "Note:",
          msg4: "Once your PAN and Aadhaar are linked, please try again",
          isLinkedDone: dob_digit_match_btn_click,
        },
        "Fetched",
      );
    }
    if (matches.dobMatch < 100) {
      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          msg1: "It appears that your PAN and Aadhaar date of birth are not same",
          msg2: "To proceed with the loan application, it is necessary to have same date of birth in your Aadhaar and PAN",
          msg3: "Note:",
          msg4: "Kindly update the details in your PAN and Aadhaar and try again",
          isLinkedDone: dob_digit_match_btn_click,
        },
        "Fetched",
      );
    }

    if (
      matches.aadharExistsInPan &&
      matches.dobMatch === 100 &&
      matches.lastDigitsMatch === 100
    ) {
      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          msg1: "It appears that your PAN and Aadhaar are linked",
          isLinkedDone: dob_digit_match_btn_click,
        },
        "Fetched",
      );
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        msg1: "No PAN and Aadhar data found for user",
        isLinkedDone: dob_digit_match_btn_click,
      },
      "Fetched",
    );
  }

  async panAadharMismatchUrlClick(customerID: number) {
    await this.customerModel.findOneAndUpdate(
      { customerID },
      { dob_digit_match_btn_click: "1" },
    );

    return this.serviceResponse(HttpStatusCode.Ok, {}, "Completed");
  }

  async repeatUserUpdateEmploymentDetails(
    payload: ICustomerCheckDetails,
    customer: ICustomer,
    userIp: string,
  ) {
    const {
      monthly_income,
      modeOfPayment,
      loan_purpose,
      loan_required,
      company_name,
      salary_date,
      employeeType,
    } = payload;
    const { customerID, mobile, pancard, name, email } = customer;
    const currentDate = momentTz().tz("Asia/Kolkata").format("YYYY-MM-DD");

    let remark = LeadStatus.FRESH_LEAD;
    let leadStatus = LeadStatus.FRESH_LEAD;
    let fbLeads = "";
    let messageCode = "";
    let status = 0;
    let oldLeadId = 0;
    let leadID = 0;
    let dataCode: Record<string, any>;
    let pageName = "";
    let residenceType = "";
    let city = "";
    let state = "";
    let pincode = "";
    let residenceAddress = "";

    const disbursedLoanCount = await this.loanModel.countLoan({
      customerID,
      status: LoanStatus.DISBURSED,
    });

    if (disbursedLoanCount > 0) {
      fbLeads = LeadType.REPEAT_CASE;
    } else {
      const leadCount = await this.leadModel.countLeads({ customerID });
      if (leadCount > 0) {
        fbLeads = LeadType.EXISTING_CASE;
      } else {
        fbLeads = LeadType.NEW_CASE;
      }
    }

    // const customerAddress = await this.addressService.findOne(
    //   {
    //     customerID,
    //   },
    //   ["addressID", "type", "address", "city", "state", "pincode", "landmark"],
    //   [{ column: "addressID", order: "desc" }]
    // );

    // if (customerAddress) {
    //   if (
    //     customerAddress?.address &&
    //     customerAddress?.city &&
    //     customerAddress?.state &&
    //     customerAddress?.pincode
    //   ) {
    //     status = 1;
    //   }
    // }

    const checkExistingLead = await this.leadModel.findOne({
      where: { customerID },
    });

    const existingLender = checkExistingLead?.lenderID;

    const leadSaveData: InsertData<ILead> = {
      customerID,
      purpose: loan_purpose,
      loanRequeried: loan_required,
      monthlyIncome: monthly_income,
      salaryMode: modeOfPayment,
      status: leadStatus,
      utmSource: "app_v1",
      fbLeads,
      step: "1_page",
      ip: userIp,
      lenderID: existingLender,
    };

    if (fbLeads === LeadType.EXISTING_CASE || fbLeads === LeadType.NEW_CASE) {
      const referrer = await this.referrerModel.getLastTwoMonthReferrer(
        customerID,
      );

      leadSaveData.utmSource = referrer?.referrer ?? "app_v1";
      leadSaveData.utm_assigned_date = referrer?.created_at ?? null;
    }

    const leadCheck = await this.leadModel.findOne({
      where: { customerID },
      order: [{ column: "leadID", order: "desc" }],
    });

    if (leadCheck) {
      leadStatus = leadCheck.status;
    } else {
      leadStatus = "Lead Not Found" as unknown as LeadStatus;
    }

    const leadStatuses = [
      LeadStatus.FRESH_LEAD,
      LeadStatus.DOCUMENT_RECEIVED,
      LeadStatus.APPROVED_PROCESS,
      LeadStatus.HOLD_PROCESS,
      LeadStatus.APPROVED,
      LeadStatus.HOLD,
      LeadStatus.BANK_UPDATE_HOLD,
      LeadStatus.DISBURSAL_SHEET_SEND,
      LeadStatus.DISBURSAL_APPROVED,
      LeadStatus.BANK_UPDATE_REJECTED,
      LeadStatus.DISBURSED,
      LeadStatus.PART_PAYMENT,
    ];

    if (leadStatuses.includes(leadStatus)) {
      oldLeadId = leadCheck.leadID;
    } else if (leadStatus === LeadStatus.NOT_ELIGIBLE) {
      const createdDate = momentTz(leadCheck.createdDate).startOf("day");
      const currentDate = momentTz().tz("Asia/Kolkata").startOf("day");
      const days = currentDate.diff(createdDate, "days");

      if (days > 45) {
        [leadID] = await this.leadModel.create(leadSaveData);
      } else {
        oldLeadId = leadCheck.leadID;
      }
    } else {
      [leadID] = await this.leadModel.create(leadSaveData);
      const lastLoan = await this.leadModel.LeadsKnex.join(
        "loan as lo",
        "lo.leadID",
        "=",
        "leads.leadID",
      )
        .where("leads.customerID", customerID)
        .where("leads.status", LeadStatus.CLOSED)
        .select("leads.leadID", "lo.disbursalAmount")
        .orderBy("leads.leadID", "desc")
        .first();
      const lastLeadAmount = lastLoan?.disbursalAmount;
      await this.approvalService.autoApproveRepeatCustomer(
        leadID,
        customerID,
        0,
        lastLeadAmount,
      );
    }

    if (leadID) {
      await this.callhistoryLogModel.insert({
        customerID,
        leadID,
        callType: CallType.IVR,
        status: leadSaveData?.status ?? leadStatus,
        appAmount: String(loan_required),
        noteli: leadSaveData?.status ?? leadStatus,
        remark,
        callbackTime: currentDate as unknown as Date,
        calledBy: +config.defaultUserId,
      });

      status = 1;
      messageCode = "Success";
      dataCode = { loan_id: leadID };
    } else if (oldLeadId) {
      status = 0;
      messageCode = "Lead Already exists";
      dataCode = { loan_id: oldLeadId };
    } else {
      status = 0;
      messageCode = "Something went wrong";
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        status,
        ...dataCode,
        metaData: {},
      },
      messageCode,
    );
  }

  async getRazorpayDetails(customerID: number, leadID: number) {
    const getLenderId = await this.leadModel.findOne({
      where: {
        leadID,
        customerID,
      },
      select: ["lenderID"],
    });
    if (getLenderId) {
      const db = getKnexInstance();
      const lenderInfo = await db("lender")
        .select("lenderID", "name", "lender_display_name")
        .where({ lenderID: getLenderId.lenderID, status: 1 })
        .first();
      let razorPayKey = "";
      if (lenderInfo && lenderInfo.lenderID == getLenderId.lenderID) {
        if (lenderInfo.lenderID == LenderList.YASHIK) {
          razorPayKey = config.razorpayDisbursalKeyId;
        } else if (lenderInfo.lenderID == LenderList.NADANAVAN) {
          razorPayKey = config.razorpayDisbursalKeyIdNandanvan;
        }
      }
      return this.serviceResponse(
        HttpStatusCode.Ok,
        {
          lenderID: getLenderId.lenderID,
          lenderName: lenderInfo.name,
          lenderDisplayName: lenderInfo.lender_display_name,
          razorPayKey,
        },
        "Success",
      );
    }
    return this.serviceResponse(
      HttpStatusCode.BadRequest,
      {},
      "Lender Not Found",
    );
  }
}

export default CustomerService;
export const customerService = new CustomerService();
