export interface IAutoDisbursalChecks {
  leadID: number
  customerID: number
  mobile: number
  salaryDate: number
  emandateRequired: '1' | '0'
  emdID: number
  customerType: 'Repeate case' | 'New Case' | 'Existing Case'
  aadharNo: string
  pancard: string
}

export interface ISurePassVerifyAadharResponse {
  data: {
    client_id: string
    full_name: string
    aadhaar_number: string
    dob: string
    gender: string
    address: {
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
    face_status: boolean
    face_score: number
    zip: string
    profile_image: string
    has_image: boolean
    email_hash: string
    mobile_hash: string
    raw_xml: string
    zip_data: string
    care_of: null | string
    share_code: string
    mobile_verified: boolean
    reference_id: string
    aadhaar_pdf: string
    status: string
    uniqueness_id: string
  }
  status_code: number
  success: boolean
  message: null | string
  message_code: string
}

export interface IDecentroEaadharResponse {
  decentroTxnId: string
  status: string
  responseCode: string
  message: string
  data: {
    aadhaarReferenceNumber: string
    aadhaarUid: string
    proofOfIdentity: {
      dob: string
      hashedEmail: string
      gender: string
      hashedMobileNumber: string
      name: string
    }
    proofOfAddress: {
      careOf: string
      country: string
      district: string
      house: string
      landmark: string
      locality: string
      pincode: string
      postOffice: string
      state: string
      street: string
      subDistrict: string
      vtc: string
    }
    image: string
    pdf: string
  }
  responseKey: string
}
