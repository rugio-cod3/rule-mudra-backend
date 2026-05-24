import CreditModel from '@/database/mysql/credit'
import LoanModel from '@/database/mysql/loan'
import { PreconditionError } from '@/errors'
import { IAddCollectionCrmPayload, IAllCollectionPayload } from '@/interfaces/collectionCrm.interface'
import EmiCollectionService from '@/services/emiCollection.service'
import { CollectionCrmService } from '@/services/collectionCrm.service'
import ResponseService from '@/services/response.service'
import { NextFunction, Request, Response } from 'express'

class CollectionCrmController extends ResponseService {
  private emiCollectionService = new EmiCollectionService()
  private collectionCrmService = new CollectionCrmService()
  private creditModel = new CreditModel()
  private loanModel = new LoanModel()


  addCollectionCrm = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerID, leadID, userID, status, method, orderId, amount, gateway, transactionDate, remarks, waiver, discount_type, payment_transaction_status } = req.body as unknown as IAddCollectionCrmPayload
      
      let paymentDetails = {
        status: status,
        method: method,
        order_id: orderId,
        amount: amount,
        userID: userID,
        transactionDate: transactionDate,
        remarks: remarks,
        waiver: waiver,
        discount_type: discount_type,
        payment_transaction_status: payment_transaction_status
      }      
      const creditData = await this.creditModel.findOneCredit({ customerID: customerID, leadID: leadID }, ['*']);
      const loanData = await this.loanModel.findOneLoan({ leadID: leadID, customerID: customerID }, ['*']);
      
      if (!creditData || !loanData) {
        throw new PreconditionError('Precondition Failed')
      }
      await this.emiCollectionService.handleTransaction(paymentDetails, creditData, loanData, gateway )

      this.sendResponse(res, 200, {}, 'Collection data inserted successfully.');     
    } catch (error) {
      next(error)
    }
  }

   getTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerID, leadID } = req.query as unknown as IAllCollectionPayload
      const payload = { customerID, leadID ,'type':'collection'}
      const { data, message, statusCode } = await this.collectionCrmService.getTransactions(payload)

      this.sendResponse(res, statusCode, data, message)
    } catch (error) {
      next(error)
    }
  }
}

export default CollectionCrmController
