import { IRazorpayWebhook } from '@/interfaces/collection.interface'
import { IRazorPayEmandateWebhookPayload } from '@/interfaces/onboarding.interface'
import ResponseService from '@/services/response.service'
import { webhookService } from '@/services/webhook.service'
import { razorPayPayments } from '@/utils/razorpayClient.utils'
import { NextFunction, Request, Response } from 'express'

export class WebhookController extends ResponseService {
  private readonly razorPayPayments = razorPayPayments
  private readonly webhookService = webhookService
  emandateAuthLinkWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.razorPayPayments.emandateAuthLinkWebhook(
        req.body as IRazorPayEmandateWebhookPayload,
      )

      this.sendResponse(res, 200, {}, 'Webhook success')
    } catch (error) {
      next(error)
    }
  }

  digitapEsignWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.webhookService.digitapEsignWebhook(req.body)
      this.sendResponse(res, 200, {}, 'Digitap E-sign webhook processed successfully')
    } catch (error) {
      next(error)
    }
  }

  repaymentWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.webhookService.repaymentWebhook(req.body as IRazorpayWebhook)
      this.sendResponse(res, 200, {}, 'Webhook success')
    } catch (error) {
      next(error)
    }
  }
  repaymentWebhookKamakshi = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.webhookService.repaymentWebhookKamakshi(req.body as IRazorpayWebhook)
      this.sendResponse(res, 200, {}, 'Webhook success')
    } catch (error) {
      next(error)
    }
  }
  savePaymentLog = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      //await this.webhookService.repaymentWebhookKamakshi(req.body as IRazorpayWebhook)
      await this.webhookService.savePaymentLog(req.body as IRazorpayWebhook)
      this.sendResponse(res, 200, {}, 'Webhook success')
    } catch (error) {
      next(error)
    }
  }
}

export const webhookController = new WebhookController()
