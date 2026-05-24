import {
  ILeadsApiLog,
  TSelectLeadsApiLog,
} from '@/interfaces/lead_api_log.interface'
import {
  IRazorPayPayoutAccountsModel,
  TSelectRazorPayPayoutAccountsModel,
} from '@/interfaces/razorpay_payout_accounts.interface'
import {
  DeleteWhere,
  InsertData,
  KnexFindParams,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export default class RazorpayPayoutAccountsModel {
  private table = 'razorpay_payout_accounts'

  async findOne(
    params: KnexFindParams<
      IRazorPayPayoutAccountsModel,
      TSelectRazorPayPayoutAccountsModel
    >,
  ): Promise<IRazorPayPayoutAccountsModel> {
    const { order, select = ['*'], where, whereIn, whereNot } = params
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

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (order) query.orderBy(order)

    return await query.first()
  }

  async insert(
    data: InsertData<IRazorPayPayoutAccountsModel>,
  ): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert({
      ...data,
      createdDate: new Date(Date.now()),
    })
  }
  async findOneAndUpdate(
    where: WhereQuery<ILeadsApiLog>,
    update: UpdateQuery<ILeadsApiLog>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async delete(deleteWhere: DeleteWhere<TSelectLeadsApiLog>) {
    const db = getKnexInstance()
    const query = db(this.table)

    deleteWhere.forEach((element) => {
      const { column, operator, value } = element

      if (operator) query.where(column, operator, value)
      else query.where(column, value)
    })

    return await query.delete()
  }
}

export const razorpayPayoutAccountsModel = new RazorpayPayoutAccountsModel()
