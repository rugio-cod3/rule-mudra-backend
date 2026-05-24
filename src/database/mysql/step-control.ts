import {
  IStepControlModel,
  TSelectStepControl,
} from '@/interfaces/step-control.interface'
import {
  DeleteWhere,
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'
import { Knex } from 'knex'

export default class StepControlModel {
  private table = 'step_control'

  Knex<T>(): Knex.QueryBuilder<T> {
    const db = getKnexInstance()
    return db<T>(this.table)
  }

  async find(
    params: KnexFindParams<IStepControlModel, TSelectStepControl>,
  ): Promise<IStepControlModel[]> {
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
    params: KnexFindParams<IStepControlModel, TSelectStepControl>,
  ): Promise<IStepControlModel> {
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

  async findAll(
    select: SelectFields<TSelectStepControl> = ['*'],
    where?: WhereQuery<IStepControlModel>,
    orderBy?: SortCriteria<TSelectStepControl>,
  ): Promise<IStepControlModel[]> {
    let db = getKnexInstance()

    const query = db(this.table)

    if (where) {
      query.where(where)
    }

    if (select) {
      query.select(...select)
    }

    if (orderBy) query.orderBy(orderBy)

    return await query
  }

  async findOneStepControl(
    where: WhereQuery<IStepControlModel>,
    select: SelectFields<TSelectStepControl> = ['*'],
    orderBy?: SortCriteria<TSelectStepControl>,
  ): Promise<IStepControlModel> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }

  public async insert(data: InsertData<IStepControlModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOneAndUpdate(
    where: WhereQuery<IStepControlModel>,
    update: UpdateQuery<IStepControlModel>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async delete(deleteWhere: DeleteWhere<TSelectStepControl>) {
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

export const stepControlModel = new StepControlModel()
