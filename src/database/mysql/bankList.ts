import { config } from '@/config.server'
import {
  IBankListModel,
  TSelectBankList,
} from '@/interfaces/bankList.interface'
import { KnexFindParams } from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export default class BankListModel {
  private table = 'bankList'

  async findOne(
    params: KnexFindParams<IBankListModel, TSelectBankList>,
  ): Promise<IBankListModel> {
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

  async find(
    params: KnexFindParams<IBankListModel, TSelectBankList>,
  ): Promise<IBankListModel[]> {
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

    return await query
  }

  async getBankLogoAndIcon(
    bankName: string,
  ): Promise<{ bankLogo: string; bankIcon: string }> {
    const bank = await this.findOne({
      where: { bankName: bankName.toLowerCase() },
      select: ['pngLogo', 'pngIcon'],
    })

    if (bank && bank?.pngIcon) {
      return { bankLogo: bank.pngLogo, bankIcon: bank.pngIcon }
    }

    return {
      bankLogo: config.defaultBankLogo,
      bankIcon: config.defaultBankLogo,
    }
  }
}
