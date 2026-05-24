import { ICreateOTP, TSelectICreateOTP } from '@/interfaces/otp.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  WhereQuery,
} from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'
import { UpdateQuery } from 'mongoose'

export default class OtpModel {
  private table = 'rf_otp'

  async insert(data: InsertData<ICreateOTP>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async find(
    params: KnexFindParams<ICreateOTP, TSelectICreateOTP>,
  ): Promise<ICreateOTP[]> {
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
        console.log('line 32', where)
        where.forEach((element) => {
          const { column, operator, value } = element

          if (operator) query.where(column, operator, value)
          else query.where(column, value)
        })
      } else {
        query.where(where).first()
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

  
  async update(where: WhereQuery<ICreateOTP>, update: UpdateQuery<ICreateOTP>): Promise<number> {
    let db = getKnexInstance()
    return await db(this.table).where(where).update(update)
  }

  // async findOne(where: WhereQuery<ICreateOTP>, select: SelectFields<TSelectICreateOTP> = ['*'], ): Promise<ICreateOTP> {
  //   let db = getKnexInstance()
  //   return await db(this.table).where(where).select(...select).first()
  // }

}

export const otpModel = new OtpModel()
