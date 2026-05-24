import {
  IBureauDataModel,
  TSelectBureauData,
} from '../../interfaces/bureauData.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

class BureauDataModel {
  private table = 'bureauData'

  async insert(data: InsertData<IBureauDataModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneBureauData(
    where: WhereQuery<IBureauDataModel>,
    select: SelectFields<TSelectBureauData> = ['*'],
    order?: SortCriteria<TSelectBureauData>,
  ): Promise<IBureauDataModel> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }
  async countBureauData(
    where?: WhereQuery<IBureauDataModel>,
    whereNot?: WhereQuery<IBureauDataModel>,
  ) {
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }

  async countLongTermEligibleLoans(): Promise<number> {
    const db = getKnexInstance()
    return await db(this.table)
      .where('long_term_emi_eligible', '1')
      .whereNotNull('long_term_loan_amount')
      .whereNotNull('long_term_tenure')
      .count({ count: '*' })
      .then((result) => Number(result[0].count))
  }
}

export const bureauDatamodel = new BureauDataModel()
