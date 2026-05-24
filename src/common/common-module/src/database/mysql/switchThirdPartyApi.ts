
  import {
    DeleteWhere,
    InsertData,
    KnexFindParams,
    SelectFields,
    SortCriteria,
    UpdateQuery,
    WhereQuery,
  } from '@/types/model.types'
  import { getKnexInstance } from '@/utils/mysql'
  import { Knex } from 'knex'
import { ISwitchThirdPartyApiModel, TSwitchThirdPartyApi } from '../../interfaces/switchThirdPartyApi.interface'

  
  export default class SwitchThirdPartyApiModel {
    private table = 'switch_thirdparty_api'
  
    Knex<T>(): Knex.QueryBuilder<T> {
      const db = getKnexInstance()
      return db<T>(this.table)
    }
  
    async find(
      params: KnexFindParams<ISwitchThirdPartyApiModel,TSwitchThirdPartyApi>,
    ): Promise<ISwitchThirdPartyApiModel[]> {
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
      params: KnexFindParams<ISwitchThirdPartyApiModel,TSwitchThirdPartyApi>,
    ): Promise<ISwitchThirdPartyApiModel> {
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
  
      return await query.first()
    }
  
    async findAll(
      select: SelectFields<TSwitchThirdPartyApi> = ['*'],
      where?: WhereQuery<ISwitchThirdPartyApiModel>,
      orderBy?: SortCriteria<TSwitchThirdPartyApi>,
    ): Promise<ISwitchThirdPartyApiModel[]> {
      let db = getKnexInstance()
  
      const query = db(this.table)
  
      if (where) {
        query.where(where)
      }
  
      if (select) {
        query.select(...select)
      }
  
      if (orderBy) query.orderBy(orderBy)
  
      return await query
    }
  
    async findOneStepControl(
      where: WhereQuery<ISwitchThirdPartyApiModel>,
      select: SelectFields<TSwitchThirdPartyApi> = ['*'],
      orderBy?: SortCriteria<TSwitchThirdPartyApi>,
    ): Promise<ISwitchThirdPartyApiModel> {
      let db = getKnexInstance()
  
      const query = db(this.table)
        .where(where)
        .select(...select)
  
      if (orderBy) query.orderBy(orderBy)
  
      return await query.first()
    }
  
    public async insert(data: InsertData<ISwitchThirdPartyApiModel>): Promise<number[]> {
      let db = getKnexInstance()
      return await db(this.table).insert(data)
    }
    async update(
      where: WhereQuery<ISwitchThirdPartyApiModel>,
      update: UpdateQuery<ISwitchThirdPartyApiModel>,
    ): Promise<number> {
      let db = getKnexInstance()
  
      return await db(this.table).where(where).update(update)
    }
  
    async delete(deleteWhere: DeleteWhere<TSwitchThirdPartyApi>) {
      const db = getKnexInstance()
      const query = db(this.table)
  
      deleteWhere.forEach((element) => {
        const { column, operator, value } = element
  
        if (operator) query.where(column, operator, value)
        else query.where(column, value)
      })
  
      return await query.delete()
    }

    async updateOneExcluding(
        where: WhereQuery<ISwitchThirdPartyApiModel>,
        whereNot: WhereQuery<ISwitchThirdPartyApiModel>,
        update: UpdateQuery<ISwitchThirdPartyApiModel>
    ): Promise<number> {
        const db = getKnexInstance();
    
        return await db(this.table)
            .where(where)
            .whereNot(whereNot) // Adding whereNot condition
            .update(update);
    }
    
  }

  export const switchThirdPartyApiModel = new SwitchThirdPartyApiModel()
  