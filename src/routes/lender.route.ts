import {lenderController} from '@/controllers/lender.controller'
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import validatePayload from '@/middlewares/validation.middleware'
import { addCredentialsSchema, updateCredentialsSchema , getCredentialsSchema} from '@/validations/lender.validator'
import { Router } from 'express'



class LenderRoute implements Routes {
  public path = '/lender'
  public router = Router()
  public authentication = new Authentication()
  public lenderController = lenderController

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {

    this.router.post(
      `${this.path}/add-lender-creds`,

      validatePayload({ body: addCredentialsSchema }),
      this.lenderController.AddCredentials
    )

    this.router.post(
      `${this.path}/update-lender-creds`,
      validatePayload({ body: updateCredentialsSchema }),
      this.lenderController.UpdateCredentials
    )

    this.router.get(
      `${this.path}/get-lender-creds`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: getCredentialsSchema }),
      this.lenderController.getCredentials
    )

  }
}

export default LenderRoute