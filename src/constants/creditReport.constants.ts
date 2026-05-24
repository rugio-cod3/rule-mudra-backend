
const Status = {
    invalid: 1,
    valid: 2,
    validOld: 3,
    validNotFound: 4,
    requestWIP: 5,
  } as const;
  
 
  export const CreditReportConstants = {
    crStatus: Status,
  } as const;
  