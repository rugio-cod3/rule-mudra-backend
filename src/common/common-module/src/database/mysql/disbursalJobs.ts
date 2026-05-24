import { IDisbursalJobsModel, TSelectDisbursalJobs } from '../../interfaces/disbursalJobs.interface'
import { InsertData, KnexFindParams, UpdateQuery, WhereQuery } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class DisbursalJobsModel {
  private table = 'disbursal_jobs'

  get DisbursalJobsKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async find(
    params: KnexFindParams<IDisbursalJobsModel, TSelectDisbursalJobs>,
  ): Promise<IDisbursalJobsModel[]> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull, whereRaw } = params
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
      whereNotNull.forEach(column => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query
  }

  // Updated findOne
  async findOne(
    params: KnexFindParams<IDisbursalJobsModel, TSelectDisbursalJobs>,
  ): Promise<IDisbursalJobsModel> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull, paginate } = params
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

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach(column => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }

    return await query.first()
  }

  public async findOneAndUpdate(
    where: WhereQuery<IDisbursalJobsModel>,
    update: UpdateQuery<IDisbursalJobsModel>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async create(data: InsertData<IDisbursalJobsModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async bulkCreate(data: InsertData<IDisbursalJobsModel>[]): Promise<number[]> {
    let db = getKnexInstance()
    return await db.batchInsert(this.table, data)
  }

  async count(params: KnexFindParams<IDisbursalJobsModel, TSelectDisbursalJobs>): Promise<number> {
    const { where, whereNot } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const disbursalJobsModel = new DisbursalJobsModel()
