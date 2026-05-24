import CreditScoreUserJourneyModel from '@/database/mysql/credit_socore_user_journey'
import {
  ICreditScoreUserJourney,
  TSelectCreditScoreUserJourney,
} from '@/interfaces/credit_socore_user_journey.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class CreditScoreUserJourneyService {
  private creditScoreUserJourneyModel = new CreditScoreUserJourneyModel()

  // ! Refactored
  public async findOne(
    where: Partial<ICreditScoreUserJourney>,
    select: TSelectCreditScoreUserJourney[] | ['*'] = ['*'],
  ): Promise<ICreditScoreUserJourney> {
    return await this.creditScoreUserJourneyModel.findOneCreditScoreUserJourney(
      where,
      select,
    )
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ICreditScoreUserJourney[] | ICustomResponse> {
    try {
      let journey =
        await this.creditScoreUserJourneyModel.getCreditScoreUserJourney(
          where,
          order,
          select,
        )
      if (journey == null || journey.length == 0) {
        return null
      } else {
        return journey // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }
  public async findByFilter(
    where: Partial<ICreditScoreUserJourney>,
    order: { orderKey: TSelectCreditScoreUserJourney; orderValue: string },
    select: TSelectCreditScoreUserJourney[] | ['*'] = ['*'],
    page: number,
    perPage: number,
  ): Promise<ICreditScoreUserJourney[]> {
    return await this.creditScoreUserJourneyModel.getCreditScoreUserJourneyByFilter(
      where,
      order,
      select,
      page,
      perPage,
    )
  }
  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let journey_count =
        await this.creditScoreUserJourneyModel.countCreditScoreUserJourney(
          where,
        )
      if (journey_count == null) {
        return 0
      } else {
        return journey_count // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async create(
    step: number,
    customerID: number,
  ): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.creditScoreUserJourneyModel.insert(
        step,
        customerID,
      )
      return insertId
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  // ! Refactored
  async updateOne(
    where: Partial<ICreditScoreUserJourney>,
    update: Partial<ICreditScoreUserJourney>,
  ): Promise<number> {
    return await this.creditScoreUserJourneyModel.findOneAndUpdate(
      where,
      update,
    )
  }
}

export default CreditScoreUserJourneyService
