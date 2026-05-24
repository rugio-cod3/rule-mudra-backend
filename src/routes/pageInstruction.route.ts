import PageInstructionController from '@/controllers/pageInstruction.controller'
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import validatePayload from '@/middlewares/validation.middleware'
import { addPageInstructionSchema, pageInstructionSchema } from '@/validations/pageInstruction.validator'
import { Router } from 'express'

class PageInstructionRoute implements Routes {
  public path = '/page-instruction'
  public router = Router()
  public pageInstructionController = new PageInstructionController()
  private authentication = new Authentication()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Get data by page name 
    this.router.get(
      `${this.path}`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ query: pageInstructionSchema }),
      this.pageInstructionController.getPageDataByPageName,
    )

    // Add data
    this.router.post(
      `${this.path}`,
      this.authentication.isAuthenticatedCustomerByJWT,
      validatePayload({ body: addPageInstructionSchema }),
      this.pageInstructionController.addPageInstruction,
    )

  }
}

export default PageInstructionRoute
