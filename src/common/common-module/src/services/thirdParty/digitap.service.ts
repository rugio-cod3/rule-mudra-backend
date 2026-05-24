import config from '@/config/default'
import axios from 'axios'
import CustomerModel from '../../database/mysql/customer'
import { leadModel } from '../../database/mysql/leads'
import { lenderModel } from '../../database/mysql/lender'
import MailTemplateModel from '../../database/mysql/mail_template'
import NotificationModel from '../../database/mysql/notification'
import { EmailTemplate } from '../../enums/common.enum'
import CommonHelper from '../../helpers/common'
import { IDigitapResponse } from '../../interfaces/digitap.interface'
import { ILeadsApiLog } from '../../interfaces/leadApiLogs.interface'
import CustomerService from '../../services/customer.service'
import { logger } from '../../utils/logger'
import LeadApiLogService from '../leadApiLog.service'
import LeadApiLogMongoDBService from '../leadApiLogMongo.service'
import S3Service from './s3.service'

class DigitapService {
  //Dev
  private commonHelper = new CommonHelper()
  private customerModel = new CustomerModel()
  private customerService = new CustomerService()
  private mailTemplateModel = new MailTemplateModel()
  private notificationModel = new NotificationModel()
  private leadModel = leadModel
  private lenderModel = lenderModel
  private DEV_ENV = 0
  private DEV_ENV_URL = config.digitap_dev_env_url
  private DEV_CLIENT_ID = config.digitap_dev_client_id
  private DEV_CLIENT_SECRET = config.digitap_dev_client_secret
  private DEV_ENV_DEVICEAnalytics_URL = config.digitap_dev_env_deviceAnalytics_url
  //Mjk1NDU3MDE6RmR5OURGelVQYzFRRmpQb3FZdlozUEgzWjlDb0hoN2E=

  //Live
  private LIVE_ENV = 1
  private LIVE_ENV_URL = config.digitap_live_env_url
  private LIVE_CLIENT_ID = config.digitap_live_client_id
  private LIVE_CLIENT_SECRET = config.digitap_live_client_secret
  private LIVE_ENV_DEVICEAnalytics_URL = config.digitap_live_env_deviceAnalytics_url
  //MTQ4MjcwODA6MElLdmpTMklXelFzZnJtbDE2NW5majFHRFBjdTNGUm4=

  private ACTIVE_ENV = this.LIVE_ENV

  //Env
  private APIURL = this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_ENV_URL : this.LIVE_ENV_URL
  private CLIENT_ID = this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_CLIENT_ID : this.LIVE_CLIENT_ID
  private CLIENT_SECRET =
    this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_CLIENT_SECRET : this.LIVE_CLIENT_SECRET

  private APIURL_DEVICEAnalytics =
    this.ACTIVE_ENV == this.DEV_ENV
      ? this.DEV_ENV_DEVICEAnalytics_URL
      : this.LIVE_ENV_DEVICEAnalytics_URL

  private leadApiLogService = new LeadApiLogService()
  private s3Service = new S3Service()
  private readonly leadApiLogMongoDBService = new LeadApiLogMongoDBService()

  private headers() {
    return {
      'content-type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString(
        'base64',
      )}`,
    }
  }
  //UT Done
  private async apiCall(
    url: string,
    method: string,
    headers: {},
    body: {},
    leadID: number,
    mobile: number,
    s3_folder: string,
  ): Promise<IDigitapResponse> {
    const logBody = {
      ...body,
      upload_platform: 'S3',
      person: s3_folder,
    }
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: headers,
        data: body,
      })
      const logEntry = {
        api_type: 'face-match',
        api_endpoint_url: url,
        api_supplier: 5,
        api_method: 'POST',
        api_request: JSON.stringify(logBody),
        api_response: JSON.stringify(response.data),
        leadID: String(leadID),
        mobile_no: String(mobile),
        status: 1,
      }
      await this.leadApiLogService.create(logEntry)

      try {
        await this.leadApiLogMongoDBService.create('digitap', logEntry)
      } catch (error) {
        logger.error('Error while saving to MongoDB collection : digitap', error)
      }
      return {
        is_success: true,
        apimsg: response.data,
      }
    } catch (error) {
      const logEntry = {
        api_type: 'face-match',
        api_endpoint_url: url,
        api_supplier: 5,
        api_method: 'POST',
        api_request: JSON.stringify(logBody),
        api_response: JSON.stringify(error?.response?.data),
        leadID: String(leadID),
        mobile_no: String(mobile),
        status: 0,
      }
      await this.leadApiLogService.create(logEntry)
      try {
        await this.leadApiLogMongoDBService.create('digitap', logEntry)
      } catch (error) {
        logger.error('Error while saving to MongoDB collection : digitap', error)
      }
      return {
        is_success: false,
        apimsg: error?.response?.data,
      }
    }
  }
  //UT Done
  public async getFaceLiveness(
    mobile: number,
    leadID: number,
    image: string,
    adhar_no: string,
    s3_folder: string,
  ): Promise<IDigitapResponse> {
    try {
      const clientRefId = `${mobile}_${leadID}`
      const api_type = 'face-match'
      const url = `${this.APIURL_DEVICEAnalytics}fmfl/v2/${api_type}`
      const key = `${s3_folder}/${image}`
      const person = await this.s3Service.getPresignedUrl(key)
      const profileS3Folder = config.profileS3Folder
      //let person = s3_folder

      const getAadharProfilePicture = async (key: string) => {
        return await this.s3Service.getPresignedUrl(key)
      }

      let card: string
      let aadhar: ILeadsApiLog
      if (adhar_no !== null && adhar_no !== undefined) {
        aadhar = await this.leadApiLogService.findOne(
          {
            api_supplier: 4,
            api_type: 'aadhaar-v2-submit-otp',
            aadharNo: String(adhar_no),
            status: 1,
          },
          ['*'],
          [{ column: 'id', order: 'desc' }],
        )
      }

      if (!aadhar) {
        aadhar = await this.leadApiLogService.findOne(
          {
            api_supplier: 1,
            api_type: 'digilocker_eaadhaar',
            mobile_no: String(mobile),
            status: 1,
          },
          ['*'],
          [{ column: 'id', order: 'desc' }],
        )
        let aadharResponse = JSON.parse(aadhar.api_response)

        card = await getAadharProfilePicture(`${aadharResponse?.data?.image}`)
      } else {
        let aadharResponse = JSON.parse(aadhar.api_response)
        card = await getAadharProfilePicture(`${aadharResponse?.data?.profile_image}`)
      }
      let requestBody = {
        person,
        card,
        clientRefId,
      }
      let response = await this.apiCall(
        url,
        'POST',
        this.headers(),
        requestBody,
        leadID,
        mobile,
        key,
      )
      return response
    } catch (error) {
      console.log('error', error)
    }
  }

  async sendConsentImageEmail(
    customerID: number,
    leadId: number,
    imagebase64?: string,
  ): Promise<void> {
    const mailData = await this.mailTemplateModel.findOneMailTemplate({
      name: EmailTemplate.LOAN_SELFIE_CONSENT_DOC,
    })

    const customer = await this.customerService.findOne({ customerID: customerID }, [
      'email',
      'name',
    ])

    const leadInfo = await this.leadModel.findOne({ where: { leadID: leadId }, select: ['*'] })

    const lenderInfo = await this.lenderModel.findOne(
      {
        lenderID: leadInfo.lenderID,
      },
      ['name', 'lender_info'],
    )

    mailData.message = mailData.message
      .replace(/{name}/g, customer?.name)
      .replace(/{lenderName}/g, lenderInfo?.lender_info?.lenderName)
      .replace(/{lenderEmailId}/g, lenderInfo?.lender_info?.lenderEmailId)

    if (customer) {
      const mailBody = {
        from: lenderInfo?.lender_info?.lenderEmailId,
        to: customer.email,
        subject: mailData?.subject,
        body: mailData?.message,
      }

      if (imagebase64) {
        mailBody['content'] = imagebase64
        mailBody['attachmentName'] = 'Consent.png'
      }
      try {
        await this.commonHelper.sendMailSwitcher(mailBody)

        const data = {
          customerID,
          leadID: leadId,
          notification: mailData.message,
          type: 'Email',
          subject: mailData?.subject,
          mtype: 'app',
          uid: 221,
        }
        await this.notificationModel.insert(data)
      } catch (error) {
        logger.error(error)
      }
    }
  }
}

export default DigitapService
