import {
  IReferrerModel,
  TSelectReferrer,
} from '@/interfaces/referrer.interface'
import {
  InsertData,
  KnexFindParams,
  UpdateQuery,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'
import { customerModel } from './customer'
import { customerByPartnerModel } from './customerByPartner'

export default class ReferrerModel {
  private table = 'referrers'
  private readonly customerModel = customerModel
  private readonly customerByPartner = customerByPartnerModel

  get ReferrerKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async find(
    params: KnexFindParams<IReferrerModel, TSelectReferrer>,
  ): Promise<IReferrerModel[]> {
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

  // Updated findOne
  async findOne(
    params: KnexFindParams<IReferrerModel, TSelectReferrer>,
  ): Promise<IReferrerModel> {
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
    where: WhereQuery<IReferrerModel>,
    update: UpdateQuery<IReferrerModel>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async create(data: InsertData<IReferrerModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async getLastTwoMonthReferrer(customerID: number): Promise<IReferrerModel> {
    const customer = await this.customerModel.findOneCustomer({ customerID }, [
      'mobile',
      'pancard',
    ])

    // 2 month check

    const customerByPartner =
      await this.customerByPartner.CustomerByPartnerKnex.select(
        'utmSource',
        'created_at',
      )
        .where('mobile', customer.mobile.toString())
        .where('pancard', customer.pancard)
        .where(
          getKnexInstance().raw('DATE(created_at)'),
          '>=',
          getKnexInstance().raw('DATE(NOW() - INTERVAL 30 DAY)'),
        )
        .orderBy('created_at', 'asc')
        .first()

    if (customerByPartner && customerByPartner?.utmSource) {
      customerByPartner.referrer = customerByPartner.utmSource
      delete customerByPartner.utmSource
      return customerByPartner
    }

    const referrer = await this.ReferrerKnex.select('referrer', 'created_at')
      .where('mobile', customer.mobile.toString())
      .where(
        getKnexInstance().raw('DATE(created_at)'),
        '>=',
        getKnexInstance().raw('DATE(NOW() - INTERVAL 30 DAY)'),
      )
      .orderBy('created_at', 'asc')
      .first()

    if (referrer && referrer?.referrer) {
      return referrer
    }

    return undefined
  }
}

export const referrerModel = new ReferrerModel()
