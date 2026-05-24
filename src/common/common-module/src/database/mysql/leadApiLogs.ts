import { ApiSupplierType, LeadLogApiType } from '../../enums/leadApiLogs.enum'
import {
  AadharData,
  ILeadsApiLog,
  TSelectLeadsApiLog,
} from '../../interfaces/leadApiLogs.interface'
import { ICkycDownloadResponse } from '../../interfaces/onboarding.interface'
import { IDecentroEaadharResponse } from '../../interfaces/thirdParty/decentro.interface'
import {
  ISurePassValidatePanResponse,
  ISurePassVerifyAadharResponse,
} from '../../interfaces/thirdParty/surepass.interface'
import {
  DeleteWhere,
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class LeadApiLogModel {
  private table = 'leads_api_log'

  get LeadsApiLogKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  async findOneLeadsApiLog(
    where: WhereQuery<ILeadsApiLog>,
    select: SelectFields<TSelectLeadsApiLog> = ['*'],
    orderBy?: SortCriteria<TSelectLeadsApiLog>,
  ): Promise<ILeadsApiLog> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }

  public async getLeadApiLogs(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ILeadsApiLog[] | null> {
    try {
      let db = getKnexInstance()
      let lead_api_log = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (lead_api_log == null || lead_api_log.length == 0) {
        return []
      } else {
        return lead_api_log // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside lead_api_log.ts getLeadApiLogs function',
        error,
      )
    }
  }
  public async getLeadApiLog(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ILeadsApiLog | null> {
    try {
      let db = getKnexInstance()
      let lead_api_log = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
        .limit(1)
      if (lead_api_log == null || lead_api_log.length == 0) {
        return null
      } else {
        return lead_api_log[0] // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside lead_api_log.ts getLeadApiLog function', error)
    }
  }
  public async findOneLeadApiLog(
    where: WhereQuery<ILeadsApiLog>,
    select: SelectFields<TSelectLeadsApiLog> = ['*'],
    order?: SortCriteria<TSelectLeadsApiLog>,
  ): Promise<ILeadsApiLog> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }

  public async insert(data: InsertData<ILeadsApiLog>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOneAndUpdate(
    where: WhereQuery<ILeadsApiLog>,
    update: UpdateQuery<ILeadsApiLog>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async findBreCheck(pancard: string): Promise<ILeadsApiLog> {
    const db = getKnexInstance()
    return await db
      .table(this.table)
      .where('pancard', pancard)
      .andWhere(function () {
        this.where({ api_supplier: 6, status: 1, api_type: 'bureau_sagorate' })
          .orWhere({ api_supplier: 3, status: 1, api_type: 'consumer-cir-cv' })
          .orWhere({
            api_supplier: 4,
            status: 1,
            api_type: 'pan-comprehensive',
          })
      })
      .orderBy('id', 'desc')
      .select('created_at')
      .first()
  }

  async delete(deleteWhere: DeleteWhere<TSelectLeadsApiLog>) {
    const db = getKnexInstance()
    const query = db(this.table)

    deleteWhere.forEach((element) => {
      const { column, operator, value } = element

      if (operator) query.where(column, operator, value)
      else query.where(column, value)
    })

    return await query.delete()
  }

  async count(
    params: KnexFindParams<ILeadsApiLog, TSelectLeadsApiLog>,
  ): Promise<number> {
    const { where, whereNot } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }

  async findPanComprehensiveResponse(
    panNumber: string,
    mobileNo: string,
  ): Promise<ISurePassValidatePanResponse['data']> {
    const data = await this.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
        api_supplier: ApiSupplierType.SUREPASS,
        pancard: panNumber,
        mobile_no: String(mobileNo),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )

    if (data && data.api_response) return JSON.parse(data.api_response).data

    return null
  }

  async getUserAadharDetails(
    aadharNo: string,
    mobileNo: string,
    isSurePass: boolean,
  ): Promise<AadharData> {
    return isSurePass
      ? {
          type: ApiSupplierType.SUREPASS,
          data: await this.findAadharV2VerifyResponse(aadharNo, mobileNo),
        }
      : {
          type: ApiSupplierType.DECENTRO,
          data: await this.findDigilockerEaadharResponse(aadharNo, mobileNo),
        }
  }

  async findAadharV2VerifyResponse(
    aadharNo: string,
    mobileNo: string,
  ): Promise<ISurePassVerifyAadharResponse['data']> {
    const data = await this.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
        api_supplier: ApiSupplierType.SUREPASS,
        aadharNo,
        mobile_no: String(mobileNo),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )

    if (data && data.api_response) return JSON.parse(data.api_response).data

    return null
  }

  private async findDigilockerEaadharResponse(
    aadharNo: string,
    mobileNo: string,
  ): Promise<IDecentroEaadharResponse['data']> {
    const data = await this.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
        api_supplier: ApiSupplierType.DECENTRO,
        aadharNo,
        mobile_no: String(mobileNo),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )

    if (data && data.api_response) return JSON.parse(data.api_response).data

    return null
  }
  async findCkycDownloadResponse(
    pancard: string,
  ): Promise<ICkycDownloadResponse> {
    const data = await this.findOneLeadsApiLog(
      {
        api_supplier: ApiSupplierType.SUREPASS,
        status: 1,
        api_type: LeadLogApiType.CKYC_DOWNLOAD,
        pancard,
      },
      ['api_response'],
    )

    if (data && data.api_response) return JSON.parse(data.api_response).data

    return null
  }
  async findCkycDataForMatch(pancard: string) {
    const ckycDetails = {
      ckycDob: 'CKYC N/A',
      ckycLastDigit: 'CKYC N/A',
      ckycName: 'CKYC N/A',
      ckycImage: 'CKYC N/A',
      cykcMobile: 'CKYC N/A',
    }

    const ckycResponse = await this.findCkycDownloadResponse(pancard)

    if (ckycResponse) {
      const ckycData =
        ckycResponse.ckyc_download_data.personal_identifiable_data

      ckycDetails.ckycDob =
        ckycData?.personal_details?.dob ?? ckycDetails.ckycDob
      ckycDetails.ckycName =
        ckycData?.personal_details?.full_name ?? ckycDetails.ckycName
      ckycDetails.cykcMobile = ckycData?.personal_details?.mob_num

      if (ckycData?.identity_details?.identity) {
        for (let identity of ckycData.identity_details.identity) {
          if (identity.identity_type === 'Proof of Possession of Aadhaar') {
            ckycDetails.ckycLastDigit = identity.identity_number.slice(-4)
            break
          }
        }
      }

      if (ckycData?.image_details?.image) {
        for (let image of ckycData.image_details.image) {
          if (image.image_code === 'Photograph' && image.image_data) {
            ckycDetails.ckycImage = image.image_data
            break
          }
        }
      }
    }

    return ckycDetails
  }
}

export const leadsApiLogModel = new LeadApiLogModel()
