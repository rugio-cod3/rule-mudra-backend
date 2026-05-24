import md5 from 'md5'
import { UpdateQuery } from 'mongoose'
import { BadRequestError, NotFoundError } from '../../errors'
import { IUpdatePermissionAccess } from '../../interfaces/permissions.interface'
import {
  IUpdateOrAddManagementUserListSchema,
  IUser,
  TSelectUser,
} from '../../interfaces/users.interface'
import { KnexFindParams, WhereQuery } from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'
import { isEmpty } from '../../utils/util'

export default class UserModel {
  private table = 'users'

  get UsersKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  // Find a single user by a condition
  public async findOneUser(
    where: Partial<IUser>,
    select: (keyof IUser)[] | ['*'] = ['*'],
  ): Promise<IUser | null> {
    try {
      const db = getKnexInstance()
      const user = await db
        .table(this.table)
        .where(where)
        .select(...select)
        .first()
      return user || null
    } catch (error) {
      logger.error('Error Inside UserModel findOneUser function', error)
      return null
    }
  }

  // Get multiple users with specific conditions
  public async getUsers(
    where: Partial<IUser>,
    order: { orderKey: keyof IUser; orderValue: string },
    select: (keyof IUser)[],
  ): Promise<IUser[] | []> {
    try {
      const db = getKnexInstance()
      const users = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      return users.length ? users : []
    } catch (error) {
      logger.error('Error Inside UserModel getUsers function', error)
      return []
    }
  }
  async findOne(params: KnexFindParams<IUser, TSelectUser>): Promise<IUser> {
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

    return await query.first()
  }

  async find(params: KnexFindParams<IUser, TSelectUser>): Promise<IUser[]> {
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

  async updateUserList(
    payload: IUpdateOrAddManagementUserListSchema,
    userID: number,
    loggedUser: IUser,
    ipAddress: string,
    role_name: string,
  ): Promise<number> {
    const db = getKnexInstance()

    // Extract helper functions
    const getExistingUser = async (userID: number) => {
      const user = await this.findOneUser({ userID })
      if (!user) throw new NotFoundError('User not found')
      return user
    }

    const updatePermissions = (existingPerms: string[], newPerms?: IUpdatePermissionAccess[]) => {
      const permSet = new Set(existingPerms)

      newPerms?.forEach(({ name, isChecked }) => {
        isChecked ? permSet.add(name) : permSet.delete(name)
      })

      return Array.from(permSet).join(',')
    }

    // Get existing user and process permissions
    const existingUser = await getExistingUser(userID)
    const existingAccessPer = existingUser.accessPer?.split(',') || []

    // Prepare update data
    const { password, accessPer, ...rest } = payload
    const updateData = {
      ...rest,
      ...(password && { password: md5(password) }),
      ...(accessPer && {
        accessPer: updatePermissions(existingAccessPer, payload.accessPer),
      }),
    }

    if (updateData.status === 'Active') {
      if (existingUser?.status === 'In Active') {
        await db('loginLogs').insert({
          userID: loggedUser.userID,
          name: loggedUser.name,
          email: loggedUser.email,
          ip: ipAddress,
        })
      }
    }

    const result = await db(this.table)
      .where('userID', userID)
      .update({
        ...updateData,
        role: !isEmpty(role_name) ? role_name : existingUser.role,
      })

    // Log the user edit
    const logData = {
      name: existingUser.name,
      email: existingUser.email,
      mobile: existingUser.mobile,
      did_no: existingUser.did_no,
      userName: existingUser.userName,
      branch: existingUser.branch,
      status: existingUser.status,
      convoque_login_id: existingUser.convoque_login_id,
      convoque_exten: existingUser.convoque_exten,
      whatsapp_email: existingUser.whatsapp_email,
      accessPer: existingUser.accessPer,
      ...updateData, // Then spread update data to override changed fields
      role: !isEmpty(role_name) ? role_name : existingUser.role,
      userID: userID,
      password: 'null',
      createdBy: loggedUser.userID,
    }
    await db('user_edit_logs').insert(logData)

    return result ? userID : 0
  }

  async addUserList(
    payload: IUpdateOrAddManagementUserListSchema,
    loggedUser: IUser,
    role_name: string,
  ): Promise<number> {
    const db = getKnexInstance()

    // Extract reusable validation function
    const checkExistingUser = async (payload: IUpdateOrAddManagementUserListSchema) => {
      const existingUser = await this.findOne({
        where(query) {
          query
            .orWhere('email', payload.email)
            .orWhere('userName', payload.userName)
            .orWhere('mobile', payload.mobile)
        },
      })

      if (existingUser) {
        throw new BadRequestError('User already exists')
      }
    }

    // Extract permission handling logic
    const getFormattedPermissions = (accessPer?: IUpdatePermissionAccess[]) => {
      const permissions = new Set<string>()

      if (accessPer?.length) {
        accessPer.forEach(({ name, isChecked }) => {
          if (isChecked) permissions.add(name)
        })
      }

      return permissions.size ? Array.from(permissions).join(',') : ''
    }

    // Validate user existence
    await checkExistingUser(payload)

    // Prepare user data
    const { password, accessPer, ...restPayload } = payload

    const userData = {
      ...restPayload,
      ...(password && { password: md5(password) }),
      ...(accessPer && { accessPer: getFormattedPermissions(accessPer) }),
      createdBy: loggedUser.userID,
    }

    //remove role_id from userData
    delete userData.role_id

    const [insertId] = await db(this.table).insert({
      ...userData,
      role: role_name,
    })

    // Log the user creation
    const logData = {
      ...userData,
      role: role_name,
      userID: insertId,
      password: 'null',
      createdBy: loggedUser.userID,
    }
    await db('user_edit_logs').insert(logData)

    return insertId || 0
  }

  async updateUserById(userId: number, payload: Partial<IUser>): Promise<IUser> {
    const db = getKnexInstance()

    //check if user already exists
    const existingUser = await this.findOneUser({ userID: userId })
    if (existingUser) {
      throw new BadRequestError('User already exists')
    }
    return db('users').where('userID', userId).update(payload)
  }

  async findOneAndUpdate(where: WhereQuery<IUser>, update: UpdateQuery<IUser>): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async getUserNameById(userID: number | string): Promise<string> {
    if (!userID || (typeof userID === 'string' && userID.trim() === '')) {
      return ''
    }

    const id = typeof userID === 'string' ? Number(userID.trim()) : userID

    if (isNaN(id)) {
      return ''
    }

    const user = await userModel.findOne({
      where: { userID: id },
      select: ['name'],
    })

    return user?.name || ''
  }
}
export const userModel = new UserModel()
