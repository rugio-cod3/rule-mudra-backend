import { PennyStatus } from '@/enums/penny_drop.enum'
import {
  IPennyDropModel,
  TSelectPennyDropModel,
} from '@/interfaces/penny_drop.interface'
import {
  DeleteWhere,
  InsertData,
  KnexFindParams,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'

export default class PennyDropModel {
  private table = 'penny_drop'

  async findOne(
    params: KnexFindParams<IPennyDropModel, TSelectPennyDropModel>,
  ): Promise<IPennyDropModel> {
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

  public async insert(data: InsertData<IPennyDropModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOneAndUpdate(
    where: WhereQuery<IPennyDropModel>,
    update: UpdateQuery<IPennyDropModel>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async delete(deleteWhere: DeleteWhere<TSelectPennyDropModel>) {
    const db = getKnexInstance()
    const query = db(this.table)

    deleteWhere.forEach((element) => {
      const { column, operator, value } = element

      if (operator) query.where(column, operator, value)
      else query.where(column, value)
    })

    return await query.delete()
  }

  checkUserPennyDrop = async (
    customerId: string,
    accountNo: string,
  ): Promise<IPennyDropModel> => {
    return await this.findOne({
      where: {
        customerID: customerId,
        account_number: accountNo,
        account_status: 'active',
        penny_status: PennyStatus.COMPLETED,
      },
      whereIn: [{ column: 'penny_drop_name_match', value: ['1', '0'] }],
      order: [{ column: 'id', order: 'desc' }],
    })
  }

  async count(
    params: KnexFindParams<IPennyDropModel, TSelectPennyDropModel>,
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

export const pennyDropModel = new PennyDropModel()
