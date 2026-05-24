import EmployerModel from '@/database/mysql/employer'
import { IEmployer, TSelectEmployer } from '@/interfaces/employer.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import {
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'
import { logger } from '@/utils/logger'

class EmployerService {
  private employerModel = new EmployerModel()

  // public async findOne(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<IEmployer | ICustomResponse> {
  //   try {
  //     let employer = await this.employerModel.getEmployer(where, order, select)
  //     if (employer == null || employer.length == 0) {
  //       return null
  //     } else {
  //       return employer[0] // Return the first lead if found
  //     }
  //   } catch (error) {
  //     logger.error(error)
  //     return {
  //       success: false,
  //       message: 'Internal Server Error',
  //       statusCode: 500,
  //     } as ICustomResponse
  //   }
  // }

  async findOne(
    where: WhereQuery<IEmployer>,
    select: SelectFields<TSelectEmployer> = ['*'],
    order?: SortCriteria<TSelectEmployer>,
  ): Promise<IEmployer> {
    return await this.employerModel.findOneEmployer(where, select, order)
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IEmployer[] | ICustomResponse> {
    try {
      let employer = await this.employerModel.getEmployer(where, order, select)
      if (employer.length == 0) {
        return []
      } else {
        return employer // Return the first lead if found
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

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let employer_count = await this.employerModel.countEmployer(where)
      if (employer_count == null) {
        return 0
      } else {
        return employer_count // Return the first lead if found
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

  public async create(data: {}): Promise<boolean | ICustomResponse> {
    try {
      let res = await this.employerModel.insert(data)
      return res
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async updateOne(
    where: {},
    update: {},
    order?: { orderKey: string; orderValue: string },
  ): Promise<number | ICustomResponse> {
    try {
      let res = await this.employerModel.findOneAndUpdate(where, update, order)
      return res
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  async findAll(
    params: KnexFindParams<IEmployer, TSelectEmployer>,
  ): Promise<IEmployer[]> {
    return await this.employerModel.find(params)
  }

  async checkEmployerNameForReject(customerID: number): Promise<boolean> {
    let status = false
    let count = 0

    const employers = await this.findAll({ where: { customerID } })

    if (employers.length === 0) return status

    let employerName: string
    for (let employer of employers) {
      employerName = employer.employerName.toLowerCase()
      count = (employerName.match(/police/g) || []).length
      if (count > 0) {
        status = true
        break
      }
    }

    return status
  }
}

export default EmployerService
export const employerService = new EmployerService()
