import moment from 'moment-timezone'
import NotificationModel from '../database/mysql/notification'
import {
  INotification,
  TSelectNotification,
} from '../interfaces/notification.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import { logger } from '../utils/logger'

class NotificationService {
  private notificationModel = new NotificationModel()

  public async findOne(
    where: Partial<INotification>,
    select: TSelectNotification[] | ['*'] = ['*'],
  ): Promise<INotification> {
    return await this.notificationModel.findOneNotification(where, select)
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<INotification[] | ICustomResponse> {
    try {
      let notifications = await this.notificationModel.getNotifications(
        where,
        order,
        select,
      )
      if (notifications == null || notifications.length == 0) {
        return null
      } else {
        return notifications // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let notifications_count = await this.notificationModel.countNotifications(
        where,
      )
      if (notifications_count == null) {
        return 0
      } else {
        return notifications_count // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async create(data: {}): Promise<number | ICustomResponse> {
    try {
      const newData = {
        ...data,
        createdDate: moment().utcOffset(330).format('YYYY-MM-DD HH:mm:ss'),
      }
      const insertId = await this.notificationModel.insert(newData)
      return insertId
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async updateOne(
    where: {},
    update: {},
  ): Promise<boolean | ICustomResponse> {
    try {
      await this.notificationModel.findOneAndUpdate(where, update)
      return true
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async findByFilter(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
    page: number,
    perPage: number,
  ): Promise<INotification[] | ICustomResponse> {
    try {
      let notifications = await this.notificationModel.getNotificationsByFilter(
        where,
        order,
        select,
        page,
        perPage,
      )
      if (notifications == null || notifications.length == 0) {
        return null
      } else {
        return notifications // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }
}

export default NotificationService
