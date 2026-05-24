import { getKnexInstance } from "../utils/mysql";
const knex = getKnexInstance();
function changeDataType(value, type = 0) {
  if (type === 1) {
    return parseInt(value, 10);
  }
  return String(value).toLowerCase() === "na" ? "" : String(value);
}

export async function calculate_repay_amount_ipc(
  leadID: string,
  calculateDate: string | null = null
): Promise<any> {
  let total_amount = 0;
  let sanction_tenure = 0;
  let dpd_tenure = 0;
  let sanction_roi = 0;
  let interest = 0;
  let dpd_charges = 0;
  let principal_amount = 0;
  let penalty_bal_prev = 0;
  let interest_bal_prev = 0;
  let one_time_penality_charge = 0;
  interface DataCodeType {
    Total_Payable_Amount: number;
    RepayDate: string;
    total_interest: number;
    dpd_charges: number;
    principal_amount: number;
    Total_Amount: number;
  }
  let DataCode: Partial<DataCodeType> = {};
  const curr_date = new Date().toISOString().slice(0, 10);
  const callculate_on_date = calculateDate || curr_date;
  const knex = getKnexInstance();
  // fetch data

  //   const leadService = new LeadService();
  //   let lead = await leadService.findOneLead({
  //     where: {
  //       customerID,
  //     },
  //     order: [{ column: "leadID", order: "desc" }],
  //     select: ["leadID", "status", "ipc", "fbLeads"],
  //   });
  //   let leadID = lead.leadID;

  console.log(
    "calculate_repay_amount_ipc called with leadID:",
    leadID,
    "calculateDate:",
    calculateDate
  );

  const data = await knex("leads")
    .select(
      "leads.*",
      "customer.*",
      "approval.*",
      "loan.*",
      knex.ref("leads.status").as("lead_status")
    )
    .join("customer", "leads.customerID", "customer.customerID")
    .join("approval", "leads.leadID", "approval.leadID")
    .join("loan", "leads.leadID", "loan.leadID")
    .where("leads.leadID", leadID)
    .whereIn("leads.status", ["Disbursed", "Part Payment"])
    .first();
  if (data) {
    // const re_pay_date = new Date(data.repayDate.replace(/\//g, "-"));
    const re_pay_date = new Date(data.repayDate);
    // const disbursalDate = new Date(data.disbursalDate.replace(/\//g, "-"));
    const disbursalDate = new Date(data.disbursalDate);
    principal_amount = data.disbursalAmount;
    sanction_roi = data.roi;
    // const penalty_amount = 0.1 + 0.1 * (18 / 100);
    const penalty_amount = 590;

    if (data.ipc === 1) {
      let one_time_penality_charge_for_total = 0;
      let sanction_tenure_for_total: any = 0;
      let dpd_tenure_for_total = 0;
      let total_calculated_amount_for_total = 0;

      if (new Date(callculate_on_date) <= re_pay_date) {
        sanction_tenure_for_total = changeDataType(
          Math.round(
            (new Date(callculate_on_date).getTime() - disbursalDate.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          1
        );
      } else {
        sanction_tenure_for_total = changeDataType(
          Math.round(
            (re_pay_date.getTime() - disbursalDate.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          1
        );
      }

      if (new Date(callculate_on_date) > re_pay_date) {
        dpd_tenure_for_total = Number(
          changeDataType(
            Math.round(
              (new Date(callculate_on_date).getTime() - re_pay_date.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            1
          )
        );
        one_time_penality_charge_for_total = penalty_amount;
      }

      const interest_for_total =
        principal_amount *
        (data.roi / 100) *
        (sanction_tenure_for_total + dpd_tenure_for_total);
      const dpd_charge_for_total =
        principal_amount * (0.1 / 100) * dpd_tenure_for_total +
        one_time_penality_charge_for_total;
      total_calculated_amount_for_total =
        principal_amount + interest_for_total + dpd_charge_for_total;

      // --- If Disbursed ---
      if (data.lead_status === "Disbursed") {
        if (new Date(callculate_on_date) <= re_pay_date) {
          sanction_tenure = Number(
            changeDataType(
              Math.round(
                (new Date(callculate_on_date).getTime() -
                  disbursalDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              ),
              1
            )
          );
        } else {
          sanction_tenure = Number(
            changeDataType(
              Math.round(
                (re_pay_date.getTime() - disbursalDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              ),
              1
            )
          );
        }

        if (new Date(callculate_on_date) > re_pay_date) {
          dpd_tenure = Number(
            changeDataType(
              Math.round(
                (new Date(callculate_on_date).getTime() -
                  re_pay_date.getTime()) /
                  (1000 * 60 * 60 * 24)
              ),
              1
            )
          );
          one_time_penality_charge = penalty_amount;
        }

        interest =
          principal_amount * (data.roi / 100) * (sanction_tenure + dpd_tenure);
        dpd_charges =
          principal_amount * (0.1 / 100) * dpd_tenure +
          one_time_penality_charge;

        // --- If Part Payment ---
      } else if (data.lead_status === "Part Payment") {
        const collection = await knex("collection")
          .where("customerID", data.customerID)
          .where("leadID", data.leadID)
          .where("loanNo", data.loanNo)
          .where("status", "Part Payment")
          .where("collectionStatus", "Approved")
          .orderBy("collectionID", "desc")
          .first();

        if (collection) {
          data.closing_balance = collection.closing_balance;
          principal_amount = collection.principal_amount;
          const collected_date = new Date(collection.collectedDate);
          const penalty_bal = collection.penality_charge;
          const interest_bal = collection.total_interest;
          penalty_bal_prev = penalty_bal;
          interest_bal_prev = interest_bal;

          if (penalty_bal && penalty_bal !== 0.0) {
            one_time_penality_charge = 0;
          }

          if (
            new Date(callculate_on_date) <= re_pay_date &&
            re_pay_date >= collected_date
          ) {
            sanction_tenure = Number(
              changeDataType(
                Math.round(
                  (new Date(callculate_on_date).getTime() -
                    collected_date.getTime()) /
                    (1000 * 60 * 60 * 24)
                ),
                1
              )
            );
          } else if (
            new Date(callculate_on_date) >= re_pay_date &&
            re_pay_date >= collected_date
          ) {
            sanction_tenure = Number(
              changeDataType(
                Math.round(
                  (re_pay_date.getTime() - collected_date.getTime()) /
                    (1000 * 60 * 60 * 24)
                ),
                1
              )
            );
            dpd_tenure = Number(
              changeDataType(
                Math.round(
                  (new Date(callculate_on_date).getTime() -
                    re_pay_date.getTime()) /
                    (1000 * 60 * 60 * 24)
                ),
                1
              )
            );

            one_time_penality_charge =
              !penalty_bal || penalty_bal === 0.0 ? penalty_amount : 0;
          } else if (
            new Date(callculate_on_date) >= re_pay_date &&
            re_pay_date <= collected_date
          ) {
            dpd_tenure = Number(
              changeDataType(
                Math.round(
                  (new Date(callculate_on_date).getTime() -
                    collected_date.getTime()) /
                    (1000 * 60 * 60 * 24)
                ),
                1
              )
            );
            one_time_penality_charge =
              !penalty_bal || penalty_bal === 0.0 ? penalty_amount : 0;
          }

          interest =
            principal_amount *
            (sanction_roi / 100) *
            (sanction_tenure + dpd_tenure);
          dpd_charges =
            principal_amount * (0.1 / 100) * dpd_tenure +
            one_time_penality_charge;
        }
      }

      const closing = Number(data?.closing_balance);
      const total_amount =
        (isNaN(closing) ? Number(principal_amount) : closing) +
        Number(interest) +
        Number(dpd_charges);
      // total_amount =
      //   (Number(data.closing_balance) ?? Number(principal_amount)) +
      //   Number(interest) +
      //   Number(dpd_charges);

      // Ensure total_amount is a valid number
      if (
        isNaN(total_amount) ||
        total_amount === null ||
        total_amount === undefined
      ) {
        console.error(
          "ERROR: total_amount calculation resulted in invalid value:",
          total_amount
        );
        console.error(
          "closing_balance:",
          data.closing_balance,
          "principal_amount:",
          principal_amount,
          "interest:",
          interest,
          "dpd_charges:",
          dpd_charges
        );
        throw new Error(
          "Facing technical issue, please contact us. (Error: Invalid balance calculation)"
        );
        // total_amount = 0;
      }

      DataCode.Total_Payable_Amount = Number(
        total_amount ? Number(total_amount).toFixed(2) : 0.0
      );
      DataCode.RepayDate = data.repayDate;
      DataCode.total_interest = Number(
        (Number(interest) + Number(interest_bal_prev)).toFixed(2)
      );
      DataCode.dpd_charges = Number(
        (Number(dpd_charges) + Number(penalty_bal_prev)).toFixed(2)
      );
      DataCode.principal_amount = Number(
        principal_amount ? Number(principal_amount).toFixed(2) : 0.0
      );
      DataCode.Total_Amount = Number(
        total_calculated_amount_for_total
          ? Number(total_calculated_amount_for_total).toFixed(2)
          : 0.0
      );
    } else {
      DataCode = {
        Total_Payable_Amount: 0,
        RepayDate: "0000-00-00",
        total_interest: 0,
        dpd_charges: 0,
        principal_amount: 0,
        Total_Amount: 0,
      };
    }
  } else {
    DataCode = {
      Total_Payable_Amount: 0,
      RepayDate: "0000-00-00",
      total_interest: 0,
      dpd_charges: 0,
      principal_amount: 0,
      Total_Amount: 0,
    };
  }

  const validateNumber = (value: any, fieldName: string): number => {
    const num = Number(value);
    if (isNaN(num) || num === null || num === undefined) {
      console.error(`Invalid ${fieldName}:`, value, typeof value);
      throw new Error(`Invalid calculation: ${fieldName} is NaN or null`);
    }
    return num;
  };

  if (DataCode.Total_Payable_Amount !== undefined) {
    DataCode.Total_Payable_Amount = validateNumber(
      DataCode.Total_Payable_Amount,
      "Total_Payable_Amount"
    );
    DataCode.total_interest = validateNumber(
      DataCode.total_interest,
      "total_interest"
    );
    DataCode.dpd_charges = validateNumber(DataCode.dpd_charges, "dpd_charges");
    DataCode.principal_amount = validateNumber(
      DataCode.principal_amount,
      "principal_amount"
    );
    DataCode.Total_Amount = validateNumber(
      DataCode.Total_Amount,
      "Total_Amount"
    );
  }

  return DataCode;
}

/**
 * Returns:
 *  0 -> success (default, mirrors PHP $return)
 *  2 -> rule violation (e.g., trying to close with less than repay amount, etc.)
 */
export async function updateLoanCollectionAmount(
  params: UpdateCollectedAmountParams
): Promise<number> {
  const today = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const now = () => new Date().toISOString().replace("T", " ").slice(0, 19); // YYYY-MM-DD HH:mm:ss
  const to2 = (n: number) => Math.round(n * 100) / 100;
  const knex = getKnexInstance();
  let {
    leadID,
    customerID,
    collectedAmount = 0,
    status = "Disbursed",
    collectedDate = today(),
    collectedMode = "Payment Getway",
    remarks = "Auto Collection",
    referenceNo = "",
    discountAmount = 0.0,
    settlementAmount = 0.0,
    collectionStatus = "Approved",
    userID = 1,
    discount_waiver_amount = "",
    discount_waiver = "",
    bycrm = null,
    cooling_period = null,
  } = params;

  // working vars
  let excess_amount = 0;
  let penality_charge = 0;
  let total_interest = 0;
  let _return = 0;
  let collected_interest = 0;
  let collected_principal = 0;
  let collected_penality = 0;
  let check_principal = 0;
  let principal_amount_over = 0;
  let gateway = "Manual";
  let transaction_status = 1;

  console.log("=== INITIAL VALUES ===");
  console.log(
    "leadID:",
    leadID,
    "customerID:",
    customerID,
    "collectedAmount:",
    collectedAmount
  );
  console.log("Initial collected_interest:", collected_interest);
  console.log("Initial total_interest:", total_interest);
  console.log("Initial penality_charge:", penality_charge);

  // get loan, approval
  const loan = await knex("loan")
    .select("disbursalAmount", "loanNo", "disbursalDate", "deduction")
    .where({ leadID, customerID })
    .first();

  const approval_detail = await knex("approval").where({ leadID }).first();

  if (!loan || !approval_detail) {
    console.log("ERROR: Missing loan or approval_detail", {
      loan: !!loan,
      approval_detail: !!approval_detail,
    });
    return 0;
  }

  // Calculate repay figures
  const repayment_data = await calculate_repay_amount_ipc(
    leadID.toString(),
    collectedDate
  );

  console.log("=== REPAYMENT DATA ===");
  console.log("repayment_data:", JSON.stringify(repayment_data, null, 2));

  let repayment_amount = repayment_data.Total_Payable_Amount;
  let penality_charge_actual = repayment_data.dpd_charges;
  let total_interest_actual = repayment_data.total_interest;
  let principal_amount = repayment_data.principal_amount;

  if (repayment_amount === null || repayment_amount === undefined) {
    console.error(
      "ERROR: Total_Payable_Amount is null/undefined from calculate_repay_amount_ipc"
    );
    console.error("repayment_data:", repayment_data);
    throw new Error(
      "Invalid repayment calculation - Total_Payable_Amount is null"
    );
  }

  repayment_amount = Number(repayment_amount) || 0;
  penality_charge_actual = Number(penality_charge_actual) || 0;
  total_interest_actual = Number(total_interest_actual) || 0;
  principal_amount = Number(principal_amount) || 0;

  if (
    isNaN(repayment_amount) ||
    isNaN(penality_charge_actual) ||
    isNaN(total_interest_actual) ||
    isNaN(principal_amount)
  ) {
    console.error("NaN detected in repayment data:", {
      repayment_amount,
      penality_charge_actual,
      total_interest_actual,
      principal_amount,
    });
    throw new Error("Invalid repayment calculation - NaN detected");
  }

  console.log("=== EXTRACTED VALUES ===");
  console.log("repayment_amount:", repayment_amount, typeof repayment_amount);
  console.log(
    "penality_charge_actual:",
    penality_charge_actual,
    typeof penality_charge_actual
  );
  console.log(
    "total_interest_actual:",
    total_interest_actual,
    typeof total_interest_actual
  );
  console.log("principal_amount:", principal_amount, typeof principal_amount);

  penality_charge = penality_charge_actual;
  total_interest = total_interest_actual;

  console.log("=== AFTER ASSIGNMENT ===");
  console.log("penality_charge:", penality_charge, typeof penality_charge);
  console.log("total_interest:", total_interest, typeof total_interest);

  // If trying to close but paid less than repay amount (and not settlement), switch to Part Payment
  if (repayment_amount > collectedAmount && status === "Closed") {
    status = "Part Payment";
    console.log("Status changed to Part Payment due to insufficient amount");
  }

  // Cooling period logic
  if (cooling_period === "Yes" && bycrm === 1) {
    console.log("=== COOLING PERIOD CHECK ===");
    const check = await checkCoolingPeriod(
      loan,
      approval_detail,
      bycrm,
      cooling_period,
      collectedAmount,
      repayment_data,
      collectedDate
    );
    console.log("Cooling period check result:", JSON.stringify(check, null, 2));

    if (check.is_cooling_period) {
      repayment_amount = check.repayment_amount;
      principal_amount = check.principal_amount;

      if (repayment_amount === principal_amount) {
        total_interest = 0;
        penality_charge = 0;
      }
      console.log("=== AFTER COOLING PERIOD ADJUSTMENT ===");
      console.log("repayment_amount:", repayment_amount);
      console.log("principal_amount:", principal_amount);
      console.log("total_interest:", total_interest);
      console.log("penality_charge:", penality_charge);
    }
  }

  // Status-wise allocations
  let opening_bal: number | null = null;
  let closing_bal: number | null = null;

  console.log("=== PROCESSING STATUS:", status, "===");

  if (status === "Closed") {
    console.log("Processing Closed status");
    if (repayment_amount > collectedAmount) {
      console.log("Cannot close - repayment_amount > collectedAmount");
      return 2;
    } else if (repayment_amount < collectedAmount) {
      excess_amount = collectedAmount - repayment_amount;
      console.log("Excess amount:", excess_amount);
    }
    opening_bal = repayment_amount;
    collected_interest = total_interest;
    collected_principal = principal_amount;
    collected_penality = penality_charge;
    closing_bal = 0;
    principal_amount = 0;

    console.log("=== CLOSED STATUS VALUES ===");
    console.log(
      "collected_interest:",
      collected_interest,
      typeof collected_interest
    );
    console.log(
      "collected_principal:",
      collected_principal,
      typeof collected_principal
    );
    console.log(
      "collected_penality:",
      collected_penality,
      typeof collected_penality
    );

    if (collectedAmount - repayment_amount >= 0) {
      penality_charge = 0;
      total_interest = 0;
      console.log("Reset penality_charge and total_interest to 0");
    }
  } else if (status === "Part Payment") {
    console.log("Processing Part Payment status");
    opening_bal = repayment_amount;
    closing_bal = 0;

    if (repayment_amount === collectedAmount) {
      console.log("Part Payment -> Closed (amounts equal)");
      status = "Closed";
      collected_interest = total_interest;
      collected_principal = principal_amount;
      collected_penality = penality_charge;
      principal_amount = 0;
      total_interest = 0;
      penality_charge = 0;
    } else if (repayment_amount < collectedAmount) {
      console.log("Part Payment -> Closed (excess payment)");
      excess_amount = Math.max(collectedAmount - repayment_amount, 0);
      status = "Closed";
      collected_interest = total_interest;
      collected_principal = principal_amount;
      collected_penality = penality_charge;
      principal_amount = 0;
      total_interest = 0;
      penality_charge = 0;
    } else {
      console.log("Part Payment processing (repay > collected)");
      // repay > collected
      closing_bal = repayment_amount - collectedAmount;

      if (collectedAmount > total_interest) {
        console.log("collectedAmount > total_interest branch");
        if (total_interest === 0 && collectedAmount >= principal_amount) {
          collected_principal = principal_amount;
          console.log("Branch: total_interest=0, collected >= principal");
        } else if (total_interest === 0 && collectedAmount < principal_amount) {
          collected_principal = collectedAmount;
          console.log("Branch: total_interest=0, collected < principal");
        } else {
          console.log("Branch: normal interest deduction");
          collected_principal = collectedAmount - total_interest;
          if (collectedAmount > principal_amount + total_interest) {
            check_principal = 1;
            principal_amount_over = principal_amount;
            console.log(
              "Setting check_principal=1, principal_amount_over:",
              principal_amount_over
            );
          }
        }

        total_interest = 0;
        principal_amount -= collected_principal;
        collected_interest =
          Number(total_interest_actual) - Number(total_interest);

        console.log("=== INTEREST CALCULATION ===");
        console.log(
          "total_interest_actual:",
          total_interest_actual,
          typeof total_interest_actual
        );
        console.log("total_interest:", total_interest, typeof total_interest);
        console.log(
          "collected_interest calculation:",
          total_interest_actual,
          "-",
          total_interest,
          "=",
          collected_interest
        );
        console.log(
          "collected_interest result:",
          collected_interest,
          typeof collected_interest
        );

        if (principal_amount < 0) {
          penality_charge += principal_amount; // subtract
          principal_amount = 0;
          if (penality_charge < 0) penality_charge = 0;
        } else {
          penality_charge =
            penality_charge_actual -
            (collectedAmount - collected_principal - collected_interest);
          penality_charge = penality_charge > 0 ? penality_charge : 0.0;
        }

        if (check_principal === 1) {
          collected_principal = principal_amount_over;
          principal_amount = 0;
        }

        collected_interest =
          Number(total_interest_actual) - Number(total_interest);
        collected_penality =
          penality_charge_actual - penality_charge > 0
            ? penality_charge_actual - penality_charge
            : 0.0;

        console.log("=== FINAL PART PAYMENT CALCULATIONS ===");
        console.log(
          "collected_interest (final):",
          collected_interest,
          typeof collected_interest
        );
        console.log(
          "collected_principal:",
          collected_principal,
          typeof collected_principal
        );
        console.log(
          "collected_penality:",
          collected_penality,
          typeof collected_penality
        );

        if (collected_interest === 0 && collected_principal === 0) {
          collected_penality = collectedAmount;
          penality_charge = penality_charge_actual - collected_penality;
          console.log(
            "Special case: collected_interest and collected_principal both 0"
          );
        }
      } else {
        console.log("collectedAmount <= total_interest branch");
        total_interest -= collectedAmount;
        collected_interest =
          Number(total_interest_actual) - Number(total_interest);
        console.log(
          "collected_interest in else branch:",
          collected_interest,
          typeof collected_interest
        );
      }
    }
  } else if (status === "Settlement") {
    console.log("Processing Settlement status");
    // Similar logic as Part Payment...
    opening_bal = repayment_amount;
    closing_bal = repayment_amount - collectedAmount;

    if (collectedAmount > total_interest) {
      console.log("Settlement: collectedAmount > total_interest");
      if (total_interest === 0 && collectedAmount >= principal_amount) {
        collected_principal = principal_amount;
      } else if (total_interest === 0 && collectedAmount < principal_amount) {
        collected_principal = collectedAmount;
      } else {
        collected_principal = collectedAmount - total_interest;
        if (collectedAmount > principal_amount + total_interest) {
          check_principal = 1;
          principal_amount_over = principal_amount;
        }
      }

      total_interest = 0;
      principal_amount -= collected_principal;

      if (principal_amount < 0) {
        penality_charge += principal_amount;
        principal_amount = 0;
        if (penality_charge < 0) penality_charge = 0;
      } else {
        penality_charge =
          penality_charge_actual -
          (collectedAmount - collected_principal - collected_interest);
        penality_charge = penality_charge > 0 ? penality_charge : 0.0;
      }

      if (check_principal === 1) {
        collected_principal = principal_amount_over;
        principal_amount = 0;
      }

      collected_interest =
        Number(total_interest_actual) - Number(total_interest);
      collected_penality =
        penality_charge_actual - penality_charge > 0
          ? penality_charge_actual - penality_charge
          : 0.0;

      console.log("=== SETTLEMENT CALCULATIONS ===");
      console.log(
        "collected_interest:",
        collected_interest,
        typeof collected_interest
      );

      if (collected_interest === 0 && collected_principal === 0) {
        collected_penality = collectedAmount;
        penality_charge = penality_charge_actual - collected_penality;
      }
    } else {
      console.log("Settlement: collectedAmount <= total_interest");
      total_interest -= collectedAmount;
      collected_interest =
        Number(total_interest_actual) - Number(total_interest);
      console.log(
        "Settlement collected_interest:",
        collected_interest,
        typeof collected_interest
      );
    }
  }

  console.log("=== FINAL VALUES BEFORE DB INSERT ===");
  console.log(
    "collected_interest:",
    collected_interest,
    typeof collected_interest,
    "isNaN:",
    isNaN(collected_interest)
  );
  console.log(
    "collected_principal:",
    collected_principal,
    typeof collected_principal,
    "isNaN:",
    isNaN(collected_principal)
  );
  console.log(
    "collected_penality:",
    collected_penality,
    typeof collected_penality,
    "isNaN:",
    isNaN(collected_penality)
  );
  console.log(
    "total_interest:",
    total_interest,
    typeof total_interest,
    "isNaN:",
    isNaN(total_interest)
  );
  console.log(
    "penality_charge:",
    penality_charge,
    typeof penality_charge,
    "isNaN:",
    isNaN(penality_charge)
  );
  console.log(
    "principal_amount:",
    principal_amount,
    typeof principal_amount,
    "isNaN:",
    isNaN(principal_amount)
  );

  // Rule: if already closed/settlement approved rows exist, you can only post same-type collections
  const leadStatusResult = await knex("leads")
    .join("collection", "leads.leadID", "collection.leadID")
    .where("leads.leadID", leadID)
    .whereIn("leads.status", ["Settlement", "Closed"])
    .whereIn("collection.status", ["Settlement", "Closed"])
    .where("collection.collectionStatus", "Approved")
    .distinct()
    .select("leads.status")
    .first();

  if (leadStatusResult && leadStatusResult.status !== status) {
    return 2;
  }

  console.log("Final opening_bal:", opening_bal);

  if (
    status === "Closed" &&
    (opening_bal === null || opening_bal === undefined || isNaN(opening_bal))
  ) {
    console.error(
      "ERROR: Cannot close loan with invalid opening_balance:",
      opening_bal
    );
    throw new Error(
      "Facing technical issue, please contact us. (Error: Invalid balance calculation)"
    );
  }

  // Transactional write
  return await knex.transaction(async (trx) => {
    console.log("=== INSERTING INTO COLLECTION TABLE ===");
    console.log("Values to insert:");
    console.log("  collected_interest:", collected_interest);
    console.log("  collected_principal:", collected_principal);
    console.log("  collected_penality:", collected_penality);
    console.log("  total_interest:", total_interest);
    console.log("  penality_charge:", penality_charge);
    console.log("  principal_amount:", principal_amount);
    console.log("  opening_bal:", opening_bal);
    console.log("  status:", status);

    if (opening_bal === null || isNaN(opening_bal)) {
      console.error(
        "ERROR: Attempting to insert collection with null/NaN opening_balance"
      );
      console.error("Status:", status, "Opening Balance:", opening_bal);
      throw new Error(
        "Cannot create collection entry with invalid opening balance"
      );
    }

    // Insert collection
    const [collection_id] = await trx("collection")
      .insert({
        customerID,
        leadID,
        loanNo: loan.loanNo,
        collectedAmount,
        collectedMode,
        collectedDate,
        referenceNo: referenceNo ?? "",
        orderID: referenceNo ?? "",
        discountAmount: discountAmount ?? 0.0,
        settlemenAmount: settlementAmount ?? 0.0,
        remark: remarks ?? "",
        status,
        collectedBy: userID,
        createdDate: now(),
        collectionStatus,
        collectionStatusby: "no",
        excess_amount: to2(excess_amount),
        discount_waiver: discount_waiver ?? "",
        discount_waiver_amount: discount_waiver_amount ?? "",
        opening_balance: opening_bal,
        closing_balance:
          closing_bal !== null && !isNaN(closing_bal) ? closing_bal : null,
        total_interest:
          total_interest !== null && !isNaN(total_interest)
            ? total_interest
            : null,
        principal_amount:
          principal_amount !== null && !isNaN(principal_amount)
            ? principal_amount
            : null,
        penality_charge:
          penality_charge !== null && !isNaN(penality_charge)
            ? penality_charge
            : null,
        collected_interest:
          collected_interest !== null && !isNaN(collected_interest)
            ? collected_interest
            : null,
        collected_principal:
          collected_principal !== null && !isNaN(collected_principal)
            ? collected_principal
            : null,
        collected_penality:
          collected_penality !== null && !isNaN(collected_penality)
            ? collected_penality
            : null,
      })
      .returning("collectionID") // PostgreSQL
      .catch(async (e) => {
        console.log("=== DATABASE INSERT ERROR ===");
        console.log("Error:", e.message);
        console.log(
          "collected_interest value that caused error:",
          collected_interest,
          typeof collected_interest
        );

        // MySQL fallback: returning() not supported, fetch last insert id
        if (/returning\b/i.test(String(e))) {
          const result: any = await trx("collection").insert({
            customerID,
            leadID,
            loanNo: loan.loanNo,
            collectedAmount,
            collectedMode,
            collectedDate,
            referenceNo: referenceNo ?? "",
            orderID: referenceNo ?? "",
            discountAmount: discountAmount ?? 0.0,
            settlemenAmount: settlementAmount ?? 0.0,
            remark: remarks ?? "",
            status,
            collectedBy: userID,
            createdDate: now(),
            collectionStatus,
            collectionStatusby: "no",
            excess_amount: to2(excess_amount),
            discount_waiver: discount_waiver ?? "",
            discount_waiver_amount: discount_waiver_amount ?? "",
            opening_balance:
              opening_bal !== null && !isNaN(opening_bal) ? opening_bal : null,
            closing_balance:
              closing_bal !== null && !isNaN(closing_bal) ? closing_bal : null,
            total_interest:
              total_interest !== null && !isNaN(total_interest)
                ? total_interest
                : null,
            principal_amount:
              principal_amount !== null && !isNaN(principal_amount)
                ? principal_amount
                : null,
            penality_charge:
              penality_charge !== null && !isNaN(penality_charge)
                ? penality_charge
                : null,
            collected_interest:
              collected_interest !== null && !isNaN(collected_interest)
                ? collected_interest
                : null,
            collected_principal:
              collected_principal !== null && !isNaN(collected_principal)
                ? collected_principal
                : null,
            collected_penality:
              collected_penality !== null && !isNaN(collected_penality)
                ? collected_penality
                : null,
          });
          // @ts-ignore – for MySQL, result is InsertResult with insertId
          return [result[0]?.collectionID ?? result.insertId];
        }
        throw e;
      });

    // Rest of the transaction logic remains the same...
    // Link to agent if alloUID present
    const lead_detail = await trx("leads").where({ leadID }).first();
    if (
      lead_detail &&
      lead_detail.alloUID &&
      String(lead_detail.alloUID).toLowerCase() !== "no"
    ) {
      await trx("leads_agent_collection").insert({
        leadID,
        agent_id: lead_detail.alloUID,
        collectionID: collection_id,
        collectedAmount,
        created_at: now(),
      });
    }

    // If system users, also update lead + onlinepayment, and mark as Razorpay
    if (String(userID) === "1") {
      await trx("leads").where({ leadID }).update({ status });
      await trx("onlinepayment")
        .where({ razorpayOrderId: referenceNo })
        .update({
          status,
          approved_id: "1",
        });
      gateway = "Razorpay";
      transaction_status = 2;
    }

    // Manage transaction
    if (collection_id) {
      await manageTransaction(
        leadID,
        customerID,
        "Collection",
        Number(collection_id),
        gateway,
        null,
        collectedDate,
        null,
        collectedMode,
        referenceNo ?? "",
        referenceNo ?? "",
        Number(userID),
        Number(collectedAmount),
        transaction_status
      );
    }

    // call history logs
    await trx("callhistoryLogs").insert({
      customerID,
      leadID,
      callType: "IVR",
      status,
      remark: " ",
      noteli: " ",
      callbackTime: today(),
      calledBy: userID,
      createdDate: now(),
    });
    await trx.commit();

    return _return;
  });
}

export interface RepaymentData {
  Total_Payable_Amount: number;
  dpd_charges: number;
  total_interest: number;
  principal_amount: number;
}

export interface CoolingPeriodCheckResult {
  is_cooling_period: boolean;
  repayment_amount: number;
  principal_amount: number;
}

export interface CalculateRepayAmountIPC {
  (leadID: number, calculateDate: string): Promise<RepaymentData>;
}

export interface CheckCoolingPeriod {
  (
    loanRow: any,
    approvalRow: any,
    bycrm: number | null,
    cooling_period: string | null,
    collectedAmount: number,
    repaymentData: RepaymentData,
    collectedDate: string
  ): Promise<CoolingPeriodCheckResult>;
}

export interface ManageTransaction {
  manage_transaction: (
    leadID: number,
    customerID: number,
    type: "Collection",
    collectionId: number,
    gateway: string,
    _null1: any,
    collectedDate: string,
    _null2: any,
    collectedMode: string,
    referenceNo: string,
    orderId: string,
    userID: number,
    amount: number,
    transaction_status: number
  ) => Promise<void>;
}

export interface WhatsAppService {
  sendWhatsAppMessageNoLoan(
    mobile: string,
    name: string,
    customerID: number
  ): Promise<void>;
}
export interface EmailService {
  setTemplateId(templateId: string): void;
  sendMailNoLoan(
    email: string,
    name: string,
    customerID: number
  ): Promise<void>;
}

export interface CustomerDetailsService {
  getCustomerDetails(
    customerID: number
  ): Promise<{ customer: { mobile: string; name: string; email: string } }>;
}

export type UpdateCollectedAmountDeps = {
  calculateRepayAmountIPC: CalculateRepayAmountIPC;
  checkCoolingPeriod: CheckCoolingPeriod;
  manageTransaction: ManageTransaction;
  whatsAppInteraktService: WhatsAppService;
  sendinblueEmailService: EmailService;
  customerDetailsService: CustomerDetailsService;
};

export type UpdateCollectedAmountParams = {
  leadID: number;
  customerID: number;
  collectedAmount?: number;
  status?: string;
  collectedDate?: string;
  collectedMode?: string;
  remarks?: string;
  referenceNo?: string;
  discountAmount?: number;
  settlementAmount?: number;
  collectionStatus?: string;
  userID?: number;
  discount_waiver?: string;
  discount_waiver_amount?: string;
  bycrm?: number;
  cooling_period?: string;
};

function checkCoolingPeriod(
  loan,
  approvalDetail,
  byCrm,
  coolingPeriod,
  collectedAmount,
  repaymentData,
  collectedDate
) {
  let repaymentAmount = 0;
  let principalAmount = 0;
  let isCoolingPeriod = false;

  try {
    const tenure = Math.round(
      (!isNaN(new Date(approvalDetail.repayDate).getTime()) &&
      !isNaN(new Date(loan.disbursalDate).getTime())
        ? new Date(approvalDetail.repayDate).getTime() -
          new Date(loan.disbursalDate).getTime()
        : 0) /
        (1000 * 60 * 60 * 24)
    );

    const collectedDateObj = new Date(collectedDate);
    const disbursalDateObj = new Date(loan.disbursalDate);
    const findDiff =
      !isNaN(collectedDateObj.getTime()) && !isNaN(disbursalDateObj.getTime())
        ? collectedDateObj.getTime() - disbursalDateObj.getTime()
        : 0;

    const diffDays = Math.round(findDiff / (1000 * 60 * 60 * 24));

    if (
      (tenure < 7 && diffDays <= 1 && coolingPeriod === "Yes" && byCrm === 1) ||
      (tenure >= 7 && diffDays <= 3 && coolingPeriod === "Yes" && byCrm === 1)
    ) {
      repaymentAmount = loan.disbursalAmount - loan.deduction;
      isCoolingPeriod = true;

      if (repaymentAmount === collectedAmount) {
        principalAmount = repaymentAmount;
      }

      if (repaymentAmount < collectedAmount) {
        repaymentAmount = repaymentData.Total_Payable_Amount;
      }
    }
  } catch (err) {
    return {
      repayment_amount: 0,
      principal_amount: 0,
      is_cooling_period: false,
    };
  }

  return {
    repayment_amount: repaymentAmount,
    principal_amount: principalAmount,
    is_cooling_period: isCoolingPeriod,
  };
}

async function manageTransaction(
  leadID: number,
  customerID: number,
  type: string = null,
  collectionID: number = null,
  gateway: string = null,
  emiID: number = null,
  transactionDate: string = null,
  remarks: string = null,
  mode: string = null,
  referenceNo: string = null,
  orderID: string = null,
  createdBy: number = null,
  amount: number = null,
  status: number = null
): Promise<number | object | null> {
  try {
    if (!leadID || !customerID) {
      return 0;
    }
    let db = getKnexInstance();
    transactionDate = transactionDate || new Date().toISOString();

    const loan = await db("loan").where({ leadID, customerID }).first();

    const approval_detail = await db("approval")
      .where({ leadID, customerID })
      .first();

    if (!loan && !approval_detail) {
      return 0;
    }

    if (type === "disbursal") {
      const commonData = {
        customerID,
        leadID,
        loanNo: loan.loanNo,
        status: gateway === "Manual" ? 2 : 1,
        mode: "Payout",
        referenceNo: loan.disbursalRefrenceNo || "",
        orderId: loan.disbursalRefrenceNo || "",
        deleted: 0,
        gateway: gateway,
        createdBy: loan.disbursedBy,
        updatedBy: loan.disbursedBy,
        collectionID,
        emiID,
        transactionDate,
        remarks,
      };

      const disbursal_transaction_id = await db("transactions").insert({
        ...commonData,
        type: "disbursal",
        amount: loan.disbursalAmount - loan.deduction,
      });

      // Insert PF transaction
      const pf_transaction_id = await db("transactions").insert({
        ...commonData,
        type: "pf",
        amount: approval_detail.adminFee,
      });

      // Insert GST transac
      const gst_transaction_id = await db("transactions").insert({
        ...commonData,
        type: "gst",
        amount: approval_detail.GstOfAdminFee,
      });

      return {
        disbursal_transaction_id,
        pf_transaction_id,
        gst_transaction_id,
      };
    }
    gateway = mode == "PayU" ? "Payu" : gateway;
    const transaction_id = await db("transactions").insert({
      customerID,
      leadID,
      loanNo: loan.loanNo,
      status,
      type,
      mode,
      referenceNo,
      orderId: orderID,
      deleted: 0,
      gateway,
      createdBy,
      updatedBy: createdBy,
      amount,
      collectionID,
      emiID,
      transactionDate,
      remarks,
    });

    return transaction_id;
  } catch (error) {
    console.error("Transaction Error:", error.message);
    return null;
  }
}

export enum CollectionStatusRepay {
  IPC = 1,
  CLOSED = "Closed",
  PART_PAYMENT = "Part Payment",
  SETTLEMENT = "Settlement",
  DISBURSED = "Disbursed",
  EMI_CLOSED = "EMI Closed",
  APPROVED = "Approved",
  PAYMENT_REJECTED = "Payment Rejected",
  APPROVAL_WAITING = "Approval Waiting",
  LEAD_ALLOCATED = "Lead Allocated",
  APPROVAL_WAITING_REFUNDED = "Approval Waiting (refunded amount)",
  APPROVED_REFUNDED = "Approved-refunded",
  WAIVE_OFF = "Waive Off",
  REJECTED = "Rejected",
}
