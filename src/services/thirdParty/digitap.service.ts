import { lenderModel } from "@/common/common-module/src/database/mysql/lender";
import { EmailTemplate } from "@/common/common-module/src/enums/common.enum";
import config from "@/config/default";
import { leadModel } from "@/database/mysql/leads";
import MailTemplateModel from "@/database/mysql/mail_template";
import NotificationModel from "@/database/mysql/notification";
import CommonHelper from "@/helpers/common";
import { IDigitapResponse } from "@/interfaces/digitap.interface";
import { ILeadsApiLog } from "@/interfaces/lead_api_log.interface";
import CustomerService from "@/services/customer.service";
import { logger } from "@/utils/logger";
import axios from "axios";
import LeadApiLogService from "../lead_api_log.service";
import S3Service from "./s3.service";

class DigitapService {
  //Dev
  private commonHelper = new CommonHelper();
  private customerService = new CustomerService();
  private mailTemplateModel = new MailTemplateModel();
  private notificationModel = new NotificationModel();
  private leadModel = leadModel;
  private lenderModel = lenderModel;
  private DEV_ENV = 0;
  private DEV_ENV_URL = config.digitap_dev_env_url;
  private DEV_CLIENT_ID = config.digitap_dev_client_id;
  private DEV_CLIENT_SECRET = config.digitap_dev_client_secret;
  private DEV_ENV_DEVICEAnalytics_URL =
    config.digitap_dev_env_deviceAnalytics_url;
  //Mjk1NDU3MDE6RmR5OURGelVQYzFRRmpQb3FZdlozUEgzWjlDb0hoN2E=

  //Live
  private LIVE_ENV = 1;
  private LIVE_ENV_URL = config.digitap_live_env_url;
  private LIVE_CLIENT_ID = config.digitap_live_client_id;
  private LIVE_CLIENT_SECRET = config.digitap_live_client_secret;
  private LIVE_ENV_DEVICEAnalytics_URL =
    config.digitap_live_env_deviceAnalytics_url;
  //MTQ4MjcwODA6MElLdmpTMklXelFzZnJtbDE2NW5majFHRFBjdTNGUm4=

  private ACTIVE_ENV = this.LIVE_ENV;

  //Env
  private APIURL =
    this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_ENV_URL : this.LIVE_ENV_URL;
  private CLIENT_ID =
    this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_CLIENT_ID : this.LIVE_CLIENT_ID;
  private CLIENT_SECRET =
    this.ACTIVE_ENV == this.DEV_ENV
      ? this.DEV_CLIENT_SECRET
      : this.LIVE_CLIENT_SECRET;

  private APIURL_DEVICEAnalytics =
    this.ACTIVE_ENV == this.DEV_ENV
      ? this.DEV_ENV_DEVICEAnalytics_URL
      : this.LIVE_ENV_DEVICEAnalytics_URL;

  private leadApiLogService = new LeadApiLogService();
  private s3Service = new S3Service();

  private headers() {
    return {
      "content-type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${this.CLIENT_ID}:${this.CLIENT_SECRET}`
      ).toString("base64")}`,
    };
  }
  //UT Done
  private async apiCall(
    url: string,
    method: string,
    headers: {},
    body: {},
    leadID: number,
    mobile: number,
    s3_folder: string
  ): Promise<IDigitapResponse> {
    const logBody = {
      ...body,
      upload_platform: "S3",
      person: s3_folder,
    };
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: headers,
        data: body,
      });
      const logEntry = {
        api_type: "face-match",
        api_endpoint_url: url,
        api_supplier: 5,
        api_method: "POST",
        api_request: JSON.stringify(logBody),
        api_response: JSON.stringify(response.data),
        leadID: String(leadID),
        mobile_no: String(mobile),
        status: 1,
      };
      await this.leadApiLogService.create(logEntry);
      return {
        is_success: true,
        apimsg: response.data,
      };
    } catch (error) {
      const logEntry = {
        api_type: "face-match",
        api_endpoint_url: url,
        api_supplier: 5,
        api_method: "POST",
        api_request: JSON.stringify(logBody),
        api_response: JSON.stringify(error?.response?.data),
        leadID: String(leadID),
        mobile_no: String(mobile),
        status: 0,
      };
      await this.leadApiLogService.create(logEntry);
      return {
        is_success: false,
        apimsg: error?.response?.data,
      };
    }
  }
  //UT Done
  // public async getFaceLiveness(
  //   mobile: number,
  //   leadID: number,
  //   image: string,
  //   adhar_no: string,
  //   s3_folder: string,
  // ): Promise<IDigitapResponse> {
  //   try {
  //     let clientRefId = `${mobile}_${leadID}`
  //     let api_type = 'face-match'
  //     let url = `${this.APIURL_DEVICEAnalytics}fmfl/v2/${api_type}`
  //     let key = `${s3_folder}/${image}`

  //     // Add error handling for S3 presigned URL
  //     let person: string;
  //     try {
  //       person = await this.s3Service.getPresignedUrl(key)
  //     } catch (error) {
  //       logger.error('S3 presigned URL generation failed:', error);
  //       throw new Error('Failed to generate image URL');
  //     }

  //     let card: string
  //     let aadhar: ILeadsApiLog

  //     if (adhar_no !== null && adhar_no !== undefined) {
  //       aadhar = await this.leadApiLogService.findOne(
  //         {
  //           api_supplier: 4,
  //           api_type: 'aadhaar-v2-submit-otp',
  //           aadharNo: String(adhar_no),
  //           status: 1,
  //         },
  //         ['*'],
  //         [{ column: 'id', order: 'desc' }],
  //       )
  //     }

  //     if (!aadhar) {
  //       aadhar = await this.leadApiLogService.findOne(
  //         {
  //           api_supplier: 1,
  //           api_type: 'digilocker_eaadhaar',
  //           mobile_no: String(mobile),
  //           status: 1,
  //         },
  //         ['*'],
  //         [{ column: 'id', order: 'desc' }],
  //       )
  //     }

  //     // Add null check for aadhar data
  //     if (!aadhar) {
  //       throw new Error('Aadhar verification data not found');
  //     }

  //     let aadharResponse;
  //     try {
  //       aadharResponse = JSON.parse(aadhar.api_response);
  //     } catch (error) {
  //       logger.error('Failed to parse aadhar response:', error);
  //       throw new Error('Invalid Aadhar response data');
  //     }

  //     if (adhar_no !== null && adhar_no !== undefined) {
  //       card = aadharResponse?.data?.profile_image;
  //     } else {
  //       card = aadharResponse?.data?.image;
  //     }

  //     if (!card) {
  //       throw new Error('Aadhar profile image not found');
  //     }

  //     let requestBody = {
  //       person,
  //       card,
  //       clientRefId,
  //     }

  //     let response = await this.apiCall(
  //       url,
  //       'POST',
  //       this.headers(),
  //       requestBody,
  //       leadID,
  //       mobile,
  //       key,
  //     )

  //     if (!response) {
  //       throw new Error('No response from face verification API');
  //     }

  //     return response
  //   } catch (error) {
  //     logger.error('Face liveness verification error:', error);
  //     throw error;
  //   }
  // }

  public async getFaceLiveness(
    mobile: number,
    leadID: number,
    image: string,
    adhar_no: string,
    s3_folder: string
  ): Promise<IDigitapResponse> {
    try {
      if (!mobile || !leadID || !image || !s3_folder) {
        throw new Error("Missing required parameters for face verification");
      }

      const clientRefId = `${mobile}_${leadID}`;
      const api_type = "face-match";
      const url = `${this.APIURL_DEVICEAnalytics}fmfl/v2/${api_type}`;
      const key = `${s3_folder}/${image}`;

      // Get presigned URL with retry logic
      let person: string;
      let retries = 3;
      while (retries > 0) {
        try {
          person = await this.s3Service.getPresignedUrl(key);
          if (person) break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            logger.error(
              "S3 presigned URL generation failed after retries:",
              error
            );
            throw new Error("Failed to generate image URL");
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      // Find Aadhar data with better error handling
      let aadhar: ILeadsApiLog | null = null;

      if (adhar_no) {
        try {
          aadhar = await this.leadApiLogService.findOne(
            {
              api_supplier: 4,
              api_type: "aadhaar-v2-submit-otp",
              aadharNo: String(adhar_no),
              status: 1,
            },
            ["*"],
            [{ column: "id", order: "desc" }]
          );
        } catch (error) {
          logger.error("Error finding Aadhar data by number:", error);
        }
      }

      if (!aadhar) {
        try {
          aadhar = await this.leadApiLogService.findOne(
            {
              api_supplier: 1,
              api_type: "digilocker_eaadhaar",
              mobile_no: String(mobile),
              status: 1,
            },
            ["*"],
            [{ column: "id", order: "desc" }]
          );
        } catch (error) {
          logger.error("Error finding Aadhar data by mobile:", error);
        }
      }

      if (!aadhar) {
        throw new Error("Aadhar verification data not found");
      }

      // Parse Aadhar response safely
      let aadharResponse;
      try {
        aadharResponse = JSON.parse(aadhar.api_response);
      } catch (error) {
        logger.error("Failed to parse aadhar response:", error);
        throw new Error("Invalid Aadhar response data");
      }

      // Extract card image
      const card = adhar_no
        ? aadharResponse?.data?.profile_image
        : aadharResponse?.data?.image;

      if (!card) {
        throw new Error("Aadhar profile image not found");
      }

      const requestBody = {
        person,
        card,
        clientRefId,
      };

      // Make API call with timeout
      const response = await Promise.race([
        this.apiCall(
          url,
          "POST",
          this.headers(),
          requestBody,
          leadID,
          mobile,
          key
        ),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("API call timeout")), 25000)
        ),
      ]);

      if (!response) {
        throw new Error("No response from face verification API");
      }

      return response as IDigitapResponse;
    } catch (error) {
      logger.error("Face liveness verification error:", {
        mobile,
        leadID,
        error: error.message,
      });
      throw error;
    }
  }

  async sendConsentImageEmail(
    customerID: number,
    leadId: number,
    imagebase64?: string
  ): Promise<void> {
    const mailData = await this.mailTemplateModel.findOneMailTemplate({
      name: EmailTemplate.LOAN_SELFIE_CONSENT_DOC,
    });

    const customer = await this.customerService.findOne(
      { customerID: customerID },
      ["email", "name"]
    );

    const leadInfo = await this.leadModel.findOne({
      where: { leadID: leadId },
      select: ["*"],
    });

    const lenderInfo = await this.lenderModel.findOne(
      {
        lenderID: leadInfo.lenderID,
      },
      ["name", "lender_info"]
    );

    mailData.message = mailData.message
      .replace(/{name}/g, customer?.name)
      .replace(/{lenderName}/g, lenderInfo?.lender_info?.lenderName)
      .replace(/{lenderEmailId}/g, lenderInfo?.lender_info?.lenderEmailId);

    if (customer) {
      const mailBody = {
        from: lenderInfo?.lender_info?.lenderEmailId,
        to: customer.email,
        subject: mailData?.subject,
        body: mailData?.message,
      };

      if (imagebase64) {
        mailBody["content"] = imagebase64;
        mailBody["attachmentName"] = "Consent.png";
      }
      try {
        await this.commonHelper.sendMailSwitcher(mailBody);

        const data = {
          customerID,
          leadID: leadId,
          notification: mailData.message,
          type: "Email",
          subject: mailData?.subject,
          mtype: "app",
          uid: 1,
        };
        await this.notificationModel.insert(data);
      } catch (error) {
        logger.error(error);
      }
    }
  }
}

export default DigitapService;
