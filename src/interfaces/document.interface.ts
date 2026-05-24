export interface IDocument {
  documentID: number          // int, auto-increment, primary key
  customerID: number          // int, not nullable
  documentType: string        // varchar, not nullable
  documentFile: string        // varchar, not nullable
  password?: string           // varchar, nullable
  status: 'Verified' | 'Pending' | 'Rejected' // enum, default 'Pending', not nullable
  verifiedBy: number          // int, default 1, not nullable
  verifiedDate?: Date         // date, nullable
  uploadBy?: number           // int, nullable
  uploadedDate: Date          // datetime, default CURRENT_TIMESTAMP, not nullable
  type?: string               // text, nullable
  upload_platform: 'local' | 'S3' // enum, default 'local', not nullable
  iu_date?: Date              // timestamp, auto-updated, nullable
}


export type TSelectDocument = keyof IDocument
