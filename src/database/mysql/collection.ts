import {
  ICollection,
  TSelectCollection,
} from '@/interfaces/collection.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class CollectionModel {
  private table = 'collection'

  get CollectionKnex() {
    const db = getKnexInstance()
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

  async find(
    params: KnexFindParams<ICollection, TSelectCollection>,
  ): Promise<ICollection[]> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      whereRaw,
      sum,
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

    !sum && query.select(...select)

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

    if (sum) {
      sum.forEach((column: string) => {
        query.sum(`${column} as ${column}`)
      })
    }

    return await query
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
        collectionStatus,
        collectionStatusby,
        orderID,
      })
      .returning('id')
    return insertedID
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      let collection = await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside collection.ts findOneAndUpdate function',
        error,
      )
    }
  }

  async create(data: InsertData<ICollection>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}
