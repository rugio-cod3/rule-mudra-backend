import { KnexFindParams, UpdateQuery, WhereQuery } from '@/types/model.types'
import { getKnexInstance } from '@/utils/mysql'
import { IChatbotStage, TSelectChatbotStage } from '../../interfaces/chatbot.interface'

export default class ChatbotStageModel {
  private table = 'chatbot_stages'

  get ChatbotStageKnex() {
    const db = getKnexInstance()
    return db(this.table)
  }

  async find(params: KnexFindParams<IChatbotStage, TSelectChatbotStage>): Promise<IChatbotStage[]> {
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
    params: KnexFindParams<IChatbotStage, TSelectChatbotStage>,
  ): Promise<IChatbotStage | null> {
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

    return await query.first()
  }

  async count(params?: { where?: WhereQuery<IChatbotStage> }): Promise<number> {
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

  async create(data: Partial<IChatbotStage>): Promise<number[]> {
    const db = getKnexInstance()
    return await db.table(this.table).insert(data)
  }

  async update(
    where: WhereQuery<IChatbotStage>,
    data: UpdateQuery<IChatbotStage>,
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

    return await query.update(data)
  }

  async delete(where: WhereQuery<IChatbotStage>): Promise<number> {
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
}

export const chatbotStageModel = new ChatbotStageModel()
