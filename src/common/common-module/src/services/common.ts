import config from '@/config/default'
import axios from 'axios'
import ejs from 'ejs'
import path from 'path'
import { IEmailPayload } from '../interfaces/common.interface'
import { EmailData } from '../interfaces/nodemailer.interface'
import { logger } from '../utils/logger'
import { transporter } from '../utils/nodemailer'

export const sendEmail = (emailData: EmailData) =>
  transporter.sendMail(emailData, (err, info) => {
    if (err) {
      logger.error(`sendEmail: ${err.stack}`)
    }
    logger.info(`Email Sent, Envelope: ${info.envelope}, MessageId: ${info.messageId}`)
  })

export function getFileStream(bucket: string, pathKey: string) {
  throw new Error('Function not implemented.')
}
export const sendEmailViaBravo = async (
  to: [{ email: string; name: string }],
  subject: string,
  htmlContent: string,
): Promise<boolean> => {
  try {
    let sender = {
      name: config.bravoSenderName,
      email: config.bravoFrom,
    }
    const payload: IEmailPayload = {
      sender,
      to,
      subject,
      htmlContent,
    }
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        accept: 'application/json',
        'api-key': config.bravoApiKey,
        'content-type': 'application/json',
      },
    })
    console.log('Email Sent')
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}
export interface EmailSendFromData {
  to: string
  from: string
  subject: string
  body: string
  content?: string
  attachmentName?: string
}
export const sendSendinblueMail = async (mailData: EmailSendFromData): Promise<void> => {
  const sendData: any = {
    sender: {
      name: 'Ramfincorp',
      email: mailData.from,
    },
    to: [
      {
        email: mailData.to,
      },
    ],
    subject: mailData.subject,
    htmlContent: mailData.body,
  }

  if (mailData.content && mailData.attachmentName) {
    sendData.attachment = [
      {
        content: mailData.content,
        name: mailData.attachmentName,
      },
    ]
  }

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', sendData, {
      headers: {
        'api-key': config.bravoApiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
    })
    console.log('Email sent successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}
interface VerifyOfficeEmailResponse {
  errorCode: string
  errorMsg: string
}
export const verifyOfficeEmail = async (
  emailId: string,
  otp: string,
  name: string,
): Promise<VerifyOfficeEmailResponse> => {
  const to = emailId
  const subject = 'Ram Fincorp : Email Verification OTP'
  const from = 'info@ramfincorp.com'
  const templatePath = path.join(__dirname, '..', 'views', 'emails', 'email_verification.ejs')
  const mailData = {
    name: name,
    otp: otp,
  }
  const message = await ejs.renderFile(templatePath, mailData)

  const emailSendFromData: EmailSendFromData = {
    to: to,
    from: from,
    subject: subject,
    body: message,
  }

  let response = await sendSendinblueMail(emailSendFromData)

  return {
    errorCode: '0',
    errorMsg: 'Mail sent successfully',
  }
}
