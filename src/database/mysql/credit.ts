import { ICredit, TSelectCredit } from '@/interfaces/credit.interface'
import { SelectFields, SortCriteria, UpdateQuery, WhereQuery } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export type responseType = {}
export default class CreditModel {
  private table = 'credits'

  // ! Remove this
  public async getCreditDataByQuery(where: {}): Promise<ICredit> {
    try {
      let db = getKnexInstance()
      let credit = await db.table(this.table).where(where).select('*')
      return credit[0]
    } catch (error) {
      logger.error(error)
    }
  }

  public async getCreditData(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ICredit[] | null> {
    try {
      let db = getKnexInstance()
      let credit = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (credit == null || credit.length == 0) {
        return null
      } else {
        return credit // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside credit.ts getCreditData function', error)
    }
  }

  async findOneCredit(
    where: WhereQuery<ICredit>,
    select: SelectFields<TSelectCredit> = ['*'],
    order?: SortCriteria<TSelectCredit>,
  ): Promise<ICredit> {
    let db = getKnexInstance()
    const query = db(this.table)
      .where(where)
      .select(...select)

    if (order) query.orderBy(order)

    return await query.first()
  }
  // ! Remove this
  public async getSingleCreditData(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ICredit | null> {
    try {
      let db = getKnexInstance()
      let credit = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
        .first()
      if (credit == null || credit?.length == 0) {
        return null
      } else {
        return credit // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside credit.ts getSingleCreditData function', error)
    }
  }

  public async insertCreditData(
    customerID: number,
    leadID: number,
    productID: number,
    foir: number,
    aqb: number,
    branch: string,
    roi: number,
    tenure: number,
    intrest: number,
    paidAmount: number,
    repaymentAmount: number,
    totalEmis: number,
    emiLeft: number,
    processingFee: number,
    principal: number,
    amountToBeRepayed: number,
  ): Promise<ICredit> {
    try {
      let db = getKnexInstance()
      let credits: ICredit = await db(this.table).insert({
        customerID,
        leadID,
        productID,
        foir,
        aqb,
        branch,
        roi,
        tenure,
        intrest,
        paidAmount,
        repaymentAmount,
        totalEmis,
        emiLeft,
        processingFee,
        status: 'initiated',
        principal,
        amountToBeRepayed,
      })
      let credit: ICredit[] = await db(this.table)
        .where('creditID', credits[0])
        .select('*')
      if (credit) {
        return Promise.resolve(credit[0])
      } else {
        return null
      }
    } catch (error) {
      logger.error(error)
    }
  }

  public async insert(
    customerID: number,
    leadID: number,
    productID: number,
    branch: string,
    foir: number,
    aqb: number,
    roi: number,
    tenure: number,
    interest: number,
    repaymentAmount: number,
    totalEMIs: number,
    emiLeft: number,
    processingFee: number,
    paidAmount: number,
    penaltyEmis: number,
    status: string,
    principal: number,
    amountToBeRepayed: number,
    firstDueDate: Date,
    gst : number
  ): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table)
        .insert({
          customerID,
          leadID,
          productID,
          foir,
          aqb,
          branch,
          roi,
          tenure,
          interest,
          repaymentAmount,
          totalEMIs,
          emiLeft,
          processingFee,
          paidAmount,
          paneltyEmis: penaltyEmis,
          status,
          principal,
          amountToBeRepayed,
          firstDueDate,
          gst
        })
        .returning('id')
      return insertedID
    } catch (error) {
      logger.error('Error Inside credit.ts insert function', error)
    }
  }

  async findOneAndUpdate(
    where: WhereQuery<ICredit>,
    update: UpdateQuery<ICredit>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }
}

export const creditModel = new CreditModel()