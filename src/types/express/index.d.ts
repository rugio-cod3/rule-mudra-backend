import { ICustomer, IUser } from "@/interfaces/customer.interface";
import { IStepTrackerJoinStepControl } from "@/interfaces/step-tracker";

export interface StepTrackingData {
  customerID: number;
  leadID: number | null;
  stepID: number;
  shouldTrack?: boolean;
}

export interface NextStepData {
  currentStep: IStepTrackerJoinStepControl | null;
  leadID: number | null;
  leadInfo: any;
  productID: number | null;
  effectiveLeadType: string | null;
}
declare global {
  namespace Express {
    interface Request {
      validatedBody: any;
      validatedParams: any;
      validatedQuery: any;
      customer: ICustomer;
      user: IUser;
      paginate: {
        skip: number;
        take: number;
      };
      userStep: IStepTrackerJoinStepControl;
      stepTrackingData?: StepTrackingData;
      nextStepData?: NextStepData;
      shouldTrack?: boolean;
    }
  }

  interface Number {
    readonly str: string;
  }
}

export { };
