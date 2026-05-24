export interface IFinBudValidateCreditReportResponse {
  metadata: {
    requestId: string;
    timestamp: string;
    reportType: string;
    reportFormats: FinBudReportFormats[];
    reportResponseSummary: string;
  };
  report: {
    encryptedReportJSONString: string;
    iv: string;
    reportExcelSignedUrl: {
      url: string;
      expiresAt: string;
    };
  };
}

export interface IFinBudReportRequestPayload {
  customerID: number;
  phone: number;
  email: string;
  pan: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  dateOfBirth: number;
}

export interface BureauInsightsRequest {
  userId: string;
  referenceId: string;
  rawData: string;
  monthlyIncome: number;
  leadID: string;
}

enum FinBudReportFormats {
  JSON = "JSON",
  EXCEL = "EXCEl",
}

export enum BureauType {
  EXPERIAN_SOFTPULL = "experian_softpull_json",
}
