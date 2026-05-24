import CollectionCrmController from '@/controllers/collectionCrm.controller'
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import validatePayload from '@/middlewares/validation.middleware'
import { addCollectionSchema, allCollectionSchema } from '@/validations/collectionCrm.validator'
import { Router } from 'express'

class CollectionCrmRoute implements Routes {
  public path = '/collection-crm'
  public router = Router()
  public collectionCrmController = new CollectionCrmController()
  private authentication = new Authentication()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Add data
    this.router.post(
      `${this.path}/add`,
      this.authentication.isSisterService,
      validatePayload({ body: addCollectionSchema }),
      this.collectionCrmController.addCollectionCrm,
    )

    // get all data
    this.router.get(
      `${this.path}/all`,
      this.authentication.isSisterService,
      validatePayload({ query: allCollectionSchema }),
      this.collectionCrmController.getTransactions,
    )

  }
}

export default CollectionCrmRoute
