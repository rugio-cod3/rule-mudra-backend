import { leadModel } from "@/database/mysql/leads";
import { logger } from "@/utils/logger";
import { getKnexInstance } from "@/utils/mysql";
import { EmailService } from "../../email/emailService";
import { NotificationService } from "../../notifications/notificationService";

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

export class LoanAgreementJob {
  private emailService: EmailService;
  private notificationService: NotificationService;
  private readonly emailSubject: string;

  constructor() {
    this.emailService = new EmailService();
    this.notificationService = new NotificationService();
    this.emailSubject =
      "Your Loan Agreement & Sanction Letter - Yashik Finlease Private Limited";
  }

  public async execute(): Promise<void> {
    try {
      logger.info("Starting loan agreement email job execution");

      const disbursedLoans = await this.getDisbursedLoans();

      if (disbursedLoans.length === 0) {
        logger.info("No disbursed loans found for processing");
        return;
      }

      logger.info(`Found ${disbursedLoans.length} disbursed loans to process`);

      for (const loan of disbursedLoans) {
        await this.processLoan(loan);
      }

      logger.info("Loan agreement email job execution completed");
    } catch (error) {
      logger.error("Error in loan agreement email job execution:", error);
      throw error;
    }
  }

  private async getDisbursedLoans(): Promise<LoanRecord[]> {
    const db = getKnexInstance();
    return db("loan")
      .select(
        "leadID",
        "customerID",
        "loanNo",
        "disbursalAmount",
        "disbursalDate"
      )
      .where({ status: "Disbursed", payout_status: 2 });
  }

  private async getCustomerDetails(
    customerID: number
  ): Promise<CustomerRecord | null> {
    const db = getKnexInstance();
    const [customer] = await db("customer")
      .select("customerID", "name", "email", "mobile")
      .where({ customerID })
      .limit(1);

    return customer || null;
  }

  private async getAgreementDocument(
    leadID: number,
    customerID: number
  ): Promise<DocumentRecord | null> {
    const db = getKnexInstance();
    let [document] = await db("document")
      .select(
        "documentID",
        "documentFile",
        "documentType",
        "type",
        "upload_platform"
      )
      .where({
        leadID,
        customerID,
        type: "Agreement",
        status: "Verified",
      })
      .limit(1);

    if (!document) {
      [document] = await db("document")
        .select(
          "documentID",
          "documentFile",
          "documentType",
          "type",
          "upload_platform"
        )
        .where({
          customerID,
          type: "Agreement",
          status: "Verified",
        })
        .orderBy("uploadedDate", "desc")
        .limit(1);
    }

    return document || null;
  }

  private async getSanctionDocument(
    leadID: number,
    customerID: number
  ): Promise<DocumentRecord | null> {
    const db = getKnexInstance();
    let [document] = await db("document")
      .select(
        "documentID",
        "documentFile",
        "documentType",
        "type",
        "upload_platform"
      )
      .where({
        leadID,
        customerID,
        type: "Sanction",
        documentType: "Sanction",
        status: "Verified",
      })
      .limit(1);

    if (!document) {
      [document] = await db("document")
        .select(
          "documentID",
          "documentFile",
          "documentType",
          "type",
          "upload_platform"
        )
        .where({
          customerID,
          type: "Sanction",
          documentType: "Sanction",
          status: "Verified",
        })
        .orderBy("uploadedDate", "desc")
        .limit(1);
    }

    return document || null;
  }

  private async processLoan(loan: LoanRecord): Promise<void> {
    try {
      logger.info(
        `Processing loan for leadID: ${loan.leadID}, customerID: ${loan.customerID}`
      );

      const customer = await this.getCustomerDetails(loan.customerID);
      if (!customer?.email) {
        logger.warn(
          `No customer email found for customerID: ${loan.customerID}`
        );
        return;
      }

      const agreementDocument = await this.getAgreementDocument(
        loan.leadID,
        loan.customerID
      );
      if (!agreementDocument) {
        logger.warn(
          `No agreement document found for leadID: ${loan.leadID}, customerID: ${loan.customerID}`
        );
        return;
      }

      const sanctionDocument = await this.getSanctionDocument(
        loan.leadID,
        loan.customerID
      );
      if (!sanctionDocument) {
        logger.warn(
          `No sanction document found for leadID: ${loan.leadID}, customerID: ${loan.customerID}. Will proceed with agreement only.`
        );
      }
      const getLeadInfo = await leadModel.findOne({
        where: {
          leadID: loan.leadID,
        },
      });
      const lenderID = getLeadInfo?.lenderID;
      const emailAlreadySent =
        await this.notificationService.checkIfNotificationExists(
          loan.leadID,
          loan.customerID,
          lenderID == 2
            ? "Your Loan Agreement & Sanction Letter - Nandanvan Investments Ltd"
            : "Your Loan Agreement & Sanction Letter - Yashik Finlease Private Limited"
        );

      if (emailAlreadySent) {
        logger.info(
          `Email already sent for leadID: ${loan.leadID}, customerID: ${loan.customerID}`
        );
        return;
      }

      try {
        await this.emailService.sendLoanAgreementEmail(
          loan,
          customer,
          agreementDocument,
          sanctionDocument
        );

        await this.notificationService.createNotificationEntry(
          loan.leadID,
          loan.customerID,
          loan.loanNo,
          lenderID == 2
            ? "Your Loan Agreement & Sanction Letter - Nandanvan Investments Ltd"
            : "Your Loan Agreement & Sanction Letter - Yashik Finlease Private Limited",
          `Loan agreement email sent to ${customer.email} for loan ${loan.loanNo}` // message: string
        );

        logger.info(
          `Successfully processed loan agreement email for leadID: ${loan.leadID}`
        );
      } catch (emailError: any) {
        if (
          emailError.code === "MessageRejected" &&
          emailError.message.includes("Sending paused")
        ) {
          logger.error(
            `AWS SES account is paused. Cannot send emails. Please check AWS SES console.`
          );
          throw new Error(
            "AWS SES account is paused - stopping cron job execution"
          );
        }
        throw emailError;
      }
    } catch (error) {
      logger.error(`Error processing loan ${loan.leadID}:`, error);
      if (
        error instanceof Error &&
        error.message.includes("AWS SES account is paused")
      ) {
        throw error;
      }
    }
  }
}
