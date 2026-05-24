export interface ICustomerAppVersion {
    id?: number;             
    mobile: number;         
    customerID: number;     
    appVersion: string;    
    created_at?: Date;       
  }
  
  export type TSelectCustomerAppVersion = keyof ICustomerAppVersion;
  