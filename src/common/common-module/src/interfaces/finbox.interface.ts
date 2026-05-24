export interface IFinboxBankConnectPayload {
    link_id: string
    redirect_url: string
    logo_url: string
  }
  
  export interface IFinboxApiCallResponse {
    is_success: boolean
    apimsg: Record<any, any>
  }
  
  export interface IBankConnectIdentityReportPayload {
    entityId: string
  }
  
  export interface IIdentityAccount {
    account_category: string
    account_id: string
    account_number: string
    account_opening_date: string | null
    bank: string
    credit_limit: number
    ifsc: string
    micr: string
    missing_data: Array<any>
    od_limit: number
    statements: string[]
    months: string[]
    name: string
    address: string
    country_code: string
    currency_code: string
    last_updated: string
  }
  