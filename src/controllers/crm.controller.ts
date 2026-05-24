import { NotFoundError } from '@/errors'
import {
  IApplyPenaltyPayload,
  ICreditDetailsPayload,
  IEmiCalculatorPayload,
  IFileUploadPayload,
  IFileUrlPayload,
  IGenerateEmiPayload,
  IGetAmountToBeDisbursedPayload,
  IGetDocsRequirementsPayload,
  IGetEmiLoanDetailsPayload,
  IGetEmisPayload,
  ILeadUpdatePayload,
  IMandatePayload,
  IPauPaymentVerification,
  IpaydayToEmiConversionPayload,
  IPaymentVerification,
  IUpdatePaymentPayload,
} from '@/interfaces/crm.interface'
import { ICustomer } from '@/interfaces/customer.interface'
import { crmService } from '@/services/crm.service'
import ResponseService from '@/services/response.service'
import { NextFunction, Request, Response } from 'express'

export interface IAuthenticatedRequest extends Request {
  customer: ICustomer
}

class CRMController extends ResponseService {
  private readonly crmService = crmService

  constructor() {
    super()
  }

  leadUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { leadID } = req.body as ILeadUpdatePayload

      const payload: ILeadUpdatePayload = { leadID }

      const { data, message, statusCode } = await this.crmService.leadUpdate(
        payload,
      )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
  emiCalculator = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { loanAmount, roi, tenure, firstRepayDate } =
        req.validatedQuery as unknown as IEmiCalculatorPayload

      const payload: IEmiCalculatorPayload = {
        loanAmount,
        roi,
        tenure,
        firstRepayDate,
      }

      const { data, message, statusCode } = await this.crmService.emiCalculator(
        payload,
      )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  creditDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        adminFee,
        aqb,
        branch,
        customer_id,
        firstDueDate,
        foir,
        lead_id,
        loanAmtApproved,
        roi,
        tenure,
        gst,
      } = req.body as ICreditDetailsPayload

      const payload: ICreditDetailsPayload = {
        adminFee,
        aqb,
        branch,
        customer_id,
        firstDueDate,
        foir,
        lead_id,
        loanAmtApproved,
        roi,
        tenure,
        gst,
      }

      const { data, message, statusCode } = await this.crmService.creditDetails(
        payload,
      )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  getAmountToDisbursed = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { creditID } =
        req.validatedQuery as unknown as IGetAmountToBeDisbursedPayload

      const payload: IGetAmountToBeDisbursedPayload = {
        creditID,
      }

      const { data, message, statusCode } =
        await this.crmService.getAmountToDisbursed(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  genrateEMI = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        creditID,
        createdBy,
        updatedBy,
        gateway,
        loanNo,
        mode,
        order_id,
        referanceId,
      } = req.body as IGenerateEmiPayload

      const payload: IGenerateEmiPayload = {
        creditID,
        createdBy,
        updatedBy,
        gateway,
        loanNo,
        mode,
        order_id,
        referanceId,
      }

      const { data, message, statusCode } = await this.crmService.generateEMI(
        payload,
      )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  updatePayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { creditID, amount, gateway, method } =
        req.body as IUpdatePaymentPayload

      const payload: IUpdatePaymentPayload = {
        creditID,
        amount,
        gateway,
        method,
      }

      const { data, message, statusCode } = await this.crmService.updatePayment(
        payload,
      )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  applyPanelty = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let { emiID, amount } = req.body as IApplyPenaltyPayload

      const payload: IApplyPenaltyPayload = {
        emiID,
        amount,
      }

      const { data, message, statusCode } = await this.crmService.applyPanelty(
        payload,
      )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  getEmis = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let customerID = req.customer.customerID

      const payload: IGetEmisPayload = {
        customerID,
      }

      const { data, message, statusCode } = await this.crmService.getEmis(
        payload,
      )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  getEmiLoanDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { leadID, customerID } =
        req.validatedQuery as unknown as IGetEmiLoanDetailsPayload

      const payload: IGetEmiLoanDetailsPayload = {
        leadID,
        customerID,
      }

      const { data, message, statusCode } =
        await this.crmService.getEmiLoanDetails(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  getDocsRequirements = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let { loanAmount, roi, tenure, creditId } =
        req.validatedQuery as IGetDocsRequirementsPayload

      const payload: IGetDocsRequirementsPayload = {
        loanAmount,
        roi,
        tenure,
        creditId,
      }

      const { data, message, statusCode } =
        await this.crmService.getDocsRequirements(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
  paydayToEmiConversion = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let {
        productId,
        customer_id,
        lead_id,
        loanAmtApproved,
        roi,
        tenure,
        firstDueDate,
        userID,
      } = req.validatedBody as IpaydayToEmiConversionPayload

      const payload: IpaydayToEmiConversionPayload = {
        productId,
        customer_id,
        lead_id,
        loanAmtApproved,
        roi,
        tenure,
        firstDueDate,
        userID,
      }

      const { data, message, statusCode } =
        await this.crmService.paydayToEmiConversion(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
  uploadBulkMandateFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let image = req.file
      const userId = req.user.userID
      const name = req.user.name
      if (!image) {
        throw new NotFoundError('please upload file')
      }
      const payload: IFileUploadPayload = {
        image,
        userId,
        name,
      }

      const { data, message, statusCode } =
        await this.crmService.uploadBulkMandateFile(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
  getBulkMandateData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let { page, limit } = req.validatedQuery as IMandatePayload
      const payload: IMandatePayload = {
        page,
        limit,
      }

      const { data, message, statusCode } =
        await this.crmService.getBulkMandateData(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  getUrlforBulkMandateFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let { fileName } = req.validatedQuery as IFileUrlPayload
      const payload: IFileUrlPayload = {
        fileName,
      }

      const { data, message, statusCode } =
        await this.crmService.getUrlforBulkMandateFile(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  paydayToEmiConversionTest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let {
        productId,
        customer_id,
        lead_id,
        loanAmtApproved,
        roi,
        tenure,
        firstDueDate,
      } = req.validatedBody as IpaydayToEmiConversionPayload

      const payload: IpaydayToEmiConversionPayload = {
        productId,
        customer_id,
        lead_id,
        loanAmtApproved,
        roi,
        tenure,
        firstDueDate,
      }

      const { data, message, statusCode } =
        await this.crmService.paydayToEmiConversionTest(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
  razorpayPaymentVerification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let { from, to } = req.validatedQuery as IPaymentVerification

      const { data, message, statusCode } =
        await this.crmService.razorpayPaymentVerification(from, to)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
  payUPaymentVerification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let { from, to } = req.validatedQuery as IPauPaymentVerification

      const { data, message, statusCode } =
        await this.crmService.payUPaymentVerification(from, to)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  payUPaymentVerificationPending = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.crmService.payUPaymentVerificationPending()
      let statusCode = 200
      let data = {}
      let message = "success"

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
}

export default CRMController
