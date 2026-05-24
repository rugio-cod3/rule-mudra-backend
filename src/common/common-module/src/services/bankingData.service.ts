import { bankingDatamodel } from '../database/mysql/bankingData'
import {
  IBankingDataModel,
  TSelectBankingData,
} from '../interfaces/bankingData.interface'

import { InsertData, KnexFindParams } from '../types/model.types'

class BankingDataService {
  private readonly bankingDataModel = bankingDatamodel

  async findOne(
    params: KnexFindParams<IBankingDataModel, TSelectBankingData>,
  ): Promise<IBankingDataModel> {
    return await this.bankingDataModel.findOneBankingData(params)
  }

  //   async updateOne(
  //     where: WhereQuery<ILead>,
  //     update: UpdateQuery<ILead>,
  //   ): Promise<number> {
  //     return await this.leadModel.findOneAndUpdate(where, update)
  //   }

  async create(data: InsertData<IBankingDataModel>): Promise<number[]> {
    return await this.bankingDataModel.insert(data)
  }
}

export const bankingDataservice = new BankingDataService()
