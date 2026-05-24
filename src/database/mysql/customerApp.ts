import {
  ICustomerApp,
  TSelectCustomerApp,
} from '@/interfaces/customerApp.interface'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class CustomerAppModel {
  private table = 'customerApp'

  async findOneCustomerApp(
    where: Partial<ICustomerApp>,
    select: TSelectCustomerApp[] | ['*'] = ['*'],
  ): Promise<ICustomerApp> {
    const db = getKnexInstance()
    return await db.table(this.table)
      .where(where)
      .select(...select)
      .first()
  }
  // ! Remove this
  // public async getCustomerApps(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ICustomerApp[] | null> {
  //   try {
  //     let db = getKnexInstance()
  //     let customerApp = await db(this.table)
  //       .where(where)
  //       .select(...select)
  //       .orderBy(order.orderKey, order.orderValue)
  //     if (customerApp == null || customerApp.length == 0) {
  //       return null
  //     } else {
  //       return customerApp // Return the first lead if found
  //     }
  //   } catch (error) {
  //     logger.error(
  //       'Error Inside customerApp.ts getCustomerApps function',
  //       error,
  //     )
  //   }
  // }
  public async getCustomerAppsByFilter(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
    page: number,
    perPage: number,
  ): Promise<ICustomerApp[] | null> {
    try {
      let db = getKnexInstance()
      let query = db(this.table)
      for (let key in where) {
        if (where[key]) {
          query.where(key, where[key])
        }
      }
      query.select(...select)
      query.orderBy(order.orderKey, order.orderValue)
      const offset = (page - 1) * perPage

      // Apply limit and offset for pagination
      query.limit(perPage).offset(offset)
      let customerApps = await query

      if (customerApps == null || customerApps.length == 0) {
        return null
      } else {
        return customerApps // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside customerApp.ts getCustomerAppsByFilter function',
        error,
      )
    }
  }
  public async countCustomerApp(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let customerApp = await db(this.table).where(where).count()
      let count = customerApp[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside customerApp.ts countCustomerApp function',
        error,
      )
    }
  }
  public async insert(data: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table).insert(data).returning('id')
      return insertedID
    } catch (error) {
      logger.error('Error Inside customerApp.ts insert function', error)
    }
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error(
        'Error Inside customerApp.ts findOneAndUpdate function',
        error,
      )
    }
  }
}
