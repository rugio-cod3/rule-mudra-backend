import {
  IPaymentModeForBanks,
  TSelectPaymentModeForBanks,
} from '../../interfaces/paymentModeForBanks.interface'
import { DeleteWhere, InsertData, KnexFindParams } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class PaymentModeForBanksModel {
  private table = 'payment_mode_for_banks'

  async findOneAndUpdate(update: {}, where?: {}): Promise<number> {
    let db = getKnexInstance()
    const query = db(this.table)
    if (where) {
      query.where(where)
    }
    return query.update(update)
  }

  async find(
    params: KnexFindParams<IPaymentModeForBanks, TSelectPaymentModeForBanks>,
  ): Promise<IPaymentModeForBanks[]> {
    const { select, paginate, where } = params
    let db = getKnexInstance()

    let query = db(this.table)
    if (where) {
      query.where(where)
    }
    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }
    if (select) {
      query.select(...select)
    }
    return await query
  }

  async insert(data: InsertData<IPaymentModeForBanks>): Promise<number[]> {
    let db = getKnexInstance()

    return await db(this.table).insert(data)
  }
  async delete(deleteWhere: DeleteWhere<TSelectPaymentModeForBanks>) {
    const db = getKnexInstance()
    const query = db(this.table)

    deleteWhere.forEach(element => {
      const { column, operator, value } = element

      if (operator) query.where(column, operator, value)
      else query.where(column, value)
    })

    return await query.delete()
  }
}

export const paymentModeForBanksModel = new PaymentModeForBanksModel()
