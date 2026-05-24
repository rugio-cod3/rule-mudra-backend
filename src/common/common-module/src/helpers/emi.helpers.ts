import { differenceInCalendarDays } from 'date-fns'
class EMIHelper {
  async emiGenerator(
    Principal: number,
    ROI: number,
    Tenure: number,
    dueDate?: Date,
    disbursalDate?: Date,
  ): Promise<{}> {
    let monthlyInterestRate = ROI / 12 / 100
    let totalMonths = Tenure
    let bpiCharges = 0
    let monthlyBpiCharges = 0
    if (dueDate && disbursalDate) {
      bpiCharges = await this.bpiCalculator(Principal, ROI, dueDate, disbursalDate)
    } else if (dueDate) {
      bpiCharges = await this.bpiCalculator(Principal, ROI, dueDate)
    }

    monthlyBpiCharges = Math.floor(bpiCharges / Tenure)
    let lastEmiAdjustment = bpiCharges - monthlyBpiCharges * Tenure

    let Emi =
      Math.round(
        (Principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
          (Math.pow(1 + monthlyInterestRate, totalMonths) - 1),
      ) + monthlyBpiCharges
    let remainingPrincipal = Principal

    let emiBreakdown = []

    let totalRepaymentAmount = 0
    let totalInterest = 0

    for (let month = 1; month <= totalMonths; month++) {
      let monthlyInterest = Math.round(remainingPrincipal * monthlyInterestRate) + monthlyBpiCharges
      let monthlyPrincipal = Emi - monthlyInterest

      if (month === totalMonths) {
        monthlyPrincipal = remainingPrincipal
        let lastEmi = monthlyPrincipal + monthlyInterest + lastEmiAdjustment
        emiBreakdown.push({
          month: month,
          openingBalance: remainingPrincipal,
          emi: Math.round(lastEmi),
          principal: Math.round(monthlyPrincipal),
          interest: Math.round(monthlyInterest) + lastEmiAdjustment,
          remainingPrincipal: 0,
        })

        totalRepaymentAmount += Math.round(lastEmi)
        totalInterest += Math.round(monthlyInterest)
        break
      }
      let openingBalance = remainingPrincipal
      remainingPrincipal -= monthlyPrincipal
      emiBreakdown.push({
        month: month,
        openingBalance: openingBalance,
        emi: Math.round(Emi),
        principal: Math.round(monthlyPrincipal),
        interest: Math.round(monthlyInterest),
        remainingPrincipal: Math.round(remainingPrincipal),
      })
      totalRepaymentAmount += Math.round(Emi)
      totalInterest += Math.round(monthlyInterest)
    }

    // Construct the object with all the EMI details
    let emiDocument = {
      totalEMI: Math.round(Emi),
      tenure: totalMonths,
      roi: ROI,
      amount: Math.round(Principal),
      interest: Math.round(totalInterest) + lastEmiAdjustment,
      paidAmount: 0, // Initially, nothing has been paid yet
      repaymentAmount: Math.round(totalRepaymentAmount),
      totalEMIs: totalMonths,
      EMILeft: totalMonths,
      emiBreakdown: emiBreakdown,
    }

    // Return the detailed object
    return emiDocument
  }
  public bpiCalculator = async (
    Principal: number,
    ROI: number,
    FirstDueDate: Date,
    disbursalDateString?: Date,
  ): Promise<number> => {
    let currentDate = new Date(Date.now())
    const disbursalDate = disbursalDateString ? new Date(disbursalDateString) : currentDate
    let interestStartDate = new Date(FirstDueDate)
    interestStartDate.setMonth(interestStartDate.getMonth() - 1)
    const days = differenceInCalendarDays(interestStartDate, disbursalDate)
    let brokenPeriodIntrest = Math.round(Principal * (ROI / 100) * (days / 365))
    return Promise.resolve(brokenPeriodIntrest)
  }
  public amountCalculatorForPreClosure = async (creditID: number): Promise<number> => {
    return Promise.resolve(0)
  }
}

export default EMIHelper
export const emiHelper = new EMIHelper()
