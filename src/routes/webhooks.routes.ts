import { webhookController } from "@/controllers/webhooks.controller";
import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";

class RazorPayRoute implements Routes {
  public path = "/webhook";
  public router = Router();
  private readonly webhookController = webhookController;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/emandate/auth-link`,
      // stepCheck2(StepName.EMANDATE, Products.PAYDAY),
      // enableTracking(),
      // stepTrackerAfterResponse,
      this.webhookController.emandateAuthLinkWebhook
    );
    this.router.post(
      `${this.path}/repayment/webhook`,
      this.webhookController.repaymentWebhook
    );

    this.router.post(
      `${this.path}/save`,
      this.webhookController.savePaymentLog
    );

    this.router.post(
      `${this.path}/digitap/esign`,
      this.webhookController.digitapEsignWebhook
    );
  }
}
export default RazorPayRoute;
