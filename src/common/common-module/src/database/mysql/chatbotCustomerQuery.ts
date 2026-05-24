import { KnexFindParams, UpdateQuery, WhereQuery } from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'
import {
  IChatbotCustomerQuery,
  TSelectChatbotCustomerQuery,
} from '../../interfaces/chatbot.interface'

export default class ChatbotCustomerQueryModel {
  private table = 'chatbot_customer_queries'

  get ChatbotCustomerQueryKnex() {
    const db = getKnexInstance()
    return db(this.table)
  }

  async find(
    params: KnexFindParams<IChatbotCustomerQuery, TSelectChatbotCustomerQuery>,
  ): Promise<IChatbotCustomerQuery[]> {
    const { where, select = ['*'], order, paginate } = params
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach((condition) => {
          query = query.where(condition.column, condition.value)
        })
      } else {
        query = query.where(where)
      }
    }

    query = query.select(...select)

    if (order) {
      order.forEach((o) => {
        if (typeof o === 'string') {
          query = query.orderBy(o)
        } else {
          query = query.orderBy(o.column as string, o.order)
        }
      })
    }

    if (paginate) {
      query = query.offset(paginate.page).limit(paginate.perPage)
    }

    return await query
  }

  async findOne(
    params: KnexFindParams<IChatbotCustomerQuery, TSelectChatbotCustomerQuery>,
  ): Promise<IChatbotCustomerQuery | null> {
    const { where, select = ['*'], order, paginate } = params
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach((condition) => {
          query = query.where(condition.column, condition.value)
        })
      } else {
        query = query.where(where)
      }
    }

    query = query.select(...select)

    if (order) {
      order.forEach((o) => {
        if (typeof o === 'string') {
          query = query.orderBy(o)
        } else {
          query = query.orderBy(o.column as string, o.order)
        }
      })
    }

    if (paginate) {
      query = query.offset(paginate.page).limit(paginate.perPage)
    }

    return await query.first()
  }

  async findWithCustomers(params: {
    where?: any
    select?: string[]
    order?: { column: string; order?: 'asc' | 'desc' }[]
    paginate?: { page: number; perPage: number }
    search?: string
    dateRange?: { startDate?: string; endDate?: string }
  }): Promise<any[]> {
    const { where, select = ['*'], order, paginate, search, dateRange } = params
    const db = getKnexInstance()
    let query = db
      .table(this.table)
      .leftJoin('customers', 'chatbot_customer_queries.customer_id', 'customers.id')

    // Apply where conditions
    if (where) {
      Object.keys(where).forEach((key) => {
        if (where[key] !== undefined && where[key] !== null && where[key] !== '') {
          query = query.where(`${this.table}.${key}`, where[key])
        }
      })
    }

    // Apply search
    if (search && search.trim()) {
      query = query.whereRaw(`${this.table}.query_text LIKE ?`, [`%${search.trim()}%`])
    }

    // Apply date range
    if (dateRange) {
      if (dateRange.startDate) {
        query = query.where(`${this.table}.created_at`, '>=', dateRange.startDate)
      }
      if (dateRange.endDate) {
        query = query.where(`${this.table}.created_at`, '<=', dateRange.endDate)
      }
    }

    const customerColumns = [
      'customers.name as customer_name',
      'customers.email as customer_email',
      'customers.mobile as customer_mobile',
    ]

    // Default select includes table prefixes
    if (select.includes('*')) {
      query = query.select(`${this.table}.*`, ...customerColumns)
    } else {
      query = query.select(...select.map((col) => `${this.table}.${col}`), ...customerColumns)
    }

    if (order) {
      order.forEach((o) => {
        const column = o.column.includes('.') ? o.column : `${this.table}.${o.column}`
        query = query.orderBy(column, o.order || 'desc')
      })
    } else {
      // Default ordering
      query = query.orderBy(`${this.table}.id`, 'desc')
    }

    if (paginate) {
      query = query.offset(paginate.page).limit(paginate.perPage)
    }

    return await query
  }

  async countWithFilters(params: {
    where?: any
    search?: string
    dateRange?: { startDate?: string; endDate?: string }
  }): Promise<number> {
    const { where, search, dateRange } = params
    const db = getKnexInstance()
    let query = db.table(this.table)

    // Apply where conditions
    if (where) {
      Object.keys(where).forEach((key) => {
        if (where[key] !== undefined && where[key] !== null && where[key] !== '') {
          query = query.where(key, where[key])
        }
      })
    }

    // Apply search
    if (search && search.trim()) {
      query = query.whereRaw('query_text LIKE ?', [`%${search.trim()}%`])
    }

    // Apply date range
    if (dateRange) {
      if (dateRange.startDate) {
        query = query.where('created_at', '>=', dateRange.startDate)
      }
      if (dateRange.endDate) {
        query = query.where('created_at', '<=', dateRange.endDate)
      }
    }

    const result = await query.count('* as count').first()
    return Number(result?.count || 0)
  }

  async count(params?: { where?: WhereQuery<IChatbotCustomerQuery> }): Promise<number> {
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (params?.where) {
      if (Array.isArray(params.where)) {
        params.where.forEach((condition) => {
          query = query.where(condition.column, condition.value)
        })
      } else {
        query = query.where(params.where)
      }
    }

    const result = await query.count('* as count').first()
    return Number(result?.count || 0)
  }

  async create(data: Partial<IChatbotCustomerQuery>): Promise<number[]> {
    const db = getKnexInstance()
    return await db.table(this.table).insert(data)
  }

  async update(
    where: WhereQuery<IChatbotCustomerQuery>,
    data: UpdateQuery<IChatbotCustomerQuery>,
  ): Promise<number> {
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (Array.isArray(where)) {
      where.forEach((condition) => {
        query = query.where(condition.column, condition.value)
      })
    } else {
      query = query.where(where)
    }

    return await query.update({
      ...data,
      updated_at: new Date(),
    })
  }

  async delete(where: WhereQuery<IChatbotCustomerQuery>): Promise<number> {
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (Array.isArray(where)) {
      where.forEach((condition) => {
        query = query.where(condition.column, condition.value)
      })
    } else {
      query = query.where(where)
    }

    return await query.del()
  }

  async findRelatedQueries(
    customerId: number,
    excludeId?: number,
  ): Promise<IChatbotCustomerQuery[]> {
    const db = getKnexInstance()
    let query = db
      .table(this.table)
      .where('customer_id', customerId)
      .orderBy('updated_at', 'desc')
      .limit(5)

    if (excludeId) {
      query = query.whereNot('id', excludeId)
    }

    return await query
  }

  async findWithFilters(params: {
    where?: any
    select?: string[]
    order?: { column: string; order?: 'asc' | 'desc' }[]
    paginate?: { page: number; perPage: number }
    search?: string
    dateRange?: { startDate?: string; endDate?: string }
  }): Promise<IChatbotCustomerQuery[]> {
    const { where, select = ['*'], order, paginate, search, dateRange } = params
    const db = getKnexInstance()
    let query = db.table(this.table)

    // Apply where conditions
    if (where) {
      Object.keys(where).forEach((key) => {
        if (where[key] !== undefined && where[key] !== null && where[key] !== '') {
          query = query.where(key, where[key])
        }
      })
    }

    // Apply search
    if (search && search.trim()) {
      query = query.whereRaw('query_text LIKE ?', [`%${search.trim()}%`])
    }

    // Apply date range
    if (dateRange) {
      if (dateRange.startDate) {
        query = query.where('created_at', '>=', dateRange.startDate)
      }
      if (dateRange.endDate) {
        query = query.where('created_at', '<=', dateRange.endDate)
      }
    }

    query = query.select(...select)

    if (order) {
      order.forEach((o) => {
        if (typeof o === 'string') {
          query = query.orderBy(o)
        } else {
          query = query.orderBy(o.column as string, o.order)
        }
      })
    }

    if (paginate) {
      query = query.offset(paginate.page).limit(paginate.perPage)
    }

    return await query
  }
}

export const chatbotCustomerQueryModel = new ChatbotCustomerQueryModel()
