import config from '@/config/default'
import { CollectedMode } from '@/enums/collection.enum'
import { ProductID } from '@/enums/product.enum'
import { ILead } from '@/interfaces/lead.interface'
import moment from 'moment'
import { WaiverModel } from '../database/mysql/waiver'
import { CollectionStatus } from '../enums/collection.enum'
import { LeadStatus } from '../enums/lead.enum'
import { Products } from '../enums/product.enum'
import { WaiverStatus, WaiverType } from '../enums/waiver.enum'
import { ICollection } from '../interfaces/collection.interface'
import { IWaiverHandle } from '../interfaces/waiver.interface'
import CollectionService from '../services/collection.service'
import { leadService } from '../services/lead.service'
import { logger } from './logger'

export class WaiverUtil {
  private readonly waiverModel = new WaiverModel()
  private readonly commonLeadService = leadService
  private readonly commonCollectionService = new CollectionService()

  async handlePaydayTemporaryWaiver(
    remainingAmount: number,
    leadDetails: ILead,
    payingAmount: number,
  ): Promise<IWaiverHandle> {
    let waivedOffAmount = 0

    logger.info(
      `Request recieved to handle waiver for lead ${JSON.stringify(
        leadDetails,
      )}`,
    )
    const waiverDetails = await this.waiverModel.findOne({
      where: {
        lead_id: leadDetails.leadID,
        customer_id: leadDetails.customerID,
        status: WaiverStatus.APPROVED,
        product: Products.PAYDAY,
        type: WaiverType.TEMPORARY,
      },
    })

    if (!waiverDetails) {
      logger.info(
        `No approved temporary payday waiver found for lead ID ${leadDetails.leadID}`,
      )
    } else {
      const { expiration_time, amount, id: waiverId } = waiverDetails

      const isExpired: boolean = moment().isAfter(moment(expiration_time))
      const isPartialPayment: boolean =
        remainingAmount - (payingAmount + amount) > 0

      if (isExpired) {
        logger.info(`Waiver ID ${waiverId} applicable time has expired.`)
      } else if (isPartialPayment) {
        logger.info(
          `Partial payment case — skipping waiver, Remaining amount: ${remainingAmount}, 
          Waiver amount: ${amount}, Waiver ID: ${waiverId}, value of partial payment: ${isPartialPayment}
          based on result ${remainingAmount - (payingAmount + amount)}`,
        )
      } else {
        waivedOffAmount = remainingAmount - payingAmount
        logger.info(
          `Waiver applied: ${waivedOffAmount} waived off using waiver ID ${waiverId}`,
        )
      }
    }
    logger.info(
      `Request completed and returing waiver amount ${waivedOffAmount}`,
    )
    return { waivedOffAmount, waiverId: waiverDetails.id }
  }

  async checkAndApplyWaiver(
    leadsQuery: ILead,
    remainingAmount: number,
    payingAmount: number,
    waiverReference: string,
  ): Promise<number> {
    logger.info(`Request recieved to check and handle waiver for lead details ${JSON.stringify(
      leadsQuery,
    )} 
    and remaining amount ${remainingAmount}`)
    let waiverAmount = 0
    if (leadsQuery.productID === ProductID.PAYDAY) {
      const waiverResponse = await this.handlePaydayTemporaryWaiver(
        remainingAmount,
        leadsQuery,
        payingAmount,
      )
      waiverAmount = waiverResponse.waivedOffAmount
      if (waiverAmount && waiverAmount > 0) {
        logger.info(
          `Finally applying waiver for amount ${waiverAmount} and inserting in collection table`,
        )
        const details = await this.commonLeadService.addCollectionDetails({
          leadID: leadsQuery.leadID,
          collectedAmount: waiverAmount,
          collectedMode: CollectedMode.WAIVE_OFF,
          collectedDate: moment().format('YYYY-MM-DD'),
          referenceNo: waiverReference,
          // settlemenAmount: waiverAmount, // ! Waiver: discount_waiver_amount me jayega
          status: CollectionStatus.PART_PAYMENT,
          remark: 'waive off done',
          userID: +config.defaultUserId,
          collectionStatus: CollectionStatus.APPROVED,
          // discount_waiver_amount: waiverAmount.toString(),
          discount_waiver: 'waiver',
        })
        let collectionID = (details.data as { collectionID: number })
          .collectionID
        if (!collectionID) {
          const collectionData = await this.commonCollectionService.findOne({
            leadID: leadsQuery.leadID,
            collectedAmount: waiverAmount,
            discount_waiver: 'waiver',
            collectedMode: CollectedMode.WAIVE_OFF,
            customerID: leadsQuery.customerID,
          })
          collectionID = (collectionData as ICollection).collectionID
        }
        // await this.commonCollectionService.collectionManagerAction(
        //   {
        //     collectionID: collectionID,
        //     transactionID: 0,
        //     action: 'Accepted',
        //     type: Products.PAYDAY,
        //   },
        //   +config.defaultUserId,
        // ),

        await Promise.all([
          this.commonLeadService.updateOne(
            {
              leadID: leadsQuery.leadID,
            },
            {
              status: LeadStatus.PART_PAYMENT,
            },
          ),
          this.waiverModel.findOneAndUpdate(
            { id: waiverResponse.waiverId },
            {
              is_paid: true,
              updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
              collection_id: collectionID,
            },
          ),
        ])
      }
    }

    logger.info(
      `Request completed and returing back to consumer for lead id ${leadsQuery.leadID}`,
    )
    return waiverAmount
  }
}
