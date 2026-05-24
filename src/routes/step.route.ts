import { stepController } from '@/controllers/step.controller'
import { stepChecker } from '@/controllers/stepChecker.controller';
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import validatePayload from '@/middlewares/validation.middleware'
import { nextStepSchema } from '@/validations/step.validator'
import { stepCheckerSchema } from '@/validations/stepChecker.validator';
import { Router } from 'express'

class StepRoute implements Routes {
  public path = '/step'
  public router = Router()
  public authentication = new Authentication()
  private readonly stepController = stepController

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/next-step`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: nextStepSchema }),
      this.stepController.getUserNextStep,
    )
    this.router.get(
      `${this.path}/step-checker`,
      this.authentication.isAuthenticatedCustomerByJWT,
      // validatePayload({ body: stepCheckerSchema }),
      stepChecker,
    );
  }
}

export default StepRoute
