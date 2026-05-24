import config from "@/config/default";
import { documentModel } from "@/database/mysql/document";
import { ApiSupplierType, SurePassApiUrl } from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { BadRequestError } from "@/errors";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import {
  ISurePassAadharInititateResponse,
  ISurePassSendAadharOtp,
  ISurePassSendAadharOtpResponse,
  ISurePassVerifyAadhar,
  ISurePassVerifyAadharResponse,
} from "@/interfaces/onboarding.interface";
import { IUserMetadata } from "@/interfaces/user_metadata.interface";
import { InsertData } from "@/types/model.types";
import axios from "axios";
import moment from "moment";
import commonHelper from "../../helpers/common";
import AxiosService from "../api.service";
import LeadApiLogService from "../lead_api_log.service";
import UserMetaDataService from "../user_metadata.service";
import S3Service from "./s3.service";
const FormData = require("form-data");
const fs = require("fs");
class SurepassService {
  private leadApiLogService = new LeadApiLogService();
  private userMetaDataService = new UserMetaDataService();
  private readonly commonHelper = commonHelper;
  private baseUrl = `${config.surePassApi}/api/v1`;
  private s3Service = new S3Service();
  private headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.surePassToken}`,
    };
  }
  private newHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.surepassNewToken}`,
    };
  }
  private readonly apiService = new AxiosService(config.surePassApi);
  //UT Done
  private async apiCall(url: string, method: string, headers: {}, body: {}) {
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: headers,
        data: body,
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async generateAadharOtpSurepass(payload: ISurePassSendAadharOtp) {
    const { aadharNo, customerID, mobileNo } = payload;

    const result = await this.apiService.call<
      ISurePassSendAadharOtpResponse,
      { id_number: string },
      undefined
    >(
      "post",
      SurePassApiUrl.AADHAR_SEND_OTP,
      {
        id_number: aadharNo,
      },
      undefined,
      this.headers()
    );

    let saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.AADHAR_V2_GENERATE_OTP,
      api_supplier: ApiSupplierType.SUREPASS,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url: config.surePassApi + SurePassApiUrl.AADHAR_SEND_OTP,
      api_method: "POST",
      api_headers: JSON.stringify(this.headers()),
      api_request: JSON.stringify({
        id_number: aadharNo,
      }),
      mobile_no: String(mobileNo),
      aadharNo,
    };

    await this.leadApiLogService.create(saveObject);

    return result;
  }
  async initiateDigiLockerAadhar(
    customerID: number,
    mobileNo: string,
    callBackUrl: string,
    name: string,
    email: string
  ) {
    const reference_id = customerID.toString() + Date.now();
    const requestBody = {
      data: {
        prefill_options: {
          full_name: name,
          mobile_number: mobileNo.toString(),
          user_email: email,
        },
        expiry_minutes: 10,
        send_sms: false,
        send_email: false,
        verify_phone: false,
        verify_email: false,
        signup_flow: false,
        redirect_url: callBackUrl,
        state: reference_id,
      },
    };
    const result = await this.apiService.call<
      ISurePassAadharInititateResponse,
      {
        data: {
          prefill_options: {
            full_name: string;
            mobile_number: string;
            user_email: string;
          };
          expiry_minutes: number;
          send_sms: boolean;
          send_email: boolean;
          verify_phone: boolean;
          verify_email: boolean;
          signup_flow: boolean;
          redirect_url: string;
          state: string;
        };
      },
      undefined
    >(
      "post",
      SurePassApiUrl.AADHAR_INITIATE,
      requestBody,
      undefined,
      this.headers()
    );
    let saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.SUREPASS_INITIATE_AADHAR,
      api_supplier: ApiSupplierType.SUREPASS,
      api_response: JSON.stringify(result.data),
      status: result.success ? 1 : 0,
      api_endpoint_url: config.surePassApi + SurePassApiUrl.AADHAR_INITIATE,
      api_method: "POST",
      api_headers: JSON.stringify(this.headers()),
      api_request: JSON.stringify(requestBody),
      mobile_no: mobileNo.toString(),
      entity_id: reference_id,
    };

    await this.leadApiLogService.create(saveObject);

    return result;
  }
  async verifyAadharOtpSurepass(payload: ISurePassVerifyAadhar) {
    const { client_id, otp, customerID, mobileNo, aadharNo } = payload;

    const result = await this.apiService.call<
      ISurePassVerifyAadharResponse,
      { otp: string; client_id: string; aadhaar_pdf_generate: boolean },
      undefined
    >(
      "post",
      SurePassApiUrl.AADHAR_SUBMIT,
      {
        otp,
        client_id,
        aadhaar_pdf_generate: true,
      },
      undefined,
      this.headers()
    );

    // We will not save aadhar data here

    return result;
  }

  public async verifyAadharOtpBySurepass(
    otp: string,
    customerID: number,
    mobile: number
  ): Promise<{ succuss: boolean; message: string; code: number }> {
    try {
      let logData = await this.leadApiLogService.findOne(
        { customerID, status: 1, api_type: "aadhaar-v2-generate-otp" },
        ["api_response"],
        [{ column: "id", order: "desc" }]
      );
      const apiResponse = JSON.parse(logData.api_response);
      let response = await this.apiCall(
        `${this.baseUrl}/aadhaar-v2/submit-otp`,
        "POST",
        this.headers(),
        {
          otp,
          client_id: apiResponse?.data.client_id,
          aadhaar_pdf_generate: true,
        }
      );

      let saveObject = {
        customerID: customerID,
        api_type: "aadhaar-v2-submit-otp",
        api_supplier: 4,
        api_response: JSON.stringify(response.data),
        status: 1,
        api_endpoint_url: `${this.baseUrl}/aadhaar-v2/submit-otp`,
        api_method: "POST",
        api_headers: JSON.stringify(this.headers()),
        api_request: JSON.stringify({
          otp,
          client_id: apiResponse?.data.client_id,
        }),
      };
      await this.leadApiLogService.create(saveObject);

      if (response.status == 200) {
        let user_metadata = (await this.userMetaDataService.findOne(
          { mobile: mobile.toString() },
          { orderKey: "id", orderValue: "desc" },
          ["*"]
        )) as IUserMetadata;

        if (user_metadata && user_metadata.mobile) {
          let metaJSON = JSON.parse(user_metadata.metaJSON) || {};
          let address = response?.data?.data?.address;
          (metaJSON["aadhaar-v2-submit-otp"] = {
            aadhar_no: response?.data?.data?.aadhaar_number,
            fullName: response?.data?.data?.full_name,
            email: "",
            phone: "",
            maskAadhar: `XXXXXXXX${response?.data?.data?.aadhaar_number?.slice(
              -4
            )}`,
            gender: response?.data?.data?.gender,
            dob: response?.data?.data?.dob,
            address: `${address.country}/${address.dist}/${address.state}/${address.po}/${address.loc}/${address.vtc}/${address.subdist}/${address.street}/${address.house}/${address.landmark}`,
            address_json: address,
            aadhar_image: response?.data?.data?.profile_image,
            aadhar_pdf: response?.data?.data?.aadhaar_pdf,
          }),
            await this.userMetaDataService.updateOne(
              { mobile },
              {
                aadharVerify: response?.data?.data?.aadhaar_number,
                metaJSON: JSON.stringify(metaJSON),
                profile_image: response?.data?.data?.profile_image,
              }
            );
        } else {
          // CREATE ENTRY
          let address = response?.data?.data?.address;
          let metaJSON = {
            "aadhaar-v2-submit-otp": {
              aadhar_no: response?.data?.data?.aadhaar_number,
              fullName: response?.data?.data?.full_name,
              email: "",
              phone: "",
              maskAadhar: `XXXXXXXX${response?.data?.data?.aadhaar_number?.slice(
                -4
              )}`,
              gender: response?.data?.data?.gender,
              dob: response?.data?.data?.dob,
              address: `${address.country}/${address.dist}/${address.state}/${address.po}/${address.loc}/${address.vtc}/${address.subdist}/${address.street}/${address.house}/${address.landmark}`,
              address_json: address,
              aadhar_image: response?.data?.data?.profile_image,
              aadhar_pdf: response?.data?.data?.aadhaar_pdf,
            },
          };
          await this.userMetaDataService.create({
            customerID,
            mobile: String(mobile),
            panVerify: "",
            aadharVerify: response?.data?.data?.aadhaar_number,
            metaJSON: JSON.stringify(metaJSON),
            profile_image: response?.data?.data?.profile_image,
            aadhar_mask: "",
          });
        }
        return Promise.resolve({
          succuss: true,
          message: "Fetched Successfully",
          code: 200,
        });
      } else {
        return Promise.resolve({
          succuss: false,
          message: response?.data?.message || "Issue In Surepass",
          code: response?.data?.status_code || 400,
        });
      }
    } catch (error) {
      console.log("Error In Verifying Otp", error);
    }
  }

   public async selfieFaceMatchSurepass(
    mobile: number,
    leadID: number,
    imageName: string,
    adhar_no: string,
    s3_folder: string,
    image: Buffer,
    customerID: number
  ): Promise<any> {
    try {
      if (!mobile || !leadID || !image || !s3_folder) {
        throw new Error("Missing required parameters for face verification");
      }

      const clientRefId = `${mobile}_${leadID}`;
      const api_type = LeadLogApiType.SUREPASS_FACE_MATCH;
      const aadhaar_api_type = LeadLogApiType.SUREPASS_DIGILOCKER_EAADHAAR;

      if (image && s3_folder) {
        const imgUrl = await this.s3Service.uploadDocument(
          image,
          s3_folder,
          imageName
        );
        if (imgUrl) {
          await documentModel.insert({
            customerID,
            type: "Selfie",
            documentType: "Selfie",
            status: "Verified",
            documentFile: imgUrl.Key,
            uploadBy: customerID,
            uploadedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            verifiedBy: customerID,
            verifiedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            upload_platform: "S3",
            leadID: leadID,
          });
        }
        let aadhaar: ILeadsApiLog | null = null;

        if (adhar_no) {
          aadhaar = await this.leadApiLogService.findOne(
            {
              api_supplier: 4,
              api_type: aadhaar_api_type,
              aadharNo: String(adhar_no),
              status: 1,
            },
            ["*"],
            [{ column: "id", order: "desc" }]
          );
        }

        if (!aadhaar) {
          throw new BadRequestError("Aadhaar information not found!");
        }

        let aadhaarResponse = JSON.parse(aadhaar.api_response);
        if (!aadhaarResponse) {
          throw new BadRequestError("Aadhaar information not found");
        }
        const aadhaarImage = aadhaarResponse?.UidData?.Pht;
        if (!aadhaarImage) {
          throw new BadRequestError("Aadhaar image not found");
        }
        const idCardBuffer = Buffer.from(aadhaarImage, "base64");

        const form = new FormData();
        form.append("selfie", image, {
          filename: "selfie.jpg",
          contentType: "image/jpeg",
        });
        form.append("id_card", idCardBuffer, {
          filename: "id_card.jpg",
          contentType: "image/jpeg",
        });


        const requestData = {
          endpoint: `${config.surePassApi}/api/v1/face/face-match`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.surepassNewToken}`,
            "Content-Type": "multipart/form-data"
          },
          formData: {
            selfie: {
              filename: "selfie.jpg",
              contentType: "image/jpeg",
              size: image.length,
              data: image.toString('base64')
            },
            id_card: {
              filename: "id_card.jpg",
              contentType: "image/jpeg",
              size: idCardBuffer.length,
              data: idCardBuffer.toString('base64')
            }
          },
          metadata: {
            clientRefId,
            mobile,
            leadID,
            customerID,
            adhar_no,
            imageName,
            timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
          }
        };

        let response = await this.apiCall(
          `${config.surePassApi}/api/v1/face/face-match`,
          "POST",
          {
            Authorization: `Bearer ${config.surepassNewToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          form
        );
        const saveSurepassSelfieData: ILeadsApiLog = {
          customerID,
          api_type: api_type,
          api_supplier: ApiSupplierType.SUREPASS,
          api_endpoint_url: `${config.surePassApi}/api/v1/face/face-match`,
          api_headers: JSON.stringify({
            Authorization: `Bearer ${config.surepassNewToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          api_method: "POST",
          api_request: JSON.stringify(requestData),
          api_response: JSON.stringify(response.data),
          status: 1,
        };
        await this.leadApiLogService.create(saveSurepassSelfieData);
        return response.data;
      }
    } catch (error) {
      console.log("Error In Verify selfie", error);
    }
  }

  public async bankVerification(
    accountNumber: string,
    ifsc: string,
    leadID: string,
    customerId: string
  ): Promise<any> {
    try {
      if (!accountNumber || !ifsc) {
        throw new Error("Missing required parameters for Bank verification");
      }

      const requestBody = {
        id_number: accountNumber,
        ifsc: ifsc,
        ifsc_details: true,
      };

      let response = await this.apiCall(
        `${config.surePassApi}/api/v1/bank-verification`,
        "POST",
        this.newHeaders(),
        requestBody
      );
      const saveBankVerificationData: ILeadsApiLog = {
        customerID: Number(customerId),
        api_type: LeadLogApiType.SUREPASS_BANK_VERIFICATION,
        api_supplier: ApiSupplierType.SUREPASS,
        api_response: JSON.stringify(response.data),
        status: 1,
        api_endpoint_url: `${config.surePassApi}/api/v1/bank-verification`,
        api_method: "POST",
        api_headers: JSON.stringify(this.newHeaders()),
        api_request: JSON.stringify(requestBody),
      };
      await this.leadApiLogService.create(saveBankVerificationData);
      return response.data;
    } catch (error) {
      console.log("Error In Verify Bank", error);
    }
  }
}

export default SurepassService;
