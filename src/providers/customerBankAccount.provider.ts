import { CustomerBankAccountController } from "@/controllers/customerBankAccount.controller";
import { container } from "tsyringe";

export default container.resolve(CustomerBankAccountController)