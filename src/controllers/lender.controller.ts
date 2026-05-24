import { NextFunction, Request, Response } from 'express'
import ResponseService from '@/services/response.service'
import { lenderService } from '@/services/lender.service'




export class LenderController extends ResponseService  {

    private readonly lenderService=lenderService

    public AddCredentials = async (
     req: Request,
     res: Response,
     next: NextFunction,
   ) => {
     try {
       const payload = req.validatedBody


       const { data, message, statusCode } =
         await this.lenderService.AddCredentials(payload)

       return this.sendResponse(res, statusCode, data, message)
     } catch (error) {
       next(error)
     }
   }

   public UpdateCredentials = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = req.validatedBody


      const { data, message, statusCode } =
        await this.lenderService.updateCredentials(payload)

      return this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  public getCredentials = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = req.validatedQuery

      const { data, message, statusCode } =
        await this.lenderService.getCredentials(payload)

      return this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
  
}

export const lenderController= new LenderController()