export interface ICustomerNameMatchModel {
    id?: number // BIGINT, should be of type number if using knex
    customer_id: number
    lead_id: number
    mobile_no:string;
    type:string;
    first_name:string;
    second_name:string
    percentage:string;
    percentage_data:string;
    status:number;
    created_at?:Date;
    is_proceed?:number;
  }
  
  export type TSelectCustomerNameMatch = keyof ICustomerNameMatchModel