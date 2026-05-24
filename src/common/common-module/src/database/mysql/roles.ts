import { Knex } from 'knex'
import { IAddOrUpdateRoleDetails, IRole, TSelectRole } from '../../interfaces/roles.interface'
import { KnexFindParams } from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'
import { userModel } from './users'

export default class RoleModel {
  private table = 'roles'
  private readonly userModel = userModel

  get RolesKnex() {
    let db: Knex = getKnexInstance()
    return db(this.table)
  }

  async findOne(params: KnexFindParams<IRole, TSelectRole>): Promise<IRole> {
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

  async find(params: KnexFindParams<IRole, TSelectRole>): Promise<IRole[]> {
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

    return await query
  }

  async getUserPermissions(userID: number, roleName: string) {
    const db = getKnexInstance()

    const originalLimit = await db.raw('SELECT @@group_concat_max_len as max_len')

    // Temporarily change max concat length to avoid memory issues
    await db.raw('SET SESSION group_concat_max_len = 100000')

    const userRole = await this.RolesKnex.join(
      'role_permission_links as rpl',
      'rpl.role_id',
      '=',
      'roles.role_id',
    )
      .join('permissions as perm', 'perm.permission_id', '=', 'rpl.permission_id')
      .where('roles.role_name', roleName)
      .where('roles.status', 1)
      .where('rpl.status', 1)
      .select(
        'roles.role_id',
        'roles.role_name',
        db.raw('GROUP_CONCAT(perm.permission_name SEPARATOR ",") as permissions'),
      )
      .groupBy('roles.role_id', 'roles.role_name')
      .first()

    // To be called on login
    const userExtraRoles = await this.userModel.findOne({
      where: { userID },
      select: ['accessPer'],
    })

    if (userExtraRoles.accessPer.length > 0) userRole.permissions += ',' + userExtraRoles.accessPer

    // Revert back to the original limit
    await db.raw(`SET SESSION group_concat_max_len = ${originalLimit[0][0].max_len}`)

    return userRole
  }
  async update(
    payload: IAddOrUpdateRoleDetails,
    role_id: number,
    loggedUserId: number,
  ): Promise<number> {
    let db = getKnexInstance()
    const data = { ...payload, updated_by: loggedUserId }
    const res = await db(this.table).where('role_id', role_id).update(data)
    return res ? role_id : 0
  }

  async create(payload: IAddOrUpdateRoleDetails, loggedUserId: number): Promise<number> {
    let db = getKnexInstance()
    const data = { ...payload, created_by: loggedUserId }
    const [insertId] = await db(this.table).insert(data)
    return insertId || 0
  }

  // public async getRoleList(
  //   select: SelectFields<TSelectRole>,
  //   order: SortCriteria<TSelectRole>,
  // ): Promise<IRole[]> {
  //   const db: Knex = getKnexInstance()
  //   return await db
  //     .table(this.table)
  //     .select(...select)
  //     .orderBy(order)
  // }
}

export const roleModel = new RoleModel()
