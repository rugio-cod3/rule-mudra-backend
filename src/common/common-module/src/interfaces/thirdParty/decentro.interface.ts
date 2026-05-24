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
