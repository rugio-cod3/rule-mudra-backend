import { model, Schema } from 'mongoose'

const commonFields = {
  lalID: { type: Number },
  leadId: { type: Number },
  apiSupplier: { type: Number },
  apiType: { type: String },
  apiEndpointUrl: { type: String },
  apiHeaders: { type: String },
  apiMethod: { type: String },
  apiRequest: { type: String },
  apiResponse: { type: String },
  status: { type: Number },
  customerID: { type: Number },
  mobile: { type: Number },
  iuDate: { type: Date },
}

const createModel = <T extends Document>(
  name: string,
  collection: string,
  extraFields: object,
) => {
  const schema = new Schema(
    { ...commonFields, ...extraFields },
    { timestamps: true },
  )
  return model<T>(name, schema, collection)
}

export const BillPaymentReceipt = createModel(
  'BillPaymentReceipt',
  'billPaymentReceipts',
  {
    amount: { type: Number },
  },
)
export const Finbox = createModel('Finbox', 'finbox', {
  entityID: { type: String },
})
export const PanComprehensive = createModel(
  'PanComprehensive',
  'panComprehensive',
  {
    pancard: { type: String },
  },
)
export const FaceMatch = createModel('FaceMatch', 'faceMatch', {})
export const Experian = createModel('Experian', 'experian', {
  pancard: { type: String },
})
export const AadhaarKYC = createModel('AadhaarKYC', 'aadhaarKYC', {
  aadhaarNo: { type: String },
  aadhaarClientId: { type: String },
})
export const Cibil = createModel('Cibil', 'cibil', {})
export const Ckyc = createModel('Ckyc', 'ckyc', { pancard: { type: String } })
export const Digilocker = createModel('Digilocker', 'digilocker', {
  code: { type: String },
  state: { type: String },
})

export const InternalApi = createModel('InternalApi', 'internalApi', {
  pancard: { type: String },
  amount: { type: String },
})
export const GetUserScore = createModel('GetUserScore', 'getUserScore', {
  syncId: { type: String },
  syncResult: { type: String },
  syncData: { type: String },
})

export const DigiTap = createModel('DigiTap', 'digitap', {})
