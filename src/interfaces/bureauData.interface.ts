export interface IBureauDataModel {
  id?: number
  customerID: number
  leadID: number
  reference_id: string
  affordability_generic: number
  predicted_income: number
  predicted_affordability: number
  Decision: string
  LoanAmount: number
  version: string
  createdDate?: Date
}

export type TSelectBureauData = keyof IBureauDataModel

export interface BureauBankingRequestBody {
  bankconnectId?: number
  auth_token: string
  client_id: string
  rules_output: {
    bureau: {
      Decision: string
      LoanAmount: number | null
      version: string
    }
  }
  input_data: {
    user_id: string
    reference_id: string
    fetched_timestamp: Date
    external: {
      bankconnect: string // Assuming predictorsOutPut.apimsg is a string
    }
  }
}

export interface IBureauBankingResponse {
  output_data?: {
    input_data?: {
      reference_id?: string
      external?: {
        bankconnect?: {
          entity_id?: string
        }
      }
    }
    rules_output?: {
      bank?: {
        Decision?: string // Assuming Decision is a string, adjust if it's a different type
        LoanAmount?: string
      }
    }
  }
}
export interface ICibilData {
  api_response: string
  email: string
  customerID: string
  id: number
}

export interface IOutput {
  Decision: string
  offerAmount: number
}

export interface IOutputStatus {
  status: string
  message: string
  score?: number
}

export interface IDtreeBreResponse {
  status: string
  message: string
  rejectReason?: string
}
