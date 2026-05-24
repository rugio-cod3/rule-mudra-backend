export enum ReferenceRelation {
  MOTHER = 'Mother',
  FATHER = 'Father',
  BROTHER = 'Brother',
  SISTER = 'Sister',
  SPOUSE = 'Spouse',
  RELATIVE = 'Relative',
  FRIEND = 'Friend',
}

export interface IReferenceModel {
  referenceID?: number
  customerID: number
  relation: ReferenceRelation
  name: string
  address: string
  city: string
  state: string
  pincode: number
  contactNo: number
  createdBy?: number
  createdDate?: Date
  name_contact?: string
  reference_verify?: number
  is_verified?: number
  recording?: string
  upload_platform?: UploadPlatform
}

export type TSelectReference = keyof IReferenceModel

export enum UploadPlatform {
  LOCAL = 'local',
  S3 = 'S3',
}
