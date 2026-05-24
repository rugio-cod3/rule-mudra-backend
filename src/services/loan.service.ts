import config from "@/config/default";
import { bankingDatamodel } from "@/database/mysql/bankingData";
import { callHistoryLogsModel } from "@/database/mysql/callhistorylogs";
import CollectionModel from "@/database/mysql/collection";
import { leadsApiLogModel } from "@/database/mysql/lead_api_log";
import LoanModel from "@/database/mysql/loan";
import { CollectionStatus } from "@/enums/collection.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { IApproval } from "@/interfaces/approval.interface";
import { ICustomer } from "@/interfaces/customer.interface";
import { ILead } from "@/interfaces/lead.interface";
import {
  ICalculateRepayAmountIpc,
  ILoan,
  TSelectLoan,
} from "@/interfaces/loan.interface";
import { ICustomResponse } from "@/interfaces/response.interface";
import { KnexFindParams, SortCriteria, WhereQuery } from "@/types/model.types";
import { logger } from "@/utils/logger";
import moment from "moment";

class LoanService {
  private loaneModel = new LoanModel();
  private readonly collectionModel = new CollectionModel();
  private readonly leadsApiLogModel = leadsApiLogModel;
  private readonly callHistoryLogsModel = callHistoryLogsModel;
  private readonly bankingDataModel = bankingDatamodel;

  public async findOne(
    where: Partial<ILoan>,
    select: TSelectLoan[] | ["*"] = ["*"],
    order?: SortCriteria<TSelectLoan>
  ): Promise<ILoan> {
    return await this.loaneModel.findOneLoan(where, select, order);
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[]
  ): Promise<ILoan[] | ICustomResponse> {
    try {
      let loan = await this.loaneModel.getLoanData(where, order, select);
      if (loan.length == 0) {
        return null;
      } else {
        return loan; // Return the first lead if found
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

  async count(where?: WhereQuery<ILoan>, whereNot?: WhereQuery<ILoan>) {
    return await this.loaneModel.countLoan(where, whereNot);
  }

  async findLoan(params: KnexFindParams<ILoan, TSelectLoan>) {
    return this.loaneModel.find(params);
  }

  calculateGst(pfAmount: number) {
    return Math.round(pfAmount * (18 / 100));
  }

  async calculateRepayAmountIpc(
    lead: ILead,
    customer: ICustomer,
    approval: IApproval,
    loan: ILoan,
    calculateOnDate?: Date
  ): Promise<ICalculateRepayAmountIpc> {
    console.log("DEBUG - calculateRepayAmountIpc called");
    console.log("DEBUG - Lead:", {
      leadID: lead.leadID,
      status: lead.status,
      ipc: lead.ipc,
    });
    console.log("DEBUG - Approval:", {
      approvalID: approval?.approvalID,
      roi: approval?.roi,
      repayDate: approval?.repayDate,
    });
    console.log("DEBUG - Loan:", {
      loanID: loan?.loanID,
      disbursalAmount: loan?.disbursalAmount,
      disbursalDate: loan?.disbursalDate,
    });

    const response: ICalculateRepayAmountIpc = {
      totalPayableAmount: 0,
      repayDate: null,
      totalInterest: 0,
      dpdCharges: 0,
      principalAmount: 0,
      totalAmount: 0,
      totalAmountInterest: 0,
      totalAmountDpdCharge: 0,
      totalAmountPrincipal: 0,
      normalInterest: 0,
    };

    // Validate required data
    if (!approval || !loan) {
      console.log("ERROR - Missing approval or loan data");
      return response;
    }

    if (!approval.repayDate || !loan.disbursalDate || !loan.disbursalAmount) {
      console.log("ERROR - Missing required fields:", {
        repayDate: approval.repayDate,
        disbursalDate: loan.disbursalDate,
        disbursalAmount: loan.disbursalAmount,
      });
      return response;
    }

    const repayDate = moment(approval.repayDate);
    const disbursalDate = moment(loan.disbursalDate);

    // Validate dates
    if (!repayDate.isValid() || !disbursalDate.isValid()) {
      console.log("ERROR - Invalid dates:", {
        repayDate: approval.repayDate,
        disbursalDate: loan.disbursalDate,
      });
      return response;
    }

    let principleAmount = loan.disbursalAmount;
    let prevPenaltyBalance = 0;
    let prevInterestBalance = 0;
    const sanctionRoi = +config.rate_of_interest;
    let oneTimePenaltyCharge = 0;
    let totalAmount = 0;
    let sanctionTenure = 0;
    let dpdTenure = 0;
    let interest = 0;
    let dpdCharges = 0;
    let closingBalance: number;
    let normalInterest = 0;

    const dpdPenalty = Number(config.dpdPenalty);
    const dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage);

    const penaltyAmount = dpdPenalty + dpdPenalty * (dpdPenaltyGst / 100);

    if (lead.ipc === 0) {
      return response; // return dummy details;
    }

    const repay_date =
      repayDate.diff(new Date(), "days") < 0 ? new Date() : repayDate;
    const repay_tenure = disbursalDate.diff(repay_date, "days");
    const repay_amount = principleAmount * sanctionRoi * repay_tenure;

    // if lead.ipc = 1

    const calculateDate = calculateOnDate ? moment(calculateOnDate) : moment();
    let sanctionTenureForTotal = calculateDate.isSameOrBefore(repayDate, "day")
      ? Math.max(1, calculateDate.diff(disbursalDate, "days"))
      : Math.max(1, repayDate.diff(disbursalDate, "days"));

    let isOverDue = calculateDate.isAfter(repayDate, "day");

    let oneTimePenaltyChargeForTotal = isOverDue ? penaltyAmount : 0;
    let dpdTenureForTotal = isOverDue
      ? calculateDate.diff(repayDate, "days")
      : 0;
    let totalCalculatedAmountForTotal = 0;
    let principalForTotal = principleAmount;

    let interestForTotal =
      principleAmount *
      (+config.rate_of_interest / 100) *
      (sanctionTenureForTotal + dpdTenureForTotal);

    let dpdChargeForTotal =
      principleAmount * (+config.ipcDpdInterest / 100) * dpdTenureForTotal +
      oneTimePenaltyChargeForTotal;
    totalCalculatedAmountForTotal =
      principleAmount + interestForTotal + dpdChargeForTotal;

    if (lead.status === LeadStatus.PART_PAYMENT) {
      const collection = await this.collectionModel.findOneCollection(
        {
          customerID: customer.customerID,
          leadID: lead.leadID,
          loanNo: loan.loanNo,
          status: CollectionStatus.PART_PAYMENT,
          collectionStatus: CollectionStatus.APPROVED,
        },
        ["*"],
        [{ column: "collectionID", order: "desc" }]
      );

      if (collection) {
        closingBalance = collection.closing_balance;
        principleAmount = collection.principal_amount;
        const collectedDate = collection.collectedDate;
        const penaltyBalance = collection.penality_charge;
        prevPenaltyBalance = collection.penality_charge; // ! Review
        prevInterestBalance = collection.total_interest;
        oneTimePenaltyCharge = penaltyBalance ? 0 : oneTimePenaltyCharge;

        const isSameOrBeforeCollectedDate = calculateDate.isSameOrBefore(
          repayDate,
          "day"
        );
        const isSameOrAfterRepayDate = repayDate.isSameOrAfter(collectedDate);

        //calculate tenure

        if (isSameOrBeforeCollectedDate && isSameOrAfterRepayDate) {
          sanctionTenure = Math.max(
            1,
            calculateDate.diff(collectedDate, "days")
          );
        } else if (!isSameOrAfterRepayDate && isSameOrAfterRepayDate) {
          sanctionTenure = Math.max(0, repayDate.diff(collectedDate, "days"));
          dpdTenure = calculateDate.diff(repayDate, "days");
          oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0;
        } else if (!isSameOrAfterRepayDate && !isSameOrAfterRepayDate) {
          dpdTenure = Math.max(0, calculateDate.diff(collectedDate, "days"));
          oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0;
        }

        normalInterest = principleAmount * (sanctionRoi / 100) * sanctionTenure;

        interest =
          principleAmount * (sanctionRoi / 100) * (sanctionTenure + dpdTenure);
        dpdCharges =
          principleAmount *
          (+config.ipcDpdInterest / 100) *
          (dpdTenure + oneTimePenaltyCharge);
      }
    } else if (lead.status === LeadStatus.DISBURSED) {
      sanctionTenure = calculateDate.isSameOrBefore(repayDate, "day")
        ? Math.max(1, calculateDate.diff(disbursalDate, "days"))
        : Math.max(1, repayDate.diff(disbursalDate, "days"));

      dpdTenure = isOverDue ? calculateDate.diff(repayDate, "days") : dpdTenure;
      oneTimePenaltyCharge = isOverDue ? penaltyAmount : oneTimePenaltyCharge;

      normalInterest = principleAmount * (+config.rate_of_interest / 100) * sanctionTenure;

      interest =
        principleAmount * (+config.rate_of_interest / 100) * (sanctionTenure + dpdTenure);
      dpdCharges =
        principleAmount * (+config.ipcDpdInterest / 100) * dpdTenure +
        oneTimePenaltyCharge;
      // ! Handle
    }

    totalAmount = closingBalance ? principleAmount : principleAmount + interest + dpdCharges;

    response.totalPayableAmount = +Number(totalAmount).toFixed(2);
    response.repayDate = new Date(approval.repayDate);
    response.totalInterest = Number(
      (Number(interest) + Number(prevInterestBalance)).toFixed(2)
    );
    response.dpdCharges = Number(
      (Number(dpdCharges) + Number(prevPenaltyBalance)).toFixed(2)
    );
    response.principalAmount = +Number(principleAmount).toFixed(2);
    response.totalAmount = +Number(totalCalculatedAmountForTotal).toFixed(2);
    response.totalAmountInterest = +Number(interestForTotal).toFixed(2);
    response.totalAmountDpdCharge = +Number(dpdChargeForTotal).toFixed(2);
    response.totalAmountPrincipal = +Number(principalForTotal).toFixed(2);
    response.normalInterest = +Number(normalInterest).toFixed(2);

    // Debug logging for final calculation
    console.log("DEBUG - Final calculation results:", {
      totalAmount,
      totalPayableAmount: response.totalPayableAmount,
      principleAmount,
      interest,
      dpdCharges,
      sanctionTenure,
      dpdTenure,
      normalInterest,
    });

    return response;
  }

  calculateInterest(
    disbursalAmount: number,
    roi: number,
    tenure: number
  ): number {
    return disbursalAmount * (roi / 100) * tenure;
  }

  async canUpgradeLoanAmount(
    customerID: number,
    leadID: number,
    mobile: string
  ) {
    const loanCount = await this.count({
      customerID,
      status: LeadStatus.DISBURSED,
    });

    if (loanCount > 0) return false;

    // Need to make these checkes
    const [surrogateCount, callHistoryCheck, bankingDataCount] =
      await Promise.all([
        this.leadsApiLogModel.count({
          where: {
            mobile_no: mobile,
            api_type: LeadLogApiType.BANKING_SURROGATE,
            leadID: String(leadID),
          },
        }),
        this.callHistoryLogsModel.findOne({
          where: { customerID, leadID, status: LeadStatus.APPROVED_PROCESS },
          order: [{ column: "callHistoryID", order: "desc" }],
          select: ["calledBy"],
        }),
        this.bankingDataModel.count({
          where: { customerID, leadID },
        }),
      ]);

    if (
      surrogateCount > 0 ||
      callHistoryCheck?.calledBy !== +config.defaultUserId ||
      bankingDataCount > 0
    )
      return false;

    return true;
  }
}

export default LoanService;
export const loanService = new LoanService();
