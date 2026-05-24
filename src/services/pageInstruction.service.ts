import { NotFoundError } from '@/errors'
import { IPageInstructions, TSelectPageInstructions } from '@/interfaces/pageInstructions.interface'
import { IServiceResponse } from '@/interfaces/service.interface'
import ResponseService from './response.service'
import PageInstructionModel from '@/database/mysql/pageInstructions'
import {
  DeleteWhere,
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'

export class PageInstructionService extends ResponseService {
  private pageInstructionModel = new PageInstructionModel()

  getPageDataByPageName = async (
    where: WhereQuery<IPageInstructions>,
    select: SelectFields<TSelectPageInstructions> = ['*'],
    orderBy?: SortCriteria<TSelectPageInstructions>,
  ): Promise<IServiceResponse> => {
    let pageInstruction = await this.pageInstructionModel.findOnePageInstruction(where, select, orderBy)
    if (!pageInstruction)
      throw new NotFoundError("Data not Found.")

    return this.serviceResponse(200, pageInstruction, 'Data retrieved successfully')
  }

  addPageInstruction = async (data: InsertData<IPageInstructions>): Promise<IServiceResponse> => {
    let pageInstruction = await this.pageInstructionModel.insert(data)
    if (!pageInstruction)
      throw new NotFoundError("Data not Found.")

    return this.serviceResponse(200, pageInstruction, 'New Page Instruction inserted successfully')
  }
}

export const pageinstructionservice = new PageInstructionService()
