import { LeadLogApiType } from '../enums/common.enum'
import {
  IDecentroEaadharResponse,
  ISurePassValidatePanResponse,
  ISurePassVerifyAadharResponse,
} from './onboarding.interface'

export interface IUserMetadata {
  id?: number
  customerID?: number
  mobile: string
  panVerify?: string
  aadharVerify?: string
  aadhar_mask: string
  metaJSON: string
  profile_image?: string
  created_at?: Date
  updated_at?: Date
}
export interface ICreateOrUpdateUserMeta {
  customerID: number
  type: LeadLogApiType
  data:
    | ISurePassValidatePanResponse['data']
    | ISurePassVerifyAadharResponse['data']
    | IDecentroEaadharResponse['data']
  mobile: string
}

export interface IUserMetaPanJson {
  [LeadLogApiType.PAN_COMPREHENSIVE]: {
    pancard_no: string
    fullName: string
    maskAadhar: string
    gender: string
    dob: string
    address: string
  }
}

export interface IUserMetaSurePassAadhar {
  [LeadLogApiType.AADHAR_V2_SUBMIT_OTP]: {
    aadhar_no: string
    fullName: string
    maskAadhar: string
    gender: string
    dob: string
    address: string
    address_json: {
      country: string
      dist: string
      state: string
      po: string
      loc: string
      vtc: string
      subdist: string
      street: string
      house: string
      landmark: string
    }
    aadhar_image: string
    aadhar_pdf: string
  }
}
export interface IUserMetaDigilockerAadhar {
  [LeadLogApiType.DIGILOCKER_EAADHAR]: {
    aadhar_no: string
    fullName: string
    maskAadhar: string
    gender: string
    dob: string
    address: string
    address_json: {
      country: string
      dist: string
      state: string
      po: string
      loc: string
      vtc: string
      subdist: string
      street: string
      house: string
      landmark: string
    }
    aadhar_image: string
    aadhar_pdf: string
  }
}
export interface IUserMetaJson extends IUserMetaPanJson, IUserMetaSurePassAadhar {}

export type TSelectUserMetaData = keyof IUserMetadata
