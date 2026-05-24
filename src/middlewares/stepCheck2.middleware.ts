import { leadModel } from "@/database/mysql/leads";
import { otpModel } from "@/database/mysql/login_otp";
import { stepControlModel } from "@/database/mysql/step-control";
import { stepTrackerModel } from "@/database/mysql/step_tracker";
import { StepName } from "@/enums/common.enum";
import { LeadStatus } from "@/enums/lead.enum";
import { ProductID, Products } from "@/enums/product.enum";
import { StepProvider } from "@/enums/step.enum";
import { NotFoundError } from "@/errors";
import { customerService } from "@/services/customer.service";
import { leadService } from "@/services/lead.service";
import { logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

const getRedirectPath = (
  currentRoute: string | null,
  nextStepName: string | null,
  leadID: number | null
): string => {
  if (!nextStepName && leadID) {
    return "/dashboard";
  } else if (nextStepName === "LOAN_APPROVAL") {
    return "/process-to-bank";
  } else if (
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
    return "/loan-approval";
  } else {
    return currentRoute || "/";
  }
};

export const stepCheck2 = (stepName: StepName, product: Products) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let customerID;
      if (req.body.request_id) {
        const getOtpInfo = await otpModel.find({
          where: {
            request_id: req.body.request_id,
          },
          select: ["mobile_no"],
          order: [{ column: "id", order: "desc" }],
        });
        const customer_mobile_no = getOtpInfo["mobile_no"];
        const getCustomerId = await customerService.findOne({
          mobile: customer_mobile_no,
        });
        customerID = getCustomerId.customerID;
      } else {
        customerID = req?.customer?.customerID;
      }

      let leadID: number | null = null;
      if (req.body.loan_id || req.body.leadID) {
        leadID = Number(req.body.loan_id ?? req.body.leadID);
      } else if (req.query.loan_id || req.query.leadID) {
        leadID = Number(req.query.loan_id ?? req.query.leadID);
      } else if (req.params.loan_id || req.params.leadID) {
        leadID = Number(req.params.loan_id ?? req.params.leadID);
      }

      const customerInfo = await customerService.findOne({ customerID });
      if (!customerInfo) {
        throw new NotFoundError("Customer not found");
      }

      const productID =
        product === Products.PAYDAY ? ProductID.PAYDAY : ProductID.EMI;

      let leadInfo = null;
      if (leadID) {
        leadInfo = await leadService.findOne({ leadID }, ["*"]);
      } else {
        leadInfo = await leadModel.findOne({
          where: { customerID },
          order: [{ column: "leadID", order: "desc" }],
          select: ["leadID", "status", "fbLeads"],
        });
        if (leadInfo) {
          leadID = leadInfo.leadID;
        }
      }

      let leadType = "";
      if (leadID && leadInfo) {
        const pastLeadCount = await leadService.count(
          { customerID: customerID },
          { leadID: leadID }
        );

        const leadCount = Number(pastLeadCount || 0);
        if (leadCount === 0 && leadInfo.status !== LeadStatus.CLOSED) {
          leadType = "New";
        } else if (leadInfo.status === LeadStatus.APPROVED) {
          leadType = "Existing";
        } else {
          leadType = "Repeat";
        }
      }

      const getProviderFromLeadType = (leadType: string): string => {
        switch (leadType) {
          case "New":
            return StepProvider.NEW;
          case "Repeat":
            return StepProvider.REPEAT_CUSTOMER;
          case "Existing":
            return StepProvider.EXISTING;
          default:
            return StepProvider.GENERIC;
        }
      };

      let currentStep = null;

      // const effectiveLeadType = leadType || "New";
      let effectiveLeadType = "New";
      if (leadType) {
        effectiveLeadType = leadType;
      }

      const expectedProvider = getProviderFromLeadType(effectiveLeadType);
      currentStep = await stepControlModel.findOne({
        where: {
          step_name: stepName,
          product_id: productID,
          provider_id: expectedProvider,
          is_active: true,
        },
      });

      if (!currentStep) {
        currentStep = await stepControlModel.findOne({
          where: {
            step_name: stepName,
            product_id: productID,
            provider_id: StepProvider.GENERIC,
            is_active: true,
          },
        });
      }

      if (!currentStep) {
        throw new NotFoundError(
          `Step '${stepName}' not found for provider '${expectedProvider}' or 'Generic'`
        );
      }

      const validationResult = await validateStepAccess(
        customerID,
        leadID,
        currentStep,
        productID,
        leadInfo,
        leadType
      );

      if (!validationResult.isValid) {
        const redirectPath = getRedirectPath(
          validationResult.missingStep?.current_route || null,
          validationResult.missingStep?.step_name || null,
          leadID
        );

        return res.status(422).json({
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
            customerID,
            name: customerInfo.name || "Unknown",
            aadharNo: customerInfo.aadharNo || null,
            pan_cust_verified: customerInfo.pan_cust_verified || null,
            dob_digit_match: customerInfo.dob_digit_match || null,
            emandate_required: customerInfo.emandate_required || null,
            is_dob_match: customerInfo.is_dob_match || null,
          },
        });
      }

      // await createStepTrackerEntry(customerID, leadID, currentStep.id);
      req.stepTrackingData = {
        customerID,
        leadID,
        stepID: currentStep.id,
      };

      req.nextStepData = {
        currentStep,
        leadID,
        leadInfo,
        productID,
        effectiveLeadType,
      };

      return next();
    } catch (error) {
      console.error("Step Check Error:", error);
      next(error);
    }
  };
};

export const getRedirectRoute = (req: Request, res: Response) => {
  const { current_route, next_step_name, leadID } = req.query as {
    current_route?: string;
    next_step_name?: string | null;
    leadID?: string;
  };

  const redirectPath = getRedirectPath(
    current_route || null,
    next_step_name || null,
    leadID ? Number(leadID) : null
  );

  return res.json({
    leadID,
    redirectPath,
  });
};

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
  const provider_id = leadID
    ? leadType
    : currentStep.step_name === "EMPLOYMENT_DETAILS"
    ? "New"
    : "Generic";
  const allSteps = await stepControlModel.find({
    where: {
      product_id: productID,
      is_active: true,
      provider_id,
    },
    order: [{ column: "step_order", order: "asc" }],
  });

  logger.info(`[validateStepAccess] allSteps: ${JSON.stringify(allSteps)}`);
  logger.info(
    `[validateStepAccess] currentStep: ${JSON.stringify(currentStep)}`
  );
  logger.info(`[validateStepAccess] leadType: ${leadType}`);

  const stepTrackerRows = await stepTrackerModel.find({
    where: {
      customer_id: customerID,
      is_deleted: 0,
      ...(leadID && { lead_id: leadID }),
    },
  });

  logger.info(
    `[validateStepAccess] stepTrackerRows: ${JSON.stringify(stepTrackerRows)}`
  );

  const completedStepIds = new Set(
    stepTrackerRows
      .filter((row: any) => row.is_completed === 1)
      .map((row) => row.step_id)
      .filter((id) => id !== undefined && id !== null)
  );

  logger.info(
    `[validateStepAccess] completedStepIds: ${JSON.stringify([
      ...completedStepIds,
    ])}`
  );

  const effectiveLeadType = leadType || "New";

  if (effectiveLeadType === "New" && completedStepIds.has(currentStep.id)) {
    const nextIncompleteStep = getNextIncompleteStepForNewUser(
      allSteps,
      completedStepIds
    );
    logger.warn(
      `[validateStepAccess] New user accessing completed step: ${currentStep.step_display_name}`
    );
    return {
      isValid: false,
      missingStep: nextIncompleteStep,
      isCompletedStep: true,
    };
  }

  if (currentStep.provider_id === StepProvider.GENERIC) {
    const genericSteps = allSteps.filter(
      (step) => step.provider_id === StepProvider.GENERIC
    );
    return validateGenericStepAccess(
      genericSteps,
      completedStepIds,
      currentStep
    );
  }

  if (!leadID || !leadInfo) {
    logger.warn(
      `[validateStepAccess] No leadID or leadInfo - treating as new user`
    );
    return await validateNewUserAccess(
      customerID,
      currentStep,
      productID,
      allSteps,
      completedStepIds
    );
  }

  switch (leadInfo.status) {
    case LeadStatus.REJECTED:
    case LeadStatus.REJECTED_PROCESS:
    case LeadStatus.BANK_UPDATE_REJECTED:
    case LeadStatus.NOT_ELIGIBLE:
      logger.info(`[validateStepAccess] LeadStatus: REJECTED`);
      return await validateRejectedCustomerAccess(
        customerID,
        leadID,
        currentStep,
        productID
      );

    case LeadStatus.CLOSED:
      logger.info(`[validateStepAccess] LeadStatus: CLOSED`);
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
      logger.info(`[validateStepAccess] LeadStatus: NOT_REQUIRED`);
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
      logger.info(`[validateStepAccess] LeadStatus: BLOCKED`);
      return { isValid: false };

    default:
      logger.info(`[validateStepAccess] LeadStatus: ACTIVE`);
      return await validateActiveCustomerAccess(
        customerID,
        leadID,
        currentStep,
        productID,
        allSteps,
        completedStepIds,
        leadInfo,
        effectiveLeadType
      );
  }
};

const validateGenericStepAccess = (
  genericSteps: any[],
  completedStepIds: Set<number>,
  currentStep: any
): { isValid: boolean; missingStep?: any } => {
  const incompleteGenericSteps = genericSteps.filter(
    (step) => !completedStepIds.has(step.id)
  );
  logger.info(
    `[validateGenericStepAccess] incompleteGenericSteps: ${JSON.stringify(
      incompleteGenericSteps
    )}`
  );

  if (incompleteGenericSteps.length === 0) {
    logger.info(`[validateGenericStepAccess] All generic steps complete`);
    return { isValid: completedStepIds.has(currentStep.id) };
  }

  const isValid =
    incompleteGenericSteps[0]?.id === currentStep.id ||
    completedStepIds.has(currentStep.id);

  logger.info(
    `[validateGenericStepAccess] isValid: ${isValid}, currentStep: ${currentStep.step_display_name}`
  );

  if (!isValid && incompleteGenericSteps.length > 0) {
    logger.warn(
      `[validateGenericStepAccess] Missing generic step: ${incompleteGenericSteps[0].step_display_name}`
    );
    return { isValid: false, missingStep: incompleteGenericSteps[0] };
  }

  return { isValid };
};

const validateActiveCustomerAccess = async (
  customerID: number,
  leadID: number,
  currentStep: any,
  productID: number,
  allSteps: any[],
  completedStepIds: Set<number>,
  leadInfo: any,
  leadType: string
): Promise<{ isValid: boolean; missingStep?: any }> => {
  const genericSteps = allSteps.filter(
    (step) => step.provider_id === StepProvider.GENERIC
  );
  const incompleteGenericSteps = genericSteps.filter(
    (step) => !completedStepIds.has(step.id)
  );

  logger.info(
    `[validateActiveCustomerAccess] incompleteGenericSteps: ${JSON.stringify(
      incompleteGenericSteps
    )}`
  );

  if (incompleteGenericSteps.length > 0) {
    if (currentStep.provider_id === StepProvider.GENERIC) {
      const isValid = incompleteGenericSteps[0]?.id === currentStep.id;
      logger.info(
        `[validateActiveCustomerAccess] Generic step validation - isValid: ${isValid}`
      );

      if (!isValid) {
        logger.warn(
          `[validateActiveCustomerAccess] Missing generic step: ${incompleteGenericSteps[0].step_display_name}`
        );
        return { isValid: false, missingStep: incompleteGenericSteps[0] };
      }
      return { isValid };
    } else {
      logger.warn(
        `[validateActiveCustomerAccess] Missing generic step (non-generic attempt): ${incompleteGenericSteps[0]?.step_display_name}`
      );
      return { isValid: false, missingStep: incompleteGenericSteps[0] };
    }
  }

  const expectedProvider = getProviderFromLeadType(leadType);
  const providerSteps = allSteps.filter(
    (step) =>
      step.provider_id === expectedProvider &&
      step.provider_id !== StepProvider.GENERIC
  );

  logger.info(
    `[validateActiveCustomerAccess] expectedProvider: ${expectedProvider}`
  );
  // logger.info(
  //   `[validateActiveCustomerAccess] providerSteps: ${JSON.stringify(
  //     providerSteps
  //   )}`
  // );

  const incompleteProviderSteps = providerSteps.filter(
    (step) => !completedStepIds.has(step.id)
  );
  logger.info(
    `[validateActiveCustomerAccess] incompleteProviderSteps: ${JSON.stringify(
      incompleteProviderSteps
    )}`
  );

  if (
    currentStep.provider_id !== expectedProvider &&
    currentStep.provider_id !== StepProvider.GENERIC
  ) {
    logger.warn(
      `[validateActiveCustomerAccess] Wrong provider. Expected: ${expectedProvider}, Got: ${currentStep.provider_id}`
    );

    if (incompleteProviderSteps.length > 0) {
      return { isValid: false, missingStep: incompleteProviderSteps[0] };
    }
    return { isValid: false };
  }

  const isValid =
    incompleteProviderSteps[0]?.id === currentStep.id ||
    completedStepIds.has(currentStep.id);

  logger.info(
    `[validateActiveCustomerAccess] isValid: ${isValid}, currentStep: ${currentStep.step_display_name}`
  );

  if (!isValid && incompleteProviderSteps.length > 0) {
    logger.warn(
      `[validateActiveCustomerAccess] Missing provider step: ${incompleteProviderSteps[0].step_display_name}`
    );
    return { isValid: false, missingStep: incompleteProviderSteps[0] };
  }

  return { isValid };
};

const validateNewUserAccess = async (
  customerID: number,
  currentStep: any,
  productID: number,
  allSteps: any[],
  completedStepIds: Set<number>
): Promise<{ isValid: boolean; missingStep?: any }> => {
  logger.info(
    `[validateNewUserAccess] Validating new user access for step: ${currentStep.step_display_name}`
  );

  const genericSteps = allSteps
    .filter((step) => step.provider_id === "Generic")
    .sort((a, b) => a.step_order - b.step_order);

  const incompleteGenericSteps = genericSteps.filter(
    (step) => !completedStepIds.has(step.id)
  );

  logger.info(
    `[validateNewUserAccess] incompleteGenericSteps: ${JSON.stringify(
      incompleteGenericSteps
    )}`
  );

  if (incompleteGenericSteps.length > 0) {
    if (currentStep.provider_id === "Generic") {
      const isValid =
        incompleteGenericSteps[0]?.id === currentStep.id ||
        completedStepIds.has(currentStep.id);
      logger.info(
        `[validateNewUserAccess] Generic step validation - isValid: ${isValid}`
      );

      if (!isValid) {
        logger.warn(
          `[validateNewUserAccess] Missing generic step: ${incompleteGenericSteps[0].step_display_name}`
        );
        return { isValid: false, missingStep: incompleteGenericSteps[0] };
      }
      return { isValid };
    } else {
      logger.warn(
        `[validateNewUserAccess] Missing generic step (non-generic attempt): ${incompleteGenericSteps[0]?.step_display_name}`
      );
      return { isValid: false, missingStep: incompleteGenericSteps[0] };
    }
  }

  const newProviderSteps = allSteps
    .filter((step) => step.provider_id === "New")
    .sort((a, b) => a.step_order - b.step_order);

  logger.info(
    `[validateNewUserAccess] newProviderSteps: ${JSON.stringify(
      newProviderSteps
    )}`
  );

  const incompleteNewSteps = newProviderSteps.filter(
    (step) => !completedStepIds.has(step.id)
  );
  logger.info(
    `[validateNewUserAccess] incompleteNewSteps: ${JSON.stringify(
      incompleteNewSteps
    )}`
  );

  if (
    currentStep.provider_id !== "New" &&
    currentStep.provider_id !== "Generic"
  ) {
    logger.warn(
      `[validateNewUserAccess] Wrong provider. Expected: New, Got: ${currentStep.provider_id}`
    );

    if (incompleteNewSteps.length > 0) {
      return { isValid: false, missingStep: incompleteNewSteps[0] };
    }
    return { isValid: false };
  }

  const isValid =
    incompleteNewSteps[0]?.id === currentStep.id ||
    completedStepIds.has(currentStep.id);

  logger.info(
    `[validateNewUserAccess] isValid: ${isValid}, currentStep: ${currentStep.step_display_name}`
  );

  if (!isValid && incompleteNewSteps.length > 0) {
    logger.warn(
      `[validateNewUserAccess] Missing New provider step: ${incompleteNewSteps[0].step_display_name}`
    );
    return { isValid: false, missingStep: incompleteNewSteps[0] };
  }

  return { isValid };
};

const getNextIncompleteStepForNewUser = (
  allSteps: any[],
  completedStepIds: Set<number>
) => {
  const genericSteps = allSteps
    .filter((step) => step.provider_id === "Generic")
    .sort((a, b) => a.step_order - b.step_order);

  const incompleteGenericStep = genericSteps.find(
    (step) => !completedStepIds.has(step.id)
  );
  if (incompleteGenericStep) {
    return incompleteGenericStep;
  }

  const newProviderSteps = allSteps
    .filter((step) => step.provider_id === "New")
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

const getProviderFromLeadType = (leadType: string): string => {
  switch (leadType) {
    case "New":
      return "New";
    case "Repeat":
      return "Repeat";
    case "Existing":
      return "Existing";
    default:
      return StepProvider.GENERIC;
  }
};

const validateRejectedCustomerAccess = async (
  customerID: number,
  leadID: number,
  currentStep: any,
  productID: number
): Promise<{ isValid: boolean; missingStep?: any }> => {
  const rejectionStatus = await leadService.checkRejectedCase(
    leadID,
    customerID,
    LeadStatus.REJECTED
  );

  if (rejectionStatus.isRejected) {
    return { isValid: false };
  }

  if (currentStep.provider_id === "Repeat") {
    const repeatSteps = await stepControlModel.find({
      where: {
        product_id: productID,
        provider_id: "Repeat",
        is_active: true,
      },
      order: [{ column: "step_order", order: "asc" }],
    });

    const completedSteps = await stepTrackerModel.find({
      where: { customer_id: customerID, lead_id: leadID, is_completed: true },
    });

    const completedStepIds = new Set(
      completedSteps.map((step) => step.step_id)
    );
    const incompleteSteps = repeatSteps.filter(
      (step) => !completedStepIds.has(step.id)
    );
    const isValid =
      incompleteSteps[0]?.id === currentStep.id ||
      completedStepIds.has(currentStep.id);

    if (!isValid && incompleteSteps.length > 0) {
      return { isValid: false, missingStep: incompleteSteps[0] };
    }

    return { isValid };
  }

  return { isValid: false };
};

const validateClosedCustomerAccess = async (
  customerID: number,
  leadID: number,
  currentStep: any,
  productID: number
): Promise<{ isValid: boolean; missingStep?: any }> => {
  if (currentStep.provider_id === "Repeat") {
    const repeatSteps = await stepControlModel.find({
      where: {
        product_id: productID,
        provider_id: "Repeat",
        is_active: true,
      },
      order: [{ column: "step_order", order: "asc" }],
    });

    const isValid = repeatSteps[0]?.id === currentStep.id;

    if (!isValid && repeatSteps.length > 0) {
      return { isValid: false, missingStep: repeatSteps[0] };
    }

    return { isValid };
  }

  return { isValid: false };
};

const validateNotRequiredCustomerAccess = async (
  customerID: number,
  currentStep: any,
  productID: number
): Promise<{ isValid: boolean; missingStep?: any }> => {
  if (currentStep.provider_id === "Repeat") {
    const repeatSteps = await stepControlModel.find({
      where: {
        product_id: productID,
        provider_id: "Repeat",
        is_active: true,
      },
      order: [{ column: "step_order", order: "asc" }],
    });

    const isValid = repeatSteps[0]?.id === currentStep.id;

    if (!isValid && repeatSteps.length > 0) {
      return { isValid: false, missingStep: repeatSteps[0] };
    }

    return { isValid };
  }

  return { isValid: false };
};

export const createStepTrackerEntry = async (
  customerID: number,
  leadID: number | null,
  stepID: number,
  stepName?: string,
  provider_id?: string
): Promise<void> => {
  try {
    if (!stepName && !provider_id) {
      const upsertStep = async (id: number) => {
        const existingEntry = await stepTrackerModel.findOneStepTracker({
          customer_id: customerID,
          step_id: id,
          ...(leadID && { lead_id: leadID }),
        });

        if (existingEntry) {
          await stepTrackerModel.findOneAndUpdate(
            {
              customer_id: customerID,
              step_id: id,
              ...(leadID && { lead_id: leadID }),
            },
            {
              is_completed: true,
              updated_at: new Date(),
            }
          );
        } else {
          await stepTrackerModel.insert({
            customer_id: customerID,
            lead_id: leadID,
            step_id: id,
            is_completed: true,
            is_deleted: 0,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      };
      await upsertStep(stepID);
      if (stepID === 3) {
        await upsertStep(2);
      }
    } else {
      const getStepControlData = await stepControlModel.findOne({
        where: {
          step_name: stepName,
          provider_id: provider_id,
        },
        select: ["*"],
      });
      const existingEntry = await stepTrackerModel.findOneStepTracker({
        customer_id: customerID,
        step_id: getStepControlData.id,
        ...(leadID && { lead_id: leadID }),
      });
      if (existingEntry) {
        await stepTrackerModel.findOneAndUpdate(
          {
            customer_id: customerID,
            step_id: getStepControlData.id,
            ...(leadID && { lead_id: leadID }),
          },
          {
            is_completed: true,
            updated_at: new Date(),
          }
        );
      } else {
        await stepTrackerModel.insert({
          customer_id: customerID,
          lead_id: leadID,
          step_id: getStepControlData.id,
          is_completed: true,
          is_deleted: 0,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error creating step tracker entry:", error);
  }
};

export const markStepCompleted = async (
  customerID: number,
  leadID: number | null,
  stepID: number
): Promise<void> => {
  try {
    await stepTrackerModel.findOneAndUpdate(
      {
        customer_id: customerID,
        step_id: stepID,
        ...(leadID && { lead_id: leadID }),
      },
      {
        is_completed: true,
        updated_at: new Date(),
      }
    );
  } catch (error) {
    console.error("Error marking step as completed:", error);
    throw error;
  }
};
