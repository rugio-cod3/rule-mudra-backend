export interface IEMIDoc {
  totalEMI: number // Primary key
  tenure: number
  roi: number
  amount: number
  interest: number
  paidAmount: number
  repaymentAmount: number
  totalEMIs: number
  EMILeft: number
  emiBreakdown: [
    {
      month: number
      emi: number
      principal: number
      interest: number
      remainingPrincipal: number
      dueDate : Date
    },
  ]
}
