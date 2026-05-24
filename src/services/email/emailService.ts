import config from "@/config/default";
import { documentModel } from "@/database/mysql/document";
import { leadModel } from "@/database/mysql/leads";
import { logger } from "@/utils/logger";
import AWS from "aws-sdk";
import moment from "moment";
import puppeteer from "puppeteer";
import { LoanAgreementTemplate } from "./templates/loanAgreementTemplate";
import { NocEmailTemplate } from "./templates/nocEmailTemplate";

interface LoanRecord {
  leadID: number;
  customerID: number;
  loanNo: string;
  disbursalAmount: number;
  disbursalDate: string;
  status: string;
}

interface CustomerRecord {
  customerID: number;
  name: string;
  email: string;
  mobile: string;
}

interface DocumentRecord {
  documentID: number;
  documentFile: string;
  documentType: string;
  type: string;
  upload_platform: "local" | "S3";
}

interface ClosedLeadRecord {
  leadID: number;
  customerID: number;
  status: string;
  closedDate?: string;
}

interface NocData {
  lead: ClosedLeadRecord;
  customer: CustomerRecord;
  loan: LoanRecord;
}

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export class EmailService {
  private ses: AWS.SES;
  private s3: AWS.S3;
  private readonly senderEmail: string;
  private loanAgreementTemplate: LoanAgreementTemplate;
  private nocTemplate: NocEmailTemplate;

  constructor() {
    this.senderEmail = config.mail_for_ses;
    this.loanAgreementTemplate = new LoanAgreementTemplate();
    this.nocTemplate = new NocEmailTemplate();
    this.initializeAWSServices();
  }

  private initializeAWSServices(): void {
    AWS.config.update({
      accessKeyId: config.aws_s3_access_key_id,
      secretAccessKey: config.aws_s3_seceret_access_key,
      region: config.aws_region_ses,
    });

    this.ses = new AWS.SES({ apiVersion: "2010-12-01" });

    this.s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      accessKeyId: config.aws_s3_access_key_id,
      secretAccessKey: config.aws_s3_seceret_access_key,
      region: config.aws_s3_region,
    });
  }

  public async sendLoanAgreementEmail(
    loan: LoanRecord,
    customer: CustomerRecord,
    agreementDocument: DocumentRecord,
    sanctionDocument?: DocumentRecord,
  ): Promise<void> {
    try {
      const attachments: EmailAttachment[] = [];

      const agreementAttachment = await this.prepareAttachment(
        agreementDocument,
        "loan_agreement",
      );
      attachments.push(agreementAttachment);

      if (sanctionDocument) {
        const sanctionAttachment = await this.prepareAttachment(
          sanctionDocument,
          "sanction_letter",
        );
        attachments.push(sanctionAttachment);
      }
      let leadInfo = null;
      if (loan.leadID) {
        leadInfo = await leadModel.findOne({
          where: {
            leadID: loan.leadID,
          },
        });
      }
      const lenderId = leadInfo?.lenderID;

      const emailSubject = `Your Loan Agreement & Sanction Letter - ${
        lenderId == 2
          ? `Nandanvan Investments Ltd`
          : `Yashik Finlease Private Limited`
      }`;
      const emailHtml = this.loanAgreementTemplate.generateHTML(
        loan,
        customer,
        !!sanctionDocument,
        lenderId,
      );
      const rawEmail = await this.createRawEmailWithAttachments(
        this.senderEmail,
        customer.email,
        emailSubject,
        emailHtml,
        attachments,
      );

      const params: AWS.SES.SendRawEmailRequest = {
        Source: this.senderEmail,
        Destinations: [customer.email],
        RawMessage: { Data: rawEmail },
      };

      // const result = await this.ses.sendRawEmail(params).promise();
      // const attachmentInfo = sanctionDocument
      //   ? "with agreement and sanction letter"
      //   : "with agreement only";
      // logger.info(
      //   `Email sent successfully via SES to ${customer.email} ${attachmentInfo} for loan ${loan.loanNo}. MessageId: ${result.MessageId}`,
      // );
    } catch (error) {
      logger.error(
        `Error sending loan agreement email to ${customer.email}:`,
        error,
      );
      throw error;
    }
  }

  public async sendNocEmail(nocData: NocData): Promise<void> {
    let browser;
    try {
      const { lead, customer, loan } = nocData;

      const getLeadInfo = await leadModel.findOne({
        where: {
          leadID: lead.leadID,
        },
      });
      const lenderId = getLeadInfo?.lenderID;

      const emailSubject =
        "NO DUES CERTIFICATE - Yashik Finlease Private Limited";

      const templateData = {
        customer,
        loan,
        appName: "Yashik Finlease Private Limited",
        phoneNumber: config.support_phone_number,
        lenderId,
      };

      const emailHtml = this.nocTemplate.generateHTML(templateData);

      const params: AWS.SES.SendEmailRequest = {
        Source: this.senderEmail,
        Destination: {
          ToAddresses: [customer.email],
        },
        Message: {
          Subject: {
            Data: emailSubject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: emailHtml,
              Charset: "UTF-8",
            },
          },
        },
      };

      // const result = await this.ses.sendEmail(params).promise();
      // logger.info(
      //   `NOC email sent successfully via SES to ${customer.email} for loan ${loan.loanNo}. MessageId: ${result.MessageId}`
      // );

      await this.generateAndStoreNocPdf(nocData, emailHtml);
    } catch (error) {
      logger.error(
        `Error sending NOC email to ${nocData.customer.email}:`,
        error,
      );
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async generateAndStoreNocPdf(
    nocData: NocData,
    emailHtml: string,
  ): Promise<void> {
    let browser;
    try {
      const { lead, customer, loan } = nocData;

      const cleanedHtml = emailHtml.replace(/\n/g, "");

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();

      await page.setContent(cleanedHtml, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
      });

      await browser.close();
      browser = null;

      if (pdfBuffer) {
        const s3FolderName = `document/noc/${customer.customerID}`;
        const fileName = `noc_${Math.floor(Date.now() / 1000)}.pdf`;

        const s3Response = await this.uploadToS3(
          pdfBuffer,
          s3FolderName,
          fileName,
        );

        if (s3Response && s3Response.Key) {
          await documentModel.insert({
            customerID: customer.customerID,
            type: "NOC",
            documentType: "No Dues Certificate",
            documentFile: s3Response.Key,
            leadID: lead.leadID,
            status: "Verified",
            uploadBy: customer.customerID,
            uploadedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            verifiedBy: customer.customerID,
            verifiedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            upload_platform: "S3",
          });

          logger.info(
            `NOC PDF generated and stored successfully for customerID: ${customer.customerID}, leadID: ${lead.leadID}`,
          );
        }
      }
    } catch (error) {
      logger.error(
        `Error generating and storing NOC PDF for customerID: ${nocData.customer.customerID}:`,
        error,
      );
      // Don't throw error here as email was already sent successfully
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async uploadToS3(
    buffer: Buffer,
    folderName: string,
    fileName: string,
  ): Promise<any> {
    try {
      const params = {
        Bucket: config.aws_s3_bucket_name,
        Key: `${folderName}/${fileName}`,
        Body: buffer,
        ContentType: "application/pdf",
      };

      const result = await this.s3.upload(params).promise();
      return result;
    } catch (error) {
      logger.error(`Error uploading NOC PDF to S3:`, error);
      throw error;
    }
  }

  private async downloadFromS3(s3Key: string): Promise<Buffer> {
    try {
      const params = {
        Bucket: config.aws_s3_bucket_name,
        Key: s3Key,
      };

      const data = await this.s3.getObject(params).promise();
      return data.Body as Buffer;
    } catch (error) {
      logger.error(`Error downloading file from S3: ${s3Key}`, error);
      throw new Error(`Failed to download file from S3: ${s3Key}`);
    }
  }

  private async prepareAttachment(
    document: DocumentRecord,
    filePrefix: string,
  ): Promise<EmailAttachment> {
    if (document.upload_platform !== "S3") {
      throw new Error(`Document not available on S3: ${document.documentFile}`);
    }

    const content = await this.downloadFromS3(document.documentFile);

    return {
      filename: `${filePrefix}_${document.documentID}.pdf`,
      content,
      contentType: "application/pdf",
    };
  }

  private async createRawEmailWithAttachments(
    from: string,
    to: string,
    subject: string,
    htmlBody: string,
    attachments: EmailAttachment[],
  ): Promise<Buffer> {
    const boundary = `boundary-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}`;

    const emailParts = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: 7bit`,
      "",
      htmlBody,
      "",
    ];

    for (const attachment of attachments) {
      emailParts.push(
        `--${boundary}`,
        `Content-Type: ${attachment.contentType}`,
        `Content-Disposition: attachment; filename="${attachment.filename}"`,
        `Content-Transfer-Encoding: base64`,
        "",
        attachment.content.toString("base64"),
        "",
      );
    }

    emailParts.push(`--${boundary}--`);

    return Buffer.from(emailParts.join("\r\n"));
  }

  public getSenderEmail(): string {
    return this.senderEmail;
  }
}
