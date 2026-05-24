import { ISourcePartner, TSelectSourcePartner } from '../../interfaces/sourcePartner.interface'
import {
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class SourcePartnerModel {
  private table = 'source_partners'

  async findOne(
    where: WhereQuery<ISourcePartner>,
    select: SelectFields<TSelectSourcePartner> = ['*'],
    order?: SortCriteria<TSelectSourcePartner>,
  ): Promise<ISourcePartner> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }

  async findAll(
    where: WhereQuery<ISourcePartner>,
    select: SelectFields<TSelectSourcePartner> = ['*'],
    order?: SortCriteria<TSelectSourcePartner>,
  ): Promise<ISourcePartner[]> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (order) {
      query.orderBy(order)
    }

    return await query
  }

  public async insert(data: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let result = await db(this.table).insert(data)
      let insertedID = result[0]
      return insertedID
    } catch (error) {
      return null
    }
  }

  async findOneAndUpdate(
    where: WhereQuery<ISourcePartner>,
    update: UpdateQuery<ISourcePartner>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async find(
    params: KnexFindParams<ISourcePartner, TSelectSourcePartner>,
  ): Promise<ISourcePartner[]> {
    const { select = ['*'], paginate, where } = params
    let db = getKnexInstance()

    let query = db(this.table)
    if (where) {
      query.where(where)
    }
    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }
    query.select(...select)

    return await query
  }

  async count(params: KnexFindParams<ISourcePartner, TSelectSourcePartner>): Promise<number> {
    const { where, whereNot, whereIn } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)
    if (whereIn) {
      whereIn.forEach(condition => {
        const { column, value } = condition
        count.whereIn(column, value)
      })
    }

    const data = await count.count()

    return data[0]['count(*)'] as number
  }
}

export const sourcePartnerModel = new SourcePartnerModel()
