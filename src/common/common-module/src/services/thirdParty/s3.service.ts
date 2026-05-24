import config from '@/config/default'
import AWS from 'aws-sdk'
// import { fileTypeFromBuffer } from 'file-type'
import { SendEmailRequest, SendRawEmailRequest } from 'aws-sdk/clients/ses'
import mime from 'mime-types'
import { IEmailSendData } from '../../interfaces/mailTemplate.interface'

class S3Service {
  private s3Client: AWS.S3
  private sesClient: AWS.SES
  private from: string

  constructor() {
    this.s3Client = new AWS.S3({
      accessKeyId: config.aws_s3_access_key_id,
      secretAccessKey: config.aws_s3_seceret_access_key,
      region: config.aws_s3_region,
    })
    this.sesClient = new AWS.SES({
      apiVersion: '2010-12-01',
      region: config.aws_region_ses || 'ap-south-1',
      credentials: {
        accessKeyId: config.aws_access_key_id_ses,
        secretAccessKey: config.aws_secret_access_key_ses,
      },
    })
    this.from = config.mail_for_ses || 'credit@ramfincorp.com'
  }

  public async uploadDocument(
    file: Buffer | null,
    folder: string,
    filename: string,
    isBase64: boolean = false,
    base64?: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    if (isBase64 && base64) {
      const base64Data = base64
        .replace(/^data:image\/\w+;base64,/, '')
        .replace(/\s/g, '')
      file = Buffer.from(base64Data, 'base64')
    }

    if (!file) {
      throw new Error('No file data provided for upload.')
    }

    const params: AWS.S3.PutObjectRequest = {
      Bucket: config.aws_s3_bucket_name,
      Key: `${folder}/${filename}`,
      Body: file,
      ACL: 'private', // Set the ACL based on your requirements
      ContentType: 'application/pdf'
    }

    return this.s3Client.upload(params).promise()
  }

  public async getPresignedUrl(filename: string): Promise<string | null> {
    if (!filename) {
      return null
    }

    const contentType = this.getContentTypeFromExtension(filename)

    const params = {
      Bucket: config.aws_s3_bucket_name,
      Key: filename,
      Expires: 259200, // 3 days in seconds
      ResponseContentType: contentType,
    }
    return this.s3Client.getSignedUrlPromise('getObject', params)
  }

  public isExtensionAllowed(extension: string): boolean {
    const allowedExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.jpeg',
      '.png',
      '.jpg',
      '.avi',
      '.gif',
      '.webp',
      '.mp4',
      '.mov',
      '.wmv',
      '.mkv',
      '.webm',
      '.mp3',
      '.mpeg4',
      '.aac',
      '.flac',
      '.alac',
      '.wav',
      '.aiff',
      '.dsd',
    ]
    return allowedExtensions.includes(extension.toLowerCase())
  }

  private getContentTypeFromExtension(filename: string): string {
    return mime.lookup(filename) || 'application/octet-stream'
  }

  public async sendEmail(
    mailData: IEmailSendData,
  ): Promise<AWS.SES.SendEmailResponse | AWS.SES.SendRawEmailResponse> {
    if (mailData.content && mailData.attachmentName) {
      return this.sendRawEmail(
        mailData.to,
        mailData.from,
        mailData.subject,
        mailData.body,
        mailData.content,
        mailData.attachmentName,
      )
    } else {
      const params: SendEmailRequest = {
        Source: mailData.from,
        Destination: {
          ToAddresses: [mailData.to],
        },
        Message: {
          Subject: {
            Data: mailData.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: mailData.body,
              Charset: 'UTF-8',
            },
          },
        },
      }

      return this.sesClient.sendEmail(params).promise()
    }
  }

  private async sendRawEmail(
    to: string,
    from: string,
    subject: string,
    body: string,
    attachment: string,
    attachmentName: string,
  ): Promise<AWS.SES.SendRawEmailResponse> {
    const boundary = `----=_Part_${Date.now()}`
    const rawMessage = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: 7bit`,
      '',
      body,
      '',
      `--${boundary}`,
      `Content-Type: application/octet-stream; name="${attachmentName}"`,
      `Content-Disposition: attachment; filename="${attachmentName}"; size=${attachment.length};`,
      `Content-Transfer-Encoding: base64`,
      '',
      attachment.toString(),
      '',
      `--${boundary}--`,
    ].join('\n')

    const params: SendRawEmailRequest = {
      RawMessage: {
        Data: rawMessage,
      },
    }

    return this.sesClient.sendRawEmail(params).promise()
  }
}

export default S3Service
