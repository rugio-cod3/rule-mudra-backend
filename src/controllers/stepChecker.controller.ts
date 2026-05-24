// step checker controller backup

import { leadModel } from "@/database/mysql/leads";
import { stepControlModel } from "@/database/mysql/step-control";
import { stepTrackerModel } from "@/database/mysql/step_tracker";
import { StepName } from "@/enums/common.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { ProductID } from "@/enums/product.enum";
import { StepProvider } from "@/enums/step.enum";
import { customerService } from "@/services/customer.service";
import { employerService } from "@/services/employer.service";
import { leadService } from "@/services/lead.service";
import { NextFunction, Request, Response } from "express";

const getRedirectPath = (
  currentRoute: string | null,
  nextStepName: string | null,
  leadID: number | null,
  leadStatus: string | null,
  leadType: string | null
): string => {
  console.log("laskdjflasdjf", leadType);
  if (
    leadStatus &&
    [
      "Not Required Process",
      "Not Required",
      "Hold Process",
      "Rejected Process",
      "Bank Update Rejected",
      "Disbursed",
      "Blacklisted",
      "Settlement",
      "Closed",
      "Part Payment",
      "Not Eligible",
      "Rejected",
      "Hold",
      "Not Interested",
    ].includes(leadStatus)
  ) {
    return "/dashboard";
  } else if (!nextStepName && leadID) {
    console.log(
      `[stepChecker][getRedirectPath] No nextStepName, leadID=${leadID} => /dashboard`
    );
    return "/dashboard";
  } else if (nextStepName === "LOAN_APPROVAL") {
    console.log(
      `[stepChecker][getRedirectPath] nextStepName=LOAN_APPROVAL => /process-to-bank`
    );
    return "/process-to-bank";
  } else if (
    leadType != "Repeat" &&
    nextStepName &&
    [
      "REFERENCE_DETAILS",
      "SELFIE_VERIFICATION",
      "BANK_DETAILS",
      "EMANDATE",
      "PENNY_DROP",
      "KFS",
    ].includes(nextStepName)
  ) {
    console.log(
      `[stepChecker][getRedirectPath] nextStepName=${nextStepName} => /loan-approval`
    );
    // return "/loan-approval";
    return currentRoute || "/";
  } else {
    console.log(
      `[stepChecker][getRedirectPath] Default: currentRoute=${currentRoute}`
    );
    return currentRoute || "/";
  }
};

const getCustomerFromToken = (req: Request) => {
  const customer = (req as any)?.customer;

  if (!customer || !customer.customerID) {
    throw new Error("Customer information not found in JWT token");
  }

  return {
    customerID: customer.customerID,
    mobile: customer.mobile,
  };
};

const getLatestStepTracker = async (customerID: number) => {
  try {
    const latestStep = await stepTrackerModel.findOneStepTracker(
      { customer_id: customerID, is_deleted: 0 },
      ["*"],
      [{ column: "created_at", order: "desc" }]
    );

    return latestStep;
  } catch (error) {
    console.error("Error fetching latest step tracker:", error);
    return null;
  }
};

const getCurrentStepName = async (
  customerID: number
): Promise<{ step_name: string; provider_id: string }> => {
  const latestStepTracker = await getLatestStepTracker(customerID);

  if (!latestStepTracker || !latestStepTracker.step_id) {
    const firstStep = await stepControlModel.findOne({
      where: {
        product_id: ProductID.PAYDAY,
        is_active: true,
      },
      select: ["step_name", "provider_id"],
      order: [{ column: "step_order", order: "asc" }],
    });

    return {
      step_name: firstStep?.step_name || "initial_step",
      provider_id: firstStep?.provider_id || "",
    };
  }

  const stepControl = await stepControlModel.findOne({
    where: { id: latestStepTracker.step_id },
    select: ["step_name", "provider_id"],
  });

  return {
    step_name: stepControl?.step_name || "unknown_step",
    provider_id: stepControl?.provider_id || "",
  };
};

const getLatestLeadForCustomer = async (customerID: number) => {
  try {
    const latestLead = await leadModel.findOne({
      where: { customerID },
      select: ["leadID", "status", "fbLeads"],
      order: [{ column: "leadID", order: "desc" }],
    });

    return latestLead;
  } catch (error) {
    console.error("Error fetching latest lead:", error);
    return null;
  }
};

const getNextIncompleteStepForNewUser = (
  allSteps: any[],
  completedStepIds: Set<number>
) => {
  const genericSteps = allSteps
    .filter((step) => step.provider_id === StepProvider.GENERIC)
    .sort((a, b) => a.step_order - b.step_order);

  const incompleteGenericStep = genericSteps.find(
    (step) => !completedStepIds.has(step.id)
  );
  if (incompleteGenericStep) {
    return incompleteGenericStep;
  }

  const newProviderSteps = allSteps
    .filter((step) => step.provider_id === StepProvider.NEW)
    .sort((a, b) => a.step_order - b.step_order);

  const incompleteNewStep = newProviderSteps.find(
    (step) => !completedStepIds.has(step.id)
  );

  const repeatProviderSteps = allSteps
    .filter((step) => step.provider_id === StepProvider.REPEAT_CUSTOMER)
    .sort((a, b) => a.step_order - b.step_order);

  const incompleteRepeatSteps = repeatProviderSteps.find(
    (step) => !completedStepIds.has(step.id)
  );

  if (incompleteRepeatSteps) {
    return incompleteRepeatSteps;
  }
  return incompleteNewStep;
};

const getEmploymentDetails = async (
  customerID: number,
  leadID: number | null,
  customerDetails: any,
  leadInfo: any
) => {
  const emptyEmployment = {
    salary_date: null,
    loan_required: null,
    loan_purpose: null,
    company_name: null,
    monthly_income: null,
    salary_mode: null,
    employee_type: null,
  };

  try {
    let employerDetails = null;
    try {
      employerDetails = await employerService.findOne(
        { customerID },
        ["employerName"],
        [{ column: "employerID", order: "desc" }]
      );
    } catch (error) {
      console.error("Error fetching employer details:", error);
    }

    return {
      salary_date: customerDetails?.salary_date || null,
      loan_required: leadInfo?.loanRequeried || null,
      loan_purpose: leadInfo?.purpose || null,
      company_name: employerDetails?.employerName || null,
      monthly_income: leadInfo?.monthlyIncome || null,
      salary_mode: leadInfo?.salaryMode || null,
      employee_type: customerDetails?.employeeType || null,
    };
  } catch (error) {
    console.error("Error in getEmploymentDetails:", error);
    return emptyEmployment;
  }
};

export const stepChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let customerID: number;
    let mobile: string;

    try {
      const customerInfo = getCustomerFromToken(req);
      customerID = customerInfo.customerID;
      mobile = customerInfo.mobile;
      console.log(
        `[stepChecker] Extracted customerID=${customerID}, mobile=${mobile} from token`
      );
    } catch (error) {
      console.error(
        "[stepChecker] Error extracting customer from token:",
        error
      );
      return res.status(401).json({
        status: false,
        message: "Invalid or missing authentication token",
        redirect_to: null,
        step_id: null,
        current_route: null,
        step_name: null,
        lead: null,
        customer: null,
        employment: null,
      });
    }

    let step_name: string;
    let step_provider_id: string;
    try {
      const step_response = await getCurrentStepName(customerID);
      step_name = step_response.step_name;
      step_provider_id = step_response.provider_id;
      console.log(
        `[stepChecker] getCurrentStepName: customerID=${customerID}, step_name=${step_name}`
      );
    } catch (error) {
      console.error("[stepChecker] Error getting current step name:", error);
      return res.status(400).json({
        status: false,
        message: "Error determining current step",
        redirect_to: null,
        step_id: null,
        current_route: null,
        step_name: null,
        lead: null,
        customer: null,
        employment: null,
      });
    }

    const product_id = ProductID.PAYDAY;
    console.log(`[stepChecker] Using product_id=${product_id}`);

    let customerDetails = null;
    try {
      customerDetails = await customerService.findOne({ customerID }, ["*"]);
      console.log(
        `[stepChecker] customerService.findOne: customerID=${customerID}, result=`,
        customerDetails
      );
    } catch (error) {
      console.error("[stepChecker] Error finding customer:", error);
      return res.status(400).json({
        status: false,
        message: "Error retrieving customer information",
        redirect_to: null,
        step_id: null,
        current_route: null,
        step_name: null,
        lead: null,
        customer: null,
        employment: null,
      });
    }

    if (!customerDetails) {
      console.error(
        `[stepChecker] Customer not found for customerID=${customerID}`
      );
      return res.status(404).json({
        status: false,
        message: "Customer not found",
        redirect_to: null,
        step_id: null,
        current_route: null,
        step_name: null,
        lead: null,
        customer: null,
        employment: null,
      });
    }

    let currentStep = null;
    try {
      currentStep = await stepControlModel.findOne({
        where: {
          step_name: step_name as StepName,
          product_id: product_id,
          is_active: true,
          provider_id: step_provider_id,
        },
      });
      // console.log(
        // `[stepChecker] stepControlModel.findOne: step_name=${step_name}, product_id=${product_id}, result=`,
        // currentStep
      // );
    } catch (error) {
      console.error("[stepChecker] Error finding step:", error);
      return res.status(400).json({
        status: false,
        message: "Error retrieving step information",
        redirect_to: null,
        step_id: null,
        current_route: null,
        step_name: null,
        lead: null,
        customer: { customerID, name: customerDetails.name || "Unknown" },
        employment: null,
      });
    }

    if (!currentStep) {
      console.error(
        `[stepChecker] Step not found or inactive for step_name=${step_name}, product_id=${product_id}`
      );
      return res.status(404).json({
        status: false,
        message: "Step not found or inactive",
        redirect_to: null,
        step_id: null,
        current_route: null,
        step_name: null,
        lead: null,
        customer: { customerID, name: customerDetails.name || "Unknown" },
        employment: null,
      });
    }

    let leadInfo = null;
    let finalLeadID = null;
    let leadStatus = null;
    try {
      leadInfo = await getLatestLeadForCustomer(customerID);
      console.log(
        `[stepChecker] getLatestLeadForCustomer: customerID=${customerID}, result=`,
        leadInfo
      );
      if (leadInfo) {
        finalLeadID = leadInfo.leadID;
        leadStatus = leadInfo.status;
        leadInfo = await leadService.findOne({ leadID: finalLeadID }, ["*"]);
        // console.log(
        //   `[stepChecker] leadService.findOne: leadID=${finalLeadID}, result=`,
        //   leadInfo
        // );
      }
    } catch (error) {
      console.error("[stepChecker] Error finding lead:", error);
      return res.status(400).json({
        status: false,
        message: "Error retrieving lead information",
        redirect_to: null,
        step_id: null,
        current_route: null,
        step_name: null,
        lead: null,
        customer: { customerID, name: customerDetails.name || "Unknown" },
        employment: null,
      });
    }

    let leadType = "";
    if (finalLeadID && leadInfo) {
      try {
        const pastLeadCount = await leadService.count(
          { customerID: customerID },
          { leadID: finalLeadID }
        );
        const leadCount = Number(pastLeadCount || 0);
        // console.log(
        //   ",.,.,.,.,.,,.,.,.,.,,.,.,.,..........................",
        //   leadCount
        // );
        if (leadCount === 0 && leadInfo.status !== LeadStatus.CLOSED) {
          leadType = "New";
        } else if (leadInfo.status === LeadStatus.APPROVED) {
          leadType = "Existing";
        } else {
          leadType = "Repeat";
        }
        console.log(
          `[stepChecker] leadType determined: ${leadType} (leadCount=${leadCount}, leadStatus=${leadInfo.status})`
        );
      } catch (error) {
        console.error("[stepChecker] Error counting leads:", error);
        leadType = "Unknown";
      }
    } else {
      leadType = "New";
      console.log(
        `[stepChecker] No finalLeadID or leadInfo, defaulting leadType to New`
      );
    }

    let employmentDetails = {};

    if (leadStatus === "Closed") {
      console.log(
        `[stepChecker] Lead status is Closed, fetching employment details for customerID=${customerID}, leadID=${finalLeadID}`
      );
      employmentDetails = await getEmploymentDetails(
        customerID,
        finalLeadID,
        customerDetails,
        leadInfo
      );
    }

    let validationResult = null;
    try {
      validationResult = await validateStepAccess(
        customerID,
        finalLeadID,
        currentStep,
        product_id,
        leadInfo,
        leadType
      );
      console.log(
        `[stepChecker] validateStepAccess: customerID=${customerID}, finalLeadID=${finalLeadID}, currentStep.id=${currentStep.id}, product_id=${product_id}, leadType=${leadType}, result=`,
        validationResult
      );
    } catch (error) {
      console.error("[stepChecker] Error validating step access:", error);
      return res.status(400).json({
        status: false,
        message: "Error validating step access",
        redirect_to: null,
        step_id: null,
        current_route: null,
        step_name: null,
        lead: {
          leadID: leadInfo?.leadID || null,
          leadType,
          leadStatus: leadInfo?.status || null,
        },
        customer: { customerID, name: customerDetails.name || "Unknown" },
        employment: employmentDetails,
      });
    }

    const redirectRoute = validationResult.isValid
      ? currentStep?.current_route || null
      : validationResult.missingStep?.current_route || null;

    const redirectStepName = validationResult.isValid
      ? currentStep?.step_name || null
      : validationResult.missingStep?.step_name || null;

    console.log(
      `[stepChecker] getRedirectPath params: current_route=${redirectRoute}, nextStepName=${redirectStepName}, finalLeadID=${finalLeadID}`
    );

    const redirectPath = getRedirectPath(
      redirectRoute,
      redirectStepName,
      finalLeadID,
      leadStatus,
      leadType
    );

    console.log(`[stepChecker] Computed redirectPath: ${redirectPath}`);

    if (!validationResult.isValid) {
      console.log(
        `[stepChecker] Step access NOT valid. Responding with missingStep:`,
        validationResult.missingStep
      );
      return res.status(200).json({
        status: false,
        message: validationResult.isCompletedStep
          ? `Step already completed. Please proceed to: ${validationResult.missingStep?.step_display_name}`
          : validationResult.missingStep
          ? `Missing mandatory step: ${validationResult.missingStep.step_display_name}`
          : "Step access not allowed - prerequisite steps not completed",
        redirect_to: redirectPath,
        step_id: validationResult.missingStep?.id || null,
        current_route: validationResult.missingStep?.current_route || null,
        step_name: validationResult.missingStep?.step_display_name || null,
        loan: {
          loan_id: leadInfo?.leadID || null,
          loan_type: leadType,
          loan_status: leadInfo?.status || null,
        },
        customer: {
          user_id: customerID,
          name: customerDetails.name || "Unknown",
          aadhar_no: customerDetails.aadharNo || null,
          email: customerDetails.email || null,
          mobile: customerDetails.mobile || null,
          pan_verified: customerDetails.pan_cust_verified || null,
          emandate_required: customerDetails.emandate_required || null,
          is_dob_match: customerDetails.is_dob_match || null,
        },
        employment: employmentDetails,
      });
    }

    console.log(
      `[stepChecker] Step access allowed. Responding with currentStep:`,
      currentStep
    );

    return res.status(200).json({
      status: true,
      message: "Step access allowed",
      redirect_to: redirectPath,
      step_id: currentStep.id || null,
      current_route: currentStep.current_route || null,
      step_name: currentStep.step_display_name || null,
      loan: {
        loan_id: leadInfo?.leadID || null,
        loan_type: leadType,
        loan_status: leadInfo?.status || null,
      },
      customer: {
        user_id: customerID,
        name: customerDetails.name || "Unknown",
        aadhar_no: customerDetails.aadharNo || null,
        pan_verified: customerDetails.pan_cust_verified || null,
        emandate_required: customerDetails.emandate_required || null,
        is_dob_match: customerDetails.is_dob_match || null,
      },
      employment: employmentDetails,
    });
  } catch (error) {
    console.error("[stepChecker] Step Check Error:", error);

    return res.status(500).json({
      status: false,
      message: "An unexpected error occurred while processing step check",
      redirect_to: null,
      step_id: null,
      current_route: null,
      step_name: null,
      loan: null,
      customer: null,
      employment: null,
    });
  }
};

// export const getRedirectRoute = (req: Request, res: Response) => {
//   const { current_route, next_step_name, leadID } = req.query as {
//     current_route?: string;
//     next_step_name?: string | null;
//     leadID?: string;
//     leadStatus?: string;
//   };

//   const redirectPath = getRedirectPath(
//     current_route || null,
//     next_step_name || null,
//     leadID ? Number(leadID) : null,
//     leadStatus ? leadStatus : null
//   );

//   return res.json({
//     leadID,
//     redirectPath,
//   });
// };

const validateStepAccess = async (
  customerID: number,
  leadID: number | null,
  currentStep: any,
  productID: number,
  leadInfo: any,
  leadType: string
): Promise<{
  isValid: boolean;
  missingStep?: any;
  isCompletedStep?: boolean;
}> => {
  try {
    let allSteps = [];

    if (!leadID && leadType === "New") {
      try {
        const genericSteps = await stepControlModel.find({
          where: {
            product_id: productID,
            is_active: true,
            provider_id: StepProvider.GENERIC,
          },
          order: [{ column: "step_order", order: "asc" }],
        });

        const newSteps = await stepControlModel.find({
          where: {
            product_id: productID,
            is_active: true,
            provider_id: StepProvider.NEW,
          },
          order: [{ column: "step_order", order: "asc" }],
        });

        allSteps = [...genericSteps, ...newSteps];
      } catch (error) {
        console.error("Error fetching steps for new user:", error);
        return { isValid: false };
      }
    } else {
      const provider_id = leadID
        ? leadType
        : currentStep === "EMPLOYMENT_DETAILS"
        ? "New"
        : "Generic";
      try {
        allSteps = await stepControlModel.find({
          where: {
            product_id: productID,
            is_active: true,
            provider_id,
          },
          order: [{ column: "step_order", order: "asc" }],
        });
      } catch (error) {
        console.error("Error fetching all steps:", error);
        return { isValid: false };
      }
    }

    if (!allSteps || allSteps.length === 0) {
      console.error("No active steps found for product");
      return { isValid: false };
    }

    let stepTrackerRows = [];
    try {
      stepTrackerRows = await stepTrackerModel.find({
        where: {
          customer_id: customerID,
          is_deleted: 0,
          ...(leadID && { lead_id: leadID }),
        },
      });
    } catch (error) {
      console.error("Error fetching step tracker rows:", error);
      stepTrackerRows = [];
    }

    const completedStepIds = new Set(
      stepTrackerRows
        .filter((row: any) => row && row.is_completed === 1)
        .map((row) => row.step_id)
        .filter((id) => id !== undefined && id !== null)
    );

    const effectiveLeadType = leadType || "New";

    console.log(
      `[validateStepAccess] Customer ${customerID} completed steps:`,
      Array.from(completedStepIds)
    );
    console.log(
      `[validateStepAccess] Current step ID: ${
        currentStep.id
      }, Is completed: ${completedStepIds.has(currentStep.id)}`
    );
    console.log(
      `[validateStepAccess] LeadType: ${effectiveLeadType}, LeadID: ${leadID}`
    );

    if (effectiveLeadType === "New" && !leadID) {
      console.log(
        `[validateStepAccess] New user without leadID - checking step completion`
      );

      if (completedStepIds.has(currentStep.id)) {
        const nextIncompleteStep = getNextIncompleteStepForNewUser(
          allSteps,
          completedStepIds
        );
        console.warn(
          `[validateStepAccess] New user accessing completed step: ${currentStep.step_display_name}, redirecting to next incomplete step`
        );
        return {
          isValid: false,
          missingStep: nextIncompleteStep,
          isCompletedStep: true,
        };
      }

      const nextIncompleteStep = getNextIncompleteStepForNewUser(
        allSteps,
        completedStepIds
      );

      if (nextIncompleteStep && nextIncompleteStep.id === currentStep.id) {
        console.log(
          `[validateStepAccess] Allowing access to next incomplete step: ${currentStep.step_display_name}`
        );
        return { isValid: true };
      }

      if (nextIncompleteStep) {
        console.log(
          `[validateStepAccess] Redirecting to correct next step: ${nextIncompleteStep.step_display_name}`
        );
        return { isValid: false, missingStep: nextIncompleteStep };
      }

      console.log(`[validateStepAccess] All steps completed for new user`);
      return { isValid: true };
    }

    if (leadID) {
      if (completedStepIds.has(currentStep.id)) {
        const nextIncompleteStep = getNextIncompleteStepForNewUser(
          allSteps,
          completedStepIds
        );
        console.warn(
          `[validateStepAccess] New user accessing completed step: ${currentStep.step_display_name}`
        );
        return {
          isValid: false,
          missingStep: nextIncompleteStep,
          isCompletedStep: true,
        };
      }

      const nextIncompleteStep = getNextIncompleteStepForNewUser(
        allSteps,
        completedStepIds
      );
      if (nextIncompleteStep && nextIncompleteStep.id === currentStep.id) {
        return { isValid: true };
      }

      if (nextIncompleteStep) {
        return { isValid: false, missingStep: nextIncompleteStep };
      }

      return { isValid: true };
    }
    if (effectiveLeadType !== "Repeat") {
      const genericSteps = allSteps.filter(
        (step) => step && step.provider_id === StepProvider.GENERIC
      );

      if (currentStep.provider_id === StepProvider.GENERIC) {
        return validateGenericStepAccess(
          genericSteps,
          completedStepIds,
          currentStep
        );
      }
    }
    if (!leadID || !leadInfo) {
      const incompleteStep = allSteps.find(
        (step) => step && !completedStepIds.has(step.id)
      );
      if (incompleteStep) {
        return { isValid: false, missingStep: incompleteStep };
      }
      return { isValid: false };
    }

    const leadStatus = leadInfo?.status;
    if (!leadStatus) {
      console.error("Lead status not found");
      return { isValid: false };
    }

    switch (leadStatus) {
      case LeadStatus.REJECTED:
      case LeadStatus.REJECTED_PROCESS:
      case LeadStatus.BANK_UPDATE_REJECTED:
      case LeadStatus.NOT_ELIGIBLE:
        return await validateRejectedCustomerAccess(
          customerID,
          leadID,
          currentStep,
          productID
        );

      case LeadStatus.CLOSED:
        return await validateClosedCustomerAccess(
          customerID,
          leadID,
          currentStep,
          productID
        );

      case LeadStatus.NOT_INTERESTED:
      case LeadStatus.NOT_REQUIRED:
      case LeadStatus.NOT_REQUIRED_PROCESS:
      case LeadStatus.DUPLICATE:
        return await validateNotRequiredCustomerAccess(
          customerID,
          currentStep,
          productID
        );

      case LeadStatus.HOLD:
      case LeadStatus.HOLD_PROCESS:
      case LeadStatus.SETTLEMENT:
      case LeadStatus.BLACK_LISTED:
      case LeadStatus.DISBURSED:
      case LeadStatus.PART_PAYMENT:
        return { isValid: false };

      default:
        return await validateActiveCustomerAccess(
          customerID,
          leadID,
          currentStep,
          productID,
          allSteps,
          completedStepIds,
          leadInfo
        );
    }
  } catch (error) {
    console.error("Error in validateStepAccess:", error);
    return { isValid: false };
  }
};

const validateGenericStepAccess = (
  genericSteps: any[],
  completedStepIds: Set<number>,
  currentStep: any
): { isValid: boolean; missingStep?: any } => {
  try {
    if (!genericSteps || !Array.isArray(genericSteps)) {
      console.error("Invalid generic steps array");
      return { isValid: false };
    }

    if (!completedStepIds || !currentStep) {
      console.error("Invalid parameters for generic step validation");
      return { isValid: false };
    }

    const incompleteGenericSteps = genericSteps.filter(
      (step) => step && step.id && !completedStepIds.has(step.id)
    );

    if (incompleteGenericSteps.length === 0) {
      return {
        isValid: currentStep.id && completedStepIds.has(currentStep.id),
      };
    }

    const isValid =
      incompleteGenericSteps[0]?.id === currentStep.id ||
      (currentStep.id && completedStepIds.has(currentStep.id));

    if (!isValid && incompleteGenericSteps.length > 0) {
      return { isValid: false, missingStep: incompleteGenericSteps[0] };
    }

    return { isValid };
  } catch (error) {
    console.error("Error in validateGenericStepAccess:", error);
    return { isValid: false };
  }
};

const validateActiveCustomerAccess = async (
  customerID: number,
  leadID: number,
  currentStep: any,
  productID: number,
  allSteps: any[],
  completedStepIds: Set<number>,
  leadInfo: any
): Promise<{ isValid: boolean; missingStep?: any }> => {
  try {
    if (
      !allSteps ||
      !Array.isArray(allSteps) ||
      !completedStepIds ||
      !currentStep
    ) {
      console.error("Invalid parameters for active customer validation");
      return { isValid: false };
    }

    const genericSteps = allSteps.filter(
      (step) => step && step.provider_id === StepProvider.GENERIC
    );
    const genericStepIds = new Set(
      genericSteps.map((step) => step.id).filter((id) => id !== undefined)
    );
    const completedGenericSteps = [...completedStepIds].filter((id) =>
      genericStepIds.has(id)
    );

    if (completedGenericSteps.length < genericSteps.length) {
      if (currentStep.provider_id === StepProvider.GENERIC) {
        const incompleteGeneric = genericSteps.filter(
          (step) => step && step.id && !completedStepIds.has(step.id)
        );
        const isValid = incompleteGeneric[0]?.id === currentStep.id;

        if (!isValid && incompleteGeneric.length > 0) {
          return { isValid: false, missingStep: incompleteGeneric[0] };
        }

        return { isValid };
      }

      const incompleteGeneric = genericSteps.filter(
        (step) => step && step.id && !completedStepIds.has(step.id)
      );
      return { isValid: false, missingStep: incompleteGeneric[0] };
    }

    const providerSteps = allSteps.filter(
      (step) =>
        step &&
        step.provider_id === currentStep.provider_id &&
        step.provider_id !== StepProvider.GENERIC
    );

    const incompleteProviderSteps = providerSteps.filter(
      (step) => step && step.id && !completedStepIds.has(step.id)
    );
    const isValid =
      incompleteProviderSteps[0]?.id === currentStep.id ||
      (currentStep.id && completedStepIds.has(currentStep.id));

    if (!isValid && incompleteProviderSteps.length > 0) {
      return { isValid: false, missingStep: incompleteProviderSteps[0] };
    }

    return { isValid };
  } catch (error) {
    console.error("Error in validateActiveCustomerAccess:", error);
    return { isValid: false };
  }
};

const validateRejectedCustomerAccess = async (
  customerID: number,
  leadID: number,
  currentStep: any,
  productID: number
): Promise<{ isValid: boolean; missingStep?: any }> => {
  try {
    if (!customerID || !leadID || !currentStep || !productID) {
      console.error("Invalid parameters for rejected customer validation");
      return { isValid: false };
    }

    let rejectionStatus = null;
    try {
      rejectionStatus = await leadService.checkRejectedCase(
        leadID,
        customerID,
        LeadStatus.REJECTED
      );
    } catch (error) {
      console.error("Error checking rejected case:", error);
      return { isValid: false };
    }

    if (rejectionStatus?.isRejected) {
      return { isValid: false };
    }

    if (currentStep.provider_id === StepProvider.REPEAT_CUSTOMER) {
      let repeatSteps = [];
      try {
        repeatSteps = await stepControlModel.find({
          where: {
            product_id: productID,
            provider_id: StepProvider.REPEAT_CUSTOMER,
            is_active: true,
          },
          order: [{ column: "step_order", order: "asc" }],
        });
      } catch (error) {
        console.error("Error fetching repeat steps:", error);
        return { isValid: false };
      }

      let completedSteps = [];
      try {
        completedSteps = await stepTrackerModel.find({
          where: {
            customer_id: customerID,
            lead_id: leadID,
            is_completed: true,
          },
        });
      } catch (error) {
        console.error("Error fetching completed steps:", error);
        completedSteps = [];
      }

      const completedStepIds = new Set(
        completedSteps
          .map((step) => step?.step_id)
          .filter((id) => id !== undefined && id !== null)
      );

      const incompleteSteps = repeatSteps.filter(
        (step) => step && step.id && !completedStepIds.has(step.id)
      );
      const isValid =
        incompleteSteps[0]?.id === currentStep.id ||
        (currentStep.id && completedStepIds.has(currentStep.id));

      if (!isValid && incompleteSteps.length > 0) {
        return { isValid: false, missingStep: incompleteSteps[0] };
      }

      return { isValid };
    }

    return { isValid: false };
  } catch (error) {
    console.error("Error in validateRejectedCustomerAccess:", error);
    return { isValid: false };
  }
};

const validateClosedCustomerAccess = async (
  customerID: number,
  leadID: number,
  currentStep: any,
  productID: number
): Promise<{ isValid: boolean; missingStep?: any }> => {
  try {
    if (!customerID || !leadID || !currentStep || !productID) {
      console.error("Invalid parameters for closed customer validation");
      return { isValid: false };
    }

    if (currentStep.provider_id === StepProvider.REPEAT_CUSTOMER) {
      let repeatSteps = [];
      try {
        repeatSteps = await stepControlModel.find({
          where: {
            product_id: productID,
            provider_id: StepProvider.REPEAT_CUSTOMER,
            is_active: true,
          },
          order: [{ column: "step_order", order: "asc" }],
        });
      } catch (error) {
        console.error(
          "Error fetching repeat steps for closed customer:",
          error
        );
        return { isValid: false };
      }

      const isValid = repeatSteps[0]?.id === currentStep.id;

      if (!isValid && repeatSteps.length > 0) {
        return { isValid: false, missingStep: repeatSteps[0] };
      }

      return { isValid };
    }

    return { isValid: false };
  } catch (error) {
    console.error("Error in validateClosedCustomerAccess:", error);
    return { isValid: false };
  }
};

const validateNotRequiredCustomerAccess = async (
  customerID: number,
  currentStep: any,
  productID: number
): Promise<{ isValid: boolean; missingStep?: any }> => {
  try {
    if (!customerID || !currentStep || !productID) {
      console.error("Invalid parameters for not required customer validation");
      return { isValid: false };
    }

    if (currentStep.provider_id === StepProvider.REPEAT_CUSTOMER) {
      let repeatSteps = [];
      try {
        repeatSteps = await stepControlModel.find({
          where: {
            product_id: productID,
            provider_id: StepProvider.REPEAT_CUSTOMER,
            is_active: true,
          },
          order: [{ column: "step_order", order: "asc" }],
        });
      } catch (error) {
        console.error(
          "Error fetching repeat steps for not required customer:",
          error
        );
        return { isValid: false };
      }

      const isValid = repeatSteps[0]?.id === currentStep.id;

      if (!isValid && repeatSteps.length > 0) {
        return { isValid: false, missingStep: repeatSteps[0] };
      }

      return { isValid };
    }

    return { isValid: false };
  } catch (error) {
    console.error("Error in validateNotRequiredCustomerAccess:", error);
    return { isValid: false };
  }
};
