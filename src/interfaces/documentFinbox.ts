export interface IDocumentFinbox {
    documentID: number;
    customerID: number;
    leadID: number;
    entityID: string;
    type: string;
    statement_id: string;
    documentType: string;
    documentFile: string;
    verifiedBy: string;
    status: string;
    verifiedDate: Date;
    uid: number;
    aa_check: string;
  }

  export type TSelectDocumentFinbox = keyof IDocumentFinbox
