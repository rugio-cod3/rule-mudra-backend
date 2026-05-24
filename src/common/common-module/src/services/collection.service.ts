import config from '@/config/default'
import CallhistorylogsModel from '../database/mysql/callhistorylogs'
import CollectionModel from '../database/mysql/collection'
import CustomerModel from '../database/mysql/customer'
import LeadModel from '../database/mysql/leads'
import LoanModel from '../database/mysql/loan'
import UserModel from '../database/mysql/users'

import ApprovalModel from '../database/mysql/approval'

import { CollectedMode } from '../enums/collection.enum'

import { onlinePaymentModel } from '../database/mysql/onlinepayment'
import { transactionModel } from '../database/mysql/transactions'
import { CollectionStatus, CollectionType } from '../enums/collection.enum'

import { LeadStatus } from '../enums/lead.enum'

import { BadRequestError, NotFoundError } from '../errors'
import { commonHelper } from '../helpers/common'
import { checkRepaymentAmountV2 } from '../helpers/repaymentCalculator'
import { IApproval } from '../interfaces/approval.interface'
import {
  IChangePaymentMode,
  ICollection,
  ICollectionManagerActionPayload,
  ICollectionManagerActionPayloadForMultiple,
  ICollectionManagerPayload,
  IEmiCollectionDetails,
  IEmiCollectionDetailsCsv,
  IGetCollectionReport,
  IPaydayCollectionDetails,
  IPaydayCollectionDetailsCsv,
  IPendingCollection,
  TSelectCollection,
} from '../interfaces/collection.interface'
import { IPagination } from '../interfaces/common.interface'
import { ICustomer } from '../interfaces/customer.interface'
import { ILead } from '../interfaces/lead.interface'
import { ILoan } from '../interfaces/loan.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import { IServiceResponse } from '../interfaces/service.interface'

import { HttpStatusCode } from 'axios'
import { default as moment, default as momentTz } from 'moment-timezone'
import { WaiverModel } from '../database/mysql/waiver'
import { Products } from '../enums/product.enum'
import { WaiverStatus, WaiverType } from '../enums/waiver.enum'
import { IWaiver } from '../interfaces/waiver.interface'
import { excelDownloadService } from '../services/excelDownload.service'
import { leadService } from '../services/lead.service'
import { InsertData } from '../types/model.types'
import {
  calculatePaydayAmountIPC,
  calculateTotalRepayPaydayAmountNonIPC,
} from '../utils/ipcCalculation'
import { logger } from '../utils/logger'
import { getKnexInstance } from '../utils/mysql'
import { calculateTotalPages, generateWaiverId } from '../utils/util'
import AxiosService from './api.service'
import { loanService } from './loan.service'
import ResponseService from './response.service'

class CollectionService extends ResponseService {
  private readonly loanService = loanService
  private readonly transactionModel = transactionModel
  private readonly onlinePaymentModel = onlinePaymentModel
  private readonly commonHelper = commonHelper
  private collectionModel = new CollectionModel()
  private customerModel = new CustomerModel()
  private leadModel = new LeadModel()
  private loanModel = new LoanModel()
  private userModel = new UserModel()
  private approvalModel = new ApprovalModel()
  private callhistorylogsModel = new CallhistorylogsModel()
  private readonly excelDownloadService = excelDownloadService
  private leadService = leadService
  private waiverModel = new WaiverModel()
  public async findOne(
    where: Partial<ICollection>,
    select: TSelectCollection[] | ['*'] = ['*'],
  ): Promise<ICollection | ICustomResponse> {
    return await this.collectionModel.findOneCollection(where, select)
  }

  public async findPayDayPendingCollection(
    payload: IPendingCollection,
    page?: number,
    perPage?: number,
    isExcelDownload?: boolean,
  ): Promise<IServiceResponse> {
    const { search_by, customer_search, start_date, end_date, dpd } = payload

    const db = getKnexInstance()
    if (!db) {
      console.error('Failed to initialize the Knex instance.')
      return this.serviceResponse(500, null, 'Internal Server Error')
    }

    const today = moment().format('YYYY-MM-DD')
    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )
    let query = db('customer')
      .select([
        'leads.leadID',
        db.raw('ANY_VALUE(loan.loanNo) AS loanNo'),
        db.raw('ANY_VALUE(leads.purpose) AS purpose'),
        db.raw('ANY_VALUE(leads.state) AS state'),
        db.raw('ANY_VALUE(leads.city) AS city'),
        db.raw('ANY_VALUE(customer.name) AS customerName'),
        db.raw('ANY_VALUE(customer.gender) AS gender'),
        db.raw('ANY_VALUE(customer.email) AS email'),
        db.raw('ANY_VALUE(customer.mobile) AS mobile'),
        db.raw('ANY_VALUE(customer.dob) AS dob'),
        db.raw('ANY_VALUE(TIMESTAMPDIFF(YEAR, customer.dob, CURDATE()) + 1) AS age'),
        db.raw('ANY_VALUE(customer.pancard) AS pancard'),
        db.raw('ANY_VALUE(loan.disbursalAmount) AS disbursalAmount'),
        db.raw(`
      (ANY_VALUE(loan.disbursalAmount) + ((ANY_VALUE(loan.disbursalAmount) * (ANY_VALUE(approval.roi) / 100)) *
      DATEDIFF(ANY_VALUE(approval.repayDate), ANY_VALUE(loan.disbursalDate)))) AS duePayment
    `),
        db.raw(`
      CASE
        WHEN ANY_VALUE(leads.ipc) = 1 THEN (
          SELECT
            loan.disbursalAmount +
            (loan.disbursalAmount * (DATEDIFF(CURDATE(), approval.repayDate) + DATEDIFF(approval.repayDate, loan.disbursalDate)) * approval.roi / 100) +
            ((DATEDIFF(CURDATE(), approval.repayDate) * ${config.ipcDpdInterest} / 100) * loan.disbursalAmount) +
            (${config.dpdPenalty} * (1 + ${config.dpdPenaltyGstPercentage} / 100))
          FROM loan
          JOIN approval ON loan.leadID = approval.leadID
          WHERE loan.leadID = leads.leadID
          LIMIT 1
        )
        ELSE (
          ANY_VALUE(loan.disbursalAmount) + ((ANY_VALUE(loan.disbursalAmount) * (ANY_VALUE(approval.roi) / 100)) * DATEDIFF(CURDATE(), ANY_VALUE(loan.disbursalDate)))
        )
      END AS repayAmount
    `),
        db.raw('DATEDIFF(CURDATE(), ANY_VALUE(approval.repayDate)) AS dayPassDue'),
        db.raw('ANY_VALUE(customer.employeeType) AS employmentType'),
        db.raw('ANY_VALUE(leads.fbLeads) AS loanType'),
        db.raw(
          `
      (SELECT COUNT(*)
         FROM leads l2
         WHERE l2.customerID = customer.customerID
           AND l2.status IN (?, ?, ?)
      ) AS loanFrequency
      `,
          [CollectionStatus.CLOSED, CollectionStatus.SETTLEMENT, CollectionStatus.DISBURSED],
        ),
        db.raw("DATE_FORMAT(ANY_VALUE(loan.disbursalDate), '%d %M %Y') AS disbursedDate"),
        db.raw("DATE_FORMAT(ANY_VALUE(loan.disbursalDate), '%M %Y') AS disbursedMonth"),
        db.raw("DATE_FORMAT(ANY_VALUE(approval.repayDate), '%d %M %Y') AS repayDate"),
        db.raw("DATE_FORMAT(ANY_VALUE(approval.repayDate), '%M %Y') AS repayMonth"),
        db.raw(`
      ((ANY_VALUE(loan.disbursalAmount) + ((ANY_VALUE(loan.disbursalAmount) * (ANY_VALUE(approval.roi) / 100)) *
      (UNIX_TIMESTAMP(CURDATE()) - UNIX_TIMESTAMP(ANY_VALUE(loan.disbursalDate))) / (60 * 60 * 24))) -
      COALESCE(SUM(collection.collectedAmount), 0)
      ) AS remainingCollection
    `),
        db.raw('COALESCE(SUM(collection.collectedAmount), 0) AS totalCollection'),
        db.raw('DATEDIFF(CURDATE(), ANY_VALUE(loan.disbursalDate)) AS tenure'),
        db.raw(
          'DATEDIFF(ANY_VALUE(approval.repayDate), ANY_VALUE(loan.disbursalDate)) AS loanTenure',
        ),
        db.raw('ANY_VALUE(approval.roi) AS roi'),
        db.raw('ANY_VALUE(users.name) AS creditedBy'),
        db.raw(`
      (SELECT name FROM users WHERE userID = leads.alloUID LIMIT 1) AS userName
    `),
        db.raw('ANY_VALUE(leads.createdDate) AS createdDate'),
        db.raw(`
      (SELECT JSON_OBJECT('address', a.address)
       FROM address a
       WHERE a.customerID = customer.customerID
         AND a.type NOT IN ('Current Address', 'Rent')
       LIMIT 1
      ) AS address
    `),
        db.raw(`
      (SELECT JSON_OBJECT('address', a.address)
       FROM address a
       WHERE a.customerID = customer.customerID
         AND a.type = 'Current Address'
       LIMIT 1
      ) AS currentAddress
    `),
        db.raw(`
      (SELECT JSON_OBJECT('address', a.address)
       FROM address a
       WHERE a.customerID = customer.customerID
         AND a.type = 'Rent'
       LIMIT 1
      ) AS rentAddress
    `),
        db.raw(`
      (SELECT JSON_OBJECT(
         'employerName', e.employerName,
         'address', e.address,
         'city', e.city,
         'state', e.state,
         'pincode', e.pincode
      ) FROM employer e WHERE e.customerID = customer.customerID
       LIMIT 1
      ) AS employer
    `),
        db.raw(`
      (SELECT JSON_OBJECT(
         'relation', r.relation,
         'name', r.name,
         'contactNo', r.contactNo,
         'address', r.address,
         'city', r.city,
         'state', r.state,
         'pincode', r.pincode
      ) FROM reference r
      WHERE r.customerID = customer.customerID
        AND r.reference_verify = '0'
      LIMIT 1
      ) AS reference1
    `),
        db.raw(`
      (SELECT JSON_OBJECT(
         'relation', r2.relation,
         'name', r2.name,
         'contactNo', r2.contactNo,
         'address', r2.address,
         'city', r2.city,
         'state', r2.state,
         'pincode', r2.pincode
      ) FROM reference r2
      WHERE r2.customerID = customer.customerID
        AND r2.reference_verify = '0'
      LIMIT 1, 1
      ) AS reference2
    `),
      ])
      .join('leads', 'customer.customerID', 'leads.customerID')
      .join('approval', 'leads.leadID', 'approval.leadID')
      .join('loan', 'leads.leadID', 'loan.leadID')
      .leftJoin('collection', function () {
        this.on('loan.leadID', '=', 'collection.leadID').andOn(
          'collection.collectionStatus',
          '=',
          db.raw('?', CollectionStatus.APPROVED),
        )
      })
      .leftJoin('users', 'approval.creditedBy', 'users.userID')
      .whereIn('leads.status', [CollectionStatus.DISBURSED, CollectionStatus.PART_PAYMENT])
      .where('leads.productID', '!=', 1)
      .where('approval.loanType', '=', 0)
      .whereNotIn('customer.customerID', function () {
        this.select('customerID')
          .from('customer_dnd')
          .where('expiry_date', '>=', db.fn.now())
          .andWhere('is_deleted', '=', 0)
          .andWhere('id', '=', function () {
            this.select(db.raw('MAX(cd.id)'))
              .from('customer_dnd as cd')
              .whereRaw('cd.customerID = customer_dnd.customerID')
          })
      })
      .groupBy('leads.leadID')
      .orderBy('leads.leadID', 'desc')

    await this.checkFilterForPendingCollection(
      search_by,
      customer_search,
      start_date,
      end_date,
      query,
      dpd,
      today,
      'payday',
    )

    // for excel download
    if (isExcelDownload) {
      let data = await query
      if (data.length == 0) {
        data = [
          {
            leadID: '-',
            loanNo: '-',
            purpose: '-',
            state: '-',
            city: '-',
            customerName: '-',
            gender: '-',
            email: '-',
            mobile: '-',
            dob: '-',
            age: '-',
            pancard: '-',
            disbursalAmount: '-',
            duePayment: '-',
            repayAmount: '-',
            dayPassDue: '-',
            employmentType: '-',
            loanType: '-',
            loanFrequency: '-',
            disbursedDate: '-',
            disbursedMonth: '-',
            repayDate: '-',
            repayMonth: '-',
            remainingCollection: '-',
            totalCollection: '-',
            tenure: '-',
            loanTenure: '-',
            roi: '-',
            creditedBy: '-',
            userName: '-',
            createdDate: '-',
            address: '-',
            currentAddress: '-',
            rentAddress: '-',
            employer: '-',
            reference1: '-',
            reference2: '-',
          } as any,
        ]
      }
      const excelBuffer = await this.excelDownloadService.exportDataToExcelBuffer(data)
      return this.serviceResponse(
        200,
        { workbook: excelBuffer },
        'Excel file generated successfully',
      )
    }

    const totalCountQuery = query
      .clone()
      .clearSelect()
      .clearGroup()
      .clearOrder()
      .countDistinct('leads.leadID as totalCount')
      .first()

    const paginatedQuery = query.clone().limit(perPage).offset(page)

    const [totalCountResult, paginatedData] = await Promise.all([totalCountQuery, paginatedQuery])

    const CollectionPendingData = {
      pendingCollection: paginatedData,
      totalCount: Number(totalCountResult?.totalCount || 0),
      totalPages: calculateTotalPages(Number(totalCountResult?.totalCount || 0), perPage),
    }

    return this.serviceResponse(200, CollectionPendingData, 'Pending Collection List')
  }

  public async findEmiPendingCollection(
    payload: IPendingCollection,
    page?: number,
    perPage?: number,
    isExcelDownload?: boolean,
  ): Promise<IServiceResponse> {
    const { search_by, customer_search, start_date, end_date, dpd } = payload

    const db = getKnexInstance()
    if (!db) {
      console.error('Failed to initialize the Knex instance.')
      return this.serviceResponse(500, null, 'Internal Server Error')
    }

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    const today = momentTz().format('YYYY-MM-DD')

    let startDate = start_date
      ? momentTz(start_date).format('YYYY-MM-DD')
      : momentTz().format('YYYY-MM-DD')
    let endDate = end_date
      ? momentTz(end_date).format('YYYY-MM-DD')
      : momentTz().format('YYYY-MM-DD')

    const query = db('customer')
      .join('leads', 'customer.customerID', 'leads.customerID')
      .join('loan', 'leads.leadID', 'loan.leadID')
      .join('credits', 'credits.leadID', 'leads.leadID')
      .join('approval', function () {
        this.on('leads.leadID', 'approval.leadID').andOn(
          'customer.customerID',
          'approval.customerID',
        )
      })

      .leftJoin('users as creditors', 'leads.alloUID', 'creditors.userID')

      .leftJoin(
        db.raw(`(
                SELECT * FROM equated_monthly_installments e
                WHERE e.status = 'due' OR e.status = 'partially-paid'
            ) as emi`),
        'leads.leadID',
        'emi.leadID',
      )

      .leftJoin(
        db.raw(`(
          SELECT
            emi.leadID,
            COUNT(CASE WHEN emi.status = 'paid' THEN 1 END) AS paid_emi,
            COUNT(
                CASE
                    WHEN emi.status = 'due' AND emi.dueDate < CURDATE() THEN 1
                    WHEN emi.status = 'partially-paid' AND emi.actualPaymentDate IS NOT NULL
                         AND emi.actualPaymentDate > emi.dueDate
                         AND emi.actualPaymentDate < CURDATE() THEN 1
                END
            ) AS overDue_emi,
            COUNT(
                CASE
                    WHEN emi.status = 'due' AND emi.dueDate >= CURDATE() THEN 1
                    WHEN emi.status = 'partially-paid' AND (emi.actualPaymentDate IS NULL OR emi.actualPaymentDate <= emi.dueDate) THEN 1
                END
            ) AS due_emi,

          SUM(emi.paymentReceived) AS total_collection,

         CEIL(SUM(
            CASE
              WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE() THEN
                CASE
                  WHEN emi.status = 'due'
                  THEN emi.principal + emi.interest + (emi.principal * ((approval.roi / 365 + 0.1) / 100)) * DATEDIFF(CURDATE(), emi.dueDate) + 590

                  WHEN emi.status = 'partially-paid' AND emi.actualPaymentDate <= emi.dueDate
                  THEN emi.principal + emi.interest + (emi.amountRemains * ((approval.roi / 365 + 0.1) / 100)) * DATEDIFF(CURDATE(), emi.dueDate) + 590 - emi.paymentReceived

                  WHEN emi.status = 'partially-paid' AND emi.actualPaymentDate >= emi.dueDate
                  THEN emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest + (emi.amountRemains * ((approval.roi / 365 + 0.1) / 100)) * DATEDIFF(CURDATE(), emi.actualPaymentDate) + 590 - emi.paymentReceived

                  ELSE 0
                END
              ELSE 0
            END
          )) AS remaining_collection,

       SUM(
        CASE
          WHEN emi.status != 'paid'
          THEN CEIL(
            (CASE
              WHEN emi.status = 'due' AND emi.dueDate < CURDATE()
                THEN (emi.principal * ((approval.roi / 365 + 0.1) / 100) * DATEDIFF(CURDATE(), emi.dueDate))
                     + emi.principal + emi.interest + 590
              WHEN emi.status = 'partially-paid' AND emi.dueDate < CURDATE() AND emi.actualPaymentDate <= emi.dueDate
                THEN (emi.amountRemains * ((approval.roi / 365 + 0.1) / 100) * DATEDIFF(CURDATE(), emi.dueDate))
                     + emi.principal + emi.interest + 590
              ELSE (emi.amountRemains * ((approval.roi / 365 + 0.1) / 100) * DATEDIFF(CURDATE(), emi.actualPaymentDate))
                     + emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest
            END) - emi.paymentReceived
          )
          ELSE 0
        END
      ) AS due_date_repay_amount,



      SUM(
    CASE
      WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()
      THEN DATEDIFF(CURDATE(), emi.dueDate)
      ELSE 0
    END
  ) AS days_past_due ,

   CASE
    WHEN SUM(
      CASE
        WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()
        THEN GREATEST(DATEDIFF(CURDATE(), emi.dueDate), 0)
        ELSE 0
      END
    ) BETWEEN 1 AND 30 THEN '1-30 Bucket 1'

    WHEN SUM(
      CASE
        WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()
        THEN GREATEST(DATEDIFF(CURDATE(), emi.dueDate), 0)
        ELSE 0
      END
    ) BETWEEN 31 AND 60 THEN '31-60 Bucket 2'

    WHEN SUM(
      CASE
        WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()
        THEN GREATEST(DATEDIFF(CURDATE(), emi.dueDate), 0)
        ELSE 0
      END
    ) BETWEEN 61 AND 90 THEN '61-90 Bucket 3'

    WHEN SUM(
      CASE
        WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()
        THEN GREATEST(DATEDIFF(CURDATE(), emi.dueDate), 0)
        ELSE 0
      END
    ) > 90 THEN '91+ Bucket 4'

    ELSE 'No Bucket'
  END AS dpd_bucket

          FROM equated_monthly_installments emi
          JOIN approval ON emi.leadID = approval.leadID
          WHERE emi.is_deleted = 0
          GROUP BY emi.leadID
        ) as emi_full`),
        'leads.leadID',
        'emi_full.leadID',
      )

      .select(
        'creditors.name as allocated_agent',
        'leads.leadID as lead_id',
        'loan.loanNo as loan_no',
        'leads.purpose as loan_purpose',
        'leads.state as state',
        'leads.city as city',
        'customer.name as name',
        'customer.gender as gender',
        'customer.email as email',
        'customer.mobile as mobile',
        'customer.dob as dob',
        db.raw('YEAR(CURDATE()) - YEAR(customer.dob) AS age'),
        'customer.pancard as pan_no',
        'emi_full.paid_emi',
        'emi_full.due_emi',
        'emi_full.overdue_emi',
        'emi_full.total_collection',
        'emi_full.due_date_repay_amount',
        'emi_full.days_past_due',
        'emi_full.dpd_bucket',
        'emi_full.remaining_collection',

        db.raw(`
          CEIL(SUM(emi.amountPayable)) AS emi_amount
        `),

        'loan.disbursalAmount as loan_amount',
        'customer.employeeType as employee_type',
        'leads.fbLeads as loan_type',
        db.raw("DATE_FORMAT(loan.disbursalDate, '%d-%M-%Y') AS disbursed_date"),
        db.raw("DATE_FORMAT(loan.disbursalDate, '%M-%Y') AS disbursed_month"),
        db.raw("DATE_FORMAT(emi.dueDate, '%d-%M-%Y') AS repay_date"),
        db.raw("DATE_FORMAT(emi.dueDate, '%M-%Y') AS repay_month"),
        db.raw("CONCAT(credits.tenure, ' Months') AS tenure"),
        db.raw("CONCAT(credits.tenure, ' Months') AS loan_tenure"),
        'approval.roi as roi',
        db.raw("IFNULL(creditors.name, 'Unknown') AS credit_by"),
        'customer.createdDate as date',
        db.raw(`
          (SELECT JSON_OBJECT('address', a.address)
           FROM address a
           WHERE a.customerID = customer.customerID
             AND a.type NOT IN ('Current Address', 'Rent')
           LIMIT 1
          ) AS address
        `),
        db.raw(`
          (SELECT JSON_OBJECT('address', a.address)
           FROM address a
           WHERE a.customerID = customer.customerID
             AND a.type = 'Current Address'
           LIMIT 1
          ) AS currentAddress
        `),
        db.raw(`
          (SELECT JSON_OBJECT('address', a.address)
           FROM address a
           WHERE a.customerID = customer.customerID
             AND a.type = 'Rent'
           LIMIT 1
          ) AS rentAddress
        `),
        db.raw(`
          (SELECT JSON_OBJECT(
             'employerName', e.employerName,
             'address', e.address,
             'city', e.city,
             'state', e.state,
             'pincode', e.pincode
          ) FROM employer e WHERE e.customerID = customer.customerID
           LIMIT 1
          ) AS employer
        `),
        db.raw(`
          (SELECT JSON_OBJECT(
             'relation', r.relation,
             'name', r.name,
             'contactNo', r.contactNo,
             'address', r.address,
             'city', r.city,
             'state', r.state,
             'pincode', r.pincode
          ) FROM reference r
          WHERE r.customerID = customer.customerID
            AND r.reference_verify = '0'
          LIMIT 1
          ) AS reference1
        `),
        db.raw(`
          (SELECT JSON_OBJECT(
             'relation', r2.relation,
             'name', r2.name,
             'contactNo', r2.contactNo,
             'address', r2.address,
             'city', r2.city,
             'state', r2.state,
             'pincode', r2.pincode
          ) FROM reference r2
          WHERE r2.customerID = customer.customerID
            AND r2.reference_verify = '0'
          LIMIT 1, 1
          ) AS reference2
        `),
      )

      .whereIn('leads.status', [LeadStatus.DISBURSED, LeadStatus.PART_PAYMENT])
      .where('leads.productID', 1)
      .whereNotIn('customer.customerID', function (builder) {
        builder
          .select('customer_dnd.customerID')
          .from('customer_dnd')
          .where('expiry_date', '>=', db.raw('CURDATE()'))
          .where('is_deleted', 0).whereRaw(`customer_dnd.id = (
        SELECT MAX(cd.id) FROM customer_dnd AS cd WHERE cd.customerID = customer_dnd.customerID
      )`)
      })
      .groupBy([
        'leads.leadID',
        'creditors.name',
        'loan.loanNo',
        'leads.purpose',
        'leads.state',
        'leads.city',
        'customer.name',
        'customer.gender',
        'customer.email',
        'customer.mobile',
        'customer.dob',
        'customer.pancard',
        'emi_full.paid_emi',
        'emi_full.due_emi',
        'emi_full.overdue_emi',
        'emi_full.total_collection',
        'emi_full.due_date_repay_amount',
        'emi_full.days_past_due',
        'emi_full.dpd_bucket',
        'emi_full.remaining_collection',
        'loan.disbursalAmount',
        'customer.employeeType',
        'leads.fbLeads',
        'loan.disbursalDate',
        'emi.dueDate',
        'credits.tenure',
        'approval.roi',
        'customer.createdDate',
      ])
      .orderBy('leads.leadID', 'desc')

    await this.checkFilterForPendingCollection(
      search_by,
      customer_search,
      startDate,
      endDate,
      query,
      dpd,
      today,
      'emi',
    )

    // for excel download
    if (isExcelDownload) {
      let data = await query
      if (data.length == 0) {
        data = [
          {
            Allocated_Agent: '-',
            Lead_Id: '-',
            Loan_No: '-',
            Loan_Purpose: '-',
            State: '-',
            City: '-',
            Name: '-',
            Gender: '-',
            Email: '-',
            Mobile: '-',
            DOB: '-',
            Age: '-',
            PAN_No: '-',
            Paid_EMI: '-',
            Due_EMI: '-',
            OverDue_EMI: '-',
            Total_Collection: '-',
            Due_Date_Repay_Amount: '-',
            EMI_Amount: '-',
            Days_Past_Due: '-',
            DPD_Bucket: '-',
            Remaining_Collection: '-',
            Loan_Amount: '-',
            Employee_Type: '-',
            Loan_Type: '-',
            Disbursed_Date: '-',
            Disbursed_Month: '-',
            Repay_Date: '-',
            Repay_Month: '-',
            Tenure: '-',
            Loan_Tenure: '-',
            ROI: '-',
            Credit_By: '-',
            Date: '-',
            address: '-',
            currentAddress: '-',
            rentAddress: '-',
            employer: '-',
            reference1: '-',
            reference2: '-',
          } as any,
        ]
      }
      const excelBuffer = await this.excelDownloadService.exportDataToExcelBuffer(data)
      return this.serviceResponse(
        200,
        { workbook: excelBuffer },
        'Excel file generated successfully',
      )
    }

    const totalCountQuery = query.clone().clearGroup().count('* as totalCount').first()

    const paginatedQuery = query.clone().limit(perPage).offset(page)

    const [totalCountResult, paginatedData] = await Promise.all([totalCountQuery, paginatedQuery])

    const pendingEMIData = {
      pendingEMIData: paginatedData,
      totalCount: totalCountResult.totalCount,
      totalPages: Math.ceil(totalCountResult.totalCount / perPage),
    }

    return this.serviceResponse(200, pendingEMIData, 'Pending EMI Collection List')
  }

  public async findCollectionReport(
    payload: IGetCollectionReport,
    page?: number,
    perPage?: number,
    isExcelDownload?: boolean,
  ): Promise<IServiceResponse> {
    const {
      search_by,
      start_date,
      end_date,
      customer_search,
      lead_id,
      lead_case,
      employment_type,
      salary_mode,
      monthly_income,
      city,
      state,
      page_name,
    } = payload
    const db = getKnexInstance()
    if (!db) {
      console.error('Failed to initialize the Knex instance.')
      return this.serviceResponse(500, null, 'Internal Server Error')
    }

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    let query = db('customer')
      .join('leads', 'customer.customerID', '=', 'leads.customerID')
      .leftJoin('users', 'users.userID', '=', 'leads.sanctionAppID')
      .select(
        'leads.leadID AS leadId',
        'customer.customerID AS customerId',
        'customer.name',
        'customer.email',
        'customer.mobile',
        'leads.purpose AS loanPurpose',
        'leads.loanRequeried AS loanRequired',
        'leads.monthlyIncome',
        'leads.city',
        'leads.state',
        'leads.pincode',
        'leads.utmSource AS source',
        'leads.status',
        'leads.sanctionalloUID AS sanctionBy',
        'leads.fbLeads AS type',
        'leads.createdDate AS createdAt',
        'users.name AS sanctionByName',
      )
      .whereNot('leads.productID', 1)
      .whereNot('leads.sanctionalloUID', 'no')
      .orderBy('leads.leadID', 'desc')

    if (page_name) {
      const statusMap: Record<string, string> = {
        closed: 'Closed',
        part_payment: 'Part Payment',
        settlement: 'Settlement',
      }

      const normalizedStatus = page_name.toLowerCase().replace(/\s+/g, '_') // Convert spaces to underscores
      if (statusMap[normalizedStatus]) {
        query = query.where('leads.status', statusMap[normalizedStatus])
      } else {
        console.log('Status not found in map:', normalizedStatus)
      }
    }

    await this.checkFilterForCollectionReport(
      search_by,
      start_date,
      end_date,
      customer_search,
      lead_id,
      lead_case,
      employment_type,
      salary_mode,
      monthly_income,
      city,
      state,
      query,
    )
    if (isExcelDownload) {
      let data = await query
      if (data.length == 0) {
        data = [
          {
            leadId: '-',
            customerId: '-',
            name: '-',
            email: '-',
            mobile: '-',
            loanPurpose: '-',
            loanRequired: '-',
            monthlyIncome: '-',
            city: '-',
            state: '-',
            pincode: '-',
            source: '-',
            status: '-',
            sanctionBy: '-',
            type: '-',
            createdAt: '-',
            sanctionByName: '-',
          },
        ]
      }
      const excelBuffer = await this.excelDownloadService.exportDataToExcelBuffer(data)
      return this.serviceResponse(
        200,
        { workbook: excelBuffer },
        'Excel file generated successfully',
      )
    }

    const totalCountQuery = query.clone().count('* as totalCount').first()
    const paginatedQuery = query.clone().limit(perPage).offset(page)

    const [totalCountResult, paginatedData] = await Promise.all([totalCountQuery, paginatedQuery])
    const collectionData = {
      collectionReport: paginatedData,
      totalCount: totalCountResult.totalCount,
      totalPages: Math.ceil(totalCountResult.totalCount / perPage),
    }
    return this.serviceResponse(200, collectionData, `${page_name} collection data`)
  }

  public async findWaiveOffLoanDetail(findType: string, id: string): Promise<IServiceResponse> {
    const db = getKnexInstance()
    if (!db) {
      console.error('Failed to initialize the Knex instance.')
      return this.serviceResponse(500, null, 'Internal Server Error')
    }

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    if (!['mobile', 'leadID', 'loanNo'].includes(findType) || !id) {
      return this.serviceResponse(400, [], 'Invalid search type or missing parameters')
    }

    const searchColumn = {
      mobile: 'c.mobile',
      leadID: 'l.leadID',
      loanNo: 'lo.loanNo',
    }[findType]

    const collections = await db('customer as c')
      .leftJoin('leads as l', 'c.customerID', 'l.customerID')
      .leftJoin('loan as lo', 'l.leadID', 'lo.leadID')
      .leftJoin('approval as a', function () {
        this.on('c.customerID', '=', 'a.customerID').andOn('l.leadID', '=', 'a.leadID')
      })
      .leftJoin('collection as col', function () {
        this.on('c.customerID', '=', 'col.customerID')
          .andOn('l.leadID', '=', 'col.leadID')
          .andOnIn('col.collectionStatus', [
            CollectionStatus.APPROVED,
            CollectionStatus.APPROVAL_WAITING,
            CollectionStatus.APPROVAL_WAITING_REFUNDED,
          ])
      })
      .leftJoin('users as u', 'col.collectedBy', 'u.userID')
      .leftJoin('loan as disbursal', function () {
        this.on('c.customerID', '=', 'disbursal.customerID').andOn(
          'l.leadID',
          '=',
          'disbursal.leadID',
        )
      })
      .select(
        'c.customerID',
        'c.mobile',
        'l.leadID',
        'l.productID',
        'l.ipc',
        'lo.loanID',
        'lo.loanNo',
        'disbursal.disbursalAmount',
        'disbursal.disbursalDate',
        'disbursal.disbursalRefrenceNo',
        'a.repayDate',
        'a.roi',
        'a.branch',
        db.raw('SUM(col.collectedAmount) as collectedAmount'),
        'u.name as executive',
        'col.collectedAmount',
        'col.createdDate',
        'col.status',
        'col.collectionStatus as collectionStatus',
        'col.remark',
      )
      .where(searchColumn, id)
      .whereIn('l.status', [
        CollectionStatus.DISBURSED,
        CollectionStatus.PART_PAYMENT,
        CollectionStatus.SETTLEMENT,
      ])
      .groupBy(
        'c.customerID',
        'l.leadID',
        'lo.loanID',
        'disbursal.loanID',
        'a.approvalID',
        'col.collectionID',
        'u.userID',
      )
      .orderBy('l.leadID', 'desc')

    if (!collections) return this.serviceResponse(404, [], 'No matching record found')

    const approvedCollection = collections.filter(
      collection => collection.collectionStatus === CollectionStatus.APPROVED,
    )

    if (approvedCollection.length === 0) {
      return this.serviceResponse(404, [], 'No approved collection found')
    }

    const {
      customerID,
      leadID,
      loanID,
      disbursalAmount,
      disbursalDate,
      disbursalRefrenceNo,
      repayDate,
      roi,
      branch,
      collectedAmount,
      ipc,
    } = approvedCollection[0]

    if (!disbursalRefrenceNo)
      return this.serviceResponse(400, [], 'No disbursal reference number found')

    // Use moment-timezone for consistent date handling
    const currentDate = momentTz().toDate()
    const repayDateMoment = momentTz(repayDate)
    const disbursalDateMoment = momentTz(disbursalDate)

    // Calculate days with moment for more accurate results
    const totalDays = repayDateMoment.diff(disbursalDateMoment, 'days')
    const realDays = Math.min(totalDays, momentTz(currentDate).diff(disbursalDateMoment, 'days'))
    const penaltyDays = Math.max(0, momentTz(currentDate).diff(repayDateMoment, 'days'))

    // Calculate interest with proper precision
    const dailyInterest = +(disbursalAmount * (roi / 100)).toFixed(2)
    const totalInterest = +(dailyInterest * realDays).toFixed(2)

    // Handle penalty calculation
    let penaltyInterest = 0
    if (penaltyDays > 0) {
      penaltyInterest =
        ipc === CollectionStatus.IPC
          ? (await calculatePaydayAmountIPC(leadID, approvedCollection[0].status)).charges || 0
          : parseFloat((disbursalAmount * (1.25 / 100)).toFixed(2)) * penaltyDays
    }

    const bouncingCharges = ipc === CollectionStatus.IPC ? penaltyInterest : 0
    const paidAmount = collectedAmount || 0

    // Calculate total payable amount based on loan type
    let totalPayable, maxPay
    if (ipc === CollectionStatus.IPC) {
      const payAmount = await calculatePaydayAmountIPC(leadID, approvedCollection[0].status)
      totalPayable = payAmount.totalRepayAmount
      maxPay = payAmount.totalRepayAmount
    } else {
      totalPayable = +(disbursalAmount + totalInterest + penaltyInterest).toFixed(2)
      maxPay = +(totalPayable - paidAmount).toFixed(2)
    }

    let collectionDetails = []
    collections.forEach(item => {
      collectionDetails.push({
        date: item.createdDate,
        amount: item.collectedAmount,
        executive: item.executive || '',
        status: item.status,
        collectionStatus: item.collectionStatus,
        remark: item.remark,
      })
    })

    return this.serviceResponse(
      200,
      {
        loanDetails: {
          customerId: customerID,
          leadId: leadID,
          loanId: loanID,
          branch,
          disbursedLoan: disbursalAmount,
          roi,
          totalDays,
          realDays,
          penaltyDays,
          totalInterest,
          penaltyInterest,
          bouncingCharges,
          paidAmount,
          repaymentAmount: maxPay,
        },
        collectionDetails,
      },
      'Waive Off Data Retrieved',
    )
  }

  public async addMultipleLeads(
    leadIds: number[],
    userId: number,
    userName: string,
  ): Promise<IServiceResponse> {
    const db = getKnexInstance()

    if (!db) {
      console.error('Failed to initialize the Knex instance.')
      return this.serviceResponse(500, [], 'Internal Server Error')
    }

    if (!leadIds || leadIds.length === 0) {
      return this.serviceResponse(400, [], 'Select at least one lead.')
    }

    try {
      for (const leadId of leadIds) {
        if (!leadId) continue

        await this.leadModel.findOneAndUpdate(
          { leadID: leadId },
          {
            sanctionalloUID: userId,
            alloUID: userId.toString(),
          },
        )

        const leadDetail = await this.leadModel.findOneLead({ leadID: leadId }, ['*'])

        if (!leadDetail) continue

        const userDetail = await this.userModel.findOne({ where: { userID: userId } })

        const agentName = userDetail ? userDetail.name : ''

        await this.callhistorylogsModel.insert({
          customerID: leadDetail.customerID,
          leadID: leadId,
          callType: 'IVR',
          status: CollectionStatus.LEAD_ALLOCATED.toString(),
          appAmount: ' ',
          noteli: ' ',
          remark: `Lead Allocated to ${agentName} By: ${userName}`,
          callbackTime: new Date(new Date().toISOString().split('T')[0]),
          calledBy: userId,
          createdDate: new Date(),
        })
      }

      return this.serviceResponse(201, [], 'Lead Allocate Request Added Successfully')
    } catch (error) {
      console.error('Error allocating leads:', error)
      return this.serviceResponse(500, null, 'Internal Server Error')
    }
  }

  public async addWaiveOff(
    customerId: number,
    leadId: number,
    loanId: number,
    amount: number,
    remark: string,
    userID: number,
    type: WaiverType,
  ): Promise<IServiceResponse> {
    const db = getKnexInstance()

    if (!db) {
      console.error('Failed to initialize the Knex instance.')
      return this.serviceResponse(500, null, 'Internal Server Error')
    }

    if (!customerId || !leadId || !loanId || !amount || !remark) {
      return this.serviceResponse(400, [], 'All input fields are required')
    }

    // Check if a waive-off request already exists for this customer & lead
    const existingRequest = await this.collectionModel.countCollection({
      customerID: customerId,
      leadID: leadId,
      collectedMode: CollectionStatus.WAIVE_OFF,
      collectionStatus: CollectionStatus.APPROVAL_WAITING,
    })

    if (existingRequest > 0) {
      throw new BadRequestError('Only one waive-off request can be added at a time.')
    }

    // Get lead details and loan info
    const [leadDetail, loanInfo] = await Promise.all([
      db('leads').where({ customerID: customerId, leadID: leadId }).first(),
      db('loan').where({ customerID: customerId, leadID: leadId }).first(),
    ])

    if (!leadDetail || !loanInfo) {
      throw new BadRequestError('Lead or Loan information not found')
    }

    // Get total collected amount
    const totalCollectedAmount =
      (
        await db('collection')
          .where({ customerID: customerId, leadID: leadId })
          .whereIn('collectionStatus', [
            CollectionStatus.APPROVED,
            CollectionStatus.APPROVAL_WAITING,
            CollectionStatus.APPROVAL_WAITING_REFUNDED,
          ])
          .sum('collectedAmount as total')
          .first()
      )?.total || 0

    let payAmount

    if (leadDetail.ipc === CollectionStatus.IPC) {
      payAmount = await calculatePaydayAmountIPC(leadId, leadDetail.status)
    } else {
      payAmount = await calculateTotalRepayPaydayAmountNonIPC(leadId)
    }

    const updatedCollectedAmount = totalCollectedAmount + amount

    // Validate against repayment amount
   if (
      amount > payAmount?.totalRepayAmount ||
      amount > payAmount
      // (payAmount?.totalRepayAmount && updatedCollectedAmount > payAmount.totalRepayAmount)
    ) {
      throw new BadRequestError('Amount exceeds repayment limit')
    }

    const status =
      updatedCollectedAmount === payAmount?.totalRepayAmount || updatedCollectedAmount === payAmount
        ? CollectionStatus.CLOSED
        : CollectionStatus.PART_PAYMENT

    const referenceNo = `${userID}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    let collectionId: number | undefined
    if (leadDetail.ipc === CollectionStatus.IPC) {
      await this.leadService.updateCollectedAmount(
        leadId,
        customerId,
        amount,
        status,
        moment().format('YYYY-MM-DD'),
        CollectionStatus.WAIVE_OFF,
        remark,
        `waiver_${generateWaiverId()}`,
        0,
        0,
        CollectionStatus.APPROVAL_WAITING,
        userID,
        'waiver',
        null,
        1,
        '',
      )
      const collectionDetails = await this.collectionModel.findOne({
        where: {
          status,
          leadID: leadId,
          customerID: customerId,
          collectedMode: CollectedMode.WAIVE_OFF,
          collectedAmount: amount,
          collectedBy: userID,
          collectionStatus: CollectionStatus.APPROVAL_WAITING as string,
        },
      })
      collectionId = collectionDetails.collectionID
    } else {
      const [collectionID] = await db('collection').insert({
        customerID: customerId,
        leadID: leadId,
        loanNo: loanId,
        collectedAmount: amount, // Commented
        collectedMode: CollectionStatus.WAIVE_OFF,
        collectedDate: moment().format('YYYY-MM-DD'),
        referenceNo,
        // settlemenAmount: amount, // Commented
        // discount_waiver_amount: amount,
        discount_waiver: 'waiver',
        status,
        remark,
        collectedBy: userID,
        createdDate: new Date().toISOString().replace('T', ' ').replace('Z', '').split('.')[0],
        collectionStatus: CollectionStatus.APPROVAL_WAITING,
        orderID: `waiver_${generateWaiverId()}`,
      })

      await db('waive_off_logs').insert({
        collectionID,
        customerID: customerId,
        leadID: leadId,
        loanNo: loanId,
        userID: userID,
        collectedAmount: amount,
        status,
        collectedMode: CollectionStatus.WAIVE_OFF,
        collectionStatus: CollectionStatus.APPROVAL_WAITING,
        created_at: moment().format('YYYY-MM-DD'),
      })
      collectionId = collectionID
    }
    //create entry in waiver table
    await this.createWaiver(amount, leadDetail, userID, remark, type, collectionId)

    return this.serviceResponse(201, null, 'Waive Off Request Added Successfully')
  }

  public async createWaiver(
    amount: number,
    leadDetail: ILead,
    userID: number,
    remark: string,
    type: WaiverType,
    collectionID?: number,
  ) {
    const waiverDetails: InsertData<IWaiver> = {
      amount: amount,
      customer_id: leadDetail.customerID,
      created_by: userID,
      product: leadDetail.productID === 2 ? Products.PAYDAY : Products.EMI,
      lead_id: leadDetail.leadID,
      remarks: remark,
      type: type,
      expiration_time:
        type === WaiverType.TEMPORARY ? moment().endOf('day').format('YYYY-MM-DD HH:mm:ss') : null,
      collection_id: collectionID,
    } as InsertData<IWaiver>
    await this.waiverModel.create(waiverDetails)
  }

  public async find(
    whereConditions: { column: string; values: string[] | number[] }[],
    order: { orderKey: string; orderValue: string },
    select: string[],
    skip?: number,
    take?: number,
    collectionStartDate?: string,
    collectionEndDate?: string,
  ): Promise<ICollection[] | ICustomResponse> {
    try {
      let collections = await this.collectionModel.getCollectionData(
        whereConditions,
        order,
        select,
        skip,
        take,
        collectionStartDate,
        collectionEndDate,
      )

      if (collections == null || collections.length == 0) {
        return null
      } else {
        return collections
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async countRows(where: {}): Promise<number | ICustomResponse> {
    try {
      let collection_count = await this.collectionModel.countCollection(where)
      if (collection_count == null) {
        return 0
      } else {
        return collection_count // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async create(
    customerID: number,
    leadID: number,
    loanNo: string,
    collectedAmount: number,
    collectedMode: string,
    collectedDate: Date,
    referenceNo: string,
    discountAmount: number,
    settlemenAmount: number,
    status: string,
    remark: string,
    collectedBy: number,
    createdDate: Date, // assuming the correct date is assigned to this variable
    collectionStatus: string,
    collectionStatusby: string,
    orderID: string,
  ): Promise<number> {
    let insertId = await this.collectionModel.insert(
      customerID,
      leadID,
      loanNo,
      collectedAmount,
      collectedMode,
      collectedDate, // assuming updatestamp is converted to the correct format already
      referenceNo,
      discountAmount,
      settlemenAmount,
      status,
      remark,
      collectedBy,
      createdDate, // assuming the correct date is assigned to this variable
      collectionStatus,
      collectionStatusby,
      orderID,
    )
    return insertId
  }

  public async updateOne(where: {}, update: {}): Promise<boolean | ICustomResponse> {
    try {
      await this.collectionModel.findOneAndUpdate(where, update)
      return true
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  // async collectionManager(
  //   payload: ICollectionManagerPayload,
  //   pagination: IPagination,
  //   userID: number,
  // ) {
  //   const { searchString, type, collectionType } = payload
  //   const { skip, take } = pagination

  //   let result
  //   let responseArr = []

  //   switch (type) {
  //     case 'payday':
  //       const coll = this.customerModel.CustomerKnex.join(
  //         'collection as coll',
  //         'customer.customerID',
  //         '=',
  //         'coll.customerID',
  //       )
  //         .leftJoin('leads as l', 'l.leadID', '=', 'coll.leadID')
  //         .select(
  //           'coll.*',
  //           'customer.customerID',
  //           'customer.name',
  //           'customer.mobile',
  //           'customer.email',
  //         )
  //         .where('l.productID', '!=', 1)
  //       // .orderBy('coll.collectionID', 'desc')

  //       if (searchString) {
  //         coll.where(function () {
  //           this.where('customer.name', 'like', `%${searchString}%`)
  //             .orWhere('customer.mobile', 'like', `%${searchString}%`)
  //             .orWhere('customer.email', 'like', `%${searchString}%`)
  //         })
  //       }

  //       if (collectionType === CollectionType.APPROVED) {
  //         coll.where('coll.collectionStatus', CollectionStatus.APPROVED)
  //       } else if (collectionType === CollectionType.REJECTED) {
  //         coll.where('coll.collectionStatus', CollectionStatus.PAYMENT_REJECTED)
  //       } else {
  //         coll.where('coll.collectionStatus', CollectionStatus.APPROVAL_WAITING)
  //       }

  //       coll.orderBy('coll.collectionID', 'desc').offset(skip).limit(take)

  //       const collections = await coll

  //       for (const collection of collections) {
  //         result = await this.leadModel.LeadsKnex.join('loan', function () {
  //           this.on('leads.customerID', '=', 'loan.customerID').on(
  //             'leads.leadID',
  //             '=',
  //             'loan.leadID',
  //           )
  //         })
  //           .join('approval', function () {
  //             this.on('leads.customerID', '=', 'approval.customerID').on(
  //               'leads.leadID',
  //               '=',
  //               'approval.leadID',
  //             )
  //           })
  //           .leftJoin('collection', function () {
  //             this.on('leads.customerID', '=', 'collection.customerID')
  //               .on('leads.leadID', '=', 'collection.leadID')
  //               .andOn(
  //                 'collection.collectionStatus',
  //                 '=',
  //                 getKnexInstance().raw('?', [CollectionStatus.APPROVED]),
  //               )
  //               .andOn(
  //                 'collection.status',
  //                 '=',
  //                 getKnexInstance().raw('?', [CollectionStatus.CLOSED]),
  //               )
  //           })
  //           .where('leads.customerID', collection.customerID)
  //           .where('leads.leadID', collection.leadID)
  //           .select(
  //             'loan.disbursalDate',
  //             'loan.disbursalAmount',
  //             'approval.roi',
  //             'approval.repayDate',
  //             'leads.ipc',
  //             'collection.collectedDate',
  //           )
  //           .first()

  //         const collectionAmnt =
  //           (await this.collectionModel.CollectionKnex.where(
  //             'customerID',
  //             collection.customerID,
  //           )
  //             .where('leadID', collection.leadID)
  //             .where('collectionStatus', CollectionStatus.APPROVED)
  //             .sum('collectedAmount as totalCollectedAmount')) as {
  //             totalCollectedAmount: number | null
  //           }

  //         const [collectedBy, collectionStatusBy] = await Promise.all([
  //           this.userModel.findOne({
  //             where: { userID: collection.collectedBy },
  //             select: ['name'],
  //           }),
  //           this.userModel.findOne({
  //             where: { userID: collection.collectionStatusby },
  //             select: ['name'],
  //           }),
  //         ])

  //         result.collectedAmount =
  //           collectionAmnt[0].totalCollectedAmount ?? null // paid amount
  //         result.name = collection.name ?? null
  //         result.email = collection.email ?? null
  //         result.mobile = collection.mobile ?? null
  //         result.status = collection.status ?? null
  //         result.collectedMode = collection.collectedMode ?? null
  //         result.collectedBy = collectedBy?.name ?? null
  //         result.collectionStatusBy = collectionStatusBy?.name ?? null
  //         result.referenceNo = collection.referenceNo ?? null
  //         result.discountAmount = collection.disbursalAmount ?? null
  //         result.showApprovedRejectButton = false
  //         // result.disbursalAmount = loanamnt

  //         const collectedDate = momentTz(collection.collectedDate)
  //         const currentDate = momentTz().startOf('day')

  //         const collectedDateDiff = collectedDate.isAfter(currentDate)

  //         if (collectionType === CollectionType.APPROVAL_PENDING) {
  //           if (collectedDateDiff || userID == 29 || userID == 43) {
  //             result.showApprovedRejectButton = true
  //           }
  //         }

  //         responseArr.push(result)
  //       }
  //   }

  //   return this.serviceResponse(HttpStatusCode.Ok, responseArr, 'Data fetched')
  // }

  async collectionManagerV2(
    payload: ICollectionManagerPayload,
    pagination: IPagination,
    userID: number,
  ) {
    const { customer_search, type, collectionType, start_date, end_date, collected_mode } = payload
    const { skip, take } = pagination

    const db = getKnexInstance()

    switch (type) {
      case 'payday':
        const coll = this.customerModel.CustomerKnex.join(
          'collection',
          'customer.customerID',
          '=',
          'collection.customerID',
        )
          .leftJoin('leads', 'leads.leadID', '=', 'collection.leadID')
          .leftJoin('approval', 'approval.leadID', '=', 'collection.leadID')
          .where('leads.productID', '!=', 1)

        if (start_date && end_date) {
          coll.whereBetween('collection.collectedDate', [start_date, end_date])
        } else if (start_date) {
          coll.where('collection.collectedDate', '>=', start_date)
        } else if (end_date) {
          coll.where('collection.collectedDate', '<=', end_date)
        }
        if (collected_mode == CollectedMode.WAIVE_OFF) {
          coll.where('collection.collectedMode', CollectedMode.WAIVE_OFF)
        }
        if (customer_search) {
          coll.where(function () {
            this.where('customer.name', 'like', `%${customer_search}%`)
              .orWhere('customer.mobile', 'like', `%${customer_search}%`)
              .orWhere('customer.email', 'like', `%${customer_search}%`)
          })
        }

        if (collectionType === CollectionType.APPROVED) {
          coll.where('collection.collectionStatus', CollectionStatus.APPROVED)
        } else if (collectionType === CollectionType.REJECTED) {
          coll.where('collection.collectionStatus', CollectionStatus.PAYMENT_REJECTED)
        } else {
          coll.where('collection.collectionStatus', CollectionStatus.APPROVAL_WAITING)
        }

        const [totalCollectionsCount, collections] = await Promise.all([
          coll.clone().count().first(),
          coll
            .clone()
            .select(
              'collection.leadID', // Lead ID
              'collection.collectionID', // Collection ID
              'collection.status', // Status
              'collection.collectedMode', // Collected Mode
              'collection.referenceNo', // Reference No
              'collection.remark', // Remark
              'collection.loanNo', // Loan No
              'collection.createdDate as date', // Date
              'collection.approvedDate', // Approved Date
              'collection.collectedDate as paymentDate', // Payment Date
              // 'collection.collectedAmount as paidAmount', // Paid Amount
              'collection.settlemenAmount as settlementAmount', // Settlement Amount
              'collection.discountAmount', // Discount Amount
              'collection.collectedBy', // Collected By
              'collection.collectionStatusby as approvedBy', // Approved By
              'approval.loanAmtApproved as loanAmount', // Loan Amount
              'approval.roi', // ROI
              'approval.repayDate', // Repay Date
              'leads.status as leadStatus', // Lead Status
              'leads.ipc', // IPC
              'customer.customerID',
              'customer.name',
              'customer.mobile',
              'customer.email',
            )
            .orderBy('collection.collectedDate', 'desc')
            .offset(skip)
            .limit(take),
        ])
        const totalCollectionCount = +totalCollectionsCount['count(*)']
        const totalCollectionPages = calculateTotalPages(totalCollectionCount, pagination.take)

        // Calculate totalCollectedAmount

        const leadIds = [...new Set(collections.map(coll => coll.leadID))]

        const collectionAmnt = await this.collectionModel.CollectionKnex.whereIn(
          'collection.leadID',
          leadIds,
        )
          .where('collectionStatus', CollectionStatus.APPROVED)
          .select('collection.leadID')
          .sum('collectedAmount as totalCollectedAmount')
          .groupBy('collection.leadID')

        const colMap = new Map()

        for (const collectAmt of collectionAmnt) {
          colMap.set(collectAmt.leadID, collectAmt.totalCollectedAmount)
        }

        for (let i = 0; i < collections.length; i++) {
          const collection = collections[i]
          const totalCollectedAmount = colMap.get(collection.leadID) ?? null
          collections[i].totalCollection = totalCollectedAmount
          collections[i].paidAmount = totalCollectedAmount

          const collectedDate = momentTz(collection.collectedDate)
          const currentDate = momentTz().startOf('day')

          const collectedDateDiff = collectedDate.isAfter(currentDate)

          if (collectionType === CollectionType.APPROVAL_PENDING) {
            if (collectedDateDiff || userID == 29 || userID == 43) {
              collections[i].showApprovedRejectButton = true
            }
          }

          const lead = {
            ipc: collection.ipc,
            status: collection.leadStatus,
            leadID: collection.leadID,
          } as ILead

          const customer = {
            customerID: collection.customerID,
          } as ICustomer

          const approval = {
            repayDate: collection.repayDate,
            roi: collection.roi,
          } as IApproval

          const loan = {
            disbursalAmount: collection.loanAmount,
            disbursalDate: collection.disbursalDate,
            loanNo: collection.loanNo,
          } as ILoan

          // Calculate repayment amount
          if (collections[i].ipc === 1) {
            const totalAmount = await this.loanService.calculateRepayAmountIpc(
              lead,
              customer,
              approval,
              loan,
              new Date(),
            )
            collections[i].repaymentAmount = totalAmount.totalPayableAmount
          } else {
            const totalAmount = await checkRepaymentAmountV2(collection.leadID)
            collections[i].repaymentAmount = totalAmount.Remanning_Amount
          }
        }

        // Use the common helper method to add user names
        const data = await this.commonHelper.getUserNamesByIds(collections, [
          'collectedBy',
          'approvedBy',
        ])

        return this.serviceResponse(
          HttpStatusCode.Ok,
          {
            totalRecords: totalCollectionCount,
            totalPages: totalCollectionPages,
            results: data,
            type,
          },
          'Fetched',
        )

      case 'emi':
        let transactionStatus = 0
        if (collectionType === CollectionType.APPROVED) {
          transactionStatus = 3
        } else if (collectionType === CollectionType.REJECTED) {
          transactionStatus = 4
        } else {
          transactionStatus = 2
        }

        const customer = this.customerModel.CustomerKnex.leftJoin(
          'transactions as tr',
          'tr.customerID',
          '=',
          'customer.customerID',
        )
          .leftJoin('users as usr', 'usr.userID', '=', 'tr.createdBy')
          .where('tr.status', transactionStatus)
          .where('tr.emiID', 0)

        if (start_date && end_date) {
          customer.whereBetween('tr.createdAt', [start_date, end_date])
        }
        if (collected_mode == CollectedMode.WAIVE_OFF) {
          customer.where('tr.mode', CollectedMode.WAIVE_OFF)
        }

        if (customer_search) {
          customer.where(function () {
            this.where('customer.name', 'like', `%${customer_search}%`)
              .orWhere('customer.mobile', 'like', `%${customer_search}%`)
              .orWhere('customer.email', 'like', `%${customer_search}%`)
          })
        }

        const [totalTransactionCount, transactions] = await Promise.all([
          customer.clone().count().first(),
          customer
            .clone()
            .select(
              'tr.leadID', // Lead ID
              'tr.loanNo', // Loan No
              'tr.mode as paymentMode', // Payment Mode
              'tr.transactionDate', // Transaction Date
              'tr.createdAt', // Created Date
              'tr.referenceNo', // Reference No
              'tr.remarks', // Remarks
              'customer.name', // Name
              'customer.email', // Email
              'customer.mobile', // Mobile
              'tr.payment_transaction_status as paymentStatus', // Payment Status
              'tr.waiver', // Waiver
              'tr.id as transactionID',
              'tr.leadID as leadID',
              db.raw(`CONVERT(tr.amount, SIGNED) as amount`), // Amount
              db.raw(`CASE
                WHEN tr.status = 2 THEN true
                ELSE false
                END AS showApprovedRejectButton`),
              db.raw(`CASE
                  WHEN tr.status = 1 THEN 'Captured'
                  WHEN tr.status = 2 THEN 'Pending'
                  WHEN tr.status = 3 THEN 'Approved'
                  WHEN tr.status = 4 THEN 'Rejected'
                  ELSE 'Failed'
                  END AS status`), // Status
              'usr.name as createdBy',
            )
            .orderBy('tr.createdAt', 'asec')
            .offset(skip)
            .limit(take),
        ])

        const totalTransactionsCount = +totalTransactionCount['count(*)']
        const totalTransactionPages = calculateTotalPages(totalTransactionsCount, pagination.take)

        return this.serviceResponse(
          HttpStatusCode.Ok,
          {
            totalRecords: totalTransactionsCount,
            totalPages: totalTransactionPages,
            results: transactions,
            type,
          },
          'Fetched',
        )
    }
  }

  async downloadCollectionManager(
    payload: ICollectionManagerPayload,
    pagination: IPagination,
    userID: number,
  ) {
    const { data } = (await this.collectionManagerV2(payload, pagination, userID)) as {
      data: { results: Array<any> }
    }

    const { type } = payload
    let collectionData: IPaydayCollectionDetails[]
    let emiData: IEmiCollectionDetails[]
    let mappedData: IPaydayCollectionDetailsCsv[] | IEmiCollectionDetailsCsv[]

    switch (type) {
      case 'payday':
        collectionData = data.results

        mappedData = collectionData.map(collection => {
          const data: IPaydayCollectionDetailsCsv = {
            'Approved By': collection.approvedByName,
            'Approved Date': collection.approvedDate
              ? momentTz(collection.approvedDate).startOf('day').format('YYYY-MM-DD')
              : '',
            'Collected By': collection.collectedByName,
            'Collected Mode': collection.collectedMode,
            'Discount Amount': collection.discountAmount,
            'Loan Amount': collection.loanAmount,
            'Loan Number': collection.loanNo,
            'Paid Amount': collection.paidAmount,
            'Payment Date': collection.paymentDate
              ? momentTz(collection.paymentDate).startOf('day').format('YYYY-MM-DD')
              : '',
            'Reference Number': collection.referenceNo,
            'Repay Date': collection.repayDate
              ? momentTz(collection.repayDate).startOf('day').format('YYYY-MM-DD')
              : '',
            'Repayment Amount': collection.repaymentAmount,
            'Settlement Amount': collection.settlementAmount,
            'Total Collection': collection.totalCollection,
            Date: collection.date
              ? momentTz(collection.date).startOf('day').format('YYYY-MM-DD')
              : '',
            Email: collection.email,
            Mobile: collection.mobile,
            Name: collection.name,
            Remark: collection.remark,
            Status: collection.status,
          }

          return data
        })

        break

      case 'emi':
        emiData = data.results
        mappedData = emiData.map(emi => {
          const data: IEmiCollectionDetailsCsv = {
            'Created At': emi.createdAt,
            'Created By': emi.createdBy,
            'Loan Number': emi.loanNo,
            'Payment Mode': emi.paymentMode,
            'Reference Number': emi.referenceNo,
            'Transaction Date': emi.transactionDate
              ? momentTz(emi.transactionDate).startOf('day').format('YYYY-MM-DD')
              : '',
            'Transaction Status': emi.paymentStatus,
            Amount: emi.amount,
            Email: emi.email,
            Mobile: emi.mobile,
            Name: emi.name,
            Remarks: emi.remarks,
            Status: emi.status,
            Waiver: emi.waiver,
          }

          return data
        })
    }

    return this.serviceResponse(HttpStatusCode.Ok, mappedData, 'CSV Created')
  }

  async collectionManagerAction(payload: ICollectionManagerActionPayload, userID: number) {
    const { collectionID, transactionID, action, type } = payload
    const db = getKnexInstance()

    if (type === 'emi') {
      if (action === 'Rejected') {
        await this.transactionModel.findOneAndUpdate({ id: transactionID }, { status: 4 })
      } else {
        const apiService = new AxiosService(this.commonHelper.getBaseUrl() + '/new-api')
        const resp = await apiService.call(
          'post',
          '/customers/updateEMIManualPayment',
          { transactionID },
          undefined,
          { api_key: config.nodeApiKey, api_secret: config.nodeApiSecret },
        )

        const { data } = resp as { data: any }

        if (!resp.success) {
          throw new BadRequestError(data.message)
        }
      }

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
    }

    const collection = <ICollection & { lead: ILead }>(
      await this.collectionModel.CollectionKnex.where({
        collectionID,
      })
        .leftJoin('leads as l', 'l.leadID', '=', 'collection.leadID')
        .select(
          'collection.collectedDate',
          'collection.customerID',
          'collection.collectedAmount',
          'collection.status',
          'collection.discountAmount',
          'collection.settlemenAmount',
          db.raw(`JSON_OBJECT('leadID', l.leadID,'ipc',l.ipc) as 'lead'`),
        )
        .first()
    )

    if (!collection) {
      throw new NotFoundError('Collection not found')
    }

    if (!collection?.lead) {
      throw new NotFoundError('Lead not found')
    }

    const {
      lead: { leadID, ipc },
      customerID,
      collectedAmount,
      status,
      collectedDate,
      discountAmount,
      settlemenAmount,
    } = collection

    const manualApprovedPayment = await this.collectionModel.findOne({
      where: {
        leadID,
        collectionStatus: CollectionStatus.APPROVED as unknown as string,
      },
      select: ['collectedDate'],
      order: [{ column: 'collectionID', order: 'desc' }],
    })

    let isBackDate = false

    if (
      manualApprovedPayment &&
      manualApprovedPayment.collectedDate &&
      manualApprovedPayment.collectedDate.getTime() > collectedDate.getTime()
    ) {
      isBackDate = true
    }

    if (manualApprovedPayment && ipc === 1 && action === 'Accepted') {
      const repaymentData = await this.approvedCollectionUpdate(
        leadID,
        collectionID,
        collectedAmount,
        status,
        collectedDate,
        discountAmount,
        settlemenAmount,
      )

      if (!repaymentData.success) {
        throw new BadRequestError(
          'This seems to be a back date payment, after re-calculation the repay amount is ' +
          repaymentData.repaymentData.totalPayableAmount +
          ' greater than collected amount ' +
          collectedAmount,
        )
      }
    }

    const [updatedCollection, waiverDetails] = await Promise.all([
      this.collectionModel.findOne({
        where: { collectionID },
        select: ['collectionID', 'status', 'referenceNo', 'leadID'],
      }),
      this.waiverModel.findOne({
        where: {
          lead_id: leadID,
          customer_id: customerID,
          status: WaiverStatus.PENDING,
        },
      }),
    ])

    if (action === 'Accepted') {
      const appWaitingCollection = await this.collectionModel.findOne({
        where: { collectionStatus: CollectionStatus.APPROVAL_WAITING as unknown as string, leadID },
        select: ['collectionID'],
        order: [{ column: 'createdDate', order: 'asc' }],
      })

      if (
        appWaitingCollection &&
        appWaitingCollection.collectionID !== updatedCollection.collectionID
      ) {
        if (updatedCollection?.status && updatedCollection.status === CollectionStatus.CLOSED) {
          throw new BadRequestError('Please approve Part Payment, order by date for this client')
        }
      }
    }

    const currentDate = momentTz()

    await this.collectionModel.findOneAndUpdate(
      { collectionID },
      {
        collectionStatus:
          action === 'Accepted'
            ? String(CollectionStatus.APPROVED)
            : String(CollectionStatus.REJECTED),
        collectionStatusby: userID.toString(),
        approvedDate: currentDate.format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
      },
    )

    const transactionStatus = action === 'Accepted' ? 2 : 3

    await this.transactionModel.findOneAndUpdate(
      {
        collectionID,
      },
      { status: transactionStatus },
    )

    if (action === 'Accepted') {
      await this.leadModel.findOneAndUpdate(
        {
          leadID,
        },
        {
          status:
            updatedCollection.status === CollectionStatus.CLOSED
              ? LeadStatus.CLOSED
              : updatedCollection.status === CollectionStatus.PART_PAYMENT
                ? LeadStatus.PART_PAYMENT
                : updatedCollection.status === CollectionStatus.SETTLEMENT
                  ? LeadStatus.SETTLEMENT
                  : LeadStatus.APPROVED,
        },
      )

      if (updatedCollection.referenceNo !== 'no') {
        await this.onlinePaymentModel.findOneAndUpdate(
          {
            razorpayOrderId: updatedCollection.referenceNo,
          },
          { status: updatedCollection.status.toString() },
        )
      }

      if (updatedCollection.status === CollectionStatus.CLOSED) {
        //update waiver
        if (waiverDetails) {
          await this.waiverModel.findOneAndUpdate(
            { id: waiverDetails.id },
            {
              is_paid: action === 'Accepted' ? true : false,
              status: action === 'Accepted' ? WaiverStatus.APPROVED : WaiverStatus.REJECTED,
              updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
              updated_by: userID,
              approved_date: action === 'Accepted' ? moment().format('YYYY-MM-DD') : null,
            },
          )
        }
        return this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
      }
    }
    //update waiver
    if (waiverDetails) {
      await this.waiverModel.findOneAndUpdate(
        { id: waiverDetails.id },
        {
          is_paid: action === 'Accepted' ? true : false,
          status: action === 'Accepted' ? WaiverStatus.APPROVED : WaiverStatus.REJECTED,
          updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
          updated_by: userID,
          approved_date: action === 'Accepted' ? moment().format('YYYY-MM-DD') : null,
        },
      )
    }

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
  }

  async collectionManagerActionForMultiple(
    payload: ICollectionManagerActionPayloadForMultiple,
    userID: number,
  ) {
    const { ids, action, type } = payload
    const db = getKnexInstance()
    let failedIds: { id: number; error: string }[] = []
    let successCount = 0

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError('Invalid ID list')
    }

    if (type === 'emi') {
      for (const transactionID of ids) {
        try {
          if (action === 'Rejected') {
            await this.transactionModel.findOneAndUpdate({ id: transactionID }, { status: 4 })
            successCount++
          } else {
            const apiService = new AxiosService(this.commonHelper.getBaseUrl() + '/new-api')
            const resp = await apiService.call(
              'post',
              '/customers/updateEMIManualPayment',
              { transactionID },
              undefined,
              { api_key: config.nodeApiKey, api_secret: config.nodeApiSecret },
            )

            const { data } = resp as { data: any }

            if (!resp.success) {
              throw new BadRequestError(data.message)
            }
            successCount++
          }
        } catch (error) {
          failedIds.push({ id: transactionID, error: error.message })
        }
      }
    } else {
      const collections = await this.collectionModel.CollectionKnex.whereIn('collectionID', ids)
        .leftJoin('leads as l', 'l.leadID', '=', 'collection.leadID')
        .select(
          'collection.collectionID',
          'collection.collectedDate',
          'collection.customerID',
          'collection.collectedAmount',
          'collection.status',
          'collection.discountAmount',
          'collection.settlemenAmount',
          'collection.referenceNo',
          db.raw(`JSON_OBJECT('leadID', l.leadID, 'ipc', l.ipc) as 'lead'`),
        )

      if (!collections.length) {
        throw new NotFoundError('Collections not found')
      }

      for (const collection of collections) {
        try {
          const {
            lead: { leadID, ipc },
            customerID,
            collectedAmount,
            status,
            collectedDate,
            discountAmount,
            settlemenAmount,
            referenceNo,
          } = collection

          const manualApprovedPayment = await this.collectionModel.findOne({
            where: {
              leadID,
              collectionStatus: CollectionStatus.APPROVED as unknown as string,
            },
            select: ['collectedDate'],
            order: [{ column: 'collectionID', order: 'desc' }],
          })

          let isBackDate = false

          if (
            manualApprovedPayment &&
            manualApprovedPayment.collectedDate &&
            manualApprovedPayment.collectedDate.getTime() > collectedDate.getTime()
          ) {
            isBackDate = true
          }

          if (manualApprovedPayment && ipc === 1 && action === 'Accepted') {
            const repaymentData = await this.approvedCollectionUpdate(
              leadID,
              collection.collectionID,
              collectedAmount,
              status,
              collectedDate,
              discountAmount,
              settlemenAmount,
            )

            if (!repaymentData.success) {
              throw new BadRequestError(
                'This seems to be a back date payment, after re-calculation the repay amount is ' +
                  repaymentData.repaymentData.totalPayableAmount +
                  ' greater than collected amount ' +
                  collectedAmount,
              )
            }
          }

          const appWaitingCollection = await this.collectionModel.findOne({
            where: {
              collectionStatus: CollectionStatus.APPROVAL_WAITING as unknown as string,
              leadID,
            },
            select: ['collectionID'],
            order: [{ column: 'createdDate', order: 'asc' }],
          })

          if (
            appWaitingCollection &&
            appWaitingCollection.collectionID !== collection.collectionID
          ) {
            if (status === CollectionStatus.CLOSED) {
              throw new BadRequestError(
                `${collection} Please approve Part Payment, order by date for this client`,
              )
            }
          }

          await this.collectionModel.findOneAndUpdate(
            { collectionID: collection.collectionID },
            {
              collectionStatus:
                action === 'Accepted'
                  ? String(CollectionStatus.APPROVED)
                  : String(CollectionStatus.REJECTED),
              collectionStatusby: userID.toString(),
              approvedDate: momentTz().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
            },
          )

          const updatedCollection = await this.collectionModel.findOne({
            where: { collectionID: collection.collectionID },
            select: ['collectionID', 'status', 'referenceNo', 'leadID'],
          })

          const transactionStatus = action === 'Accepted' ? 2 : 3
          await this.transactionModel.findOneAndUpdate(
            { collectionID: collection.collectionID },
            { status: transactionStatus },
          )

          if (action === 'Accepted') {
            await this.leadModel.findOneAndUpdate(
              { leadID },
              {
                status:
                  updatedCollection.status === CollectionStatus.CLOSED
                    ? LeadStatus.CLOSED
                    : updatedCollection.status === CollectionStatus.PART_PAYMENT
                    ? LeadStatus.PART_PAYMENT
                    : updatedCollection.status === CollectionStatus.SETTLEMENT
                    ? LeadStatus.SETTLEMENT
                    : LeadStatus.APPROVED,
              },
            )
            if (referenceNo !== 'no') {
              await this.onlinePaymentModel.findOneAndUpdate(
                { razorpayOrderId: referenceNo },
                { status: status.toString() },
              )
            }
          } else if (action === 'Rejected') {
            await this.leadModel.findOneAndUpdate(
              { leadID },
              {
                status:
                  updatedCollection.status === CollectionStatus.CLOSED
                    ? LeadStatus.CLOSED
                    : updatedCollection.status === CollectionStatus.PART_PAYMENT
                    ? LeadStatus.PART_PAYMENT
                    : updatedCollection.status === CollectionStatus.SETTLEMENT
                    ? LeadStatus.SETTLEMENT
                    : LeadStatus.APPROVED,
              },
            )
          }

          successCount++
        } catch (error) {
          failedIds.push({ id: collection.collectionID, error: error.message })
        }
      }
    }

    let responseMessage = 'Multiple payments are pending approval.'

    if (successCount === ids.length) {
      responseMessage =
        action === 'Accepted'
          ? 'All payments have been approved'
          : 'All payments have been rejected'
    }

    return this.serviceResponse(HttpStatusCode.Ok, { failedIds }, responseMessage)
  }

  // async collectionManagerActionForMultiple(
  //   payload: ICollectionManagerActionPayloadForMultiple,
  //   userID: number,
  // ) {
  //   const { collectionIDs, transactionIDs, action, type } = payload

  //   const db = getKnexInstance()

  //   const appWaitingCollection = await db('collection')
  //     .where('collectionStatus', CollectionStatus.APPROVAL_WAITING as unknown as string)
  //     .whereIn('collectionID', collectionIDs)
  //     .select('collectionID')
  //     .orderBy('createdDate', 'asec')

  //   console.log(appWaitingCollection, 'ram fin')

  //   const collectionPromises =
  //     appWaitingCollection?.map(async collectionID => {
  //       const payload: ICollectionManagerActionPayload = {
  //         collectionID: collectionID.collectionID,
  //         transactionID: null,
  //         action,
  //         type,
  //       }
  //       return this.collectionManagerAction(payload, userID)
  //     }) || []

  //   const transactionPromises =
  //     transactionIDs?.map(async id => {
  //       const payload: ICollectionManagerActionPayload = {
  //         collectionID: null,
  //         transactionID: id,
  //         action,
  //         type,
  //       }
  //       return this.collectionManagerAction(payload, userID)
  //     }) || []

  //   const results = await Promise.all([...collectionPromises, ...transactionPromises])

  //   return this.serviceResponse(HttpStatusCode.Ok, results, 'Success')
  // }

  async approvedCollectionUpdate(
    leadID: number,
    collectionID: number,
    collectedAmount: number,
    status: CollectionStatus,
    collectedDate: Date,
    discountAmount: number,
    settlementAmount: number,
  ) {
    const repaymentData = await this.loanService.calculateRepayAmountIpcV2(leadID, collectedDate)

    let {
      totalPayableAmount,
      dpdCharges,
      totalInterest: totalInt,
      principalAmount: principle,
    } = repaymentData

    let collectedInterest = 0
    let collectedPrinciple = 0
    let collectedPenalty = 0

    let repayAmount = totalPayableAmount
    let penaltyCharges = dpdCharges
    let totalInterest = totalInt
    let principalAmount = principle
    let actualTotalInterest = totalInt
    let actualPenaltyCharge = penaltyCharges

    let excessAmount = 0
    let openingBalance = null
    let closingBalance = null
    let checkPrincipal = false
    let principleAmountOver = 0

    if (repayAmount > collectedAmount && status === CollectionStatus.CLOSED) {
      return { success: false, repaymentData }
    }

    switch (status) {
      case CollectionStatus.CLOSED:
        excessAmount = collectedAmount - repayAmount
        openingBalance = repayAmount
        closingBalance = 0
        collectedInterest = totalInterest
        collectedPrinciple = principalAmount
        collectedPenalty = penaltyCharges
        principalAmount = 0
        if (collectedAmount - repayAmount >= 0) {
          penaltyCharges = 0
          totalInterest = 0
        }

        break

      case CollectionStatus.PART_PAYMENT:
        openingBalance = repayAmount
        closingBalance = 0

        if (repayAmount === collectedAmount) {
          status = CollectionStatus.CLOSED
          collectedInterest = totalInterest
          collectedPrinciple = principalAmount
          collectedPenalty = penaltyCharges
          principalAmount = 0
          totalInterest = 0
          penaltyCharges = 0
        } else if (repayAmount < collectedAmount) {
          excessAmount = collectedAmount - repayAmount > 0 ? collectedAmount - repayAmount : 0
          status = CollectionStatus.CLOSED
          collectedInterest = totalInterest
          collectedPrinciple = principalAmount
          collectedPenalty = penaltyCharges
          principalAmount = 0
          totalInterest = 0
          penaltyCharges = 0
        } else {
          closingBalance = repayAmount - collectedAmount
          if (collectedAmount > totalInterest) {
            if (totalInterest === 0 && collectedAmount >= principalAmount) {
              collectedPrinciple = principalAmount
            } else if (totalInterest === 0 && collectedAmount < principalAmount) {
              collectedPrinciple = collectedAmount
            } else {
              collectedPrinciple = collectedAmount - totalInterest
              if (collectedAmount > principalAmount + totalInterest) {
                checkPrincipal = true
                principleAmountOver = principalAmount
              }
            }
            totalInterest = 0
            principalAmount -= collectedPrinciple
            collectedInterest = actualTotalInterest - totalInterest
            if (principalAmount < 0) {
              penaltyCharges += principalAmount
              principalAmount = 0
              if (penaltyCharges < 0) {
                penaltyCharges = 0
              }
            } else {
              penaltyCharges =
                actualPenaltyCharge - (collectedAmount - collectedPrinciple - collectedInterest) > 0
                  ? actualPenaltyCharge - (collectedAmount - collectedPrinciple - collectedInterest)
                  : 0.0
            }

            if (checkPrincipal === true) {
              collectedPrinciple = principleAmountOver
              principalAmount = 0
            }
            collectedInterest = actualTotalInterest - totalInterest
            collectedPenalty =
              actualPenaltyCharge - penaltyCharges > 0 ? actualPenaltyCharge - penaltyCharges : 0.0

            if (collectedInterest === 0 && collectedPrinciple === 0) {
              collectedPenalty = collectedAmount
              penaltyCharges = actualPenaltyCharge - collectedPenalty
            }
          } else {
            totalInterest -= collectedAmount
            collectedInterest = actualTotalInterest - totalInterest
          }
        }
        break

      case CollectionStatus.SETTLEMENT:
        closingBalance = repayAmount - collectedAmount
        if (collectedAmount > totalInterest) {
          if (totalInterest === 0 && collectedAmount >= principalAmount) {
            collectedPrinciple = principalAmount
          } else if (totalInterest === 0 && collectedAmount < principalAmount) {
            collectedPrinciple = collectedAmount
          } else {
            collectedPrinciple = collectedAmount - totalInterest

            if (collectedAmount > principalAmount + totalInterest) {
              checkPrincipal = true
              principleAmountOver = principalAmount
            }
          }

          totalInterest = 0
          principalAmount -= collectedPrinciple
          if (principalAmount < 0) {
            penaltyCharges += principalAmount
            principalAmount = 0
            if (penaltyCharges < 0) {
              penaltyCharges = 0
            }
          } else {
            penaltyCharges = actualPenaltyCharge
          }

          if (checkPrincipal === true) {
            principalAmount = principleAmountOver
            principalAmount = 0
          }

          collectedInterest = actualTotalInterest - totalInterest
          collectedPenalty = actualPenaltyCharge - penaltyCharges

          if (collectedInterest === 0 && collectedPrinciple === 0) {
            collectedPenalty = collectedAmount
            penaltyCharges = actualPenaltyCharge - collectedPenalty
          }
        } else {
          totalInterest -= collectedAmount
          collectedInterest = actualTotalInterest - totalInterest
        }
        break
    }

    const data: InsertData<ICollection> = {
      discountAmount,
      settlemenAmount: settlementAmount,
      status,
      excess_amount: excessAmount.toFixed(2),
      opening_balance: openingBalance,
      closing_balance: closingBalance,
      total_interest: totalInterest ?? null,
      principal_amount: principalAmount ?? null,
      penality_charge: penaltyCharges ?? null,
      collected_interest: collectedInterest ?? null,
      collected_principal: collectedPrinciple ?? null,
      collected_penality: collectedPenalty ?? null,
      updated_date: null,
    }

    const collectDate = momentTz(collectedDate).startOf('day')
    const currentDate = momentTz(new Date()).startOf('day')

    if (collectDate.format('YYYY-MM-DD') !== currentDate.format('YYYY-MM-DD')) {
      data.updated_date = currentDate.format('YYYY-MM-DD HH:mm:ss') as unknown as Date
    }

    await Promise.all([
      this.collectionModel.findOneAndUpdate(
        {
          collectionID,
        },
        data,
      ),
      this.transactionModel.findOneAndUpdate(
        {
          collectionID,
        },
        { status: 2 },
      ),
    ])

    return { success: true, repaymentData }
  }

  private async checkFilterForPendingCollection(
    search_by,
    customer_search,
    start_date,
    end_date,
    query,
    dpd,
    today,
    collection,
  ) {
    if (search_by && customer_search) {
      query = query.where(builder => {
        builder.where(`customer.${search_by}`, 'like', `%${customer_search}%`)
      })
    }

    if (dpd) {
      const getdpd = Number(dpd)

      if (dpd === '' || dpd === undefined || dpd === null) {
      } else {
        const dateRanges: { [key: number]: [string, string] } = {
          1: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], ''],
          2: [
            new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ],
          3: [
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ],
          4: [
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ],
          5: [
            new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ],
          6: [
            new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() - 61 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ],
          7: [
            new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ],
          8: [
            new Date(Date.now() - 181 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ],
        }

        const [startDate, endDate] = dateRanges[getdpd] || []
        if (startDate && endDate) {
          if (collection === 'payday') {
            query = query.whereBetween('approval.repayDate', [startDate, endDate])
          } else if (collection === 'emi') {
            query = query.whereBetween('dueDate', [startDate, endDate])
          }
        }
      }
    } else if (start_date || end_date) {
      const start = start_date ? new Date(start_date).toISOString() : today
      const end = end_date ? new Date(end_date).toISOString() : today
      if (collection === 'payday') {
        query = query.whereBetween('approval.repayDate', [start, end])
      } else if (collection === 'emi') {
        query = query.whereBetween('emi.dueDate', [start, end])
      }
    }

    return query
  }

  private async checkFilterForCollectionReport(
    search_by,
    start_date,
    end_date,
    customer_search,
    lead_id,
    lead_case,
    employment_type,
    salary_mode,
    monthly_income,
    city,
    state,
    query,
  ) {
    if (start_date || end_date) {
      const startDate = moment(start_date || new Date()).format('YYYY-MM-DD 00:00:00')
      const endDate = moment(end_date || new Date()).format('YYYY-MM-DD 23:59:59')
      query = query.whereBetween('leads.createdDate', [startDate, endDate])
    }
    if (employment_type) {
      query = query.where('customer.employeeType', employment_type)
    }
    if (lead_id) {
      query = query.where('leads.leadID', lead_id)
    }
    if (salary_mode) {
      query = query.where('leads.salaryMode', salary_mode)
    }
    if (city) {
      query = query.where('leads.city', city)
    }
    if (state) {
      query = query.where('leads.state', state)
    }
    if (lead_case) {
      query = query.where('leads.fbLeads', lead_case)
    }
    if (monthly_income !== undefined && monthly_income !== null && monthly_income !== '') {
      const incomeCategory = Number(monthly_income)

      switch (incomeCategory) {
        case 1:
          query = query.where('leads.monthlyIncome', '<', 28000)
          break
        case 2:
          query = query.whereBetween('leads.monthlyIncome', [28000, 60000])
          break
        case 3:
          query = query.where('leads.monthlyIncome', '>', 60000)
          break
      }
    }

    if (search_by && customer_search) {
      query = query.where(builder => {
        builder.where(`customer.${search_by}`, 'like', `%${customer_search}%`)
      })
    }
    return query
  }

  async changePaymentMode(payload: IChangePaymentMode) {
    const {
      leadID,
      customerID,
      referenceNo,
      pId,
      loanNo,
      collectedMode,
      loanType,
      remark,
      status,
      userID,
    } = payload
    const db = getKnexInstance()
    if (loanType === 'payDay') {
      //discuss witth pappu sir
      if (remark && remark.trim()) {
        throw new BadRequestError('Only manual case is applicable.')
      }
      const collection = await this.collectionModel.findOneCollection(
        {
          collectionID: pId,
        },
        ['*'],
      )
      if (!collection) {
        throw new NotFoundError('The collection does not exist.')
      }
      const transaction = await this.transactionModel.find({
        where: { leadID: leadID, customerID: customerID, collectionID: pId },
      })

      if (transaction.length > 1) {
        throw new BadRequestError(
          'Getting duplicate transactions records based on leadID, customerID and collectionID.',
        )
      }

      const collectionUpdate = await db('collection')
        .where('collectionID', pId)
        .update({
          collectedMode: collectedMode === 'CASH' ? 'Cash' : collectedMode,
          referenceNo,
        })
      const transactionUpdate = await db('transactions')
        .where({ leadID, customerID, collectionID: pId })
        .update({ mode: collectedMode, referenceNo })
      if (collectionUpdate && transactionUpdate) {
        await db('callhistoryLogs').insert({
          customerID,
          leadID,
          callType: loanType,
          status,
          appAmount: 0,
          noteli: 'Payment Mode Update',
          remark: 'Payment Mode Update',
          callbackTime: new Date().toISOString().split('T')[0],
          calledBy: userID,
          createdDate: new Date(),
        })
        return this.serviceResponse(
          HttpStatusCode.Ok,
          {},
          'Payment mode and reference number have been updated successfully.',
        )
      }
    } else {
      if (![2, 3].includes(status)) {
        throw new BadRequestError(
          'Only transactions with a status of Pending or Approved are allowed',
        )
      }

      const transaction = await db('transactions').where('id', pId).first()
      if (!transaction) {
        throw new NotFoundError('The transaction does not exist.')
      }

      const transactionUpdate = await db('transactions').where('id', pId).update({
        mode: collectedMode,
        referenceNo,
      })
      if (transactionUpdate) {
        let statusLabel = ''
        switch (status) {
          case 1:
            statusLabel = 'Captured'
            break
          case 2:
            statusLabel = 'Pending'
            break
          case 3:
            statusLabel = 'Approved'
            break
          case 4:
            statusLabel = 'Rejected'
            break
          default:
            statusLabel = 'Failed'
            break
        }

        await db('callhistoryLogs').insert({
          customerID,
          leadID,
          callType: loanType,
          status: statusLabel,
          appAmount: '',
          noteli: 'Payment Mode Update',
          remark: 'Payment Mode Update',
          callbackTime: new Date().toISOString().split('T')[0],
          calledBy: userID,
          createdDate: new Date(),
        })
        return this.serviceResponse(
          HttpStatusCode.Ok,
          {},
          'Payment mode and reference number have been updated successfully.',
        )
      }
    }
  }
}

export default CollectionService
