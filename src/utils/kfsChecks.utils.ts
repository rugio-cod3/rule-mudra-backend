// import { leadApiLogService } from "@/services/leadApiLog.service";
// import { customerService } from "@/services/customer.service";
// import { getKnexInstance } from "@/database/knex";
// import { logger } from "@/utils/logger";
// import { matchPanAadhaarDob, getNameMatchPercentage } from "@/utils/helper";
// import { LeadLogApiType } from "@/enums/leadApiLog.enum";

// interface KfsCheckData {
//     customerID: number;
//     mobile: string;
//     leadID: number;
//     emandateID?: number;
//     loanAmtApproved?: number;
// }

// interface KfsCheckResults {
//     success: boolean;
//     checks: {
//         pan_aadhar_check: boolean;
//         selfie_check: boolean;
//         penny_drop_name_check: boolean;
//         all_lead_check: boolean;
//     };
//     details?: {
//         pan_aadhar_check?: string;
//         selfie_check?: string;
//         penny_drop_name_check?: string;
//         all_lead_check?: string;
//     };
// }

// export class KfsChecksService {

//     async performKfsChecks(data: KfsCheckData): Promise<KfsCheckResults> {
//         const results: KfsCheckResults = {
//             success: false,
//             checks: {
//                 pan_aadhar_check: false,
//                 selfie_check: false,
//                 penny_drop_name_check: false,
//                 all_lead_check: false,
//             },
//             details: {}
//         };

//         try {
//             // Run all checks
//             results.checks.pan_aadhar_check = await this.checkPanAadharDobLastDigit(data);
//             results.checks.selfie_check = await this.checkCustomerSelfie(data);
//             results.checks.penny_drop_name_check = await this.checkPennyDropNameMatch70p(data);
//             results.checks.all_lead_check = await this.checkAllLeadStatus(data);

//             // Overall success if all checks pass
//             results.success = Object.values(results.checks).every(check => check === true);

//             logger.info(`[KfsChecks] Results for customerID ${data.customerID}:`, results);

//             return results;
//         } catch (error) {
//             logger.error(`[KfsChecks] Error checking KFS for customerID ${data.customerID}:`, error);
//             results.details = {
//                 error: `KFS checks failed: ${error.message}`
//             };
//             return results;
//         }
//     }

//     private async checkPanAadharDobLastDigit(data: KfsCheckData): Promise<boolean> {
//         try {
//             const { customerID } = data;

//             // Get customer info
//             const customer = await customerService.findOne({ customerID });
//             if (!customer || !customer.aadharNo) {
//                 return false;
//             }

//             // Get PAN comprehensive response
//             const panLeadApiLogData = await leadApiLogService.findPanComprehensiveResponseByCustomerID(customerID);
//             if (!panLeadApiLogData) {
//                 return false;
//             }

//             // Get Aadhaar response
//             const aadhaarLeadApiLogData = await leadApiLogService.findOne(
//                 {
//                     customerID,
//                     api_type: LeadLogApiType.SUREPASS_DIGILOCKER_EAADHAAR
//                 },
//                 ["api_response"],
//                 [{ column: "id", order: "desc" }]
//             );

//             if (!aadhaarLeadApiLogData || !aadhaarLeadApiLogData.api_response) {
//                 return false;
//             }

//             const aadhaarResponse = JSON.parse(aadhaarLeadApiLogData.api_response);
//             if (!aadhaarResponse?.UidData) {
//                 return false;
//             }

//             const { UidData } = aadhaarResponse;
//             const { Poi } = UidData;
//             const aadhaarName = Poi?.["$"]?.name || "";
//             const aadhaarDob = Poi?.["$"]?.dob || "";

//             if (!aadhaarName || !panLeadApiLogData.full_name || !aadhaarDob || !panLeadApiLogData.dob) {
//                 return false;
//             }

//             // Check DOB match
//             const dobMatchResponse = await matchPanAadhaarDob(aadhaarDob, panLeadApiLogData.dob);
//             if (!dobMatchResponse) {
//                 return false;
//             }

//             // Check last 4 digits of Aadhaar
//             if (!customer.aadharNo || customer.aadharNo.slice(-4) !== panLeadApiLogData.masked_aadhaar.slice(-4)) {
//                 return false;
//             }

//             // Check name match percentage
//             const nameMatchResponse = await getNameMatchPercentage(
//                 panLeadApiLogData.full_name,
//                 aadhaarName
//             );

//             return nameMatchResponse > 80;
//         } catch (error) {
//             logger.error(`[checkPanAadharDobLastDigit] Error for customerID ${data.customerID}:`, error);
//             return false;
//         }
//     }

//     private async checkCustomerSelfie(data: KfsCheckData): Promise<boolean> {
//         try {
//             const { customerID, leadID } = data;

//             // Check if selfie verification exists and passed
//             const selfieApiLog = await leadApiLogService.findOne(
//                 {
//                     customerID,
//                     leadID,
//                     api_type: LeadLogApiType.SUREPASS_FACE_MATCH,
//                     status: 1
//                 },
//                 ["api_response"],
//                 [{ column: "id", order: "desc" }]
//             );

//             if (!selfieApiLog || !selfieApiLog.api_response) {
//                 return false;
//             }

//             const selfieResponse = JSON.parse(selfieApiLog.api_response);
//             return selfieResponse?.match_status === true && selfieResponse?.confidence >= 80;
//         } catch (error) {
//             logger.error(`[checkCustomerSelfie] Error for customerID ${data.customerID}:`, error);
//             return false;
//         }
//     }

//     private async checkPennyDropNameMatch70p(data: KfsCheckData): Promise<boolean> {
//         try {
//             const { customerID } = data;
//             const db = getKnexInstance();

//             // Check if there's a penny drop name match record with acceptable percentage
//             const pennyNameMatch = await db('customer_name_match')
//                 .where('customer_id', customerID)
//                 .where('type', 'penny - pancard')
//                 .orderBy('id', 'desc')
//                 .first();

//             if (!pennyNameMatch || !pennyNameMatch.percentage) {
//                 return false;
//             }

//             const percentage = parseFloat(pennyNameMatch.percentage);
//             return percentage >= 70;
//         } catch (error) {
//             logger.error(`[checkPennyDropNameMatch70p] Error for customerID ${data.customerID}:`, error);
//             return false;
//         }
//     }

//     private async checkAllLeadStatus(data: KfsCheckData): Promise<boolean> {
//         try {
//             const { customerID, mobile } = data;

//             if (!customerID || !mobile) {
//                 return false;
//             }

//             const db = getKnexInstance();

//             // Check leads table for blocked statuses
//             const [leads] = await db.raw(
//                 `SELECT * FROM leads 
//          WHERE customerID = ? 
//          AND status IN ('Disbursed', 'Part Payment', 'Settlement', 'Blacklisted') 
//          LIMIT 1`,
//                 [customerID]
//             );

//             // Check blacklistCustomer table
//             const [blacklist] = await db.raw(
//                 `SELECT * FROM blacklistCustomer 
//          WHERE mobile = ? 
//          LIMIT 1`,
//                 [mobile]
//             );

//             // Return true only if no blocked leads and not blacklisted
//             return leads.length === 0 && blacklist.length === 0;
//         } catch (error) {
//             logger.error(`[checkAllLeadStatus] Error for customerID ${data.customerID}:`, error);
//             return false;
//         }
//     }
// }

// // Export singleton instance
// export const kfsChecksService = new KfsChecksService();

// // Utility function for easy access
// export const performKfsChecks = async (data: KfsCheckData): Promise<KfsCheckResults> => {
//     return kfsChecksService.performKfsChecks(data);
// };