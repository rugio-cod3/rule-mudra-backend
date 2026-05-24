import { razorpayMandateModel } from "@/common/common-module/src/database/mysql/razorpayMandate";
import { documentModel } from "@/database/mysql/document";
import { pennyDropModel } from "@/database/mysql/penny_drop";
import { stepTrackerModel } from "@/database/mysql/step_tracker";
import { ApiSupplierType, StepName } from "@/enums/common.enum";
import {
  BankAccountStatus,
  BankAccountType,
} from "@/enums/customerBankAccount.enum";
import { nameCheckPercentage } from "@/enums/finbox.enum";
import {
  NameMatchType,
  NameSimilarityStatus,
} from "@/enums/finboxNameMatch.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { PennyStatus } from "@/enums/penny_drop.enum";
import { BadRequestError, NotFoundError } from "@/errors";
import CommonHelper from "@/helpers/common";
import { IAddress } from "@/interfaces/address.interface";
import { ICustomer } from "@/interfaces/customer.interface";
import { ISaveBankAccountPayload } from "@/interfaces/customerBankAccount.interface";
import { IFinboxSessionBankConnectPayload } from "@/interfaces/finbox_new.interface";
import { ILead } from "@/interfaces/lead.interface";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import {
  IAadharVerificationInitiateDigiLockerPayload,
  IAadharVerificationInitiateSurepassDigiLockerPayload,
  IEmandatePayload,
  IFinboxCreateUrlPayload,
  IKeyFactPayload,
  IPanConfirmationPayload,
  IPanFetchPayload,
  IPanFetchPayloadDigitap,
  IPennyDropInitiatePayload,
  IReferenceDetailsPayload,
  ISearchWordPayload,
  ISurePassSendAadharOtpPayload,
  IUpdateReferenceDetailsPayload,
  IVerifyAadharOtpSurePassPayload,
} from "@/interfaces/onboarding.interface";
import { PennyDropNameMatchStatus } from "@/interfaces/penny_drop.interface";
import { createStepTrackerEntry } from "@/middlewares/stepCheck2.middleware";
import AddressService from "@/services/address.service";
import ApiReqResLogService from "@/services/api_req_res_log.service";
import { verifyOfficeEmail } from "@/services/common";
import CustomerService from "@/services/customer.service";
import CustomerAccountService from "@/services/customerAccount.service";
import CustomerAppService from "@/services/customerApp.service";
import { customerAppVersionService } from "@/services/customerAppVersion.service";
import { customerAppLocationService } from "@/services/customerApp_location_service";
import { CustomerBankAccountService } from "@/services/customerBankAccount.service";
import { customerNameMatchservice } from "@/services/customerNameMatch.service";
import EmployerService from "@/services/employer.service";
import LeadService from "@/services/lead.service";
import LeadApiLogService from "@/services/lead_api_log.service";
import MobileTokenService from "@/services/mobile_token.service";
import { onboardingservice } from "@/services/onboarding.service";
import ResponseService from "@/services/response.service";
import DigilockerService from "@/services/thirdParty/digilocker.service";
import DigitapService from "@/services/thirdParty/digitap.service";
import DigitapNewService from "@/services/thirdParty/digitap_new.service";
import S3Service, { s3Service } from "@/services/thirdParty/s3.service";
import SurepassService from "@/services/thirdParty/surepass.service";
import {
  digitapEsignInitialize,
  getDigitapESignedAuditTrail,
  getDigitapESignedDoc,
  getDigitapEsignReport,
  getDigitapEsignStatus,
} from "@/utils/digitap_esign";
import { logger } from "@/utils/logger";
import { calculate_repay_amount_ipc } from "@/utils/repayment";
import { getNameMatchPercentage } from "@/utils/surePass.utils";
import { NextFunction, Request, Response } from "express";
import moment from "moment";
import path from "path";
import { container } from "tsyringe";

export interface IAuthenticatedRequest extends Request {
  customer: ICustomer;
}

class CustomerOnboardingController extends ResponseService {
  private commonHelper = new CommonHelper();
  private surepassService = new SurepassService();
  private digilockerService = new DigilockerService();
  private customerService = new CustomerService();
  private apiReqResLogService = new ApiReqResLogService();
  private customerAppService = new CustomerAppService();
  private mobileTokenService = new MobileTokenService();
  private addressService = new AddressService();
  private leadApiLogService = new LeadApiLogService();
  private employerService = new EmployerService();
  private leadService = new LeadService();
  private customerAccountService = new CustomerAccountService();
  private customerBankAccountService = container.resolve(
    CustomerBankAccountService,
  );
  private digitapNewService = new DigitapNewService();
  private digitapService = new DigitapService();
  private s3Service = new S3Service();
  private readonly onboardingService = onboardingservice;
  private readonly stepTrackerModel = stepTrackerModel;

  constructor() {
    super();
  }
  private readonly customerAppLocationService = customerAppLocationService;
  private readonly customerAppVersionService = customerAppVersionService;
  //aadhar_verification_surepass

  aadharVerificationGenerateOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { aadharNo } = req.body as ISurePassSendAadharOtpPayload;
      const {
        customerID,
        mobile,
        aadharNo: customerAadharNo,
        dob_digit_match,
      } = req.customer;

      const payload: ISurePassSendAadharOtpPayload = {
        aadharNo,
        customerAadharNo,
        customerID,
        mobileNo: mobile,
        dob_digit_match,
      };

      const { data, message, statusCode } =
        await this.onboardingService.onboardAadharVerificationGenerateOtp(
          payload,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  aadharVerificationVerifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { otp, aadharNo } = req.body as IVerifyAadharOtpSurePassPayload;
      const {
        customerID,
        mobile,
        aadharNo: customerAadharNo,
        dob_digit_match,
      } = req.customer;

      const userIp = this.commonHelper.getClientIp(req);

      const payload: IVerifyAadharOtpSurePassPayload = {
        otp,
        aadharNo,
        customerAadharNo,
        customerID,
        mobileNo: mobile,
        userStep: req.userStep,
        dob_digit_match,
        userIp,
      };

      const { data, message, statusCode } =
        await this.onboardingService.onboardAadharVerificationVerifyOtp(
          payload,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  aadharVerificationInitiateDigiLockerSurepass = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        customerID,
        name,
        email,
        mobile,
        dob_digit_match,
        customerAadharNo,
      } = req.customer;
      const { callBackUrl } = req.body;

      const payload: IAadharVerificationInitiateSurepassDigiLockerPayload = {
        customerID,
        mobile,
        name,
        email,
        callBackUrl,
        dob_digit_match,
        customerAadharNo,
      };

      const { data, message, statusCode } =
        await this.onboardingService.onboardAadharInitiateDigiLockerSurepass(
          payload,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  aadharVerificationInitiateDigiLocker = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        customerID,
        mobile,
        aadharNo: customerAadharNo,
        dob_digit_match,
      } = req.customer;
      const { callBackUrl } = req.body;

      const payload: IAadharVerificationInitiateDigiLockerPayload = {
        customerID,
        mobile,
        customerAadharNo,
        callBackUrl,
        dob_digit_match,
      };

      const { data, message, statusCode } =
        await this.onboardingService.onboardAadharInitiateDigiLocker(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  aadharVerificationWebhookDigiLocker = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { transactionId, txnId, client_id, state } = req.query;
      const { customerID, mobile } = req.customer;

      const finalTransactionId = String(
        transactionId || txnId || client_id || "",
      );

      if (!finalTransactionId) {
        throw new BadRequestError("transactionId is required");
      }

      // const payload1: IAadharVerificationWebhookDigiLockerSurepass = {
      //   state: state.toString(),
      //   client_id: client_id.toString(),
      //   customerID: +customerID,
      //   mobile: mobile.toString(),
      // };

      const payload = {
        transactionId: finalTransactionId,
        state: state ? String(state) : "",
        customerID: +customerID,
        mobile: mobile.toString(),
      };

      // const { data, message, statusCode } =
      //   await this.onboardingService.aadharVerificationWebhookDigiLocker(
      //     payload,
      //   );

      const { data, message, statusCode } =
        await this.onboardingService.aadharVerificationWebhookDigiLockerDigitap(
          payload,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  aadharPanVerifyMatch = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { data, message, statusCode } =
        await this.onboardingService.aadharPanVerifyMatch(
          req.customer.customerID,
          String(req.customer.mobile),
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  aadharPanReverify = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { data, message, statusCode } =
        await this.onboardingService.aadharPanReverify(req.customer);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // public onboardNameAndEmail = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) => {
  //   try {
  //     let customerId = req.customer.user_id
  //     let { pan, email } = req.body
  //     const customer = await this.customerService.updateOne(
  //       { customerID: customerId },
  //       {
  //         email,
  //       },
  //     )

  //     // ! Update Step[NEW]
  //     await this.stepTrackerModel.completeStep(
  //       customerId,
  //       StepName.NAME_AND_EMAIL,
  //       Products.PAYDAY,
  //     )

  //     this.sendResponse(res, 200, {}, 'Data saved successfully.')
  //     // return this.commonHelper.sendResponse(
  //     //   res,
  //     //   true,
  //     //   'Name and email saved successfully',
  //     //   {},
  //     //   200,
  //     // )
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  onboardPanVerification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { pan, email } = req.body as Omit<
        IPanFetchPayload,
        "customerId,mobileNo"
      >;

      const {
        customerID,
        mobile,
        pancard: customerPanCardNo,
        pan_cust_verified,
      } = req.customer;

      const payload: IPanFetchPayload = {
        pan,
        customerID,
        mobileNo: mobile,
        customerPanCardNo,
        pan_cust_verified,
        email,
      };

      const { data, message, statusCode } =
        await this.onboardingService.onboardPanVerification(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  onboardPanConfirmation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { pan: panNumber, email } = req.body as Omit<
        IPanFetchPayload,
        "customerId,mobileNo"
      >;

      const { customerID, mobile } = req.customer;

      const payload: IPanConfirmationPayload = {
        panNumber,
        customerID,
        mobileNo: mobile,
        userStep: req.userStep,
        email,
      };

      const { data, message, statusCode } =
        await this.onboardingService.onboardPanConfirmation(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  onboardPanFetch = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { mobile } = req.customer;
      const { panNumber }: { panNumber: string } = req.body;

      const { data, message, statusCode } =
        await this.onboardingService.onBoardPanFetch(mobile, panNumber);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  public update_customer_details = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    let request = JSON.stringify(req?.body);
    try {
      let data = req.body;
      const validatorParams = {
        step: "required",
      };

      const validator = await CommonHelper.commonValidations(
        data,
        validatorParams,
      );
      if (validator && validator.length > 0) {
        const errorStatus = logger.error(validator);
        if (errorStatus) {
          let api_response = JSON.stringify({
            success: false,
            message: "Invalid Request Body",
            data: { ...validator },
            statusCode: 400,
          });
          await this.apiReqResLogService.create({
            customerID: `${req?.customer?.customerID}`,
            mobile: `${req?.customer?.mobile}`,
            api_request: request,
            api_response: api_response,
            status: "0",
            message: "Invalid Request Body",
            api_name: req.url,
          });
          return this.commonHelper.sendResponse(
            res,
            false,
            "Invalid Request Body",
            { ...validator },
            400,
          );
        } else {
          let api_response = JSON.stringify({
            success: false,
            message: "Invalid Request Body",
            data: { errors: "Somthing issue in logger" },
            statusCode: 400,
          });
          await this.apiReqResLogService.create({
            customerID: `${req?.customer?.customerID}`,
            mobile: `${req?.customer?.mobile}`,
            api_request: request,
            api_response: api_response,
            status: "0",
            message: "Invalid Request Body",
            api_name: req.url,
          });
          return this.commonHelper.sendResponse(
            res,
            false,
            "Invalid Request Body",
            { errors: "Somthing issue in logger" },
            400,
          );
        }
      } else {
        let step = data.step;
        let customerID = req?.customer?.customerID;
        let mobile = req?.customer?.mobile;

        let customer = (await this.customerService.findOne(
          { customerID, mobile },
          ["*"],
        )) as ICustomer;
        if (!customer) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Issue In Finding Customer",
            {},
            400,
          );
        }
        let mobileToken = await this.mobileTokenService.findOne(
          {
            customerID: String(customerID),
            mobile: String(mobile),
            jwt_access_token: req.headers["token"] as string,
          },
          ["id"],
          [{ column: "id", order: "desc" }],
        );
        if (!mobileToken) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Issue In Finding Mobile Token",
            {},
            400,
          );
        }
        let lead = await this.leadService.findOne(
          { customerID, status: LeadStatus.INCOMPLETE_USER },
          ["*"],
          [{ column: "leadID", order: "desc" }],
        );
        if (!lead) {
          return this.commonHelper.sendResponse(
            res,
            false,
            "Issue In Finding Incomplete Lead",
            {},
            400,
          );
        }
        let message = "Bad Request: Send Something To Update";
        let statusCode = 400;
        let responseData = {};
        let need_to_verify_otp = "No";
        let salary_date = data.salary_date;
        let loanRequeried = data.loanRequeried;
        let purposeloan = data.purposeloan;
        let gender = data.gender;
        //
        let companyName = data.companyName;
        let office_email_id = data.office_email_id;
        let otp = office_email_id ? CommonHelper.otpCode() : null;
        //
        let designation = data.designation;
        let monthlyIncome = data.monthlyIncome;
        let working_since = data.working_since;
        let industry = data.industry;
        let residenceType = data.residenceType;
        //
        let residenceAddress = data.residenceAddress;
        let state = data.state;
        let city = data.city;
        let pincode = data.pincode;
        let landmark = data.landmark;
        //
        let marrital = data.marrital;
        let education = data.education;
        let employeeType = data.employeeType;
        let salaryMode = data.salaryMode;
        async function updateData(data: {}, message: string) {
          let update = await this.customerService.updateOne(
            { customerID, mobile },
            data,
          );
          if (update) {
            return { msg: message, code: 200 };
          }
        }
        if (loanRequeried) {
          let updateLoanRequired = await this.leadService.updateOne(
            {
              customerID,
              leadID: lead.leadID,
              status: LeadStatus.INCOMPLETE_USER,
            },
            { loanRequeried, step },
          );
          if (updateLoanRequired) {
            message = "Loan Required Added";
            statusCode = 200;
          } else {
            message = "Issue In Updating Loan Required";
            statusCode = 400;
          }
        }
        if (purposeloan) {
          // ! Removed, test
          // let updatePurposeLoan = await this.leadApiLogService.updateOne(
          //   {
          //     customerID,
          //     leadID: String(lead.leadID),
          //     status: 0,
          //   },
          //   { purpose, step },
          // )
          // if (updatePurposeLoan) {
          //   message = 'Purpose Added'
          //   statusCode = 200
          // } else {
          //   message = 'Issue In Updating Loan Purpose'
          //   statusCode = 400
          // }
        }
        if (gender) {
          let updateGender = await this.customerService.updateOne(
            {
              customerID,
              mobile,
            },
            { gender },
          );
          if (updateGender) {
            message = "Gender Added";
            statusCode = 200;
          } else {
            message = "Issue In Updating Gender";
            statusCode = 400;
          }
        }
        if (salaryMode) {
          let leadUpdate = await this.leadService.updateOne(
            {
              customerID,
              status: LeadStatus.INCOMPLETE_USER,
              leadID: lead.leadID,
            },
            {
              salaryMode,
              step,
            },
          );
          if (leadUpdate) {
            message = "Salary Mode Update";
            statusCode = 200;
          } else {
            message = "Issue In Updating Salary Mode";
            statusCode = 400;
          }
        }
        if (working_since) {
          let updateWorkingSince = await this.customerService.updateOne(
            {
              customerID,
              // leadID: lead.leadID,
              status: "Incomplete",
            },
            { working_since, step },
          );
          if (updateWorkingSince) {
            message = "Working SInce Added";
            statusCode = 200;
          } else {
            message = "Issue In Updating Working Since";
            statusCode = 400;
          }
        }
        if (monthlyIncome) {
          let updateMonthlyIncome = await this.leadService.updateOne(
            {
              customerID,
              leadID: lead.leadID,
              status: LeadStatus.INCOMPLETE_USER,
            },
            { salaryMode, step },
          );
          if (updateMonthlyIncome) {
            message = "Monthly Income Added";
            statusCode = 200;
          } else {
            message = "Issue In Adding Monthly Income";
            statusCode = 200;
          }
        }

        if (employeeType) {
          let { msg, code } = await updateData.call(
            this,
            { employeeType },
            "Employee Type Update",
          );
          message = msg;
          statusCode = code;
        }
        if (education) {
          let { msg, code } = await updateData.call(
            this,
            { education },
            "Education Update",
          );
          message = msg;
          statusCode = code;
        }
        if (marrital) {
          let { msg, code } = await updateData.call(
            this,
            { marrital },
            "Merrital Status Update",
          );
          message = msg;
          statusCode = code;
        }
        if (industry) {
          let { msg, code } = await updateData.call(
            this,
            { industry },
            "Industry Update",
          );
          message = msg;
          statusCode = code;
        }
        if (designation) {
          let { msg, code } = await updateData.call(
            this,
            { designation },
            "Designation Added",
          );
          message = msg;
          statusCode = code;
        }
        if (salary_date) {
          let { msg, code } = await updateData.call(
            this,
            { salary_date },
            "Salary Date Added",
          );
          message = msg;
          statusCode = code;
        }

        if (residenceType) {
          if (residenceType == "Rented") {
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
          let address = (await this.addressService.findOne(
            { customerID },
            ["*"],
            [{ column: "addressID", order: "desc" }],
          )) as IAddress;
          //if address found then take data from address table and create new entry
          //else from adhar data and create new entry
          if (address) {
            await this.addressService.create({
              customerID,
              type: residenceType,
              address: address.address,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
              status: "Not Verified",
              verifiedBy: 1,
              fetchedBy: "Customer",
            });
            statusCode = 200;
            message = "Residence Type Updated";
          } else {
            let residenceAddress = "";
            let state = "";
            let city = "";
            let pincode = null;
            if (customer.aadharNo && customer.aadharNo !== "0") {
              let adharData = (await this.leadApiLogService.findOne(
                {
                  status: 1,
                  api_type: "aadhaar-v2-submit-otp",
                  aadharNo: customer?.aadharNo?.toString(),
                },
                ["api_response", "mobile_no"],
                [
                  {
                    column: "id",
                    order: "desc",
                  },
                ],
              )) as ILeadsApiLog;
              if (adharData) {
                let adharDataJson = JSON.parse(adharData.api_response);
                residenceAddress = `${adharDataJson["data"]["address"]["house"]} ${adharDataJson["data"]["address"]["street"]} ${adharDataJson["data"]["address"]["loc"]} ${adharDataJson["data"]["address"]["subdist"]} ${adharDataJson["data"]["address"]["po"]} ${adharDataJson["data"]["address"]["dist"]}`;
                state = adharDataJson["data"]["address"]["state"];
                city = adharDataJson["data"]["address"]["dist"];
                pincode = adharDataJson["data"]["zip"];
              } else {
                let digilocker = (await this.leadApiLogService.findOne(
                  {
                    status: 1,
                    api_type: "digilocker_eaadhaar",
                    mobile_no: String(mobile),
                  },
                  ["api_response"],
                  [
                    {
                      column: "id",
                      order: "desc",
                    },
                  ],
                )) as ILeadsApiLog;
                if (digilocker) {
                  let digilockerjson = JSON.parse(digilocker.api_response);
                  if (
                    digilockerjson?.data?.hasOwnProperty("aadhaarUid") &&
                    digilockerjson?.data?.aadhaarUid !== ""
                  ) {
                    residenceAddress = `${digilockerjson?.data?.proofOfAddress?.careOf} ${digilockerjson?.data?.proofOfAddress?.house} ${digilockerjson?.data?.proofOfAddress?.street} ${digilockerjson?.data?.proofOfAddress?.locality}`;
                    state = digilockerjson?.data?.proofOfAddress?.state;
                    city = digilockerjson?.data?.proofOfAddress?.district;
                    pincode = digilockerjson?.data?.proofOfAddress?.pincode;
                  }
                }
              }
            }
            await this.addressService.create({
              customerID,
              type: residenceType,
              address: residenceAddress,
              city: city,
              state: state,
              pincode: pincode,
              status: "Not Verified",
              verifiedBy: 1,
              fetchedBy: "Aadhar",
            });
            statusCode = 200;
            message = "Residence Type Added";
          }
        }
        if (residenceAddress) {
          let data = { residenceAddress, step, state, city, pincode };
          const validatorParams = {
            step: "required",
            state: "required",
            city: "required",
            pincode: "required",
            residenceAddress: "required",
          };

          const validator = await CommonHelper.commonValidations(
            data,
            validatorParams,
          );
          if (validator && validator.length > 0) {
            const errorStatus = logger.error(validator);
            if (errorStatus) {
              return this.commonHelper.sendResponse(
                res,
                false,
                "Invalid Request Body",
                { ...validator },
                400,
              );
            } else {
              return this.commonHelper.sendResponse(
                res,
                false,
                "Invalid Request Body",
                { errors: "Somthing issue in logger" },
                400,
              );
            }
          } else {
            let address = (await this.addressService.findOne({ customerID }, [
              "addressID",
              "type",
              "address",
              "city",
              "state",
              "pincode",
              "landmark",
            ])) as IAddress;
            if (
              address &&
              address.address &&
              address.city &&
              address.state &&
              address.pincode &&
              address.address === residenceAddress &&
              address.city === city &&
              address.state === state &&
              address.pincode === pincode
            ) {
              statusCode = 200;
              message = "Address Updated";
            } else {
              await this.addressService.create({
                customerID,
                type: address.type,
                address: residenceAddress.substring(0, 255),
                city,
                state,
                pincode,
                landmark,
                fetchedBy: "Customer",
                status: "Not Verified",
                verifiedBy: 1,
              });
              statusCode = 200;
              message = "Address Updated";
            }
          }
        }
        if (companyName) {
          let query = { customerID, is_verified_email: "Yes" } as {
            customerID: number;
            office_email_id: string;
            is_verified_email: string;
          };
          if (office_email_id) query.office_email_id = office_email_id;
          let employer = await this.employerService.findOne(
            { customerID },
            ["office_email_id"],
            [{ column: "employerID", order: "desc" }],
          );
          if (employer) {
            need_to_verify_otp = "NO";
          } else {
            if (otp && office_email_id) {
              need_to_verify_otp = "Yes";
              await verifyOfficeEmail(office_email_id, otp, customer.name);
            }
          }
          let newEmployerEntry = await this.employerService.create({
            customerID,
            employerName: companyName,
            office_email_id: office_email_id ? office_email_id : "",
            office_email_otp: otp,
            is_verified_email: need_to_verify_otp == "Yes" ? "No" : "Yes",
            address: "NA",
            city: "NA",
            state: "NA",
            pincode: "000000",
            status: "Not Verified",
            verifiedBy: 1,
          });
          if (newEmployerEntry) {
            statusCode = 200;
            message = "Company Name Added";
            responseData = { need_to_verify_otp };
          }
        }
        let api_response = JSON.stringify({
          success: true,
          message,
          data: responseData,
          statusCode,
        });
        await this.apiReqResLogService.create({
          customerID: `${customerID}`,
          mobile: `${mobile}`,
          api_request: request,
          api_response: api_response,
          status: "1",
          message,
          api_name: req.url,
        });
        return this.commonHelper.sendResponse(
          res,
          true,
          message,
          responseData,
          statusCode,
        );
      }
    } catch (error) {
      console.log(error);
      let api_response = {
        success: false,
        message: "Internal Server Error",
        data: {},
        statusCode: 500,
      }.toString();
      await this.apiReqResLogService.create({
        customerID: `${req?.customer?.customerID}`,
        mobile: `${req?.customer?.mobile}`,
        api_request: request,
        api_response: api_response,
        status: "0",
        message: "Internal Server Error",
        api_name: req.url,
      });
      return this.commonHelper.sendResponse(
        res,
        false,
        "Internal Server Error",
        {},
        500,
      );
    }
  };
  public saveBankDetails = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      let customerId = req.customer.customerID;
      let data = req.body;
      let lead = (await this.leadService.findOne({ customerID: customerId }, [
        "customerID",
        "leadID",
      ])) as ILead;
      if (!lead) {
        return this.commonHelper.sendResponse(
          res,
          false,
          "lead not found",
          {},
          400,
        );
      }
      const validatorParams = {
        accountNo: "required  | string",
        bank: "required | string",
        ifsc: "required | string",
        bankHolderName: "required  | string",
      };
      const results = {
        status: false,
        data: {},
        errors: null,
      };

      const validator = await CommonHelper.commonValidations(
        data,
        validatorParams,
      );
      if (validator && validator.length > 0) {
        const errorStatus = logger.error(validator);
        if (errorStatus) {
          results.errors = validator;
          res.status(401).json(results);
        } else {
          results.errors = "Somthing issue in logger";
          res.status(401).json(results);
        }
      } else {
        let accountNo = data.accountNo;
        let bank = data.bank;
        let ifsc = data.ifsc;
        let bankHolderName = data.bankHolderName;
        let account = await this.customerAccountService.findOne(
          { customerID: customerId, accountNo, bankIfsc: ifsc },
          { orderKey: "customerID", orderValue: "desc" },
          ["customerID"],
        );
        if (!account) {
          const customerAccount = await this.customerAccountService.create({
            leadID: lead.leadID,
            customerID: customerId,
            accountType: BankAccountType.SAVING,
            accountNo: accountNo,
            bank: bank,
            bankIfsc: ifsc,
            bank_holder_name: bankHolderName,
            bankBranch: "NA",
            createdDate: new Date(Date.now()),
            status: BankAccountStatus.NOT_VERIFIED,
            credatedBy: 1,
            ip: this.commonHelper.getClientIp(req),
          });
          return this.commonHelper.sendResponse(
            res,
            true,
            "account details saved successfully",
            { customerAccount },
            200,
          );
        }

        return this.commonHelper.sendResponse(
          res,
          true,
          "account details already exists in db",
          {},
          200,
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // public verifySelfie = async (
  //   req: IAuthenticatedRequest,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   try {
  //     if (!req.customer || !req.customer.customerID) {
  //       throw new BadRequestError("Customer information not found");
  //     }

  //     if (!req.body.loan_id) {
  //       throw new BadRequestError("Loan ID is required");
  //     }

  //     const customerId = req.customer.customerID;
  //     let image = req.file;
  //     const { loan_id: leadID } = req.body;
  //     const mobile = req.customer.mobile;
  //     const aadhaarNo = req.customer?.aadharNo;

  //     if (!image) {
  //       throw new BadRequestError("Please upload an image");
  //     }

  //     if (!mobile) {
  //       throw new BadRequestError("Customer mobile number not found");
  //     }

  //     if (!leadID || isNaN(parseInt(leadID))) {
  //       throw new BadRequestError("Valid loan ID is required");
  //     }

  //     if (!image.buffer || image.buffer.length === 0) {
  //       throw new BadRequestError("Invalid image file");
  //     }

  //     const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  //     const extension = path.extname(image.originalname).toLowerCase();

  //     if (!allowedExtensions.includes(extension)) {
  //       throw new BadRequestError(
  //         "Invalid file type. Only JPEG, PNG, and WebP images are allowed"
  //       );
  //     }

  //     const s3FolderName = `documents/kyc/${customerId}`;
  //     const leadId = parseInt(leadID);
  //     const imageName = `image_${Date.now()}${extension}`;
  //     let surepassSelfieResponse;
  //     try {
  //       surepassSelfieResponse =
  //         await this.surepassService.selfieFaceMatchSurepass(
  //           mobile,
  //           leadID,
  //           imageName,
  //           aadhaarNo,
  //           s3FolderName,
  //           image.buffer,
  //           customerId
  //         );
  //     } catch (surepassSelfieError) {
  //       logger.error("surepassSelfieError API error:", surepassSelfieError);

  //       if (surepassSelfieError.message === "Face verification timeout") {
  //         throw new BadRequestError(
  //           "Face verification is taking too long. Please try again"
  //         );
  //       }
  //       if (surepassSelfieError.message?.includes("image URL")) {
  //         throw new BadRequestError(
  //           "Failed to process uploaded image. Please try again"
  //         );
  //       }

  //       throw new BadRequestError("Face verification failed. Please try again");
  //     }

  //     if (!surepassSelfieResponse) {
  //       throw new BadRequestError("No response from face verification service");
  //     }
  //     if (
  //       surepassSelfieResponse?.data.match_status === true &&
  //       surepassSelfieResponse?.data?.confidence >= 80
  //     ) {
  //       try {
  //         const imageBase64 = image.buffer.toString("base64");
  //         // await this.digitapService.sendConsentImageEmail(
  //         //   customerId,
  //         //   leadID,
  //         //   imageBase64
  //         // );

  //         return this.sendResponse(res, 200, {
  //           data: surepassSelfieResponse.data,
  //         });
  //       } catch (stepError) {
  //         logger.error("Step completion failed:", stepError);
  //         throw new BadRequestError(
  //           "Verification completed but failed to update progress"
  //         );
  //       }
  //     } else {
  //       const failureReason =
  //         surepassSelfieResponse?.apimsg?.result?.reason ||
  //         "Face does not match";
  //       throw new BadRequestError(
  //         `Selfie verification failed: ${failureReason}`,
  //         {
  //           data: surepassSelfieResponse,
  //         }
  //       );
  //     }
  //   } catch (error) {
  //     logger.error("Selfie verification error:", {
  //       customerId: req.customer?.customerID,
  //       leadId: req.body?.loan_id,
  //       error: error.message,
  //       stack: error.stack,
  //     });

  //     if (
  //       error instanceof BadRequestError ||
  //       error instanceof NotFoundError ||
  //       error.status === 400
  //     ) {
  //       return next(error);
  //     }

  //     return next(
  //       new BadRequestError(
  //         "An error occurred during selfie verification. Please try again"
  //       )
  //     );
  //   }
  // };

  public verifySelfie = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const startTime = Date.now();

    try {
      logger.info("Initial request validation", {
        hasCustomer: !!req.customer,
        customerID: req.customer?.customerID,
        hasBody: !!req.body,
        bodyKeys: req.body ? Object.keys(req.body) : [],
        hasFile: !!req.file,
        fileDetails: req.file
          ? {
              fieldname: req.file.fieldname,
              originalname: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
              hasBuffer: !!req.file.buffer,
              bufferLength: req.file.buffer?.length,
            }
          : null,
      });

      if (!req.customer || !req.customer.customerID) {
        logger.error("Customer validation failed", {
          hasCustomer: !!req.customer,
          customerKeys: req.customer ? Object.keys(req.customer) : null,
        });
        throw new BadRequestError("Customer information not found");
      }

      if (!req.body.loan_id) {
        logger.error("Loan ID validation failed", {
          bodyLoanId: req.body.loan_id,
          bodyType: typeof req.body.loan_id,
        });
        throw new BadRequestError("Loan ID is required");
      }

      const customerId = req.customer.customerID;
      let image = req.file;
      const { loan_id: leadID } = req.body;
      const mobile = req.customer.mobile;
      const aadhaarNo = req.customer?.aadharNo;

      logger.info("Extracted variables", {
        customerId,
        leadID,
        leadIDType: typeof leadID,
        mobile,
        aadhaarNo: aadhaarNo ? `***${aadhaarNo.slice(-4)}` : null,
        hasImage: !!image,
      });

      if (!image) {
        logger.error("Image validation failed - no file uploaded");
        throw new BadRequestError("Please upload an image");
      }

      if (!mobile) {
        logger.error("Mobile validation failed", {
          customerMobile: req.customer.mobile,
          customerKeys: Object.keys(req.customer),
        });
        throw new BadRequestError("Customer mobile number not found");
      }

      if (!leadID || isNaN(parseInt(leadID))) {
        logger.error("Lead ID validation failed", {
          leadID,
          leadIDType: typeof leadID,
          parsedLeadID: parseInt(leadID),
          isNaN: isNaN(parseInt(leadID)),
        });
        throw new BadRequestError("Valid loan ID is required");
      }

      if (!image.buffer || image.buffer.length === 0) {
        logger.error("Image buffer validation failed", {
          hasBuffer: !!image.buffer,
          bufferLength: image.buffer?.length,
          imageSize: image.size,
        });
        throw new BadRequestError("Invalid image file");
      }

      const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const extension = path.extname(image.originalname).toLowerCase();

      logger.info("File extension validation", {
        originalName: image.originalname,
        extension,
        allowedExtensions,
        isAllowed: allowedExtensions.includes(extension),
      });

      if (!allowedExtensions.includes(extension)) {
        logger.error("Invalid file extension", {
          extension,
          allowedExtensions,
        });
        throw new BadRequestError(
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed",
        );
      }

      const s3FolderName = `documents/kyc/${customerId}`;
      const leadId = parseInt(leadID);
      const imageName = `image_${Date.now()}${extension}`;

      logger.info("Prepared for Surepass API call", {
        s3FolderName,
        leadId,
        imageName,
        mobile,
        customerId,
        bufferSize: image.buffer.length,
      });

      let livenessResponse;
      try {
        logger.info("Calling Digitap liveness check API...");
        const livenessStartTime = Date.now();

        livenessResponse = await this.digitapNewService.selfieLivenessCheck(
          mobile,
          leadId,
          imageName,
          image.buffer,
          customerId,
        );

        const livenessDuration = Date.now() - livenessStartTime;
        logger.info("Digitap liveness API response received", {
          duration: livenessDuration,
          hasResponse: !!livenessResponse,
          isLive: livenessResponse?.data?.is_live,
          livenessConfidence: livenessResponse?.data?.liveness_confidence,
        });
      } catch (livenessError) {
        logger.error("Digitap liveness API error:", {
          errorMessage: livenessError.message,
          errorName: livenessError.name,
        });
        throw new BadRequestError(
          "Face liveness check failed. Please try again",
        );
      }

      if (
        !livenessResponse?.data?.is_live ||
        livenessResponse?.data?.liveness_confidence < 0.7
      ) {
        logger.error("Liveness check failed", {
          isLive: livenessResponse?.data?.is_live,
          confidence: livenessResponse?.data?.liveness_confidence,
          hasMultipleFaces: livenessResponse?.data?.multiple_face_detected,
          isBlurry: livenessResponse?.data?.is_person_image_blurry,
          eyesClosed: livenessResponse?.data?.eye_closed,
          hasMask: livenessResponse?.data?.has_mask,
        });

        let failureReason = "Image does not appear to be live";
        if (livenessResponse?.data?.multiple_face_detected) {
          failureReason = "Multiple faces detected in image";
        } else if (livenessResponse?.data?.is_person_image_blurry) {
          failureReason = "Image is too blurry";
        } else if (livenessResponse?.data?.eye_closed) {
          failureReason = "Eyes are closed in the image";
        } else if (livenessResponse?.data?.has_mask) {
          failureReason = "Face mask detected, please remove mask";
        } else if (!livenessResponse?.data?.person_image_correctly_identified) {
          failureReason = "Face not properly detected in image";
        }

        throw new BadRequestError(`Liveness check failed: ${failureReason}`, {
          data: livenessResponse,
        });
      }

      logger.info("Liveness check passed, proceeding with face match");

      let selfieResponse;
      try {
        logger.info("Calling Digitap face match API...");
        const apiStartTime = Date.now();

        selfieResponse = await this.digitapNewService.selfieFaceMatchDigitap(
          mobile,
          leadID,
          imageName,
          aadhaarNo,
          s3FolderName,
          image.buffer,
          customerId,
        );

        const apiDuration = Date.now() - apiStartTime;
        logger.info("Digitap face match API response received", {
          duration: apiDuration,
          hasResponse: !!selfieResponse,
          responseKeys: selfieResponse ? Object.keys(selfieResponse) : null,
          dataKeys: selfieResponse?.data
            ? Object.keys(selfieResponse.data)
            : null,
        });
      } catch (selfieError) {
        logger.error("Digitap API error details:", {
          errorMessage: selfieError.message,
          errorName: selfieError.name,
          errorCode: selfieError.code,
          errorStatus: selfieError.status,
          errorStack: selfieError.stack,
          errorResponse: selfieError.response?.data,
          isTimeoutError: selfieError.message === "Face verification timeout",
          isImageUrlError: selfieError.message?.includes("image URL"),
        });

        if (selfieError.message === "Face verification timeout") {
          throw new BadRequestError(
            "Face verification is taking too long. Please try again",
          );
        }
        if (selfieError.message?.includes("image URL")) {
          throw new BadRequestError(
            "Failed to process uploaded image. Please try again",
          );
        }

        throw new BadRequestError("Face verification failed. Please try again");
      }

      if (!selfieResponse) {
        logger.error("No response from Digitap service");
        throw new BadRequestError("No response from face verification service");
      }

      logger.info("Analyzing Digitap response", {
        hasData: !!selfieResponse.data,
        matchStatus: selfieResponse?.data?.match_status,
        confidence: selfieResponse?.data?.confidence,
        confidenceType: typeof selfieResponse?.data?.confidence,
        fullResponse: JSON.stringify(selfieResponse, null, 2),
      });

      if (
        selfieResponse?.data.match_status === true &&
        selfieResponse?.data?.confidence >= 80 &&
        selfieResponse?.data?.is_same_face === true
      ) {
        logger.info("Verification successful, proceeding with success flow", {
          matchStatus: selfieResponse.data.match_status,
          confidence: selfieResponse.data.confidence,
        });

        try {
          const imageBase64 = image.buffer.toString("base64");
          const base64Length = imageBase64.length;

          logger.info("Image converted to base64", {
            base64Length,
            originalBufferSize: image.buffer.length,
          });

          // await this.digitapService.sendConsentImageEmail(
          //   customerId,
          //   leadID,
          //   imageBase64
          // );

          const totalDuration = Date.now() - startTime;
          logger.info("Selfie verification completed successfully", {
            totalDuration,
            customerId,
            leadId,
          });

          return this.sendResponse(res, 200, {
            data: {
              ...selfieResponse.data,
              liveness_check: livenessResponse.data,
            },
          });
        } catch (stepError) {
          logger.error("Step completion error details:", {
            errorMessage: stepError.message,
            errorName: stepError.name,
            errorStack: stepError.stack,
          });
          throw new BadRequestError(
            "Verification completed but failed to update progress",
          );
        }
      } else {
        const failureReason =
          selfieResponse?.apimsg?.result?.reason || "Face does not match";

        logger.error("Verification failed due to match criteria", {
          matchStatus: selfieResponse?.data?.match_status,
          confidence: selfieResponse?.data?.confidence,
          failureReason,
          fullApiMsg: selfieResponse?.apimsg,
          requiredConfidence: 80,
        });

        throw new BadRequestError(
          `Selfie verification failed: ${failureReason}`,
          {
            data: selfieResponse,
          },
        );
      }
    } catch (error) {
      const totalDuration = Date.now() - startTime;

      logger.error("Selfie verification error - comprehensive details:", {
        customerId: req.customer?.customerID,
        leadId: req.body?.loan_id,
        errorMessage: error.message,
        errorName: error.name,
        errorConstructor: error.constructor.name,
        errorStatus: error.status,
        errorCode: error.code,
        isBadRequestError: error instanceof BadRequestError,
        isNotFoundError: error instanceof NotFoundError,
        hasStatus400: error.status === 400,
        errorStack: error.stack,
        totalDuration,
        timestamp: new Date().toISOString(),
      });

      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error.status === 400
      ) {
        logger.info("Passing known error to next middleware", {
          errorType: error.constructor.name,
          errorMessage: error.message,
        });
        return next(error);
      }

      logger.error("Passing generic error to next middleware", {
        errorType: error.constructor.name,
        originalMessage: error.message,
      });

      return next(
        new BadRequestError(
          "An error occurred during selfie verification. Please try again",
        ),
      );
    }
  };

  // Finbox - STEP 1

  finboxCreateUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mobile } = req.customer;
      const { callBackUrl, loan_id, session_expire } = req.body;
      let leadID = loan_id;

      const payload: IFinboxCreateUrlPayload = {
        mobileNo: String(mobile),
        callBackUrl,
        leadID,
        customerID: req.customer.customerID,
        session_expire,
      };

      const { data, message, statusCode } =
        await this.onboardingService.finboxCreateUrl(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // Finbox - STEP 2

  finboxBankConnect = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { entityId, loan_id } =
        req.body as IFinboxSessionBankConnectPayload;

      const { customerID } = req.customer;
      const payload: IFinboxSessionBankConnectPayload = {
        entityId,
        loan_id,
        customerID: customerID.toString(),
      };

      const { data, message, statusCode } =
        await this.onboardingService.finboxBankConnect(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  pennyDrop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { loan_id, account_id } = req.body;

      const payload: IPennyDropInitiatePayload = {
        customer: req.customer,
        loan_id,
        account_id,
      };
      const { data, message, statusCode } =
        await this.onboardingService.pennyDrop(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  setEmandate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { account_id: accountId, loan_id: leadID } =
        req.body as IEmandatePayload;

      const payload: IEmandatePayload = {
        account_id: accountId,
        loan_id: leadID,
        customerId: req.customer.customerID,
        emandateRequired: req.customer.emandate_required,
        customerEmail: req.customer.email,
        customerMobile: String(req.customer.mobile),
        customerName: req.customer.name,
      };

      const { data, message, statusCode } =
        await this.onboardingService.setEmandate(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  setVerifyEmandate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { account_id: accountId, loan_id: leadID } =
        req.body as IEmandatePayload;

      const payload: IEmandatePayload = {
        account_id: accountId,
        loan_id: leadID,
        customerId: req.customer.customerID,
        emandateRequired: req.customer.emandate_required,
        customerEmail: req.customer.email,
        customerMobile: String(req.customer.mobile),
        customerName: req.customer.name,
      };

      const { data, message, statusCode } =
        await this.onboardingService.setVerifyEmandate(payload, req.userStep);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  // emandate callback

  setEmandateV2 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { account_id: accountId, loan_id: leadID } =
        req.body as IEmandatePayload;

      const payload: IEmandatePayload = {
        account_id: accountId,
        loan_id: leadID,
        customerId: req.customer.customerID,
        emandateRequired: req.customer.emandate_required,
        customerEmail: req.customer.email,
        customerMobile: String(req.customer.mobile),
        customerName: req.customer.name,
      };

      const { data, message, statusCode } =
        await this.onboardingService.setEmandateV2(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  setVerifyEmandateV2 = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { account_id: accountId, loan_id: leadID } =
        req.body as IEmandatePayload;

      const payload: IEmandatePayload = {
        account_id: accountId,
        loan_id: leadID,
        customerId: req.customer.customerID,
        emandateRequired: req.customer.emandate_required,
        customerEmail: req.customer.email,
        customerMobile: String(req.customer.mobile),
        customerName: req.customer.name,
      };

      const { data, message, statusCode } =
        await this.onboardingService.setVerifyEmandateV2(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  fetchEmandateInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { data, message, statusCode } =
        await this.onboardingService.fetchEmandateInvoice(
          // req.customer,
          req.body,
        );

      // this.sendResponse(res, statusCode, data, message)
      res.redirect(req.query.callBack as string);
    } catch (error) {
      next(error);
    }
  };

  addReferenceDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        mobile_no_1: mobileNo1,
        mobile_no_2: mobileNo2,
        name_1: name1,
        name_2: name2,
        relation_1: relation1,
        relation_2: relation2,
        loan_id: leadID,
      } = req.validatedBody as IReferenceDetailsPayload;

      const payload: IReferenceDetailsPayload = {
        mobile_no_1: mobileNo1,
        mobile_no_2: mobileNo2,
        name_1: name1,
        name_2: name2,
        relation_1: relation1,
        relation_2: relation2,
        loan_id: leadID,
      };

      const { data, message, statusCode } =
        await this.onboardingService.addReferenceDetails(
          payload,
          req.customer.customerID,
          req.customer.mobile,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  getReferenceDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { data, message, statusCode } =
        await this.onboardingService.getReferenceDetails(
          req.customer.customerID,
          req.paginate,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  updateReferenceDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
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
      } = req.body as IUpdateReferenceDetailsPayload;

      const payload: IUpdateReferenceDetailsPayload = {
        mobile_no_1: mobileNo1,
        mobile_no_2: mobileNo2,
        name_1: name1,
        name_2: name2,
        relation_1: relation1,
        relation_2: relation2,
        loan_id: leadID,
        id_1: id1,
        id_2: id2,
      };

      const { data, message, statusCode } =
        await this.onboardingService.updateReferenceDetails(
          payload,
          req.customer.customerID,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  getStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchWord } = req.query;
      let payload: ISearchWordPayload = {
        searchWord: String(searchWord),
      };
      const { data, message, statusCode } =
        await this.onboardingService.getStatesAutoSuggestions(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  approvalView = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, message, statusCode } =
        await this.onboardingService.approvalView(
          req.customer,
          req.body.loan_id,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  generatePaydayKfs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { loan_id: leadId } = req.validatedQuery as IKeyFactPayload;
      let payload: IKeyFactPayload = {
        leadId,
        uploadDocs: false,
      };
      const { data, message, statusCode } =
        await this.onboardingService.generatePaydayKfs(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };
  keyFactsAcceptance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { loan_id: leadId } = req.validatedBody as IKeyFactPayload;
      let payload: IKeyFactPayload = {
        leadId,
        mobile: req.customer.mobile,
        customerId: req.customer.customerID,
      };
      const { data, message, statusCode } =
        await this.onboardingService.keyFactsAcceptance(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };
  bankingSurrogate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { loan_id } = req.validatedBody as IKeyFactPayload;
      let leadId = loan_id;
      let payload: IKeyFactPayload = {
        leadId,
        pancard: req.customer.pancard,
        mobile: req.customer.mobile,
      };
      const { data, message, statusCode } =
        await this.onboardingService.bankingSurrogate(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  onboardPanVerificationByDigitap = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { pan: panNumber } = req.body as Omit<
        IPanFetchPayload,
        "customerId,mobileNo"
      >;

      const { customerID, mobile, pancard: customerPanCardNo } = req.customer;

      const payload: IPanFetchPayloadDigitap = {
        panNumber,
        customerID,
        mobileNo: mobile,
        customerPanCardNo,
      };

      const { data, message, statusCode } =
        await this.onboardingService.onboardPanVerificationByDigitap(payload);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  loanApproval = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const loanID = req.body.loanID;
      const { customerID } = req.customer;
      const { data, message, statusCode } =
        await this.onboardingService.loanApprovalService({
          loanID,
          customerID,
        });
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  bankVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.customer || !req.customer.customerID) {
        throw new BadRequestError("Customer information not found");
      }

      // if (!req.body.accountNo) {
      //   throw new BadRequestError("Account Number is required");
      // }

      const customerId = req.customer.customerID;

      const getAccountInfo = await razorpayMandateModel.findOne({
        where: {
          customerID: req.customer.customerID,
          status: "paid",
        },
      });

      if (!getAccountInfo) {
        throw new BadRequestError("Account Number is required");
      }
      console.log(
        "==================================>getAccountInfo",
        getAccountInfo,
      );
      const accountNo = getAccountInfo.accountNo;
      const ifsc = getAccountInfo.ifsc;
      const leadID = getAccountInfo.leadID;

      // const { loan_id: leadID, accountNo, ifsc } = req.body;

      let digitapBankVerificationResponse =
        await this.digitapNewService.bankVerification(
          accountNo,
          ifsc,
          leadID,
          customerId.toString(),
          req.customer.mobile.toString(),
        );

      if (!digitapBankVerificationResponse) {
        throw new BadRequestError("No response from bank verification service");
      }
      console.log(
        "digitapBankVerificationResponse================>",
        digitapBankVerificationResponse,
      );

      // Handle PENDING status by checking status
      if (digitapBankVerificationResponse?.data?.status === "PENDING") {
        const transactionId =
          digitapBankVerificationResponse.data.transactionId;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

          const statusResponse =
            await this.digitapNewService.checkPennyDropStatus(
              transactionId,
              customerId.toString(),
              leadID,
            );

          if (statusResponse?.data?.status === "SUCCESS") {
            digitapBankVerificationResponse = statusResponse;
            break;
          } else if (statusResponse?.data?.status === "FAILED") {
            digitapBankVerificationResponse = statusResponse;
            break;
          }

          retryCount++;
        }
      }

      if (
        digitapBankVerificationResponse?.success !== true ||
        digitapBankVerificationResponse?.status_code !== 200
      ) {
        throw new BadRequestError(
          `Bank verification failed`,
          digitapBankVerificationResponse,
        );
      }

      // Handle different response statuses
      if (digitapBankVerificationResponse?.data?.status === "FAILED") {
        throw new BadRequestError(
          `Bank verification failed: ${
            digitapBankVerificationResponse.data.desc || "Unknown error"
          }`,
          digitapBankVerificationResponse,
        );
      }
      // let digitapBankVerificationResponse = {
      //   data: {
      //     status: "SUCCESS",
      //     desc: "Bank verification successful",
      //     beneficiaryName: "Rajesh Ranjan",
      //     clientRefNum: "jsakjshdkjsha",
      //     transactionId: "123456",
      //   },
      // };
      const responseData = digitapBankVerificationResponse.data;
      let [leadApiLogsResponse, getCustomeInfo, getExistingPennyData] =
        await Promise.all([
          this.leadApiLogService.findOne(
            {
              customerID: customerId,
              api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
              api_supplier: ApiSupplierType.DIGITAP,
            },
            ["*"],
            [{ column: "id", order: "desc" }],
          ),
          this.customerService.findOne({ customerID: customerId }),
          pennyDropModel.findOne({
            where: {
              customerID: customerId.toString(),
              account_status: "active",
              penny_status: PennyStatus.COMPLETED,
            },
            order: [{ column: "id", order: "desc" }],
          }),
        ]);

      if (!leadApiLogsResponse) {
        leadApiLogsResponse = await this.leadApiLogService.findOne(
          {
            customerID: customerId,
            api_type: LeadLogApiType.PAN_COMPREHENSIVE,
            api_supplier: ApiSupplierType.SUREPASS,
          },
          ["*"],
          [{ column: "id", order: "desc" }],
        );
      }

      if (!leadApiLogsResponse || !leadApiLogsResponse.api_response) {
        throw new BadRequestError(
          "PAN details not found. Please complete PAN verification first.",
        );
      }

      let customerName: string;

      try {
        const response = JSON.parse(leadApiLogsResponse.api_response);

        if (response.result && response.result.fullname) {
          customerName = response.result.fullname;
        } else if (response.data && response.data.full_name) {
          customerName = response.data.full_name;
        } else {
          throw new Error(
            "Invalid PAN response structure - neither Digitap nor Surepass format found",
          );
        }
      } catch (error) {
        console.error("Error parsing PAN response:", error);
        throw new BadRequestError(
          "Invalid PAN data found. Please re-verify your PAN.",
        );
      }
      let penny_drop_name = responseData.beneficiaryName;
      // penny_drop_name = "Rajesh Ranjan";
      const [getPennyNameMatch, getPennyNameMatchWithAadhaar] =
        await Promise.all([
          getNameMatchPercentage(customerName, penny_drop_name),
          getNameMatchPercentage(getCustomeInfo.aadhaarName, penny_drop_name),
        ]);
      const isPanNameMatch = getPennyNameMatch >= 70;
      const isAadhaarNameMatch = getPennyNameMatchWithAadhaar >= 70;
      const isOverallMatch = isPanNameMatch || isAadhaarNameMatch;
      const pennyNameMismatch = isOverallMatch
        ? PennyDropNameMatchStatus.ACCEPTED
        : PennyDropNameMatchStatus.NAME_MISMATCH;
      const nameMatchStatus = isOverallMatch
        ? NameSimilarityStatus.ACCEPT
        : NameSimilarityStatus.REJECT;

      const basePennyDropData = {
        penny_status: PennyStatus.COMPLETED,
        penny_drop_name_match: pennyNameMismatch,
      };
      if (getExistingPennyData) {
        await pennyDropModel.findOneAndUpdate(
          { id: getExistingPennyData.id },
          basePennyDropData,
        );
      } else {
        await pennyDropModel.insert({
          ...basePennyDropData,
          account_number: accountNo,
          // bank_name: responseData.ifsc_details.bank_name,
          bank_name: getAccountInfo.bank || "NA",
          customerID: customerId.toString(),
          ifsc: ifsc,
          leadID: leadID,
          logs: JSON.stringify(
            isOverallMatch
              ? responseData
              : {
                  panMatch: getPennyNameMatch,
                  aadhaarMatch: getPennyNameMatchWithAadhaar,
                },
          ),
          name: penny_drop_name,
          p_id: responseData.clientRefNum || responseData.transactionId,
          uid: isOverallMatch ? "1" : "1",
          account_status:
            responseData.status === "SUCCESS" ? "active" : "inactive",
          registered_name: penny_drop_name,
        });
      }
      if (!isOverallMatch) {
        throw new BadRequestError(
          "Account holder name doesn't match with PAN or Aadhaar.",
        );
      }
      const percentageDataPan = {
        errorCode: 0,
        errorMsg: "Successfully",
        firstName: customerName,
        secondName: penny_drop_name,
        percentageConditionCheck: nameCheckPercentage,
        percentageResult: getPennyNameMatch,
        status: nameMatchStatus,
      };
      const percentageDataAadhaar = {
        errorCode: 0,
        errorMsg: "Successfully",
        firstName: getCustomeInfo.aadhaarName,
        secondName: penny_drop_name,
        percentageConditionCheck: nameCheckPercentage,
        percentageResult: getPennyNameMatchWithAadhaar,
        status: nameMatchStatus,
      };

      const nameMatchRecords = [
        // PAN name match record
        {
          lead_id: Number(leadID),
          customer_id: customerId,
          mobile_no: getCustomeInfo.mobile.toString(),
          type: NameMatchType.BANK_VERIFY_NAME_PAN,
          first_name: customerName,
          second_name: penny_drop_name,
          percentage: getPennyNameMatch.toString(),
          percentage_data: JSON.stringify(percentageDataPan),
          status: isPanNameMatch ? 1 : 0,
        },
        // Aadhaar name match record
        {
          lead_id: Number(leadID),
          customer_id: customerId,
          mobile_no: getCustomeInfo.mobile.toString(),
          type: NameMatchType.BANK_VERIFY_NAME_AADHAAR,
          first_name: getCustomeInfo.aadhaarName,
          second_name: penny_drop_name,
          percentage: getPennyNameMatchWithAadhaar.toString(),
          percentage_data: JSON.stringify(percentageDataAadhaar),
          status: isAadhaarNameMatch ? 1 : 0,
        },
      ];
      await Promise.all([
        // Create PAN name match record
        customerNameMatchservice.create(nameMatchRecords[0]),
        // Create Aadhaar name match record
        customerNameMatchservice.create(nameMatchRecords[1]),
        // Update account status
        this.customerAccountService.updateOne(
          { customerID: customerId, accountNo },
          { status: "Verified" },
        ),
      ]);
      return this.sendResponse(res, 200, digitapBankVerificationResponse.data);
    } catch (error) {
      logger.error("Bank verification error:", {
        customerId: req.customer?.customerID,
        leadId: req.body?.loan_id,
        error: error.message,
        stack: error.stack,
      });

      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error.status === 400
      ) {
        return next(error);
      }

      return next(
        new BadRequestError(
          "An error occurred during Bank verification. Please try again",
        ),
      );
    }
  };

  digitalEsign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.customer || !req.customer.customerID) {
        throw new BadRequestError("Customer information not found");
      }
      const customerID = req.customer.customerID;
      const { callback_url } = req.body;

      const digitapEsignResponse = await digitapEsignInitialize({
        customerID,
        callback_url,
      });
      if (digitapEsignResponse.status_code) {
        return this.sendResponse(
          res,
          200,
          digitapEsignResponse.data,
          digitapEsignResponse.message,
        );
      } else {
        return this.sendResponse(
          res,
          400,
          digitapEsignResponse.data,
          digitapEsignResponse.message,
        );
      }
    } catch (error) {
      next(error);
    }
  };

  digitalEsignReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.customer || !req.customer.customerID) {
      throw new BadRequestError("Customer information not found");
    }
    const customerID = req.customer.customerID;
    const { client_id } = req.body;

    console.log(
      `[DigitalEsignReport] Processing report for customerID: ${customerID}`,
    );

    let actualClientId = client_id;
    if (client_id && client_id.includes("?")) {
      actualClientId = client_id.split("?")[0];
    }
    if (client_id && client_id.includes("&")) {
      actualClientId = client_id.split("&")[0];
    }
    const uuidRegex =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const uuidMatch = actualClientId.match(uuidRegex);
    if (uuidMatch) {
      actualClientId = uuidMatch[0];
    }

    try {
      const getCustomeInfo = await this.customerService.findOne({ customerID });
      if (!getCustomeInfo) {
        return this.sendResponse(
          res,
          400,
          null,
          "No customer information found",
        );
      }

      const digitapESignStatusResponse = await getDigitapEsignStatus(
        actualClientId,
      );
      if (!digitapESignStatusResponse.success) {
        return this.sendResponse(
          res,
          400,
          null,
          digitapESignStatusResponse.message,
        );
      }
      const { data: statusData } = digitapESignStatusResponse;
      if (actualClientId !== statusData?.client_id) {
        return this.sendResponse(
          res,
          400,
          null,
          "Something went wrong | ClientId mismatched",
        );
      }
      const digitapESignReportResponse = await getDigitapEsignReport(
        statusData.client_id,
      );

      if (!digitapESignReportResponse.success) {
        return this.sendResponse(
          res,
          400,
          null,
          digitapESignReportResponse.message,
        );
      }
      const { data: reportData } = digitapESignReportResponse;
      const aaadhar_last_four_digits =
        reportData?.name_match?.aaadhar_last_four_digits;
      const year_of_birth = reportData?.name_match?.year_of_birth;
      const gender = reportData?.name_match?.gender;
      const name = reportData?.name_match?.name?.toLowerCase();

      const getLeadApiLogInfo = await this.leadApiLogService.findOne(
        {
          customerID,
          api_type: "surepass_digilocker_eaadhaar",
        },
        ["*"],
        [{ column: "id", order: "desc" }],
      );
      if (!getLeadApiLogInfo) {
        return this.sendResponse(
          res,
          400,
          null,
          "No Aadhaar information found",
        );
      }

      const leadApiLogResponse = JSON.parse(getLeadApiLogInfo?.api_response);
      const leadApiLogName = leadApiLogResponse?.UidData?.Poi?.["$"]?.name;
      const leadApiLogDob = leadApiLogResponse?.UidData?.Poi?.["$"]?.dob;
      const leadApiLogGender = leadApiLogResponse?.UidData?.Poi?.["$"]?.gender;

      // const extractedLastFourDigits = aaadhar_last_four_digits?.slice(-4) || "";
      // const extractAdhaarDigit = aaadhar_last_four_digits?.slice(-4) || aaadhar_last_four_digits?.slice(-2);
      const inputDigits = aaadhar_last_four_digits?.replace(/\D/g, "") || "";
      const storedDigits = getCustomeInfo.aadharNo?.replace(/\D/g, "") || "";

      if (
        storedDigits.slice(-4) !== inputDigits.slice(-4) &&
        storedDigits.slice(-2) !== inputDigits.slice(-2)
      ) {
        const extractedLastFourDigits =
          inputDigits.slice(-4) || inputDigits.slice(-2) || "";
        console.log(
          `[DigitalEsignReport] FRAUD DETECTION: Aadhaar mismatch - Expected: ${getCustomeInfo.aadharNo}, Got: ${extractedLastFourDigits}`,
        );

        await this.apiReqResLogService.create({
          api_name: "/user/digital-esign/report",
          api_request: JSON.stringify({ client_id }),
          api_response: JSON.stringify({
            success: false,
            statusCode: 400,
            message: "Fraud Detetion | Aadhaar No Mismatched",
            data: null,
          }),
          customerID: customerID.toString(),
          mobile: getCustomeInfo.mobile?.toString(),
          status: "0",
          message: "Fraud Detetion | Aadhaar No Mismatched",
        });

        return this.sendResponse(
          res,
          400,
          null,
          "Fraud Detetion | Aadhaar No Mismatched",
        );
      }

      if (leadApiLogGender?.slice(0, 1) !== gender) {
        console.log(
          `[DigitalEsignReport] FRAUD DETECTION: Gender mismatch - Expected: ${leadApiLogGender?.slice(
            0,
            1,
          )}, Got: ${gender}`,
        );

        await this.apiReqResLogService.create({
          api_name: "/user/digital-esign/report",
          api_request: JSON.stringify({ client_id }),
          api_response: JSON.stringify({
            success: false,
            statusCode: 400,
            message: "Fraud Detetion | Gender Mismatched",
            data: null,
          }),
          customerID: customerID.toString(),
          mobile: getCustomeInfo.mobile?.toString(),
          status: "0",
          message: "Fraud Detetion | Gender Mismatched",
        });

        return this.sendResponse(
          res,
          400,
          null,
          "Fraud Detetion | Gender Mismatched",
        );
      }

      const dobYear = leadApiLogDob?.split("-")?.[2];

      if (dobYear !== year_of_birth) {
        console.log(
          `[DigitalEsignReport] FRAUD DETECTION: DOB year mismatch - Expected: ${dobYear}, Got: ${year_of_birth}`,
        );
        return this.sendResponse(
          res,
          400,
          null,
          "Fraud Detetion | DOB Year Mismatched",
        );
      }
      const getNameMatchPercentageResponse = await getNameMatchPercentage(
        leadApiLogName,
        name,
      );
      if (getNameMatchPercentageResponse < 80) {
        return this.sendResponse(
          res,
          400,
          null,
          "Fraud Detetion | Name Mismatched",
        );
      }

      const digitapESignDocumentResponse = await getDigitapESignedDoc(
        statusData.client_id,
        customerID,
      );
      if (!digitapESignDocumentResponse.success) {
        return this.sendResponse(
          res,
          400,
          null,
          digitapESignDocumentResponse.message,
        );
      }
      const { data: docData } = digitapESignDocumentResponse;
      const documentUrl = docData.url;
      const getSignedDoc = await s3Service.uploadFromSignedUrl(
        documentUrl,
        `documents/aggrement/signed/${customerID}`,
        `agreement_signed_${Date.now()}.pdf`,
        false,
      );
      const esinedDocKey = getSignedDoc.Key;

      const lead = await this.leadService.findOne(
        { customerID },
        ["leadID"],
        [{ column: "leadID", order: "desc" }],
      );

      const leadID = lead?.leadID;
      await documentModel.insert({
        customerID,
        type: "Agreement",
        documentType: "Agreement Letter",
        documentFile: esinedDocKey,
        leadID,
        status: "Verified",
        uploadBy: customerID,
        uploadedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        verifiedBy: 1,
        verifiedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        upload_platform: "S3",
      });

      const digitapESignAuditTrailResponse = await getDigitapESignedAuditTrail(
        statusData.client_id,
        customerID,
      );
      if (!digitapESignAuditTrailResponse.success) {
        return this.sendResponse(
          res,
          400,
          null,
          digitapESignAuditTrailResponse.message,
        );
      }
      const { data: auditTrailData } = digitapESignAuditTrailResponse;
      const auditTrailDocumentUrl = auditTrailData.url;
      const esignedAuditTrailDoc = await s3Service.uploadFromSignedUrl(
        auditTrailDocumentUrl,
        `documents/aggrement/audit/${customerID}`,
        `audit_doc_${Date.now()}.pdf`,
        false,
      );
      const esignedAuditTrailDocKey = esignedAuditTrailDoc.Key;
      await documentModel.insert({
        customerID,
        type: "E_Signed_Audit_Trail",
        documentType: "pdf",
        documentFile: esignedAuditTrailDocKey,
        status: "Verified",
        uploadBy: customerID,
        uploadedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        verifiedBy: 1,
        verifiedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        upload_platform: "S3",
      });
      return this.sendResponse(
        res,
        200,
        null,
        "ESigned URL Report Successfully generated",
      );
    } catch (error) {
      next(error);
    }
  };

  dashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.customer || !req.customer.customerID) {
        throw new BadRequestError("Customer information not found");
      }
      const { customerID } = req.customer;
      const name2 = req.body.name2;
      const responseres = await calculate_repay_amount_ipc(
        customerID.toString(),
        name2,
      );
      // const response = {
      //   percentage: responseres,
      // };
      return this.sendResponse(res, 200, responseres);
    } catch (error) {
      next(error);
    }
  };

  confirmBankDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.customer || !req.customer.customerID) {
        throw new BadRequestError("Customer information not found");
      }

      const {
        account_holders_name,
        account_no,
        ifsc,
        bank_name,
        loan_id,
        confirmed_account_no,
        account_status,
      } = req.validatedBody as ISaveBankAccountPayload;

      const payload: ISaveBankAccountPayload = {
        account_holders_name,
        account_no,
        ifsc,
        bank_name,
        loan_id,
        confirmed_account_no,
        account_status,
      };

      const clientIp = this.commonHelper.getClientIp(req);
      const { data, message, statusCode } =
        await this.customerBankAccountService.saveBankAccount(
          payload,
          req.customer.customerID,
          req.customer.mobile,
          req.customer.pancard,
          req.customer.aadharNo,
          clientIp,
          account_status,
        );

      const getEmandateStatusResponse = await razorpayMandateModel.findOne({
        where: {
          customerID: req.customer.customerID,
          accountNo: account_no,
          // leadID: loan_id.toString(),
        },
        whereIn: [{ column: "status", value: ["paid", "issued"] }],
        select: ["res_response"],
        order: [{ column: "id", order: "desc" }],
      });

      let isEmandateRequired = false;
      if (!getEmandateStatusResponse?.res_response) {
        isEmandateRequired = true;
      } else {
        const rMandate = JSON.parse(getEmandateStatusResponse.res_response);
        const rMandateExpire = rMandate?.token?.expire_at;

        const expireMoment = rMandateExpire
          ? moment.unix(rMandateExpire)
          : null;

        const threshold = moment().subtract(90, "days");

        if (!expireMoment || expireMoment.isSameOrBefore(threshold)) {
          isEmandateRequired = true;
        }
      }

      if (!isEmandateRequired) {
        await createStepTrackerEntry(
          req.customer.customerID,
          loan_id,
          0,
          StepName.EMANDATE,
          "Repeat",
        );
        await createStepTrackerEntry(
          req.customer.customerID,
          loan_id,
          0,
          StepName.PENNY_DROP,
          "Repeat",
        );
      }
      const responseData = {
        ...data,
        isEmandateRequired,
      };

      return this.sendResponse(res, statusCode, responseData, message);
    } catch (error) {
      next(error);
    }
  };

  reprocessRejectedCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const { data, message, statusCode } =
        await this.onboardingService.reprocessRejectedCustomers(limit);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };
}

export default CustomerOnboardingController;
