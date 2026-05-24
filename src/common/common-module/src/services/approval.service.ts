import { logger } from '@/utils/logger'
import moment from 'moment'
import { approvalModel } from '../database/mysql/approval'
import { callHistorymodel } from '../database/mysql/callHistory'
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs'
import { collectionModel } from '../database/mysql/collection'
import { customerModel } from '../database/mysql/customer'
import { leadModel } from '../database/mysql/leads'
import { leadsApiLogModel } from '../database/mysql/leadsApiLog'
import { leadsAutoStatusmodel } from '../database/mysql/leadsAutoStatus'
import { loanModel } from '../database/mysql/loan'
import { repayDateHolidaymodel } from '../database/mysql/repayDateHoliday'
import { ApprovalStatus } from '../enums/approvalStatus.enum'
import { CollectionStatus } from '../enums/collectionStatus.enum'
import {
  adminFeeInPercentage,
  BranchName,
  CallType,
} from '../enums/common.enum'
import { LeadStatus } from '../enums/leadStatus.enum'
import { IApproval } from '../interfaces/approval.interface'
import { ICallHistoryModel } from '../interfaces/callHistory.interface'
import { ICallHistoryLog } from '../interfaces/callHistoryLogs.interface'
import { ILeadsAutoStatusModel } from '../interfaces/leadStatus.interface'
import { loanService } from '../services/loan.service'
import { finboxService } from '../services/thirdParty/finbox.service'
import { InsertData } from '../types/model.types'
import { leadService } from './lead.service'
class ApprovalService {
  private readonly callHistoryLogsModel = callHistoryLogsModel
  private readonly callHistorymodel = callHistorymodel
  private readonly leadModel = leadModel
  private readonly loanModel = loanModel
  private readonly collectionModel = collectionModel
  private readonly customerModel = customerModel
  private readonly finboxService = finboxService
  private readonly approvalModel = approvalModel
  private readonly repayDateHolidaymodel = repayDateHolidaymodel
  private readonly loanService = loanService
  private readonly leadApiLogModel = leadsApiLogModel
  private readonly leadAutoStatusModel = leadsAutoStatusmodel

  async autoApproveRepeatCustomer(
    leadID: number,
    customerID: number,
    checkOfferAmount = 0,
    newOfferAmount = 0,
  ) {
    let offerAmount = 0

    if (leadID && customerID) {
      let days = 7
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 30)

      const leadIds: any[] = []

      let leadCount: number
      if (checkOfferAmount === 0) {
        leadCount = await this.leadModel.countLeads(
          { customerID, status: LeadStatus.CLOSED },
          { leadID },
        )
      } else {
        leadCount = await this.leadModel.countLeads({
          customerID,
          status: LeadStatus.CLOSED,
        })
      }
      let loanCount = await this.loanModel.count(
        { customerID, status: LeadStatus.DISBURSED },
        { disbursalRefrenceNo: '' },
      )

      if (leadCount === loanCount) {
        const collection = await this.collectionModel.findOneCollection(
          {
            customerID,
            collectionStatus: LeadStatus.APPROVED,
            status: CollectionStatus.CLOSED,
          },
          ['*'],
          [{ column: 'leadID', order: 'desc' }],
        )

        if (collection) {
          const getLastLeadId = collection.leadID
          const getLoanLeadDetail = await this.loanService.getLoanLeadDetail(
            getLastLeadId,
          )
          const approval = getLoanLeadDetail?.creda

          if (approval) {
            const cloaCheck = await this.collectionModel.findOneCollection(
              {
                customerID,
                leadID: getLastLeadId,
                collectionStatus: LeadStatus.APPROVED,
                status: CollectionStatus.CLOSED,
              },
              ['*'],
              [{ column: 'leadID', order: 'desc' }],
            )

            const crp = new Date(approval.repayDate)
            crp.setDate(crp.getDate() + days)
            // Start from here
            if (cloaCheck && crp >= new Date(cloaCheck.collectedDate)) {
              offerAmount = approval.loanAmtApproved
              const repayDateDay = new Date(
                getLoanLeadDetail.creda.repayDate,
              ).getDate()
              const customerData = await this.customerModel.findOneCustomer({
                customerID,
              })
              let salaryDate = repayDateDay

              if (customerData && customerData.salary_date) {
                salaryDate = Number(customerData.salary_date)
              }

              const repayDateFind = await this.finboxService.repayDateFind(
                String(salaryDate),
              )
              const repayDate = repayDateFind?.formattedDate
                ? repayDateFind?.formattedDate
                : endDate.toISOString().split('T')[0]

              const diff = new Date(repayDate).getTime() - new Date().getTime()
              const tenureDays = Math.abs(
                Math.round(diff / (1000 * 60 * 60 * 24)),
              )

              delete approval.createdDate
              delete approval.approvalID

              if (approval.adminFee === 0) {
                approval.adminFee = Math.round(approval.loanAmtApproved * 0.1)
              }

              approval.GstOfAdminFee = Math.round(approval.adminFee * 0.18)
              const lastLoanRepayDate = getLoanLeadDetail.creda.repayDate
              const lastLoanClosed = cloaCheck.collectedDate
              const lastLoanDisbursed = getLoanLeadDetail.disba.disbursalDate

              const collectedTimestamp = new Date(lastLoanClosed).getTime()
              const disbursalTimestamp = new Date(lastLoanDisbursed).getTime()
              const checkDifference = collectedTimestamp - disbursalTimestamp
              const daysDifference = Math.floor(
                checkDifference / (1000 * 60 * 60 * 24),
              )
              const repayTimestamp = new Date(lastLoanRepayDate).getTime()
              const dpd =
                (collectedTimestamp - repayTimestamp) / (1000 * 60 * 60 * 24)

              if (
                collectedTimestamp > disbursalTimestamp &&
                daysDifference >= 15 &&
                dpd <= 0 &&
                loanCount + 1 >= 4 &&
                (loanCount + 1) % 4 === 0
              ) {
                let currentLoanAmount = approval.loanAmtApproved

                if (currentLoanAmount < 7000) {
                  const increase = 500
                  const newLoanAmount = currentLoanAmount + increase
                  const newLoanAmountRounded = newLoanAmount
                  offerAmount = newLoanAmountRounded
                } else {
                  const increase = currentLoanAmount * 0.08
                  const newLoanAmount = currentLoanAmount + increase
                  const newLoanAmountRounded =
                    Math.round(newLoanAmount / 1000) * 1000
                  offerAmount = newLoanAmountRounded
                }

                approval.loanAmtApproved = offerAmount
                const currentPFRatio = approval.adminFee / currentLoanAmount
                const newProcessingFee = Math.round(
                  offerAmount * currentPFRatio,
                )
                approval.adminFee = newProcessingFee
                approval.GstOfAdminFee = this.loanService.calculateGst(
                  approval.adminFee,
                )
              }

              if (newOfferAmount > 999) {
                const currentLoanAmount = approval.loanAmtApproved
                approval.loanAmtApproved = newOfferAmount
                const currentPFRatio = approval.adminFee / currentLoanAmount
                const newProcessingFee = Math.round(
                  newOfferAmount * currentPFRatio,
                )
                approval.adminFee = newProcessingFee
                approval.GstOfAdminFee = this.loanService.calculateGst(
                  approval.adminFee,
                )
              }

              if (checkOfferAmount === 0) {
                approval.leadID = leadID
                approval.tenure = tenureDays
                approval.repayDate = moment(repayDate).toDate()
                approval.status = ApprovalStatus.ApprovedProcess
                approval.remark = ApprovalStatus.ApprovedProcess
                approval.creditedBy = 221
                approval.sanctionalloUID = '221'

                const approvalId = await this.approvalModel.insert(approval)
                leadIds.push(leadID)
                leadIds.push(approval)

                if (approvalId) {
                  await this.leadModel.findOneAndUpdate(
                    { leadID },
                    { status: LeadStatus.APPROVED_PROCESS },
                  )

                  // save to callHistory and logs

                  const callHistoryData: InsertData<ICallHistoryModel> = {
                    customerID,
                    leadID,
                    callType: CallType.IVR,
                    status: LeadStatus.APPROVED_PROCESS,
                    remark: LeadStatus.APPROVED_PROCESS,
                    noteli: 'App Auto Approved',
                    callbackTime: new Date(),
                    calledBy: 221,
                  }

                  const callHistoryLogData: InsertData<ICallHistoryLog> = {
                    customerID,
                    leadID,
                    callType: CallType.IVR,
                    status: LeadStatus.APPROVED_PROCESS,
                    remark: LeadStatus.APPROVED_PROCESS,
                    noteli: 'App Auto Approved',
                    callbackTime: new Date(),
                    appAmount: approval?.loanAmtApproved
                      ? String(approval?.loanAmtApproved)
                      : '0',
                    calledBy: 221,
                  }

                  await Promise.all([
                    this.callHistorymodel.insert(callHistoryData),
                    this.callHistoryLogsModel.insert(callHistoryLogData),
                  ])
                }
              }
            }
          }
        }
      }
      if (checkOfferAmount === 0) {
        if (leadIds.length > 0) {
          const data: ILeadsAutoStatusModel = {
            type: 1,
            agent_id: 221,
            lead_ids: JSON.stringify(leadIds),
          }
          await this.leadAutoStatusModel.insert(data)
          return 1
        }
      } else {
        return offerAmount
      }
    }
  }

  async create(data: InsertData<IApproval>): Promise<number[]> {
    return await this.approvalModel.insert(data)
  }

  async rejectProcessCustomer(leadID: number, remark: string) {
    try {
      const lead = await leadService.findOne({ leadID })

      if (!lead) return false

      const customer = await this.customerModel.findOneCustomer({
        customerID: lead.customerID,
      })

      if (!customer) return false

      const amount = 0
      const repayDate = new Date()
      const alternateMobile = customer.mobile
      const officialEmail = customer.email
      const status = ApprovalStatus.RejectedProcess
      const approvedBy = 221 // default user id

      const adminFee = (amount * adminFeeInPercentage) / 100
      const GstOfAdminFee = adminFee * 0.18

      const approvalData: InsertData<IApproval> = {
        leadID,
        customerID: lead.customerID,
        branch: BranchName.DELHI,
        loanAmtApproved: amount,
        tenure: 0,
        roi: 1,
        repayDate,
        adminFee,
        GstOfAdminFee,
        alternateMobile: String(alternateMobile),
        officialEmail,
        cibil: 0,
        activeLoans: 0,
        status,
        remark,
        employmentType: customer.employeeType,
        creditedBy: approvedBy,
        createdDate: new Date(),
      }

      await this.create(approvalData)

      await leadService.updateOne(
        {
          customerID: customer.customerID,
          leadID,
        },
        { status: LeadStatus.REJECTED_PROCESS },
      )

      await this.callHistoryLogsModel.insert({
        customerID: lead.customerID,
        leadID,
        callType: 'IVR',
        status,
        appAmount: String(amount),
        noteli: status,
        remark,
        callbackTime: new Date(),
        calledBy: approvedBy,
      })

      return true
    } catch (error) {
      logger.error('Error in rejectProcessCustomer:', error)
      return false
    }
  }
}
export const approvalService = new ApprovalService()
