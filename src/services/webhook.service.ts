import { paymentLogsModel } from "@/common/common-module/src/database/mongo/paymentLogs";
import { LenderCredentials } from "@/common/common-module/src/enums/lender.enum";
import { IPaymentLogs } from "@/common/common-module/src/interfaces/paymentLog.interface";
import { razorPayPayments } from "@/common/common-module/src/utils/razorpayClient.utils";
import config from "@/config/default";
import CollectionModel from "@/database/mysql/collection";
import { CollectedMode, CollectionStatus } from "@/enums/collection.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { ProductID } from "@/enums/product.enum";
import CommonHelper from "@/helpers/common";
import {
  IRazorpayEmi,
  IRazorpayVerification,
  IRazorpayWebhook,
} from "@/interfaces/collection.interface";
import { ILead } from "@/interfaces/lead.interface";
import { IPayUReq } from "@/interfaces/transections.interface";
import OnlinePaymentModel from "@/mysql/onlinepayment";
import OnlinePaymentLogModel from "@/mysql/onlinepaymentlog";
import {
  calculateTotalRepayPaydayAmountIPC,
  calculateTotalRepayPaydayAmountNonIPC,
} from "@/utils/Ipc_Calculation";
import { logger } from "@/utils/logger";
import { getKnexInstance } from "@/utils/mysql";
import RazorpayPG from "@/utils/razorpayClient.utils";
import {
  calculate_repay_amount_ipc,
  updateLoanCollectionAmount,
} from "@/utils/repayment";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import moment from "moment";
import ApprovalService from "./approval.service";
import CollectionService from "./collection.service";
import CustomerService from "./customer.service";
import LeadService from "./lead.service";
import LoanService from "./loan.service";
import ResponseService from "./response.service";

class WebhookService extends ResponseService {
  private readonly razorpayPg = new RazorpayPG();
  private readonly commonHelper = new CommonHelper();
  private readonly onlinepayment = new OnlinePaymentModel();
  private readonly customerService = new CustomerService();
  private readonly leadService = new LeadService();
  private readonly loanService = new LoanService();
  private readonly approvalService = new ApprovalService();
  private readonly onlinePaymentLogModel = new OnlinePaymentLogModel();
  private readonly collectionService = new CollectionService();
  private readonly collectionModel = new CollectionModel();
  private readonly razorPayPayments = razorPayPayments;
  private readonly paymentLogModel = paymentLogsModel;

  get Knex() {
    let db = getKnexInstance();
    return db;
  }

  async repaymentWebhook(body: IRazorpayWebhook): Promise<void> {
    const json_a2 = body;
    if (json_a2?.payload?.payment?.entity?.notes?.disableWebhook) {
      logger.info("Webhook trigger not required for this scenario");
      return;
    }
    const razorpayPaymentId = json_a2.payload.payment.entity.id;
    const razorpayAmountReceived = json_a2.payload.payment.entity.amount;
    let db = getKnexInstance();
    if (!razorpayPaymentId) {
      logger.error("Payment ID is missing");
      return;
    }

    const razorpayOrderId = json_a2.payload.payment.entity.order_id;
    const method = json_a2.payload.payment.entity.method;
    let status = json_a2.payload.payment.entity.status;
    let created_at = json_a2.created_at
      ? new Date(json_a2.created_at * 1000)
      : new Date();

    await this.onlinepayment.findOneAndUpdateOnlinepayment(
      { razorpayOrderId: razorpayOrderId },
      { toValue: razorpayAmountReceived / 100 }
    );
    const ema = await this.onlinepayment.findOneOnlinePayment(
      { razorpayOrderId: razorpayOrderId },
      ["*"],
      [{ column: "pID", order: "desc" }]
    );

    if (
      ema?.paymentType === "E-mandate Charge" &&
      (ema?.method === "emandate" || ema?.method === "E-mandate")
    ) {
      created_at = ema?.makerstamp;
    }

    const paymentResponse = await axios.get(
      `https://api.razorpay.com/v1/payments/${razorpayPaymentId}`,
      {
        headers: {
          Authorization: `Basic ${this.razorpayPg.auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    // handle error here if no response or error came from paymentResponse
    const data = paymentResponse.data;
    const fetch_oder_amount = data.amount;
    const fetch_status = data.status;
    const fetch_orderid = data.order_id;

    if (
      !fetch_oder_amount ||
      fetch_oder_amount != razorpayAmountReceived ||
      fetch_status != status ||
      fetch_orderid != razorpayOrderId
    ) {
      logger.error("Data mismatch or verification failed");
      return;
    }
    let customer = await this.customerService.findOne(
      {
        mobile: ema?.phone,
        pancard: ema?.message,
        email: ema?.email,
        isVerified: false,
      },
      ["customerID"]
    );

    if (!customer) {
      logger.error("customer not found");
      return;
    }

    const leadsQuery = await db<ILead>("leads")
      .select("ipc")
      .where("leadID", ema.leadID)
      .andWhere((builder) => {
        builder.where("status", "Disbursed").orWhere("status", "Part Payment");
      })
      .first();
    let loan = await this.loanService.findOne({ leadID: ema.leadID }, [
      "loanNo",
      "disbursalAmount",
      "customerID",
      "leadID",
      "disbursalDate",
    ]);

    let approval = await this.approvalService.findOne(
      { leadID: ema.leadID },
      ["roi"],
      [{ column: "approvalID", order: "desc" }]
    );

    const totalCollected = await db("collection")
      .where({
        leadID: ema.leadID,
        collectionStatus: "Approved",
      })
      .sum("collectedAmount as tc")
      .first();

    const repaymentDays = differenceInCalendarDays(
      new Date(),
      new Date(loan.disbursalDate)
    );

    const interestRate = +config.rate_of_interest / 100;
    const interest = Math.round(
      loan.disbursalAmount * interestRate * repaymentDays
    );
    const totalPayable = loan.disbursalAmount + interest;
    let remainingAmount = Math.round(totalPayable - totalCollected.tc);
    const paymentGivenAmount = Math.round(ema.toValue);
    let baseUrl = this.commonHelper.getBaseUrl();

    if (leadsQuery && leadsQuery.ipc === 1) {
      const repayAmountResponse = await calculate_repay_amount_ipc(
        ema.leadID.toString(),
        moment().format("YYYY-MM-DD")
      );
      remainingAmount = repayAmountResponse?.totalPayableAmount || 0;
      // const ipcResponse = await axios.post(
      //   `${baseUrl}/loanapply/ramfincorp_api/get_repayment_amount_ipc`,
      //   { leadID: ema.leadID },
      //   { headers: { "Content-Type": "application/json" } }
      // );
      // if (ipcResponse.data) {
      //   remainingAmount = ipcResponse.data.Total_Payable_Amount || 0;
      // }
    }
    let collectionStatus =
      paymentGivenAmount >= remainingAmount
        ? CollectionStatus.CLOSED
        : CollectionStatus.PART_PAYMENT;
    //status = 'captured'
    let onlinePaymentLogData = {
      paymentStatus: status,
      razorpayPaymentId,
      razorpayOrderId,
      pID: String(ema.pID),
      payload: JSON.stringify(json_a2),
      razorpay_amount: razorpayAmountReceived / 100,
    };
    await this.onlinePaymentLogModel.create(onlinePaymentLogData);
    if (ema.paymentStatus === "SUCCESS") {
      return; // Exit if already successful
    } else {
      if (status === "captured") {
        await this.onlinepayment.findOneAndUpdateOnlinepayment(
          { razorpayOrderId: razorpayOrderId },
          {
            paymentStatus: "SUCCESS",
            razorpayPaymentId: razorpayPaymentId,
            method: method,
          }
        );
        if (loan.customerID) {
          const existingCollection = await this.collectionService.findOne(
            {
              orderID: razorpayOrderId,
            },
            ["leadID"],
            [{ column: "leadID", order: "desc" }]
          );

          if (!existingCollection) {
            const settlemenAmount = 0;
            const discountAmount = 0;

            let lead = await this.leadService.findOne(
              { leadID: loan.leadID },
              ["ipc"],
              [{ column: "leadID", order: "desc" }]
            );

            if (lead && lead.ipc === 1) {
              const data = {
                leadID: loan.leadID,
                customerID: loan.customerID,
                collectedAmount: ema.toValue,
                collectedDate: format(new Date(), "yyyy-MM-dd"),
                status: collectionStatus,
                collectedMode: CollectedMode.PAYMENT_GATEWAY,
                remarks: "Auto Collection",
                referenceNo: razorpayOrderId,
                discountAmount,
                settlemenAmount: settlemenAmount,
                collectionStatus: CollectionStatus.APPROVED,
                userID: 1,
                collected_on_date: new Date(created_at),
              };
              // await axios.post(
              //   `${baseUrl}/loanapply/ramfincorp_api/add_collected_payments_ipc`,
              //   data,
              //   { headers: { "Content-Type": "application/json" } }
              // );
              await updateLoanCollectionAmount(data);
            } else {
              let collectionData = {
                customerID: loan.customerID,
                leadID: loan.leadID,
                loanNo: loan.loanNo,
                collectedAmount: ema.toValue,
                collectedMode: CollectedMode.PAYMENT_GATEWAY,
                collectedDate: format(created_at, "yyyy-MM-dd"),
                referenceNo: razorpayOrderId,
                discountAmount,
                settlemenAmount: settlemenAmount,
                status: collectionStatus,
                remark: "Auto Collection",
                collectedBy: 1,
                collectionStatus: CollectionStatus.APPROVED,
                collectionStatusby: "no",
                orderID: razorpayOrderId,
              };
              const insertedCollectionId = await this.collectionModel.create(
                collectionData
              );

              let leadDetail = await this.leadService.findOne(
                { leadID: loan.leadID },
                ["ipc", "alloUID"],
                [{ column: "leadID", order: "desc" }]
              );
              if (
                leadDetail &&
                leadDetail.alloUID &&
                leadDetail.alloUID !== "0"
              ) {
                await db("leads_agent_collection").insert({
                  leadID: loan.leadID,
                  agent_id: leadDetail.alloUID,
                  collectionID: insertedCollectionId[0],
                  collectedAmount: ema.toValue,
                });
              }
            }

            // await this.leadService.updateOne(
            //   { leadID: loan.leadID },
            //   { status: collectionStatus as unknown as LeadStatus }
            // );
            // await this.onlinepayment.findOneAndUpdateOnlinepayment(
            //   { razorpayOrderId: razorpayOrderId },
            //   { status: collectionStatus, approved_id: 1 }
            // );
          }
        }
      } else if (status === "failed") {
        await this.onlinepayment.findOneAndUpdateOnlinepayment(
          { razorpayOrderId: razorpayOrderId },
          { paymentStatus: "failed", razorpayPaymentId, method }
        );
      }
    }
  }
  async repaymentVerificationWebhook(
    body: IRazorpayVerification
  ): Promise<void> {
    let {
      razorpay_paymentId,
      razorpay_orderId,
      amount,
      status,
      method,
      createdAt,
      mandateDate,
    } = body;
    const razorpayPaymentId = razorpay_paymentId;
    const razorpayAmountReceived = amount;
    let db = getKnexInstance();
    if (!razorpayPaymentId) {
      logger.error("Payment ID is missing");
      return;
    }

    const razorpayOrderId = razorpay_orderId;
    // let created_at = createdAt
    //   ? new Date(createdAt * 1000)
    //   : new Date(new Date().setDate(new Date().getDate() - 1))
    let created_at = format(new Date(createdAt * 1000), "yyyy-MM-dd");

    created_at = mandateDate ? mandateDate : created_at;

    console.log("created_at", created_at);

    const paymentResponse = await axios.get(
      `${config.razorPayBaseUrl}/payments/${razorpayPaymentId}`,
      {
        headers: {
          Authorization: `Basic ${this.razorpayPg.auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = paymentResponse.data;
    const fetch_oder_amount = data.amount;
    const fetch_status = data.status;
    const fetch_orderid = data.order_id;
    if (
      !fetch_oder_amount ||
      fetch_oder_amount != razorpayAmountReceived ||
      fetch_status != status ||
      fetch_orderid != razorpayOrderId
    ) {
      logger.error("Data mismatch or verification failed");
      return;
    }

    await this.onlinepayment.findOneAndUpdateOnlinepayment(
      { razorpayOrderId: razorpayOrderId },
      { toValue: razorpayAmountReceived / 100 }
    );
    const ema = await this.onlinepayment.findOneOnlinePayment(
      { razorpayOrderId: razorpayOrderId },
      ["*"],
      [{ column: "pID", order: "desc" }]
    );
    if (!ema) {
      logger.error("No record found for razorpayOrderId:", razorpayOrderId);
      return;
    }
    if (ema.paymentStatus === "SUCCESS") {
      return;
    }
    const leadsQuery = await db<ILead>("leads")
      .select("ipc", "productID")
      .where("leadID", ema.leadID)
      .andWhere((builder) => {
        builder
          .where("status", "Disbursed")
          .orWhere("status", "Part Payment")
          .orWhere("status", "Closed")
          .orWhere("status", "Settlement");
      })
      .first();
    if (leadsQuery?.productID === ProductID.EMI) {
      try {
        const paymentDetailsData = {
          amount: amount,
          order_id: razorpayOrderId,
          status: status,
          id: razorpayPaymentId,
          transactionDate: moment(created_at)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD"),
          paymentDate: moment(created_at)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD"),
        };
        const emiData = await this.sendPaymentUpdateEMIVerification(
          paymentDetailsData
        );
        return;
      } catch (error) {
        console.error("Error occurred while processing EMI payment:", error);
        return;
      }
    }
    let customer = await this.customerService.findOne(
      {
        mobile: ema?.phone,
        pancard: ema?.message,
        email: ema?.email,
        isVerified: false,
      },
      ["customerID"]
    );

    if (!customer) {
      logger.error("customer not found");
      return;
    }
    let loan = await this.loanService.findOne({ leadID: ema.leadID }, [
      "loanNo",
      "disbursalAmount",
      "customerID",
      "leadID",
      "disbursalDate",
    ]);
    let remainingAmount = await calculateTotalRepayPaydayAmountNonIPC(
      ema.leadID
    );
    const paymentGivenAmount = Math.round(ema.toValue);
    let baseUrl = this.commonHelper.getBaseUrl();

    if (leadsQuery && leadsQuery.ipc === 1) {
      try {
        const ipcResponse = await axios.post(
          `${baseUrl}/loanapply/ramfincorp_api/get_repayment_amount_ipc`,
          { leadID: ema.leadID, collected_on_date: created_at },
          { headers: { "Content-Type": "application/json" } }
        );

        if (ipcResponse?.data) {
          remainingAmount = ipcResponse.data.Total_Payable_Amount || 0;
        } else {
          return;
        }
      } catch (error) {
        console.error("Error fetching IPC repayment amount:", error);
        return;
      }
    }
    let collectionStatus =
      paymentGivenAmount >= remainingAmount
        ? CollectionStatus.CLOSED
        : CollectionStatus.PART_PAYMENT;
    if (status === "captured") {
      await this.onlinepayment.findOneAndUpdateOnlinepayment(
        { razorpayOrderId: razorpayOrderId },
        {
          paymentStatus: "SUCCESS",
          razorpayPaymentId: razorpayPaymentId,
          method: method,
        }
      );
      const existingCollection = await this.collectionService.findOne(
        {
          orderID: razorpayOrderId,
        },
        ["leadID"],
        [{ column: "leadID", order: "desc" }]
      );

      if (!existingCollection) {
        const settlemenAmount = 0;
        const discountAmount = 0;

        let lead = await this.leadService.findOne(
          { leadID: loan.leadID },
          ["ipc"],
          [{ column: "leadID", order: "desc" }]
        );
        if (lead && lead.ipc === 1) {
          try {
            const data = {
              leadID: loan.leadID,
              customerID: loan.customerID,
              collectedAmount: ema.toValue,
              collectedDate: format(new Date(created_at), "yyyy-MM-dd"),
              status: collectionStatus,
              collectedMode: CollectedMode.PAYMENT_GATEWAY,
              remarks: "Auto Collection",
              referenceNo: razorpayOrderId,
              discountAmount,
              settlemenAmount: settlemenAmount,
              collectionStatus: CollectionStatus.APPROVED,
              userID: "1",
              collected_on_date: new Date(created_at),
            };
            await axios.post(
              `${baseUrl}/loanapply/ramfincorp_api/add_collected_payments_ipc`,
              data,
              { headers: { "Content-Type": "application/json" } }
            );
          } catch (error) {
            return;
          }
        } else {
          let collectionData = {
            customerID: loan.customerID,
            leadID: loan.leadID,
            loanNo: loan.loanNo,
            collectedAmount: ema.toValue,
            collectedMode: CollectedMode.PAYMENT_GATEWAY,
            collectedDate: format(new Date(created_at), "yyyy-MM-dd"),
            referenceNo: razorpayOrderId,
            discountAmount,
            settlemenAmount: settlemenAmount,
            status: collectionStatus,
            remark: "Auto Collection",
            collectedBy: 1,
            collectionStatus: CollectionStatus.APPROVED,
            collectionStatusby: "no",
            orderID: razorpayOrderId,
          };
          const insertedCollectionId = await this.collectionModel.create(
            collectionData
          );

          let leadDetail = await this.leadService.findOne(
            { leadID: loan.leadID },
            ["ipc", "alloUID"],
            [{ column: "leadID", order: "desc" }]
          );

          await this.leadService.updateOne(
            { leadID: loan.leadID },
            { status: collectionStatus as unknown as LeadStatus }
          );
          await this.onlinepayment.findOneAndUpdateOnlinepayment(
            { razorpayOrderId: razorpayOrderId },
            { status: collectionStatus, approved_id: 1 }
          );
          if (leadDetail && leadDetail.alloUID && leadDetail.alloUID !== "0") {
            await db("leads_agent_collection").insert({
              leadID: loan.leadID,
              agent_id: leadDetail.alloUID,
              collectionID: insertedCollectionId[0],
              collectedAmount: ema.toValue,
            });
          }
        }
      }
    } else if (status === "failed") {
      await this.onlinepayment.findOneAndUpdateOnlinepayment(
        { razorpayOrderId: razorpayOrderId },
        { paymentStatus: "failed", razorpayPaymentId, method }
      );
    }
  }

  // private sendPaymentUpdateEMIVerification = async (
  //   json_an: IRazorpayEmi,
  // ): Promise<string> => {
  //   let baseUrl = this.commonHelper.getBaseUrl()

  //   const api = `${baseUrl}/new-api/customers/updateEMIPaymentVerification`
  //   try {
  //     const response = await axios.post(api, json_an, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     console.log('reponse', response.data)
  //     return response.data
  //   } catch (error) {
  //     return `Error: ${error.message}`
  //   }
  // }
  public async payUPaymentCronSettlement(
    responseData: IPayUReq
  ): Promise<boolean> {
    const { leadID, txnId, bank_ref_no, amount, payU_date } = responseData;
    const db = getKnexInstance();
    let baseUrl: string = this.commonHelper.getBaseUrl();

    try {
      let checkData = await db("leads")
        .join("loan", "leads.leadID", "=", "loan.leadID")
        .join("approval", "leads.leadID", "=", "approval.leadID")
        .join("customer", "leads.customerID", "=", "customer.customerID")
        .select(
          "leads.*",
          "customer.customerID",
          "customer.mobile",
          "customer.email",
          "approval.repayDate",
          "loan.loanNo"
        )
        .where("leads.leadID", leadID)
        .whereIn("leads.status", [
          "Disbursed",
          "Part Payment",
          "Closed",
          "Settlement",
        ])
        .where("loan.status", "Disbursed")
        .where("loan.payout_status", 2)
        .first();
      if (!checkData) {
        return false;
      }
      const customerID = checkData.customerID;
      let totalRepayAmount: number = 0;
      let checkStatus: string;
      if (checkData.ipc === 1) {
        totalRepayAmount = await calculateTotalRepayPaydayAmountIPC(
          leadID,
          checkData.status
        );
      } else {
        totalRepayAmount = await calculateTotalRepayPaydayAmountNonIPC(leadID);
      }

      checkStatus = amount >= totalRepayAmount ? "Closed" : "Part Payment";

      let data = {
        customerID,
        leadID,
        loanNo: checkData.loanNo,
        collectedAmount: amount,
        collectedMode: "PayU",
        collectedDate: format(new Date(payU_date), "yyyy-MM-dd"),
        referenceNo: txnId,
        discountAmount: 0,
        settlemenAmount: 0,
        status: checkStatus,
        remark: "Auto Collection",
        collectedBy: 1,
        collectionStatus: CollectionStatus.APPROVED,
        collectionStatusby: "no",
        orderID: txnId,
      };

      if (checkData.productID === ProductID.EMI) {
        try {
          const payuData = {
            order_id: txnId,
            amount,
            paymentID: bank_ref_no,
            userID: 1,
            transactionDate: format(new Date(payU_date), "yyyy-MM-dd"),
            status: "captured",
            paymentDate: format(new Date(payU_date), "yyyy-MM-dd"),
          };
          baseUrl = this.commonHelper.getBaseUrl();
          const api = `${baseUrl}/new-api/customers/updateEMIPaymentPayu`;
          const response = await axios.post(api, payuData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          return true;
        } catch (error) {
          console.log("Error occurred while processing PayU payment:", error);
          return false;
        }
      } else if (checkData.ipc === 1) {
        try {
          const data = {
            leadID: leadID,
            customerID: customerID,
            collectedAmount: amount,
            collectedDate: format(new Date(payU_date), "yyyy-MM-dd"),
            status: checkStatus,
            collectedMode: "PayU",
            remarks: "Auto Collection",
            referenceNo: txnId,
            discountAmount: 0,
            settlemenAmount: 0,
            collectionStatus: CollectionStatus.APPROVED,
            userID: 1,
          };
          await axios.post(
            `${baseUrl}/loanapply/ramfincorp_api/add_collected_payments_ipc`,
            data,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          //update online
          await this.onlinepayment.findOneAndUpdateOnlinepayment(
            { razorpayOrderId: txnId },
            {
              status: checkStatus,
              paymentStatus: "SUCCESS",
              approved_id: 1,
            }
          );
        } catch (error) {
          console.log("error in add collection in Payu", error);
          return false;
        }
      } else {
        let ExcessAmount =
          amount > totalRepayAmount ? amount - totalRepayAmount : 0;

        let excessAmount =
          checkData.status === LeadStatus.CLOSED ? amount : ExcessAmount;

        (data as any).excess_amount = excessAmount;

        const insertedID = await db("collection").insert(data).returning("id");
        await db("leads")
          .where("leadID", leadID)
          .update({ status: checkStatus });

        if (insertedID && insertedID.length > 0) {
          await db("transactions").insert({
            customerID,
            leadID,
            loanNo: checkData.loanNo,
            status: 2,
            type: "Collection",
            mode: "PayU",
            referenceNo: txnId,
            orderId: txnId,
            deleted: 0,
            gateway: "payU",
            createdBy: 1,
            updatedBy: 1,
            amount,
            collectionID: insertedID[0],
            transactionDate: format(new Date(payU_date), "yyyy-MM-dd"),
            remarks: "Auto Collection",
            lenderID: checkData.lenderID,
          });

          await this.onlinepayment.findOneAndUpdateOnlinepayment(
            { razorpayOrderId: txnId },
            {
              status: checkStatus,
              paymentStatus: "SUCCESS",
              approved_id: 1,
            }
          );
        }
      }

      return true;
    } catch (error) {
      console.error("Error during payment validation", error);
      return false;
    }
  }
  async repaymentWebhookKamakshi(body: IRazorpayWebhook): Promise<void> {
    try {
      const json_a2 = body;

      const razorpayPaymentId = json_a2.payload.payment.entity.id;
      const razorpayAmountReceived = json_a2.payload.payment.entity.amount;
      let db = getKnexInstance();
      if (!razorpayPaymentId) {
        logger.error("Payment ID is missing");
        return;
      }

      const razorpayOrderId = json_a2.payload.payment.entity.order_id;
      const method = json_a2.payload.payment.entity.method;
      let status = json_a2.payload.payment.entity.status;
      let created_at = json_a2.created_at
        ? new Date(json_a2.created_at * 1000)
        : new Date();
      const paymentDate = moment(created_at)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD");
      const ema = await this.onlinepayment.findOneOnlinePayment(
        { razorpayOrderId: razorpayOrderId },
        ["*"],
        [{ column: "pID", order: "desc" }]
      );
      if (!ema) {
        logger.error("No record found for razorpayOrderId:", razorpayOrderId);
        return;
      }
      const creds = await this.razorPayPayments.getLenderCredentialsByLeadId(
        ema.leadID,
        LenderCredentials.RAZORPAY_EMANDATE
      );
      const auth = Buffer.from(
        `${creds.razorpay_disbursal_key_id}:${creds.razorpay_disbursal_secret_key}`
      ).toString("base64");
      const paymentResponse = await axios.get(
        `${config.razorPayBaseUrl}/payments/${razorpayPaymentId}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = paymentResponse.data;
      const fetch_oder_amount = data.amount;
      const fetch_status = data.status;
      const fetch_orderid = data.order_id;

      if (
        !fetch_oder_amount ||
        fetch_oder_amount != razorpayAmountReceived ||
        fetch_status != status ||
        fetch_orderid != razorpayOrderId
      ) {
        logger.error("Data mismatch or verification failed");
        return;
      }

      await this.onlinepayment.findOneAndUpdateOnlinepayment(
        { razorpayOrderId: razorpayOrderId },
        { toValue: razorpayAmountReceived / 100 }
      );

      if (ema.paymentStatus === "SUCCESS") {
        return;
      }
      let customer = await this.customerService.findOne(
        {
          mobile: ema?.phone,
          pancard: ema?.message,
          email: ema?.email,
          isVerified: false,
        },
        ["customerID"]
      );

      if (!customer) {
        logger.error("customer not found");
        return;
      }

      const leadsQuery = await db<ILead>("leads")
        .select("ipc", "productID")
        .where("leadID", ema.leadID)
        .andWhere((builder) => {
          builder
            .where("status", "Disbursed")
            .orWhere("status", "Part Payment")
            .orWhere("status", "Closed")
            .orWhere("status", "Settlement");
        })
        .first();
      if (!leadsQuery) {
        logger.error("No lead found for this razorpayOrderId");
        return;
      }

      if (leadsQuery.productID === ProductID.EMI) {
        try {
          const paymentDetailsData = {
            amount: data.amount,
            order_id: razorpayOrderId,
            status: status,
            id: razorpayPaymentId,
            transactionDate: paymentDate,
            paymentDate: paymentDate,
          };
          const emiData = await this.sendPaymentUpdateEMIVerification(
            paymentDetailsData
          );
          return;
        } catch (error) {
          console.error("Error occurred while processing EMI payment:", error);
          return;
        }
      }
      let loan = await this.loanService.findOne({ leadID: ema.leadID }, [
        "loanNo",
        "disbursalAmount",
        "customerID",
        "leadID",
        "disbursalDate",
      ]);

      let remainingAmount = 0;
      let baseUrl = this.commonHelper.getBaseUrl();
      if (leadsQuery && leadsQuery.ipc === 1) {
        try {
          const ipcResponse = await axios.post(
            `${baseUrl}/loanapply/ramfincorp_api/get_repayment_amount_ipc`,
            {
              leadID: ema.leadID,
              collected_on_date: format(created_at, "dd/MM/yyyy"),
            },
            { headers: { "Content-Type": "application/json" } }
          );

          if (ipcResponse?.data) {
            remainingAmount = ipcResponse.data.Total_Payable_Amount || 0;
          } else {
            return;
          }
        } catch (error) {
          console.error("Error fetching IPC repayment amount:", error);
          return;
        }
      } else
        remainingAmount = await calculateTotalRepayPaydayAmountNonIPC(
          ema.leadID
        );
      const paymentGivenAmount = Math.round(ema.toValue);
      let collectionStatus =
        paymentGivenAmount >= remainingAmount
          ? CollectionStatus.CLOSED
          : CollectionStatus.PART_PAYMENT;
      let onlinePaymentLogData = {
        paymentStatus: status,
        razorpayPaymentId,
        razorpayOrderId,
        pID: String(ema.pID),
        payload: JSON.stringify(json_a2),
        razorpay_amount: razorpayAmountReceived / 100,
      };
      await this.onlinePaymentLogModel.create(onlinePaymentLogData);
      if (status === "captured") {
        await this.onlinepayment.findOneAndUpdateOnlinepayment(
          { razorpayOrderId: razorpayOrderId },
          {
            paymentStatus: "SUCCESS",
            razorpayPaymentId: razorpayPaymentId,
            method: method,
          }
        );
        const existingCollection = await this.collectionService.findOne(
          {
            orderID: razorpayOrderId,
          },
          ["leadID"],
          [{ column: "leadID", order: "desc" }]
        );

        if (!existingCollection) {
          const settlemenAmount = 0;
          const discountAmount = 0;

          let lead = await this.leadService.findOne(
            { leadID: loan.leadID },
            ["ipc", "lenderID"],
            [{ column: "leadID", order: "desc" }]
          );

          if (lead && lead.ipc === 1) {
            try {
              const data = {
                leadID: loan.leadID,
                customerID: loan.customerID,
                collectedAmount: ema.toValue,
                collectedDate: format(created_at, "yyyy-MM-dd"),
                status: collectionStatus,
                collectedMode: CollectedMode.PAYMENT_GATEWAY,
                remarks: "Auto Collection",
                referenceNo: razorpayOrderId,
                discountAmount,
                settlemenAmount: settlemenAmount,
                collectionStatus: CollectionStatus.APPROVED,
                userID: "1",
                collected_on_date: new Date(created_at),
              };
              await axios.post(
                `${baseUrl}/loanapply/ramfincorp_api/add_collected_payments_ipc`,
                data,
                { headers: { "Content-Type": "application/json" } }
              );
            } catch (error) {
              console.error(
                "Error while calling addCollection php API:",
                error
              );
              return;
            }
          } else {
            let collectionData = {
              customerID: loan.customerID,
              leadID: loan.leadID,
              loanNo: loan.loanNo,
              collectedAmount: ema.toValue,
              collectedMode: CollectedMode.PAYMENT_GATEWAY,
              collectedDate: format(created_at, "yyyy-MM-dd"),
              referenceNo: razorpayOrderId,
              discountAmount,
              settlemenAmount: settlemenAmount,
              status: collectionStatus,
              remark: "Auto Collection",
              collectedBy: 1,
              collectionStatus: CollectionStatus.APPROVED,
              collectionStatusby: "no",
              orderID: razorpayOrderId,
              lenderID: lead.lenderID,
            };
            const insertedCollectionId = await this.collectionModel.create(
              collectionData
            );

            let leadDetail = await this.leadService.findOne(
              { leadID: loan.leadID },
              ["ipc", "alloUID"],
              [{ column: "leadID", order: "desc" }]
            );
            await this.leadService.updateOne(
              { leadID: loan.leadID },
              { status: collectionStatus as unknown as LeadStatus }
            );
            await this.onlinepayment.findOneAndUpdateOnlinepayment(
              { razorpayOrderId: razorpayOrderId },
              { status: collectionStatus, approved_id: 1 }
            );
            if (
              leadDetail &&
              leadDetail.alloUID &&
              leadDetail.alloUID !== "0"
            ) {
              await db("leads_agent_collection").insert({
                leadID: loan.leadID,
                agent_id: leadDetail.alloUID,
                collectionID: insertedCollectionId[0],
                collectedAmount: ema.toValue,
              });
            }
          }
        }
      } else if (status === "failed") {
        await this.onlinepayment.findOneAndUpdateOnlinepayment(
          { razorpayOrderId: razorpayOrderId },
          { paymentStatus: "failed", razorpayPaymentId, method }
        );
      }
    } catch (error) {
      console.log("Error in repaymentWebhook consumer:", error);
      logger.error("Error in repaymentWebhook", { error: error });
    }
  }
  private sendPaymentUpdateEMIVerification = async (
    json_an: IRazorpayEmi
  ): Promise<string> => {
    let baseUrl = this.commonHelper.getBaseUrl();

    const api = `${baseUrl}/new-api/customers/updateEMIPaymentVerification`;
    try {
      const response = await axios.post(api, json_an, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };
  public async savePaymentLog(params: IRazorpayWebhook): Promise<void> {
    const webhookDetails = params;
    if (webhookDetails?.payload?.payment?.entity?.amount === 0) {
      return;
    }
    logger.info("Webhook details given by php:", webhookDetails);
    console.log("Request recieved to create payment log with params", params);
    const paymentLog: IPaymentLogs = {
      orderId: webhookDetails.payload?.payment?.entity?.order_id,
      amount: webhookDetails.payload?.payment?.entity?.amount,
      status: webhookDetails.payload?.payment?.entity?.status,
      details: webhookDetails,
    };
    const checkLogExists = await this.paymentLogModel.findOne({
      orderId: webhookDetails.payload?.payment?.entity?.order_id,
    });
    if (checkLogExists)
      await this.paymentLogModel.updateOne(
        { orderId: paymentLog.orderId },
        paymentLog
      );
    else {
      const paymentLogDetails = new this.paymentLogModel(paymentLog);
      await paymentLogDetails.save();
    }
    console.log("Request executed successfully and returning back");
    return;
  }

  public async digitapEsignWebhook(body: any): Promise<void> {
    try {
      console.log("Digitap E-sign webhook received:", JSON.stringify(body, null, 2));

      const { code, model } = body;

      if (code !== "200" || !model) {
        console.error("Invalid webhook payload from Digitap");
        return;
      }

      const { docId, signers } = model;

      if (!docId || !signers || !Array.isArray(signers)) {
        console.error("Missing required fields in Digitap webhook");
        return;
      }

      // Check if any signer has completed signing
      const signedSigner = signers.find(signer => signer.state === "signed");

      if (signedSigner) {
        console.log(`Document ${docId} has been signed by ${signedSigner.name}`);

        // Here you can add any additional processing needed when document is signed
        // For example, updating database records, sending notifications, etc.

        // The actual processing will be handled by the digitalEsignReport endpoint
        // when the frontend calls it after receiving the redirect
      } else {
        console.log(`Document ${docId} webhook received but no signed signers found`);
      }

    } catch (error) {
      console.error("Error processing Digitap E-sign webhook:", error);
    }
  }
}
export const webhookService = new WebhookService();
