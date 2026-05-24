import { INotification, TSelectNotification } from '../../interfaces/notification.interface'
import { KnexFindParams } from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class NotificationModel {
  private table = 'notifications'

  async findOneNotification(
    where: Partial<INotification>,
    select: TSelectNotification[] | ['*'] = ['*'],
  ): Promise<INotification> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .first()
  }
  // ! Remove this
  public async getNotifications(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<INotification[] | null> {
    try {
      let db = getKnexInstance()
      let notifications = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (notifications == null || notifications.length == 0) {
        return null
      } else {
        return notifications // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside notification.ts getNotifications function', error)
    }
  }
  public async getNotificationsByFilter(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
    page: number,
    perPage: number,
  ): Promise<INotification[] | null> {
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
      let notification = await query

      if (notification == null || notification.length == 0) {
        return null
      } else {
        return notification // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside notification.ts getNotificationsByFilter function', error)
    }
  }
  public async countNotifications(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let notification = await db(this.table).where(where).count()
      let count = notification[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside notification.ts countNotifications function', error)
    }
  }
  public async insert(data: any): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table).insert(data).returning('id')
      return insertedID
    } catch (error) {
      logger.error('Error Inside notification.ts insert function', error)
      return null
    }
  }
  public async findOneAndUpdate(where: {}, update: {}): Promise<void | null> {
    try {
      let db = getKnexInstance()
      await db(this.table).where(where).update(update)
    } catch (error) {
      logger.error('Error Inside notification.ts findOneAndUpdate function', error)
    }
  }

  async find(params: KnexFindParams<INotification, TSelectNotification>): Promise<INotification[]> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      whereRaw,
      paginate,
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

    return await query
  }
}
