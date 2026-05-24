// import { NextFunction, Request, Response } from "express";
// import { createStepTrackerEntry } from "../middlewares/stepCheck2.middleware";

// export const stepTrackerAfterResponse = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   req.shouldTrack = req.shouldTrack ?? false;

//   res.on("finish", async () => {
//     if (
//       req.shouldTrack &&
//       res.statusCode >= 200 &&
//       res.statusCode < 300 &&
//       req.stepTrackingData
//     ) {
//       const { customerID, leadID, stepID } = req.stepTrackingData;
//       console.log("📌 Creating step tracker entry", {
//         customerID,
//         leadID,
//         stepID,
//       });
//       await createStepTrackerEntry(customerID, leadID, stepID);
//     }
//   });

//   next();
// };




import { NextFunction, Request, Response } from "express";
import { createStepTrackerEntry } from "../middlewares/stepCheck2.middleware";
import { stepControlModel } from "@/database/mysql/step-control";

const findNextStep = async (req: Request) => {
  const { currentStep, leadID, leadInfo, productID, effectiveLeadType } = req.nextStepData || {};
  if (!currentStep) return null;

  if (currentStep.provider_id === 'Generic') {
    const genericSteps = await stepControlModel.find({
      where: { product_id: productID, is_active: true, provider_id: 'Generic' },
      order: [{ column: "step_order", order: "asc" }],
    });

    const currentIndex = genericSteps.findIndex(step => step.id === currentStep.id);
    const nextGenericStep = genericSteps[currentIndex + 1];

    if (nextGenericStep) {
      return {
        stepId: nextGenericStep.id,
        stepName: nextGenericStep.step_name,
        displayName: nextGenericStep.step_display_name,
        nextRoute: nextGenericStep.current_route,
        redirectTo: nextGenericStep.current_route
      };
    }

    const providerSteps = await stepControlModel.find({
      where: { product_id: productID, is_active: true, provider_id: effectiveLeadType || 'New' },
      order: [{ column: "step_order", order: "asc" }],
    });

    const firstProviderStep = providerSteps[0];
    return firstProviderStep ? {
      stepId: firstProviderStep.id,
      stepName: firstProviderStep.step_name,
      displayName: firstProviderStep.step_display_name,
      nextRoute: firstProviderStep.current_route,
      redirectTo: firstProviderStep.current_route
    } : null;
  }

  const allSteps = await stepControlModel.find({
    where: { product_id: productID, is_active: true, provider_id: currentStep.provider_id },
    order: [{ column: "step_order", order: "asc" }],
  });

  const currentIndex = allSteps.findIndex(step => step.id === currentStep.id);
  const nextStep = allSteps[currentIndex + 1] || null;

  return nextStep ? {
    stepId: nextStep.id,
    stepName: nextStep.step_name,
    displayName: nextStep.step_display_name,
    nextRoute: nextStep.current_route,
    redirectTo: nextStep.current_route
  } : null;
};

export const stepTrackerAfterResponse = (req: Request, res: Response, next: NextFunction) => {
  req.shouldTrack = req.shouldTrack ?? false;

  const originalJson = res.json;
  res.json = function (data) {
    if (res.statusCode >= 200 && res.statusCode < 300 && req.nextStepData) {
      findNextStep(req).then(nextStep => {
        if (nextStep) data.nextStep = nextStep;
        return originalJson.call(this, data);
      }).catch(() => originalJson.call(this, data));
      return this; // Fix TypeScript error
    } else {
      return originalJson.call(this, data);
    }
  };

  res.on("finish", async () => {
    if (req.shouldTrack && res.statusCode >= 200 && res.statusCode < 300 && req.stepTrackingData) {
      const { customerID, leadID, stepID } = req.stepTrackingData;
      console.log("📌 Creating step tracker entry", {
        customerID,
        leadID,
        stepID,
      });
      await createStepTrackerEntry(customerID, leadID, stepID);
    }
  });

  next();
};