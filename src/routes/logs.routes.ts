import LogsController from '@/controllers/logs.controller'
import { Routes } from '@/interfaces/routes.interface'
import Authentication from '@/middlewares/auth.middleware'
import validatePayload from '@/middlewares/validation.middleware'
import { updateSmsLogsSchema } from '@/validations/logs.validator'
import { Router } from 'express'

class LogsRoute implements Routes {
  public path = '/logs'
  public router = Router()
  private authentication = new Authentication()
  public logsController = new LogsController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    //TO UPDATE KALEYRA MSG LOGS
    this.router.post(
      `${this.path}/updateSMSLogs`,
      this.authentication.isSisterService,
      validatePayload({ body: updateSmsLogsSchema }),
      this.logsController.updateSMSLogs,
    )
  }
}

export default LogsRoute
