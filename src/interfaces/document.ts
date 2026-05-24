export interface IDocument {
  documentID: number;           // AI PK
  customerID: number;
  documentType: string;         // varchar(255)
  documentFile: string;         // varchar(255)
  password: string;             // varchar(200)
  status: 'Verified' | 'Pending' | 'Rejected'; // enum
  verifiedBy: number;
  verifiedDate: Date;           // date
  uploadBy: number;
  uploadedDate: Date;           // datetime
  type: string;                 // text
  upload_platform: 'local' | 'S3'; // enum 
}

export type TSelectDocument = keyof IDocument;
