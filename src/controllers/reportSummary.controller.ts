import { CustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'
import { getKnexInstance as knex } from '@/utils/mysql'
import { Request } from 'express'

const reportSummary = async (req: Request | any, res: CustomResponse) => {
  try {
    const {
      query: { provider,customerId },
    } = req
    const reportSummary = await knex()
      .select()
      .from('user_summary')
      .where({ status: 1, api_type: 'report',customerID:customerId })
      .orderBy('id', 'desc');

    if (reportSummary.length)
      return res.success({ data: reportSummary[0].json_value[provider] })
    else res.success({ data: [], msg: 'No data found' })
  } catch (error) {
    logger.error(error.stack)
    return res.failure({})
  }
}
const scoreHistory = async (req: Request | any, res: CustomResponse) => {
  try {
    const {
      query: { provider,customerId },
    } = req
    const reportSummary = await knex()
      .select()
      .from('user_summary')
      .where({ status: 1, api_type: 'scoreHistory',customerID:customerId })
      .orderBy('id', 'desc');

    if (reportSummary.length)
      return res.success({ data: reportSummary[0].json_value[provider] })
    else res.success({ data: [], msg: 'No data found' })
  } catch (error) {
    logger.error(error.stack)
    return res.failure({})
  }
}

export const ReportController = {
  reportSummary,
  scoreHistory
}
