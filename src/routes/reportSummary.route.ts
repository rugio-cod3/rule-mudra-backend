import { Router } from "express";
import { Routes } from "@/interfaces/routes.interface";
import { ReportController } from "@/controllers/reportSummary.controller";
import Authentication from '@/middlewares/auth.middleware'


class ReportSummaryRoute implements Routes {
  public path = "/";
  public router = Router();
  public authentication = new Authentication()


  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}report-summary`,
      this.authentication.isAuthenticatedCustomer,
      ReportController.reportSummary
    );
    this.router.get(
      `${this.path}score-history`,
      this.authentication.isAuthenticatedCustomer,
      ReportController.scoreHistory
    );
  }
}

export default ReportSummaryRoute;
