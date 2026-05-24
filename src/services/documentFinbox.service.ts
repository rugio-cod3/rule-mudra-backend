import { documentFinboxmodel } from '@/database/mysql/documentFinbox'
import {
  IDocumentFinboxInterfaceModel,
  TSelectDocumentFinbox,
} from '@/interfaces/documentFinbox.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'

class DocumentFinboxService {
  private readonly documentFinboxModel = documentFinboxmodel

  async findOne(
    where: WhereQuery<IDocumentFinboxInterfaceModel>,
    select: SelectFields<TSelectDocumentFinbox> = ['*'],
    orderBy?: SortCriteria<TSelectDocumentFinbox>,
  ): Promise<IDocumentFinboxInterfaceModel> {
    return await this.documentFinboxModel.findOneDocumentFinbox(
      where,
      select,
      orderBy,
    )
  }

  async create(
    data: InsertData<IDocumentFinboxInterfaceModel>,
  ): Promise<number[]> {
    return await this.documentFinboxModel.insert(data)
  }
  
  async checkFinbox(leadId:number): Promise<boolean> {
    const result = await this.findOne(
      {
        leadID:leadId,
      },
      ['status'],
      [{
        column: 'documentID',
        order: 'desc',
      }],
    )
    return result !== null
  }
}

export const documentFinboxservice = new DocumentFinboxService()
