import { PanCardBlackListStatus } from '../../enums/common.enum'
import {
  IBlacklistCustomerPancard,
  TBlackListCustomerPancard,
} from '../../interfaces/blackListCustomerPancard.interface'
import {
  InsertData,
  KnexFindParams,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'
export default class BlackListCustomerPancardModel {
  private table = 'blacklistCustomerPancard'
  get LeadsKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }
  get Knex() {
    let db = getKnexInstance()
    return db
  }
  async find(
    params: KnexFindParams<
      IBlacklistCustomerPancard,
      TBlackListCustomerPancard
    >,
  ): Promise<IBlacklistCustomerPancard[]> {
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
      IBlacklistCustomerPancard,
      TBlackListCustomerPancard
    >,
  ): Promise<IBlacklistCustomerPancard> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      paginate,
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
    if (whereNot) {
      query.whereNot(whereNot)
    }
    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }
    if (order) query.orderBy(order)
    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }
    return await query.first()
  }
  public async findOneAndUpdate(
    where: WhereQuery<IBlacklistCustomerPancard>,
    update: UpdateQuery<IBlacklistCustomerPancard>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }
  async count(
    where?: WhereQuery<IBlacklistCustomerPancard>,
    whereNot?: WhereQuery<IBlacklistCustomerPancard>,
  ) {
    let db = getKnexInstance()
    const count = db(this.table)
    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)
    const data = await count.count()
    return data[0]['count(*)'] as number
  }
  async create(data: InsertData<IBlacklistCustomerPancard>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async isBlackListedCustomer(pancard: string): Promise<boolean> {
    let isBlackListed = false
    const result = await this.findOne({
      where: { pancard },
      select: ['status'],
      order: [{ column: 'id', order: 'desc' }],
    })
    if (result && result.status === PanCardBlackListStatus.ACTIVE)
      isBlackListed = true

    return isBlackListed
  }
}
export const blackListCustomerPancardModel = new BlackListCustomerPancardModel()
