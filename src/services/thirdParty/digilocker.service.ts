import config from "@/config/default";
import {
  ApiSupplierType,
  DecentroApiUrl,
  SurepassDigilockerApiUrl,
} from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import CommonHelper from "@/helpers/common";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import {
  IDecentroAadharInititateResponse,
  IDecentroEaadharResponse,
  ISurepassDigilockerDocumentDownloadResponse,
  ISurepassDigilockerDocumentListResponse,
  ISurepassDigilockerStatusResponse,
} from "@/interfaces/onboarding.interface";
import { InsertData } from "@/types/model.types";
import axios from "axios";
import AxiosService from "../api.service";
import LeadApiLogService from "../lead_api_log.service";
import UserMetaDataService from "../user_metadata.service";
class DigilockerService {
  private leadApiLogService = new LeadApiLogService();
  private userMetaDataService = new UserMetaDataService();
  private commonHelper = new CommonHelper();
  private url = config.decentro_api;
  private headers() {
    return {
      accept: "application/json",
      client_id: config.decentro_client_id,
      client_secret: config.decentro_client_secret,
      module_secret: config.decentro_module_secret,
      "content-type": "application/json",
    };
  }

  private surePassHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.surepassNewToken}`,
    };
  }
  private readonly apiService = new AxiosService(config.decentroBaseUrl);
  private readonly digiLockerApiService = new AxiosService(config.surePassApi);
  private async apiCall(url: string, method: string, headers: {}, body: {}) {
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: headers,
        data: body,
        maxBodyLength: Infinity,
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async initiateDigiLockerAadhar(
    customerID: number,
    mobileNo: number,
    callBackUrl: string
  ) {
    const reference_id = customerID.toString() + Date.now();
    let baseUrl = this.commonHelper.getBaseUrl();
    const requestBody = {
      reference_id,
      consent: true,
      consent_purpose: "For Bank Account Purpose Only",
      redirect_url: callBackUrl,
      redirect_to_signup: true,
    };

    const result = await this.apiService.call<
      IDecentroAadharInititateResponse,
      {
        reference_id: string;
        consent: boolean;
        consent_purpose: string;
        redirect_url: string;
        redirect_to_signup: boolean;
      },
      undefined
    >(
      "post",
      DecentroApiUrl.AADHAR_INITIATE,
      requestBody,
      undefined,
      this.headers()
    );

    let saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.DIGILOCKER_INITIATE_AADHAR,
      api_supplier: ApiSupplierType.DECENTRO,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url: config.decentroBaseUrl + DecentroApiUrl.AADHAR_INITIATE,
      api_method: "POST",
      api_headers: JSON.stringify(this.headers()),
      api_request: JSON.stringify(requestBody),
      mobile_no: mobileNo.toString(),
    };

    await this.leadApiLogService.create(saveObject);

    return result;
  }

  async generateDecentroAccessToken(
    state: string,
    code: string,
    customerID: number,
    mobile: string
  ) {
    // TODO : Check result
    const requestBody = {
      reference_id: Date.now().toString(),
      initial_decentro_transaction_id: state,
      consent: true,
      consent_purpose: "For Bank Account Purpose Only",
      digilocker_code: code,
    };

    const result = await this.apiService.call<
      IDecentroAadharInititateResponse,
      {
        reference_id: string;
        consent: boolean;
        consent_purpose: string;
        initial_decentro_transaction_id: string;
        digilocker_code: string;
      },
      undefined
    >(
      "post",
      DecentroApiUrl.GET_ACCESS_TOKEN,
      requestBody,
      undefined,
      this.headers()
    );

    const saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.DIGILOCKER_ACCESS_TOKEN,
      api_supplier: ApiSupplierType.DECENTRO,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url:
        config.decentroBaseUrl + DecentroApiUrl.GET_ACCESS_TOKEN,
      api_method: "POST",
      api_headers: JSON.stringify(this.headers()),
      api_request: JSON.stringify(requestBody),
      mobile_no: mobile.toString(),
    };

    await this.leadApiLogService.create(saveObject);

    return result;
  }

  async getEaadharData(state: string, customerID: number, mobile: string) {
    const requestBody = {
      initial_decentro_transaction_id: state,
      consent: true,
      consent_purpose: "For Bank Account Purpose Only",
      reference_id: Date.now().toString(),
      generate_xml: false,
    };

    const result = await this.apiService.call<
      IDecentroEaadharResponse,
      {
        initial_decentro_transaction_id: string;
        consent: boolean;
        consent_purpose: string;
        reference_id: string;
        generate_xml: boolean;
      },
      undefined
    >("post", DecentroApiUrl.EAADHAR, requestBody, undefined, this.headers());
    return result;
  }

  async getSurepassDigilockerStatus(
    client_id: string,
    customerID: number,
    mobile: string
  ) {
    const result = await this.digiLockerApiService.call<
      ISurepassDigilockerStatusResponse,
      {},
      undefined
    >(
      "get",
      `${SurepassDigilockerApiUrl.STATUS}/${client_id}`,
      {},
      undefined,
      this.surePassHeaders()
    );

    const saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.SUREPASS_DIGILOCKER_STATUS,
      api_supplier: ApiSupplierType.SUREPASS,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url: config.surePassApi + SurepassDigilockerApiUrl.STATUS,
      api_method: "GET",
      api_headers: JSON.stringify(this.surePassHeaders()),
      api_request: JSON.stringify(client_id),
      mobile_no: mobile.toString(),
    };

    await this.leadApiLogService.create(saveObject);
    return result;
  }

  async getSurepassDigilockerDocumentList(
    client_id: string,
    customerID: number,
    mobile: string
  ) {
    const result = await this.digiLockerApiService.call<
      ISurepassDigilockerDocumentListResponse,
      {},
      undefined
    >(
      "get",
      `${SurepassDigilockerApiUrl.LIST}/${client_id}`,
      {},
      undefined,
      this.surePassHeaders()
    );

    const saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.SUREPASS_DIGILOCKER_DOCUMENT_LIST,
      api_supplier: ApiSupplierType.SUREPASS,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url: config.surePassApi + SurepassDigilockerApiUrl.LIST,
      api_method: "GET",
      api_headers: JSON.stringify(this.surePassHeaders()),
      api_request: JSON.stringify(client_id),
      mobile_no: mobile.toString(),
    };

    await this.leadApiLogService.create(saveObject);

    return result;
  }

  async downloadSurepassDigilockerDocument(
    client_id: string,
    document_id: string,
    customerID: number,
    mobile: string
  ) {
    const result = await this.digiLockerApiService.call<
      ISurepassDigilockerDocumentDownloadResponse,
      {},
      undefined
    >(
      "get",
      `${SurepassDigilockerApiUrl.DOWNLOAD}/${client_id}/${document_id}`,
      {},
      undefined,
      this.surePassHeaders()
    );

    const saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type:
        document_id == "aadhaar"
          ? `${LeadLogApiType.SUREPASS_DIGILOCKER_DOCUMENT_DOWNLOAD}_document_id`
          : LeadLogApiType.SUREPASS_DIGILOCKER_DOCUMENT_DOWNLOAD,
      api_supplier: ApiSupplierType.SUREPASS,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url: config.surePassApi + SurepassDigilockerApiUrl.DOWNLOAD,
      api_method: "GET",
      api_headers: JSON.stringify(this.surePassHeaders()),
      api_request: JSON.stringify({ client_id, document_id }),
      mobile_no: mobile.toString(),
    };

    await this.leadApiLogService.create(saveObject);

    return result;
  }
}

export default DigilockerService;
