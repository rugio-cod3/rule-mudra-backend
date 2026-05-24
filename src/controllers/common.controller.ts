import {
  IExperianBureauDetailsPayload,
  IExperianCrmDetailsPayload,
  IExperianUserDetailsPayload,
} from '@/common/common-module/src/interfaces/common.interface'
import { WaiverUtil } from '@/common/common-module/src/utils/waiver.utils'
import CommonHelper from '@/helpers/common'
import {
  ICheckAndApplyTemporaryWaiverPayday,
  ICustomerDetailsPayload,
  IGetBankDetailsPayload,
  IivrMenuOnePayload,
  IivrMenuTwoPayload,
  ILeadStatus,
  ILoanVerification,
} from '@/interfaces/common.interface'
import ApprovalService from '@/services/approval.service'
import CollectionService from '@/services/collection.service'
import { commonservice } from '@/services/common.service'
import CustomerService from '@/services/customer.service'
import CustomerAppService from '@/services/customerApp.service'
import LeadService from '@/services/lead.service'
import LoanService from '@/services/loan.service'
import MailTemplateService from '@/services/mail_template.service'
import NotificationService from '@/services/notification.service'
import RazorpayEMOrderService from '@/services/razorpay_emOrder.service'
import RazorpayMendateService from '@/services/razorpay_mandate.service'
import ResponseService from '@/services/response.service'
import { NewExperianService } from '@/thirdPartyIntegrations'
import { logger } from '@/utils/logger'
import { HttpStatusCode } from 'axios'
import { NextFunction, Request, Response } from 'express'

class CommonController extends ResponseService {
  private customerService = new CustomerService()
  private leadService = new LeadService()
  private customerAppService = new CustomerAppService()
  private mailTemplateService = new MailTemplateService()
  private loanService = new LoanService()
  private notificaationService = new NotificationService()
  private approvalService = new ApprovalService()
  private razorpayEMOrderService = new RazorpayEMOrderService()
  private collectionService = new CollectionService()
  private razorpayMendateService = new RazorpayMendateService()
  private commonHelper = new CommonHelper()
  private readonly commonService = commonservice
  private experianService = new NewExperianService()
  private readonly waiverUtil = new WaiverUtil()

  constructor() {
    super()
  }

  getCityStateOnPincode = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const requestBody = req.query

      const validator = CommonHelper.commonValidations(requestBody, {
        pincode: 'required',
      })
      if (validator && validator.length > 0) {
        const errorStatus = logger.error(validator)
        if (errorStatus) {
          CommonHelper.getSuccessResponse(res, 400, 'Failure', true, {
            errors: validator,
          })
        }
      } else {
        const pincodeParams = {
          pincode: requestBody.pincode,
        }
        const pinData = ''
        res.status(200).json({ data: pinData, message: 'Success' })
      }
    } catch (error) {
      next(error)
    }
  }

  ivrMenuOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile } = req.query

      const payload: IivrMenuOnePayload = {
        mobile: +mobile as unknown as bigint,
      }

      const { data, message, statusCode } = await this.commonService.ivrMenuOne(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  ivrMenuTwo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile, press } = req.body

      const payload: IivrMenuTwoPayload = {
        mobile,
        press,
      }

      const { data, message, statusCode } = await this.commonService.ivrMenuTwo(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  customerDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile } = req.query
      console.log('Query')

      const payload: ICustomerDetailsPayload = {
        mobile: mobile as unknown as bigint,
      }
      const { data, message, statusCode } = await this.commonService.customerDetails(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  getBankDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { ifsc } = req.validatedQuery as IGetBankDetailsPayload

      const payload: IGetBankDetailsPayload = { ifsc }

      const { data, message, statusCode } = await this.commonService.getBankDetails(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  aadharStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data, message, statusCode } = await this.commonService.aadharDown()

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
  disbursalStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile } = req.validatedQuery

      const payload: IivrMenuOnePayload = {
        mobile: +mobile as unknown as bigint,
      }

      const { data, message, statusCode } = await this.commonService.disbursalStatus(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  repaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile } = req.validatedQuery

      const payload: IivrMenuOnePayload = {
        mobile: +mobile as unknown as bigint,
      }

      const { data, message, statusCode } = await this.commonService.repaymentStatus(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  checkNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile } = req.validatedQuery

      const payload: IivrMenuOnePayload = {
        mobile: +mobile as unknown as bigint,
      }

      const { data, message, statusCode } = await this.commonService.checkNumber(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  verifyLoanNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile, loanlastfourdigit } = req.validatedQuery as ILoanVerification

      const payload: ILoanVerification = {
        mobile: mobile as unknown as bigint,
        loanlastfourdigit,
      }

      const { data, message, statusCode } = await this.commonService.verifyLoanNumber(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  newLoanSms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile } = req.validatedQuery

      const payload: IivrMenuOnePayload = {
        mobile: +mobile as unknown as bigint,
      }

      const { data, message, statusCode } = await this.commonService.newLoanSms(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  repaymentLinkSms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile } = req.validatedQuery

      const payload: IivrMenuOnePayload = {
        mobile: +mobile as unknown as bigint,
      }

      const { data, message, statusCode } = await this.commonService.repaymentLinkSms(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  hardPullExperianDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerID, leadID } = req.body as IExperianUserDetailsPayload
      const loggedInUserId = req.user?.userID

      const { data, message, statusCode } =
        await this.experianService.hardPullExperianCustomerDetails(
          customerID,
          leadID,
          loggedInUserId,
        )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  hardPullExperianCrmDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { leadID } = req.body as IExperianCrmDetailsPayload
      const loggedInUserId = req.user?.userID

      const { data, message, statusCode } =
        await this.experianService.getHardPullExperianCrmDetails(leadID, loggedInUserId)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  hardPullExperianBureauDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, loan_id } = req.body as IExperianBureauDetailsPayload
      const loggedInUserId = req.user?.userID

      const { data, message, statusCode } =
        await this.experianService.getHardPullExperianBureauDetails(
          user_id,
          loan_id,
          loggedInUserId
        )

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  leadStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { mobile } = req.validatedQuery

      const payload: ILeadStatus = {
        mobile: +mobile as unknown as bigint,
      }

      const { data, message, statusCode } = await this.commonService.leadStatus(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }

  checkAndApplyTemporaryWaiver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lead, payingAmount, remainingAmount, waiverReference } =
        req.body as ICheckAndApplyTemporaryWaiverPayday

      const waivedOffAmount = await this.waiverUtil.checkAndApplyWaiver(
        lead,
        remainingAmount,
        payingAmount,
        waiverReference,
      )

      this.sendResponse(res, HttpStatusCode.Ok, { waivedOffAmount }, 'Waiver processed')
    } catch (error) {
      next(error)
    }
  }
}

export default CommonController
