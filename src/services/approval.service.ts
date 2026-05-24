import config from "@/config/default";
import ApprovalModel from "@/database/mysql/approval";
import { leadModel } from "@/database/mysql/leads";
import { stepTrackerModel } from "@/database/mysql/step_tracker";
import { ApprovalStatus } from "@/enums/approvalStatus.enum";
import { CallType } from "@/enums/callHistory.enum";
import { CollectionStatus } from "@/enums/collection.enum";
import { adminFeeInPercentage, BranchName } from "@/enums/common.enum";
import { DateDifference } from "@/enums/finbox.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { LoanStatus } from "@/enums/loan.enum";
import { StepProvider } from "@/enums/step.enum";
import { IApproval, TSelectApproval } from "@/interfaces/approval.interface";
import { ICallHistoryModel } from "@/interfaces/callHistory.interace";
import { ICallHistoryLog } from "@/interfaces/callhistorylogs.interface";
import { ILead } from "@/interfaces/lead.interface";
import { ILeadsAutoStatusModel } from "@/interfaces/leadsStatus.interface";
import { ICustomResponse } from "@/interfaces/response.interface";
import { customerService } from "@/services/customer.service";
import {
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from "@/types/model.types";
import { getCurrentTime, getDifferenceInDays } from "@/utils/dateTimeFunctions";
import { logger } from "@/utils/logger";
import moment from "moment";
import { callHistoryservice } from "./callHistory.service";
import CallHistoryLogService from "./callhistorylog.service";
import CollectionService from "./collection.service";
import { leadService } from "./lead.service";
import { leadsAutoStatusservice } from "./leadsAutoStatus.service";
import LoanService from "./loan.service";
import FinboxService, { finboxService } from "./thirdParty/finbox.service";

class ApprovalService {
  private approvalModel = new ApprovalModel();
  private readonly callHistoryLogsService = new CallHistoryLogService();
  private readonly loanService = new LoanService();
  private readonly collectionService = new CollectionService();
  private readonly callHistoryService = callHistoryservice;
  private readonly leadLogsService = leadsAutoStatusservice;
  private readonly finboxService = finboxService;
  private readonly leadService = leadService;
  private readonly customerService = customerService;
  private readonly stepTrackerModel = stepTrackerModel;
  private readonly leadModel = leadModel;

  async findOne(
    where: WhereQuery<IApproval>,
    select: SelectFields<TSelectApproval> = ["*"],
    order?: SortCriteria<TSelectApproval>
  ): Promise<IApproval> {
    return await this.approvalModel.findOneApproval(where, select, order);
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[]
  ): Promise<IApproval[] | ICustomResponse> {
    try {
      let approvals = await this.approvalModel.getApprovals(
        where,
        order,
        select
      );
      if (approvals == null || approvals.length == 0) {
        return null;
      } else {
        return approvals; // Return the first lead if found
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

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let approval_count = await this.approvalModel.countApprovals(where);
      if (approval_count == null) {
        return 0;
      } else {
        return approval_count; // Return the first lead if found
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

  async create(data: InsertData<IApproval>): Promise<number[]> {
    return await this.approvalModel.insert(data);
  }

  async updateOne(
    where: WhereQuery<IApproval>,
    update: UpdateQuery<IApproval>
  ): Promise<number> {
    return await this.approvalModel.findOneAndUpdateApproval(where, update);
  }

  public async findByFilter(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
    page: number,
    perPage: number
  ): Promise<IApproval[] | ICustomResponse> {
    try {
      let approvals = await this.approvalModel.getApprovalsByFilter(
        where,
        order,
        select,
        page,
        perPage
      );
      if (approvals == null || approvals.length == 0) {
        return null;
      } else {
        return approvals; // Return the first lead if found
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

  async rejectProcessCustomer(leadID: number, remark: string) {
    const lead = await leadService.findOne({ leadID });

    if (!lead) return false;

    const customer = await this.customerService.findOne({
      customerID: lead.customerID,
    });

    if (!customer) return false;

    const amount = 0;
    const repayDate = new Date();
    const alternateMobile = customer.mobile;
    const officialEmail = customer.email;
    const status = ApprovalStatus.RejectedProcess;
    const approvedBy = 1; // default user id

    const adminFee = (amount * adminFeeInPercentage) / 100;
    const GstOfAdminFee = adminFee * 0.18;

    const approvalData: InsertData<IApproval> = {
      leadID,
      customerID: lead.customerID,
      branch: BranchName.DELHI,
      loanAmtApproved: amount,
      tenure: 0,
      roi: +config.rate_of_interest,
      repayDate,
      adminFee,
      GstOfAdminFee,
      alternateMobile: String(alternateMobile),
      officialEmail,
      cibil: 0,
      activeLoans: 0,
      status,
      remark,
      employmentType: customer.employeeType,
      creditedBy: approvedBy,
    };

    await this.create(approvalData);

    await leadService.updateOne(
      {
        customerID: customer.customerID,
        leadID,
      },
      { status: LeadStatus.REJECTED_PROCESS }
    );

    await this.callHistoryLogsService.create({
      customerID: lead.customerID,
      leadID,
      callType: "IVR",
      status,
      appAmount: String(amount),
      noteli: status,
      remark,
      callbackTime: new Date(),
      calledBy: approvedBy,
    });

    return true;
  }

  async autoApproveRepeatCustomer(
    leadID: number,
    customerID: number,
    checkOfferAmount = 0,
    newOfferAmount = 0
  ) {
    let offerAmount = 0;

    if (leadID && customerID) {
      let days = 7;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const leadIds: any[] = [];

      let leadCount: number;
      if (checkOfferAmount === 0) {
        leadCount = await leadService.count(
          { customerID, status: LeadStatus.CLOSED },
          { leadID }
        );
      } else {
        leadCount = await leadService.count({
          customerID,
          status: LeadStatus.CLOSED,
        });
      }
      let loanCount = await this.loanService.count(
        { customerID, status: LeadStatus.DISBURSED },
        { disbursalRefrenceNo: "" }
      );

      if (leadCount === loanCount) {
        const collection = await this.collectionService.findOne(
          {
            customerID,
            collectionStatus: LeadStatus.APPROVED,
            status: CollectionStatus.CLOSED,
          },
          ["*"],
          [{ column: "leadID", order: "desc" }]
        );

        if (collection) {
          const getLastLeadId = collection.leadID;
          const getLoanLeadDetail = await leadService.getLoanLeadDetail(
            getLastLeadId
          );
          const approval = getLoanLeadDetail?.creda;

          if (approval) {
            const cloaCheck = await this.collectionService.findOne(
              {
                customerID,
                leadID: getLastLeadId,
                collectionStatus: LeadStatus.APPROVED,
                status: CollectionStatus.CLOSED,
              },
              ["*"],
              [{ column: "leadID", order: "desc" }]
            );

            const crp = new Date(approval.repayDate);
            crp.setDate(crp.getDate() + days);
            // Start from here
            if (cloaCheck && crp >= new Date(cloaCheck.collectedDate)) {
              offerAmount = approval.loanAmtApproved;
              const repayDateDay = new Date(
                getLoanLeadDetail.creda.repayDate
              ).getDate();
              const customerData = await customerService.findOne({
                customerID,
              });
              let salaryDate = repayDateDay;

              if (customerData && customerData.salary_date) {
                salaryDate = Number(customerData.salary_date);
              }

              const finboxService = new FinboxService();
              const repayDateFind = await finboxService.repayDateFind(
                String(salaryDate)
              );
              const repayDate = repayDateFind?.formattedDate
                ? repayDateFind?.formattedDate
                : endDate.toISOString().split("T")[0];

              const diff = new Date(repayDate).getTime() - new Date().getTime();
              const tenureDays = Math.abs(
                Math.round(diff / (1000 * 60 * 60 * 24))
              );

              delete approval.createdDate;
              delete approval.approvalID;

              // Set ROI from environment variable for all cases
              approval.roi = +config.rate_of_interest;

              if (approval.adminFee === 0) {
                approval.adminFee = Math.round(approval.loanAmtApproved * 0.1);
              }

              approval.GstOfAdminFee = Math.round(approval.adminFee * 0.18);
              const lastLoanRepayDate = getLoanLeadDetail.creda.repayDate;
              const lastLoanClosed = cloaCheck.collectedDate;
              const lastLoanDisbursed = getLoanLeadDetail.disba.disbursalDate;

              const collectedTimestamp = new Date(lastLoanClosed).getTime();
              const disbursalTimestamp = new Date(lastLoanDisbursed).getTime();
              const checkDifference = collectedTimestamp - disbursalTimestamp;
              const daysDifference = Math.floor(
                checkDifference / (1000 * 60 * 60 * 24)
              );
              const repayTimestamp = new Date(lastLoanRepayDate).getTime();
              const dpd =
                (collectedTimestamp - repayTimestamp) / (1000 * 60 * 60 * 24);

              if (
                collectedTimestamp > disbursalTimestamp &&
                daysDifference >= 15 &&
                dpd <= 0 &&
                loanCount + 1 >= 4 &&
                (loanCount + 1) % 4 === 0
              ) {
                let currentLoanAmount = approval.loanAmtApproved;

                if (currentLoanAmount < 7000) {
                  const increase = 500;
                  const newLoanAmount = currentLoanAmount + increase;
                  const newLoanAmountRounded = newLoanAmount;
                  offerAmount = newLoanAmountRounded;
                } else {
                  const increase = currentLoanAmount * 0.08;
                  const newLoanAmount = currentLoanAmount + increase;
                  const newLoanAmountRounded =
                    Math.round(newLoanAmount / 1000) * 1000;
                  offerAmount = newLoanAmountRounded;
                }

                approval.loanAmtApproved = offerAmount;
                const currentPFRatio = approval.adminFee / currentLoanAmount;
                const newProcessingFee = Math.round(
                  offerAmount * currentPFRatio
                );
                approval.adminFee = newProcessingFee;
                approval.GstOfAdminFee = this.loanService.calculateGst(
                  approval.adminFee
                );
              }

              if (newOfferAmount > 999) {
                const currentLoanAmount = approval.loanAmtApproved;
                approval.loanAmtApproved = newOfferAmount;
                const currentPFRatio = approval.adminFee / currentLoanAmount;
                const newProcessingFee = Math.round(
                  newOfferAmount * currentPFRatio
                );
                approval.adminFee = newProcessingFee;
                approval.GstOfAdminFee = this.loanService.calculateGst(
                  approval.adminFee
                );
              }

              if (checkOfferAmount === 0) {
                approval.leadID = leadID;
                approval.tenure = tenureDays;
                approval.repayDate = moment(repayDate).toDate();
                approval.status = ApprovalStatus.ApprovedProcess;
                approval.remark = ApprovalStatus.ApprovedProcess;
                approval.creditedBy = 1;
                approval.sanctionalloUID = "1";
                approval.roi = +config.rate_of_interest;

                const approvalId = await this.create(approval);
                leadIds.push(leadID);
                leadIds.push(approval);

                if (approvalId) {
                  await leadService.updateOne(
                    { leadID },
                    { status: LeadStatus.APPROVED_PROCESS }
                  );

                  // save to callHistory and logs

                  const callHistoryData: InsertData<ICallHistoryModel> = {
                    customerID,
                    leadID,
                    callType: CallType.IVR,
                    status: LeadStatus.APPROVED_PROCESS,
                    remark: LeadStatus.APPROVED_PROCESS,
                    noteli: "App Auto Approved",
                    callbackTime: new Date(),
                    calledBy: 1,
                  };

                  const callHistoryLogData: InsertData<ICallHistoryLog> = {
                    customerID,
                    leadID,
                    callType: CallType.IVR,
                    status: LeadStatus.APPROVED_PROCESS,
                    remark: LeadStatus.APPROVED_PROCESS,
                    noteli: "App Auto Approved",
                    callbackTime: new Date(),
                    appAmount: approval?.loanAmtApproved
                      ? String(approval?.loanAmtApproved)
                      : "0",
                    calledBy: 1,
                  };

                  await Promise.all([
                    this.callHistoryService.create(callHistoryData),
                    this.callHistoryLogsService.create(callHistoryLogData),
                  ]);
                }
              }
            }
          }
        }
      }
      if (checkOfferAmount === 0) {
        if (leadIds.length > 0) {
          const data: ILeadsAutoStatusModel = {
            type: 1,
            agent_id: 1,
            lead_ids: JSON.stringify(leadIds),
          };
          await this.leadLogsService.create(data);
          return 1;
        }
      } else {
        return offerAmount;
      }
    }
  }

  async findRepayDate(approval: IApproval, salaryDate: string) {
    const { repayDate, tenure } = approval;
    const difference = getDifferenceInDays(
      getCurrentTime(false),
      repayDate as Date
    );

    if (difference > DateDifference.LESSER)
      return { repayDate, tenure, salaryDate };
    // If difference is <=6

    if (!salaryDate) salaryDate = "1";

    const { formattedDate, difference: repayDateDifference } =
      await this.finboxService.repayDateFind(salaryDate);

    return {
      repayDate: moment(formattedDate).toDate(),
      tenure: repayDateDifference,
      salaryDate,
    };
  }

  async checkCustomerApproval(customerID: number, lead?: ILead) {
    // ! 1_page flow check
    const loanCount = await this.loanService.count({
      customerID,
      status: LoanStatus.DISBURSED,
    });

    if (loanCount) return true;

    // if !loan found as disbursed check any approvals

    const approvalCount = await this.approvalModel.count({ customerID });

    if (approvalCount) return true;

    return false;
  }

  async checkRepeatFlowOrNew(customerID: number, leadID: number) {
    const lastUserStep = await this.stepTrackerModel
      .StepTrackerKnex()
      .join("step_control as sc", "step_tracker.step_id", "=", "sc.id")
      .where("step_tracker.customer_id", customerID)
      .andWhere("sc.provider_id", StepProvider.REPEAT_CUSTOMER)
      // .andWhere('step_tracker.lead_id', leadID)
      .select(
        "sc.step_name",
        "sc.provider_id",
        "step_tracker.id",
        "step_tracker.step_id"
      )
      .limit(1);

    if (lastUserStep[0]) {
      return StepProvider.REPEAT_CUSTOMER;
    }

    return StepProvider.EXISTING;
  }

  async getApprovedLoanAmount(customerID: number) {
    const lead = await this.leadModel.LeadsKnex.join(
      "approval as ap",
      "ap.leadID",
      "=",
      "leads.leadID"
    )
      .where("leads.customerID", customerID)
      .where("leads.status", LeadStatus.CLOSED)
      .select("ap.loanAmtApproved")
      .orderBy("leads.leadID", "desc")
      .first();

    return lead ? lead.loanAmtApproved * config.reloanMax : null;
  }

  async delete(where: WhereQuery<IApproval>): Promise<number> {
    return await this.approvalModel.delete(where);
  }
}

export default ApprovalService;
export const approvalService = new ApprovalService();
