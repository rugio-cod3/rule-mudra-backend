import UserSummaryModel from "@/database/mysql/user_summary";
import { NotFoundError } from "@/errors/api-errors/notFoundError";
import CommonHelper from "@/helpers/common";
import { IAnswerQuestionPayload } from "@/interfaces/cibil.interface";
import {
  IExperianResponse,
  IGetQuestionExperianResponse,
  IPostAnswerOfExperianResponse,
} from "@/interfaces/php.interface";
import {
  generateDataForViewImpact,
  getDataForRepayment,
  getRepaymentData,
  makeAccountDetails,
  makeCreditReport,
} from "@/services/thirdParty/cibilAndBre.service";
import axios from "axios";
import AxiosService from "./api.service";
import CreditReportService from "./credit_report.service";

export const experianPull = async (
  token: string,
  customerId: number,
  name: string
) => {
  const data = {
    access_token: token,
  };
  let commonHelper = new CommonHelper();
  let userSummaryModel = new UserSummaryModel();
  let creditReportService = new CreditReportService();
  const apiService = new AxiosService(commonHelper.getBaseUrl());
  let experian = await apiService.call<
    //IExperianPullResponse,
    IExperianResponse,
    {
      access_token: string;
    },
    undefined
  >("post", "/loanapply/ramfincorp_api/experian_cibil", data, undefined, {
    "Content-Type": "application/json",
  });

  let response = experian;
  //console.log('response======>>>>>>', response)
  if (
    response &&
    response.data &&
    response.data.status === 1 &&
    response.data.message === "Success" &&
    !response.data.data.errorString &&
    !response.data.data.stageOneId_ &&
    !response.data.data.stageOneId_
  ) {
    let reportId = await creditReportService.findOneReport(
      { customerID: customerId, cr_provider: 1, status: 1 },
      ["id", "score"],
      [{ column: "id", order: "desc" }]
    );
    ("score");
    if (!reportId) throw new NotFoundError("report not found ");
    //reportId.id = 4539
    let saveDataReport = await makeCreditReport(reportId.id, name);
    let saveDataAccount = await makeAccountDetails(reportId.id);
    let repaymentData = await getDataForRepayment(reportId.id);
    let paymentHistory = await getRepaymentData(reportId.id);
    const viewData = await generateDataForViewImpact(
      repaymentData,
      paymentHistory
    );
    let saveObjectReport = {
      api_type: "report",
      customerID: customerId,
      provider_id: 1,
      json_value: JSON.stringify(saveDataReport),
      Status: 1,
      created_by: 1,
    };
    let saveObjectView = {
      api_type: "account",
      customerID: customerId,
      provider_id: 1,
      json_value: JSON.stringify(viewData),
      Status: 1,
      created_by: 1,
    };
    let saveObjectAccount = {
      api_type: "view",
      customerID: customerId,
      provider_id: 1,
      json_value: JSON.stringify(saveDataAccount),
      Status: 1,
      created_by: 1,
    };
    await userSummaryModel.insert(saveObjectReport);
    await userSummaryModel.insert(saveObjectView);
    await userSummaryModel.insert(saveObjectAccount);
  }
  return response.data;
};

// get question from php if experial pull failed
export const getQuestionExperian = async (
  token: string,
  stgOneHitId: number,
  stgTwoHitId: number
) => {
  const data = {
    access_token: token,
    stgOneHitId,
    stgTwoHitId,
  };
  let commonHelper = new CommonHelper();
  const apiService = new AxiosService(commonHelper.getBaseUrl());

  let experian = await apiService.call<
    IGetQuestionExperianResponse,
    {
      access_token: string;
      stgOneHitId: number;
      stgTwoHitId: number;
    },
    undefined
  >("post", "/loanapply/ramfincorp_api/experian_cibil_crq", data, undefined, {
    "Content-Type": "application/json",
  });

  let response = experian;
  return response.data;
};

//post answer and get second question if second question then experian pulled
export const postAnswerOfExperian = async (
  access_token: string,
  stgOneHitId: number,
  stgTwoHitId: number,
  questionId: number,
  answer1: string,
  answer2: string
) => {
  const data = {
    access_token,
    stgOneHitId,
    stgTwoHitId,
    questionId,
    answer1,
    answer2,
  };
  let commonHelper = new CommonHelper();
  const apiService = new AxiosService(commonHelper.getBaseUrl());

  let experian = await apiService.call<
    IPostAnswerOfExperianResponse,
    IAnswerQuestionPayload,
    undefined
  >("post", "/loanapply/ramfincorp_api/experian_cibil_crq", data, undefined, {
    "Content-Type": "application/json",
  });

  let response = experian;
  return response.data;
};

export const phpLogIn = async (
  mobile: number,
  otp: number,
  firebaseToken: string,
  android_id: string
) => {
  const data = {
    mobile: mobile.toString(),
    otp,
    firebaseToken,
    android_id,
  };
  let commonHelper = new CommonHelper();
  const apiService = new AxiosService(commonHelper.getBaseUrl());

  let baseUrl = commonHelper.getBaseUrl();
  let login = await axios.post(
    `${baseUrl}/loanapply/ramfincorp_api/otp_verify`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let response = login.data;
  return response;
};
