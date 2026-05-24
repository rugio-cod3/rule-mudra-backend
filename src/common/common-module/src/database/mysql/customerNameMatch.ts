import {
  ICustomerNameMatchModel,
  TSelectCustomerNameMatch,
} from '../../interfaces/customerNameMatch.interface'
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

class CustomerNameMatch {
  private readonly table = 'customer_name_match'

  findOneCustomerNameMatch = async (
    where: WhereQuery<ICustomerNameMatchModel>,
    select: SelectFields<TSelectCustomerNameMatch> = ['*'],
    order?: SortCriteria<TSelectCustomerNameMatch>,
  ): Promise<ICustomerNameMatchModel> => {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }
  async find(
    params: KnexFindParams<ICustomerNameMatchModel, TSelectCustomerNameMatch>,
  ): Promise<ICustomerNameMatchModel[]> {
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
  insert = async (data: InsertData<ICustomerNameMatchModel>): Promise<number[]> => {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}

export const customerNameMatchmodel = new CustomerNameMatch()
