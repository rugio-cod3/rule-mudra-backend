import LeadApiLogModel from "@/database/mysql/lead_api_log";
import { ApiSupplierType } from "@/enums/common.enum";
import { LeadLogApiType } from "@/enums/leadLog.enum";
import {
  AadharData,
  ILeadsApiLog,
  TSelectLeadsApiLog,
} from "@/interfaces/lead_api_log.interface";
import {
  IDecentroEaadharResponse,
  ISurePassSendAadharOtpResponse,
  ISurePassValidatePanResponse,
  ISurePassVerifyAadharResponse,
} from "@/interfaces/onboarding.interface";
import { ICustomResponse } from "@/interfaces/response.interface";
import {
  DeleteWhere,
  InsertData,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from "@/types/model.types";
import { logger } from "@/utils/logger";

class LeadApiLogService {
  private leadApiLogModel = new LeadApiLogModel();

  // public async findOne(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ILeadsApiLog | ICustomResponse> {
  //   try {
  //     let lead_api_log = await this.leadApiLogModel.getLeadApiLog(
  //       where,
  //       order,
  //       select,
  //     )
  //     if (lead_api_log == null) {
  //       return null
  //     } else {
  //       return lead_api_log // Return the first lead if found
  //     }
  //   } catch (error) {
  //     logger.error(error)
  //     return {
  //       success: false,
  //       message: 'Internal Server Error',
  //       statusCode: 500,
  //     } as ICustomResponse
  //   }
  // }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[]
  ): Promise<ILeadsApiLog[] | ICustomResponse> {
    try {
      let lead_api_log = await this.leadApiLogModel.getLeadApiLogs(
        where,
        order,
        select
      );
      if (lead_api_log == null || lead_api_log.length == 0) {
        return null;
      } else {
        return lead_api_log; // Return the first lead if found
      }
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: "Internal Server Error",
        statusCode: 500,
      } as ICustomResponse;
    }
  }

  async create(data: InsertData<ILeadsApiLog>): Promise<number[]> {
    return await this.leadApiLogModel.insert(data);
  }

  public async updateOne(
    where: WhereQuery<ILeadsApiLog>,
    update: UpdateQuery<ILeadsApiLog>
  ): Promise<number> {
    return await this.leadApiLogModel.findOneAndUpdate(where, update);
  }
  public async findOne(
    where: WhereQuery<ILeadsApiLog>,
    select: SelectFields<TSelectLeadsApiLog> = ["*"],
    orderBy?: SortCriteria<TSelectLeadsApiLog>
  ): Promise<ILeadsApiLog> {
    return await this.leadApiLogModel.findOneLeadsApiLog(
      where,
      select,
      orderBy
    );
  }

  async checkCustomerPanStatus(pancard: string): Promise<boolean> {
    const result = await this.findOne(
      { pancard, api_supplier: 4, status: 1, api_type: "pan-comprehensive" },
      ["api_response", "created_at"],
      [
        {
          column: "id",
          order: "desc",
        },
      ]
    );
    return result !== null;
  }

  async checkCustomerAadharStatus(aadharNo: string): Promise<boolean> {
    const result = await this.findOne(
      {
        aadharNo: String(aadharNo),
        api_supplier: 4,
        status: 1,
        api_type: "aadhaar-v2-submit-otp",
      },
      ["api_response", "mobile_no"],
      [
        {
          column: "id",
          order: "desc",
        },
      ]
    );
    return result !== null;
  }
  async checkCustomerDigilockerStatus(mobile_no: string): Promise<boolean> {
    const result = await this.findOne(
      {
        mobile_no,
        api_supplier: 4,
        status: 1,
        api_type: "digilocker_eaadhaar",
      },
      ["api_response"],
      [
        {
          column: "id",
          order: "desc",
        },
      ]
    );
    if (result === null) {
      return false;
    }

    const apiResponse = JSON.parse(result.api_response);

    return apiResponse.data && apiResponse.data.aadhaarUid ? true : false;
  }

  async checkSelfieMatch(mobile: string): Promise<boolean> {
    const checkSelfieStatus = await this.findOne(
      {
        mobile_no: mobile,
        api_supplier: 5,
        status: 1,
        api_type: "face-match",
      },
      ["api_response", "created_at"],
      [
        {
          column: "id",
          order: "desc",
        },
      ]
    );
    if (checkSelfieStatus !== null) {
      const jsonSelfie = JSON.parse(checkSelfieStatus.api_response);

      if (jsonSelfie.status === "success" && jsonSelfie.statusCode === "200") {
        if (jsonSelfie.result.person_image_correctly_identified === true) {
          return true;
        }
      }
    }

    return false;
  }

  async checkBre(pancard: string, utmSource: string): Promise<boolean> {
    const checkBre = await this.leadApiLogModel.findBreCheck(pancard);

    if (checkBre !== null) {
      const currentDate = new Date();
      const createdAtDate = new Date(checkBre.created_at);
      const dateDiff = Math.ceil(
        (currentDate.getTime() - createdAtDate.getTime()) /
        (1000 * 60 * 60 * 24)
      );

      if (dateDiff <= 90) {
        if (utmSource === global.newapp_utmSource) {
          return true;
        }
      }
    }

    return false;
  }

  async checkOfferAmount(pancard: string, mobile: string): Promise<number> {
    const offerAmount = 0;

    const offer = await this.findOne(
      {
        pancard: pancard,
        mobile_no: mobile,
        status: 1,
        api_type: "bureau_sagorate",
      },
      ["api_response", "created_at"],
      [
        {
          column: "id",
          order: "desc",
        },
      ]
    );

    if (offer !== null) {
      const currentDate = new Date();
      const createdAtDate = new Date(offer.created_at);
      const dateDiff = Math.abs(
        currentDate.getTime() - createdAtDate.getTime()
      );
      const diffDays = Math.ceil(dateDiff / (1000 * 3600 * 24));

      if (diffDays <= 90) {
        if (offer.api_response) {
          const offerAmt = JSON.parse(offer.api_response);
          if (offerAmt.amount_offered >= 1000) {
            return offerAmt.amount_offered;
          }
        }
      }
    }

    return offerAmount;
  }

  async findPanComprehensiveResponse(
    panNumber: string,
    mobileNo: string
  ): Promise<ISurePassValidatePanResponse["data"]> {
    const data = await this.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
        api_supplier: ApiSupplierType.SUREPASS,
        pancard: panNumber,
        mobile_no: String(mobileNo),
      },
      ["api_response"],
      [{ column: "id", order: "desc" }]
    );

    if (data && data.api_response) return JSON.parse(data.api_response).data;

    return null;
  }

  async findPanComprehensiveResponseDigitap(
    panNumber: string,
    mobileNo: string
  ): Promise<any> {
    const data = await this.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
        api_supplier: ApiSupplierType.DIGITAP,
        pancard: panNumber,
        mobile_no: String(mobileNo),
      },
      ["api_response"],
      [{ column: "id", order: "desc" }]
    );

    if (data && data.api_response) {
      const response = JSON.parse(data.api_response);
      const digitapResult = response.result;

      if (digitapResult) {
        // Transform Digitap format to expected format
        const transformedData = {
          pan_number: digitapResult.pan,
          full_name: digitapResult.fullname,
          full_name_split: [
            digitapResult.first_name || "",
            digitapResult.middle_name || "",
            digitapResult.last_name || ""
          ],
          gender: digitapResult.gender === "male" ? "M" : digitapResult.gender === "female" ? "F" : digitapResult.gender,
          dob: this.convertDateFormat(digitapResult.dob), // Convert DD/MM/YYYY to YYYY-MM-DD
          aadhaar_linked: digitapResult.aadhaar_linked,
          masked_aadhaar: digitapResult.aadhaar_number,
          // Additional fields from Digitap
          pan_type: digitapResult.pan_type,
          address: digitapResult.address,
          mobile: digitapResult.mobile,
          email: digitapResult.email,
        };

        return transformedData;
      }
    }

    return await this.findPanComprehensiveResponse(panNumber, mobileNo);
  }

  private convertDateFormat(dateStr: string): string {
    if (!dateStr) return "";

    try {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
      return dateStr; // Return as-is if format is unexpected
    } catch (error) {
      return dateStr; // Return as-is if conversion fails
    }
  }

  async findAadharV2SendOtpResponse(
    aadharNo: string,
    mobileNo: string
  ): Promise<ISurePassSendAadharOtpResponse["data"]> {
    const data = await this.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_GENERATE_OTP,
        api_supplier: ApiSupplierType.SUREPASS,
        aadharNo,
        mobile_no: String(mobileNo),
      },
      ["api_response"],
      [{ column: "id", order: "desc" }]
    );

    if (data && data.api_response) return JSON.parse(data.api_response).data;

    return null;
  }

  async findAadharV2VerifyResponse(
    aadharNo: string,
    mobileNo: string
  ): Promise<ISurePassVerifyAadharResponse["data"]> {
    const data = await this.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
        api_supplier: ApiSupplierType.SUREPASS,
        aadharNo: String(aadharNo),
        mobile_no: String(mobileNo),
      },
      ["api_response"],
      [{ column: "id", order: "desc" }]
    );

    if (data && data.api_response) return JSON.parse(data.api_response).data;

    return null;
  }

  async findDigilockerEaadharResponse(
    aadharNo: string,
    mobileNo: string
  ): Promise<IDecentroEaadharResponse["data"]> {
    const data = await this.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
        api_supplier: ApiSupplierType.DECENTRO,
        aadharNo,
        mobile_no: String(mobileNo),
      },
      ["api_response"],
      [{ column: "id", order: "desc" }]
    );

    if (data && data.api_response) return JSON.parse(data.api_response).data;

    return null;
  }

  async getUserAadharDetails(
    aadharNo: string,
    mobileNo: string,
    isSurePass: boolean
  ): Promise<AadharData> {
    return isSurePass
      ? {
        type: ApiSupplierType.SUREPASS,
        data: await this.findAadharV2VerifyResponse(aadharNo, mobileNo),
      }
      : {
        type: ApiSupplierType.DECENTRO,
        data: await this.findDigilockerEaadharResponse(aadharNo, mobileNo),
      };
  }

  async delete(deleteWhere: DeleteWhere<TSelectLeadsApiLog>) {
    return await this.leadApiLogModel.delete(deleteWhere);
  }

  async getCustomerCibilScore(pancard: string) {
    let checkCibilRecord = await this.findOne(
      {
        api_supplier: ApiSupplierType.CIBIL,
        api_type: "consumer-cir-cv",
        pancard,
        status: 1,
      },
      ["api_response"],
      [{ column: "id", order: "desc" }]
    );

    if (!checkCibilRecord) return 0;
    if (!checkCibilRecord.api_response) return 0;

    const apiRes = JSON.parse(checkCibilRecord.api_response);

    return apiRes?.apimsg?.consumerCreditData[0]?.scores[0]?.score ?? 0;
  }

  async findPanComprehensiveResponseByCustomerID(customerID: number) {
    const data = await this.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
        api_supplier: ApiSupplierType.SUREPASS,
        customerID: customerID,
      },
      ["api_response"],
      [{ column: "id", order: "desc" }]
    );

    if (data && data.api_response) return JSON.parse(data.api_response).data;
    return null;
  }

  async findPanComprehensiveResponseByCustomerIDDigitap(customerID: number) {
    const data = await this.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE_DIGITAP,
        api_supplier: ApiSupplierType.DIGITAP,
        customerID: customerID,
      },
      ["api_response"],
      [{ column: "id", order: "desc" }]
    );

    if (data && data.api_response) {
      const response = JSON.parse(data.api_response);
      const digitapResult = response.result;

      if (digitapResult) {
        // Transform Digitap format to expected format
        const transformedData = {
          pan_number: digitapResult.pan,
          full_name: digitapResult.fullname,
          full_name_split: [
            digitapResult.first_name || "",
            digitapResult.middle_name || "",
            digitapResult.last_name || ""
          ],
          gender: digitapResult.gender === "male" ? "M" : digitapResult.gender === "female" ? "F" : digitapResult.gender,
          dob: this.convertDateFormat(digitapResult.dob), // Convert DD/MM/YYYY to YYYY-MM-DD
          aadhaar_linked: digitapResult.aadhaar_linked,
          masked_aadhaar: digitapResult.aadhaar_number,
          // Additional fields from Digitap
          pan_type: digitapResult.pan_type,
          address: digitapResult.address,
          mobile: digitapResult.mobile,
          email: digitapResult.email,
        };

        return transformedData;
      }
    }

    return await this.findPanComprehensiveResponseByCustomerID(customerID);
  }
}

export default LeadApiLogService;
