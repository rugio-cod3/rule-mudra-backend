import ResponseService from './response.service'
import config from '@/config/default'
import { IgenerateSoaPayload, ISanctionDataPayload } from '@/interfaces/soa.interface'
import puppeteer from 'puppeteer';
import path from 'path';
import ejs from 'ejs';
import { Readable } from 'stream';
import axios from 'axios';
import moment from 'moment-timezone'
import { IServiceResponse } from '@/interfaces/service.interface';
import { NotFoundError } from '@/errors';
import { customerModel } from '@/database/mysql/customer';
import { approvalModel } from '@/database/mysql/approval';
import { razorpayMandateModel } from '@/database/mysql/razorpay_mandate';
import { documentModel } from '@/database/mysql/document';
import CreditService from './credit.service';
import LeadService from './lead.service';
import CustomerAccountService from './customerAccount.service';
import S3Service from './thirdParty/s3.service';

class SoaService extends ResponseService {

  private readonly leadService = new LeadService()
  private readonly customerModel = customerModel
  private readonly approvalModel = approvalModel
  private readonly razorpayMandateModel = razorpayMandateModel
  private readonly documentModel = documentModel
  private customerAccountService = new CustomerAccountService()
  private creditService = new CreditService();
  private readonly s3Service = new S3Service()



  async convertImageUrlToBase64(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      return `data:image/jpeg;base64,${base64Image}`;
    } catch (error) {
      console.error('Error fetching or encoding image:', error);
      throw error;
    }
  }

  async generatePdf(payload: IgenerateSoaPayload): Promise<Readable> {
    return new Promise(async (resolve, reject) => {
      try {
        const templatePath = path.resolve(__dirname, '../views/loansDocs/soa.ejs');
        const { leadID, data } = payload;
        const htmlContent = await ejs.renderFile(templatePath, { data });

        // Launch Puppeteer to generate PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the HTML content
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF buffer
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        // Convert the buffer to a readable stream
        const pdfStream = new Readable();
        pdfStream.push(pdfBuffer);
        pdfStream.push(null);

        resolve(pdfStream);
      } catch (err) {
        reject(err);
      }
    });
  }

  async sectionData(
    payload: ISanctionDataPayload,
  ): Promise<IServiceResponse> {

    const { leadID, customerID } = payload
    let customer = await this.customerModel.findOneCustomer({ customerID }, ['*'])
    if (!customer) {
      throw new NotFoundError('Customer not found')
    }
    let lead = await this.leadService.findOne({ leadID }, ['*']);
    if (!lead) {
      throw new NotFoundError('Lead not found')
    }
    let approval = await this.approvalModel.findOneApproval({ customerID, leadID }, ['roi', 'repayDate', 'loanAmtApproved', 'createdDate']);
    if (!approval) {
      throw new NotFoundError('Approval not found')
    }
    let credit = await this.creditService.findOne({ customerID, leadID }, ['tenure']);
    if (!credit) {
      throw new NotFoundError('Credit not found')
    }
    let bankName = '';
    let accountNo = '';
    let bankIfsc = '';
    let razorpayMandate = await this.razorpayMandateModel.findOne({ where: { "id": lead.em_id, "customerID": String(customerID) } })

    if (razorpayMandate) {
      bankName = razorpayMandate.bank;
      accountNo = razorpayMandate.accountNo;
      bankIfsc = razorpayMandate.ifsc;
    } else {
      let customerAccount = await this.customerAccountService.findOne({ customerID }, { orderKey: 'accountID', orderValue: 'desc' }, ['accountNo', 'bankIfsc', 'bank']);
      if (customerAccount) {
        bankName = customerAccount.bank;
        accountNo = customerAccount.accountNo;
        bankIfsc = customerAccount.bankIfsc;
      } else {
        throw new NotFoundError('CustomerAccount not found')
      }
    }

    let res = {
      "date": moment(approval.createdDate).format('DD-MM-YYYY'),
      "name": customer.name ? customer.name : '',
      "bankName": bankName,
      "accountNo": accountNo,
      "ifsc": bankIfsc,
      "loanAmount": approval.loanAmtApproved ? approval.loanAmtApproved : '',
      "tenure": credit.tenure ? credit.tenure : '',
      "roi": +config.rate_of_interest,
      "repaymentDate": approval.repayDate ? moment(approval.repayDate).format('DD-MM-YYYY') : '',
      "penalRoi": +config.rate_of_interest + parseFloat((0.1 * 365).toFixed(2)),
    };

    return this.serviceResponse(200, res, 'Sanction data retreived successfully.')
  }

  async generateSectionPdf(payload: ISanctionDataPayload): Promise<Readable> {
    return new Promise(async (resolve, reject) => {
      try {
        let sectionData = await this.sectionData(payload);
        if (!sectionData) {
          throw new NotFoundError('Section page data not found.')
        }
        const templatePath = path.resolve(__dirname, '../views/loansDocs/sanction.ejs');
        const htmlContent = await ejs.renderFile(templatePath, { data: sectionData.data });

        // Convert the S3 image URLs to base64
        const headerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg';
        const footerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg';

        const headerImage = await this.convertImageUrlToBase64(headerUrl);
        const footerImage = await this.convertImageUrlToBase64(footerUrl);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
          format: 'A4',
          displayHeaderFooter: true,
          headerTemplate: `<div class="header" style="width: 100%; text-align: center;">
            <img src="${headerImage}" style="width:100%; max-height:150px; margin-top: -20px">
          </div>`,
          footerTemplate: `<div class="footer" style="width: 100%; text-align: center;">
            <img src="${footerImage}" style="width:100%; max-height:150px; margin-bottom: -18px">
          </div>`,
          margin: {
            top: '150px',
            bottom: '100px',
          },
        });

        await browser.close();
        if (pdfBuffer) {
          let s3FolderName = 'documents/sanction/' + payload.customerID;
          let imageName = 'sanction_' + Math.floor(Date.now() / 1000) + '.pdf';
          let res = await this.s3Service.uploadDocument(pdfBuffer, s3FolderName, imageName)

          if (res && res?.Key !== null && res.Key !== '') {
            await this.documentModel.insert({
              "customerID": payload.customerID,
              "type": "Sanction",
              "documentType": "Sanction",
              "documentFile": res.Key,
              "status": "Verified",
              "uploadBy": payload.customerID,
              "uploadedDate": moment().format('YYYY-MM-DD HH:mm:ss'),
              "verifiedBy": payload.customerID,
              "verifiedDate": moment().format('YYYY-MM-DD HH:mm:ss'),
              "upload_platform": 'S3'
            });
          }
        }

        // Convert the buffer to a readable stream
        const pdfStream = new Readable();
        pdfStream.push(pdfBuffer);
        pdfStream.push(null);

        resolve(pdfStream);
      } catch (err) {
        reject(err);
      }
    });
  }

}

export const soaService = new SoaService()
