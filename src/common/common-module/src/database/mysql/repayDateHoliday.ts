import {
  IRepayDateHolidayModel,
  TSelectRepayDateHoliday,
} from '../../interfaces/repayDateHoliday.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { getKnexInstance } from '../../utils/mysql'

export default class RepayDateHolidayModel {
  private table = 'repaydate_holiday'

  get RepayDateHolidayKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async findOneRepayDateHoliday(
    where: WhereQuery<IRepayDateHolidayModel>,
    select: SelectFields<TSelectRepayDateHoliday> = ['*'],
    order?: SortCriteria<TSelectRepayDateHoliday>,
  ): Promise<IRepayDateHolidayModel> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }

  async findAndCountRepayDateHoliday(where: WhereQuery<IRepayDateHolidayModel>): Promise<number> {
    let db = getKnexInstance()

    const count = await db(this.table).where(where).count()

    return count[0]['count(*)'] as number
  }

  async findOneAndUpdate(
    where: WhereQuery<IRepayDateHolidayModel>,
    update: UpdateQuery<TSelectRepayDateHoliday>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async insert(data: InsertData<IRepayDateHolidayModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}

export const repayDateHolidaymodel = new RepayDateHolidayModel()
