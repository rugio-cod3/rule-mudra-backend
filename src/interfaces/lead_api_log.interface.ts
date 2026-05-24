import { ApiSupplierType } from "@/enums/common.enum";
import {
  IDecentroEaadharResponse,
  ISurePassVerifyAadharResponse,
} from "./onboarding.interface";

export interface ILeadsApiLog {
  id?: number; // AI PK
  leadID?: string; // varchar(255)
  api_supplier: number; // int
  api_type?: string; // varchar(255)
  api_endpoint_url?: string; // text
  api_headers?: string; // text
  api_method?: string; // text
  api_request?: string; // longtext
  api_response?: string; // longtext
  created_at?: Date; // datetime - should be required to save during insertion
  status: number; // tinyint
  customerID?: number; // int
  mobile_no?: string; // varchar(255)
  pancard?: string; // varchar(255)
  aadharNo?: string; // varchar(255)
  code?: string; // text
  state?: string; // text
  entity_id?: string; // text
  sync_id?: string; // text
  sync_result?: string; // text
  sync_data?: string; // text
  amount?: string; // text
}

export type TSelectLeadsApiLog = keyof ILeadsApiLog;

export type AadharData =
  | {
      data: ISurePassVerifyAadharResponse["data"];
      type: ApiSupplierType.SUREPASS;
    }
  | {
      data: IDecentroEaadharResponse["data"];
      type: ApiSupplierType.DECENTRO;
    };
