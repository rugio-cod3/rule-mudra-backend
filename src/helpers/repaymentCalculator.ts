import { getKnexInstance } from '@/utils/mysql'
import { format, differenceInDays } from 'date-fns'
import config from "@/config/default";

interface DataCode {
  Total_Payable_Amount: number
  Remanning_Amount: number
  RepayDate: string
}

export const checkRepaymentAmount = async (
  leadID: number,
): Promise<DataCode> => {
  const dpd_Intrest = +config.dpdInterest
  let dpd_days = 0
  let remainingDays = 0
  let total_amount = 0
  let sanction_intrest = 0
  let delay_intrest = 0
  let collectionAmount = 0
  const DataCode: DataCode = {
    Total_Payable_Amount: 0,
    Remanning_Amount: 0,
    RepayDate: '0000-00-00',
  }
  const now = new Date()
  const curr_date = new Date()
  let db = getKnexInstance()
  const data = await db('leads')
    .select('leads.*', 'customer.*', 'approval.*', 'loan.*')
    .join('customer', 'leads.customerID', '=', 'customer.customerID')
    .join('approval', 'leads.leadID', '=', 'approval.leadID')
    .join('loan', 'leads.leadID', '=', 'loan.leadID')
    .where('leads.leadID', leadID)
    .whereIn('leads.status', ['Disbursed', 'Part Payment'])
    .first()

  if (data) {
    const re_pay_date = new Date(data.repayDate)
    const datediff2 = differenceInDays(re_pay_date, now)

    if (datediff2 > 0) {
      remainingDays = datediff2
      dpd_days = 0
    } else {
      remainingDays = 0
      dpd_days = Math.abs(datediff2)
    }

    const disbursalDate = new Date(data.disbursalDate)

    const tenure = differenceInDays(
      curr_date > re_pay_date ? re_pay_date : curr_date,
      disbursalDate,
    )
    sanction_intrest = data.disbursalAmount * (+config.rate_of_interest / 100) * tenure

    const collection = await db('collection')
      .where('customerID', data.customerID)
      .where('leadID', data.leadID)
      .where('loanNo', data.loanNo)
      .where('status', 'Part Payment')
      .where('collectionStatus', 'Approved')
      .select('collectionID', 'collectedAmount', 'status')
      .orderBy('collectionID', 'desc')

    if (collection.length > 0) {
      for (const collec of collection) {
        collectionAmount += collec.collectedAmount
      }

      if (curr_date > re_pay_date) {
        const delay_tenure = differenceInDays(curr_date, re_pay_date)
        dpd_days = delay_tenure
        delay_intrest = data.disbursalAmount * (dpd_Intrest / 100) * dpd_days
      }
    } else {
      if (curr_date > re_pay_date) {
        const delay_tenure = differenceInDays(curr_date, re_pay_date)
        dpd_days = delay_tenure
        delay_intrest = data.disbursalAmount * (dpd_Intrest / 100) * dpd_days
      }
    }

    total_amount = data.disbursalAmount + sanction_intrest + delay_intrest
    const Remanning_Amount = total_amount - collectionAmount

    DataCode.Total_Payable_Amount = total_amount
    DataCode.Remanning_Amount = Remanning_Amount
    DataCode.RepayDate = format(re_pay_date, 'yyyy-MM-dd')
  }

  return DataCode
}
