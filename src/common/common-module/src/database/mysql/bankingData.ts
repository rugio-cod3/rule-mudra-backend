import {
  IBankingDataModel,
  TSelectBankingData,
} from '../../interfaces/bankingData.interface'

import { InsertData, KnexFindParams } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

class BankingDataModel {
  private table = 'bankingData'

  async insert(data: InsertData<IBankingDataModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneBankingData(
    params: KnexFindParams<IBankingDataModel, TSelectBankingData>,
  ): Promise<IBankingDataModel> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      whereRaw,
    } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach((element) => {
          const { column, operator, value } = element

          if (operator) query.where(column, operator, value)
          else query.where(column, value)
        })
      } else {
        query.where(where)
      }
    }

    query.select(...select)

    if (whereIn) {
      whereIn.forEach((condition) => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereRaw) {
      whereRaw.forEach((condition) => {
        const { rawQuery, values } = condition
        query.whereRaw(rawQuery, values)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query.first()
  }

  async count(
    params: KnexFindParams<IBankingDataModel, TSelectBankingData>,
  ): Promise<number> {
    const { where, whereNot } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const bankingDatamodel = new BankingDataModel()
