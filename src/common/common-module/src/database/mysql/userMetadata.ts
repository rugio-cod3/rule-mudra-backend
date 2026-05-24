import { LeadLogApiType } from '../../enums/common.enum'
import {
  IDecentroEaadharResponse,
  ISurePassValidatePanResponse,
  ISurePassVerifyAadharResponse,
} from '../../interfaces/onboarding.interface'
import {
  ICreateOrUpdateUserMeta,
  IUserMetadata,
  IUserMetaDigilockerAadhar,
  IUserMetaJson,
  IUserMetaPanJson,
  IUserMetaSurePassAadhar,
  TSelectUserMetaData,
} from '../../interfaces/userMetadata.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'
import { maskString } from '../../utils/util'

export default class UserMetaDataModel {
  private table = 'user_metadata'

  public async getUserMetaDatas(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IUserMetadata[] | null> {
    try {
      let db = getKnexInstance()
      let metadata = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (metadata == null || metadata.length == 0) {
        return []
      } else {
        return metadata // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside user_metadata.ts getUserMetaDatas function', error)
    }
  }

  public async getUserMetaData(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IUserMetadata | null> {
    try {
      let db = getKnexInstance()
      let metadata = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
        .limit(1)
      if (metadata == null || metadata.length == 0) {
        return null
      } else {
        return metadata[0] // Return the first lead if found
      }
    } catch (error) {
      logger.error('Error Inside user_metadata.ts getUserMetaData function', error)
    }
  }

  public async insert(data: InsertData<IUserMetadata>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  async findOneAndUpdate(
    where: WhereQuery<IUserMetadata>,
    update: UpdateQuery<IUserMetadata>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async findOneUserMetaData(
    where: WhereQuery<IUserMetadata>,
    select: SelectFields<TSelectUserMetaData> = ['*'],
    orderBy?: SortCriteria<TSelectUserMetaData>,
  ): Promise<IUserMetadata> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }

  async createOrUpdateUserMeta(payload: ICreateOrUpdateUserMeta) {
    const { customerID, type, data, mobile } = payload
    // 1. Check if userMeta exists or not
    const userMeta = await this.findOneUserMetaData({ customerID })

    // If exists then do update, else create

    if (userMeta) {
      let userMetaJson = <IUserMetaJson>JSON.parse(userMeta.metaJSON)
      const isUserMetaExists = userMetaJson ? true : false

      switch (type) {
        case LeadLogApiType.PAN_COMPREHENSIVE:
          const {
            pan_number: surePassPanNo,
            masked_aadhaar: surePassMaskedAadhar,
            gender: surePassPanGender,
            full_name: surePassPanName,
            address: { full: surePassPanAddress },
            dob: surePassPanDob,
          } = data as ISurePassValidatePanResponse['data']
          // if not exist then add

          const userMetaPanJson: IUserMetaPanJson = {
            [LeadLogApiType.PAN_COMPREHENSIVE]: {
              address: surePassPanAddress ?? '',
              dob: surePassPanDob ?? '',
              fullName: surePassPanName ?? '',
              gender: surePassPanGender ?? '',
              maskAadhar: surePassMaskedAadhar ?? '',
              pancard_no: surePassPanNo ?? '',
            },
          }

          let metaJsonUpdate = userMetaPanJson

          if (isUserMetaExists && !userMetaJson[LeadLogApiType.PAN_COMPREHENSIVE]) {
            metaJsonUpdate = { ...metaJsonUpdate, ...userMetaJson }
          } else if (isUserMetaExists && userMetaJson[LeadLogApiType.PAN_COMPREHENSIVE]) {
            break
          }
          await this.findOneAndUpdate({ customerID }, { metaJSON: JSON.stringify(metaJsonUpdate) })
          break
        case LeadLogApiType.AADHAR_V2_SUBMIT_OTP:
          const {
            aadhaar_number: surePassAadharNo,
            full_name: surePassAadharFullName,
            gender: surePassAadharGender,
            dob: surePassAadharDob,
            address: surePassAadharAddress,
            aadhaar_pdf: surePassAadharPdfLink,
            profile_image: surePassAadharImage,
          } = data as ISurePassVerifyAadharResponse['data']

          const userMetaSurepassAadharJson: IUserMetaSurePassAadhar = {
            [LeadLogApiType.AADHAR_V2_SUBMIT_OTP]: {
              // Check JSON
              gender: surePassAadharGender ?? '',
              fullName: surePassAadharFullName ?? '',
              aadhar_no: surePassAadharNo,
              aadhar_image: surePassAadharImage ?? '',
              aadhar_pdf: surePassAadharPdfLink ?? '',
              dob: surePassAadharDob,
              maskAadhar: maskString(surePassAadharNo, 8),
              address_json: {
                country: surePassAadharAddress.country ?? '',
                dist: surePassAadharAddress.dist ?? '',
                house: surePassAadharAddress.house ?? '',
                landmark: surePassAadharAddress.landmark ?? '',
                loc: surePassAadharAddress.loc ?? '',
                po: surePassAadharAddress.po ?? '',
                state: surePassAadharAddress.state ?? '',
                street: surePassAadharAddress.street ?? '',
                subdist: surePassAadharAddress.subdist ?? '',
                vtc: surePassAadharAddress.vtc ?? '',
              },
              address: `${surePassAadharAddress.country ?? ''}/${
                surePassAadharAddress.country ?? ''
              }/${surePassAadharAddress.dist ?? ''}/${surePassAadharAddress.state ?? ''}/${
                surePassAadharAddress.po ?? ''
              }/${surePassAadharAddress.loc ?? ''}/${surePassAadharAddress.vtc ?? ''}/${
                surePassAadharAddress.subdist ?? ''
              }/${surePassAadharAddress.street ?? ''}/${surePassAadharAddress.house ?? ''}/${
                surePassAadharAddress.landmark ?? ''
              }`,
            },
          }

          let metaJsonUpdateAadhar = userMetaSurepassAadharJson

          if (isUserMetaExists && !userMetaJson[LeadLogApiType.AADHAR_V2_SUBMIT_OTP]) {
            metaJsonUpdateAadhar = {
              ...metaJsonUpdateAadhar,
              ...userMetaJson,
            }
          } else if (isUserMetaExists && userMetaJson[LeadLogApiType.AADHAR_V2_SUBMIT_OTP]) {
            break
          }
          await this.findOneAndUpdate(
            { customerID },
            { metaJSON: JSON.stringify(metaJsonUpdateAadhar) },
          )
          break
        case LeadLogApiType.DIGILOCKER_EAADHAR:
          const {
            aadhaarUid: digiAadharNo,
            proofOfIdentity: { name: digiAadharName, dob: digiAadharDob, gender: digiAadharGender },
            proofOfAddress: {
              country,
              district,
              state,
              postOffice,
              locality,
              vtc,
              subDistrict,
              street,
              house,
              landmark,
            },
            image,
            pdf,
          } = data as IDecentroEaadharResponse['data']

          const userMetaDigiAadharJson: IUserMetaDigilockerAadhar = {
            [LeadLogApiType.DIGILOCKER_EAADHAR]: {
              // Check JSON
              gender: digiAadharGender ?? '',
              fullName: digiAadharName ?? '',
              aadhar_no: digiAadharNo,
              aadhar_image: image ?? '',
              aadhar_pdf: pdf ?? '',
              dob: digiAadharDob,
              maskAadhar: digiAadharNo,
              address_json: {
                country: country ?? '',
                dist: district ?? '',
                house: house ?? '',
                landmark: landmark ?? '',
                loc: locality ?? '',
                po: postOffice ?? '',
                state: state ?? '',
                street: street ?? '',
                subdist: subDistrict ?? '',
                vtc: vtc ?? '',
              },
              address: `${country ?? ''}/${district ?? ''}/${state ?? ''}/${postOffice ?? ''}/${
                locality ?? ''
              }/${vtc ?? ''}/${subDistrict ?? ''}/${street ?? ''}/${house ?? ''}/${landmark ?? ''}`,
            },
          }

          let metaJsonUpdateAadharDigi = userMetaDigiAadharJson

          if (isUserMetaExists && !userMetaJson[LeadLogApiType.DIGILOCKER_EAADHAR]) {
            metaJsonUpdateAadharDigi = {
              ...metaJsonUpdateAadharDigi,
              ...userMetaJson,
            }
          } else if (isUserMetaExists && userMetaJson[LeadLogApiType.DIGILOCKER_EAADHAR]) {
            break
          }
          await this.findOneAndUpdate(
            { customerID },
            { metaJSON: JSON.stringify(metaJsonUpdateAadharDigi) },
          )
          break
      }
    } else {
      // Else createData
      switch (type) {
        case LeadLogApiType.PAN_COMPREHENSIVE:
          const {
            pan_number: surePassPanNo,
            masked_aadhaar: surePassMaskedAadhar,
            gender: surePassPanGender,
            full_name: surePassPanName,
            address: { full: surePassPanAddress },
            dob: surePassPanDob,
          } = data as ISurePassValidatePanResponse['data']
          // if not exist then add

          const userMetaPanJson: IUserMetaPanJson = {
            [LeadLogApiType.PAN_COMPREHENSIVE]: {
              address: surePassPanAddress ?? '',
              dob: surePassPanDob ?? '',
              fullName: surePassPanName ?? '',
              gender: surePassPanGender ?? '',
              maskAadhar: surePassMaskedAadhar ?? '',
              pancard_no: surePassPanNo ?? '',
            },
          }

          await this.insert({
            customerID,
            metaJSON: JSON.stringify(userMetaPanJson),
            panVerify: surePassPanNo,
            aadhar_mask: surePassMaskedAadhar,
            mobile,
          })
          break
        case LeadLogApiType.AADHAR_V2_SUBMIT_OTP:
          const {
            aadhaar_number: surePassAadharNo,
            full_name: surePassAadharFullName,
            gender: surePassAadharGender,
            dob: surePassAadharDob,
            address: surePassAadharAddress,
            aadhaar_pdf: surePassAadharPdfLink,
            profile_image: surePassAadharImage,
          } = data as ISurePassVerifyAadharResponse['data']

          const userMetaSurepassAadharJson: IUserMetaSurePassAadhar = {
            [LeadLogApiType.AADHAR_V2_SUBMIT_OTP]: {
              // Check JSON
              gender: surePassAadharGender ?? '',
              fullName: surePassAadharFullName ?? '',
              aadhar_no: surePassAadharNo,
              aadhar_image: surePassAadharImage ?? '',
              aadhar_pdf: surePassAadharPdfLink ?? '',
              dob: surePassAadharDob,
              maskAadhar: maskString(surePassAadharNo, 8),
              address_json: {
                country: surePassAadharAddress.country ?? '',
                dist: surePassAadharAddress.dist ?? '',
                house: surePassAadharAddress.house ?? '',
                landmark: surePassAadharAddress.landmark ?? '',
                loc: surePassAadharAddress.loc ?? '',
                po: surePassAadharAddress.po ?? '',
                state: surePassAadharAddress.state ?? '',
                street: surePassAadharAddress.street ?? '',
                subdist: surePassAadharAddress.subdist ?? '',
                vtc: surePassAadharAddress.vtc ?? '',
              },
              address: `${surePassAadharAddress.country ?? ''}/${
                surePassAadharAddress.country ?? ''
              }/${surePassAadharAddress.dist ?? ''}/${surePassAadharAddress.state ?? ''}/${
                surePassAadharAddress.po ?? ''
              }/${surePassAadharAddress.loc ?? ''}/${surePassAadharAddress.vtc ?? ''}/${
                surePassAadharAddress.subdist ?? ''
              }/${surePassAadharAddress.street ?? ''}/${surePassAadharAddress.house ?? ''}/${
                surePassAadharAddress.landmark ?? ''
              }`,
            },
          }

          await this.insert({
            customerID,
            mobile,
            metaJSON: JSON.stringify(userMetaSurepassAadharJson),
            profile_image: surePassAadharImage ?? '',
            aadharVerify: surePassAadharNo,
            aadhar_mask: userMetaSurepassAadharJson['aadhaar-v2-submit-otp'].maskAadhar,
          })

          break
        case LeadLogApiType.DIGILOCKER_EAADHAR:
          const {
            aadhaarUid: digiAadharNo,
            proofOfIdentity: { name: digiAadharName, dob: digiAadharDob, gender: digiAadharGender },
            proofOfAddress: {
              country,
              district,
              state,
              postOffice,
              locality,
              vtc,
              subDistrict,
              street,
              house,
              landmark,
            },
            image,
            pdf,
          } = data as IDecentroEaadharResponse['data']

          const userMetaDigiAadharJson: IUserMetaDigilockerAadhar = {
            [LeadLogApiType.DIGILOCKER_EAADHAR]: {
              // Check JSON
              gender: digiAadharGender ?? '',
              fullName: digiAadharName ?? '',
              aadhar_no: digiAadharNo,
              aadhar_image: image ?? '',
              aadhar_pdf: pdf ?? '',
              dob: digiAadharDob,
              maskAadhar: digiAadharNo,
              address_json: {
                country: country ?? '',
                dist: district ?? '',
                house: house ?? '',
                landmark: landmark ?? '',
                loc: locality ?? '',
                po: postOffice ?? '',
                state: state ?? '',
                street: street ?? '',
                subdist: subDistrict ?? '',
                vtc: vtc ?? '',
              },
              address: `${country ?? ''}/${district ?? ''}/${state ?? ''}/${postOffice ?? ''}/${
                locality ?? ''
              }/${vtc ?? ''}/${subDistrict ?? ''}/${street ?? ''}/${house ?? ''}/${landmark ?? ''}`,
            },
          }

          await this.insert({
            customerID,
            metaJSON: JSON.stringify(userMetaDigiAadharJson),
            profile_image: image ?? '',
            aadharVerify: digiAadharNo,
            aadhar_mask: digiAadharNo,
            mobile,
          })
          break
      }
    }
  }
}
export const userMetaDataModel = new UserMetaDataModel()

