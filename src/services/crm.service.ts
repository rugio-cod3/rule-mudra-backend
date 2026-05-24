import config from "@/config/default";
import ApprovalModel from "@/database/mysql/approval";
import EmiModel from "@/database/mysql/emi";
import { ApprovalStatus } from "@/enums/approvalStatus.enum";
import { PaymentCheckoutStatus } from "@/enums/cibil.enum";
import { BranchName } from "@/enums/common.enum";
import { Charges, CreditStatus } from "@/enums/credit.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { ProductID } from "@/enums/product.enum";
import { BadRequestError, NotFoundError } from "@/errors";
import CommonHelper from "@/helpers/common";
import {
  calculateNewDueDate,
  calculateRepayDate,
  getAdjustedDueDate,
} from "@/helpers/date.helpers";
import EMIHelper from "@/helpers/emi.helpers";
import {
  IApplyPenaltyPayload,
  ICreditDetailsPayload,
  ICSVGeneration,
  IEmiCalculatorPayload,
  IErrorLog,
  IExselMandate,
  IFileUploadPayload,
  IFileUrlPayload,
  IGenerateEmiPayload,
  IGetAmountToBeDisbursedPayload,
  IGetDocsRequirementsPayload,
  IGetEmiLoanDetailsPayload,
  IGetEmisPayload,
  ILeadUpdatePayload,
  ILoanInfo,
  ILoanQueryResult,
  IMandatePayload,
  IpaydayToEmiConversionPayload,
  IPostRazorpayRequest,
  IRazorpayRequestData,
  IStatusInfo,
  IUpdatePaymentPayload,
} from "@/interfaces/crm.interface";
import { IEmi } from "@/interfaces/emi.interface";
import { IEMIDoc } from "@/interfaces/emidoc.interface";
import { IServiceResponse } from "@/interfaces/service.interface";
import { IPayUReq } from "@/interfaces/transections.interface";
import OnlinePaymentModel from "@/mysql/onlinepayment";
import S3Service from "@/services/thirdParty/s3.service";
import { webhookService } from "@/services/webhook.service";
import { compareDates, dateCheck } from "@/utils/dateTimeFunctions";
import {
  calculateTotalRepayEmiAmount,
  calculateTotalRepayPaydayAmountIPC,
  calculateTotalRepayPaydayAmountNonIPC,
} from "@/utils/Ipc_Calculation";
import { getKnexInstance } from "@/utils/mysql";
import RazorpayPG from "@/utils/razorpayClient.utils";
import axios from "axios";
import * as crypto from "crypto";
import csvParser from "csv-parser";
import { format } from "date-fns";
import fs from "fs";
import moment from "moment";
import path from "path";
import * as phpSerialize from "php-serialize";
import { Readable } from "stream";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import ApprovalService from "./approval.service";
import CallHistoryLogService from "./callhistorylog.service";
import CollectionService from "./collection.service";
import CreditService from "./credit.service";
import CustomerService from "./customer.service";
import EmiService from "./emi.service";
import LeadService from "./lead.service";
import LoanService from "./loan.service";
import OtherChargesService from "./other_charges.service";
import ResponseService from "./response.service";
import TransectionService from "./teansections.services";

class CrmService extends ResponseService {
  private readonly leadService = new LeadService();
  private readonly emiHelper = new EMIHelper();
  private readonly creditService = new CreditService();
  private readonly emiModel = new EmiModel();
  private readonly emiService = new EmiService();
  private readonly transactionService = new TransectionService();
  private readonly loanService = new LoanService();
  private readonly collectionService = new CollectionService();
  private readonly callHistoryLogService = new CallHistoryLogService();
  private readonly otherChargesService = new OtherChargesService();
  private readonly approvalService = new ApprovalService();
  private readonly commonHelper = new CommonHelper();
  private readonly approvalModel = new ApprovalModel();
  private readonly s3Service = new S3Service();
  private readonly razorpayPg = new RazorpayPG();
  private readonly customerService = new CustomerService();
  private readonly onlinePaymentModel = new OnlinePaymentModel();
  private readonly webhookService = webhookService;

  constructor() {
    super();
  }
  get Knex() {
    let db = getKnexInstance();
    return db;
  }
  // New code
  async leadUpdate(payload: ILeadUpdatePayload): Promise<IServiceResponse> {
    const { leadID } = payload;

    let lead = await this.leadService.findOne({ leadID }, ["*"]);

    if (!lead) throw new NotFoundError("No Lead Found");

    // if (lead.status == LeadStatus.FRESH_LEAD)
    //   throw new BadRequestError('Emi Loan Is Only For Repeat Users')
    await this.leadService.updateOne(
      { leadID },
      { productID: 1, status: LeadStatus.APPROVED_PROCESS },
    );

    return this.serviceResponse(200, {}, "Lead Updates To Product Type: EMI");
  }

  // New code
  async emiCalculator(
    payload: IEmiCalculatorPayload,
  ): Promise<IServiceResponse> {
    const { loanAmount, roi, tenure, firstRepayDate } = payload;
    let emiDoc: IEMIDoc;
    if (firstRepayDate) {
      let FirstDueDate = await calculateRepayDate(firstRepayDate);
      FirstDueDate = new Date(format(new Date(FirstDueDate), "yyyy-MM-dd"));

      emiDoc = (await this.emiHelper.emiGenerator(
        loanAmount,
        roi,
        tenure,
        FirstDueDate,
      )) as IEMIDoc;

      emiDoc.emiBreakdown.forEach((emi, index) => {
        const dueDate = new Date(FirstDueDate);
        dueDate.setMonth(dueDate.getMonth() + index);
        emi.dueDate = new Date(format(new Date(dueDate), "yyyy-MM-dd"));
      });
    } else {
      emiDoc = (await this.emiHelper.emiGenerator(
        loanAmount,
        roi,
        tenure,
      )) as IEMIDoc;

      emiDoc.emiBreakdown.forEach((emi) => {
        emi.dueDate = null;
      });
    }
    return this.serviceResponse(
      200,
      emiDoc,
      "Here Is The Proposed EMI Breakdown",
    );
  }

  // New code
  async creditDetails(
    payload: ICreditDetailsPayload,
  ): Promise<IServiceResponse> {
    const {
      adminFee,
      aqb,
      branch,
      customer_id,
      firstDueDate,
      foir,
      lead_id,
      loanAmtApproved,
      roi,
      tenure,
      gst,
    } = payload;

    let customerID = customer_id;
    let leadID = lead_id;
    let loanAmount = loanAmtApproved;
    let processingFee = adminFee;
    let dayOfRepayDate = firstDueDate >= 29 ? 1 : firstDueDate;
    let FirstDueDate: Date;

    if (tenure >= 6) {
      let firstDueDate = new Date(format(new Date(), "yyyy-MM-dd"));
      FirstDueDate = await getAdjustedDueDate(firstDueDate);
    } else {
      FirstDueDate = await calculateRepayDate(dayOfRepayDate);
    }
    FirstDueDate = new Date(format(new Date(FirstDueDate), "yyyy-MM-dd"));

    // check if credit already exist for this lead
    let credit = await this.creditService.findOne({ leadID, customerID }, [
      "*",
    ]);

    if (credit)
      throw new BadRequestError("Credit with this lead already exist");

    // find lead
    let lead = await this.leadService.findOne(
      { leadID, productID: 1, customerID },
      ["*"],
    );
    if (!lead) throw new BadRequestError("Lead Not Found of EMI Type");

    // roi check
    if (roi < 12 || roi > 365)
      throw new BadRequestError(
        "Rate Of Intrest Can only be in Between 12% - 365%",
      );
    //tenure check
    if (tenure < 2 || tenure > 36)
      throw new BadRequestError("Allowed Tenure: 3 months to 36 months");
    let days = dateCheck(FirstDueDate);
    if (days > 45) {
      throw new BadRequestError(
        "Invalid Date: Should Be Less Then 45 Days From Now",
      );
    } else if (days < 15) {
      throw new BadRequestError(
        "Invalid Date: Should Be Greater Then or equal 15 Days From Now",
      );
    }
    await this.creditService.create(
      customerID,
      leadID,
      1,
      foir,
      aqb,
      branch,
      roi,
      tenure,
      processingFee,
      loanAmount,
      FirstDueDate,
      gst,
    );
    return this.serviceResponse(200, {}, "Credit Details Recorded");
  }

  // New code
  async getAmountToDisbursed(
    payload: IGetAmountToBeDisbursedPayload,
  ): Promise<IServiceResponse> {
    const { creditID } = payload;

    let credit = await this.creditService.findOne({ creditID }, ["*"]);

    if (!credit) throw new NotFoundError("Credit not found");

    let amount = credit.principal - credit.processingFee - credit.gst;
    let brokenPeriodIntrest = await this.emiHelper.bpiCalculator(
      credit.principal,
      credit.roi,
      credit.firstDueDate,
    );

    await this.creditService.updateOne(
      { creditID },
      {
        brokenPeriodIntrest,
      },
    );
    return this.serviceResponse(200, { amount }, "Amount to be disbursed");
  }

  // New code
  async generateEMI(payload: IGenerateEmiPayload): Promise<IServiceResponse> {
    const {
      creditID,
      createdBy,
      gateway,
      loanNo,
      mode,
      order_id,
      referanceId,
      updatedBy,
    } = payload;

    let credit = await this.creditService.findOne({ creditID });

    if (!credit) throw new NotFoundError("Credit not found");

    let emi = await this.emiModel.findAll(
      { creditID },
      [{ column: "emiID", order: "desc" }],
      ["creditID", "emiID"],
    );
    if (emi.length > 0) throw new BadRequestError("EMIs Already Exists");

    let loan = await this.loanService.findOne({ leadID: credit.leadID }, [
      "loanNo",
      "disbursalDate",
    ]);
    if (!loan)
      throw new BadRequestError("Error In Generating EMI[loan not Found]");

    let firstDueDate = credit.firstDueDate;
    let disbursalDate = loan.disbursalDate;

    let dueDate: Date;
    if (credit.tenure < 6) {
      dueDate = await calculateNewDueDate(firstDueDate, disbursalDate);
    }
    dueDate = credit.firstDueDate;

    // const dueDate = await calculateNewDueDate(firstDueDate, disbursalDate)
    await this.creditService.updateOne(
      { creditID: creditID },
      {
        firstDueDate: dueDate,
      },
    );
    await this.approvalService.updateOne(
      { leadID: credit.leadID },
      {
        repayDate: dueDate,
      },
    );
    let emiDoc = (await this.emiHelper.emiGenerator(
      credit.principal,
      credit.roi,
      credit.tenure,
      dueDate,
      disbursalDate,
    )) as IEMIDoc;
    if (!emiDoc) throw new BadRequestError("Error In Generating EMI");
    let amountToBeRepayed = emiDoc.repaymentAmount;
    let bpiCharges = await this.emiHelper.bpiCalculator(
      credit.principal,
      credit.roi,
      dueDate,
      disbursalDate,
    );
    await this.creditService.updateOne(
      { creditID: creditID },
      {
        // actually when bpiCharges is negative then this is not bpi as discussed with arvindSir
        brokenPeriodIntrest: bpiCharges < 0 ? 0 : bpiCharges,
        amountToBeRepayed: amountToBeRepayed,
        interest: emiDoc.interest,
      },
    );
    let openingBalance = emiDoc.amount;
    for (let emi of emiDoc?.emiBreakdown) {
      let adjustedDueDate = new Date(dueDate);
      let data = {
        creditID: credit.creditID,
        customerID: credit.customerID,
        leadID: credit.leadID,
        productID: credit.productID,
        principal: emi.principal,
        interest: emi.interest,
        amountPayable: emi.emi,
        openingBalance: openingBalance,
        closingBalance: emi.remainingPrincipal,
        amountRemains: emi.emi,
        dueDate: adjustedDueDate,
        status: "due",
      };
      await this.emiModel.insert(data);
      dueDate.setMonth(dueDate.getMonth() + 1);
      openingBalance = emi.remainingPrincipal;
    }
    let emis = await this.emiModel.findAll(
      { creditID },
      [{ column: "emiID", order: "asc" }],
      ["*"],
    );

    emis = emis.map((emi) => {
      emi.dueDate = new Date(format(new Date(emi.dueDate), "yyyy-MM-dd"));
      return emi;
    });
    //UPDATE Credit Status To Disbursed
    await this.creditService.updateOne(
      { creditID: creditID },
      {
        status: CreditStatus.DISBURSED,
      },
    );

    //INSERT Transection
    await this.transactionService.create(
      credit.customerID,
      credit.leadID,
      loanNo,
      2, //status
      CreditStatus.DISBURSED, //type
      mode,
      referanceId,
      order_id,
      0, //deleted
      gateway,
      createdBy,
      updatedBy,
      credit.principal, //principal or netDisbursed amount ?
    );

    return this.serviceResponse(200, emis, "EMI Generated");
  }

  // New code
  async updatePayment(
    payload: IUpdatePaymentPayload,
  ): Promise<IServiceResponse> {
    const { creditID, amount, gateway, method } = payload;

    let credit = await this.creditService.findOne({ creditID: creditID }, [
      "*",
    ]);

    if (amount > credit.amountToBeRepayed)
      throw new BadRequestError("Amount Should Be Less Then Outstanding");

    let lastEmi = await this.emiService.findOne({ creditID }, ["*"]);

    //FIND LOAN NO FOR COLLECTION
    let loan = await this.loanService.findOne({ leadID: credit.leadID }, [
      "loanNo",
    ]);
    let emis = (await this.emiService.find(
      (knex) =>
        knex
          .where(function () {
            this.where("status", "partial-paid").orWhere("status", "due");
          })
          .andWhere("creditID", creditID),
      [{ column: "emiID", order: "desc" }],
      ["*"],
    )) as IEmi[];
    let amountRemains = amount;
    let payingEmiCount = 0;
    if (emis) {
      for (let emi of emis) {
        let delayDays =
          Math.floor(
            new Date(Date.now()).getTime() - new Date(emi.dueDate).getTime(),
          ) /
          (1000 * 60 * 60 * 24);
        if (amountRemains > emi.amountRemains) {
          await this.emiService.updateOne(
            {
              emiID: emi.emiID,
            },
            {
              status: "paid",
              actualPaymentDate: new Date(Date.now()),
              delayDays,
              // paymentID: paymentdetails.id,
              amountRemains: 0,
            } as IEmi,
          );
          //TRANSECTION HANDELLER
          if (Math.round(emi.amountRemains) > Math.round(emi.panelty || 0)) {
            //INSERT TRANSECTION
            await this.transactionService.create(
              credit.customerID,
              credit.leadID,
              loan.loanNo,
              2, //status
              "collection", //type
              method,
              `refid/${emi.emiID}`,
              `order_id`,
              0, //deleted
              "razorpay",
              1,
              1,
              Math.round(emi.amountRemains) - Math.round(emi.panelty || 0), //amount
            );
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                2, //status
                "panelty", //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                "razorpay",
                1,
                1,
                Math.round(emi.panelty), //amount
              );
            }
          } else {
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                2, //status
                "panelty", //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                "razorpay",
                1,
                1,
                Math.round(emi.amountRemains), //amount
              );
            }
          }
          payingEmiCount += 1;
        } else if (amountRemains < emi.amountRemains) {
          let updateemi = await this.emiService.updateOne(
            {
              emiID: emi.emiID,
            },
            {
              status: "partially-paid",
              actualPaymentDate: new Date(Date.now()),
              delayDays,
              // paymentID: paymentdetails.id,
              amountRemains: emi.amountRemains - amountRemains,
            } as IEmi,
          );
          //TRANSECTION HANDELLER
          if (Math.round(emi.amountRemains) > Math.round(emi.panelty || 0)) {
            //INSERT TRANSECTION
            await this.transactionService.create(
              credit.customerID,
              credit.leadID,
              loan.loanNo,
              2, //status
              "collection", //type
              method,
              `refid/${emi.emiID}`,
              `order_id`,
              0, //deleted
              "razorpay",
              1,
              1,
              Math.round(emi.amountRemains) - Math.round(emi.panelty || 0), //amount
            );
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                2, //status
                "panelty", //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                "razorpay",
                1,
                1,
                Math.round(emi.panelty), //amount
              );
            }
          } else {
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                2, //status
                "panelty", //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                "razorpay",
                1,
                1,
                Math.round(emi.amountRemains), //amount
              );
            }
          }
          payingEmiCount += 1;
          break;
        } else {
          await this.emiService.updateOne(
            {
              emiID: emi.emiID,
            },
            {
              status: "paid",
              actualPaymentDate: new Date(Date.now()),
              delayDays,
              // paymentID: paymentdetails.id,
              amountRemains: 0,
            } as IEmi,
          );
          //TRANSECTION HANDELLER
          if (Math.round(emi.amountRemains) > Math.round(emi.panelty || 0)) {
            //INSERT TRANSECTION
            await this.transactionService.create(
              credit.customerID,
              credit.leadID,
              loan.loanNo,
              2, //status
              "collection", //type
              method,
              `refid/${emi.emiID}`,
              `order_id`,
              0, //deleted
              "razorpay",
              1,
              1,
              Math.round(emi.amountRemains) - Math.round(emi.panelty || 0), //amount
            );
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                2, //status
                "panelty", //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                "razorpay",
                1,
                1,
                Math.round(emi.panelty), //amount
              );
            }
          } else {
            //IF EMI HAVE PANELTY THEN INSERT TRANSECTION OF PANELTY
            if (emi.panelty > 0 && emi.paneltyID) {
              await this.transactionService.create(
                credit.customerID,
                credit.leadID,
                loan.loanNo,
                2, //status
                "panelty", //type
                method,
                `refid/${emi.paneltyID}`,
                `order_id`,
                0, //deleted
                "razorpay",
                1,
                1,
                Math.round(emi.amountRemains), //amount
              );
            }
          }
          payingEmiCount += 1;
          break;
        }
        //INSERT MASTER TRANSECTION ENTRY
        if (payingEmiCount > 1) {
          await this.transactionService.create(
            credit.customerID,
            credit.leadID,
            loan.loanNo,
            2, //status
            "collection", //type
            method,
            `REFID/${emi.emiID}`,
            "order_id",
            0, //deleted
            gateway,
            1,
            1,
            amount,
          );
        }
        await this.collectionService.create(
          credit.customerID,
          credit.leadID,
          loan.loanNo,
          amount,
          "Payment Gateway",
          new Date(Date.now()),
          "orderid",
          // paymentdetails.order_id,
          0.0,
          0.0,
          amountRemains >= emi.amountRemains ? "Closed" : "Part Payment",
          "EMI Manual Paid",
          1,
          //new Date(Date.now()),
          "Approved",
          "no",
          "orderid",
          // paymentdetails.order_id,
        );
      }
      let emiRemains = (await this.emiService.countRows((query) =>
        query
          .where(function () {
            this.where("status", "partial-paid").orWhere("status", "due");
          })
          .andWhere("creditID", credit.creditID),
      )) as number;
      let updateCredit = await this.creditService.updateOne(
        { creditID: creditID },
        {
          emiLeft: emiRemains,
          paidAmount: credit.paidAmount + amount,
          amountToBeRepayed: credit.amountToBeRepayed - amount,
        },
      );
      let lead = await this.leadService.findOne({ leadID: credit.leadID }, [
        "status",
      ]);
      let saveObject = {
        customerID: credit.customerID,
        leadID: credit.leadID,
        callType: "IVR",
        status: lead.status,
        appAmount: String(amount),
        noteli: lead.status,
        remark: "Manual EMI Payment",
        callbackTime: new Date(Date.now()),
        calledBy: 1,
        createdDate: new Date(Date.now()),
      };
      await this.callHistoryLogService.create(saveObject);

      await CommonHelper.lastEMIUpdater(
        emiRemains,
        credit.creditID,
        lastEmi.dueDate,
        credit.actualTenure,
        credit.leadID,
      );
    }

    return this.serviceResponse(200, {}, "Payment Update");
  }

  // New code
  async applyPanelty(payload: IApplyPenaltyPayload): Promise<IServiceResponse> {
    const { amount, emiID } = payload;
    //find emi if it is partially paid or due only then panelty can be applied
    let emi = await this.emiService.findOne(
      (knex) =>
        knex
          .where(function () {
            this.where("status", "partial-paid").orWhere("status", "due");
          })
          .andWhere("emiID", emiID),
      ["*"],
    );
    if (!emi) throw new NotFoundError("Emi is Paid Or Wrong EMI Id");

    //find credit for some calculations

    if (compareDates(emi.dueDate, Date.now()))
      throw new BadRequestError("Emi is not Applicable For Paneltys");

    let credit = await this.creditService.findOne({ creditID: emi.creditID }, [
      "*",
    ]);
    if (!credit) {
      throw new NotFoundError("credit not found for this emiID");
    }
    let loanId = await this.loanService.findOne({ leadID: credit.leadID }, [
      "loanID",
    ]);
    if (!loanId) {
      throw new NotFoundError("loanId not found for this EmiID");
    }
    //insert panelty doc
    let panelty = await this.otherChargesService.create(
      emiID,
      emi.creditID,
      amount,
      emi.customerID,
      0,
      "panelty",
      credit.leadID,
      loanId.loanID,
      "due",
    );
    //update emi
    await this.emiService.updateOne(
      { emiID },
      {
        panelty: emi.panelty || 0 + amount,
        amountPayable: emi.amountPayable + amount,
        paneltyID: panelty,
        amountRemains: emi.amountRemains + amount,
      },
    );
    //update credit
    await this.creditService.updateOne(
      { creditID: emi.creditID },
      {
        paneltyEmis: credit.paneltyEmis ? (credit.paneltyEmis += 1) : 1,
        amountToBeRepayed: credit.amountToBeRepayed + amount,
      },
    );
    return this.serviceResponse(200, {}, "Penalty Applied");
  }

  // New code
  async getEmis(payload: IGetEmisPayload): Promise<IServiceResponse> {
    const { customerID } = payload;

    let credit = await this.creditService.findOne(
      { customerID, status: CreditStatus.DISBURSED },
      ["creditID"],
    );
    if (!credit) throw new NotFoundError("No Active Emi Loan Found");

    let getEmis = await this.emiService.find(
      { creditID: credit.creditID },
      [{ column: "customerID", order: "desc" }],
      [
        "creditID",
        "customerID",
        "principal",
        "interest",
        "panelty",
        "amountPayable",
        "openingBalance",
        "closingBalance",
        "dueDate",
        "status",
        "amountRemains",
      ],
    );
    getEmis = getEmis.map((emi) => {
      emi.dueDate = new Date(format(new Date(emi.dueDate), "yyyy-MM-dd"));
      return emi;
    });

    return this.serviceResponse(200, getEmis, "Here is the list of all emis");
  }

  // New code
  async getDocsRequirements(
    payload: IGetDocsRequirementsPayload,
  ): Promise<IServiceResponse> {
    let { loanAmount, roi, tenure, creditId } = payload;

    let credit = await this.creditService.findOne({ creditID: creditId }, [
      "creditID",
      "processingFee",
      "principal",
      "firstDueDate",
      "brokenPeriodIntrest",
      "roi",
      "gst",
      "created_at",
      "leadID",
    ]);

    if (!credit) throw new NotFoundError("No Active Emi Loan Found");

    let processingFee = credit.processingFee;
    let principal = credit.principal;
    let firstDueDate = new Date(format(credit.firstDueDate, "yyyy-MM-dd"));
    //let brokenPeriodIntrest = credit.brokenPeriodIntrest
    let Roi = credit.roi;
    let gst = credit.gst;
    let bpiCharges = await this.emiHelper.bpiCalculator(
      principal,
      Roi,
      firstDueDate,
    );
    //let brokenPeriodInterest = bpiCharges
    let netDisbursedAmount = principal - processingFee - gst;
    let loan = await this.loanService.findOne({ leadID: credit.leadID }, [
      "loanNo",
      "disbursalDate",
    ]);

    const isValidDate = (date: any): boolean => {
      const parsedDate = typeof date === "string" ? new Date(date) : date;
      return (
        parsedDate instanceof Date &&
        !isNaN(parsedDate.getTime()) &&
        parsedDate.getFullYear() > 1900
      );
    };
    let emiDoc: IEMIDoc;
    if (!loan || !isValidDate(loan.disbursalDate)) {
      emiDoc = (await this.emiHelper.emiGenerator(
        +loanAmount,
        +roi,
        +tenure,
        firstDueDate,
      )) as IEMIDoc;
    } else {
      emiDoc = (await this.emiHelper.emiGenerator(
        +loanAmount,
        +roi,
        +tenure,
        firstDueDate,
        loan.disbursalDate,
      )) as IEMIDoc;
    }
    // throw new BadRequestError('Error In Generating EMI[loan not Found]')

    // let emiDoc = (await this.emiHelper.emiGenerator(
    //   +loanAmount,
    //   +roi,
    //   +tenure,
    //   firstDueDate,
    // )) as IEMIDoc

    let amountToBeRepayed = emiDoc.repaymentAmount;
    await this.creditService.updateOne(
      { creditID: creditId },
      {
        // actually when bpiCharges is negative then this is not bpi as discussed with arvindSir
        brokenPeriodIntrest: bpiCharges < 0 ? 0 : bpiCharges,
        amountToBeRepayed: amountToBeRepayed,
        interest: emiDoc.interest,
      },
    );

    emiDoc.emiBreakdown.forEach((emi, index) => {
      const dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + index);
      emi.dueDate = new Date(format(new Date(dueDate), "yyyy-MM-dd"));
      emi["status"] = "due";
    });
    let finalEmiDoc = {
      ...emiDoc,
      processingFee: processingFee,
      firstDueDate: firstDueDate,
      brokenPeriodInterest: bpiCharges < 0 ? 0 : bpiCharges,
      netDisbursedAmount: netDisbursedAmount,
      gst: gst,
    };

    return this.serviceResponse(200, finalEmiDoc, "Final EMI docs");
  }

  // New code
  async getEmiLoanDetails(
    payload: IGetEmiLoanDetailsPayload,
  ): Promise<IServiceResponse> {
    const { leadID, customerID } = payload;

    let lead = await this.leadService.findOne({ leadID, customerID }, [
      "leadID",
      "status",
    ]);

    if (!lead) throw new NotFoundError("No lead data found");

    let credit = await this.creditService.findOne({ customerID, leadID }, [
      "*",
    ]);

    if (!credit) throw new NotFoundError("Emi Loan Not Found'");

    let db = getKnexInstance();

    let getEmis = await db("equated_monthly_installments as emi")
      .where({ "emi.creditID": credit.creditID })
      .leftJoin("other_charges as oc", "emi.emiID", "oc.emiID")
      .select(
        "emi.emiID",
        db.raw("DATE_FORMAT(emi.dueDate, '%d/%m/%Y') as dueDate"),
        "emi.actualPaymentDate",
        "emi.creditID",
        "emi.principal",
        "emi.interest",
        "emi.amountPayable",
        "emi.status",
        "emi.amountRemains",
        "oc.id as other_charge_id",
        "oc.amount as other_charge_amount",
        "oc.discription as other_charge_discription",
        "oc.status as other_charge_status",
      );
    let totalPaneltyAmount = 0;
    let totalBouncingAmount = 0;
    let paneltyEmis = 0;
    for (let emi of getEmis) {
      if (emi.other_charge_amount) {
        paneltyEmis += 1;
        totalPaneltyAmount += emi.other_charge_amount;
        emi.other_charge_discription == "Bouns Charge"
          ? (totalBouncingAmount += emi.other_charge_amount)
          : null;
      }
    }
    let emiDoc = (await this.emiHelper.emiGenerator(
      credit.principal,
      credit.roi,
      credit.tenure,
      credit.firstDueDate,
    )) as IEMIDoc;
    let ApproxEmiAmount =
      getEmis?.length > 0 ? getEmis[0].amountPayable : emiDoc.totalEMI;
    let loanDetails = {
      emiAmount: ApproxEmiAmount,
      branch: credit.branch,
      loanDisbursed: credit.principal - credit.processingFee - credit.gst,
      principle: credit.principal,
      tenure: credit.tenure,
      actualTenure: credit.actualTenure,
      roi: credit.roi,
      intrest: credit.interest,
      paneltyAmount: totalPaneltyAmount,
      bouncingPenalty: totalBouncingAmount,
      paidAmount: credit.repaymentAmount,
      dueAmount: credit.amountToBeRepayed,
      totalEmis: credit.totalEMIs,
      emiLeft: credit.emiLeft,
      peneltyEmis: paneltyEmis,
      proccessingFee: credit.processingFee,
      gst: credit.gst,
    };
    for (let emi of getEmis) {
      let dueDateSplit = emi.dueDate.split("/");
      let dueDate = new Date(
        dueDateSplit[2],
        dueDateSplit[1] - 1,
        dueDateSplit[0],
      );
      console.log(
        dueDate,
        new Date(Date.now()),
        dueDate.getTime() < new Date(Date.now()).getTime(),
      );
      if (dueDate.getTime() < new Date(Date.now()).getTime()) {
        emi.dpd = Math.floor(
          (new Date(Date.now()).getTime() - dueDate.getTime()) /
            (1000 * 24 * 60 * 60),
        );
      } else {
        emi.dpd = 0;
      }
    }

    return this.serviceResponse(
      200,
      { loanDetails, emiList: getEmis },
      "EMI Loan Details",
    );
  }
  async paydayToEmiConversion(
    payload: IpaydayToEmiConversionPayload,
  ): Promise<IServiceResponse> {
    let {
      productId,
      customer_id,
      lead_id,
      loanAmtApproved,
      roi,
      tenure,
      firstDueDate,
      userID,
      adminFee,
    } = payload;

    const lead = await this.leadService.findOne({ leadID: lead_id }, [
      "status",
      "customerID",
    ]);
    if (!lead) throw new NotFoundError("No Lead Found");
    customer_id = lead.customerID;
    let customerData = await this.customerService.findOne(
      { customerID: customer_id },
      ["employeeType"],
    );
    let message: string;
    let baseUrl = this.commonHelper.getBaseUrl();
    if (
      productId !== ProductID.EMI ||
      (lead.status !== LeadStatus.APPROVED_PROCESS &&
        lead.status !== LeadStatus.FRESH_LEAD &&
        lead.status !== LeadStatus.DOCUMENT_RECEIVED)
    ) {
      throw new NotFoundError("Status must be approved and product EMI");
    }
    await axios.put(
      `${baseUrl}/new-api/crm/lead-update`,
      { leadID: lead_id },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    const AdminFee =
      adminFee ??
      Math.floor(
        loanAmtApproved *
          (tenure >= 6
            ? Charges.ADMIN_PERCENTAGE_MAX_TENURE
            : Charges.ADMIN_PERCENTAGE),
      );

    const gst = Math.floor(AdminFee * Charges.GST);

    const credit = await this.creditService.findOne({ leadID: lead_id }, [
      "creditID",
      "firstDueDate",
      "principal",
    ]);
    const creditData = {
      adminFee: AdminFee,
      branch: "delhi",
      customer_id,
      firstDueDate,
      lead_id,
      loanAmtApproved,
      roi,
      tenure,
      gst,
    };

    if (!credit) {
      await axios.post(`${baseUrl}/new-api/crm/creditDetails`, creditData, {
        headers: { "Content-Type": "application/json" },
      });
      message = "Loan converted from Payday to EMI";
    } else {
      let FirstDueDate: Date;
      if (tenure >= 6) {
        let DueDate = new Date(format(new Date(), "yyyy-MM-dd"));
        FirstDueDate = await getAdjustedDueDate(DueDate);
      } else {
        let dayOfRepayDate = firstDueDate >= 29 ? 1 : firstDueDate;
        FirstDueDate = await calculateRepayDate(dayOfRepayDate);
      }
      FirstDueDate = new Date(format(new Date(FirstDueDate), "yyyy-MM-dd"));
      const emiDoc = (await this.emiHelper.emiGenerator(
        loanAmtApproved,
        roi,
        tenure,
        FirstDueDate,
      )) as IEMIDoc;

      await this.creditService.updateOne(
        { creditID: credit.creditID },
        {
          tenure,
          interest: emiDoc.interest,
          amountToBeRepayed: emiDoc.repaymentAmount,
          totalEMIs: emiDoc.totalEMIs,
          emiLeft: emiDoc.EMILeft,
          principal: loanAmtApproved,
          processingFee: AdminFee,
          gst: gst,
          roi: roi,
          firstDueDate: FirstDueDate,
        },
      );
      message = "EMI Loan Modified";
    }
    const updatedCredit = await this.creditService.findOne(
      { leadID: lead_id },
      ["creditID", "firstDueDate"],
    );

    const existingApproval = await this.approvalModel.findOneApproval({
      leadID: lead_id,
    });

    if (existingApproval) {
      await this.approvalModel.findOneAndUpdateApproval(
        { leadID: lead_id },
        {
          loanAmtApproved,
          tenure,
          roi,
          adminFee: AdminFee,
          GstOfAdminFee: gst,
          repayDate: updatedCredit.firstDueDate,
        },
      );
    } else {
      await this.approvalService.create({
        customerID: customer_id,
        leadID: lead_id,
        branch: BranchName.DELHI,
        loanAmtApproved: loanAmtApproved,
        tenure: tenure,
        roi: roi,
        repayDate: updatedCredit.firstDueDate,
        adminFee: AdminFee,
        GstOfAdminFee: gst,
        alternateMobile: "",
        officialEmail: "",
        cibil: 0,
        activeLoans: 0,
        status: ApprovalStatus.ApprovedProcess,
        creditedBy: +config.defaultUserId,
        remark: "Approved Process",
        employmentType: customerData.employeeType ?? "",
      });
    }
    await Promise.all([
      this.leadService.updateOne({ leadID: lead_id }, { sanctionalloUID: 1 }),
      this.callHistoryLogService.create({
        customerID: customer_id,
        leadID: lead_id,
        callType: "IVR",
        status: LeadStatus.APPROVED_PROCESS,
        appAmount: String(loanAmtApproved),
        noteli: "",
        remark: "EMI",
        callbackTime: new Date(
          moment(new Date(Date.now()))
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss"),
        ),
        calledBy: userID ? userID : 1,
      }),
    ]);

    return this.serviceResponse(200, {}, `${message}`);
  }

  private validateCSVHeaders = (header: string[]): boolean => {
    const pattern = /[^a-zA-Z0-9\s]/; // Remove special characters
    const loanHeader = header[0] ? header[0].replace(pattern, "") : "column1";
    const amountHeader = header[1] ? header[1].replace(pattern, "") : "column2";

    return (
      header.length === 2 &&
      loanHeader.trim() === "loanNo" &&
      amountHeader.trim() === "amount"
    );
  };

  async uploadBulkMandateFile(
    payload: IFileUploadPayload,
  ): Promise<IServiceResponse> {
    let { image, userId, name } = payload;
    const results = [];
    let db = getKnexInstance();
    const uploadedTrack = uuidv4();
    if (image.size > 2 * 1024 * 1024) {
      throw new BadRequestError("File size must be less than 2MB.");
    }
    const fileStream = Readable.from(image.buffer);

    fileStream
      .pipe(csvParser())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        if (results.length > 10000) {
          return this.serviceResponse(
            400,
            {},
            "Max upload limit is 10000 rows",
          );
        }

        // Validate CSV headers
        const header = Object.keys(results[0]);
        if (!this.validateCSVHeaders(header)) {
          return this.serviceResponse(
            400,
            {},
            "Column header should be loanNo and amount.",
          );
        }
        const newfilename = `${uploadedTrack}.${image!.originalname}`;
        const filename = `${Math.floor(Date.now() / 1000)}/${uploadedTrack}.${
          image.originalname
        }`;
        const folder = `documents/csv`;
        const s3UploadResponse = await this.s3Service.uploadDocument(
          image!.buffer,
          folder,
          filename,
        );
        let key = `${folder}/${filename}`;
        let csvlink = await this.s3Service.getPresignedUrl(key);

        if (!s3UploadResponse) {
          return this.serviceResponse(
            400,
            {},
            "File extension is not allowed.",
          );
        }

        const insertData: IExselMandate[] = [];
        const errorLog: IErrorLog[] = [];
        let logData: {};
        let totalRepayAmount = 0;
        let loanQuery: ILoanQueryResult;
        let errorFileName: string = "";

        for (const row of results) {
          const normalizedRow = {};
          for (let key in row) {
            normalizedRow[key.trim().toLowerCase()] = row[key];
          }
          const loanNo = normalizedRow["loanno"];
          const amount = parseFloat(row["amount"]);
          if (loanNo && amount) {
            loanQuery = await db("loan AS ll")
              .leftJoin("leads", "leads.leadID", "=", "ll.leadID")
              .select(
                "leads.leadID",
                "leads.em_id",
                "ll.loanNo",
                "ll.accountNo",
                "leads.customerID",
                "leads.productID",
                "leads.ipc",
                "leads.status",
              )
              .whereIn("leads.status", ["Disbursed", "Part Payment"])
              .where("ll.status", "Disbursed")
              .where("ll.loanNo", loanNo)
              .first();

            if (loanQuery) {
              const ema = await db("razorpay_mandate")
                .where("status", "paid")
                .whereNotNull("customer_id")
                .where("customerID", loanQuery.customerID)
                .orderBy("id", "desc")
                .first();

              if (loanQuery.productID === ProductID.PAYDAY) {
                if (loanQuery.ipc === 1) {
                  totalRepayAmount = await calculateTotalRepayPaydayAmountIPC(
                    loanQuery.leadID,
                    loanQuery.status,
                  );
                } else {
                  totalRepayAmount =
                    await calculateTotalRepayPaydayAmountNonIPC(
                      loanQuery.leadID,
                    );
                }
              } else {
                totalRepayAmount = await calculateTotalRepayEmiAmount(
                  loanQuery.leadID,
                  loanQuery.customerID,
                );
              }
              const approval = await db("approval")
                .where("customerID", loanQuery.customerID)
                .where("leadID", loanQuery.leadID)
                .orderBy("approvalID", "desc")
                .first();

              const maxAmount = ema?.emMaxamount ?? -1;
              const expiryDate = new Date(
                new Date(ema?.credated_date).getTime() +
                  270 * 24 * 60 * 60 * 1000,
              );
              if (expiryDate > new Date() || ema?.status === "expired") {
                if (
                  amount <= maxAmount &&
                  amount > 100 &&
                  amount <= totalRepayAmount
                ) {
                  insertData.push({
                    loanNo: loanQuery.loanNo,
                    leadID: loanQuery.leadID,
                    track: uploadedTrack,
                    userID: userId,
                    emandateID: ema.id,
                    status: "0",
                    customerID: loanQuery.customerID,
                    accountNo: loanQuery.accountNo,
                    collectable_amount: amount,
                    productID: loanQuery.productID,
                  });
                  const agentName = name;
                  logData = {
                    customerID: loanQuery.customerID,
                    leadID: loanQuery.leadID,
                    callType: "IVR",
                    status: "In Queue",
                    remark: `Loan Number (${loanQuery.loanNo}) added in Queue for mandate by ${agentName}`,
                    appAmount: amount,
                    noteli: "",
                    callbackTime: new Date(),
                    calledBy: userId,
                    //createdDate: new Date(),
                  };
                } else {
                  errorLog.push({
                    LoanNumber: loanNo,
                    Amount: amount,
                    message: `Amount ${amount} is not within acceptable range.`,
                    uploadDate: new Date(),
                  });
                }
              } else {
                errorLog.push({
                  LoanNumber: loanNo,
                  Amount: amount,
                  message: "Mandate Expired",
                  uploadDate: new Date(),
                });
              }
            } else {
              errorLog.push({
                LoanNumber: loanNo,
                Amount: amount,
                message: "This loan number does not match certain conditions.",
                uploadDate: new Date(),
              });
            }
          }
        }

        if (errorLog.length > 0) {
          errorFileName = `Errorlist${uploadedTrack}${
            new Date().toISOString().split("T")[0]
          }.csv`;
          const loanheader = ["LoanNumber", "Amount", "message", "uploadDate"];
          const errorFileS3 = await this.generateAndUploadCSV({
            data: errorLog,
            headers: loanheader,
            filename: errorFileName,
            folder: `documents/errorcsv`,
          });

          if (!errorFileS3) {
            return this.serviceResponse(
              400,
              {},
              "Failed to upload error file.",
            );
          }
        }
        await db("exsl_filelog").insert({
          fileName: filename,
          uploadStatus: "uploaded",
          processStatus: "In Queue",
          error: `documents/errorcsv/${errorFileName}`,
          errorfilelink: `${folder}/${uploadedTrack}.csv`,
          filelink: csvlink,
          succesfile: uploadedTrack,
          //created_at: new Date(),
          cron_status: 0,
          userID: userId, // Replace with actual userID when code goes to crm
          productID: loanQuery?.productID,
        });
        if (insertData.length === 0) {
          return this.serviceResponse(200, {}, "No valid records found.");
        }
        if (insertData.length > 0) {
          await db("exsl_mandate").insert(insertData);
          await db("callhistoryLogs").insert(logData);

          return this.serviceResponse(
            200,
            {},
            `File uploaded successfully. ${insertData.length} entries added.`,
          );
        } else {
          return this.serviceResponse(400, {}, "No valid records found.");
        }
      });

    return this.serviceResponse(200, {}, "file uploaded successfully");
  }
  async callSetBulkMandate(): Promise<void> {
    const db = getKnexInstance();
    const mandateList = await db("exsl_filelog")
      .whereNotNull("succesfile")
      .where("cron_status", 0)
      .whereNot("succesfile", "")
      .whereNot("succesfile", "like", "%documents/successcsv%")
      .orderBy("id", "desc")
      .first();
    if (mandateList && mandateList.succesfile) {
      await db("exsl_filelog")
        .where("succesfile", mandateList.succesfile)
        .update({ cron_status: 1 });

      await this.setBulkMandate(mandateList.succesfile);
    }
  }

  async setBulkMandate(track: string): Promise<IStatusInfo[]> {
    const db = getKnexInstance();
    if (!db) {
      console.error("Failed to initialize the Knex instance.");
    }

    const mandateList = await db("exsl_mandate AS bemd")
      .join("leads", "leads.leadID", "=", "bemd.leadID")
      .join(
        "razorpay_mandate",
        "razorpay_mandate.customerID",
        "=",
        "bemd.customerID",
      )
      .select(
        "bemd.leadID",
        "bemd.emandateID",
        "bemd.loanNo",
        "bemd.collectable_amount",
        "bemd.accountNo",
        "bemd.customerID",
        "bemd.productID",
      )
      .whereIn("leads.status", ["Disbursed", "Part Payment"])
      .where("razorpay_mandate.status", "paid")
      .where("bemd.status", "0")
      .where("bemd.track", track);

    if (!mandateList || mandateList.length === 0) {
      console.log("No mandates found for the given conditions.");
    }
    let out: IStatusInfo[] = [];
    let loan_data: ILoanInfo[] = [];
    for (const mnd of mandateList) {
      const ebulkemd = await this.submitEmdCharge(
        mnd.customerID,
        mnd.leadID,
        mnd.emandateID,
        mnd.collectable_amount,
      );
      const statusKey = ebulkemd?.status ?? "2";
      const data = {
        customerID: mnd.customerID,
        leadID: mnd.leadID,
        callType: "IVR",
        status: statusKey,
        remark:
          ebulkemd.message ??
          `Loan Number (${mnd.loanNo}) in Processed for mandate`,
        noteli: " ",
        appAmount: mnd.collectable_amount ?? 0,
        callbackTime: new Date().toISOString().split("T")[0],
        calledBy: 1,
        createdDate: new Date(),
      };

      const calllog = await db("callhistoryLogs")
        .where("customerID", mnd.customerID)
        .where("leadID", mnd.leadID)
        .first();

      const message =
        ebulkemd.message ??
        `Loan Number (${mnd.loanNo}) in Processed for mandate`;
      loan_data.push({
        LoanNumber: mnd.loanNo,
        Amount: mnd.collectable_amount,
        Status: statusKey,
        message: message,
        date_of_emandate: new Date().toISOString(),
      });

      await db("exsl_mandate")
        .where("leadID", mnd.leadID)
        .where("productID", mnd.productID)
        .where("status", "0")
        .orderBy("id", "asc")
        .limit(1)
        .update({ status: statusKey });
      await db("callhistoryLogs").insert(data);

      out.push(ebulkemd);
    }

    if (loan_data.length > 0) {
      const folder = "documents/successcsv";
      const loanheader = [
        "LoanNumber",
        "Amount",
        "Status",
        "message",
        "date_of_emandate",
      ];
      const loanfile = `Loanlist${track}${
        new Date().toISOString().split("T")[0]
      }.csv`;
      const successFileS3Path = await this.generateAndUploadCSV({
        data: loan_data,
        headers: loanheader,
        filename: loanfile,
        folder: folder,
      });
      if (!successFileS3Path) {
        throw new BadRequestError("Failed to upload Loanlist.");
      }
      await db("exsl_filelog").where("succesfile", track).update({
        uploadStatus: "uploaded",
        processStatus: "Success",
        succesfile: track,
      });
    }

    return out;
  }

  private writeFile = promisify(fs.writeFile);
  private unlinkFile = promisify(fs.unlink);

  async generateAndUploadCSV({
    data,
    headers,
    filename,
    folder,
  }: ICSVGeneration): Promise<Record<any, any>> {
    const filePath = path.join(__dirname, `${filename}`);
    const fileStream = fs.createWriteStream(filePath);

    // Write headers to CSV
    fileStream.write(`${headers.join(",")}\n`);

    // Write each row of data to the CSV
    data.forEach((row) => {
      const csvRow = headers.map((header) => row[header] ?? "").join(",");
      fileStream.write(`${csvRow}\n`);
    });

    fileStream.end();

    // Wait until the file stream is fully closed before proceeding
    await new Promise((resolve) => fileStream.on("finish", resolve));

    // Upload to S3
    const s3FileName = path.basename(filePath);
    const s3UploadResponse = await this.s3Service.uploadDocument(
      fs.readFileSync(filePath),
      folder,
      s3FileName,
    );

    // Clean up the local file after upload
    await this.unlinkFile(filePath);

    return s3UploadResponse;
  }

  async submitEmdCharge(
    customerID: number,
    leadId: number,
    emID: string,
    emAmount: number,
  ) {
    const db = getKnexInstance();
    // Check if the user has created 3 e-mandates this month
    const rbi = await db("razorpay_emOrder")
      .where("leadID", leadId)
      .whereRaw("DATE_FORMAT(createdDate, '%Y-%m') = ?", [
        new Date().toISOString().slice(0, 7),
      ])
      .whereNotNull("razorpay_payment_id")
      .count("* as count");
    const emandateCount = parseInt(rbi[0].count as string, 10);

    if (emandateCount >= 4) {
      return {
        status: "3",
        leadId,
        customerID,
        message: "This user has already created 3 e-mandates this month.",
      };
    }

    const ema = await db("razorpay_mandate").where("id", Number(emID)).first();
    const collectedPayment = await db("onlinepayment")
      .where("paymentStatus", "success")
      .where("method", "E-mandate")
      .where("leadID", leadId)
      .sum("toValue as total");
    let emMaxAmount = ema?.emMaxamount ?? -1;

    if (collectedPayment[0].total < emMaxAmount && emMaxAmount > 0) {
      emMaxAmount -= collectedPayment[0].total;
    }

    if (collectedPayment[0].total < 1 && emMaxAmount < 1) {
      const loan = await db("loan")
        .where("customerID", customerID)
        .where("leadID", leadId)
        .first();
      emMaxAmount = (loan?.disbursalAmount ?? 0) * 2;
    }

    if (emAmount > emMaxAmount) {
      return {
        status: "3",
        leadId,
        customerID,
        message: `Max chargeable amount is ${emMaxAmount}rs.`,
      };
    }

    if (emAmount < 100) {
      return {
        status: "3",
        leadId,
        customerID,
        message: `Minimum amount is 100rs.`,
      };
    }

    const data1 = {
      amount: emAmount * 100,
      currency: "INR",
      payment_capture: true,
      leadID: leadId,
      customerID: customerID,
      customer_id: ema?.customer_id ?? customerID,
      receipt: "INR",
      notes: {
        notes_key_1: ema?.cust_name ?? "",
        notes_key_2: ema?.cust_name ?? "",
      },
    };

    const orderResponse = await this.sendRazorpayRequestNew(
      "https://api.razorpay.com/v1/orders/",
      data1,
      "e-mandate nach orders",
    );
    if (orderResponse.error && orderResponse.error.description) {
      const message =
        orderResponse.error.description ?? "data error by third party";
      return {
        status: "3",
        leadId,
        customerID,
        message: "data error by third party razorpay[No db record found]",
      };
    }

    let orderID = await db("razorpay_emOrder").insert({
      emID: ema?.id ?? Number(emID),
      customerID: customerID,
      leadID: leadId,
      orderID: orderResponse.id,
      entity: orderResponse.entity,
      amount: orderResponse.amount / 100,
      amount_paid: orderResponse.amount_paid,
      amount_due: orderResponse.amount_due / 100,
      currency: orderResponse.currency,
      receipt: orderResponse.receipt,
      status: orderResponse.status,
      razorpay_payment_id: "no payment",
      razorpay_signature: "no signature",
      razorpay_order_id: orderResponse.id ?? "no order",
      notes_key_1: orderResponse.notes.notes_key_1,
      tokenID: ema?.token_id ?? "token_XYZ",
      uid: 1,
      createdDate: new Date(),
      remarks: "Auto Collect",
    });

    if (!orderID) {
      return {
        status: "3",
        leadId,
        customerID,
        message: "Order insertion failed",
      };
    }

    const data2 = {
      email: ema?.cust_email ?? "",
      contact: ema?.cust_contact ?? "",
      leadID: leadId,
      amount: emAmount * 100,
      currency: "INR",
      order_id: orderResponse.id,
      customerID: customerID,
      customer_id: ema?.customer_id ?? "",
      token: ema?.token_id ?? "token_XYZ",
      recurring: "1",
      description: ema?.cust_name ?? "",
      notes: {
        notes_key_1: ema?.cust_name ?? "",
        notes_key_2: ema?.cust_name ?? "",
      },
    };

    const paymentResponse = await this.sendRazorpayRequestNew(
      "https://api.razorpay.com/v1/payments/create/recurring/",
      data2,
      "e-mandate nach recurring",
    );
    if (paymentResponse.error && paymentResponse.error.description) {
      const message =
        paymentResponse.error.description ?? "data error by third party";
      return {
        status: "3",
        leadId,
        customerID,
        message: "data error by third party razorpay [no db record found]",
      };
    }

    let orderIDValue: number;

    if (Array.isArray(orderID) && orderID.length > 0) {
      orderIDValue = orderID[0];
    }
    await db("razorpay_emOrder")
      .where("id", orderIDValue)
      .update({
        razorpay_payment_id:
          paymentResponse.razorpay_payment_id ?? "no payment id",
        razorpay_order_id: orderResponse.id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

    const customerData = await db("customer")
      .where("customerID", customerID)
      .first();

    await db("onlinepayment").insert({
      name: customerData?.name ?? "",
      email: customerData?.email ?? "",
      phone: customerData?.mobile ?? "",
      service: "RuleMudra",
      typeProduct: "E-mandate",
      toValue: orderResponse.amount / 100,
      message: customerData?.pancard ?? "",
      razorpayOrderId: orderResponse.id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id ?? "no payment id",
      paymentStatus: "PENDING",
      makerstamp: new Date(),
      updatestamp: new Date(),
      status: "no",
      paymentType: "E-mandate Charge",
      method: "E-mandate",
      leadID: leadId,
    });
    return {
      status: "4",
      leadId,
      customerID,
      message: "Success",
    };
  }

  async sendRazorpayRequestNew(
    url: string,
    data: IRazorpayRequestData,
    apiType: string,
  ): Promise<any> {
    this.prepareRequestData(data, apiType);
    const jsonResponse = await this.postRazorpayRequest(url, data);
    if (!jsonResponse.success) {
      return {
        error: {
          description: jsonResponse.message,
        },
      };
    }
    return jsonResponse;
  }
  async prepareRequestData(
    data: IRazorpayRequestData,
    apiType: string,
  ): Promise<void> {
    if (apiType !== "e-mandate nach recurring") {
      delete data.customer_id;
    }
    delete data.customerID;
    delete data.leadID;
  }
  async postRazorpayRequest(
    url: string,
    data: IRazorpayRequestData,
  ): Promise<IPostRazorpayRequest> {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Basic ${this.razorpayPg.auth}`,
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30-second timeout
        maxRedirects: 10, // Maximum redirection limit
      });
      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error(
        "Error in Razorpay request:",
        error.response ? error.response.data : error.message,
      );
      return {
        success: false,
        message: error.response?.data || "Error in Razorpay Request",
      };
    }
  }

  async getBulkMandateData(
    payload: IMandatePayload,
  ): Promise<IServiceResponse> {
    let { page = 1, limit = 20 } = payload;
    const db = getKnexInstance();
    const pageTitle = "Bulk E-mandate by Excel";
    const currentPage = page;
    const offset = (currentPage - 1) * limit;

    const fileData = await db("exsl_filelog")
      .where("uploadStatus", "uploaded")
      .orderBy("id", "DESC")
      .limit(limit)
      .offset(offset);
    const fileDataTotal = await db("exsl_filelog")
      .where("uploadStatus", "uploaded")
      .count({ count: "*" })
      .first();

    const insertData = await db("exsl_mandate")
      .join("customer", "exsl_mandate.customerID", "=", "customer.customerID")
      .select("exsl_mandate.*", "customer.name")
      .whereIn("exsl_mandate.status", ["0", "1", "2", "3", "4"])
      .orderBy("exsl_mandate.id", "DESC")
      .limit(limit)
      .offset(offset);

    const insertDataTotal = await db("exsl_mandate")
      .join("customer", "exsl_mandate.customerID", "=", "customer.customerID")
      .whereIn("exsl_mandate.status", ["0", "1", "2", "3", "4"])
      .count({ count: "*" })
      .first();

    const fileDataTotalPages = Math.ceil(fileDataTotal?.count / limit);
    const insertDataTotalPages = Math.ceil(insertDataTotal?.count / limit);

    // const statusArr = statusConst;

    return this.serviceResponse(
      200,
      {
        insertData,
        fileData,
        pageTitle,
        currentPage,
        fileDataTotalPages,
        insertDataTotalPages,
        fileDataTotal: fileDataTotal.count,
        insertDataTotal: insertDataTotal.count,
      },
      "Data for bulk mandate ",
    );
  }
  async getUrlforBulkMandateFile(
    payload: IFileUrlPayload,
  ): Promise<IServiceResponse> {
    let { fileName } = payload;
    let csvlink = await this.s3Service.getPresignedUrl(fileName);

    return this.serviceResponse(
      200,
      {
        csvlink,
      },
      "url",
    );
  }
  async paydayToEmiConversionTest(
    payload: IpaydayToEmiConversionPayload,
  ): Promise<IServiceResponse> {
    let {
      productId,
      customer_id,
      lead_id,
      loanAmtApproved,
      roi,
      tenure,
      firstDueDate,
    } = payload;

    const lead = await this.leadService.findOne({ leadID: lead_id }, [
      "status",
      "customerID",
    ]);
    if (!lead) throw new NotFoundError("No Lead Found");
    customer_id = lead.customerID;
    let baseUrl = this.commonHelper.getBaseUrl();
    if (
      productId !== ProductID.EMI
      //lead.status !== LeadStatus.APPROVED_PROCESS
    ) {
      throw new NotFoundError("Status must be approved and product EMI");
    }
    await axios.put(
      `${baseUrl}/new-api/crm/lead-update`,
      { leadID: lead_id },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    const adminFee = Math.floor(loanAmtApproved * Charges.ADMIN_PERCENTAGE);
    const gst = Math.floor(adminFee * Charges.GST);

    const credit = await this.creditService.findOne({ leadID: lead_id }, [
      "creditID",
      "firstDueDate",
      "principal",
    ]);
    const creditData = {
      adminFee,
      branch: "delhi",
      customer_id,
      firstDueDate,
      lead_id,
      loanAmtApproved,
      roi,
      tenure,
      gst,
    };

    if (!credit) {
      await axios.post(`${baseUrl}/new-api/crm/creditDetails`, creditData, {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const emiDoc = (await this.emiHelper.emiGenerator(
        //credit.principal,
        loanAmtApproved,
        roi,
        tenure,
        credit.firstDueDate,
      )) as IEMIDoc;

      await this.creditService.updateOne(
        { creditID: credit.creditID },
        {
          tenure,
          interest: emiDoc.interest,
          amountToBeRepayed: emiDoc.repaymentAmount,
          totalEMIs: emiDoc.totalEMIs,
          emiLeft: emiDoc.EMILeft,
          principal: loanAmtApproved,
          status: "initiated",
        },
      );
    }
    const updatedCredit = await this.creditService.findOne(
      { leadID: lead_id },
      ["creditID", "firstDueDate"],
    );
    await Promise.all([
      this.approvalModel.findOneAndUpdateApproval(
        { leadID: lead_id },
        {
          loanAmtApproved,
          tenure,
          roi,
          adminFee,
          GstOfAdminFee: gst,
          repayDate: updatedCredit.firstDueDate,
        },
      ),
      this.leadService.updateOne({ leadID: lead_id }, { sanctionalloUID: 1 }),
      this.callHistoryLogService.create({
        customerID: customer_id,
        leadID: lead_id,
        callType: "IVR",
        status: lead.status,
        appAmount: String(loanAmtApproved),
        noteli: "",
        remark: "EMI",
        callbackTime: new Date(
          moment(new Date(Date.now()))
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss"),
        ),
        calledBy: 1,
      }),
    ]);

    return this.serviceResponse(200, {}, "Payday converted to EMIs");
  }

  async fetchPaymentsFromRazorpay(from: number, to: number): Promise<any[]> {
    let payments = [];
    let skip = 0;
    const count = 100;

    while (true) {
      try {
        const response = await axios.get(
          `${config.razorPayBaseUrl}/payments?from=${from}&to=${to}&count=${count}&skip=${skip}`,
          {
            auth: {
              username: config.razorpayDisbursalKeyId,
              password: config.razorpayDisbursalKeySecret,
            },
          },
        );

        const fetchedItems = response.data.items || [];
        //payments = payments.concat(fetchedItems)

        console.log(`Fetched ${fetchedItems.length} payments (Skip: ${skip})`);
        if (fetchedItems.length > 0) {
          console.log(`Processing ${fetchedItems.length} payments...`);
          await this.processPayments(fetchedItems);
        } else {
          console.log("No payments found for the specified time range.");
        }

        if (fetchedItems.length < count) break;

        skip += count;
      } catch (error) {
        console.error(
          "Error fetching payments:",
          error.response?.data || error.message,
        );
        break;
      }
    }

    return null;
  }
  async processPayments(payments): Promise<void> {
    let db = getKnexInstance();
    for (const payment of payments) {
      if (
        payment.status === PaymentCheckoutStatus.CAPTURED &&
        payment.amount > 0
      ) {
        const orderId = payment.order_id;
        let createdAt = payment.created_at;
        let paymentDate = format(new Date(createdAt * 1000), "yyyy-MM-dd");
        const paymentData = await db("onlinepayment")
          .where("razorpayOrderId", orderId)
          .first();
        if (!paymentData) {
          try {
            const mobileNo = +payment.contact
              .replace(/\D/g, "")
              .replace(/^91/, "");
            const customer = await this.customerService.findOne(
              {
                mobile: mobileNo,
              },
              ["customerID", "name", "mobile", "pancard", "email"],
            );
            if (!customer || !customer.customerID) {
              continue;
            }

            let lead = await db("leads as l")
              .join("loan as ln", function () {
                this.on("l.leadID", "=", "ln.leadID")
                  .andOn("ln.status", "=", db.raw("?", ["Disbursed"]))
                  .andOn("ln.disbursalDate", "<=", db.raw("?", [paymentDate]));
              })
              .where("l.customerID", customer?.customerID)
              .whereIn("l.status", ["Disbursed", "Part Payment"])
              .orderBy("l.leadID", "asc")
              .select("l.productID", "l.leadID")
              .first();
            if (!lead) {
              lead = await db("leads as l")
                .join("loan as ln", function () {
                  this.on("l.leadID", "=", "ln.leadID")
                    .andOn("ln.status", "=", db.raw("?", ["Disbursed"]))
                    .andOn(
                      "ln.disbursalDate",
                      "<=",
                      db.raw("?", [paymentDate]),
                    );
                })
                .where("l.customerID", customer?.customerID)
                .whereIn("l.status", ["Closed", "Settlement"])
                .orderBy("l.leadID", "desc")
                .select("l.productID", "l.leadID")
                .first();
            }
            if (lead) {
              const saveObject = {
                name: customer.name || "",
                email: customer.email || payment.email || "",
                phone: customer.mobile,
                service: "RuleMudra",
                typeProduct: lead?.productID === 1 ? "EMI" : "PAYDAY",
                toValue: payment.amount / 100,
                message: customer.pancard || "",
                razorpayOrderId: orderId,
                razorpayPaymentId: payment.id,
                paymentStatus: "PENDING",
                makerstamp: new Date(format(new Date(), "yyyy-MM-dd HH:mm:ss")),
                updatestamp: new Date(
                  format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                ),
                leadID: lead?.leadID || "",
                device: "cronVerification",
              };
              await this.onlinePaymentModel.create(saveObject);
              const razorpayData = {
                razorpay_paymentId: payment.id,
                razorpay_orderId: orderId,
                method: payment.method,
                status: payment.status,
                amount: payment.amount,
                createdAt: payment.created_at,
              };
              const { webhookService } = await import("./webhook.service");
              await webhookService.repaymentVerificationWebhook(razorpayData);
            } else {
              continue;
            }
          } catch (error) {
            console.error(
              `Error calling addCollection API for order_id ${orderId}:`,
              error,
            );
          }
        } else if (paymentData && paymentData.paymentStatus !== "SUCCESS") {
          const razorpayData = {
            razorpay_paymentId: payment.id,
            razorpay_orderId: orderId,
            method: payment.method,
            status: payment.status,
            amount: payment.amount,
            createdAt: payment.created_at,
          };
          await this.webhookService.repaymentVerificationWebhook(razorpayData);
        }
      } else {
        const orderId = payment.order_id;
        const paymentData = await db("onlinepayment")
          .where("razorpayOrderId", orderId)
          .first();
        if (!paymentData && payment.amount > 0) {
          const mobileNo = +payment.contact
            .replace(/\D/g, "")
            .replace(/^91/, "");
          const customer = await this.customerService.findOne(
            {
              mobile: mobileNo,
            },
            ["customerID", "name", "mobile", "pancard"],
          );
          if (!customer || !customer.customerID) {
            continue;
          }
          let lead = db("leads")
            .where("customerID", customer.customerID)
            .whereNot("status", LeadStatus.CLOSED)
            .whereNot("status", LeadStatus.SETTLEMENT)
            .orderBy("leadID", "asc")
            .select("productID", "leadID")
            .first();
          if (lead) {
            const saveObject = {
              name: customer.name || "",
              email: customer.email || "",
              phone: customer.mobile,
              service: "RuleMudra",
              typeProduct: lead[0]?.productID === 1 ? "EMI" : "PAYDAY",
              toValue: payment.amount / 100,
              message: customer.pancard || "",
              razorpayOrderId: orderId,
              razorpayPaymentId: payment.id,
              paymentStatus: "PENDING",
              leadID: lead[0]?.leadID || "",
              makerstamp: new Date(format(new Date(), "yyyy-MM-dd HH:mm:ss")),
              updatestamp: new Date(format(new Date(), "yyyy-MM-dd HH:mm:ss")),
              device: "cronVerification",
            };
            await this.onlinePaymentModel.create(saveObject);
          }
        }
      }
    }
  }
  async razorpayPaymentVerification(
    from: number,
    to: number,
  ): Promise<IServiceResponse> {
    const payments = await this.fetchPaymentsFromRazorpay(from, to);
    return this.serviceResponse(200, {}, "SUCCESS");
  }
  async payUPaymentVerification(
    from: string,
    to: string,
  ): Promise<IServiceResponse> {
    try {
      const payments = await this.fetchPaymentsFromPayU(from, to);
      if (payments.length > 0) {
        console.log(`Processing ${payments.length} payments...`);
        await this.processPaymentsPayU(payments);
      } else {
        console.log("No payments found for the specified time range.");
      }
      return this.serviceResponse(200, {}, "SUCCESS");
    } catch (error) {
      console.error("Error in payUPaymentVerification:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return this.serviceResponse(500, { error: errorMessage }, "FAILED");
    }
  }
  async fetchPaymentsFromPayU(from: string, to: string): Promise<any[]> {
    let payments = [];

    try {
      const hashCode = await this.generateHash(from);
      const params = new URLSearchParams({
        key: config.payukey,
        command: config.payUCommand,
        var1: from,
        var2: to,
        hash: hashCode,
      });

      const response = await axios.post(
        `${config.payUApi}`,
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      const payu_data = phpSerialize.unserialize(response.data);
      payments = payu_data.Transaction_details;
    } catch (error) {
      console.error(
        "Error fetching payments:",
        error.response?.data || error.message,
      );
    }

    return payments;
  }
  async processPaymentsPayU(payments): Promise<void> {
    let db = getKnexInstance();

    for (const payment of payments) {
      if (
        payment.status === PaymentCheckoutStatus.CAPTURED &&
        +payment.amount > 0
      ) {
        const orderId = payment.txnid;
        const paymentData = await db("onlinepayment")
          .where("razorpayOrderId", orderId)
          .first();
        if (!paymentData) {
          try {
            const mobileNo = +payment.phone;
            let paymentDate = format(new Date(payment.addedon), "yyyy-MM-dd");
            const customer = await this.customerService.findOne(
              {
                mobile: mobileNo,
              },
              ["customerID", "name", "mobile", "pancard", "email"],
            );
            if (!customer || !customer.customerID) {
              continue;
            }

            let lead = await db("leads as l")
              .join("loan as ln", function () {
                this.on("l.leadID", "=", "ln.leadID")
                  .andOn("ln.status", "=", db.raw("?", ["Disbursed"]))
                  .andOn("ln.disbursalDate", "<=", db.raw("?", [paymentDate]));
              })
              .where("l.customerID", customer?.customerID)
              .whereIn("l.status", ["Disbursed", "Part Payment"])
              .orderBy("l.leadID", "asc")
              .select("l.productID", "l.leadID")
              .first();

            if (!lead) {
              lead = await db("leads as l")
                .join("loan as ln", function () {
                  this.on("l.leadID", "=", "ln.leadID")
                    .andOn("ln.status", "=", db.raw("?", ["Disbursed"]))
                    .andOn(
                      "ln.disbursalDate",
                      "<=",
                      db.raw("?", [paymentDate]),
                    );
                })
                .where("l.customerID", customer?.customerID)
                .whereIn("l.status", ["Closed", "Settlement"])
                .orderBy("l.leadID", "desc")
                .select("l.productID", "l.leadID")
                .first();
            }
            if (lead) {
              const saveObject = {
                name: customer.name || "",
                email: customer?.email || payment?.email || "",
                phone: customer.mobile,
                service: "Payu",
                typeProduct: "Payu Payment",
                toValue: +payment.amount,
                message: customer?.pancard || "",
                razorpayOrderId: orderId,
                razorpayPaymentId: payment.bank_ref_no,
                paymentStatus: "SUCCESS",
                makerstamp: new Date(format(new Date(), "yyyy-MM-dd HH:mm:ss")),
                updatestamp: new Date(
                  format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                ),
                leadID: lead?.leadID,
                device: "cronVerificationPayU",
              };
              await this.onlinePaymentModel.create(saveObject);
              const payUData: IPayUReq = {
                leadID: lead.leadID,
                txnId: orderId,
                amount: +payment.amount,
                bank_ref_no: payment.bank_ref_no,
                payU_date: payment.addedon,
              };
              const { webhookService } = await import("./webhook.service");
              await webhookService.payUPaymentCronSettlement(payUData);
            } else {
              continue;
            }
          } catch (error) {
            console.error(
              `Error calling addCollection API for order_id ${orderId}:`,
              error,
            );
          }
        } else if (paymentData && paymentData.paymentStatus !== "SUCCESS") {
          const mobileNo = +payment.phone;
          let paymentDate = format(new Date(payment.addedon), "yyyy-MM-dd");
          const customer = await this.customerService.findOne(
            {
              mobile: mobileNo,
            },
            ["customerID", "name", "mobile", "pancard", "email"],
          );
          if (!customer || !customer.customerID) {
            continue;
          }

          let lead = await db("leads as l")
            .join("loan as ln", function () {
              this.on("l.leadID", "=", "ln.leadID")
                .andOn("ln.status", "=", db.raw("?", ["Disbursed"]))
                .andOn("ln.disbursalDate", "<=", db.raw("?", [paymentDate]));
            })
            .where("l.customerID", customer?.customerID)
            .whereIn("l.status", ["Disbursed", "Part Payment"])
            .orderBy("l.leadID", "asc")
            .select("l.productID", "l.leadID")
            .first();
          if (!lead) {
            lead = await db("leads as l")
              .join("loan as ln", function () {
                this.on("l.leadID", "=", "ln.leadID")
                  .andOn("ln.status", "=", db.raw("?", ["Disbursed"]))
                  .andOn("ln.disbursalDate", "<=", db.raw("?", [paymentDate]));
              })
              .where("l.customerID", customer?.customerID)
              .whereIn("l.status", ["Closed", "Settlement"])
              .orderBy("l.leadID", "desc")
              .select("l.productID", "l.leadID")
              .first();
          }

          const payUData: IPayUReq = {
            leadID: lead.leadID,
            txnId: orderId,
            amount: +payment.amount,
            bank_ref_no: payment.bank_ref_no,
            payU_date: payment.addedon,
          };

          await this.webhookService.payUPaymentCronSettlement(payUData);
        }
      } else {
        const orderId = payment.txnid;
        const paymentData = await db("onlinepayment")
          .where("razorpayOrderId", orderId)
          .first();
        if (!paymentData && +payment.amount > 0) {
          const mobileNo = +payment.phone;
          const customer = await this.customerService.findOne(
            {
              mobile: mobileNo,
            },
            ["customerID", "name", "mobile", "pancard", "email"],
          );
          if (!customer || !customer.customerID) {
            continue;
          }
          let lead = db("leads")
            .where("customerID", customer.customerID)
            .whereNot("status", LeadStatus.CLOSED)
            .whereNot("status", LeadStatus.SETTLEMENT)
            .orderBy("leadID", "asc")
            .select("productID", "leadID")
            .first();
          if (lead) {
            const saveObject = {
              name: customer?.name || "",
              email: customer?.email || payment?.email || "",
              phone: customer.mobile,
              service: "Payu",
              typeProduct: "Payu Payment",
              toValue: +payment.amount,
              message: customer?.pancard || "",
              razorpayOrderId: orderId,
              razorpayPaymentId: payment?.bank_ref_no || "",
              paymentStatus: "PENDING",
              makerstamp: new Date(format(new Date(), "yyyy-MM-dd HH:mm:ss")),
              updatestamp: new Date(format(new Date(), "yyyy-MM-dd HH:mm:ss")),
              leadID: lead[0]?.leadID,
              device: "cronVerificationPayU",
            };
            await this.onlinePaymentModel.create(saveObject);
          }
        }
      }
    }
  }
  private generateHash = async (var1: string): Promise<string> => {
    let key = config.payukey;
    let salt = config.payusalt;
    let command = config.payUCommand;

    const hashSequence = `${key}|${command}|${var1}|${salt}`;
    return crypto
      .createHash("sha512")
      .update(hashSequence)
      .digest("hex")
      .toLowerCase();
  };

  async payUPaymentVerificationPending() {
    try {
      // inititalize db
      const knex = getKnexInstance();
      // fetch data
      const results = await knex("onlinepayment as op")
        .where("op.paymentStatus", "PENDING")
        .whereNotNull("op.razorpayOrderId")
        .whereRaw('TRIM(op.razorpayOrderId) != ""')
        .where("op.typeProduct", "!=", "Payu Payment")
        .where("op.makerstamp", ">=", "2025-03-06") // change it for production
        .where(
          "op.makerstamp",
          "<",
          knex.raw("DATE_SUB(NOW(), INTERVAL 1 HOUR)"),
        )
        .whereNotExists(function () {
          this.select(knex.raw("1"))
            .from("collection as c")
            .whereRaw("c.referenceNo = op.razorpayOrderId");
        })
        .whereNotExists(function () {
          this.select(knex.raw("1"))
            .from("transactions as t")
            .whereRaw("t.orderId = op.razorpayOrderId");
        })
        .select("op.razorpayOrderId", "op.paymentType", "op.makerstamp");
      console.log("result", results.length);

      // check result
      if (results.length > 0) {
        for (let result of results) {
          const razorpayOrderId = result.razorpayOrderId;

          try {
            //get data from razorpay
            const paymentResponse = await axios.get(
              `${config.razorPayBaseUrl}/orders/${razorpayOrderId}/payments`,
              {
                headers: {
                  Authorization: `Basic ${this.razorpayPg.auth}`,
                  "Content-Type": "application/json",
                },
              },
            );
            //check itmes and filter captured payment
            if (
              paymentResponse &&
              paymentResponse.data &&
              paymentResponse.data.items &&
              paymentResponse.data.items.length > 0
            ) {
              const capturedItems = paymentResponse.data.items.filter(
                (item) => item.status === "captured",
              );
              if (capturedItems.length > 0) {
                const razorpay_paymentId = capturedItems[0].id;
                const amount = capturedItems[0].amount;
                const status = capturedItems[0].status;
                const razorpay_orderId = capturedItems[0].order_id;
                const method = capturedItems[0].method;
                let createdAt: any;
                createdAt = capturedItems[0].created_at;
                let mandateDate: string;

                if (result.paymentType == "E-mandate Charge") {
                  mandateDate = format(
                    new Date(result.makerstamp),
                    "yyyy-MM-dd",
                  );
                }
                const payload = {
                  razorpay_paymentId,
                  razorpay_orderId,
                  amount,
                  status,
                  method,
                  createdAt,
                  mandateDate,
                };

                await knex("temp_razorpay").insert({
                  razorpayOrderId,
                  status,
                });

                //call sattled method made by satyam
                await this.webhookService.repaymentVerificationWebhook(payload);
              }
            }
          } catch (error) {
            //console.log("log getting payment", paymentResponse);
          }
        }
      }
    } catch (error) {
      //error log
    }
  }
}

export const crmService = new CrmService();
