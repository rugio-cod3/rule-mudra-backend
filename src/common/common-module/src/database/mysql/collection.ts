import { ICollection, TSelectCollection } from '../../interfaces/collection.interface'
import {
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class CollectionModel {
  private table = 'collection'

  get CollectionKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async findOneCollection(
    where: WhereQuery<ICollection>,
    select: SelectFields<TSelectCollection> = ['*'],
    order?: SortCriteria<TSelectCollection>,
  ): Promise<ICollection> {
    const db = getKnexInstance()
    const query = db.table(this.table).where(where)

    if (order) query.orderBy(order)

    return await query.select(...select).first()
  }

  async find(params: KnexFindParams<ICollection, TSelectCollection>): Promise<ICollection[]> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      whereRaw,
      paginate,
      sum,
    } = params
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

    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }

    if (sum) {
      sum.forEach((column: string) => {
        query.sum(`${column} as ${column}`)
      })
    }

    return await query
  }

  public async findCollections(
    where: Partial<ICollection>,
    order: { orderKey: TSelectCollection; orderValue: string },
    select: TSelectCollection[] | ['*'] = ['*'],
  ): Promise<ICollection[]> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .orderBy(order.orderKey, order.orderValue)
  }

  public async getCollectionData(
    whereConditions: { column: string; values: string[] | number[] }[],
    order: { orderKey: string; orderValue: string },
    select: string[],
    skip?: number,
    take?: number,
    collectionStartDate?: string,
    collectionEndDate?: string,
  ): Promise<ICollection[] | null> {
    let db = getKnexInstance()

    let selectColumns = '*'

    let query = db('collection as c')
      // .join('customer as c', 'l.customerID', 'c.customerID')
      .select(selectColumns)
      .orderBy(order.orderKey, order.orderValue)

    // Apply whereIn conditions
    // whereConditions.forEach(condition => {
    //   const columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.';
    //   query = query.whereIn(`${columnPrefix}${condition.column}`, condition.values);
    // });

    // if (collectionStartDate) {
    //   query = query.where('l.createdDate', '>=', collectionStartDate);
    // }
    // if (collectionEndDate) {
    //   query = query.where('l.createdDate', '<=', collectionEndDate);
    // }

    if (take !== undefined && take !== null) {
      query = query.limit(take)
    }
    if (skip !== undefined && skip !== null) {
      query = query.offset(skip)
    }

    let collections = await query
    return collections
  }

  public async countCollection(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let collection = await db(this.table).where(where).count()
      let count = collection[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside collection.ts countCollection function', error)
    }
  }
  public async insert(
    customerID: number,
    leadID: number,
    loanNo: string,
    collectedAmount: number,
    collectedMode: string,
    collectedDate: Date, // assuming updatestamp is converted to the correct format already
    referenceNo: string,
    discountAmount: number,
    settlemenAmount: number,
    status: string,
    remark: string,
    collectedBy: number,
    createdDate: Date, // assuming the correct date is assigned to this variable
    collectionStatus: string,
    collectionStatusby: string,
    orderID: string,
  ): Promise<number> {
    const db = getKnexInstance()
    let [insertedID] = await db
      .table(this.table)
      .insert({
        customerID,
        leadID,
        loanNo,
        collectedAmount,
        collectedMode,
        collectedDate, // assuming updatestamp is converted to the correct format already
        referenceNo,
        discountAmount,
        settlemenAmount,
        status,
        remark,
        collectedBy,
        createdDate, // assuming the correct date is assigned to this variable
        collectionStatus,
        collectionStatusby,
        orderID,
      })
      .returning('id')
    return insertedID
  }

  async findOneAndUpdate(
    where: Partial<ICollection>,
    update: Partial<ICollection>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async findOne(params: KnexFindParams<ICollection, TSelectCollection>): Promise<ICollection> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull, whereRaw, sum } = params
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

    !sum && query.select(...select)

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

    if (sum) {
      sum.forEach((column: string) => {
        query.sum(`${column} as ${column}`)
      })
    }

    return await query.first()
  }

  async count(
    where?: WhereQuery<ICollection>,
    whereNot?: WhereQuery<ICollection>,
  ): Promise<number> {
    const db = getKnexInstance()
    const query = db(this.table)

    if (where) query.where(where)
    if (whereNot) query.whereNot(whereNot)

    const result = await query.count('* as count')
    return result[0].count as number
  }

  async countAll(params: KnexFindParams<ICollection, TSelectCollection>): Promise<number> {
    const { where, whereNot, whereIn } = params
    let db = getKnexInstance()
    const count = db(this.table)
    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)
    if (whereIn) {
      whereIn.forEach(condition => {
        const { column, value } = condition
        count.whereIn(column, value)
      })
    }
    const data = await count.count()
    return data[0]['count(*)'] as number
  }

  async update(where: WhereQuery<ICollection>, update: UpdateQuery<ICollection>): Promise<number> {
    let db = getKnexInstance()
    let query = db.table(this.table)
    return query.where(where).update(update)
  }
}

export const collectionModel = new CollectionModel()
