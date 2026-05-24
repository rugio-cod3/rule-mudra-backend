// services/cronJobs/jobs/nocEmailJob.ts
import { leadModel } from "@/database/mysql/leads";
import { logger } from "@/utils/logger";
import { getKnexInstance } from "@/utils/mysql";
import { EmailService } from "../../email/emailService";
import { NotificationService } from "../../notifications/notificationService";

interface ClosedLeadRecord {
  leadID: number;
  customerID: number;
  status: string;
}

interface CustomerRecord {
  customerID: number;
  name: string;
  email: string;
  mobile: string;
}

interface LoanRecord {
  leadID: number;
  customerID: number;
  loanNo: string;
  disbursalAmount: number;
  disbursalDate: string;
  status: string;
}

interface NocData {
  lead: ClosedLeadRecord;
  customer: CustomerRecord;
  loan: LoanRecord;
}

export class NocEmailJob {
  private emailService: EmailService;
  private notificationService: NotificationService;
  private readonly emailSubject: string;

  constructor() {
    this.emailService = new EmailService();
    this.notificationService = new NotificationService();
    this.emailSubject = "NO DUES CERTIFICATE - Yashik Finlease Private Limited";
  }

  public async execute(): Promise<void> {
    try {
      logger.info("Starting NOC email job execution");

      const closedLeads = await this.getClosedLeads();

      if (closedLeads.length === 0) {
        logger.info("No closed leads found for NOC processing");
        return;
      }

      logger.info(
        `Found ${closedLeads.length} closed leads to process for NOC`
      );

      for (const lead of closedLeads) {
        await this.processClosedLead(lead);
      }

      logger.info("NOC email job execution completed");
    } catch (error) {
      logger.error("Error in NOC email job execution:", error);
      throw error;
    }
  }

  private async getClosedLeads(): Promise<ClosedLeadRecord[]> {
    const db = getKnexInstance();
    return db("leads")
      .select("leadID", "customerID", "status")
      .where({ status: "Closed" })
      .whereNotNull("customerID");
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

  private async getLoanDetails(
    leadID: number,
    customerID: number
  ): Promise<LoanRecord | null> {
    const db = getKnexInstance();
    const [loan] = await db("loan")
      .select(
        "leadID",
        "customerID",
        "loanNo",
        "disbursalAmount",
        "disbursalDate",
        "status"
      )
      .where({ leadID, customerID })
      .limit(1);

    return loan || null;
  }

  private async processClosedLead(lead: ClosedLeadRecord): Promise<void> {
    try {
      logger.info(
        `Processing closed lead for leadID: ${lead.leadID}, customerID: ${lead.customerID}`
      );

      // Get customer details
      const customer = await this.getCustomerDetails(lead.customerID);
      if (!customer?.email) {
        logger.warn(
          `No customer email found for customerID: ${lead.customerID}`
        );
        return;
      }

      // Get loan details
      const loan = await this.getLoanDetails(lead.leadID, lead.customerID);
      if (!loan) {
        logger.warn(
          `No loan found for leadID: ${lead.leadID}, customerID: ${lead.customerID}`
        );
        return;
      }

      const getLeadInfo = await leadModel.findOne({
        where: {
          leadID: loan.leadID,
        },
      });
      const lenderID = getLeadInfo?.lenderID;

      // Check if NOC email already sent
      const nocAlreadySent =
        await this.notificationService.checkIfNotificationExists(
          lead.leadID,
          lead.customerID,
          lenderID == 2
            ? "NO DUES CERTIFICATE - Nandanvan Investments Ltd"
            : "NO DUES CERTIFICATE - Yashik Finlease Private Limited"
        );

      if (nocAlreadySent) {
        logger.info(
          `NOC email already sent for leadID: ${lead.leadID}, customerID: ${lead.customerID}`
        );
        return;
      }

      // Prepare NOC data
      const nocData: NocData = {
        lead,
        customer,
        loan,
      };

      // Send NOC email
      try {
        await this.emailService.sendNocEmail(nocData);

        // Create notification entry
        await this.notificationService.createNocNotificationEntry(
          lead,
          customer,
          loan,
          lenderID == 2
            ? "NO DUES CERTIFICATE - Nandanvan Investments Ltd"
            : "NO DUES CERTIFICATE - Yashik Finlease Private Limited"
        );

        logger.info(
          `Successfully processed NOC email for leadID: ${lead.leadID}`
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
      logger.error(`Error processing closed lead ${lead.leadID}:`, error);
      if (
        error instanceof Error &&
        error.message.includes("AWS SES account is paused")
      ) {
        throw error;
      }
    }
  }
}
