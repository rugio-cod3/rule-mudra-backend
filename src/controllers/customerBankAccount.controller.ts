import { StepName } from "@/enums/common.enum";
import CommonHelper from "@/helpers/common";
import {
  IConfirmBankAccountPayload,
  IGetCustomerBankAccountsPayload,
  ISaveBankAccountPayload,
} from "@/interfaces/customerBankAccount.interface";
import { createStepTrackerEntry } from "@/middlewares/stepCheck2.middleware";
import { CustomerBankAccountService } from "@/services/customerBankAccount.service";
import ResponseService from "@/services/response.service";
import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { singleton } from "tsyringe";
import RazorpayMandateModel from "../database/mysql/razorpay_mandate";

@singleton()
export class CustomerBankAccountController extends ResponseService {
  constructor(
    private readonly customerBankAccountService: CustomerBankAccountService,
    private readonly commonHelper: CommonHelper,
    private readonly razorpayMandateModel: RazorpayMandateModel
  ) {
    super();
  }

  getBankAccountsList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loan_id: leadID } = req.validatedQuery;

      const payload: IGetCustomerBankAccountsPayload = {
        customerID: req.customer.customerID,
        emandateRequired: req.customer.emandate_required,
        leadID,
      };

      const { data, message, statusCode } =
        await this.customerBankAccountService.getBankAccountsList(payload);

      return this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  confirmBankAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loan_id, mandate_id, account_id } = req.validatedBody;

      const payload: IConfirmBankAccountPayload = {
        customerID: req.customer.customerID,
        loan_id,
        mandate_id,
        emandateRequired: req.customer.emandate_required,
        account_id,
      };

      const { data, message, statusCode } =
        await this.customerBankAccountService.confirmBankAccount(payload);

      return this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };

  savebankDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        account_holders_name,
        account_no,
        ifsc,
        bank_name,
        loan_id,
        confirmed_account_no,
      } = req.validatedBody as ISaveBankAccountPayload;

      const payload: ISaveBankAccountPayload = {
        account_holders_name,
        account_no,
        ifsc,
        bank_name,
        loan_id,
        confirmed_account_no,
      };

      const clientIp = this.commonHelper.getClientIp(req);
      const { data, message, statusCode } =
        await this.customerBankAccountService.saveBankAccount(
          payload,
          req.customer.customerID,
          req.customer.mobile,
          req.customer.pancard,
          req.customer.aadharNo,
          clientIp
        );

      const getEmandateStatusResponse = await this.razorpayMandateModel.findOne(
        {
          where: {
            customerID: req.customer.customerID,
            accountNo: account_no,
            // leadID: loan_id.toString(),
          },
          whereIn: [{ column: "status", value: ["paid", "issued"] }],
          select: ["res_response"],
          order: [{ column: "id", order: "desc" }],
        }
      );

      let isEmandateRequired = false;
      // if (getEmandateStatusResponse?.res_response) {
      //   const rMandate = JSON.parse(getEmandateStatusResponse.res_response);
      //   const rMandateStatus = rMandate?.status;
      //   const rMandateExpire = rMandate?.token?.expire_at;

      //   const expireMoment = rMandateExpire
      //     ? moment.unix(rMandateExpire)
      //     : null;
      //   const threshold = moment().add(90, "days");
      //   if (expireMoment && expireMoment.isSameOrAfter(threshold)) {
      //     isEmandateRequired = true;
      //   }
      // }
      if (!getEmandateStatusResponse?.res_response) {
        isEmandateRequired = true;
      } else {
        const rMandate = JSON.parse(getEmandateStatusResponse.res_response);
        const rMandateExpire = rMandate?.token?.expire_at;

        const expireMoment = rMandateExpire
          ? moment.unix(rMandateExpire)
          : null;

        const threshold = moment().subtract(90, "days");

        if (!expireMoment || expireMoment.isSameOrBefore(threshold)) {
          isEmandateRequired = true;
        }
      }
      if (!isEmandateRequired) {
        await createStepTrackerEntry(
          req.customer.customerID,
          loan_id,
          0,
          StepName.EMANDATE,
          "Repeat"
        );
        await createStepTrackerEntry(
          req.customer.customerID,
          loan_id,
          0,
          StepName.PENNY_DROP,
          "Repeat"
        );
      }
      const responseData = {
        ...data,
        isEmandateRequired,
      };

      return this.sendResponse(res, statusCode, responseData, message);
    } catch (error) {
      next(error);
    }
  };
}
