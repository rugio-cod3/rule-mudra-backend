import CommonHelper from "@/helpers/common";
import { IStepController } from "@/interfaces/step.interface";
import ResponseService from "@/services/response.service";
import { stepService } from "@/services/step.service";
import { NextFunction, Request, Response } from "express";

class StepController extends ResponseService implements IStepController {
  private readonly stepService = stepService;
  private readonly commonHelper = new CommonHelper();
  constructor() {
    super();
  }

  getUserNextStep = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { leadID, plateform = "rulemudra" } = req.body;
      const { accountID } = req.validatedBody;
      const { customerID, name } = req.customer;

      const userIp = this.commonHelper.getClientIp(req);
      const { data, message, statusCode } =
        await this.stepService.getUserNextStep(
          customerID,
          leadID,
          userIp,
          accountID,
          name,
          plateform,
        );

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      next(error);
    }
  };
}

export const stepController = new StepController();
