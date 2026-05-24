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
