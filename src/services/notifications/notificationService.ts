// import { logger } from '@/utils/logger'
// import { getKnexInstance } from '@/utils/mysql'
// import { LoanAgreementTemplate } from '../email/templates/loanAgreementTemplate'

// interface LoanRecord {
//     leadID: number
//     customerID: number
//     loanNo: string
//     disbursalAmount: number
//     disbursalDate: string
// }

// interface CustomerRecord {
//     customerID: number
//     name: string
//     email: string
//     mobile: string
// }

// interface NotificationRecord {
//     notificationID?: number
//     customerID: number
//     leadID: number
//     notification: string
//     type: string
//     subject: string
//     createdDate?: string
//     mtype: string
//     uid: string
//     iu_date?: string
// }

// export class NotificationService {
//     private readonly uid: string
//     private loanAgreementTemplate: LoanAgreementTemplate

//     constructor() {
//         this.uid = '858'
//         this.loanAgreementTemplate = new LoanAgreementTemplate()
//     }

//     public async checkIfNotificationExists(
//         leadID: number,
//         customerID: number,
//         subject: string
//     ): Promise<boolean> {
//         try {
//             const db = getKnexInstance()
//             const [existing] = await db('notifications')
//                 .select('notificationID')
//                 .where({
//                     leadID,
//                     customerID,
//                     type: 'Email',
//                     subject
//                 })
//                 .limit(1)

//             return !!existing
//         } catch (error) {
//             logger.error(`Error checking notification existence for leadID: ${leadID}, customerID: ${customerID}`, error)
//             throw error
//         }
//     }

//     public async createNotificationEntry(
//         loan: LoanRecord,
//         customer: CustomerRecord,
//         subject: string,
//         hasSanctionLetter: boolean = false
//     ): Promise<void> {
//         try {
//             const emailHtml = this.loanAgreementTemplate.generateHTML(loan, customer, hasSanctionLetter)
//             const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

//             const notificationData: NotificationRecord = {
//                 customerID: loan.customerID,
//                 leadID: loan.leadID,
//                 notification: emailHtml,
//                 type: 'Email',
//                 subject: subject,
//                 createdDate: currentDateTime,
//                 mtype: 'crm',
//                 uid: this.uid,
//             }

//             const db = getKnexInstance()
//             await db('notifications').insert(notificationData)

//             logger.info(`Notification entry created for leadID: ${loan.leadID}, customerID: ${loan.customerID}`)
//         } catch (error) {
//             logger.error(`Error creating notification entry for leadID: ${loan.leadID}, customerID: ${loan.customerID}`, error)
//             throw error
//         }
//     }

//     public async getNotificationHistory(
//         customerID: number,
//         type?: string,
//         limit: number = 10
//     ): Promise<NotificationRecord[]> {
//         try {
//             const db = getKnexInstance()
//             let query = db('notifications')
//                 .select('*')
//                 .where({ customerID })

//             if (type) {
//                 query = query.andWhere({ type })
//             }

//             return query
//                 .orderBy('createdDate', 'desc')
//                 .limit(limit)
//         } catch (error) {
//             logger.error(`Error fetching notification history for customerID: ${customerID}`, error)
//             throw error
//         }
//     }

//     public async createGenericNotification(
//         customerID: number,
//         leadID: number,
//         notification: string,
//         type: string,
//         subject: string,
//         mtype: string = 'crm'
//     ): Promise<void> {
//         try {
//             const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

//             const notificationData: NotificationRecord = {
//                 customerID,
//                 leadID,
//                 notification,
//                 type,
//                 subject,
//                 createdDate: currentDateTime,
//                 mtype,
//                 uid: this.uid,
//             }

//             const db = getKnexInstance()
//             await db('notifications').insert(notificationData)

//             logger.info(`Generic notification created for customerID: ${customerID}, leadID: ${leadID}, type: ${type}`)
//         } catch (error) {
//             logger.error(`Error creating generic notification for customerID: ${customerID}, leadID: ${leadID}`, error)
//             throw error
//         }
//     }
// }

import { logger } from "@/utils/logger";
import { getKnexInstance } from "@/utils/mysql";

interface ClosedLeadRecord {
  leadID: number;
  customerID: number;
  status: string;
  closedDate?: string;
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
  status?: string;
}

interface NotificationRecord {
  notificationID?: number;
  leadID: number;
  customerID: number;
  notification: string;
  type: string;
  subject: string;
  createdDate: Date;
  mtype: string;
  uid?: string;
}

export class NotificationService {
  constructor() {}

  public async checkIfNotificationExists(
    leadID: number,
    customerID: number,
    subject: string
  ): Promise<boolean> {
    try {
      const db = getKnexInstance();

      const existingNotification = await db("notifications")
        .select("notificationID")
        .where({
          leadID,
          customerID,
          subject,
        })
        .first();

      return !!existingNotification;
    } catch (error) {
      logger.error(
        `Error checking notification existence for leadID: ${leadID}, customerID: ${customerID}:`,
        error
      );
      throw error;
    }
  }

  public async createNocNotificationEntry(
    lead: ClosedLeadRecord,
    customer: CustomerRecord,
    loan: LoanRecord,
    subject: string
  ): Promise<void> {
    try {
      const db = getKnexInstance();
      const notificationData: Omit<
        NotificationRecord,
        "notificationID" | "uid"
      > = {
        leadID: lead.leadID,
        customerID: customer.customerID,
        notification: `NO DUES CERTIFICATE sent to ${customer.email} for loan ${loan.loanNo}`,
        type: "NOC_EMAIL",
        subject: subject,
        createdDate: new Date(),
        mtype: "crm",
      };

      await db("notifications").insert(notificationData);

      logger.info(
        `NOC notification entry created for leadID: ${lead.leadID}, customerID: ${customer.customerID}`
      );
    } catch (error) {
      logger.error(
        `Error creating NOC notification entry for leadID: ${lead.leadID}, customerID: ${customer.customerID}:`,
        error
      );
      throw error;
    }
  }

  public async createNotificationEntry(
    leadID: number,
    customerID: number,
    loanNo: string,
    subject: string,
    message: string
  ): Promise<void> {
    try {
      const db = getKnexInstance();

      const notificationData: Omit<
        NotificationRecord,
        "notificationID" | "uid"
      > = {
        leadID,
        customerID,
        notification: message,
        type: "SANCTION_EMAIL",
        subject,
        createdDate: new Date(),
        mtype: "crm",
      };

      await db("notifications").insert(notificationData);

      logger.info(
        `Notification entry created for leadID: ${leadID}, customerID: ${customerID}`
      );
    } catch (error) {
      logger.error(
        `Error creating notification entry for leadID: ${leadID}, customerID: ${customerID}:`,
        error
      );
      throw error;
    }
  }

  public async getNotificationsByCustomer(
    customerID: number
  ): Promise<NotificationRecord[]> {
    try {
      const db = getKnexInstance();

      return await db("notifications")
        .select("*")
        .where({ customerID })
        .orderBy("createdDate", "desc"); // Adjusted field name to 'createdDate'
    } catch (error) {
      logger.error(
        `Error fetching notifications for customerID: ${customerID}:`,
        error
      );
      throw error;
    }
  }

  public async getNotificationsByLead(
    leadID: number
  ): Promise<NotificationRecord[]> {
    try {
      const db = getKnexInstance();

      return await db("notifications")
        .select("*")
        .where({ leadID })
        .orderBy("createdDate", "desc"); // Adjusted field name to 'createdDate'
    } catch (error) {
      logger.error(
        `Error fetching notifications for leadID: ${leadID}:`,
        error
      );
      throw error;
    }
  }

  public async deleteNotification(notificationID: number): Promise<void> {
    try {
      const db = getKnexInstance();

      await db("notifications").where({ notificationID }).del();

      logger.info(`Notification deleted for notificationID: ${notificationID}`);
    } catch (error) {
      logger.error(
        `Error deleting notification for notificationID: ${notificationID}:`,
        error
      );
      throw error;
    }
  }
}
