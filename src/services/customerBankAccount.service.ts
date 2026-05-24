import config from "@/config/default";
import BankIfscModel from "@/database/mysql/bankIfsc";
import BankListModel from "@/database/mysql/bankList";
import CustomerAccountModel from "@/database/mysql/customerAccount";
import LeadModel from "@/database/mysql/leads";
import LeadApiLogModel from "@/database/mysql/lead_api_log";
import RazorpayMandateModel from "@/database/mysql/razorpay_mandate";
import StepTrackerModel from "@/database/mysql/step_tracker";
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
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { Products } from "@/enums/product.enum";
import { RazorPayMandateVerification } from "@/enums/razorpay.enum";
import { BadRequestError, NotFoundError } from "@/errors";
import CommonHelper from "@/helpers/common";
import {
  IBankNameMatch,
  IConfirmBankAccountPayload,
  IGetCustomerBankAccountsPayload,
  ISaveBankAccountPayload,
} from "@/interfaces/customerBankAccount.interface";
import { IDecentroEaadharResponse } from "@/interfaces/onboarding.interface";
import { IServiceResponse } from "@/interfaces/service.interface";
import { logger } from "@/utils/logger";
import { getNameMatchPercentage } from "@/utils/surePass.utils";
import { maskString } from "@/utils/util";
import { HttpStatusCode } from "axios";
import { singleton } from "tsyringe";
import { customerService } from "./customer.service";
import { customerNameMatchservice } from "./customerNameMatch.service";
import LeadApiLogService from "./lead_api_log.service";
import { OnboardingService } from "./onboarding.service";
import ResponseService from "./response.service";
import FinboxService from "./thirdParty/finbox.service";

@singleton()
export class CustomerBankAccountService extends ResponseService {
  constructor(
    private readonly customerAccountModel: CustomerAccountModel,
    private readonly onboardingService: OnboardingService,
    private readonly bankListModel: BankListModel,
    private readonly leadModel: LeadModel,
    private readonly stepTrackerModel: StepTrackerModel,
    private readonly razorpayMandateModel: RazorpayMandateModel,
    private readonly leadApiLogService: LeadApiLogService,
    private readonly finboxService: FinboxService,
    private readonly commonHelper: CommonHelper,
    private readonly bankIfscModel: BankIfscModel,
    private readonly leadsApiLogModel: LeadApiLogModel,
    private readonly findBoxService: FinboxService,
  ) {
    super();
  }

  getBankAccountsList = async (
    payload: IGetCustomerBankAccountsPayload,
  ): Promise<IServiceResponse> => {
    const { leadID, customerID, emandateRequired } = payload;

    const accounts = await this.customerAccountModel.find({
      where: { customerID },
      order: [{ column: "accountID", order: "desc" }],
      select: ["accountNo", "bank", "bankIfsc", "accountID"],
    });

    if (!accounts[0]) {
      logger.warn(`No accounts found for customer with id: ${customerID}`);
      throw new NotFoundError(
        "Their are no bank accounts associated with this customer",
        { data: [] },
      );
    }

    let accountDetails = await Promise.all(
      accounts.map(async (account) => {
        let verificationStatus = await this.onboardingService.verifyEmandate(
          String(customerID),
          leadID,
          account,
          emandateRequired,
        );

        const bankLogo = await this.bankListModel.getBankLogoAndIcon(
          account.bank,
        );

        return {
          ...verificationStatus,
          ...bankLogo,
          ...account,
        };
      }),
    );

    if (accountDetails.length > 0) {
      accountDetails = accountDetails.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (obj) =>
              obj.accountNo === value.accountNo &&
              obj.bankIfsc === value.bankIfsc,
          ),
      );

      accountDetails = await Promise.all(
        accountDetails.map(async (account) => {
          const bankDets = await this.bankIfscModel.BankIfscKnex.select(
            "is_active",
          )
            .where("IFSC", "like", `${account.bankIfsc.substring(0, 4)}%`)
            .first();

          account.accountNo = maskString(
            account.accountNo,
            account.accountNo.length - 4,
          );

          account.bankIfsc = maskString(
            account.bankIfsc,
            account.bankIfsc.length - 4,
          );

          // Check if account should be kept
          if (bankDets && bankDets.is_active === "1") {
            return account; // Keep this account
          } else if (!bankDets) {
            return account; // Keep this account if bankDets is not found
          }

          return null; // Filter out account if is_active is not '1'
        }),
      );

      accountDetails = accountDetails.filter((account) => account !== null);
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      accountDetails,
      "Accounts fetched",
    );
  };

  confirmBankAccount = async (payload: IConfirmBankAccountPayload) => {
    const {
      customerID,
      loan_id,
      mandate_id,
      emandateRequired,
      account_id: accountID,
    } = payload;
    // Check if this mandate_account is eligible for selection

    const verificationStatus = await this.onboardingService.verifyEmandateById(
      String(customerID),
      loan_id,
      mandate_id,
      emandateRequired,
      accountID,
    );

    if (verificationStatus.status === RazorPayMandateVerification.NOT_VERIFIED)
      throw new BadRequestError(
        "Your account is not verified, Please proceed to verify your bank details",
        {
          data: {
            ...verificationStatus,
          },
        },
      );

    if (verificationStatus.status === RazorPayMandateVerification.REJECTED)
      throw new BadRequestError(
        "Your Bank account is rejected, Please contact customer care",
      );

    await this.leadModel.findOneAndUpdate(
      { customerID, leadID: loan_id },
      { em_id: mandate_id },
    );

    // Save step
    await this.stepTrackerModel.completeStep(
      customerID,
      StepName.BANK_ACCOUNT_CONFIRMATION,
      Products.PAYDAY,
      loan_id,
    );

    return this.serviceResponse(HttpStatusCode.Ok, {}, "Saved");
  };

  // TODO: RAJESH need to replace the name match logic
  saveBankAccount = async (
    payload: ISaveBankAccountPayload,
    customerID: number,
    mobile: number,
    pancard: string,
    aadharNo: string,
    clientIp: string,
    account_status?: string,
  ): Promise<IServiceResponse> => {
    const {
      account_holders_name: accountHoldersName,
      account_no: accountNo,
      ifsc,
      bank_name: bankName,
      loan_id: leadID,
      confirmed_account_no: confirmedAccountNo,
    } = payload;

    // Check if lead exist
    const lead = await this.leadModel.findOne({
      where: { leadID, customerID },
    });

    if (!lead) throw new NotFoundError("Lead does not exist");

    // check if accountNo = confirmedAccountNo

    if (accountNo !== confirmedAccountNo)
      throw new BadRequestError(
        "Account number does not match the confirmed account number",
      );

    // check if account already exists
    const bankAccount = await this.customerAccountModel.findOne({
      where: { accountNo },
    });

    if (
      bankAccount?.accountNo === accountNo &&
      bankAccount?.status === "Verified" &&
      bankAccount?.customerID !== customerID
    ) {
      throw new BadRequestError(
        "This account belongs to another user, Please enter different bank details",
      );
    }

    const rpayMandate = await this.razorpayMandateModel.findOne({
      where: (query) => {
        query.where("customerID", customerID);
        query.where("accountNo", accountNo);
        query.where((qr) => {
          qr.where("name_missmatch_reject", "1");
          qr.orWhere("need_another_mandate", "1");
        });
      },
      select: ["id", "need_another_mandate", "name_missmatch_reject"],
    });

    if (rpayMandate && rpayMandate?.name_missmatch_reject === "1") {
      throw new BadRequestError(
        "Bank name doesn't match with KYC records, please update bank name.",
      );
    } else if (rpayMandate && rpayMandate?.need_another_mandate === "1") {
      throw new BadRequestError(
        "Kindly use a different bank account for e-mandate process.",
      );
    }
    let [leadApiLogsResponse, customerInfo] = await Promise.all([
      this.leadApiLogService.findOne(
        {
          customerID,
          api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
          api_supplier: ApiSupplierType.DIGITAP,
        },
        ["*"],
        [{ column: "id", order: "desc" }],
      ),

      customerService.findOne({ customerID }),
    ]);

    if (!leadApiLogsResponse) {
      leadApiLogsResponse = await this.leadApiLogService.findOne(
        {
          customerID,
          api_type: LeadLogApiType.PAN_COMPREHENSIVE,
          api_supplier: ApiSupplierType.SUREPASS,
        },
        ["*"],
        [{ column: "id", order: "desc" }],
      );
    }

    // Parse digitap response format
    if (!leadApiLogsResponse || !leadApiLogsResponse.api_response) {
      throw new BadRequestError(
        "PAN details not found. Please complete PAN verification first.",
      );
    }

    let customerPanName: string;

    try {
      const response = JSON.parse(leadApiLogsResponse.api_response);

      if (response.result && response.result.fullname) {
        customerPanName = response.result.fullname;
      } else if (response.data && response.data.full_name) {
        customerPanName = response.data.full_name;
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
    const customerAadhaarName = customerInfo.aadhaarName;

    const [panNameMatch, aadhaarNameMatch] = await Promise.all([
      getNameMatchPercentage(accountHoldersName, customerPanName),
      getNameMatchPercentage(accountHoldersName, customerAadhaarName),
    ]);

    const isPanNameMatch = panNameMatch >= 70;
    const isAadhaarNameMatch = aadhaarNameMatch >= 70;
    const isOverallMatch = isPanNameMatch || isAadhaarNameMatch;

    const panPercentageData = {
      errorCode: 0,
      errorMsg: "Successfully",
      firstName: accountHoldersName,
      secondName: customerPanName,
      percentageConditionCheck: nameCheckPercentage,
      percentageResult: panNameMatch,
      status: isPanNameMatch
        ? NameSimilarityStatus.ACCEPT
        : NameSimilarityStatus.REJECT,
    };

    const aadhaarPercentageData = {
      errorCode: 0,
      errorMsg: "Successfully",
      firstName: accountHoldersName,
      secondName: customerAadhaarName,
      percentageConditionCheck: nameCheckPercentage,
      percentageResult: aadhaarNameMatch,
      status: isAadhaarNameMatch
        ? NameSimilarityStatus.ACCEPT
        : NameSimilarityStatus.REJECT,
    };

    const nameMatchRecords = [
      // PAN name match record
      {
        lead_id: leadID,
        customer_id: customerID,
        mobile_no: mobile.toString(),
        type: NameMatchType.SAVE_BANK_NAME_PAN,
        first_name: accountHoldersName,
        second_name: customerPanName,
        percentage: panNameMatch.toString(),
        percentage_data: JSON.stringify(panPercentageData),
        status: isPanNameMatch ? 1 : 0,
      },
      // Aadhaar name match record
      {
        lead_id: leadID,
        customer_id: customerID,
        mobile_no: mobile.toString(),
        type: NameMatchType.SAVE_BANK_NAME_AADHAAR,
        first_name: accountHoldersName,
        second_name: customerAadhaarName,
        percentage: aadhaarNameMatch.toString(),
        percentage_data: JSON.stringify(aadhaarPercentageData),
        status: isAadhaarNameMatch ? 1 : 0,
      },
    ];
    await Promise.all([
      customerNameMatchservice.create(nameMatchRecords[0]),
      customerNameMatchservice.create(nameMatchRecords[1]),
    ]);
    if (!isOverallMatch) {
      throw new BadRequestError(
        "Bank name doesn't match with PAN or Aadhaar records, please update bank name.",
      );
    }

    // All checks made, now save details
    const [accountId] = await this.customerAccountModel.insert({
      accountNo,
      accountType: BankAccountType.SAVING,
      bankIfsc: ifsc,
      bank: bankName,
      bankBranch: "N/A",
      ip: clientIp,
      credatedBy: +config.defaultUserId,
      bank_holder_name: accountHoldersName,
      customerID,
      leadID,
      status: account_status as BankAccountStatus,
    });

    // await this.stepTrackerModel.completeStep(
    //   customerID,
    //   StepName.BANK_DETAILS,
    //   Products.PAYDAY,
    //   leadID
    // );

    return this.serviceResponse(
      HttpStatusCode.Ok,
      { accountId },
      "Bank account saved successfuly",
    );
  };

  bankNameMatch = async (payload: IBankNameMatch): Promise<boolean> => {
    const {
      pancard,
      accountHoldersName: name,
      mobile,
      customerID,
      leadID,
    } = payload;
    let isNameMatched = false;
    // Start name match flow, Prefer PAN
    let { aadharNo } = payload;
    const panDetails = pancard
      ? await this.leadApiLogService.findPanComprehensiveResponseDigitap(
          pancard,
          mobile,
        )
      : null;
    // If pan details exist , start pan name match flow
    if (panDetails && panDetails?.full_name) {
      const nameMatch = await this.finboxService.checkNamePercentage({
        customerID,
        leadId: leadID,
        customerMobileNo: mobile,
        secondName: panDetails.full_name,
        firstName: name,
        type: NameMatchType.BANK_NAME_PAN,
      });
      if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
        isNameMatched = true;
      }
    }
    // Now check if nameMatch is false only then do this logic
    // Check if Aadhar is of surepass or digilocker
    // We can do this by checking
    if (!isNameMatched) {
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
                ? (aadharData?.data?.full_name ?? "")
                : (aadharData?.data?.proofOfIdentity?.name ?? ""),
            firstName: name,
            type: NameMatchType.BANK_NAME_AADHAR,
          });
          if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
            isNameMatched = true;
          }
          return isNameMatched;
        } else {
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
            const nameMatch = await this.finboxService.checkNamePercentage({
              customerID,
              leadId: leadID,
              customerMobileNo: mobile,
              secondName: digilocker.proofOfIdentity.name ?? "",
              firstName: name,
              type: NameMatchType.BANK_NAME_AADHAR,
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
          const nameMatch = await this.finboxService.checkNamePercentage({
            customerID,
            leadId: leadID,
            customerMobileNo: mobile,
            secondName: digilocker.proofOfIdentity.name ?? "",
            firstName: name,
            type: NameMatchType.BANK_NAME_AADHAR,
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
}
