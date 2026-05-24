import config from "@/config/default";
import CollectionModel from "@/database/mysql/collection";
import { BadRequestError } from "@/errors";
import {
  ICollection,
  IRazorpayPaydayRepayment,
  TSelectCollection,
} from "@/interfaces/collection.interface";
import { IRazorpayRepayment } from "@/interfaces/common.interface";
import { ICustomResponse } from "@/interfaces/response.interface";
import { IServiceResponse } from "@/interfaces/service.interface";
import OnlinePaymentModel from "@/mysql/onlinepayment";
import {
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from "@/types/model.types";
import { logger } from "@/utils/logger";
import Razorpay from "razorpay";
import { customerService } from "./customer.service";
import { leadService } from "./lead.service";
import LoanService from "./loan.service";
import ResponseService from "./response.service";

class CollectionService extends ResponseService {
  private collectionModel = new CollectionModel();
  private readonly leadService = leadService;
  private readonly customerService = customerService;
  private loanService = new LoanService();
  private onlinePaymentModel = new OnlinePaymentModel();

  async findOne(
    where: WhereQuery<ICollection>,
    select: SelectFields<TSelectCollection> = ["*"],
    order?: SortCriteria<TSelectCollection>,
  ): Promise<ICollection> {
    return await this.collectionModel.findOneCollection(where, select, order);
  }

  async find(
    params: KnexFindParams<ICollection, TSelectCollection>,
  ): Promise<ICollection[]> {
    return await this.collectionModel.find(params);
  }

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let collection_count = await this.collectionModel.countCollection(where);
      if (collection_count == null) {
        return 0;
      } else {
        return collection_count; // Return the first lead if found
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

  public async create(
    customerID: number,
    leadID: number,
    loanNo: string,
    collectedAmount: number,
    collectedMode: string,
    collectedDate: Date, // assuming updatestamp is converted to the correct format already
    referenceNo: string,
    discountAmount: number,
    settlemenAmount: number,
    status: string,
    remark: string,
    collectedBy: number,
    collectionStatus: string,
    collectionStatusby: string,
    orderID: string,
  ): Promise<number> {
    let insertId = await this.collectionModel.insert(
      customerID,
      leadID,
      loanNo,
      collectedAmount,
      collectedMode,
      collectedDate, // assuming updatestamp is converted to the correct format already
      referenceNo,
      discountAmount,
      settlemenAmount,
      status,
      remark,
      collectedBy,
      collectionStatus,
      collectionStatusby,
      orderID,
    );
    return insertId;
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.collectionModel.findOneAndUpdate(where, update);
      return true;
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: "Internal Server Error",
        statusCode: 500,
      } as ICustomResponse;
    }
  }

  async razorpayPaydayRepayment(
    payload: IRazorpayPaydayRepayment,
  ): Promise<IServiceResponse> {
    const { leadId, razorpayOrderId, toValue } = payload;

    let lead = await this.leadService.findOne(
      { leadID: leadId },
      ["customerID"],
      [{ column: "leadID", order: "desc" }],
    );
    let customer = await this.customerService.findOne(
      { customerID: lead.customerID },
      ["customerID", "name", "mobile", "email", "pancard"],
    );

    let loan = await this.loanService.findOne({ leadID: leadId }, ["loanNo"]);
    if (!loan) throw new BadRequestError("loan not found ");

    const saveObject = {
      name: customer.name,
      email: customer.email,
      phone: customer.mobile,
      service: "Rulemudra",
      typeProduct: "payday",
      toValue,
      message: customer.pancard,
      razorpayOrderId,
      razorpayPaymentId: "",
      paymentStatus: "PENDING",
      leadID: leadId,
      device: "app",
    };
    await this.onlinePaymentModel.create(saveObject);

    return this.serviceResponse(200, {}, "Success");
  }

  async createOrderRepayment(
    payload: IRazorpayRepayment,
  ): Promise<IServiceResponse> {
    const { leadId, amount } = payload;
    let lead = await this.leadService.findOne(
      { leadID: leadId },
      ["customerID", "productID"],
      [{ column: "leadID", order: "desc" }],
    );
    if (!lead) {
      throw new BadRequestError("lead not exists");
    }
    let customer = await this.customerService.findOne(
      { customerID: lead.customerID },
      ["customerID", "name", "mobile", "email", "pancard"],
    );
    if (!customer) {
      throw new BadRequestError("customer not exists");
    }
    const instance = new Razorpay({
      key_id: config.razorpayDisbursalKeyId,
      key_secret: config.razorpayDisbursalKeySecret,
    });
    console.log(
      "hhhhhhhhhhhhhhhhhh============>>>>>>>>>>>>>>>>>",
      +(amount * 100),
    );
    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "",
      notes: {
        key1: "",
        key2: "",
      },
    });
    const saveObject = {
      name: customer.name,
      email: customer.email,
      phone: customer.mobile,
      service: "Nexiloans",
      typeProduct: lead.productID === 1 ? "EMI" : "PAYDAY",
      toValue: amount,
      message: customer.pancard,
      razorpayOrderId: order.id,
      razorpayPaymentId: "",
      paymentStatus: "PENDING",
      leadID: leadId,
      device: "web",
    };
    await this.onlinePaymentModel.create(saveObject);
    const data = {
      orderId: order.id,
      name: customer?.name,
      mobile: customer?.mobile,
      email: customer?.email,
      amount: amount * 100,
      logo: config.nexiloans_logo,
    };
    return this.serviceResponse(200, data, "Success");
  }
}

export default CollectionService;
