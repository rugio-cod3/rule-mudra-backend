import {
  IEmandateNotRequiredLogsModel,
  TSelectEmandateNotRequiredLogs,
} from '../../interfaces/emandateNotRequiredLogs.interface'
import {
  DeleteWhere,
  InsertData,
  KnexFindParams,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class EmandateNotRequiredLogs {
  private table = 'emandate_not_required_logs'

  async findOne(
    params: KnexFindParams<IEmandateNotRequiredLogsModel, TSelectEmandateNotRequiredLogs>,
  ): Promise<IEmandateNotRequiredLogsModel> {
    const { order, select = ['*'], where, whereIn, whereNot, whereRaw, whereNotNull } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach(element => {
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
      whereIn.forEach(condition => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereRaw) {
      whereRaw.forEach(condition => {
        const { rawQuery, values } = condition
        query.whereRaw(rawQuery, values)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach(column => {
        query.whereNotNull(column)
      })
    }

    if (order) query.orderBy(order)

    return await query.first()
  }

  async insert(data: InsertData<IEmandateNotRequiredLogsModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneAndUpdate(
    where: WhereQuery<IEmandateNotRequiredLogsModel>,
    update: UpdateQuery<IEmandateNotRequiredLogsModel>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async delete(deleteWhere: DeleteWhere<TSelectEmandateNotRequiredLogs>) {
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

export const emandateNotRequiredLogs = new EmandateNotRequiredLogs()
