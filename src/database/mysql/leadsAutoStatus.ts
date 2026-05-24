import { ILeadsAutoStatusModel, TSelectLeadsAutoStatus } from '@/interfaces/leadsStatus.interface'
import {
    IRepayDateHolidayModel,
    TSelectRepayDateHoliday,
  } from '@/interfaces/repayDateHoliday.interface'
  import {
    InsertData,
    SelectFields,
    SortCriteria,
    UpdateQuery,
    WhereQuery,
  } from '@/types/model.types'
  import { getKnexInstance } from '@/utils/mysql'
  
  export default class LeadsAutoStatusModel {
    private table = 'leads_auto_status'
  
    get LeadsAutoStatusKnex() {
      let db = getKnexInstance()
      return db(this.table)
    }
  
    async findOneLeadsAutoStatus(
      where: WhereQuery<ILeadsAutoStatusModel>,
      select: SelectFields<TSelectLeadsAutoStatus> = ['*'],
      order?: SortCriteria<TSelectLeadsAutoStatus>,
    ): Promise<IRepayDateHolidayModel> {
      let db = getKnexInstance()
  
      const query = db(this.table)
        .where(where)
        .select(...select)
  
      if (order) query.orderBy(order)
  
      return await query.first()
    }
  
    // async findAndCountRepayDateHoliday(
    //   where: WhereQuery<IRepayDateHolidayModel>,
    // ) : Promise<number> {
    //   let db = getKnexInstance()
  
    //   const count = await db(this.table).where(where).count()
  
    //   return count[0]['count(*)'] as number
    // }
  
    // async findOneAndUpdate(
    //   where: WhereQuery<IRepayDateHolidayModel>,
    //   update: UpdateQuery<TSelectRepayDateHoliday>,
    // ): Promise<number> {
    //   let db = getKnexInstance()
    //   return await db.table(this.table).where(where).update(update)
    // }
  
    async insert(data: InsertData<ILeadsAutoStatusModel>): Promise<number[]> {
      let db = getKnexInstance()
      return await db(this.table).insert(data)
    }
  }
  
  export const leadsAutoStatusmodel = new LeadsAutoStatusModel()
  