import { logger } from "@/utils/logger";
import axios from "axios";
import { ISmsLogData, MessageVendor } from "../interfaces/sms.interface";

export class MessageService {
  public async sendMessage(payload: any): Promise<any> {
    const {
      user,
      authKey,
      sender,
      mobile,
      message,
      entityID,
      templateID,
      rpt,
      vendor,
    } = payload;

    let url: string;

    if (vendor === MessageVendor.NIMBUSIT) {
      url = `http://nimbusit.net/api/pushsms?user=${user}&authkey=${authKey}&sender=${sender}&mobile=${mobile}&text=${message}&entityid=${entityID}&templateid=${templateID}&rpt=1`;
    } else {
      throw new Error("Unsupported message vendor");
    }

    try {
      const response = await axios.get(url, {
        headers: {},
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
        templateID: templateID,
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
}
