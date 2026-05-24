import config from "@/config/default";
import ApprovalModel from "@/database/mysql/approval";
import { breApprovalAmountModel } from "@/database/mysql/bre_approval_amount";
import { bureauDatamodel } from "@/database/mysql/bureauData";
import { callHistoryLogsModel } from "@/database/mysql/callhistorylogs";
import CollectionModel from "@/database/mysql/collection";
import LeadModel from "@/database/mysql/leads";
import { leadsApiLogModel } from "@/database/mysql/lead_api_log";
import { referrerModel } from "@/database/mysql/referrer";
import { CollectionStatus } from "@/enums/collection.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { IApproval } from "@/interfaces/approval.interface";
import { ICustomer } from "@/interfaces/customer.interface";
import {
  ICheckRejectedStatusResponse,
  ILead,
  TSelectLead,
} from "@/interfaces/lead.interface";
import { ILoan } from "@/interfaces/loan.interface";
import { ICustomResponse } from "@/interfaces/response.interface";
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from "@/types/model.types";
import { getDifferenceInDays, isDateAfter } from "@/utils/dateTimeFunctions";
import { logger } from "@/utils/logger";
import { roundAmountBre } from "@/utils/util";
import moment from "moment";
import momentTz from "moment-timezone";
import ApprovalService from "./approval.service";
import { bureauDataservice } from "./bureauData.service";
import LoanService from "./loan.service";
import ResponseService from "./response.service";

class LeadService extends ResponseService {
  private readonly leadModel = new LeadModel();
  private readonly loanService = new LoanService();
  private readonly collectionModel = new CollectionModel();
  private readonly approvalModel = new ApprovalModel();
  private readonly approvalService = new ApprovalService();
  private readonly callHistoryLogsModel = callHistoryLogsModel;
  private readonly breApprovalAmountModel = breApprovalAmountModel;
  private readonly bureauDataModel = bureauDatamodel;
  private readonly bureauDataService = bureauDataservice;
  private readonly referrerModel = referrerModel;

  constructor() {
    super();
  }

  public async updateLead(leadID: number, productID: number): Promise<object> {
    try {
      let lead = await this.leadModel.getLeadData(
        { leadID },
        { orderKey: `${leadID}`, orderValue: "desc" },
        ["productID", "leadID", "customerID"]
      );
      if (lead[0]) {
        if (lead[0].productID) {
          // Your logic for when lead.productID is not empty
          return {
            success: false,
            message: "Already Updated!",
            statusCode: 400,
          };
        } else {
          await this.leadModel.updateLeadRow(leadID, { productID: productID });
          return { success: true, message: "Lead Updated", statusCode: 200 };
        }
      } else {
        return {
          success: false,
          message: "Send Correct Details:No Lead Found",
          statusCode: 400,
        };
      }
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: "Something Went Wrong: ULF",
        statusCode: 500,
      };
    }
  }

  async findOne(
    where: WhereQuery<ILead>,
    select: SelectFields<TSelectLead> = ["*"],
    order?: SortCriteria<TSelectLead>,
    whereNot?: WhereQuery<ILead>
  ): Promise<ILead> {
    return await this.leadModel.findOneLead(where, select, order, whereNot);
  }

  async findOneLead(
    params: KnexFindParams<ILead, TSelectLead>
  ): Promise<ILead> {
    return await this.leadModel.findOne(params);
  }

  async findLeads(
    params: KnexFindParams<ILead, TSelectLead>
  ): Promise<ILead[]> {
    return await this.leadModel.find(params);
  }

  async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[]
  ): Promise<ILead[] | ICustomResponse> {
    try {
      let lead = await this.leadModel.getLeadData(where, order, select);
      if (lead == null || lead.length == 0) {
        return null;
      } else {
        return lead; // Return the first lead if found
      }
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: "Internal Server Error",
        statusCode: 500,
      } as ICustomResponse;
    }
  }
  // ! Refactored
  async updateOne(
    where: WhereQuery<ILead>,
    update: UpdateQuery<ILead>
  ): Promise<number> {
    return await this.leadModel.findOneAndUpdate(where, update);
  }

  async count(
    where?: WhereQuery<ILead>,
    whereNot?: WhereQuery<ILead>
  ): Promise<number> {
    return await this.leadModel.countLeads(where, whereNot);
  }

  async countLeads(
    where?: WhereQuery<ILead>,
    whereNot?: WhereQuery<ILead>,
    whereIn?: { [K in keyof ILead]?: ILead[K][] }
  ): Promise<number> {
    return await this.leadModel.leadCountArray(where, whereNot, whereIn);
  }

  async create(data: {}): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.leadModel.insert(data);
      return insertId;
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: "Internal Server Error",
        statusCode: 500,
      } as ICustomResponse;
    }
  }

  async getLoanLeadDetail(leadID: number) {
    const leadDetail = await this.findOne({ leadID });
    let loanDisbursed = 0;
    let roi = 0;
    let nod = 0;
    let rd = 0;
    let penDay = 0;
    let toi = 0;
    let penAmount = 0;
    let coAmount = 0;
    let gstAmount = 0;
    let repayAmount = 0;
    let approvalAmount = 0;
    let loanTenure = 0;
    let approval: IApproval;
    let adminFee = 0;
    let repaymentAmount = 0;
    let loan: ILoan;

    if (leadDetail) {
      loan = await this.loanService.findOne({
        customerID: leadDetail.customerID,
        leadID: leadDetail.leadID,
      });

      let loanDisbursed = loan.disbursalAmount;

      const approvalService = new ApprovalService();
      if (loan.disbursalRefrenceNo) {
        approval = await approvalService.findOne({
          customerID: leadDetail.customerID,
          leadID: leadDetail.leadID,
        });

        approvalAmount = approval.loanAmtApproved;
        loanTenure = approval.tenure;
        roi = +config.rate_of_interest;
        const sta = new Date(approval.repayDate);
        const cur = new Date();
        const mi1 = roi / 100;
        const mi = Math.round(loan.disbursalAmount * mi1 * 100) / 100;
        nod =
          (new Date(approval.repayDate).getTime() -
            new Date(loan.disbursalDate).getTime()) /
          (1000 * 60 * 60 * 24);

        if (new Date(approval.repayDate) >= cur) {
          rd =
            (cur.getTime() - new Date(loan.disbursalDate).getTime()) /
            (1000 * 60 * 60 * 24);
        } else {
          rd = nod;
        }

        penDay = 0;
        if (cur > sta) {
          penDay = (cur.getTime() - sta.getTime()) / (1000 * 60 * 60 * 24);
        }

        toi = mi * rd;
        if (penDay > 0) {
          penAmount =
            (Math.round(loan.disbursalAmount * (1.25 / 100) * 100) / 100) *
            penDay;
        } else {
          penAmount = 0;
        }

        const totPay = loan.disbursalAmount + toi + penAmount;

        const cola = await this.collectionModel.CollectionKnex.where({
          collectionStatus: LeadStatus.APPROVED,
          customerID: leadDetail.customerID,
          leadID: leadDetail.leadID,
        }).sum("collectedAmount");

        repaymentAmount = totPay - coAmount;

        const adgst = Math.round(approval.adminFee * (18 / 100) * 100) / 100;
        const svs = adgst + approval.adminFee;
        const dbu = loan.disbursalAmount - svs;
        gstAmount = adgst;
        adminFee = approval.adminFee;
        const paA = Math.round(
          loan.disbursalAmount * (+config.rate_of_interest / 100)
        );
        const tda = paA * approval.tenure;
        repayAmount = loan.disbursalAmount + tda;
      }
    }

    return {
      loan_disbursed: loanDisbursed,
      roi: roi,
      no_days: nod,
      real_days: rd,
      penalty_days: penDay,
      real_interest: toi,
      penalty_intrest: penAmount,
      paid_amount: coAmount,
      repayment_amount: repaymentAmount,
      gst_amount: gstAmount,
      admin_fee: adminFee,
      repay_amount: repayAmount,
      approval_amount: approvalAmount,
      loan_tenure: loanTenure,
      creda: approval,
      disba: loan,
    };
  }

  async findLeadAndStatus(
    customerId: number
  ): Promise<{ leadID: number; leadStatus: string }> {
    const allLeads = await this.find(
      {
        customerID: customerId,
      },
      {
        orderKey: "leadID",
        orderValue: "desc",
      },
      ["leadID", "status"]
    );
    let leadID: number;
    let leadStatus: string;
    if (Array.isArray(allLeads)) {
      for (const lead of allLeads) {
        if (lead.status === "Settlement" || lead.status === "Blacklisted") {
          leadID = lead.leadID;
          leadStatus = lead.status;
          break;
        }
      }
      if (leadID === null && leadStatus === null) {
        for (const lead of allLeads) {
          if (lead.status === "Disbursed" || lead.status === "Part Payment") {
            leadID = lead.leadID;
            leadStatus = lead.status;
            break;
          }
        }
      }
    } else {
      return null;
    }

    if (leadID !== null && leadStatus !== null) {
      return { leadID, leadStatus };
    } else {
      return null;
    }
  }

  async checkDisbursed(lead: ILead, customer: ICustomer) {
    const { leadID } = lead;
    const { customerID } = customer;
    let isLoanOverDue = false;

    const [approval, loan] = await Promise.all([
      this.approvalModel.findOneApproval(
        { leadID, customerID },
        [
          "approvalID",
          "loanAmtApproved",
          "tenure",
          "roi",
          "repayDate",
          "adminFee",
          "GstOfAdminFee",
          "status",
          "customerApproval",
          "repayDate",
        ],
        [{ column: "approvalID", order: "desc" }]
      ),
      this.loanService.findOne(
        { customerID, leadID },
        [
          "loanNo",
          "createdDate",
          "disbursalAmount",
          "disbursalDate",
          "accountNo",
          "accountType",
          "bankIfsc",
          "bank",
          "status",
          "payout_status",
        ],
        [{ column: "loanID", order: "desc" }]
      ),
    ]);

    const loanStatus = loan.payout_status;
    const dpdInterest = +config.dpdInterest;
    let totalAmount = 0;
    let sanctionInterest = 0;
    let totalInterest = 0;
    let totalDpdCharges = 0;

    const dashboardMessages = {
      dashboard_message1: "Don't forget your Repay Date",
      dashboard_message2: "Loan Repayment",
      dashboard_message3: `₹${loan.disbursalAmount}`,
      dashboard_message4: momentTz(approval.repayDate)
        .tz("Asia/Kolkata")
        .format("DD/MM/YYYY"),
      dashboard_message5: "is due. Please pay promptly",
      dashboard_message6: loan.disbursalAmount,
      dashboard_message13: loan.disbursalAmount,
      dashboard_message10: 0,
    };

    let currentDate = new Date();
    let repayDate = new Date(approval.repayDate);

    let disbursalDate;
    if (
      typeof loan.disbursalDate === "string" &&
      (loan.disbursalDate as string).includes("/")
    ) {
      const parts = (loan.disbursalDate as string).split("/");
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        let year = parts[2];

        if (year.length === 2) {
          year = "20" + year;
        }

        const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
        disbursalDate = new Date(dateStr);
      } else {
        disbursalDate = new Date(loan.disbursalDate);
      }
    } else {
      disbursalDate = new Date(loan.disbursalDate);
    }

    let tenure = getDifferenceInDays(disbursalDate, repayDate);

    sanctionInterest = this.loanService.calculateInterest(
      loan.disbursalAmount,
      +config.rate_of_interest,
      tenure
    );

    const isOverDue = isDateAfter(currentDate, repayDate);
    let delayInterest = 0;

    if (isOverDue) {
      dashboardMessages.dashboard_message1 = "Urgent Attention Needed!!";
      dashboardMessages.dashboard_message2 = `Loan Repayment`;
      dashboardMessages.dashboard_message3 = "Repay Loan";
      dashboardMessages.dashboard_message4 = momentTz(approval.repayDate)
        .tz("Asia/Kolkata")
        .format("DD/MM/YYYY");

      const dpdDays = getDifferenceInDays(repayDate, currentDate);
      delayInterest = this.loanService.calculateInterest(
        loan.disbursalAmount,
        dpdInterest,
        dpdDays
      );

      dashboardMessages.dashboard_message5 = `${dpdDays} days Overdue`;
      (
        dashboardMessages as any
      ).dashboard_message7 = `is overdue. Please repay promptly`;
      isLoanOverDue = true;
    }

    totalAmount = loan.disbursalAmount + sanctionInterest + delayInterest;
    //totalAmount = loan.disbursalAmount;
    let actualAmount = 0;
    if (lead.ipc === 1) {
      const modifiedLoan = {
        ...loan,
        disbursalDate: disbursalDate,
      };

      let repaymentData = await this.loanService.calculateRepayAmountIpc(
        lead,
        customer,
        approval,
        modifiedLoan,
        isOverDue ? currentDate : repayDate
      );
      console.log("arivnd------", repaymentData);

      let actualRepaymentData = await this.loanService.calculateRepayAmountIpc(
        lead,
        customer,
        approval,
        modifiedLoan,
        currentDate
      );

      totalAmount = repaymentData.totalPayableAmount;
      actualAmount = actualRepaymentData.totalPayableAmount;
      totalInterest = actualRepaymentData.totalInterest;
      totalDpdCharges = actualRepaymentData.totalAmountDpdCharge;
      //totalAmount = Number(repaymentData.totalPayableAmount ?? 0) + Number(repaymentData.totalAmountInterest ?? 0) + Number(repaymentData.totalAmountDpdCharge ?? 0);
      //actualAmount  = Number(actualRepaymentData.totalPayableAmount ?? 0) + Number(actualRepaymentData.totalAmountInterest ?? 0) + Number(actualRepaymentData.totalAmountDpdCharge ?? 0);
    }

    dashboardMessages.dashboard_message6 = totalAmount;
    dashboardMessages.dashboard_message10 = loan.disbursalAmount;
    dashboardMessages.dashboard_message13 = actualAmount;

    const interestData = await this.calculateInterestTillToday(
      loan.disbursalAmount,
      +config.rate_of_interest,
      loan.disbursalDate
    );

    const loanDetails = {
      disbursalAmount: loan.disbursalAmount,
      disbursalDate: loan.disbursalDate,
      repaymentAmount: totalAmount,
      repaymentDate: momentTz(approval.repayDate)
        .tz("Asia/Kolkata")
        .format("DD/MM/YYYY"),
      interestRate: +config.rate_of_interest,
    };

    const interestDetails = {
      principal_amount: actualAmount - totalInterest - totalDpdCharges,
      no_of_days: interestData.daysPassed,
      interestAmount: interestData.interestTillToday,
      // roi: config.daily_interest,
      roi: +config.rate_of_interest,
      daily_interest: interestData.dailyInterest,
    };

    const overdueCharges = {
      isOverdue: isOverDue,
      overdueDays: isOverDue ? getDifferenceInDays(repayDate, currentDate) : 0,
      overdueRate: 0.1,
      interestCalculated: totalInterest,
      overdueAmount: totalDpdCharges - config.bounce_charge,
      overdueStartDate: isOverDue
        ? momentTz(approval.repayDate).tz("Asia/Kolkata").format("DD/MM/YYYY")
        : null,
      bounceCharge: config.bounce_charge,
      totalOverDueAmount: totalAmount,
    };

    return {
      dashboardMessages,
      isLoanOverDue,
      loanStatus,
      loanDetails,
      interestDetails,
      overdueCharges,
    };
  }

  async checkPartPayment(lead: ILead, customer: ICustomer) {
    const { leadID } = lead;
    const { customerID } = customer;
    let isLoanOverDue = false;

    const [approval, loan] = await Promise.all([
      this.approvalModel.findOneApproval(
        { leadID, customerID },
        [
          "approvalID",
          "loanAmtApproved",
          "tenure",
          "roi",
          "repayDate",
          "adminFee",
          "GstOfAdminFee",
          "status",
          "customerApproval",
        ],
        [{ column: "approvalID", order: "desc" }]
      ),
      this.loanService.findOne(
        { customerID, leadID },
        [
          "loanNo",
          "createdDate",
          "disbursalAmount",
          "disbursalDate",
          "accountNo",
          "accountType",
          "bankIfsc",
          "bank",
          "status",
        ],
        [{ column: "loanID", order: "desc" }]
      ),
    ]);

    const dashboardMessages = {
      dashboard_message1: "Don't forget your Repay Date",
      dashboard_message2: "Loan Repayment",
      dashboard_message3: "Repay Loan",
      dashboard_message4: momentTz(approval.repayDate)
        .tz("Asia/Kolkata")
        .format("DD/MM/YYYY"),
      dashboard_message5: "is due. Please pay promptly",
      dashboard_message6: 0,
      dashboard_message13: 0,
    };

    let collectionAmount = 0;
    let dpdInterest = +config.dpdInterest;

    const collection = await this.collectionModel.find({
      where: {
        customerID,
        leadID,
        loanNo: loan.loanNo,
        status: CollectionStatus.PART_PAYMENT,
        collectionStatus: CollectionStatus.APPROVED,
      },
      sum: ["collectedAmount"],
    });

    if (collection.length > 0) {
      collectionAmount = collection[0].collectedAmount;
    }

    let currentDate = new Date();
    let repayDate = new Date(approval.repayDate);
    let disbursalDate = loan.disbursalDate;

    let tenure = getDifferenceInDays(disbursalDate, repayDate);

    let sanctionInterest = this.loanService.calculateInterest(
      loan.disbursalAmount,
      +config.rate_of_interest,
      tenure
    );

    let totalAmount = 0;
    let delayInterest = 0;
    let totalInterest = 0;
    let totalDpdCharges = 0;

    const isOverDue = isDateAfter(currentDate, repayDate);
    if (isOverDue) {
      dashboardMessages.dashboard_message1 = "Urgent Attention Needed!!";
      dashboardMessages.dashboard_message2 = `Loan Repayment`;
      dashboardMessages.dashboard_message3 = "Repay Loan";
      dashboardMessages.dashboard_message4 = momentTz(approval.repayDate)
        .tz("Asia/Kolkata")
        .format("DD/MM/YYYY");

      const dpdDays = getDifferenceInDays(repayDate, currentDate);
      delayInterest = this.loanService.calculateInterest(
        loan.disbursalAmount,
        dpdInterest,
        dpdDays
      );

      dashboardMessages.dashboard_message5 = `${dpdDays} days Overdue`;
      (
        dashboardMessages as any
      ).dashboard_message7 = `is overdue. Please repay promptly`;
      isLoanOverDue = true;
    }

    totalAmount = collectionAmount
      ? loan.disbursalAmount +
        sanctionInterest +
        delayInterest -
        collectionAmount
      : loan.disbursalAmount + sanctionInterest + delayInterest;
    let actualAmount = 0;
    let normalInterest = 0;
    if (lead.ipc === 1) {
      let repaymentData = await this.loanService.calculateRepayAmountIpc(
        lead,
        customer,
        approval,
        loan,
        isOverDue ? currentDate : repayDate
      );
      console.log("arivnd------", repaymentData);
      let actualRepaymentData = await this.loanService.calculateRepayAmountIpc(
        lead,
        customer,
        approval,
        loan,
        currentDate
      );
      console.log("arivnd------", actualRepaymentData);
      totalAmount =
        Number(repaymentData.totalPayableAmount ?? 0) +
        Number(repaymentData.totalInterest ?? 0) +
        Number(repaymentData.dpdCharges ?? 0);
      actualAmount =
        Number(actualRepaymentData.totalPayableAmount ?? 0) +
        Number(actualRepaymentData.totalInterest ?? 0) +
        Number(actualRepaymentData.dpdCharges ?? 0);
      totalInterest = Number(actualRepaymentData.totalInterest ?? 0);
      totalDpdCharges = Number(actualRepaymentData.dpdCharges ?? 0);
      normalInterest = Number(actualRepaymentData.normalInterest ?? 0);
    }

    dashboardMessages.dashboard_message6 = Math.ceil(totalAmount);
    dashboardMessages.dashboard_message13 = Math.ceil(actualAmount);

    const interestData = await this.calculateInterestTillToday(
      loan.disbursalAmount,
      +config.rate_of_interest,
      loan.disbursalDate
    );

    const loanDetails = {
      disbursalAmount: loan.disbursalAmount,
      disbursalDate: loan.disbursalDate,
      repaymentAmount: Math.ceil(totalAmount),
      repaymentDate: momentTz(approval.repayDate)
        .tz("Asia/Kolkata")
        .format("DD/MM/YYYY"),
      interestRate: +config.rate_of_interest,
    };

    const interestDetails = {
      principal_amount:
        actualAmount - totalInterest - totalDpdCharges > 0
          ? Math.ceil(actualAmount - totalInterest - totalDpdCharges)
          : 0,
      no_of_days: interestData.daysPassed,
      interestAmount: Math.ceil(interestData.interestTillToday),
      roi: +config.rate_of_interest,
      daily_interest: interestData.dailyInterest,
    };

    const overdueCharges = {
      isOverdue: isOverDue,
      overdueDays: isOverDue ? getDifferenceInDays(repayDate, currentDate) : 0,
      overdueRate: 0.1,
      interestCalculated: Math.ceil(totalInterest),
      overdueAmount:
        totalDpdCharges - config.bounce_charge > 0
          ? Math.ceil(totalDpdCharges - config.bounce_charge)
          : 0,
      overdueStartDate: isOverDue
        ? momentTz(approval.repayDate).tz("Asia/Kolkata").format("DD/MM/YYYY")
        : null,
      bounceCharge:
        totalDpdCharges - config.bounce_charge > 0
          ? config.bounce_charge
          : Math.ceil(totalDpdCharges),
      totalOverDueAmount: Math.ceil(actualAmount),
    };

    return {
      dashboardMessages,
      isLoanOverDue,
      loanDetails,
      interestDetails,
      overdueCharges,
    };
  }

  // For reject case
  async checkRejectedCase(
    leadID: number,
    customerID: number,
    status: LeadStatus
  ): Promise<ICheckRejectedStatusResponse> {
    const response: ICheckRejectedStatusResponse = {
      daysLeft: 0,
      isRejected: false,
    };

    let leadRejectedDays = +config.leadRejectedDays;

    const rejectedStatuses = [
      LeadStatus.REJECTED,
      LeadStatus.REJECTED_PROCESS,
      LeadStatus.BANK_UPDATE_REJECTED,
      LeadStatus.NOT_ELIGIBLE,
    ];

    if (!rejectedStatuses.includes(status)) return response;

    if (status === LeadStatus.NOT_ELIGIBLE) {
      const lead = await this.findOne({ leadID }, ["createdDate"]);
      if (!lead) return response;

      response.daysLeft = getDifferenceInDays(lead.createdDate);

      response.daysLeft =
        response.daysLeft <= leadRejectedDays
          ? leadRejectedDays - response.daysLeft
          : 0;

      response.isRejected = response.daysLeft ? true : false;

      return response;
    }

    const chLogs = await this.callHistoryLogsModel.findOne({
      where: { leadID, customerID, status },
      select: ["callbackTime"],
      order: [{ column: "leadID", order: "desc" }],
    });

    if (!chLogs) return response;

    response.daysLeft = getDifferenceInDays(chLogs.callbackTime);

    response.daysLeft =
      response.daysLeft <= leadRejectedDays
        ? leadRejectedDays - response.daysLeft
        : 0;

    response.isRejected = response.daysLeft ? true : false;

    return response;
  }

  async createNewLead(
    customerID: number,
    caseType?: "New Case" | "Existing Case",
    userIp?: string,
    plateform?: string,
    currentLender?: number
  ) {
    // Check if any utmSource available for this user
    const referrer = await this.referrerModel.getLastTwoMonthReferrer(
      customerID
    );

    const data: InsertData<ILead> = {
      customerID: customerID,
      status: LeadStatus.INCOMPLETE_USER,
      utmSource: referrer?.referrer ?? "app_v1",
      utm_assigned_date: referrer?.created_at ?? null,
      fbLeads: caseType ?? "New Case",
      callAssign: +config.defaultUserId,
      creditAssign: +config.defaultUserId,
      ip: userIp,
      plateform: plateform,
      lenderID: currentLender,
    };

    const [leadId] = await this.leadModel.create(data);

    const lead = await this.leadModel.findOne({
      where: { leadID: leadId },
      select: ["status", "leadID"],
    });
    return lead;
  }

  async checkFirstBreLead(customerID: number) {
    let autoBamlCheck = 1;

    // Query for the lead
    const lead = await this.leadModel.LeadsKnex.join(
      "loan as lo",
      "leads.leadID",
      "lo.leadID"
    )
      .where("leads.status", LeadStatus.CLOSED)
      .where("lo.customerID", customerID)
      .select("leads.leadID")
      .orderBy("leads.leadID", "asc")
      .first();

    if (lead) {
      // Fetch call history logs for the customer
      const checkAllProcessAutomatic = await this.callHistoryLogsModel.find({
        where: { customerID, leadID: lead.leadID },
        select: ["status", "calledBy"],
        order: [{ column: "callHistoryID", order: "asc" }],
      });

      // Define the status requirements
      const statusRequirements = [
        "Fresh Lead",
        "Approved Process",
        "Approved",
        "sanction-letter",
      ];
      const statusRequirementsUpgraded = [
        "Fresh Lead",
        "Approved Process",
        "Approved Process",
        "Approved",
        "sanction-letter",
      ];
      const statusRequirementsUpgradedAgain = [
        "Fresh Lead",
        "Approved Process",
        "Approved Process",
        "Approved Process",
        "Approved",
        "sanction-letter",
      ];

      // If the count of call history logs is greater than or equal to the status requirements
      if (checkAllProcessAutomatic.length >= statusRequirements.length) {
        let allMatch = true;
        let allMatchUpgraded = true;
        let allMatchUpgradedAgain = true;

        // Check for the first status requirements match
        for (let i = 0; i < statusRequirements.length; i++) {
          if (
            checkAllProcessAutomatic[i].status !== statusRequirements[i] ||
            checkAllProcessAutomatic[i].calledBy !== +config.defaultUserId
          ) {
            allMatch = false;
            break;
          }
        }

        // Check for upgraded status requirements match
        for (let i = 0; i < statusRequirementsUpgraded.length; i++) {
          if (
            checkAllProcessAutomatic[i].status !==
              statusRequirementsUpgraded[i] ||
            checkAllProcessAutomatic[i].calledBy !== +config.defaultUserId
          ) {
            allMatchUpgraded = false;
            break;
          }
        }

        // Check for upgraded again status requirements match
        for (let i = 0; i < statusRequirementsUpgradedAgain.length; i++) {
          if (
            checkAllProcessAutomatic[i].status !==
              statusRequirementsUpgradedAgain[i] ||
            checkAllProcessAutomatic[i].calledBy !== +config.defaultUserId
          ) {
            allMatchUpgradedAgain = false;
            break;
          }
        }

        // If none of the status sets match, set the autoBamlCheck flag to 0
        if (!allMatch && !allMatchUpgraded && !allMatchUpgradedAgain) {
          autoBamlCheck = 0;
        }
      }
    }

    return autoBamlCheck;
  }

  async checkBreAmount(
    mobile: string,
    pancard: string,
    customerID: number,
    leadID: number
  ) {
    let offerAmount = 0;

    // Fetch the latest record from leads_api_log table where conditions are met

    const checkBre = await leadsApiLogModel.LeadsApiLogKnex.where(
      "mobile_no",
      mobile
    )
      .where("pancard", pancard)
      .where("api_type", LeadLogApiType.BUREAU_SURROGATE)
      .whereRaw("CAST(amount AS SIGNED) > 0")
      .orderBy("id", "desc")
      .first();

    if (checkBre) {
      // Decode the JSON api_response field
      const apiRes = JSON.parse(checkBre.api_response);

      if (apiRes.final_result === "ACCEPT") {
        // Set the offer amount
        offerAmount = checkBre.amount;

        // Insert into bre_approval_amount table
        await this.breApprovalAmountModel.insert({
          customerID: customerID,
          leadID: leadID,
          type: "BRE",
          amount: offerAmount,
        });
      }
    }

    return offerAmount;
  }

  async checkBankingSurrogateAmount(
    mobile: string,
    pancard: string,
    customerID: number,
    leadID: number
  ) {
    let offerAmount = 0;

    // Fetch the latest record from leads_api_log table where conditions are met
    const checkBanking = await leadsApiLogModel.LeadsApiLogKnex.where(
      "mobile_no",
      mobile
    )
      .where("pancard", pancard)
      .where("api_type", LeadLogApiType.BANKING_SURROGATE)
      .where("status", 1)
      .whereRaw("CAST(amount AS SIGNED) > 0")
      .first();

    if (checkBanking) {
      offerAmount = checkBanking.amount;
      // Insert into bre_approval_amount table
      await this.breApprovalAmountModel.insert({
        customerID: customerID,
        leadID: leadID,
        type: LeadLogApiType.BANKING_SURROGATE,
        amount: offerAmount,
      });
    }

    return offerAmount;
  }

  async checkBreRajatAmount(customerID: number, leadID: number) {
    let offerAmount = 0;

    const checkBureau = await this.bureauDataModel.findOneBureauData(
      { customerID },
      ["*"],
      [{ column: "id", order: "desc" }]
    );

    offerAmount = checkBureau
      ? roundAmountBre(checkBureau.affordability_generic)
      : await this.bureauDataService.bureau(leadID);

    // Insert into bre_approval_amount table
    await this.breApprovalAmountModel.insert({
      customerID: customerID,
      leadID: leadID,
      type: LeadLogApiType.RAJAT_API_BUREAU,
      amount: offerAmount,
    });

    return offerAmount;
  }

  async fourthLoanAmountCheck(customerID: number, leadID: number) {
    let offerAmount = 0;

    offerAmount = await this.approvalService.autoApproveRepeatCustomer(
      leadID, // ! Re-verify
      customerID,
      1
    );

    // Insert into bre_approval_amount table
    await this.breApprovalAmountModel.insert({
      customerID: customerID,
      leadID: leadID,
      type: LeadLogApiType.FOURTH_LOAN,
      amount: offerAmount,
    });

    return offerAmount;
  }

  async findLeadHigherAmount(
    mobile: string,
    pancard: string,
    customerID: number,
    leadID: number
  ) {
    const amounts = await Promise.all([
      this.checkBreAmount(mobile, pancard, customerID, leadID),
      this.checkBankingSurrogateAmount(mobile, pancard, customerID, leadID),
      this.checkBreRajatAmount(customerID, leadID),
      this.fourthLoanAmountCheck(customerID, leadID),
    ]);

    const maxAmount = Math.max(...amounts);

    return await this.amountGenericPercentAbove(maxAmount, customerID);
  }

  async amountGenericPercentAbove(amount: number, customerID: number) {
    const approvedAmount = await this.approvalService.getApprovedLoanAmount(
      customerID
    );

    if (approvedAmount !== null && amount > approvedAmount) {
      return approvedAmount;
    }

    return amount;
  }

  async checkFourthLead(customerID: number) {
    let needDocument = false;
    let fourthLead = false;
    let lastClosedLeadDay = false;

    const leadCountArr = await this.leadModel.LeadsKnex.join(
      "loan as lo",
      "lo.leadID",
      "=",
      "leads.leadID"
    )
      .where("leads.customerID", customerID)
      .where("leads.status", LeadStatus.CLOSED)
      .count();

    let leadCount = leadCountArr[0]["count(*)"] as number;

    if (leadCount > 0) {
      leadCount++;

      if (leadCount % 4 == 0) {
        fourthLead = true;
      }

      const lastLoan: ILead = await this.leadModel.LeadsKnex.join(
        "loan as lo",
        "lo.leadID",
        "=",
        "leads.leadID"
      )
        .where("leads.customerID", customerID)
        .where("leads.status", LeadStatus.CLOSED)
        .select("leads.leadID")
        .orderBy("leads.leadID", "desc")
        .first();

      if (lastLoan) {
        const lastCollection = await this.collectionModel.findOneCollection(
          { leadID: lastLoan.leadID, status: CollectionStatus.CLOSED },
          ["*"],
          [{ column: "collectionID", order: "desc" }]
        );

        if (lastCollection) {
          const collectedDate = momentTz(lastCollection.collectedDate)
            .tz("Asia/Kolkata")
            .startOf("day");

          let currentDate = momentTz().tz("Asia/Kolkata").startOf("day"); // Gets the current date

          let dateDiff = currentDate.diff(collectedDate, "days");

          if (dateDiff > 60) {
            lastClosedLeadDay = true;
          }
        }
      }
    }

    if (fourthLead || lastClosedLeadDay) {
      needDocument = true;
    }

    return needDocument;
  }

  async checkCustomerLastLeadNotRequiredLeadCheck(customerID: number) {
    let status = false;

    const secondLeadID: ILead = await this.leadModel.LeadsKnex.where(
      "customerID",
      customerID
    )
      .select("leads.leadID", "leads.status")
      .orderBy("leadID", "desc")
      .offset(1)
      .limit(1)
      .first();

    if (
      secondLeadID &&
      secondLeadID?.status &&
      secondLeadID?.status === LeadStatus.NOT_REQUIRED
    ) {
      const notReqLead = await this.callHistoryLogsModel.findOne({
        where: {
          status: LeadStatus.NOT_REQUIRED,
          customerID,
          leadID: secondLeadID.leadID,
        },
      });

      if (notReqLead) {
        let currentDate = momentTz().tz("Asia/Kolkata").startOf("day");
        let createdDate = momentTz(notReqLead.createdDate)
          .tz("Asia/Kolkata")
          .startOf("day");

        // Calculate the difference in days
        let dateDiff = currentDate.diff(createdDate, "days");

        // Check if the difference is 7 days or less
        if (dateDiff <= 7) {
          status = true;
        }
      }
    }

    return status;
  }

  async getLeadDetails(customerID: number) {
    return await this.leadModel.LeadsKnex.where({ customerID })
      .select("leadID", "productID as productId", "fbLeads")
      .orderBy("leadID", "desc")
      .first();
  }

  async calculateInterestTillToday(
    disbursalAmount: number,
    dailyRoi: number,
    disbursalDate: Date | string
  ) {
    if (!disbursalDate) {
      return { interestTillToday: 0, daysPassed: 0, dailyInterest: 0 };
    }

    const disbursedMoment = moment(disbursalDate);

    if (!disbursedMoment.isValid()) {
      return { interestTillToday: 0, daysPassed: 0, dailyInterest: 0 };
    }

    const today = moment().startOf("day");
    const disbursed = disbursedMoment.startOf("day");

    const daysPassed = Math.max(1, today.diff(disbursed, "days"));

    const dailyInterest = disbursalAmount * (dailyRoi / 100);

    const interestTillToday = daysPassed > 0 ? dailyInterest * daysPassed : 0;

    return {
      dailyInterest: Math.round(dailyInterest * 100) / 100,
      interestTillToday: Math.round(interestTillToday * 100) / 100,
      daysPassed: daysPassed > 0 ? daysPassed : 0,
    };
  }
}

export default LeadService;

export const leadService = new LeadService();
