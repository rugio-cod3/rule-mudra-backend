// loan_modifications.ts

import { ILoanModification, TSelectLoanModification } from '../../interfaces/lona_modifications.interface'
import { InsertData, KnexFindParams, SortCriteria, WhereQuery } from '../../types/model.types'
import { getKnexInstance } from '@/utils/mysql'

class LoanModificationModel {
  private table = 'loan_modifications'

  get LoanKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async create(data: InsertData<ILoanModification>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
}

export default LoanModificationModel
