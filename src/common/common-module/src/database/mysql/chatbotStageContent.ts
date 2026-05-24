import { KnexFindParams, UpdateQuery, WhereQuery } from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'
import {
  IChatbotStageContent,
  TSelectChatbotStageContent,
} from '../../interfaces/chatbot.interface'

export default class ChatbotStageContentModel {
  private table = 'chatbot_stage_content'

  get ChatbotStageContentKnex() {
    const db = getKnexInstance()
    return db(this.table)
  }

  async find(
    params: KnexFindParams<IChatbotStageContent, TSelectChatbotStageContent>,
  ): Promise<IChatbotStageContent[]> {
    const { where, select = ['*'], order, paginate } = params
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach(condition => {
          query = query.where(condition.column, condition.value)
        })
      } else {
        query = query.where(where)
      }
    }

    query = query.select(...select)

    if (order) {
      order.forEach(o => {
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
    params: KnexFindParams<IChatbotStageContent, TSelectChatbotStageContent>,
  ): Promise<IChatbotStageContent | null> {
    const { where, select = ['*'], order } = params
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach(condition => {
          query = query.where(condition.column, condition.value)
        })
      } else {
        query = query.where(where)
      }
    }

    query = query.select(...select)

    if (order) {
      order.forEach(o => {
        if (typeof o === 'string') {
          query = query.orderBy(o)
        } else {
          query = query.orderBy(o.column as string, o.order)
        }
      })
    }

    return await query.first()
  }

  async findWithStage(params: {
    where?: WhereQuery<IChatbotStageContent>
    select?: string[]
    order?: { column: string; order?: 'asc' | 'desc' }[]
    paginate?: { page: number; perPage: number }
  }): Promise<any[]> {
    const { where, select = ['*'], order, paginate } = params
    const db = getKnexInstance()
    let query = db
      .table(this.table)
      .leftJoin('chatbot_stages', 'chatbot_stage_content.stage_id', 'chatbot_stages.id')

    if (where) {
      if (Array.isArray(where)) {
        where.forEach(condition => {
          query = query.where(`${this.table}.${condition.column}`, condition.value)
        })
      } else {
        Object.keys(where).forEach(key => {
          query = query.where(`${this.table}.${key}`, where[key])
        })
      }
    }

    // Default select includes table prefixes
    if (select.includes('*')) {
      query = query.select(`${this.table}.*`, 'chatbot_stages.stage_name')
    } else {
      query = query.select(...select)
    }

    if (order) {
      order.forEach(o => {
        query = query.orderBy(o.column, o.order || 'asc')
      })
    }

    if (paginate) {
      query = query.offset(paginate.page).limit(paginate.perPage)
    }

    return await query
  }

  async count(params?: { where?: WhereQuery<IChatbotStageContent> }): Promise<number> {
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (params?.where) {
      if (Array.isArray(params.where)) {
        params.where.forEach(condition => {
          query = query.where(condition.column, condition.value)
        })
      } else {
        query = query.where(params.where)
      }
    }

    const result = await query.count('* as count').first()
    return Number(result?.count || 0)
  }

  async create(data: Partial<IChatbotStageContent>): Promise<number[]> {
    const db = getKnexInstance()
    return await db.table(this.table).insert(data)
  }

  async update(
    where: WhereQuery<IChatbotStageContent>,
    data: UpdateQuery<IChatbotStageContent>,
  ): Promise<number> {
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (Array.isArray(where)) {
      where.forEach(condition => {
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

  async delete(where: WhereQuery<IChatbotStageContent>): Promise<number> {
    const db = getKnexInstance()
    let query = db.table(this.table)

    if (Array.isArray(where)) {
      where.forEach(condition => {
        query = query.where(condition.column, condition.value)
      })
    } else {
      query = query.where(where)
    }

    return await query.del()
  }

  async softDelete(where: WhereQuery<IChatbotStageContent>): Promise<number> {
    return await this.update(where, { is_active: false })
  }
}

export const chatbotStageContentModel = new ChatbotStageContentModel()
