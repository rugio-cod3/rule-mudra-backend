import { IPaymentMode, TSelectPaymentMode } from '../../interfaces/paymentMode.interface'
import { KnexFindParams } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class PaymentModeModel {
  private table = 'payment_mode'

  async findOneAndUpdate(update: {}, where?: {}): Promise<number> {
    let db = getKnexInstance()
    const query = db(this.table)
    if (where) {
      query.where(where)
    }
    return query.update(update)
  }

  async find(params: KnexFindParams<IPaymentMode, TSelectPaymentMode>): Promise<IPaymentMode[]> {
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
}

export const paymentModeModel = new PaymentModeModel()
