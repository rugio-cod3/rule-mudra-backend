import { Knex } from 'knex'
import {
  IReferralStepControlModel,
  TSelectReferrarStepControl,
} from '../../interfaces/referral_step_control.interface'
import {
  DeleteWhere,
  InsertData,
  KnexFindParams,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class ReferrarStepControlModel {
  private table = 'referrar_step_control'

  get Knex(): Knex.QueryBuilder {
    const db = getKnexInstance()
    return db(this.table)
  }

  get ReferrarStepControlKnex() {
    let db = getKnexInstance()
    return db(`${this.table} as rsc`)
  }

  async find(
    params: KnexFindParams<
      IReferralStepControlModel,
      TSelectReferrarStepControl
    >,
  ): Promise<IReferralStepControlModel[]> {
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

  async findOne(
    params: KnexFindParams<
      IReferralStepControlModel,
      TSelectReferrarStepControl
    >,
  ): Promise<IReferralStepControlModel> {
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

  public async insert(
    data: InsertData<IReferralStepControlModel>,
  ): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOneAndUpdate(
    where: WhereQuery<IReferralStepControlModel>,
    update: UpdateQuery<IReferralStepControlModel>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async delete(deleteWhere: DeleteWhere<TSelectReferrarStepControl>) {
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

export const referrarStepControlModel = new ReferrarStepControlModel()
