import config from "@/config/default";
import { approvalModel } from "@/database/mysql/approval";
import { bankIfscModel } from "@/database/mysql/bankIfsc";
import { callHistoryLogsModel } from "@/database/mysql/callhistorylogs";
import { leadsApiLogModel } from "@/database/mysql/lead_api_log";
import { NotificationUrl } from "@/enums/common.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { ProductID } from "@/enums/product.enum";
import { BadRequestError, NotFoundError } from "@/errors";
import CommonHelper from "@/helpers/common";
import { checkRepaymentAmount } from "@/helpers/repaymentCalculator";
import {
  IApiResponseSms,
  IDisbursalStatusResponse,
  IGetBankDetailsPayload,
  IivrMenuOnePayload,
  IivrMenuTwoPayload,
  ILeadStatus,
  ILoanVerification,
} from "@/interfaces/common.interface";
import { ILoan } from "@/interfaces/loan.interface";
import {
  IEmailSendData,
  IMailTemplate,
} from "@/interfaces/mail_template.interface";
import { emiModel } from "@/mysql/emi";
import { ivrModel } from "@/mysql/ivr_api_attempt";
import EmiCollectionService from "@/services/emiCollection.service";
import {
  calculateTotalRepayPaydayAmountIPC,
  calculateTotalRepayPaydayAmountNonIPC,
} from "@/utils/Ipc_Calculation";
import { HttpStatusCode } from "axios";
import { differenceInCalendarDays } from "date-fns";
import moment from "moment";
import AxiosService from "./api.service";
import ApprovalService from "./approval.service";
import CollectionService from "./collection.service";
import CustomerService from "./customer.service";
import CustomerAppService from "./customerApp.service";
import LeadService from "./lead.service";
import LoanService from "./loan.service";
import MailTemplateService from "./mail_template.service";
import NotificationService from "./notification.service";
import RazorpayEMOrderService from "./razorpay_emOrder.service";
import RazorpayMendateService from "./razorpay_mandate.service";
import ResponseService from "./response.service";

class CommonService extends ResponseService {
  private readonly customerService = new CustomerService();
  private readonly customerAppService = new CustomerAppService();
  private readonly leadService = new LeadService();
  private readonly loanService = new LoanService();
  private readonly mailTemplateService = new MailTemplateService();
  private readonly notificationService = new NotificationService();
  private readonly approvalService = new ApprovalService();
  private readonly collectionService = new CollectionService();
  private readonly razorPayMandateService = new RazorpayMendateService();
  private readonly razorpayEMOrderService = new RazorpayEMOrderService();
  private readonly bankIfscModel = bankIfscModel;
  private readonly leadsApiLogModel = leadsApiLogModel;
  private readonly callHistoryLogsModel = callHistoryLogsModel;
  private readonly ivrModel = ivrModel;
  private readonly commonHelper = new CommonHelper();
  private readonly apiService = new AxiosService(
    this.commonHelper.getBaseUrl(),
  );
  private readonly emiModel = emiModel;
  private readonly emiCollection = new EmiCollectionService();

  constructor() {
    super();
  }

  // New code
  async ivrMenuOne(payload: IivrMenuOnePayload) {
    const { mobile } = payload;
    const Mobile = Number(mobile);

    let customer = await this.customerService.findOne({ mobile: Mobile }, [
      "customerID",
    ]);

    if (!customer) {
      let customerApp = await this.customerAppService.findOne({ mobile }, [
        "customerID",
      ]);
      if (customerApp) {
        return this.serviceResponse(
          200,
          { status: "Incomplete", mobile, loanNumber: null },
          "Loan Application Status",
        );
      } else {
        return this.serviceResponse(
          200,
          { status: "Customer Not Found", mobile, loanNumber: null },
          "Loan Application Status",
        );
      }
    }
    let lead = await this.leadService.findOne(
      { customerID: customer.customerID },
      ["leadID", "customerID", "status"],
      [{ column: "leadID", order: "desc" }],
    );
    if (!lead) {
      return this.serviceResponse(
        200,
        {
          status: "No Loan Found",
          mobile,
          loanNumber: null,
        },
        "Loan Application Status",
      );
    }
    let loan = await this.loanService.findOne({ leadID: lead.leadID }, [
      "loanNo",
    ]);
    return this.serviceResponse(
      200,
      {
        status: lead.status,
        mobile,
        loanNumber: loan && loan.loanNo ? loan.loanNo : null,
      },
      "Loan Application Status",
    );
  }

  // New code
  async ivrMenuTwo(payload: IivrMenuTwoPayload) {
    const { mobile, press } = payload;

    let situation = 0;
    const Mobile = Number(mobile);
    let customer = await this.customerService.findOne({ mobile: Mobile }, [
      "*",
    ]);

    if (customer) {
      situation = 3;
      //phone number exist but loan is not disbursed
    } else {
      throw new BadRequestError("Request not registered", {
        data: { status: "Customer not found" },
      });
    }

    let lead = await this.leadService.findOne(
      { customerID: customer.customerID },
      ["leadID", "customerID", "status"],
    );
    let loan: ILoan;
    if (lead) {
      let incompleteLoanStatus = [
        "Fresh Lead",
        "Document Received",
        "Approved Process",
        "Hold Process",
        "Approved",
        "Disbursal Sheet Send",
        "Disbursal Approved",
      ];
      let applicationNotFoundStatus = [
        "Rejected Process",
        "Not Required",
        "Not Required Process",
        "Rejected",
      ];
      if (lead.status == "Closed") {
        situation = 2;
      } else if (lead.status == "Disbursed" || lead.status == "Part Payment") {
        situation = 1;
      } else if (incompleteLoanStatus.includes(lead.status)) {
        situation = 3;
      } else if (applicationNotFoundStatus.includes(lead.status)) {
        situation = 4;
      }
      loan = await this.loanService.findOne({ leadID: lead.leadID }, [
        "loanNo",
      ]);
    }
    let customerName = `${customer.firstName} ${customer.lastName}`;
    let appLink = config.appLink;
    let repaymentLink = config.repaymentLink;
    let template: IMailTemplate;
    switch (press) {
      case 1:
        switch (situation) {
          case 1:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_payment_link_case1" },
              ["*"],
            );
            break;
          case 2:
            //loan closed
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_payment_link_case2" },
              ["*"],
            );
            break;
          case 3:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_payment_link_case3" },
              ["*"],
            );
            break;
          case 4:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_payment_link_case4" },
              ["*"],
            );
            break;
        }
        break;
      case 2:
        switch (situation) {
          case 1:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_noc_case1" },
              ["*"],
            );
            break;
          case 2:
            //loan closed
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_noc_case2" },
              ["*"],
            );
            let notification = await this.notificationService.findOne(
              {
                customerID: customer.customerID,
                leadID: lead.leadID,
                subject: "No Dues Certificate RuleMudra Corp",
              },
              ["notificationID"],
            );
            if (notification) {
              let nocLink = `${config.nocLink}?noti_id=${notification.notificationID}`;
              template.message = template.message.replace(
                "{noc_link}",
                nocLink,
              );
            } else {
              template.message = template.message.replace(
                "{noc_link}",
                appLink,
              );
            }
            break;
          case 3:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_noc_case3" },
              ["*"],
            );
            break;
          case 4:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_noc_case4" },
              ["*"],
            );
            break;
        }
        break;
      case 3:
        switch (situation) {
          case 1:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_CIBIL_update_case1" },
              ["*"],
            );
            break;
          case 2:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_CIBIL_update_case2" },
              ["*"],
            );
            break;
          case 3:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_CIBIL_update_case3" },
              ["*"],
            );
            break;
          case 4:
            template = await this.mailTemplateService.findOne(
              { name: "ivr_requested_CIBIL_update_case4" },
              ["*"],
            );
            break;
        }
        break;
    }
    template.message = template.message
      .replace("{customer_name}", `${customerName}`)
      .replace("{repayment_link}", repaymentLink)
      .replace("{app_link}", appLink);
    if (loan) {
      template.message = template.message.replace("{loan_no}", loan.loanNo);
    } else {
      template.message = template.message.replace("{loan_no}", "0");
    }

    const commonHelperClass = await import("../helpers/common");
    const commonHelper = new commonHelperClass.default();

    const data: IEmailSendData = {
      to: customer.email,
      body: `${template.message}`,
      from: config.mail_for_ses,
      subject: template.subject,
    };

    await commonHelper.sendMailSwitcher(data);

    // sendEmailViaBravo(
    //   [
    //     {
    //       email: customer.email,
    //       name: `${customer.firstName} ${customer.lastName}`,
    //     },
    //   ],
    //   template.subject,
    //   `${template.message}`,
    // )
    return this.serviceResponse(
      200,
      { status: "Customer Found" },
      "Request Registered",
    );
  }

  // New code
  async customerDetails(payload: any) {
    const { mobile } = payload;
    let details = {
      email: null,
      mobile: mobile,
      monthly_income: null,
      salary_mode: null,
      loan_status: null,
      approval_amount: null,
      loan_tenure: null,
      repayment_date: null,
      roi: null,
      loan_disbursement_amount: null,
      no_of_days: null,
      repayment_amount: null,
      e_mendate_charge_details: [],
      e_mendate_details_by_razorpay: [],
      collection_details: [],
    };
    let customer = await this.customerService.findOne({ mobile }, ["*"]);
    if (!customer) {
      let customerApp = await this.customerAppService.findOne({ mobile }, [
        "*",
      ]);
      if (customerApp) {
        customerApp.email ? (details.email = customerApp.email) : null;
        customerApp.monthlyIncome
          ? (details.monthly_income = customerApp.monthlyIncome)
          : null;
        customerApp.salaryMode
          ? (details.salary_mode = customerApp.salaryMode)
          : null;

        return this.serviceResponse(
          200,
          { details, mobile },
          "Customer Details",
        );
      } else {
        throw new NotFoundError("Customer details not found");
      }
    } else {
      let lead = await this.leadService.findOne(
        { customerID: customer.customerID },
        ["*"],
      );
      if (lead) {
        let approval = await this.approvalService.findOne(
          { leadID: lead.leadID },
          ["*"],
        );
        let loan = await this.loanService.findOne({ leadID: lead.leadID }, [
          "*",
        ]);
        let eMendateChargeDetails =
          (await this.razorpayEMOrderService.findeMendateChargeDetailsForAsferaIVR(
            customer.customerID,
            lead.leadID,
          )) as any;
        let eMendateChargeDetailsByRazorpay =
          (await this.razorPayMandateService.findeMendateChargeDetailsByRazorpayForAsferaIVR(
            customer.customerID,
            lead.leadID,
          )) as any;
        let collectionDetails = await this.collectionService.find({
          where: {
            customerID: customer.customerID,
            leadID: lead.leadID,
          },
          order: [{ column: "collectionID", order: "desc" }],
          select: [
            "loanNo",
            "collectedAmount",
            "collectedMode",
            "collectedDate",
            "referenceNo",
            "status",
            "excess_amount",
            "collectionStatus",
            "remark",
            "createdDate",
            "approvedDate",
          ],
        });
        eMendateChargeDetails
          ? (details.e_mendate_charge_details = eMendateChargeDetails)
          : null;
        eMendateChargeDetailsByRazorpay
          ? (details.e_mendate_details_by_razorpay =
              eMendateChargeDetailsByRazorpay)
          : null;
        collectionDetails
          ? (details.collection_details = collectionDetails)
          : null;
        lead.monthlyIncome
          ? (details.monthly_income = lead?.monthlyIncome)
          : null;
        lead.salaryMode ? (details.salary_mode = lead?.salaryMode) : null;
        lead.status ? (details.loan_status = lead?.status) : null;
        approval && approval.loanAmtApproved
          ? (details.approval_amount = approval?.loanAmtApproved)
          : null;
        approval && approval.tenure
          ? (details.loan_tenure = approval?.tenure)
          : null;
        approval && approval.repayDate
          ? (details.repayment_date = approval?.repayDate)
          : null;
        details.roi = +config.rate_of_interest;
        loan && loan.disbursalAmount
          ? (details.loan_disbursement_amount = loan?.disbursalAmount)
          : null;
        let data = (await checkRepaymentAmount(lead?.leadID)) as {
          Total_Payable_Amount: number;
          Remanning_Amount: number;
          RepayDate: string;
        };
        data && data.Remanning_Amount
          ? (details.repayment_amount = data?.Remanning_Amount)
          : null;
        details.no_of_days = Math.floor(
          (new Date(Date.now()).getTime() -
            new Date(loan?.disbursalDate).getTime()) /
            (1000 * 60 * 60 * 24),
        );
      }
      customer.email ? (details.email = customer?.email) : null;

      return this.serviceResponse(200, { details, mobile }, "Customer Details");
    }
  }

  async getBankDetails(payload: IGetBankDetailsPayload) {
    const { ifsc } = payload;

    // For later on, we can accept multiple fields in query and create a dynamic search

    const banks = await this.bankIfscModel.find({
      where: { IFSC: ifsc },
      select: ["BANK"],
    });

    return this.serviceResponse(HttpStatusCode.Ok, { banks }, "Banks Fetched");
  }

  async aadharDown() {
    let isAadharDown = true;

    const aadharData = await this.leadsApiLogModel.LeadsApiLogKnex.where(
      "status",
      "0",
    )
      .andWhere("api_type", LeadLogApiType.AADHAR_V2_SUBMIT_OTP)
      .orderBy("id", "desc")
      .select("created_at", "status", "id")
      .first();

    if (!aadharData) {
      return this.serviceResponse(
        HttpStatusCode.Ok,
        { isAadharDown },
        "Aadhar Status",
      );
    }

    const createdAt = moment(aadharData.created_at);
    const now = moment();

    // Check if it's more than 120 minutes (2 hours) ago
    const diffInMinutes = now.diff(createdAt, "minutes");

    if (diffInMinutes > 120) {
      isAadharDown = false;
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      { isAadharDown },
      "Aadhar Status",
    );
  }

  async disbursalStatus(payload: IivrMenuOnePayload) {
    const { mobile } = payload;
    const Mobile = Number(mobile);

    let customer = await this.customerService.findOne({ mobile: Mobile }, [
      "customerID",
    ]);

    if (!customer) {
      return this.serviceResponse(
        404,
        { status: "Customer Not Found", mobile, loanNumber: null },
        "Loan Application Status",
      );
    }
    let lead = await this.leadService.findOne(
      { customerID: customer.customerID },
      ["leadID", "customerID", "status"],
      [{ column: "leadID", order: "desc" }],
    );

    let loan = await this.loanService.findOne(
      { leadID: lead.leadID },
      ["disbursalAmount", "accountNo", "bank", "disbursalDate"],
      [{ column: "loanID", order: "desc" }],
    );

    if (!lead) {
      return this.serviceResponse(
        404,
        {
          status: "No Loan Found",
          mobile,
          loanNumber: null,
        },
        "Loan Application Status",
      );
    }
    let Status: string;
    let message: string;

    const responseData: IDisbursalStatusResponse = { status: "", mobile };

    if (loan) {
      if (loan.disbursalAmount)
        responseData.disbursalAmount = loan.disbursalAmount;
      if (loan.accountNo) responseData.accountNo = loan.accountNo.slice(-4);
      if (loan.bank) responseData.bank = loan.bank;
      if (loan.disbursalDate) responseData.disbursalDate = loan.disbursalDate;
    }

    switch (lead.status) {
      case "Disbursed":
        Status = "Disbursed";
        message = "Loan has been disbursed successfully";
        break;

      case "Disbursal Sheet Send":
        Status = "Processed";
        message =
          "Loan is bank updated or disbursal sheet sent but not yet disbursed.";

        const chLogs = await this.callHistoryLogsModel.findOne({
          where: { leadID: lead.leadID },
          select: ["createdDate", "status"],
          order: [{ column: "callHistoryID", order: "desc" }],
        });

        if (chLogs?.status === LeadStatus.DISBURSAL_SHEET_SEND) {
          const createdDate = moment(chLogs.createdDate);
          const currentDate = moment();
          const diff = currentDate.diff(createdDate);

          if (diff > 7200000) {
            Status = "Delayed";
            message = "Lead is in the bank updated state for over 2 hours.";
          }
        }
        break;

      case "Closed":
        Status = "Closed";
        message = "Latest lead is closed";
        break;

      default:
        if (
          lead.status != "Approved" &&
          lead.status != "Bank Update Hold" &&
          lead.status != "Part Payment"
        ) {
          Status = "Incomplete Application";
          message = "Latest lead is not ready for disbursal";
        } else {
          Status = lead.status;
          message = `Your current application status is ${lead.status}`;
        }
        break;
    }

    responseData.status = Status;

    return this.serviceResponse(200, responseData, message);
  }

  async repaymentStatus(payload: IivrMenuOnePayload) {
    const { mobile } = payload;
    const Mobile = Number(mobile);

    let customer = await this.customerService.findOne({ mobile: Mobile }, [
      "customerID",
    ]);

    if (!customer) {
      return this.serviceResponse(
        404,
        { status: "Customer Not Found", mobile, loanNumber: null },
        "Loan Application Status",
      );
    }
    let lead = await this.leadService.findOne(
      { customerID: customer.customerID },
      ["leadID", "customerID", "status", "productID", "ipc"],
      [{ column: "leadID", order: "desc" }],
    );

    if (!lead) {
      return this.serviceResponse(
        404,
        {
          status: "No Loan Found",
          mobile,
          loanNumber: null,
        },
        "Loan Application Status",
      );
    }
    let Status: string;
    let Message: string;
    let Duedate: string | Date;
    let amount: number = 0;
    let dpd: number;

    if (lead.status === LeadStatus.CLOSED) {
      Status = "Closed";
      Message = "Latest lead is closed";
      return this.serviceResponse(
        200,
        {
          status: Status,
        },
        Message,
      );
    }
    if (
      lead.status === LeadStatus.DISBURSED ||
      lead.status === LeadStatus.PART_PAYMENT
    ) {
      if (lead.productID === ProductID.PAYDAY) {
        const approval = await this.approvalService.findOne(
          { leadID: lead.leadID },
          ["repayDate"],
        );
        const Duedate = moment(approval.repayDate, "YYYY-MM-DD");
        const today = moment();
        if (Duedate.isSameOrAfter(today, "day")) {
          Status = "Due";
          Message =
            "Lead is in Disbursed or Part Payment status and repay date is in the future.";
        } else {
          Status = "Overdue";
          dpd = differenceInCalendarDays(
            new Date(),
            new Date(approval.repayDate),
          );
          Message =
            "Lead is in Disbursed or Part Payment status and repay date is in the past";
        }
        if (lead.ipc === 1) {
          amount = await calculateTotalRepayPaydayAmountIPC(
            lead.leadID,
            lead.status,
          );
        } else {
          amount = await calculateTotalRepayPaydayAmountNonIPC(lead.leadID);
        }
        return this.serviceResponse(
          200,
          {
            status: Status,
            amount: amount,
            dueDate: Duedate,
            mobile: mobile,
            dpd: dpd,
          },
          Message,
        );
      } else {
        const emiData = await this.emiCollection.getRepaymentData(
          lead.leadID,
          lead.customerID,
        );
        const currentDate = new Date();

        for (const emi of emiData.processedEmis) {
          if (emi.status === "Overdue") {
            amount += emi.amountPayable;
          }
        }
        for (const emi of emiData.processedEmis) {
          if (emi.status !== "Paid") {
            Duedate = new Date(emi.dueDate);
            if (Duedate < currentDate) {
              Status = "Overdue";
              dpd = differenceInCalendarDays(currentDate, Duedate);

              Message =
                "Lead is in Disbursed or Part Payment status and repay date is in the past";
              break;
            } else {
              amount = emiData.loanSummary.amountToBeRepayed;
              Status = "Due";
              Message =
                "Lead is in Disbursed or Part Payment status and repay date is in the future.";
              break;
            }
          }
        }

        return this.serviceResponse(
          200,
          {
            status: Status,
            amount: amount,
            dueDate: Duedate,
            mobile: mobile,
            dpd: dpd,
          },
          Message,
        );
      }
    } else {
      Status = "No Loan";
      Message = "Latest lead is not in Disbursed or Part Payment status";
      return this.serviceResponse(
        200,
        {
          status: Status,
        },
        Message,
      );
    }
  }

  async checkNumber(payload: IivrMenuOnePayload) {
    const { mobile } = payload;
    const Mobile = Number(mobile);
    let customer = await this.customerService.findOne({ mobile: Mobile }, [
      "customerID",
    ]);

    if (!customer) {
      return this.serviceResponse(
        400,
        { availability: false },
        "Customer not found in the database",
      );
    }
    return this.serviceResponse(
      200,
      { availability: true },
      "Customer found in the database",
    );
  }

  async verifyLoanNumber(payload: ILoanVerification) {
    const { mobile, loanlastfourdigit } = payload;
    const Mobile = Number(mobile);

    const customer = await this.customerService.findOne({ mobile: Mobile }, [
      "customerID",
      "mobile",
    ]);
    if (!customer) {
      throw new BadRequestError("Customer not found in database");
    }

    const ivrData = await this.ivrModel.findOne(
      { mobile },
      ["log_datetime"],
      [{ column: "id", order: "desc" }],
    );

    if (ivrData) {
      const timeDifference = moment().diff(
        moment(ivrData.log_datetime),
        "seconds",
      );
      if (timeDifference < 30) {
        return this.serviceResponse(
          500,
          { status: false, attempt: 2 },
          "Please try after some time",
        );
      }

      await this.ivrModel.findOneAndUpdate(
        { mobile },
        { log_datetime: moment().toDate() },
      );
    } else {
      await this.ivrModel.create({ mobile, log_datetime: moment().toDate() });
    }

    const lead = await this.leadService.findOne(
      { customerID: customer.customerID },
      ["leadID", "customerID", "status"],
      [{ column: "leadID", order: "desc" }],
    );

    if (!lead) {
      throw new BadRequestError("Complete your loan application first");
    }

    if (
      ![LeadStatus.DISBURSED, LeadStatus.PART_PAYMENT].includes(lead.status)
    ) {
      throw new BadRequestError("Your lead status is not in a disbursed state");
    }

    const loan = await this.loanService.findOne(
      { leadID: lead.leadID },
      ["loanNo"],
      [{ column: "loanID", order: "desc" }],
    );

    if (!loan) {
      throw new BadRequestError("Loan not found for this mobile number");
    }

    const lastFour = +loan.loanNo.slice(-4);

    if (lastFour) {
      if (lastFour === +loanlastfourdigit) {
        return this.serviceResponse(
          200,
          { status: true, attempt: 1 },
          "Loan number verified successfully",
        );
      } else {
        return this.serviceResponse(
          404,
          { status: false, attempt: 1 },
          "Please provide correct last four digit of your loan number.",
        );
      }
      // const collection = await this.collectionService.findOne(
      //   { customerID: customer.customerID, leadID: lead.leadID },
      //   [
      //     'collectedAmount',
      //     'collectedDate',
      //     'collectedMode',
      //     'collectionStatus',
      //   ],
      //   [{ column: 'collectionID', order: 'desc' }],
      // )

      // if (collection.collectionStatus === CollectionStatus.ACCEPTED) {
      //   const yearMonthDay = moment(collection.collectedDate).format(
      //     'YYYY-MM-DD',
      //   )
      //   const hourMinute = moment(collection.collectedDate).format('HH:mm')
      //   return this.serviceResponse(
      //     200,
      //     {
      //       status: true,
      //       yearMonthDay,
      //       hourMinute,
      //       amount: collection.collectedAmount,
      //       mode: collection.collectedMode,
      //     },
      //     'Latest Payment against loan number',
      //   )
      // } else if (
      //   collection.collectionStatus === CollectionStatus.PAYMENT_REJECTED
      // ) {
      //   const yearMonthDay = moment(collection.collectedDate).format(
      //     'YYYY-MM-DD',
      //   )
      //   const hourMinute = moment(collection.collectedDate).format('HH:mm')
      //   return this.serviceResponse(
      //     200,
      //     {
      //       status: true,
      //       yearMonthDay,
      //       hourMinute,
      //       amount: collection.collectedAmount,
      //       mode: collection.collectedMode,
      //     },
      //     'Latest Payment rejected against loan number',
      //   )
      // } else if (collection.collectedAmount === 0) {
      //   return this.serviceResponse(
      //     200,
      //     {
      //       status: true,
      //     },
      //     'No payment done against loan number',
      //   )
      // }
    } else {
      return this.serviceResponse(
        404,
        { status: false, attempt: 1 },
        "Please provide correct last four digit of your loan number.",
      );
    }
  }

  async newLoanSms(payload: IivrMenuOnePayload) {
    const { mobile } = payload;
    const Mobile = Number(mobile);
    let customer = await this.customerService.findOne({ mobile: Mobile }, [
      "customerID",
    ]);

    if (!customer) {
      throw new NotFoundError("customer not found in database");
    }
    const headers = {
      "Content-Type": "application/json",
      api_key: config.asferaApiKey,
      api_secret: config.asferaApiSecret,
    };
    const result = await this.apiService.call<
      IApiResponseSms,
      { mobile: number; type: string },
      undefined
    >(
      "post",
      NotificationUrl.NEW_LOAN,
      {
        mobile: Number(mobile),
        type: "RM",
      },
      undefined,
      headers,
    );
    return this.serviceResponse(
      result.statusCode,
      result.data,
      result.data.message,
    );
  }

  async repaymentLinkSms(payload: IivrMenuOnePayload) {
    const { mobile } = payload;
    const Mobile = Number(mobile);
    let customer = await this.customerService.findOne({ mobile: Mobile }, [
      "customerID",
    ]);

    if (!customer) {
      throw new NotFoundError("customer not found in database");
    }
    let lead = await this.leadService.findOne(
      { customerID: customer.customerID },
      ["leadID", "customerID", "status", "productID", "ipc"],
      [{ column: "leadID", order: "desc" }],
    );
    if (!lead) {
      throw new BadRequestError("lead not found in the database");
    }
    if (
      ![LeadStatus.DISBURSED, LeadStatus.PART_PAYMENT].includes(lead.status)
    ) {
      throw new BadRequestError("Your lead status is not in a disbursed state");
    }
    const headers = {
      "Content-Type": "application/json",
      api_key: config.asferaApiKey,
      api_secret: config.asferaApiSecret,
    };
    const result = await this.apiService.call<
      IApiResponseSms,
      { mobile: number; type: string },
      undefined
    >(
      "post",
      NotificationUrl.REPAYMENT_LINK,
      {
        mobile: Number(mobile),
        type: "RM",
      },
      undefined,
      headers,
    );
    return this.serviceResponse(
      result.statusCode,
      result.data,
      result.data.message,
    );
  }

  async leadStatus(payload: ILeadStatus) {
    const { mobile } = payload;
    const Mobile = Number(mobile);
    let customer = await this.customerService.findOne({ mobile: Mobile }, [
      "customerID",
    ]);

    if (!customer) {
      throw new NotFoundError("customer not found in database");
    }
    let lead = await this.leadService.findOne(
      { customerID: customer.customerID },
      ["leadID", "status"],
      [{ column: "leadID", order: "desc" }],
    );
    if (!lead) {
      throw new BadRequestError("lead not found in the database");
    }
    if (
      lead.status === LeadStatus.DISBURSED ||
      lead.status === LeadStatus.PART_PAYMENT
    ) {
      const approvalData = await approvalModel.findOneApproval(
        {
          leadID: lead.leadID,
          customerID: customer.customerID,
        },
        ["repayDate"],
      );

      if (approvalData.repayDate < new Date()) {
        return this.serviceResponse(
          HttpStatusCode.Ok,
          {
            status: "Overdue",
          },
          "Lead Status send successfully",
        );
      }
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        status: lead.status,
      },
      "Lead Status send successfully",
    );
  }
}

export const commonservice = new CommonService();
