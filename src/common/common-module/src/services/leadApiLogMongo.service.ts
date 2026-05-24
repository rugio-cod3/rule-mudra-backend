import {
  AadhaarKYC,
  BillPaymentReceipt,
  Cibil,
  Ckyc,
  Digilocker,
  DigiTap,
  Experian,
  FaceMatch,
  Finbox,
  GetUserScore,
  InternalApi,
  PanComprehensive,
} from '../database/mongo/LeadApiLogModel'
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
import { SelectFields, WhereQuery } from '../types/model.types'
import { logger } from '../utils/logger'

class LeadApiLogMongoDBService {
  private collections: Record<string, any> = {
    billPaymentReceipts: BillPaymentReceipt,
    finbox: Finbox,
    panComprehensive: PanComprehensive,
    faceMatch: FaceMatch,
    experian: Experian,
    aadhaarKYC: AadhaarKYC,
    cibil: Cibil,
    ckyc: Ckyc,
    digilocker: Digilocker,
    internalApi: InternalApi,
    getUserScore: GetUserScore,
    digitap: DigiTap,
  }

  private convertToCamelCase(data: ILeadsApiLog): object {
    const camelCaseObject: any = {}
    for (const key in data) {
      let camelKey: string

      if (key === 'mobile_no') {
        camelKey = 'mobile'
      } else {
        camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      }

      camelCaseObject[camelKey] = data[key]
    }
    return camelCaseObject
  }

  public async create(
    collectionName: string,
    data: ILeadsApiLog,
  ): Promise<boolean> {
    try {
      const Model = this.collections[collectionName]
      if (!Model) throw new Error(`Collection ${collectionName} not found`)

      const convertedData = this.convertToCamelCase(data)

      const newDocument = new Model(convertedData)
      await newDocument.save()

      return true
    } catch (error) {
      logger.error(`Error inserting into ${collectionName}:`, error)
      return false
    }
  }

  public async find(
    collectionName: string,
    where: {},
    select: string[],
    orderBy: { column: string; order: 'asc' | 'desc' },
  ): Promise<ILeadsApiLog | null> {
    try {
      const Model = this.collections[collectionName]
      if (!Model) throw new Error(`Collection ${collectionName} not found`)

      let queryExec = Model.find(where)

      if (select.length && select[0] !== '*') {
        queryExec = queryExec.select(...select)
      }

      if (orderBy) {
        queryExec = queryExec.sort({
          [orderBy.column]: orderBy.order === 'asc' ? 1 : -1,
        })
      }

      const result = await queryExec
      return result ?? null
    } catch (error) {
      logger.error(`Error finding document in ${collectionName}:`, error)
      return null
    }
  }

  public async findOne(
    collectionName: string,
    where: {},
    select: string[],
    orderBy: { column: string; order: 'asc' | 'desc' },
  ): Promise<ILeadsApiLog | null> {
    try {
      const Model = this.collections[collectionName]
      if (!Model) throw new Error(`Collection ${collectionName} not found`)

      let queryExec = Model.findOne(where)

      if (select.length && select[0] !== '*') {
        queryExec = queryExec.select(...select)
      }

      if (orderBy) {
        queryExec = queryExec.sort({
          [orderBy.column]: orderBy.order === 'asc' ? 1 : -1,
        })
      }

      const result = await queryExec
      return result ?? null
    } catch (error) {
      logger.error(`Error finding document in ${collectionName}:`, error)
      return null
    }
  }

  public async findOneLog(
    collectionName: string,
    where: WhereQuery<ILeadsApiLog>,
    select: SelectFields<TSelectLeadsApiLog> = ['*'],
    orderBy?: { column: string; order: 'asc' | 'desc' },
  ): Promise<ILeadsApiLog | null> {
    try {
      const Model = this.collections[collectionName]
      if (!Model) throw new Error(`Collection ${collectionName} not found`)

      // Build query
      let queryExec = Model.findOne(where)

      if (select.length && select[0] !== '*') {
        queryExec = queryExec.select(select.join(' '))
      }

      if (orderBy) {
        queryExec = queryExec.sort({
          [orderBy.column]: orderBy.order === 'asc' ? 1 : -1,
        })
      }

      const result = await queryExec

      return result
    } catch (error) {
      logger.error(`Error finding document in ${collectionName}:`, error)
      return null
    }
  }

  public async findPanComprehensiveResponse(
    panNumber: string,
    mobile: string,
  ): Promise<ISurePassValidatePanResponse['data']> {
    const data = await this.findOneLog(
      'panComprehensive',
      {
        status: 1,
        apiType: LeadLogApiType.PAN_COMPREHENSIVE,
        apiSupplier: ApiSupplierType.SUREPASS,
        pancard: panNumber,
        mobile: String(mobile),
      },
      ['apiResponse'],
      { column: '_id', order: 'desc' },
    )

    if (data && data.apiResponse) return JSON.parse(data.apiResponse)

    return null
  }

  public async findAadharV2SendOtpResponse(
    aadharNo: string,
    mobile: string,
  ): Promise<ISurePassSendAadharOtpResponse['data']> {
    const data = await this.findOneLog(
      'aadhaarKYC',
      {
        status: 1,
        apiType: LeadLogApiType.AADHAR_V2_GENERATE_OTP,
        apiSupplier: ApiSupplierType.SUREPASS,
        aadharNo,
        mobile,
      },
      ['apiResponse'],
      { column: '_id', order: 'desc' },
    )
    if (data && data.apiResponse) return JSON.parse(data.apiResponse)

    return null
  }

  public async findCkycDownloadResponse(
    pancard: string,
  ): Promise<ICkycDownloadResponse> {
    const data = await this.findOneLog(
      'aadhaarKYC',
      {
        status: 1,
        apiType: LeadLogApiType.CKYC_DOWNLOAD,
        apiSupplier: ApiSupplierType.SUREPASS,
        pancard,
      },
      ['apiResponse'],
    )
    if (data && data.apiResponse) return JSON.parse(data.apiResponse)

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

  public async updateOne(
    collectionName: string,
    where: {},
    update: ILeadsApiLog,
  ): Promise<number | null> {
    try {
      const Model = this.collections[collectionName]
      if (!Model) throw new Error(`Collection ${collectionName} not found`)

      const convertedUpdate = this.convertToCamelCase(update)
      const res = await Model.updateOne(where, convertedUpdate)

      return res.modifiedCount // Return the number of modified documents
    } catch (error) {
      logger.error(`Error updating document in ${collectionName}:`, error)
      return 0
    }
  }

  public async delete(collectionName: string, query: object): Promise<boolean> {
    try {
      const Model = this.collections[collectionName]
      if (!Model) throw new Error(`Collection ${collectionName} not found`)

      const res = await Model.deleteMany(query)
      return res.deletedCount
    } catch (error) {
      logger.error(`Error deleting documents from ${collectionName}:`, error)
      return false
    }
  }
}

export default LeadApiLogMongoDBService
