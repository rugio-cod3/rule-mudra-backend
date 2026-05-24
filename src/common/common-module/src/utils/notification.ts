import config from '@/config/default'
import { customerModel } from '../database/mysql/customer'
import { leadModel } from '../database/mysql/leads'
import MailTemplateModel from '../database/mysql/mailTemplate'
import NotificationModel from '../database/mysql/notification'
import { EmailTemplate } from '../enums/common.enum'
import { commonHelper } from '../helpers/common'
import AxiosService from '../services/api.service'
//import { loanService } from '../services/loan.service'
import { load } from 'cheerio'
import moment from 'moment-timezone'
import {
  ISendingEmailBody,
  ISendingSMSBody,
} from '../interfaces/notification.interface'
import { loanService } from '../services/loan.service'
import { capitalizeWords } from './util'

import dotenv from 'dotenv'
import { switchThirdPartyApiModel } from '../database/mysql/switchThirdPartyApi'
import { ApiType, Status } from '../enums/switchThirdPartyApi.enum'
import { ThirdPartAPI } from '../enums/thirdPartyApi.enum'
import { ISMSResponse } from '../interfaces/smsResponse.interface'
import { getOrSetCache, deleteCache } from '../redis/cacheService';
import { lenderModel } from '../database/mysql/lender'

dotenv.config()

const VENDOR_CACHE_KEY = 'active_sms_vendor';
export class NotificationUtils {
  private readonly apiService = new AxiosService(config.notificationBaseUrl)
  private readonly mailTemplateModel = new MailTemplateModel()
  private readonly shortLink = 'bit.ly/3T0zyIh'
  private readonly leadModel = leadModel
  private notificationModel = new NotificationModel()
  private readonly loanService = loanService
  private readonly customerModel = customerModel
  private readonly commonHelper = commonHelper
  private switchThirdPartyApiModel = switchThirdPartyApiModel

  constructor() { }

  changeResponse(jsonResponse) {
    let response

    try {
      response = JSON.parse(jsonResponse)
    } catch (error) {
      return JSON.stringify({
        message: 'Invalid JSON format',
        type: 'error',
      })
    }

    let convertedResponse = {
      message: 'Unexpected error',
      type: 'error',
    }

    if (
      response?.data?.status === 'OK' &&
      Array.isArray(response?.data?.data?.[0]) &&
      response?.data?.data?.[0]?.[0]?.id
    ) {
      const id = response.data.data[0][0].id
      const group_id = id.split('-')[0]

      convertedResponse = {
        message: group_id,
        type: 'success',
      }
    } else {
      convertedResponse = {
        message: 'Missing or invalid data structure.',
        type: 'error',
      }
    }

    return JSON.stringify(convertedResponse)
  }

  public selectSMSService = async (mobile: number, otp: number, message?: string) => {
    try {
      //Step 1: Get active vendor from cache or DB
      const vendor = await getOrSetCache(VENDOR_CACHE_KEY, async () => {
        return await this.switchThirdPartyApiModel.find({
          where: { api_type: ApiType.SMS, status: Status.ACTIVE },
          select: ['vendor', 'id', 'failed_count'],
        });
      }, {
        ttlSeconds: 60 * 60 * 24 * 7, // 7 days TTL
      });

      if (!vendor || vendor.length === 0) {
        return { error: 'No active SMS vendor found' };
      }

      //Step 2: Attempt SMS send
      let apiResponse: ISMSResponse;

      switch (vendor[0]?.vendor) {
        case ThirdPartAPI.TEXTNATION:
          apiResponse = await this.sendingSMS(mobile, otp, ThirdPartAPI.TEXTNATION, message);
          break;

        case ThirdPartAPI.ACQUIRIT:
          apiResponse = await this.sendingSMS(mobile, otp, ThirdPartAPI.ACQUIRIT, message);
          break;

        default:
          return { error: 'Invalid vendor' };
      }
      // apiResponse = await this.sendingWhatsAppMessage(mobile,otp)
      // console.log("apiResponse",apiResponse)

      const responseCheck = apiResponse?.statusCode === 200;

      // Step 3: If failed, retry with alternate and update failure count
      if (!responseCheck) {
        // Retry with alternate vendor
        vendor[0].vendor === ThirdPartAPI.TEXTNATION
          ? await this.sendingSMS(mobile, otp, ThirdPartAPI.ACQUIRIT, message)
          : await this.sendingSMS(mobile, otp, ThirdPartAPI.TEXTNATION, message);

        const failedCount = (vendor[0]?.failed_count || 0) + 1;

        await this.switchThirdPartyApiModel.update(
          { id: vendor[0].id },
          { failed_count: failedCount },
        );

        // If failure count exceeds limit, switch vendors
        if (failedCount >= config.apiSwitchCount) {
          await this.switchThirdPartyApiModel.updateOneExcluding(
            { api_type: ApiType.SMS },
            { id: vendor[0]?.id },
            {
              status: Status.ACTIVE,
              failed_count: 0,
            },
          );

          await this.switchThirdPartyApiModel.update(
            { api_type: ApiType.SMS, id: vendor[0]?.id },
            { status: Status.DEACTIVE },
          );

          //Invalidate cache due to vendor switch
          await deleteCache(VENDOR_CACHE_KEY);
        }
      } else {
        //On success, reset failure count if needed
        if (vendor[0]?.failed_count > 0) {
          await this.switchThirdPartyApiModel.update(
            { api_type: ApiType.SMS, id: vendor[0]?.id },
            { failed_count: 0 },
          );

          // Optional: Invalidate to reflect updated count
          await deleteCache(VENDOR_CACHE_KEY);
        }
      }

      return apiResponse;

    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  };
  public selectSMSServiceWhatsapp = async (mobile: number, otp: number) => {
    try {
      let apiResponse: ISMSResponse;

      apiResponse = await this.sendingWhatsAppMessage(mobile, otp)
      console.log("apiResponse", apiResponse)
      return apiResponse;

    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  };

  public sendingSMS = async (mobile: number, otp: number, vendor: string, message?: string) => {
    try {
      const body = {
        mobile: Number(mobile),
        otp,
        body_message:
          ThirdPartAPI.TEXTNATION === vendor
            ? `Dear customer, use this One Time Password ${otp} to log in to your Ram Fincorp account. This OTP will be valid for the next 2 minutes.`
            : (config.acquiritSender === 'AVFINL' ? `DearCustomer Please use ${otp} as your OTP for Login. by AVA Finance` :
              `Dear customer, use this One Time Password ${otp} to log in to your Ram Fincorp account. This OTP will be valid for the next 2 mins.By Kundanmal Finance`),

        template_id:
          ThirdPartAPI.TEXTNATION === vendor
            ? config.templateIdSmsOtp.toString()
            : config.acquiritDlttempid.replace('TID-', ''),
        ...(ThirdPartAPI.TEXTNATION === vendor && {
          entityID: config.entityIdSmsOtp.toString(),
        }),
        vendor,
      }
      if (message) body.body_message = message;

      const result = await this.apiService.call<undefined, ISendingSMSBody, undefined>(
        'post',
        `/notificationService/sending_sms`,
        body,
        undefined,
        {
          'Content-Type': 'application/json',
        },
      )
      console.log('SMS sending result found:', result)
      return result
    } catch (error) {
      console.error('Error sending SMS:', error)
      throw error
    }
  }

  public sendingEmailOTP = async (email: string, name: string, otp: number) => {
    try {
      const mailData = await this.mailTemplateModel.findOneMailTemplate({
        name: EmailTemplate.OTP,
      })
      mailData.message = mailData.message.replace('{{$otp}}', otp.toString())
      mailData.message = mailData.message.replace(
        '{{$name}}',
        capitalizeWords(name),
      )

      const body = {
        form_email: config.otpSenderEmail,
        to_email: email,
        subject: mailData?.subject,
        body_message: mailData?.message,
      }

      await this.apiService.call<undefined, ISendingEmailBody, undefined>(
        'post',
        `/notificationService/sending_email`,
        body,
        undefined,
        {
          'Content-Type': 'application/json',
        },
      )
    } catch (error) {
      throw error
    }
  }

  public sendApprovedProcessMail = async (
    customerID: number,
    leadID?: number,
    userID?: number,
  ) => {
    try {
      const mailData = await this.mailTemplateModel.findOneMailTemplate({
        name: EmailTemplate.APPROVED_PROCESS,
      })

      const customerDetails = await customerModel.findOneCustomer(
        { customerID },
        ['name', 'email'],
      )

      const lead = await leadModel.findOne({
        where: { leadID },
        select: ['lenderID'],
      })
      const lender = await lenderModel
      .findOne({ lenderID: lead.lenderID }, ['*'])

     mailData.message = mailData.message
        .replace(/{customer}/g, customerDetails?.name)
        .replace(/{lenderName}/g, lender?.lender_info?.lenderName)
        .replace(/{base_url}/g, lender?.lender_info?.base_url)
        .replace(/{link}/g, this.shortLink)
        .replace(/{date}/g, moment().format('DD-MM-YYYY'))

      const body = {
        form_email: lender?.lender_info?.lenderEmailId,
        to_email: customerDetails.email,
        subject: mailData?.subject,
        body_message: mailData?.message,
      }

      const response = await this.apiService.call<
        undefined,
        ISendingEmailBody,
        any
      >('post', `/notificationService/sending_email`, body, undefined, {
        'Content-Type': 'application/json',
      })

      if (response && typeof response.success === 'boolean') {
        const data = {
          customerID,
          leadID: leadID,
          notification: mailData.message,
          type: 'Email',
          subject: mailData?.subject,
          mtype: 'crm',
          uid: userID,
        }

        await this.notificationModel.insert(data)
      }
    } catch (error) {
      throw error
    }
  }

  public sendRejectProcessMail = async (customerID: number, leadID: number) => {
    try {
      const mailData = await this.mailTemplateModel.findOneMailTemplate({
        name: EmailTemplate.REJECTED_PROCESS,
      })

      const customerDetails = await customerModel.findOneCustomer(
        { customerID },
        ['name', 'email'],
      )

      const lead = await leadModel.findOne({
        where: { leadID },
        select: ['lenderID'],
      })
      const lender = await lenderModel.findOne({ lenderID: lead.lenderID }, ['*'])

      mailData.message = mailData.message
        .replace(/{customer}/g, customerDetails?.name)
        .replace(/{lenderName}/g, lender?.lender_info?.lenderName)
        .replace(/{base_url}/g, lender?.lender_info?.base_url)

     const body = {
        form_email: lender?.lender_info?.lenderEmailId,
        to_email: customerDetails?.email,
        subject: mailData?.subject,
        body_message: mailData?.message,
      }

      await this.apiService.call<undefined, ISendingEmailBody, undefined>(
        'post',
        `/notificationService/sending_email`,
        body,
        undefined,
        {
          'Content-Type': 'application/json',
        },
      )
    } catch (error) {
      throw error
    }
  }

  public sendNotRequiredProcessMail = async (customerID: number,leadID: number) => {
    try {
      const mailData = await this.mailTemplateModel.findOneMailTemplate({
        name: EmailTemplate.NOT_REQUIRED,
      })

      const customerDetails = await customerModel.findOneCustomer(
        { customerID },
        ['name', 'email'],
      )

      const leadLenderID = await leadModel.findOne({
        where: { leadID },
        select: ['lenderID'],
      })
      const lenderInfo = await lenderModel.findOne({ lenderID: leadLenderID.lenderID }, ['*'])

     mailData.message = mailData.message
        .replace('{customer}', customerDetails?.name)
        .replace('{link}', this.shortLink)
        .replace('{date}', moment().format('DD-MM-YYYY'))
        .replace(/{lenderName}/g, lenderInfo.lender_info.lenderName)
        .replace(/{base_url}/g, lenderInfo.lender_info.base_url)

      const body = {
        form_email: lenderInfo.lender_info.lenderEmailId,
        to_email: customerDetails.email,
        subject: mailData?.subject,
        body_message: mailData?.message,
      }

      await this.apiService.call<undefined, ISendingEmailBody, undefined>(
        'post',
        `/notificationService/sending_email`,
        body,
        undefined,
        {
          'Content-Type': 'application/json',
        },
      )
    } catch (error) {
      throw error
    }
  }

  sendSanctionMail = async (
    customerID: number,
    leadID: number,
    userID: number,
  ) => {
    try {
      const lead = await this.leadModel.findOne({
        where: { leadID },
        select: ['productID', 'lenderID'],
      })
      const customer = await this.customerModel.findOneCustomer({ customerID }, ['name', 'email'])

      const lender = await lenderModel.findOne({ lenderID: lead.lenderID }, ['*'])
      const baseUrl = this.commonHelper.getBaseUrl()
      if (lead.productID === 2) {
        // Payload Loan

        const mailData = await this.mailTemplateModel.findOneMailTemplate({
          name: EmailTemplate.SANCTION_PAYDAY,
        })

        const paydayData =
          await this.loanService.calculatePaydayLoanSanctionData(
            leadID,
            customerID,
            userID,
          )

        const {
          accountDetails,
          approvalDetails,
          tenure,
          intem,
          gst,
          fdb,
          rep1,
          apr,
        } = paydayData

        mailData.message = mailData.message
          .replace('{currentDate}', moment().format('DD-MM-YYYY'))
          .replace('{customerName}', customer?.name)
          .replace(/\{baseUrl\}/g, baseUrl)
          .replace('{bankName}', accountDetails?.bank)
          .replace('{accountNo}', accountDetails?.accountNo)
          .replace('{bankIfsc}', accountDetails?.bankIfsc)
          .replace(/\{loanAmtApproved\}/g, approvalDetails?.loanAmtApproved.toFixed(2))
          .replace(/\{tenure\}/g, tenure)
          .replace('{roi}', String(approvalDetails?.roi))
          .replace(
            '{repayDate}',
            moment(approvalDetails?.repayDate).startOf('day').format('DD-MM-YYYY'),
          )
          .replace(/\{ipcDpdInterest\}/g, config.ipcDpdInterest)
          .replace(
            '{dpdPenaltyAmountTotal}',
            (
              +config.dpdPenalty +
              +config.dpdPenalty * (+config.dpdPenaltyGstPercentage / 100)
            ).toFixed(2),
          )
          .replace(
            '{approvalCreatedDate}',
            moment(approvalDetails?.createdDate).format('DD-MM-YYYY'),
          )
          .replace('{intem}', String(intem))
          .replace('{gstAdminFee}', (gst + approvalDetails?.adminFee).toFixed(2))
          .replace('{adminFee}', approvalDetails?.adminFee.toFixed(2))
          .replace('{gst}', gst.toFixed(2))
          .replace('{fdb}', fdb.toFixed(2))
          .replace(/\{rep1\}/g, rep1.toFixed(2))
          .replace('{aprMonthly}', apr.toFixed(2))
          .replace(/\{aprAnnualy\}/g, (apr / 12).toFixed(2))

        const body = {
          form_email: config.otpSenderEmail,
          to_email: customer?.email,
          subject: mailData?.subject,
          body_message: mailData?.message,
        }

        await this.apiService.call<undefined, ISendingEmailBody, undefined>(
          'post',
          `/notificationService/sending_email`,
          body,
          undefined,
          {
            'Content-Type': 'application/json',
          },
        )
      } else if (lead.productID === 1) {
        const mailData = await this.mailTemplateModel.findOneMailTemplate({
          name: EmailTemplate.SANCTION_EMI,
        })

        const emiData = await this.loanService.calculateEmiLoanSanctionData(
          leadID,
          customerID,
          userID,
        )

        const {
          accountDetails,
          approvalDetails,
          tenure,
          tenureInDays,
          intem,
          gst,
          fdb,
          bpi,
          rep1,
          apr,
          credits,
          installments,
        } = emiData

        mailData.message = mailData.message
          .replace(/\{currentDate\}/g, moment().format('DD-MM-YYYY'))
          .replace(/\{customerName\}/g, customer?.name)
          .replace(/\{bankName\}/g, accountDetails?.bank)
          .replace(/\{accountNo\}/g, accountDetails?.accountNo)
          .replace(/\{bankIfsc\}/g, accountDetails?.bankIfsc)
          .replace(/\{loanAmtApproved\}/g, approvalDetails?.loanAmtApproved.toFixed(2))
          .replace(/\{tenure\}/g, String(tenure))
          .replace(/\{tenureInDays\}/g, String(tenureInDays))
          .replace(/\{roi\}/g, String(approvalDetails?.roi))
          .replace(
            /\{repayDate\}/g,
            moment(approvalDetails?.repayDate).startOf('day').format('DD-MM-YYYY'),
          )
          .replace(
            /\{dpdPenaltyAmountTotal\}/g,
            (approvalDetails?.roi + +(0.1 * 365).toFixed(2)).toFixed(2),
          )
          .replace(
            /\{approvalCreatedDate\}/g,
            moment(approvalDetails?.createdDate).format('DD-MM-YYYY'),
          )
          .replace(/\{intem\}/g, String(intem))
          .replace(/\{gstAdminFee\}/g, (gst + approvalDetails?.adminFee).toFixed(2))
          .replace(/\{adminFee\}/g, approvalDetails?.adminFee.toFixed(2))
          .replace(/\{gst\}/g, gst.toFixed(2))
          .replace(/\{fdb\}/g, fdb.toFixed(2))
          .replace(/\{bpi\}/g, bpi.toFixed(2))
          .replace(/\{rep1\}/g, rep1.toFixed(2))
          .replace(/\{apr\}/g, apr.toFixed(2))
          .replace(/\{eachInstallmentAmount\}/g, (rep1 / tenure).toFixed(2))

        // Put the EMIs data in table
        const htmlContent = load(mailData.message)

        const tableBody = htmlContent('#installments-table-body')

        let principal = credits.principal

        installments.forEach((installment, index) => {
          const closingPrincipal = principal - installment?.principal

          const row = `
              <tr style="text-align: center;">
                  <td>${index + 1}.</td>
                  <td>${moment(installment?.dueDate).format('YYYY-MM-DD')}</td>
                  <td>${principal.toFixed(2)}</td>
                  <td>${installment?.amountPayable.toFixed(2)}</td>
                  <td>${installment?.principal.toFixed(2)}</td>
                  <td>${installment?.interest.toFixed(2)}</td>
                  <td>${closingPrincipal.toFixed(2)}</td>
                  <td>${approvalDetails?.roi}</td>
              </tr>
          `

          tableBody.append(row)

          principal = closingPrincipal // Update principal after each installment
        })

        const body = {
          form_email: config.otpSenderEmail,
          to_email: customer?.email,
          subject: mailData?.subject,
          body_message: htmlContent.html(),
        }

        await this.apiService.call<undefined, ISendingEmailBody, undefined>(
          'post',
          `/notificationService/sending_email`,
          body,
          undefined,
          {
            'Content-Type': 'application/json',
          },
        )
      }

      return
    } catch (error) {
      throw error
    }
  }

  sendingPDFEmail = async (
    from_email: string,
    email: string,
    subject: string,
    lenderName: string,
    pdfBase64?: string,
    ext?: string,
    file_name?: string,
    mail_content?: any
  ) => {
    try {
      const body = {
        form_email: from_email,
        to_email: email,
        subject: `${lenderName} : ${subject}`,
        body_message: `${mail_content ? mail_content : `${lenderName} : ${subject}`}`,
        attachment: pdfBase64,
        ext: ext,
        file_name: file_name,
      }
      const res = await this.apiService.call<undefined, ISendingEmailBody, undefined>(
        'post',
        `/notificationService/sending_email`,
        body,
        undefined,
        {
          'Content-Type': 'application/json',
        },
      )
      return res
    } catch (error) {
      throw error
    }
  }
  sendingWhatsAppMessage = async (phoneNumber: number, otp: number): Promise<any> => {
    try {
      // Remove any leading '+91' or '91' if present
      const cleanedPhoneNumber = phoneNumber.toString().replace(/^(\+91|91)/, '')
      const body = {
        countryCode: '+91',
        phoneNumber: cleanedPhoneNumber,
        type: 'Template',
        callbackData: 'whatsapp_otp_verification',
        template: {
          name: 'newlogin',
          languageCode: 'en',
          bodyValues: [otp],
          buttonValues: {
            '0': [otp],
          },
        },
      }
      // Create an axios instance for the Interakt API
      const interaktService = new AxiosService('https://api.interakt.ai/v1/public')
      // Make API call to Interakt.ai
      const response = await interaktService.call('post', '/message/', body, undefined, {
        'Content-Type': 'application/json',
        Authorization: 'Basic YnVXTF9BWmdGQjd0bXdSbndhV3hzbUVKR2hCaURoVzZXaXRtQjBxS0VjQTo=',
      })
      return response
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      throw error
    }
  }
  sendingWhatsAppMessageForCronJobFail = async (): Promise<any> => {
    try {
      const phoneNumber = config.disbursalWhatsappAlert
      const phoneNumbers: string[] = phoneNumber.split(',')
      const interaktService = new AxiosService(config.interaktUrl)
      for (const mobileNumber of phoneNumbers) {
        const body = {
          countryCode: '+91',
          phoneNumber: mobileNumber,
          type: 'Template',
          callbackData: 'Disbursal_Cron_Job_Failed',
          template: {
            name: 'disbursal_stoped',
            languageCode: 'en',
            bodyValues: ['Disbursal Stopped for Ramfin!'],
          },
        }
        const res = await interaktService.call('post', '/message/', body, undefined, {
          'Content-Type': 'application/json',
          Authorization: config.interaktWhatsappAlertKey,
        })
        console.log(res)
      }

      return { message: 'Send whatsapp alert successfully' }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      throw error
    }
  }

public sendEmailChangeOtp = async (email: string, name: string, otp: number) => {
    try {
      const mailData = await this.mailTemplateModel.findOneMailTemplate({
        name: EmailTemplate.EMAIL_CHANGE,
      })
      console.log(mailData.message)
      mailData.message = mailData.message.replace('{{$otp}}', otp.toString())
      mailData.message = mailData.message.replace('{{$name}}', capitalizeWords(name))

      const body = {
        form_email: config.otpSenderEmail,
        to_email: email,
        subject: mailData?.subject,
        body_message: mailData?.message,
      }

      await this.apiService.call<undefined, ISendingEmailBody, undefined>(
        'post',
        `/notificationService/sending_email`,
        body,
        undefined,
        {
          'Content-Type': 'application/json',
        },
      )
    } catch (error) {
      throw error
    }
  }
public sendReferralSignupEmail = async (email: string, name: string, mobile: number) => {
    try {
      const mailData = await this.mailTemplateModel.findOneMailTemplate({
        name: EmailTemplate.REFERRAL_SIGNUP,
      })

      mailData.message = mailData.message.replace('{{mobile}}', mobile.toString())
      // mailData.message = mailData.message.replace('{{$name}}', capitalizeWords(name))

      const body = {
        form_email: config.otpSenderEmail,
        to_email: email,
        subject: mailData?.subject,
        body_message: mailData?.message,
      }

      await this.apiService.call<undefined, ISendingEmailBody, undefined>(
        'post',
        `/notificationService/sending_email`,
        body,
        undefined,
        {
          'Content-Type': 'application/json',
        },
      )
    } catch (error) {
      throw error
    }
  }

  public sendWithdrawalProcessedEmail = async (customerId: number) => {
    try {
      const [mailData, customerDetails] = await Promise.all([this.mailTemplateModel.findOneMailTemplate({
        name: EmailTemplate.WITHDRAWAL_PROCESSED
      }),
      this.customerModel.findOneCustomer({ customerID: customerId })
      ]);

      mailData.message = mailData.message.replace('{{$name}}', capitalizeWords(customerDetails.name))

      const body = {
        form_email: config.otpSenderEmail,
        to_email: customerDetails.email,
        subject: mailData?.subject,
        body_message: mailData?.message,
      }

      await this.apiService.call<undefined, ISendingEmailBody, undefined>(
        'post',
        `/notificationService/sending_email`,
        body,
        undefined,
        {
          'Content-Type': 'application/json',
        },
      )
    } catch (error) {
      throw error
    }
  }

}

export const notificationUtils = new NotificationUtils()
