import config from "@/config/default";
import { documentModel } from "@/database/mysql/document";
import { ApiSupplierType } from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import { BadRequestError } from "@/errors";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import { InsertData } from "@/types/model.types";
import { logger } from "@/utils/logger";
import axios from "axios";
import moment from "moment";
import LeadApiLogService from "../lead_api_log.service";
import S3Service from "./s3.service";
const FormData = require("form-data");

class DigitapNewService {
  private leadApiLogService = new LeadApiLogService();
  private s3Service = new S3Service();
  private baseUrl = config.digitapSelfieBaseUrl;
  private prodUrl = config.digitapProdUrl;

  private getAuthHeaders() {
    return {
      authorization: `Basic ${Buffer.from(
        `${config.digitapClientId}:${config.digitapClientSecret}`,
      ).toString("base64")}`,
      "content-type": "application/json",
    };
  }

  private getApiUrl() {
    return this.prodUrl;
  }

  private async apiCall(url: string, method: string, formData: any) {
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          ...this.getAuthHeaders(),
          ...formData.getHeaders(),
        },
        data: formData,
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  public async selfieLivenessCheck(
    mobile: number,
    leadID: number,
    imageName: string,
    image: Buffer,
    customerID: number,
  ): Promise<any> {
    const startTime = Date.now();
    logger.info("🚀 Starting Digitap selfie liveness check", {
      mobile,
      leadID,
      imageName,
      customerID,
      imageSize: image?.length,
      baseUrl: this.baseUrl,
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    try {
      if (!mobile || !leadID || !image) {
        logger.error("❌ Missing required parameters for liveness check", {
          mobile: !!mobile,
          leadID: !!leadID,
          image: !!image,
          imageLength: image?.length,
        });
        throw new Error("Missing required parameters for liveness check");
      }

      if (
        !this.baseUrl ||
        !config.digitapClientId ||
        !config.digitapClientSecret
      ) {
        logger.error("❌ Missing Digitap configuration", {
          baseUrl: !!this.baseUrl,
          clientId: !!config.digitapClientId,
          clientSecret: !!config.digitapClientSecret,
        });
        throw new Error("Digitap configuration not found");
      }

      const clientRefId = `liveness_${mobile}_${leadID}`;
      const api_type = "DIGITAP_FACE_LIVENESS";

      logger.info("📋 Generated client reference ID for liveness", {
        clientRefId,
        api_type,
      });

      const form = new FormData();
      form.append("person", image, {
        filename: "selfie.jpg",
        contentType: "image/jpeg",
      });
      form.append("clientRefId", clientRefId);

      const requestData = {
        endpoint: `${this.baseUrl}/fmfl/v3/face-liveness`,
        method: "POST",
        headers: {
          authorization: this.getAuthHeaders().authorization,
          "Content-Type": "multipart/form-data",
        },
        formData: {
          person: {
            filename: "selfie.jpg",
            contentType: "image/jpeg",
            size: image.length,
          },
          clientRefId: clientRefId,
        },
        metadata: {
          clientRefId,
          mobile,
          leadID,
          customerID,
          imageName,
          timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      };

      const apiUrl = `${this.baseUrl}/fmfl/v3/face-liveness`;
      logger.info("🌐 Making liveness API call to Digitap", {
        url: apiUrl,
        method: "POST",
        clientRefId,
      });

      let response;
      try {
        response = await this.apiCall(apiUrl, "POST", form);
        logger.info("📡 Digitap liveness API call completed", {
          status: response?.status,
          hasData: !!response?.data,
          responseKeys: response?.data ? Object.keys(response.data) : null,
        });
      } catch (apiError) {
        logger.error("❌ Digitap liveness API call failed", {
          error: apiError.message,
          url: apiUrl,
          errorCode: apiError.code,
          errorResponse: apiError.response?.data,
        });
        throw apiError;
      }

      const saveDigitapLivenessData: InsertData<ILeadsApiLog> = {
        customerID,
        api_type: api_type,
        api_supplier: ApiSupplierType.DIGITAP,
        api_endpoint_url: apiUrl,
        api_headers: JSON.stringify(this.getAuthHeaders()),
        api_method: "POST",
        api_request: JSON.stringify(requestData),
        api_response: JSON.stringify(response.data),
        status: response.status === 200 ? 1 : 0,
        mobile_no: String(mobile),
        leadID: String(leadID),
      };

      await this.leadApiLogService.create(saveDigitapLivenessData);

      if (
        response.status === 200 &&
        response.data &&
        response.data.status === "success"
      ) {
        const result = response.data.result;
        return {
          data: {
            is_live: result.is_live,
            liveness_confidence: result.liveness_confidence,
            person_image_correctly_identified:
              result.person_image_correctly_identified,
            multiple_face_detected: result.multiple_face_detected,
            eye_closed: result.eye_closed,
            is_person_image_blurry: result.is_person_image_blurry,
            has_mask: result.has_mask,
            mask_confidence: result.mask_confidence,
            is_face_aligned: result.is_face_aligned,
            is_low_light_image: result.is_low_light_image,
            is_face_occluded: result.is_face_occluded,
            occlusion_confidence: result.occlusion_confidence,
          },
          apimsg: response.data,
        };
      } else {
        return {
          data: {
            is_live: false,
            liveness_confidence: 0,
          },
          apimsg: response.data,
        };
      }
    } catch (error) {
      logger.error("❌ Error in selfie liveness check", {
        error: error.message,
        mobile,
        leadID,
        customerID,
      });
      throw error;
    }
  }

  private async jsonApiCall(url: string, method: string, data: any) {
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: this.getAuthHeaders(),
        data: data,
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  public async selfieFaceMatchDigitap(
    mobile: number,
    leadID: number,
    imageName: string,
    adhar_no: string,
    s3_folder: string,
    image: Buffer,
    customerID: number,
  ): Promise<any> {
    const startTime = Date.now();
    logger.info("🚀 Starting Digitap selfie face match", {
      mobile,
      leadID,
      imageName,
      adhar_no: adhar_no ? "***provided***" : "not_provided",
      s3_folder,
      customerID,
      imageSize: image?.length,
      baseUrl: this.baseUrl,
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    try {
      if (!mobile || !leadID || !image || !s3_folder) {
        logger.error("❌ Missing required parameters", {
          mobile: !!mobile,
          leadID: !!leadID,
          image: !!image,
          s3_folder: !!s3_folder,
          imageLength: image?.length,
        });
        throw new Error("Missing required parameters for face verification");
      }

      if (
        !this.baseUrl ||
        !config.digitapClientId ||
        !config.digitapClientSecret
      ) {
        logger.error("❌ Missing Digitap configuration", {
          baseUrl: !!this.baseUrl,
          clientId: !!config.digitapClientId,
          clientSecret: !!config.digitapClientSecret,
        });
        throw new Error("Digitap configuration not found");
      }

      const clientRefId = `${mobile}_${leadID}`;
      const api_type = LeadLogApiType.DIGITAP_FACE_MATCH;

      logger.info("📋 Generated client reference ID", {
        clientRefId,
        api_type,
      });

      if (image && s3_folder) {
        const imgUrl = await this.s3Service.uploadDocument(
          image,
          s3_folder,
          imageName,
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
          logger.info("🔍 Searching Aadhaar by number (SurePass)", {
            api_supplier: 4,
            api_type: "aadhaar-v2-submit-otp",
          });

          aadhaar = await this.leadApiLogService.findOne(
            {
              api_supplier: 4,
              api_type: "aadhaar-v2-submit-otp",
              aadharNo: String(adhar_no),
              status: 1,
            },
            ["*"],
            [{ column: "id", order: "desc" }],
          );
        }

        if (!aadhaar) {
          aadhaar = await this.leadApiLogService.findOne(
            {
              api_supplier: 8,
              api_type: LeadLogApiType.DIGITAP_GET_DIGILOCKER_DETAILS,
              mobile_no: String(mobile),
              status: 1,
            },
            ["*"],
            [{ column: "id", order: "desc" }],
          );
        }

        if (!aadhaar) {
          logger.error("❌ Aadhaar data not found in database", {
            searchedBy: adhar_no ? "aadhaar_number" : "mobile",
            adhar_no: adhar_no ? "***provided***" : "not_provided",
            mobile,
          });
          throw new BadRequestError("Aadhaar information not found!");
        }

        let aadhaarResponse;
        try {
          aadhaarResponse = JSON.parse(aadhaar.api_response);
        } catch (parseError) {
          logger.error("❌ Failed to parse Aadhaar response", {
            error: parseError.message,
            responseLength: aadhaar.api_response?.length,
          });
          throw new BadRequestError("Invalid Aadhaar response format");
        }

        if (!aadhaarResponse) {
          logger.error("❌ Aadhaar response is empty after parsing");
          throw new BadRequestError("Aadhaar information not found");
        }

        // const aadhaarImage = aadhaarResponse?.UidData?.Pht;
        const aadhaarImage = aadhaarResponse?.model?.image;
        console.log(
          "==============================================>aadhaarResponse",
          aadhaarResponse,
        );
        if (!aadhaarImage) {
          logger.error("❌ Aadhaar image not found in response", {
            source: adhar_no ? "surepass" : "digilocker",
            responseKeys: Object.keys(aadhaarResponse),
            dataKeys: aadhaarResponse?.data
              ? Object.keys(aadhaarResponse.data)
              : null,
            uidDataKeys: aadhaarResponse?.UidData
              ? Object.keys(aadhaarResponse.UidData)
              : null,
          });
          throw new BadRequestError("Aadhaar image not found");
        }

        const form = new FormData();

        form.append("person", image, {
          filename: "selfie.jpg",
          contentType: "image/jpeg",
        });

        let cardBuffer: Buffer;
        try {
          if (aadhaarImage.startsWith("data:")) {
            logger.info("🔄 Converting data URL to buffer");
            const base64Data = aadhaarImage.split(",")[1];
            cardBuffer = Buffer.from(base64Data, "base64");
          } else {
            logger.info("🔄 Converting base64 to buffer");
            cardBuffer = Buffer.from(aadhaarImage, "base64");
          }
        } catch (conversionError) {
          logger.error("❌ Failed to convert Aadhaar image to buffer", {
            error: conversionError.message,
            imageStart: aadhaarImage.substring(0, 50),
          });
          throw new BadRequestError("Failed to process Aadhaar image");
        }

        form.append("card", cardBuffer, {
          filename: "aadhaar.jpg",
          contentType: "image/jpeg",
        });

        form.append("clientRefId", clientRefId);

        const requestData = {
          endpoint: `${this.baseUrl}/fmfl/v2/face-match`,
          method: "POST",
          headers: {
            Authorization: this.getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
          formData: {
            person: {
              filename: "selfie.jpg",
              contentType: "image/jpeg",
              size: image.length,
              data: image.toString("base64"),
            },
            card: {
              filename: "aadhaar.jpg",
              contentType: "image/jpeg",
              size: cardBuffer.length,
              data: cardBuffer.toString("base64"),
            },
            clientRefId: clientRefId,
          },
          metadata: {
            clientRefId,
            mobile,
            leadID,
            customerID,
            adhar_no,
            imageName,
            timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        };

        const apiUrl = `${this.baseUrl}/fmfl/v2/face-match`;
        logger.info("🌐 Making API call to Digitap", {
          url: apiUrl,
          baseUrl: this.baseUrl,
          method: "POST",
          hasAuth: !!config.digitapClientId,
          clientRefId,
        });

        let response;
        try {
          response = await this.apiCall(apiUrl, "POST", form);

          logger.info("📡 Digitap API call completed", {
            status: response?.status,
            hasData: !!response?.data,
            responseKeys: response?.data ? Object.keys(response.data) : null,
          });
        } catch (apiError) {
          logger.error("❌ Digitap API call failed", {
            error: apiError.message,
            url: apiUrl,
            errorCode: apiError.code,
            errorResponse: apiError.response?.data,
          });
          throw apiError;
        }

        const saveDigitapSelfieData: InsertData<ILeadsApiLog> = {
          customerID,
          api_type: api_type,
          api_supplier: ApiSupplierType.DIGITAP,
          api_endpoint_url: `${this.baseUrl}/fmfl/v2/face-match`,
          api_headers: JSON.stringify(this.getAuthHeaders()),
          api_method: "POST",
          api_request: JSON.stringify(requestData),
          api_response: JSON.stringify(response.data),
          status: response.status === 200 ? 1 : 0,
          mobile_no: String(mobile),
          leadID: String(leadID),
        };

        await this.leadApiLogService.create(saveDigitapSelfieData);

        if (
          response.status === 200 &&
          response.data &&
          response.data.status === "success"
        ) {
          const result = response.data.result;
          return {
            data: {
              match_status: result.is_same_face,
              confidence: result.same_face_confidence * 100,
              is_same_face: result.is_same_face,
              is_person_image_blurry: result.is_person_image_blurry,
              is_card_image_blurry: result.is_card_image_blurry,
              same_face_confidence: result.same_face_confidence,
              person_image_correctly_identified:
                result.person_image_correctly_identified,
              card_image_correctly_identified:
                result.card_image_correctly_identified,
            },
            apimsg: response.data,
          };
        } else {
          return {
            data: {
              match_status: false,
              confidence: 0,
            },
            apimsg: response.data,
          };
        }
      }
    } catch (error) {
      console.log("Error In Verify selfie with Digitap", error);
      throw error;
    }
  }

  public async bankVerification(
    accountNumber: string,
    ifsc: string,
    leadID: string,
    customerId: string,
    mobileNo?: string,
    beneficiaryName?: string,
    address?: string,
  ): Promise<any> {
    const startTime = Date.now();
    logger.info("🚀 Starting Digitap penny drop verification", {
      accountNumber: accountNumber ? "***provided***" : "not_provided",
      ifsc,
      leadID,
      customerId,
      beneficiaryName: beneficiaryName ? "***provided***" : "not_provided",
      address: address ? "***provided***" : "not_provided",
      baseUrl: this.getApiUrl(),
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    try {
      if (!accountNumber || !ifsc) {
        logger.error("❌ Missing required parameters", {
          accountNumber: !!accountNumber,
          ifsc: !!ifsc,
        });
        throw new Error("Missing required parameters for Bank verification");
      }

      if (
        !this.getApiUrl() ||
        !config.digitapClientId ||
        !config.digitapClientSecret
      ) {
        logger.error("❌ Missing Digitap configuration", {
          baseUrl: !!this.getApiUrl(),
          clientId: !!config.digitapClientId,
          clientSecret: !!config.digitapClientSecret,
        });
        throw new Error("Digitap configuration not found");
      }

      const clientRefNum = `${customerId}_${leadID}_${Date.now()}`;
      const api_type = LeadLogApiType.DIGITAP_PENNY_DROP;

      logger.info("📋 Generated client reference number", {
        clientRefNum,
        api_type,
      });

      const requestBody = {
        ifsc: ifsc,
        accNo: accountNumber,
        benificiaryName: beneficiaryName || "",
        address: address || "",
        clientRefNum: clientRefNum,
      };
      console.log("=====================>requestBody", requestBody);
      const apiUrl = `${this.getApiUrl()}/penny-drop/v2/check-valid`;

      logger.info("🌐 Making API call to Digitap penny drop", {
        url: apiUrl,
        method: "POST",
        hasAuth: !!config.digitapClientId,
        clientRefNum,
        ifsc,
      });

      let response;
      try {
        response = await this.jsonApiCall(apiUrl, "POST", requestBody);

        logger.info("📡 Digitap penny drop API call completed", {
          status: response?.status,
          hasData: !!response?.data,
          responseKeys: response?.data ? Object.keys(response.data) : null,
        });
      } catch (apiError) {
        logger.error("❌ Digitap penny drop API call failed", {
          error: apiError.message,
          url: apiUrl,
          errorCode: apiError.code,
          errorResponse: apiError.response?.data,
        });
        throw apiError;
      }

      const saveDigitapPennyDropData: InsertData<ILeadsApiLog> = {
        customerID: Number(customerId),
        api_type: api_type,
        api_supplier: ApiSupplierType.DIGITAP,
        api_endpoint_url: apiUrl,
        api_headers: JSON.stringify(this.getAuthHeaders()),
        api_method: "POST",
        api_request: JSON.stringify(requestBody),
        api_response: JSON.stringify(response.data),
        status: response.status === 200 ? 1 : 0,
        mobile_no: mobileNo || "0", // Use provided mobile number or default
        leadID: String(leadID),
      };

      await this.leadApiLogService.create(saveDigitapPennyDropData);

      const endTime = Date.now();
      logger.info("✅ Digitap penny drop verification completed", {
        duration: `${endTime - startTime}ms`,
        status: response?.status,
        clientRefNum,
      });

      // Handle PENDING status - need to call check-status API
      if (
        response.status === 200 &&
        response.data?.model?.status === "PENDING"
      ) {
        logger.info(
          "⏳ Penny drop status is PENDING, will need to check status",
          {
            transactionId: response.data.model.transactionId,
            clientRefNum: response.data.model.clientRefNum,
          },
        );
      }

      return {
        success: response.status === 200,
        status_code: response.status,
        data: response.data?.model || response.data,
        raw_response: response.data,
      };
    } catch (error) {
      logger.error("❌ Error in Digitap penny drop verification", {
        error: error.message,
        stack: error.stack,
        customerId,
        leadID,
        ifsc,
      });
      throw error;
    }
  }

  public async checkPennyDropStatus(
    transactionId: string,
    customerId: string,
    leadID: string,
  ): Promise<any> {
    logger.info("🔍 Checking Digitap penny drop status", {
      transactionId,
      customerId,
      leadID,
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    try {
      if (!transactionId) {
        throw new Error("Transaction ID is required for status check");
      }

      const apiUrl = `${this.getApiUrl()}/penny-drop/v2/check-status?transactionId=${transactionId}`;

      logger.info("🌐 Making status check API call", {
        url: apiUrl,
        method: "GET",
        transactionId,
      });

      const response = await axios({
        method: "GET",
        url: apiUrl,
        headers: this.getAuthHeaders(),
      });

      const saveStatusCheckData: InsertData<ILeadsApiLog> = {
        customerID: Number(customerId),
        api_type: "digitap_penny_drop_status_check",
        api_supplier: ApiSupplierType.DIGITAP,
        api_endpoint_url: apiUrl,
        api_headers: JSON.stringify(this.getAuthHeaders()),
        api_method: "GET",
        api_request: JSON.stringify({ transactionId }),
        api_response: JSON.stringify(response.data),
        status: response.status === 200 ? 1 : 0,
        leadID: String(leadID),
      };

      await this.leadApiLogService.create(saveStatusCheckData);

      logger.info("✅ Penny drop status check completed", {
        status: response?.status,
        transactionId,
        resultStatus: response.data?.model?.status,
      });

      return {
        success: response.status === 200,
        status_code: response.status,
        data: response.data?.model || response.data,
        raw_response: response.data,
      };
    } catch (error) {
      logger.error("❌ Error in penny drop status check", {
        error: error.message,
        transactionId,
        customerId,
        leadID,
      });
      throw error;
    }
  }

  public async verifyPanDigitap(payload: {
    panNumber: string;
    customerId: number;
    mobileNo: number;
  }): Promise<any> {
    const { panNumber, customerId, mobileNo } = payload;

    try {
      if (!panNumber || !customerId || !mobileNo) {
        throw new Error("Missing required parameters for PAN verification");
      }

      if (!config.digitapClientId || !config.digitapClientSecret) {
        throw new Error("Digitap configuration not found");
      }

      const clientRefNum = `${customerId}_${mobileNo}_${Date.now()}`;
      const requestPayload = {
        client_ref_num: clientRefNum,
        pan: panNumber,
      };

      // const apiUrl = "https://svc.digitap.ai/validation/kyc/v1/pan_details";
      const apiUrl = `${config.digitap_pan_url}/validation/kyc/v1/pan_details`;
      console.log(
        "----",
        `${config.digitapClientId}:${config.digitapClientSecret}`,
      );
      const response = await axios({
        method: "POST",
        url: apiUrl,
        headers: this.getAuthHeaders(),
        data: requestPayload,
      });

      const saveDigitapPanData: InsertData<ILeadsApiLog> = {
        customerID: customerId,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
        api_supplier: ApiSupplierType.DIGITAP,
        api_endpoint_url: apiUrl,
        api_headers: JSON.stringify(this.getAuthHeaders()),
        api_method: "POST",
        api_request: JSON.stringify(requestPayload),
        api_response: JSON.stringify(response.data),
        status:
          response.status === 200 && response.data?.result_code === 101 ? 1 : 0,
        mobile_no: String(mobileNo),
        pancard: panNumber,
      };

      await this.leadApiLogService.create(saveDigitapPanData);

      if (response.status === 200 && response.data?.result_code === 101) {
        const result = response.data.result;

        // Convert DD/MM/YYYY to YYYY-MM-DD for consistency
        const convertDateFormat = (dateStr: string): string => {
          if (!dateStr) return "";
          try {
            const parts = dateStr.split("/");
            if (parts.length === 3) {
              const day = parts[0].padStart(2, "0");
              const month = parts[1].padStart(2, "0");
              const year = parts[2];
              return `${year}-${month}-${day}`;
            }
            return dateStr;
          } catch (error) {
            return dateStr;
          }
        };

        const transformedData = {
          pan_number: result.pan,
          full_name: result.fullname,
          full_name_split: [
            result.first_name || "",
            result.middle_name || "",
            result.last_name || "",
          ],
          gender:
            result.gender === "male"
              ? "M"
              : result.gender === "female"
              ? "F"
              : result.gender,
          dob: convertDateFormat(result.dob),
          aadhaar_linked: result.aadhaar_linked,
          masked_aadhaar: result.aadhaar_number,
          pan_type: result.pan_type,
          address: result.address,
          mobile: result.mobile,
          email: result.email,
        };

        return {
          success: true,
          data: {
            data: transformedData,
          },
          statusCode: 200,
          message: "PAN verification successful",
        };
      } else {
        const errorMessage =
          response.data?.message || "PAN verification failed";
        return {
          success: false,
          data: response.data,
          statusCode: response.data?.http_response_code || 400,
          message: errorMessage,
        };
      }
    } catch (error) {
      const saveErrorData: InsertData<ILeadsApiLog> = {
        customerID: customerId,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
        api_supplier: ApiSupplierType.DIGITAP,
        api_endpoint_url:
          "https://svc.digitap.ai/validation/kyc/v1/pan_details",
        api_headers: JSON.stringify(this.getAuthHeaders()),
        api_method: "POST",
        api_request: JSON.stringify({
          client_ref_num: `${customerId}_${mobileNo}_${Date.now()}`,
          pan: panNumber,
        }),
        api_response: JSON.stringify(error.response?.data || error.message),
        status: 0,
        mobile_no: String(mobileNo),
        pancard: panNumber,
      };

      await this.leadApiLogService.create(saveErrorData);

      return {
        success: false,
        data: error.response?.data || { message: error.message },
        statusCode: error.response?.status || 500,
        message: error.message,
      };
    }
  }

  public async initiateDigitapDigiLockerAadhar(
    customerID: number,
    mobileNo: string,
    callBackUrl: string,
    name: string,
    email: string,
  ): Promise<any> {
    const uid = customerID.toString() + Date.now();

    const nameParts = name?.trim()?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const requestBody = {
      serviceId: 4,
      uid,
      firstName,
      lastName,
      mobile: mobileNo.toString(),
      emailId: email,
      isSendOtp: false,
      isHideExplanationScreen: true,
      redirectionUrl: callBackUrl,
      expiry: "600000",
      // failOnDocNotFound: true,
      // webhookUrl: config.digitapWebhookUrl,
      webhookUrl: "https://your-api.com/api/digilocker/webhook",
    };
    const apiUrl = `${config.digitapProdUrl}/ent/v1/kyc/generate-url`;
    const result = await axios({
      method: "POST",
      url: apiUrl,
      headers: this.getAuthHeaders(),
      data: requestBody,
    });

    const saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.DIGITAP_INITIATE_DIGILOCKER,
      api_supplier: ApiSupplierType.DIGITAP,
      api_response: JSON.stringify(result.data),
      status: result.status === 200 && result.data?.result_code === 101 ? 1 : 0,
      api_endpoint_url: config.digitapProdUrl + "/ent/v1/kyc/generate-url",
      api_method: "POST",
      api_headers: JSON.stringify(this.getAuthHeaders()),
      api_request: JSON.stringify(requestBody),
      mobile_no: mobileNo.toString(),
      entity_id: uid,
    };

    await this.leadApiLogService.create(saveObject);
    console.log("_-----------------INITIATE DIGILOCKER RESPONSE", result.data);
    return {
      success: result.data.code === "200",
      data: {
        ...result.data,
        url: result.data?.model?.url,
        transactionId: result.data?.model?.transactionId,
        kycUrl: result.data?.model?.kycUrl,
        uid,
      },
    };
  }

  async getDigitapDigiLockerDetails(
    customerID: number,
    transactionId: string,
    mobileNo?: string,
  ) {
    const requestBody = {
      transactionId,
    };

    // const result = await this.apiService.call<
    //   any,
    //   typeof requestBody,
    //   undefined
    // >(
    //   "post",
    //   DigitapApiUrl.GET_DIGILOCKER_DETAILS,
    //   requestBody,
    //   undefined,
    //   this.digitapHeaders(),
    // );
    const apiUrl = `${config.digitapProdUrl}/ent/v1/kyc/get-digilocker-details`;
    const result = await axios({
      method: "POST",
      url: apiUrl,
      headers: this.getAuthHeaders(),
      data: requestBody,
    });

    const saveObject: InsertData<ILeadsApiLog> = {
      customerID,
      api_type: LeadLogApiType.DIGITAP_GET_DIGILOCKER_DETAILS,
      api_supplier: ApiSupplierType.DIGITAP,
      api_response: JSON.stringify(result.data),
      status: result.data?.code === "200" ? 1 : 0,
      api_endpoint_url:
        config.digitapProdUrl + "/ent/v1/kyc/get-digilocker-details",
      api_method: "POST",
      api_headers: JSON.stringify(this.getAuthHeaders()),
      api_request: JSON.stringify(requestBody),
      mobile_no: mobileNo?.toString() || "",
      entity_id: transactionId,
    };

    await this.leadApiLogService.create(saveObject);

    return {
      success: result.data?.code === "200",
      data: result.data,
    };
  }
}

export default DigitapNewService;
