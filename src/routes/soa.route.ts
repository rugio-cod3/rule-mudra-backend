import SoaController from '@/controllers/soa.controller'
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import validatePayload from '@/middlewares/validation.middleware'
import { sanctionDataSchema, soaPdfSchema } from '@/validations/soa.validator'
import { Router } from 'express'

class SoaRoute implements Routes {
  public path = '/soa'
  public router = Router()
  public authentication = new Authentication()
  public soaController = new SoaController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    
    this.router.post(
      `${this.path}/soa-pdf`,
      this.authentication.isSisterService,
      validatePayload({ body: soaPdfSchema }),
      this.soaController.generateSoaByLeadId,
    )

    this.router.post(
      `${this.path}/section-data`,
      this.authentication.isSisterService,
      validatePayload({ body: sanctionDataSchema }),
      this.soaController.sectionData,
    )

    this.router.post(
      `${this.path}/section-pdf`,
      this.authentication.isSisterService,
      validatePayload({ body: sanctionDataSchema }),
      this.soaController.generateSectionPdf,
    )
  }
}

export default SoaRoute
