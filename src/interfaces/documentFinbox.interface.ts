export interface IDocumentFinboxInterfaceModel {
  documentID?: number;
  customerID: number;
  leadID: number;
  entityID: string;
  type: string;
  statement_id: string;
  documentType: string;
  documentFile: string;
  verifiedBy: string;
  status: string;
  verifiedDate?: string;
  uid?: number;
  aa_check?: string;
}

export type TSelectDocumentFinbox = keyof IDocumentFinboxInterfaceModel;
