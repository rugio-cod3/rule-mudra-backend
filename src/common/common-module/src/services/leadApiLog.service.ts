import LeadApiLogModel from '../database/mysql/leadApiLogs'
import { ApiSupplierType, LeadLogApiType } from '../enums/leadApiLogs.enum'
import {
  ILeadsApiLog,
  TSelectLeadsApiLog,
} from '../interfaces/leadApiLogs.interface'
import {
  ICkycDownloadResponse,
  ISurePassSendAadharOtpResponse,
  ISurePassValidatePanResponse,
} from '../interfaces/onboarding.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import {
  DeleteWhere,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../types/model.types'
import { logger } from '../utils/logger'

class LeadApiLogService {
  private leadApiLogModel = new LeadApiLogModel()

  // public async findOne(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ILeadsApiLog | ICustomResponse> {
  //   try {
  //     let lead_api_log = await this.leadApiLogModel.getLeadApiLog(
  //       where,
  //       order,
  //       select,
  //     )
  //     if (lead_api_log == null) {
  //       return null
  //     } else {
  //       return lead_api_log // Return the first lead if found
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

  public async findOne(
    where: WhereQuery<ILeadsApiLog>,
    select: SelectFields<TSelectLeadsApiLog> = ['*'],
    orderBy?: SortCriteria<TSelectLeadsApiLog>,
  ): Promise<ILeadsApiLog> {
    return await this.leadApiLogModel.findOneLeadsApiLog(where, select, orderBy)
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<ILeadsApiLog[] | ICustomResponse> {
    try {
      let lead_api_log = await this.leadApiLogModel.getLeadApiLogs(
        where,
        order,
        select,
      )
      if (lead_api_log == null || lead_api_log.length == 0) {
        return null
      } else {
        return lead_api_log // Return the first lead if found
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

  public async create(data: ILeadsApiLog): Promise<number[] | ICustomResponse> {
    try {
      let res = await this.leadApiLogModel.insert(data)
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
  ): Promise<number | ICustomResponse> {
    try {
      let res = await this.leadApiLogModel.findOneAndUpdate(where, update)
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

  public async findOneLog(
    where: WhereQuery<ILeadsApiLog>,
    select: SelectFields<TSelectLeadsApiLog> = ['*'],
    orderBy?: SortCriteria<TSelectLeadsApiLog>,
  ): Promise<ILeadsApiLog> {
    return await this.leadApiLogModel.findOneLeadsApiLog(where, select, orderBy)
  }

  async findPanComprehensiveResponse(
    panNumber: string,
    mobileNo: string,
  ): Promise<ISurePassValidatePanResponse['data']> {
    const data = await this.findOneLog(
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

  async findAadharV2SendOtpResponse(
    aadharNo: string,
    mobileNo: string,
  ): Promise<ISurePassSendAadharOtpResponse['data']> {
    const data = await this.findOneLog(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_GENERATE_OTP,
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

  async delete(deleteWhere: DeleteWhere<TSelectLeadsApiLog>) {
    return await this.leadApiLogModel.delete(deleteWhere)
  }

  async findCkycDownloadResponse(
    pancard: string,
  ): Promise<ICkycDownloadResponse> {
    const data = await this.findOneLog(
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

export default LeadApiLogService
