import { logger } from "@/utils/logger";
import axios from "axios";
import {
  ISendSmsPayload,
  ISmsLogData,
  ISmsResponse,
  ThirdPartAPI,
} from "../interfaces/sms.interface";

export class SmsService {
  public async sendSMS(payload: ISendSmsPayload): Promise<ISmsResponse> {
    const { mobile, otp, body_message, template_id, entityID, vendor } =
      payload;

    const encodedMessage = encodeURIComponent(body_message);
    let url: string;

    if (vendor === ThirdPartAPI.TEXTNATION) {
      url = `https://connectexpress.in/api/v3/index.php?method=sms&api_key=6495346a94fccc2b1f46222f1209486121ba81d9&to=91${mobile}&sender=NEXILN&message=${encodedMessage}&entity_id=${entityID}&template_id=${template_id}&format=json`;
    } else {
      logger.error("SMS Service - Invalid vendor", { vendor });
      throw new Error("Invalid SMS vendor");
    }

    try {
      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
      });

      const requestConfig = {
        method: "GET",
        url,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      const logData: ISmsLogData = {
        mobile,
        templateID: template_id,
        api_request: JSON.stringify(requestConfig),
        api_response: JSON.stringify(response.data),
        entityID: entityID ?? " ",
      };

      logger.info("SMS sent successfully", logData);

      return {
        data: response.data,
        message: "SMS sent successfully",
        statusCode: 200,
      };
    } catch (error: any) {
      logger.error("Error sending SMS:", error);
      throw new Error("Error in sending SMS");
    }
  }

  public async sendOTP(
    mobile: string,
    otp: string,
    template_id: string,
    vendor: ThirdPartAPI = ThirdPartAPI.TEXTNATION
  ): Promise<ISmsResponse> {
    const payload: ISendSmsPayload = {
      mobile,
      otp,
      body_message: `Your OTP is: ${otp}`,
      template_id,
      vendor,
    };

    return this.sendSMS(payload);
  }
}
