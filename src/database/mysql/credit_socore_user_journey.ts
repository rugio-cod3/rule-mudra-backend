import {
  ICreditScoreUserJourney,
  TSelectCreditScoreUserJourney,
} from '@/interfaces/credit_socore_user_journey.interface'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class CreditScoreUserJourneyModel {
  private table = 'credit_score_user_journey'

  // ! New Code
  async findOneCreditScoreUserJourney(
    where: Partial<ICreditScoreUserJourney>,
    select: TSelectCreditScoreUserJourney[] | ['*'] = ['*'],
  ): Promise<ICreditScoreUserJourney> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .first()
  }

  public async getCreditScoreUserJourney(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ICreditScoreUserJourney[] | null> {
    try {
      let db = getKnexInstance()
      let creditScoreUserJourney = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (
        creditScoreUserJourney == null ||
        creditScoreUserJourney.length == 0
      ) {
        return null
      } else {
        return creditScoreUserJourney // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside credit_socore_user_journey.ts getCreditScoreUserJourney function',
        error,
      )
    }
  }
  public async getCreditScoreUserJourneyByFilter(
    where: Partial<ICreditScoreUserJourney>,
    order: { orderKey: TSelectCreditScoreUserJourney; orderValue: string },
    select: TSelectCreditScoreUserJourney[] | ['*'] = ['*'],
    page: number,
    perPage: number,
  ): Promise<ICreditScoreUserJourney[]> {
    try {
      const db = getKnexInstance()
      let query = db.table(this.table)
      for (let key in where) {
        if (where[key]) {
          query.where(key, where[key])
        }
      }
      query.select(...select)
      query.orderBy(order.orderKey, order.orderValue)

      // Apply limit and offset for pagination
      query.limit(perPage).offset(page)
      let journeyDocs = await query

      return journeyDocs
    } catch (error) {
      logger.error(
        'Error Inside credit_socore_user_journey.ts getCreditScoreUserJourneyByFilter function',
        error,
      )
    }
  }
  public async countCreditScoreUserJourney(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let creditScoreUserJourney = await db(this.table).where(where).count()
      let count = creditScoreUserJourney[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside credit_socore_user_journey.ts countRazorpaySubscription function',
        error,
      )
    }
  }
  public async insert(
    step: number,
    customerID: number,
  ): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let [insertedID] = await db(this.table)
        .insert({ step, attempt: 1, customerID })
        .returning('id')
      return insertedID
    } catch (error) {
      logger.error(
        'Error Inside credit_socore_user_journey.ts insert function',
        error,
      )
    }
  }
  // ! Refactored
  async findOneAndUpdate(
    where: Partial<ICreditScoreUserJourney>,
    update: Partial<ICreditScoreUserJourney>,
  ): Promise<number> {
    const db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }
}
