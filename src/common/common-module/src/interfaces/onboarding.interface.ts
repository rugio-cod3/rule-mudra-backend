export interface IPanFetchPayload {
  panNumber: string
  customerID: number
  mobileNo: number
  customerPanCardNo: string
  pan_cust_verified?: number
}
export interface ISurePassValidatePan {
  panNumber: string
  customerId: number
  mobileNo: number
}

export interface ISurePassValidatePanResponse {
  data: {
    client_id: string
    pan_number: string
    full_name: string
    full_name_split: [string, string, string]
    masked_aadhaar: string
    address: {
      line_1: string
      line_2: string
      street_name: string
      zip: string
      city: string
      state: string
      country: string
      full: string
    }
    email: string
    phone_number: string
    gender: string
    dob: string
    input_dob: string | null
    aadhaar_linked: boolean
    dob_verified: boolean
    dob_check: boolean
    category: string
    less_info: boolean
  }
  status_code: number
  success: boolean
  message: string | null
  message_code: string
}
export interface ISurePassSendAadharOtpPayload {
  aadharNo: string
  customerID: number
  mobileNo: number
  customerAadharNo: string
  dob_digit_match?: string
}
export interface IVerifyAadharOtpSurePassPayload {
  otp: string
  customerID: number
  mobileNo: number
  customerAadharNo: string
  aadharNo: string
  dob_digit_match?: string
}
export interface ISurePassSendAadharOtpResponse {
  data: {
    client_id: string
    otp_sent: boolean
    if_number: boolean
    valid_aadhaar: boolean
    status: string
  }
  status_code: number
  message_code: string
  message: string
  success: boolean
}
export interface ISurePassSendAadharOtp {
  aadharNo: string
  customerID: number
  mobileNo: number
}
//   export interface ISurePassVerifyAadhar {
//   panNumber: string
//   customerID: number
//   mobileNo: number
//   customerPanCardNo: string
//   pan_cust_verified?: number
// }
export interface ISurePassValidatePan {
  panNumber: string
  customerId: number
  mobileNo: number
}

export interface ISurePassValidatePanResponse {
  data: {
    client_id: string
    pan_number: string
    full_name: string
    full_name_split: [string, string, string]
    masked_aadhaar: string
    address: {
      line_1: string
      line_2: string
      street_name: string
      zip: string
      city: string
      state: string
      country: string
      full: string
    }
    email: string
    phone_number: string
    gender: string
    dob: string
    input_dob: string | null
    aadhaar_linked: boolean
    dob_verified: boolean
    dob_check: boolean
    category: string
    less_info: boolean
  }
  status_code: number
  success: boolean
  message: string | null
  message_code: string
}
export interface ISurePassSendAadharOtpPayload {
  aadharNo: string
  customerID: number
  mobileNo: number
  customerAadharNo: string
  dob_digit_match?: string
}
export interface IVerifyAadharOtpSurePassPayload {
  otp: string
  customerID: number
  mobileNo: number
  customerAadharNo: string
  aadharNo: string
  dob_digit_match?: string
}
export interface ISurePassSendAadharOtpResponse {
  data: {
    client_id: string
    otp_sent: boolean
    if_number: boolean
    valid_aadhaar: boolean
    status: string
  }
  status_code: number
  message_code: string
  message: string
  success: boolean
}
export interface ISurePassSendAadharOtp {
  aadharNo: string
  customerID: number
  mobileNo: number
}
export interface ISurePassVerifyAadhar {
  client_id: string
  otp: string
  customerID: number
  mobileNo: number
  aadharNo: string
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

export interface IDecentroAadharInititateResponse {
  decentroTxnId: string
  status: string
  responseCode: string
  message: string
  data: {
    authorizationUrl: string
  }
  responseKey: string
}

export interface IAadharVerificationWebhookDigiLocker {
  state: string
  code: string
  customerID: number
  mobile: string
}
//console.log("hi")

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
export interface IAadharVerificationInitiateDigiLockerPayload {
  customerID: number
  mobile: number
  customerAadharNo: string
  callBackUrl: string
  dob_digit_match: string
}
export interface ISurepassCkycSearchRequest {
  id_number: string // this is PAN number
}

export interface ISurepassCkycSearchResponse {
  client_id: string // this is PAN number
}

export interface ISurepassCkycDownloadRequest {
  client_id: string
  dob: string
}

export interface ICkycDownloadResponse {
  client_id: string
  ckyc_search_client_id: string
  id_number: string
  dob: string
  ckyc_download_data: {
    personal_identifiable_data: {
      personal_details: {
        constituiton_type: string
        account_type: string
        ckyc_no: string
        prefix: string
        first_name: string
        last_name: string
        full_name: string
        father_or_spouse: string
        father_prefix: string
        father_fname: string
        father_lname: string
        father_fullname: string
        mother_prefix: string
        mother_fname: string
        mother_lname: string
        mother_fullname: string
        gender: string
        dob: string
        pan: string
        perm_line1: string
        perm_line2: string
        perm_line3: string
        perm_city: string
        perm_dist: string
        perm_state: string
        perm_country: string
        perm_pin: string
        perm_poa: string
        perm_corres_sameflag: string
        corres_line1: string
        corres_line2: string
        corres_line3: string
        corres_city: string
        corres_dist: string
        corres_state: string
        corres_country: string
        corres_pin: string
        resi_std_code: string
        resi_tel_num: string
        off_std_code: string
        off_tel_num: string
        mob_num: string
        email: string
        dec_date: string
        dec_place: string
        kyc_date: string
        doc_sub: string
        kyc_name: string
        kyc_designation: string
        kyc_branch: string
        kyc_empcode: string
        num_identity: string
        num_related: string
        num_images: string
      }
      image_details: {
        image: {
          sequence_no: string
          image_type: string
          image_code: string
          global_flag: string
          branch_code: string
          image_data: string
        }[]
      }
      identity_details: {
        identity: {
          sequence_no: string
          identity_type: string
          identity_number: string
          id_verification_status: string
        }[]
      }
    }
  }
  status_code: number
  success: boolean
  message: string
  message_code: string
}
export interface ICkycFetchPayload {
  pancard: string
  mobileNo: number
  customerID: number
  dob: string
}
export interface IFinboxCreateUrlPayload {
  mobileNo: string
  callBackUrl?: string
  leadID: number
  customerID: number
}
export interface IFinboxBankConnectPayload {
  mobileNo: string
  entityId: string
  leadID: number
  customerID: number
  aadharNo: string
  pancard: string
  step: string
  email: string
}

export interface INewApiCheckCustomer {
  checkLeadType: string
  checkCurrentStatus: string
  checkDPD: number
  checkLastCloseLoan: number
  checkDisbursedLoan: number
  checkPartPaymentLoan: number
  isRamfinCustomer: 'Yes' | 'No'
  isRejected: string
  isRejectedApply: 0 | 1
  is_DPDApply: 0 | 1
  loanAmount: number
}

export interface INewApiCheckCustomerBody {
  pancard: string
}
