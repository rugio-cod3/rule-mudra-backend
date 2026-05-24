import { DashboardLeadStatus } from '@/enums/lead.enum'
import { Products } from '@/enums/product.enum'
import { NextFunction, Request, Response } from 'express'
import { IServiceResponse } from './service.interface'
import { IStepControlModel } from './step-control.interface'

export interface IStepController {
  getUserNextStep(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>
}

export interface IStepService {
  getUserNextStep(customerID: number, leadID: number): Promise<IServiceResponse>
  getUserStep(
    customerID: number,
    customerType: DashboardLeadStatus,
    product: Products,
    leadID?: number,
  ): Promise<IStepControlModel>
}

export interface ICheckRepeatCustomerPreviousStepsResponse {
  step: IStepControlModel
  required: boolean
}
