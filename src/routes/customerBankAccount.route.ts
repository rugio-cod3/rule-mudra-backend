import { Routes } from "@/interfaces/routes.interface";
import Authentication from "@/middlewares/auth.middleware";
import validatePayload from "@/middlewares/validation.middleware";
import { customerBankAccountController } from "@/providers";
import {
  confirmBankAccountSchema,
  getBankAccoutListSchema,
  saveBankDetailsSchema,
} from "@/validations/customerBankAccount.validator";
import { Router } from "express";

class CustomerBankAccountRoute implements Routes {
  public path = "/customer-bank-account";
  public userPath = "/user";
  public loanPath = "/loan";
  public router = Router();
  public authentication = new Authentication();
  public customerBankAccountController = customerBankAccountController;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // emandate bank list to show bank lists
    this.router.get(
      `${this.loanPath}/bank-detail`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: getBankAccoutListSchema }),
      this.customerBankAccountController.getBankAccountsList
    );

    // Bank account confirmation
    this.router.post(
      `${this.loanPath}/bank-detail-confirm`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck(StepName.BANK_ACCOUNT_CONFIRMATION, Products.PAYDAY),
      // stepCheck2(StepName.BANK_ACCOUNT_CONFIRMATION, Products.PAYDAY),
      validatePayload({ body: confirmBankAccountSchema }),
      this.customerBankAccountController.confirmBankAccount
    );

    // Save Bank Details
    this.router.post(
      `${this.userPath}/add-bank-detail`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // stepCheck2(StepName.BANK_DETAILS, Products.PAYDAY),
      // enableTracking(),
      // stepTrackerAfterResponse,
      validatePayload({ body: saveBankDetailsSchema }),
      this.customerBankAccountController.savebankDetails
    );
  }
}

export default CustomerBankAccountRoute;
