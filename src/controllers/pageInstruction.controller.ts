import { IAddPageInstructionPayload, IPageInstructionPayload, IPageInstructions } from '@/interfaces/pageInstructions.interface'
import { pageinstructionservice } from '@/services/pageInstruction.service'
import ResponseService from '@/services/response.service'
import { InsertData } from '@/types/model.types'
import { NextFunction, Request, Response } from 'express'

class PageInstructionController extends ResponseService {
  private readonly pageinstructionservice = pageinstructionservice

  getPageDataByPageName = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { page_name } = req.query as unknown as IPageInstructionPayload
      const payload: IPageInstructionPayload = { page_name }
      const { data, message, statusCode } = await this.pageinstructionservice.getPageDataByPageName(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  addPageInstruction = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { page_name, instruction } = req.body as unknown as IAddPageInstructionPayload
      const payload: InsertData<IPageInstructions> = { page_name, instruction }
      const { data, message, statusCode } = await this.pageinstructionservice.addPageInstruction(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
}

export default PageInstructionController
