import EmiModel from "@/database/mysql/emi";
import { LeadStatus } from "@/enums/lead.enum";
import { BadRequestError } from "@/errors";
import CommonHelper from "@/helpers/common";
import { ICallHistoryLog } from "@/interfaces/callhistorylogs.interface";
import { ICredit } from "@/interfaces/credit.interface";
import { ICustomer } from "@/interfaces/customer.interface";
import { IEmi } from "@/interfaces/emi.interface";
import { ILead } from "@/interfaces/lead.interface";
import { ILoan } from "@/interfaces/loan.interface";
import { IOnlinePayment } from "@/interfaces/onlinepayment.interface";
import { IOtherCharges } from "@/interfaces/other_charges.interface";
import { ICustomResponse } from "@/interfaces/response.interface";
import { ITransection } from "@/interfaces/transections.interface";
import CallHistoryLogService from "@/services/callhistorylog.service";
import CollectionService from "@/services/collection.service";
import CreditService from "@/services/credit.service";
import CustomerService from "@/services/customer.service";
import EmiService from "@/services/emi.service";
import EMITransactions from "@/services/emi_transactions.service";
import LeadService from "@/services/lead.service";
import LoanService from "@/services/loan.service";
import OnlinePaymentService from "@/services/onlinepayment.service";
import OnlinePaymentLogService from "@/services/onlinepaymentlog.services";
import OtherCharges from "@/services/other_charges.service";
import RazorpayLogService from "@/services/razorpay_logs.service";
import TransectionService from "@/services/teansections.services";
import { logger } from "@/utils/logger";
import RazorpayPG from "@/utils/razorpayClient.utils";
import { differenceInCalendarDays, format } from "date-fns";
import { Request, Response } from "express";
import moment from "moment-timezone";

export interface IAuthenticatedRequest extends Request {
  customer: ICustomer;
}
class EmiCollectionService {
  [x: string]: any;
  private commonHelper = new CommonHelper();
  private razorpayInstance = new RazorpayPG();
  private creditService = new CreditService();
  private loanService = new LoanService();
  private emiService = new EmiService();
  private razorpayLogService = new RazorpayLogService();
  private onlinePaymentService = new OnlinePaymentService();

  private onlinePaymentLogService = new OnlinePaymentLogService();
  private onlinePaymentServices = new OnlinePaymentService();
  private collectionService = new CollectionService();
  private OtherCharges = new OtherCharges();

  private leadService = new LeadService();
  private callHistoryLogService = new CallHistoryLogService();
  private transectionService = new TransectionService();
  private customerService = new CustomerService();
  private emiModel = new EmiModel();
  private EMITransaction = new EMITransactions();
  // Handle pre-closure payment logic
  public async handlePreClosure(
    req: IAuthenticatedRequest,
    res: Response,
    credit: ICredit,
    loan: any
  ): Promise<Response> {
    try {
      const preClosureAmount = await this.calculatePreClosureAmount(
        credit,
        loan
      );
      const order = await this.createRazorpayOrder(
        credit,
        preClosureAmount,
        "Pre-Closure"
      );

      await this.logRazorpayOrder(
        credit,
        order,
        "manual customer pre-closure orders"
      );
      await this.createOnlinePaymentRecord(
        req,
        credit,
        preClosureAmount,
        order,
        "EMI Loan Pre-Closure"
      );

      return this.commonHelper.sendResponse(
        res,
        true,
        "Manual Payment Of Pre-Closure",
        { order },
        200
      );
    } catch (error) {
      console.error(error); // Log the error
      return this.commonHelper.sendResponse(
        res,
        false,
        "Failed to process pre-closure payment",
        {},
        500
      );
    }
  }

  // Handle due payment logic
  public async handleDuePayment(
    req: IAuthenticatedRequest,
    res: Response,
    credit: ICredit,
    amount: number
  ): Promise<Response> {
    try {
      const amountDue = await this.calculateDueAmount(
        credit.creditID,
        credit.roi
      );
      if (!amountDue || amount > amountDue) {
        return this.commonHelper.sendResponse(
          res,
          false,
          amount
            ? "Not Allowed To Pay More The Current Outstanding"
            : "No Due Emi",
          {},
          400
        );
      }

      const order = await this.createRazorpayOrder(credit, amount, "Due");
      await this.logRazorpayOrder(
        credit,
        order,
        "manual customer payment orders"
      );
      await this.createOnlinePaymentRecord(
        req,
        credit,
        amount,
        order,
        "EMI Loan Manual Payment"
      );

      return this.commonHelper.sendResponse(
        res,
        true,
        "Manual Payment Of Overdue",
        { order },
        200
      );
    } catch (error) {
      console.error(error); // Log the error
      return this.commonHelper.sendResponse(
        res,
        false,
        "Failed to process due payment",
        {},
        500
      );
    }
  }

  // Validation logic
  public validateRequest(data: any): string[] | null {
    try {
      const validatorParams = {
        creditID: "required | numeric",
        amount: "numeric",
        preClosure: "boolean",
      };

      const validator = CommonHelper.commonValidations(data, validatorParams);
      if (validator && validator.length > 0) {
        return validator;
      }
      return null;
    } catch (error) {
      console.error(error); // Log the error
      return ["Validation failed due to an internal error."];
    }
  }

  // Helper function to calculate pre-closure amount
  private async calculatePreClosureAmount(
    credit: ICredit,
    loan: any
  ): Promise<number> {
    try {
      let amount = 0;
      const emisForPreClosure = await this.emiService.find(
        { creditID: credit.creditID },
        [{ column: "creditID", order: "asc" }],
        ["*"]
      );
      const daysDiff = this.calculateDaysDifference(loan.disbursalDate);

      if (daysDiff <= 3) {
        amount =
          credit.principal - (credit.processingFee || 0) - (credit.gst || 0);
      } else {
        amount = await this.calculateEmiAmount(emisForPreClosure, credit);
      }

      return amount;
    } catch (error) {
      console.error(error); // Log the error
      throw new Error("Failed to calculate pre-closure amount");
    }
  }

  // Helper function to calculate EMI amount
  private async calculateEmiAmount(
    emis: IEmi[],
    credit: ICredit
  ): Promise<number> {
    try {
      let amount = 0;
      let emiCount = 1;

      for (const emi of emis) {
        const emiDueDate = this.getEmiDueDate(emi, emiCount, credit);

        if (emiDueDate) {
          const days = Math.abs(
            (Date.now() - emiDueDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const interest = Math.round(
            emi.openingBalance * (credit.roi / 365) * days
          );
          amount += emi.openingBalance + interest;
          break;
        } else if (emi.status !== "paid") {
          amount += emi.amountPayable;
        }

        emiCount += 1;
      }

      return amount;
    } catch (error) {
      console.error(error); // Log the error
      throw new Error("Failed to calculate EMI amount");
    }
  }

  // Razorpay order creation
  private async createRazorpayOrder(
    credit: ICredit,
    amount: number,
    caseType: string
  ): Promise<any> {
    try {
      const orderRequestBody = {
        amount: amount * 100,
        currency: "INR",
        notes: {
          creditID: credit.creditID,
          customerID: credit.customerID,
          case: caseType,
        },
      };

      return this.razorpayInstance.createOrder2(orderRequestBody);
    } catch (error) {
      console.error(error); // Log the error
      throw new Error("Failed to create Razorpay order");
    }
  }

  // Log Razorpay order
  private async logRazorpayOrder(
    credit: ICredit,
    order: any,
    logType: string
  ): Promise<void> {
    try {
      await this.razorpayLogService.create({
        customerID: credit.customerID,
        leadID: credit.leadID,
        req_url: "https://api.razorpay.com/v1/orders",
        api_request: JSON.stringify(order),
        api_response: JSON.stringify(order),
        type: logType,
      });
    } catch (error) {
      console.error(error); // Log the error
      throw new Error("Failed to log Razorpay order");
    }
  }

  // Create online payment record
  private async createOnlinePaymentRecord(
    req: IAuthenticatedRequest,
    credit: ICredit,
    amount: number,
    order: any,
    paymentType: string
  ): Promise<void> {
    try {
      await this.onlinePaymentService.create({
        name: req.customer.name,
        email: req.customer.email,
        phone: req.customer.mobile as unknown as bigint,
        service: "Ramfincorp",
        typeProduct: "EMI",
        toValue: amount,
        message: req.customer.pancard,
        razorpayOrderId: order.id,
        razorpayPaymentId: "",
        paymentStatus: "PENDING",
        makerstamp: new Date(),
        updatestamp: new Date(),
        status: "no",
        paymentType: paymentType,
        method: "Custumer Manual",
        leadID: credit.leadID,
      });
    } catch (error) {
      console.error(error); // Log the error
      throw new Error("Failed to create online payment record");
    }
  }

  // Utility to calculate date difference
  private calculateDaysDifference(disbursalDate: string): number {
    const today = new Date();
    const disbursal = new Date(disbursalDate);
    return Math.floor(
      (today.getTime() - disbursal.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Get EMI due date
  private getEmiDueDate(
    emi: IEmi,
    emiCount: number,
    credit: ICredit
  ): Date | null {
    if (new Date(emi.dueDate) >= new Date()) {
      const dueDate = new Date(emi.dueDate);
      dueDate.setMonth(dueDate.getMonth() - 1);
      return emiCount === 1 ? new Date(credit.disbursalDate) : dueDate;
    }
    return null;
  }

  // Calculate total due amount
  private async calculateDueAmount(
    creditID: number,
    roi: number
  ): Promise<number> {
    try {
      const emi = await this.emiService.findForSinglePayment(creditID);
      if (Array.isArray(emi)) {
        const amountPayable = emi[0]?.amountPayable;
        let dueDate = emi[0]?.dueDate;
        dueDate = new Date(format(new Date(dueDate), "yyyy-MM-dd"));
        const currentDate = new Date();
        let delayDays = Math.max(
          0,
          differenceInCalendarDays(currentDate, dueDate)
        );
        const penality = this.emiService.calculatePenalty(
          amountPayable,
          delayDays,
          roi
        );
        const toatalPayable = penality + amountPayable;
        return toatalPayable;
      } else {
        // Handle the error response
        const { message, statusCode } = emi;
        console.error(`Error: ${message} (Status Code: ${statusCode})`);
      }
      //return emis.reduce((acc, emi) => acc + emi.amountPayable, 0);
    } catch (error) {
      console.error(error); // Log the error
      throw new Error("Failed to calculate due amount");
    }
  }

  /* update payment */

  public async findOnlinePayment(
    orderId: string
  ): Promise<IOnlinePayment | null> {
    return (await this.onlinePaymentServices.findOne(
      { razorpayOrderId: orderId },
      { orderKey: "pID", orderValue: "desc" },
      ["*"]
    )) as IOnlinePayment;
  }

  public async logPaymentUpdate(
    pID: any,
    paymentDetails: any,
    payload: any
  ): Promise<void> {
    await this.onlinePaymentLogService.create(
      pID,
      paymentDetails.order_id,
      paymentDetails.id,
      paymentDetails.status,
      payload
    );
  }

  public async updatePaymentStatus(
    onlinePayment: IOnlinePayment,
    paymentDetails: any
  ): Promise<void> {
    await this.onlinePaymentServices.updateOne(
      { razorpayOrderId: paymentDetails.order_id },
      {
        razorpayPaymentId: paymentDetails.id,
        paymentStatus:
          paymentDetails.status === "captured" ? "SUCCESS" : "Failed",
        method: paymentDetails.method,
      }
    );
  }

  public async findCredit(leadID: number): Promise<ICredit | null> {
    return await this.creditService.findOne({ leadID }, ["*"]);
  }

  public async findLastEmi(creditID: number): Promise<IEmi | null> {
    return await this.emiService.findOne({ creditID }, ["*"]);
  }

  public async findLoan(leadID: number): Promise<ILoan | null> {
    return await this.loanService.findOne({ leadID }, ["loanNo"]);
  }

  public async findEmiById(emiID: number): Promise<IEmi | null> {
    return await this.emiService.findOne({ emiID }, ["*"]);
  }

  public async processCapturedPayment(
    emi: IEmi,
    paymentDetails: any,
    credit: ICredit,
    lastEmi: IEmi,
    loan: ILoan
  ): Promise<void> {
    const status =
      parseInt(paymentDetails.amount) < emi.amountRemains
        ? "partially-paid"
        : "paid";
    const delayDays = this.calculateDelayDays(emi.dueDate);

    await this.emiService.updateOne(
      { emiID: emi.emiID },
      {
        status,
        actualPaymentDate: new Date(),
        delayDays,
        paymentID: paymentDetails.id,
      }
    );

    const emiRemains = await this.countRemainingEmis(credit.creditID);
    await this.updateCreditStatus(emiRemains, credit, paymentDetails.amount);

    // await this.createCollectionRecord(credit, loan, paymentDetails.amount, paymentDetails.order_id);

    const lead = await this.findLead(credit.leadID);
    await this.createCallHistoryLog(credit, lead, paymentDetails.amount);

    await this.handleTransaction(paymentDetails, credit, loan, 1);

    await CommonHelper.lastEMIUpdater(
      emiRemains,
      credit.creditID,
      lastEmi.dueDate,
      credit.actualTenure,
      credit.leadID
    );
  }

  public async processManualPayment(
    paymentDetails: any,
    credit: ICredit,
    loan: ILoan
  ): Promise<void> {
    const emis = await this.findDueOrPartialEmis(credit.creditID);

    let amountRemains = paymentDetails.amount;

    // !! wip Find out any active waiver of the user
    // const waiver = await this.waiverModel.findOne({
    //   where: {
    //     credit_id: credit.creditID,
    //     type: WaiverType.TEMPORARY,
    //     product: Products.EMI,
    //     status: WaiverStatus.APPROVED,
    //     is_paid: false,
    //   },
    //   select: ['emi_id', 'amount', 'id'],
    // })

    // logger.info(
    //   'Processing waiver: ==> ' + waiver ? JSON.stringify(waiver) : 'No Waiver',
    // )

    for (let emi of emis) {
      try {
        if (amountRemains <= 0) break;
        paymentDetails.paymentDate = paymentDetails.paymentDate ?? new Date();
        //const currentDate = new Date()
        // const currentDate = paymentDetails.paymentDate
        const currentDate = new Date(paymentDetails.paymentDate);
        let details = {
          interest: 0,
          principal: 0,
          penalty: 0,
          bounceCharge: 0,
          updatePenalty: 0,
          updateBrokenPeriodIntrest: 0,
          paymentReceived: 0,
        };

        // Safely compare actualPaymentDate and dueDate
        let dueDate = new Date(format(new Date(emi.dueDate), "yyyy-MM-dd"));

        if (
          emi.actualPaymentDate !== null &&
          new Date(emi.actualPaymentDate) > new Date(emi.dueDate)
        ) {
          dueDate = emi.actualPaymentDate;
        }

        // Set interest, principal, penalty, and bounceCharge based on emi status
        let interest =
          emi.status === "partially-paid"
            ? emi.amountRemainsInterest
            : emi.interest;

        let principal =
          emi.status === "partially-paid" ? emi.amountRemains : emi.principal;

        let penalty =
          emi.status === "partially-paid"
            ? emi.amountRemainsPenalty
            : emi.panelty;

        details.updatePenalty = emi.panelty;
        // Calculate bounceCharge based on the emi status

        let bounceCharge =
          emi.status === "partially-paid"
            ? emi.amountRemainsBrokenPeriodIntrest
            : 0;

        // Ensure dueDate is a valid Date object
        const emiDueDate = new Date(dueDate);

        // Calculate the delay in days between the current date and emi due date
        let delayDays = differenceInCalendarDays(currentDate, emiDueDate);
        if (delayDays < 0) {
          delayDays = 0;
        }
        if (
          bounceCharge == 0 &&
          emi.status === "partially-paid" &&
          delayDays > 0
        ) {
          bounceCharge = +this.emiService.bounceCharge();
        }
        // Calculate the penalty and bounceCharge if delayDays > 0
        if (delayDays > 0) {
          let penaltyAgain = this.emiService.roundToTwo(
            +this.emiService.calculatePenalty(principal, delayDays, credit.roi)
          );
          penalty += penaltyAgain;
          await this.savePenalty(credit, emi.emiID, penaltyAgain, "penalty");

          if (emi.status != "partially-paid") {
            bounceCharge = +this.emiService.bounceCharge();

            await this.savePenalty(
              credit,
              emi.emiID,
              bounceCharge,
              "Bounce Charge"
            );
          }

          details.updatePenalty = details.updatePenalty + penaltyAgain;
        }
        if (delayDays > 0) {
          details.updateBrokenPeriodIntrest = this.emiService.bounceCharge();
        } else {
          details.updateBrokenPeriodIntrest = emi.brokenPeriodIntrest;
        }

        //details.updateBrokenPeriodIntrest = this.emiService.bounceCharge();

        if (emi.status == "due" && delayDays > 0) {
          details.updateBrokenPeriodIntrest = this.emiService.bounceCharge();
        } else {
          details.updateBrokenPeriodIntrest = details.updateBrokenPeriodIntrest;
        }

        details.paymentReceived = +emi.paymentReceived;
        // Subtract payment from interest first, then principal, then penalty
        let interestPaid = 0;
        if (amountRemains > 0 && interest > 0) {
          interestPaid = Math.min(amountRemains, interest);
          interest -= interestPaid;
          amountRemains -= interestPaid;
          details.paymentReceived += interestPaid;
        }
        details.interest = interest;
        let principalPaid = 0;
        if (amountRemains > 0 && principal > 0) {
          principalPaid = Math.min(amountRemains, principal);
          principal -= principalPaid;
          amountRemains -= principalPaid;
          details.paymentReceived += principalPaid;
        }
        details.principal = principal;
        let penaltyPaid = 0;
        if (amountRemains > 0 && penalty > 0) {
          penaltyPaid = Math.min(amountRemains, penalty);
          penalty -= penaltyPaid;
          amountRemains -= penaltyPaid;
          details.paymentReceived += penaltyPaid;
        }
        details.penalty = penalty;
        let bounceChargePaid = 0;
        if (amountRemains > 0 && bounceCharge > 0) {
          bounceChargePaid = Math.min(amountRemains, bounceCharge);
          bounceCharge -= bounceChargePaid;
          amountRemains -= bounceChargePaid;
          details.paymentReceived += bounceChargePaid;
        }
        details.bounceCharge = bounceCharge;
        console.log(details);
        const totalSum =
          details.interest +
          details.principal +
          details.penalty +
          details.bounceCharge;
        const status = totalSum > 0 ? "partially-paid" : "paid";

        await this.updateEmiStatusToPartial(
          emi,
          amountRemains,
          delayDays,
          paymentDetails,
          details,
          status
        );
        logger.info(
          "updateEmiPaymentLog: ===========>",
          paymentDetails.trans.order_id
        );
        const transSave = {
          transaction_id: paymentDetails.trans.id,
          order_id: paymentDetails.trans.order_id,
          emi_id: emi.emiID,
          interest: interestPaid,
          principal: principalPaid,
          penalty: penaltyPaid,
          dpd_amount: bounceChargePaid,
          transaction_date: currentDate,
          lead_id: credit.leadID,
          emi_status: status,
        };
        await this.EMITransaction.create(transSave);

        // If waiver, then amount should be reduced
        // let's say if emi of 10k then

        // if (waiver && waiver.emi_id === emi.emiID) {
        //   // if remaining emi amount is 10k and waiver is of 5k, then check if totalSum - waiverAmount = 0, then waiver success
        //   // if when subtracted, some amount still remains then waiver will not be considered
        //   const waiverValue = +waiver.amount.toFixed(2) //5k, paid 3k
        //   const amountRemaining = totalSum - +waiver.amount.toFixed(2) // 6k - 5k

        //   logger.info(
        //     'Inside Waiver Logic: Waiver exists for this user, amount: ' +
        //       waiverValue +
        //       ' amount Remaining: ' +
        //       amountRemaining +
        //       'TotalSum value: ' +
        //       totalSum,
        //   )

        //   if (amountRemaining <= 0) {
        //     // user has successfully paid waived off amount

        //     await Promise.all([
        //       this.emiModel.findOneAndUpdate(
        //         { emiID: emi.emiID },
        //         {
        //           waive_off_amount: parseFloat(emi.waive_off_amount as unknown as string) + waiverValue,
        //           amountRemains: 0,
        //           amountRemainsBrokenPeriodIntrest: 0,
        //           amountRemainsInterest: 0,
        //           amountRemainsPenalty: 0,
        //           status: 'paid',
        //         },
        //       ),
        //       await this.waiverModel.findOneAndUpdate(
        //         { id: waiver.id },
        //         { is_paid: true },
        //       ),
        //     ])
        //   }
        // }
      } catch (error) {
        console.error("Error calculating dueDate: ", error.message);
      }
      // Calculate total due, ensuring amountPayable and penalty are valid numbers
      /*
      const totalDue = Number(amountPayable) + Number(penalty);
      if (amountRemains >= totalDue) {

        amountRemains -= totalDue;
        await this.updateEmiStatusToPaid(emi, delayDays, paymentDetails, penalty);
        await this.handleTransaction(emi, paymentDetails, credit, loan);
      } else if (amountRemains > 0) {
        await this.updateEmiStatusToPartial(emi, amountRemains, delayDays, paymentDetails);
        await this.handleTransaction(emi, paymentDetails, credit, loan);
        break;
      } else {
        break;
      }

      */
    }
    // console.log("entry in processMannualPayment1 ============>>>>>>>>>>>>>>.")

    try {
      //  console.log("entry in processMannualPayment2 ============>>>>>>>>>>>>>>.")

      const creditID = credit.creditID;
      const lastEmiCollection = await this.emiService.findLastEmi(
        { creditID },
        ["emiID", "accessAmount", "dueDate"]
      );
      const accessAmount = +lastEmiCollection.accessAmount + amountRemains;
      const emiID = lastEmiCollection.emiID;
      if (amountRemains > 0) {
        await this.emiService.updateOne({ emiID }, { accessAmount });
      }

      const emiRemains = await this.countRemainingEmis(credit.creditID);
      await this.updateCreditStatus(emiRemains, credit, paymentDetails.amount);

      const lead = await this.findLead(credit.leadID);
      await this.createCallHistoryLog(credit, lead, paymentDetails.amount);

      await CommonHelper.lastEMIUpdater(
        emiRemains,
        credit.creditID,
        lastEmiCollection.dueDate,
        credit.actualTenure,
        credit.leadID
      );
    } catch (error) {
      console.error("Error calculating dueDate: ", error.message);
    }
  }

  public async savePenalty(
    credit,
    emiID: number,
    bounceCharge: number,
    discription: string
  ): Promise<void> {
    await this.createOtherCharges(
      {
        creditID: credit.creditID,
        customerID: credit.customerID,
        transectionID: 0,
        discription: discription,
        loanID: 0,
        leadID: credit.leadID,
      },
      emiID,
      bounceCharge
    );
  }

  public async findDueOrPartialEmis(creditID: number): Promise<IEmi[]> {
    return await this.emiService.find(
      (knex) =>
        knex
          .where((query) =>
            query.where("status", "partially-paid").orWhere("status", "due")
          )
          .andWhere("creditID", creditID)
          .andWhere("is_deleted", 0),
      [{ column: "emiID", order: "asc" }],
      ["*"]
    );
  }

  public calculateDelayDays(dueDate: Date): number {
    return Math.floor(
      (new Date().getTime() - new Date(dueDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }

  public async countRemainingEmis(creditID: number): Promise<number> {
    const countRow = await this.emiService.countRows((query) =>
      query
        .where((q) =>
          q.where("status", "partially-paid").orWhere("status", "due")
        )
        .andWhere("creditID", creditID)
    );
    return +countRow;
  }

  public async updateCreditStatus(
    emiRemains: number,
    credit: ICredit,
    paidAmount: number
  ): Promise<void> {
    await this.creditService.updateOne(
      { creditID: credit.creditID },
      {
        emiLeft: emiRemains,
        paidAmount: +credit.paidAmount + +paidAmount,
        amountToBeRepayed: credit.amountToBeRepayed - paidAmount,
      }
    );
  }

  public async updateEmiStatusToPaid(
    emi: IEmi,
    delayDays: number,
    paymentDetails: any,
    penality: any
  ): Promise<void> {
    await this.emiService.updateOne(
      { emiID: emi.emiID },
      {
        status: "paid",
        actualPaymentDate: new Date(),
        delayDays,
        paymentID: paymentDetails.id,
        amountRemains: 0,
        amountRemainsInterest: 0,
        panelty: penality,
      }
    );
  }
  //totalSum = details.interest + details.principal + details.penalty + details.bounceCharge;
  public async updateEmiStatusToPartial(
    emi: IEmi,
    amountRemains: number,
    delayDays: number,
    paymentDetails: any,
    details: any,
    status: string
  ): Promise<void> {
    await this.emiService.updateOne(
      { emiID: emi.emiID },
      {
        status: status,
        actualPaymentDate: paymentDetails.paymentDate
          ? moment(paymentDetails.paymentDate).tz("Asia/Kolkata").toDate()
          : moment().tz("Asia/Kolkata").toDate(),
        delayDays,
        paymentID: paymentDetails.id,
        amountRemains: details.principal,
        amountRemainsInterest: details.interest,
        amountRemainsPenalty: details.penalty,
        amountRemainsBrokenPeriodIntrest: details.bounceCharge,
        panelty: details.updatePenalty,
        brokenPeriodIntrest: details.updateBrokenPeriodIntrest,
        paymentReceived: details.paymentReceived,
      }
    );
  }

  public async updateEmiManualStatus(emiID: number, update: {}): Promise<void> {
    await this.emiService.updateOne(
      { emiID: emiID },
      {
        ...update,
      }
    );
  }

  public async manageManualPayment(
    amount: number,
    waiverAmount: number,
    leadID: number,
    customerID: number,
    discount_type: string,
    trans_id: number,
    order_id: string
  ): Promise<void> {
    let remaningAmount = +amount;
    let waiver = waiverAmount || 0;

    const repaymentData = await this.getRepaymentData(leadID, customerID);
    let remainingAmountEmi = +repaymentData.loanSummary.totalRepay || 0;
    const emis = repaymentData.processedEmis;
    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalPanelty = 0;
    let totalBrokenPeriodIntrest = 0;
    let lastEmi;

    for (const emi of emis) {
      let { principal, interest, panelty, brokenPeriodIntrest } = emi;
      lastEmi = emi;

      if (emi.status == "Paid" || emi.is_deleted == 1) {
        continue;
      }
      // Adjust for part-paid status
      if (emi.status === "Part Paid") {
        principal = emi.amountRemains;
        interest = emi.amountRemainsInterest;
        panelty = emi.amountRemainsPenalty;
        brokenPeriodIntrest = emi.amountRemainsBrokenPeriodIntrest;
        remaningAmount += +emi.paymentReceived;
      }

      totalPrincipal += principal;
      totalInterest += interest;
      totalPanelty += panelty;
      totalBrokenPeriodIntrest += brokenPeriodIntrest;

      // Mark EMI as deleted
      await this.emiModel.findOneAndUpdate(
        { emiID: emi.emiID },
        { is_deleted: 1 }
      );
    }
    const [principalToPay, remaningAfterPrincipal] = this.calculateRemaining(
      remaningAmount,
      totalPrincipal
    );
    const [interestToPay, remaningAfterInterest] = this.calculateRemaining(
      discount_type === "Settlement" ||
        discount_type === "Cooling Period" ||
        discount_type === "Waiver"
        ? remaningAmount - principalToPay != 0
          ? remaningAmount - principalToPay
          : 0
        : remaningAfterPrincipal,
      totalInterest
    );
    const [penaltyToPay, remaningAfterPenalty] = this.calculateRemaining(
      discount_type === "Settlement" ||
        discount_type === "Cooling Period" ||
        discount_type === "Waiver"
        ? interestToPay != 0 && remaningAmount - interestToPay != 0
          ? remaningAmount - interestToPay
          : 0
        : remaningAfterInterest,
      totalPanelty
    );
    const [brokenPeriodToPay, finalRemaningAmount] = this.calculateRemaining(
      discount_type === "Settlement" ||
        discount_type === "Cooling Period" ||
        discount_type === "Waiver"
        ? penaltyToPay != 0 && remaningAmount - penaltyToPay != 0
          ? remaningAmount - penaltyToPay
          : 0
        : remaningAfterPenalty,
      totalBrokenPeriodIntrest
    );
    const status =
      discount_type === "Settlement" ? "Settlement" : discount_type;
    const leadStatus =
      discount_type === "Settlement"
        ? LeadStatus.SETTLEMENT
        : LeadStatus.CLOSED;

    // const pendingAmount =
    //   remaningAfterPrincipal +
    //   remaningAfterInterest +
    //   remaningAfterPenalty +
    //   remaningAfterPenalty

    const pendingAmount = remainingAmountEmi - remaningAmount;
    const waive_off_amount = pendingAmount;

    // Use current date only once
    const currentDate = new Date();

    // Insert EMI data into the database
    let emiID = await this.emiModel.insertEmiInDb(
      lastEmi.creditID,
      lastEmi.customerID,
      lastEmi.leadID,
      lastEmi.productID,
      totalPrincipal,
      totalInterest,
      totalPanelty,
      totalBrokenPeriodIntrest,
      "paid",
      remaningAfterPrincipal,
      remaningAfterInterest,
      remaningAfterPenalty,
      brokenPeriodToPay,
      0,
      0,
      currentDate,
      currentDate,
      0,
      0,
      "0",
      finalRemaningAmount,
      remaningAmount,
      waive_off_amount
    );

    const transSave = {
      transaction_id: trans_id,
      order_id: order_id,
      emi_id: emiID,
      interest: interestToPay,
      principal: principalToPay,
      penalty: penaltyToPay,
      dpd_amount: brokenPeriodToPay,
      transaction_date: currentDate,
      lead_id: leadID,
      emi_status: "paid",
    };
    await this.EMITransaction.create(transSave);

    /*
    PendingAmount

    pendingAmount: number = 0,              
    lastCollectedDate: Date | null = null,  
    accessAmount: number = 0,          
    paymentReceived: number = 0,
    waive_off_amount: number   
    */
    // Update credit and lead status
    await this.creditService.updateOne(
      { creditID: lastEmi.creditID },
      { status: status }
    );
    await this.leadService.updateOne(
      { leadID: lastEmi.leadID },
      { status: leadStatus }
    );
  }

  // Helper function to calculate remaining amounts
  private calculateRemaining(amount: number, total: number): [number, number] {
    const toPay = Math.min(total, amount);
    return [toPay, total - toPay];
  }

  public async getRepaymentData(
    leadId: number,
    customerID: number
  ): Promise<any> {
    // Fetch credit and loan details concurrently
    const [credit, loanData] = await Promise.all([
      this.creditService.findOne({ leadID: leadId }, [
        "creditID",
        "leadID",
        "tenure",
        "amountToBeRepayed",
        "principal",
        "firstDueDate",
        "roi",
        "created_at",
      ]) as Promise<ICredit>,
      this.loanService.findOne({ leadID: leadId }, [
        "loanNo",
        "disbursalDate",
        "status",
      ]) as Promise<ILoan>,
    ]);

    if (!credit) {
      throw new BadRequestError("No Active Emi Loan Found");
    }
    if (!loanData) {
      throw new BadRequestError("No loan Data found for this customer");
    }
    // let leadData = await this.leadService.findOne(
    //   { leadID: leadId },
    //   ['status'],
    //   [{ column: 'leadID', order: 'desc' }],
    // )

    // Fetch EMIs and transactions concurrently
    const [getEmis, transactions] = await Promise.all([
      this.emiService.find(
        { creditID: credit.creditID, is_deleted: 0 },
        [{ column: "emiID", order: "asc" }],
        [
          "principal",
          "interest",
          "panelty",
          "amountPayable",
          "dueDate",
          "status",
          "brokenPeriodIntrest",
          "amountRemains",
          "amountRemainsInterest",
          "amountRemainsPenalty",
          "amountRemainsBrokenPeriodIntrest",
          "paymentReceived",
          "actualPaymentDate",
          "emiID",
          "creditID",
          "customerID",
          "leadID",
          "productID",
          "is_deleted",
          "accessAmount",
          "waive_off_amount",
          "updatedAt",
        ]
      ),
      this.transectionService.findTransaction(
        { customerID },
        { orderKey: "id", orderValue: "desc" },
        ["amount", "status", "mode", "referenceNo", "createdAt"],
        ["collection"]
      ),
    ]);

    if (!getEmis) {
      throw new Error("No Emis breakdown found");
    }

    // Process EMI Data
    const processedEmis = await Promise.all(
      getEmis.map(async (emi) => this.processEmi(emi, credit))
    );

    // let tempAmountPayable: number
    // let isTempWaiverActive: number
    for (let i = 0; i < processedEmis.length; i++) {
      if (
        processedEmis[i].status === "Part Paid" ||
        processedEmis[i].status === "Due" ||
        processedEmis[i].status === "Overdue"
      ) {
        credit.firstDueDate = processedEmis[i].dueDate;
        credit.amountToBeRepayed = processedEmis[i].amountPayable;
        // tempAmountPayable = processedEmis[i].tempAmountPayable
        // isTempWaiverActive = processedEmis[i].isTempWaiverActive
        break; // Exit the loop once the condition is met
      }
    }
    // let totalRepay = 0
    // for (let i = 0; i < processedEmis.length; i++) {
    //   if (
    //     processedEmis[i].status === 'Part Paid' ||
    //     processedEmis[i].status === 'Due' ||
    //     processedEmis[i].status === 'Overdue'
    //   ) {
    //     totalRepay += processedEmis[i].amountPayable
    //   }
    // }

    const lastPaymentDate = this.calculateLastPaymentDate(transactions);
    const Emi = getEmis[0]?.principal + getEmis[0]?.interest || 0;
    const loanSummary = {
      ...credit,
      Emi,
      loanNumber: loanData.loanNo,
      disbursalDate: loanData.disbursalDate,
      lastPaymentDate,
      //totalRepay: totalRepay,
      // status: leadData.status,
      // tempAmountPayable,
      // isTempWaiverActive,
    };
    // Prepare transaction details
    const getTransections = transactions
      ? transactions.map((transection) => this.processTransaction(transection))
      : [];

    const emiDocs = [
      {
        text: "Loan Agreement",
        link: "https://example.com/loan-agreement.pdf",
      },
      {
        text: "Sanction Letter",
        link: "https://example.com/sanction-letter.pdf",
      },
      {
        text: "Account Statement",
        link: "https://example.com/loan-statement.pdf",
      },
    ];

    return { loanSummary, processedEmis, getTransections, emiDocs };
  }

  public async createOtherCharges(
    other: IOtherCharges,
    emi: number,
    amount: number
  ): Promise<void> {
    await this.OtherCharges.create(
      emi,
      other.creditID,
      amount,
      other.customerID,
      other.transectionID,
      other.discription,
      other.loanID,
      other.leadID,
      "due"
    );
  }
  /*
    public async createCollectionRecord(credit: ICredit, loan: ILoan, amount: number, orderId: string): Promise<void> {
      await this.collectionService.create(
        credit.customerID,
        credit.leadID,
        loan.loanNo,
        amount,
        'Payment Gateway',
        new Date(),
        orderId,
        0,
        '',
        'Payment Gateway'
      );
    }
    */

  public async findLead(leadID: number): Promise<ILead | null> {
    return await this.leadService.findOne({ leadID });
  }

  public async createCallHistoryLog(
    credit: ICredit,
    lead: ILead,
    amount: string
  ): Promise<void> {
    const data: ICallHistoryLog = {
      customerID: credit.customerID,
      leadID: credit.leadID,
      callType: "IVR",
      status: lead.status,
      appAmount: amount,
      noteli: lead.status,
      remark: "Manual EMI Payment",
      callbackTime: new Date(Date.now()),
      calledBy: 1,
    };

    await this.callHistoryLogService.create(data);
  }

  public async callFindOneTransection(
    order_id: string
  ): Promise<ITransection | ICustomResponse> {
    const where = { orderID: order_id };
    const order = { orderKey: "createdAt", orderValue: "DESC" };
    const select = ["*"];

    const result = await this.transectionService.findOne(where, order, select);

    return result;
  }

  public async handleTransaction(
    paymentDetails: any,
    credit: ICredit,
    loan: ILoan,
    gateway: number
  ): Promise<number> {
    try {
      const razorpayId = await this.transectionService.findOne(
        { orderId: paymentDetails.order_id },
        { orderKey: "id", orderValue: "DESC" },
        ["*"]
      );
      if (razorpayId && razorpayId.status != 0) {
        await this.transectionService.updateOne(
          { orderId: paymentDetails.order_id },
          {
            status: paymentDetails.status === "captured" ? 1 : 0,
          }
        );
        console.log("razorpayId==========>>>>>>>>>>>>", razorpayId.id);
        return razorpayId.id;
      }
      const lead = await this.leadService.findOne({ leadID: credit.leadID }, [
        "lenderID",
      ]);

      let insertedID = await this.transectionService.create(
        credit.customerID,
        credit.leadID,
        loan.loanNo,
        paymentDetails.status === "captured"
          ? 1
          : paymentDetails.status === "pending"
          ? 2
          : 0,
        "collection",
        paymentDetails.method,
        paymentDetails.order_id,
        paymentDetails.order_id,
        0,
        gateway === 1
          ? "Razorpay"
          : gateway === 2
          ? "Payu"
          : gateway === 3
          ? "Payu Bill Payment"
          : "Manual",
        paymentDetails.userID !== null &&
          paymentDetails.userID !== undefined &&
          paymentDetails.userID !== ""
          ? paymentDetails.userID
          : 1,
        paymentDetails.userID !== null &&
          paymentDetails.userID !== undefined &&
          paymentDetails.userID !== ""
          ? paymentDetails.userID
          : 1,
        paymentDetails.amount,
        0,
        paymentDetails.transactionDate,
        paymentDetails.remarks,
        paymentDetails.payment_transaction_status,
        paymentDetails.waiver,
        paymentDetails.discount_type,
        lead.lenderID
      );
      return insertedID;
    } catch (error) {
      console.error("Error in handleTransaction:", error);
      return 0;
    }
  }

  // Helper function to process EMI details
  public processEmi = async (emi: any, credit: ICredit) => {
    let dueDate = new Date(format(new Date(emi.dueDate), "yyyy-MM-dd"));
    let diffDate = dueDate;
    let penalityDays = 0;
    let dpd = "";
    const currentDate = new Date();
    let delayDays = Math.max(0, differenceInCalendarDays(currentDate, dueDate));

    if (new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) {
      diffDate = emi.actualPaymentDate;
      penalityDays = Math.max(
        0,
        differenceInCalendarDays(currentDate, diffDate)
      );
    } else {
      penalityDays = delayDays;
    }

    if (
      delayDays > 0 &&
      emi.status !== "partially-paid" &&
      emi.status !== "paid"
    ) {
      emi.brokenPeriodIntrest = this.emiService.bounceCharge();
      emi.amountRemainsInterest = 0;
      emi.amountRemainsPenalty = 0;
      emi.panelty = this.emiService.roundToTwo(
        this.emiService.calculatePenalty(
          emi.principal,
          penalityDays,
          credit.roi
        )
      );
      //emi.panelty = this.emiService.roundToTwo(emi.panelty);
      emi.amountRemainsBrokenPeriodIntrest = 0;
      emi.amountPayable = this.emiService.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest
      );
    } else if (emi.status == "partially-paid") {
      emi.brokenPeriodIntrest =
        emi.brokenPeriodIntrest == 0 && penalityDays > 0
          ? this.emiService.bounceCharge()
          : emi.brokenPeriodIntrest;
      emi.panelty =
        +emi.panelty +
        this.emiService.calculatePenalty(
          emi.amountRemains,
          penalityDays,
          credit.roi
        );
      emi.panelty = this.emiService.roundToTwo(emi.panelty);
      emi.amountPayable = this.emiService.roundToTwo(
        emi.principal +
          emi.interest +
          emi.panelty +
          emi.brokenPeriodIntrest -
          emi.paymentReceived
      );
    } else if (emi.status == "paid") {
      emi.amountPayable = this.emiService.roundToTwo(
        emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest
      );
      if (new Date(emi.actualPaymentDate) > new Date(emi.dueDate))
        dpd = String(
          Math.max(
            0,
            differenceInCalendarDays(emi.actualPaymentDate, emi.dueDate)
          )
        );
    }

    const pendingAmount = this.emiService.roundToTwo(
      this.calculatePendingAmount(emi, delayDays)
    );
    const totalPaid = this.emiService.roundToTwo(emi.paymentReceived); //await this.transectionService.sumOfTransaction(emi.emiID);
    let setBounceFee = delayDays > 0 ? this.emiService.bounceCharge() : 0;
    emi.amountPayable = this.emiService.roundToTwo(emi.amountPayable);

    // ! Check for any active waivers

    // const waiver = await this.waiverModel.findOne({
    //   where: {
    //     credit_id: credit.creditID,
    //     emi_id: emi.emiID,
    //     type: WaiverType.TEMPORARY,
    //     product: Products.EMI,
    //     status: WaiverStatus.APPROVED,
    //     is_paid: false,
    //   },
    //   select: ['emi_id', 'amount', 'id'],
    // })

    // const amountPayable = waiver
    //   ? this.emiService.roundToTwo(emi.amountPayable) -
    //     this.emiService.roundToTwo(emi.waive_off_amount) -
    //     this.emiService.roundToTwo(waiver.amount)
    //   : this.emiService.roundToTwo(emi.amountPayable) -
    //     this.emiService.roundToTwo(emi.waive_off_amount)

    // emi.amountPayable = amountPayable
    // emi.waive_off_amount = this.emiService.roundToTwo(emi.waive_off_amount)
    // emi.tempAmountPayable = waiver
    //   ? emi.amountPayable - this.emiService.roundToTwo(waiver.amount)
    //   : 0
    // emi.isTempWaiverActive = waiver ? true : false
    setBounceFee = this.emiService.roundToTwo(setBounceFee);
    // emi.status = this.updateEmiStatus(emi, delayDays);
    emi.dueDate = dueDate;
    let blanceColor: string;
    (emi as any).lists = [
      {
        text: "Principal",
        value: `₹${emi.principal}`,
        color: "#5A5A5A",
        bgcolor: "",
      },
      {
        text: "Interest",
        value: `₹${emi.interest}`,
        color: "#5A5A5A",
        bgcolor: "",
      },
      {
        text: "Penalty",
        value: `₹${emi.panelty}`,
        color: "#5A5A5A",
        bgcolor: "",
      },
      {
        text: "Bounce Charges (incl. GST)",
        value: `₹${emi.brokenPeriodIntrest}`,
        color: "#5A5A5A",
        bgcolor: "",
      },
      {
        text: "Amount Paid",
        value: `₹${totalPaid}`,
        color: "#F33C3C",
        bgcolor: "",
      },
      {
        text: "Balance Amount",
        value: `₹${pendingAmount}`,
        color: "#182BDA",
        bgcolor: "",
      },
    ];

    if (delayDays > 0 && emi.status != "paid") {
      emi.status = "Overdue";
      emi.color = "#F33C3C";
      emi.bgcolor = "#FCE0E0";
      blanceColor = "#F33C3C";
    } else {
      blanceColor = "#F33C3C";
      switch (emi.status) {
        case "paid":
          emi.status = "Paid";
          emi.color = "#0EBB53";
          emi.bgcolor = "#E5F6EC";
          break;
        case "partially-paid":
          emi.status = "Part Paid";
          emi.color = "#D4AF37";
          emi.bgcolor = "#F9F5E9";
          break;
        default:
          emi.status = "Due";
          emi.color = "#182BDA";
          emi.bgcolor = "#E6E8FA";
          break;
      }
    }

    (emi as any).lists = [
      {
        text: "Principal",
        value: `₹${emi.principal}`,
        color: "#5A5A5A",
        bgcolor: "",
      },
      {
        text: "Interest",
        value: `₹${emi.interest}`,
        color: "#5A5A5A",
        bgcolor: "",
      },
      {
        text: "Penalty",
        value: `₹${emi.panelty}`,
        color: "#5A5A5A",
        bgcolor: "",
      },
      {
        text: "Bounce Charges (incl. GST)",
        value: `₹${emi.brokenPeriodIntrest}`,
        color: "#5A5A5A",
        bgcolor: "",
      },
      {
        text: "Amount Paid",
        value: `-₹${totalPaid}`,
        color: "#14D44A",
        bgcolor: "",
      },
      {
        text: "Balance Amount",
        value: `₹${pendingAmount}`,
        color: blanceColor,
        bgcolor: "",
      },
    ];
    emi.dpd = dpd;

    return emi;
  };

  // Helper function to calculate pending amounts
  public calculatePendingAmount = (emi: any, delayDays: number) => {
    const pendingBounce =
      emi.status == "paid"
        ? 0
        : emi.status === "partially-paid"
        ? emi.amountRemainsBrokenPeriodIntrest
        : delayDays > 0
        ? this.emiService.bounceCharge()
        : 0;

    const pendingPenality =
      emi.status == "paid"
        ? 0
        : emi.status === "partially-paid"
        ? emi.amountRemainsPenalty
        : emi.panelty;

    const payAmount =
      emi.status == "paid"
        ? 0
        : emi.status === "partially-paid"
        ? emi.amountRemains
        : emi.principal;

    const pendingInterest =
      emi.status == "paid"
        ? 0
        : emi.status === "partially-paid"
        ? emi.amountRemainsInterest
        : emi.interest;

    return pendingPenality + payAmount + pendingBounce + pendingInterest;
  };

  // Helper function to update EMI status
  public updateEmiStatus = (emi: any, delayDays: number) => {
    if (delayDays > 0) {
      return "Overdue";
    }

    switch (emi.status) {
      case "paid":
        return "Paid";
      case "partially-paid":
        return "Part Paid";
      default:
        return "Due";
    }
  };

  // Helper function to process transactions
  public processTransaction = (transection: any) => {
    const { amount, status, mode, referenceNo, createdAt } = transection;

    const formattedStatus = status === 1 || status === 3 ? "Success" : "Failed";
    const formattedDate = new Date(createdAt)
      .toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .replace(",", "");

    return {
      amount: { text: "Amount", value: amount, color: "#1F1F1F", bgColor: "" },
      status: {
        text: "Status",
        value: formattedStatus,
        color: status === 1 || status === 3 ? "#14D44A" : "#D93C3C",
        bgColor: "",
      },
      createdAt: {
        text: "Date & Time",
        value: formattedDate,
        color: "#585858",
        bgColor: "",
      },
      referenceNo: {
        text: "Transaction ID",
        value: referenceNo,
        color: "#585858",
        bgColor: "",
      },
      mode: {
        text: "Payment mode",
        value: mode,
        color: "#585858",
        bgColor: "",
      },
    };
  };

  // Helper function to calculate last payment date
  public calculateLastPaymentDate = (transactions) => {
    let lastPaymentDate = "";
    if (!transactions) {
      return lastPaymentDate;
    }
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].status === 1) {
        lastPaymentDate = transactions[i].createdAt;
        break; // Exit the loop once the condition is met
      }
    }
    return lastPaymentDate;
  };
}

export default EmiCollectionService;
