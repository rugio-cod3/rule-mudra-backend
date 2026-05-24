import { WaiverUtil } from "@/common/common-module/src/utils/waiver.utils";
import config from "@/config/default";
import CollectionModel from "@/database/mysql/collection";
import { CollectedMode, CollectionStatus } from "@/enums/collection.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { ProductID } from "@/enums/product.enum";
import CommonHelper from "@/helpers/common";
import {
  IRazorpayEmi,
  IRazorpayKafkaConsumer,
} from "@/interfaces/collection.interface";
import { ILead } from "@/interfaces/lead.interface";
import OnlinePaymentModel from "@/mysql/onlinepayment";
import OnlinePaymentLogModel from "@/mysql/onlinepaymentlog";
import { calculateTotalRepayPaydayAmountNonIPC } from "@/utils/Ipc_Calculation";
import { logger } from "@/utils/logger";
import { getKnexInstance } from "@/utils/mysql";
import RazorpayPG from "@/utils/razorpayClient.utils";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import ApprovalService from "./approval.service";
import CollectionService from "./collection.service";
import CustomerService from "./customer.service";
import LeadService from "./lead.service";
import LoanService from "./loan.service";
import ResponseService from "./response.service";

class ConsumerService extends ResponseService {
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
  private readonly waiverUtil = new WaiverUtil();

  get Knex() {
    let db = getKnexInstance();
    return db;
  }

  async repaymentWebhook(body: IRazorpayKafkaConsumer): Promise<void> {
    try {
      const json_a2 = body;
      if (!["captured", "failed"].includes(body.status)) {
        logger.info("Skipping non-captured/failed event", {
          eventId: json_a2.id,
          status: json_a2.status,
        });
        return;
      }
      const razorpayPaymentId = "pay_" + json_a2.id;
      const razorpayAmountReceived = json_a2.amount; // Amount in paise, convert to rupees by dividing by 100
      if (razorpayAmountReceived === 0) {
        logger.info(
          "Received amount is zero, skipping processing of emandate",
          razorpayAmountReceived,
        );
        return;
      }
      let db = getKnexInstance();
      if (!razorpayPaymentId) {
        logger.error("Payment ID is missing");
        return;
      }

      const razorpayOrderId = "order_" + json_a2.order_id;
      const waiverReference = "waiver_" + json_a2.order_id;
      const method = json_a2.method;
      let status = json_a2.status;
      let created_at = json_a2.created_at
        ? new Date(json_a2.created_at * 1000)
        : new Date();
      const paymentDate = moment(created_at)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD");

      const paymentResponse = await axios.get(
        `${config.razorPayBaseUrl}/payments/${razorpayPaymentId}`,
        {
          headers: {
            Authorization: `Basic ${this.razorpayPg.auth}`,
            "Content-Type": "application/json",
          },
        },
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
        { toValue: razorpayAmountReceived / 100 },
      );
      const ema = await this.onlinepayment.findOneOnlinePayment(
        { razorpayOrderId: razorpayOrderId },
        ["*"],
        [{ column: "pID", order: "desc" }],
      );
      if (!ema) {
        logger.error("No record found for razorpayOrderId:", razorpayOrderId);
        return;
      }
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
        ["customerID"],
      );

      if (!customer) {
        logger.error("customer not found");
        return;
      }

      const leadsQuery = await db<ILead>("leads")
        .select("ipc", "productID", "customerID", "leadID")
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
            paymentDetailsData,
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

      let remainingAmount = await calculateTotalRepayPaydayAmountNonIPC(
        ema.leadID,
      );
      const paymentGivenAmount = Math.round(ema.toValue);
      let baseUrl = this.commonHelper.getBaseUrl();

      if (leadsQuery && leadsQuery.ipc === 1) {
        try {
          const ipcResponse = await axios.post(
            // `${baseUrl}/loanapply/ramfincorp_api/get_repayment_amount_ipc`,
            ``,
            {
              leadID: ema.leadID,
              collected_on_date: format(created_at, "yyyy/MM/dd"),
            },
            { headers: { "Content-Type": "application/json" } },
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
      try {
        console.log(
          "Checking and applying waiver via webhook for amount: ",
          remainingAmount,
        );
        const waivedOffAmount = await this.waiverUtil.checkAndApplyWaiver(
          leadsQuery,
          remainingAmount,
          paymentGivenAmount,
          waiverReference,
        );
        if (waivedOffAmount > 0) remainingAmount -= waivedOffAmount;
        console.log("Waiver applied successfully via webhook");
      } catch (err) {
        console.log("Error in checkAndApplyWaiver:" + JSON.stringify(err));
      }
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
          },
        );
        const existingCollection = await this.collectionService.findOne(
          {
            orderID: razorpayOrderId,
          },
          ["leadID"],
          [{ column: "leadID", order: "desc" }],
        );

        if (!existingCollection) {
          const settlemenAmount = 0;
          const discountAmount = 0;

          let lead = await this.leadService.findOne(
            { leadID: loan.leadID },
            ["ipc"],
            [{ column: "leadID", order: "desc" }],
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
                // `${baseUrl}/loanapply/ramfincorp_api/add_collected_payments_ipc`,
                ``,
                data,
                { headers: { "Content-Type": "application/json" } },
              );
            } catch (error) {
              console.error(
                "Error while calling addCollection php API:",
                error,
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
            };
            const insertedCollectionId = await this.collectionModel.create(
              collectionData,
            );

            let leadDetail = await this.leadService.findOne(
              { leadID: loan.leadID },
              ["ipc", "alloUID"],
              [{ column: "leadID", order: "desc" }],
            );
            await this.leadService.updateOne(
              { leadID: loan.leadID },
              { status: collectionStatus as unknown as LeadStatus },
            );
            await this.onlinepayment.findOneAndUpdateOnlinepayment(
              { razorpayOrderId: razorpayOrderId },
              { status: collectionStatus, approved_id: 1 },
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
          { paymentStatus: "failed", razorpayPaymentId, method },
        );
      }
    } catch (error) {
      logger.error("Error in repaymentWebhook", { error: error.message });
    }
  }
  private sendPaymentUpdateEMIVerification = async (
    json_an: IRazorpayEmi,
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
}
export const consumerService = new ConsumerService();
