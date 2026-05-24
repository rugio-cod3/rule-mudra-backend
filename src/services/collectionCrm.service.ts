import { NotFoundError } from '@/errors'
import { ITransactionModel, TSelectTransaction } from '@/interfaces/collectionCrm.interface'
import { IServiceResponse } from '@/interfaces/service.interface'
import ResponseService from './response.service'
import TransactionModel from '@/database/mysql/transactionModel'
import {
  DeleteWhere,
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'

export class CollectionCrmService extends ResponseService {
  private transactionModel = new TransactionModel()

    getTransactions = async (
      where: WhereQuery<ITransactionModel>,
      select: SelectFields<TSelectTransaction> = ['*'],
      orderBy?: { orderKey: string; orderValue: string },

    ): Promise<IServiceResponse> => {
      let transections = await this.transactionModel.findAll(where, select, orderBy)
      if (!transections)
        throw new NotFoundError("Data not Found.")
  
      return this.serviceResponse(200, transections, 'Data retrieved successfully')
    }

    getTransactionsData = async (
      where: WhereQuery<ITransactionModel>,
      select: SelectFields<TSelectTransaction> = ['*'],
      orderBy?: { orderKey: string; orderValue: string },

    ): Promise<IServiceResponse> => {
      let transections = await this.transactionModel.findAll(where, select, orderBy)
      if (!transections)
        throw new NotFoundError("Data not Found.")
  
      return this.serviceResponse(200, transections, 'Data retrieved successfully')
    }
}

export const collectionCrmService = new CollectionCrmService()
