import config from '@/config/default'
// import { IWhereData } from '@/interfaces/customerDnd.interface'
import { logger } from '@/utils/logger'
import { HttpStatusCode } from 'axios'
import crypto from 'crypto'
import moment from 'moment-timezone'
import path from 'path'
import { apiReqResLogsModel } from '../database/mysql/apiReqResLog'
import { customerModel } from '../database/mysql/customer'
import { customerDndModel } from '../database/mysql/customerDnd'
import { leadModel } from '../database/mysql/leads'
import { loanModel } from '../database/mysql/loan'
import OldCrmUsersCheckModel from '../database/mysql/OldCrmUsersCheck'
import { sourcePartnerModel } from '../database/mysql/sourcePartners'
import { BadRequestError, NotFoundError, PreconditionError, UnprocessableEntity } from '../errors'
import CommonHelper from '../helpers/common'
import { IApiReqResLog } from '../interfaces/apiReqResLog.interface'
import { IPagination } from '../interfaces/common.interface'
import {
  ICustomer,
  ICustomerPayload,
  ICustomerUpdatePayload,
  IGlobalSearchPayload,
  ISourcePartnerPayload,
  TSelectCustomer,
} from '../interfaces/customer.interface'
import {
  IDateRange,
  IDeleteDndPayload,
  IGetDndPayload,
  ISetDndPayload,
  IUpdateDndPayload,
  IWhereData,
} from '../interfaces/customerDnd.interface'
import { IEmiReCalculationResponse } from '../interfaces/emi.interface'
import { ILead } from '../interfaces/lead.interface'
import { ILoan } from '../interfaces/loan.interface'
import { INewApiCheckCustomer, INewApiCheckCustomerBody } from '../interfaces/onboarding.interface'
import { IServiceResponse } from '../interfaces/service.interface'
import { ISourcePartner } from '../interfaces/sourcePartner.interface'
import { ITransaction } from '../interfaces/transactions.interface'
import ResponseService from '../services/response.service'
import { SelectFields, SortCriteria, UpdateQuery, WhereQuery } from '../types/model.types'
import { getKnexInstance } from '../utils/mysql'
import { calculateTotalPages } from '../utils/util'
import AxiosService from './api.service'
import EmiCollectionService from './emiCollection.service'
import S3Service from './thirdParty/s3.service'
class CustomerService extends ResponseService {
  private readonly customerModel = customerModel
  private readonly apiReqResLogsModel = apiReqResLogsModel
  private readonly customerDndModel = customerDndModel
  private readonly leadModel = leadModel
  private readonly loanModel = loanModel
  private readonly sourcePartnerModel = sourcePartnerModel
  private readonly s3Service = new S3Service()
  private readonly emiCollectionService = new EmiCollectionService()
  private commonHelper = new CommonHelper()
  private oldCrmUsersCheckModel = new OldCrmUsersCheckModel()

  constructor() {
    super()
  }

  getApiLogs = async (customerID: number, paginate: IPagination) => {
    const customer = await this.customerModel.findOneCustomer({ customerID }, [
      'customerID',
      'mobile',
    ])

    if (!customer) throw new NotFoundError('Customer not found')

    const [apiLogs, apiLogCount] = await Promise.all([
      this.apiReqResLogsModel.find({
        where: { mobile: String(customer.mobile) },
        select: ['api_name', 'created_at', 'status', 'id'],
        paginate: { page: paginate.skip, perPage: paginate.take },
        order: [{ column: 'id', order: 'desc' }],
      }),
      this.apiReqResLogsModel.count({
        mobile: String(customer.mobile),
      }),
    ])

    const totalPages = calculateTotalPages(apiLogCount, paginate.take)

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        apiLogs,
        totalRecords: apiLogCount,
        totalPages,
      },
      'Fetched',
    )
  }

  getApiLog = async (customerID: number, id: number, selectFields?: Record<string, string>) => {
    const customer = await this.customerModel.findOneCustomer({ customerID }, ['customerID'])

    if (!customer) throw new NotFoundError('Customer not found')

    let select: SelectFields<keyof IApiReqResLog> = []

    if (selectFields && selectFields.request) {
      select.push('api_request')
    }

    if (selectFields && selectFields.response) {
      select.push('api_response')
    }

    if (Object.keys(selectFields).length === 0) {
      select = ['*']
    }

    const apiLog = await this.apiReqResLogsModel.findOne({
      where: { customerID: String(customerID), id },
      select,
    })

    if (!apiLog) throw new NotFoundError('Log not found')

    if (apiLog.api_request) {
      apiLog.api_request = JSON.parse(apiLog.api_request)
    }

    if (apiLog.api_response) {
      apiLog.api_response = JSON.parse(apiLog.api_response)
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        apiLog,
      },
      'Fetched',
    )
  }

  async createDND(payload: ISetDndPayload): Promise<IServiceResponse> {
    const { name, mobile, pancard, reason, start_date, expiry_date, updated_by } = payload

    let customer = await this.customerModel.findOneCustomer(
      { name: name.trim(), mobile, pancard },
      ['*'],
    )
    if (!customer) {
      throw new PreconditionError('Customer not found from this name ,mobile and pancard')
    }

    const customerDnd = await this.customerDndModel.insert({
      customerID: customer.customerID,
      name: name.trim(),
      mobile: mobile,
      pancard: pancard,
      reason: reason.trim(),
      start_date: start_date,
      expiry_date: expiry_date,
      updated_by: updated_by,
    })
    if (!customerDnd) {
      throw new UnprocessableEntity('Customer DND created failed')
    }

    return this.serviceResponse(200, { customerDnd }, 'Customer DND created successfully.')
  }

  async getDND(payload: IGetDndPayload, skip: number, take: number): Promise<IServiceResponse> {
    const { name, mobile, reason, start_date, expiry_date, is_deleted, isExcelDownload } = payload

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    if (mobile) {
      let customer = await this.customerModel.findOneCustomer({ mobile }, ['customerID'])
      if (!customer) {
        throw new NotFoundError('Customer not found from this mobile.')
      }
    }
    let whereData: IWhereData = {}

    if (name != null && name.trim() !== '') whereData.name = name.trim()
    if (mobile != null && mobile !== undefined) whereData.mobile = mobile
    if (reason != null && reason !== undefined) whereData.reason = reason.trim()
    if (is_deleted != null && is_deleted !== undefined) whereData.is_deleted = is_deleted

    let dateRange: IDateRange = {}

    if (start_date != null) dateRange.start_date = start_date
    if (expiry_date != null) dateRange.expiry_date = expiry_date

    const todayDate = new Date().toISOString().split('T')[0]
    const db = getKnexInstance()

    const query = db('customer_dnd')
      .select(
        'customer_dnd.*',
        db.raw('updatedByCustomer.name AS updatedName'),
        db.raw('removedByCustomer.name AS removedName'),
      )
      .leftJoin('users AS updatedByCustomer', 'customer_dnd.updated_by', 'updatedByCustomer.userID')
      .leftJoin('users AS removedByCustomer', 'customer_dnd.removed_by', 'removedByCustomer.userID')
      .orderBy('id', 'desc')

    if (dateRange.start_date) {
      query.where('customer_dnd.start_date', '>=', dateRange.start_date)
    }
    if (dateRange.expiry_date) {
      query.where('customer_dnd.expiry_date', '<=', dateRange.expiry_date)
    }
    if (name) {
      query.where('customer_dnd.name', name)
    }
    if (mobile) {
      query.where('customer_dnd.mobile', mobile)
    }
    if (reason) {
      query.where('customer_dnd.reason', reason)
    }
    if (is_deleted) {
      query.where('customer_dnd.expiry_date', '>=', todayDate)
      query.where('customer_dnd.is_deleted', is_deleted)
    }

    let customerDnds

    const totalCountQuery = await query.clone().count('* as totalCount').first()
    if (isExcelDownload === 'true') {
      customerDnds = await query.clone()
    } else {
      customerDnds = await query.clone().limit(take).offset(skip)
    }

    let dndData = []

    if (customerDnds && customerDnds?.length > 0) {
      for (const [index, item] of customerDnds.entries()) {
        let customerName = await this.customerModel.findOneCustomer(
          { customerID: item.customerID },
          ['name'],
        )
        let dndRes = {
          id: item.id,
          customerID: item.customerID,
          name: customerName && customerName.name ? customerName.name : '',
          mobile: item.mobile,
          pancard: item.pancard,
          reason: item.reason,
          startDate: moment(item.start_date).format('Do MMM, YYYY'),
          expiryDate: moment(item.expiry_date).format('Do MMM, YYYY'),
          startDateDefaut: moment(item.start_date).format('YYYY-MM-DD'),
          expiryDateDefaut: moment(item.expiry_date).format('YYYY-MM-DD'),
          updatedBy: item.updated_by,
          updatedName: item.updatedName,
          isDeleted: item.is_deleted,
          removedBy: item.removed_by,
          removedName: item.removedName,
        }
        dndData.push(dndRes)
      }
    }

    const dndRecords = {
      dndData: dndData,
      totalCount: totalCountQuery.totalCount,
      totalPages: Math.ceil(totalCountQuery.totalCount / take),
    }

    return this.serviceResponse(200, dndRecords, 'Customer DND data retreived successfully.')
  }

  public async findOne(
    where: WhereQuery<ICustomer>,
    select: SelectFields<TSelectCustomer> = ['*'],
    order?: SortCriteria<TSelectCustomer>,
  ): Promise<ICustomer> {
    return await this.customerModel.findOneCustomer(where, select, order)
  }

  async deleteDND(payload: IDeleteDndPayload): Promise<IServiceResponse> {
    const { customerID, removed_by } = payload

    let customerDnd = await this.customerDndModel.findOne({ customerID }, ['id', 'name'])
    if (!customerDnd) {
      throw new PreconditionError('This DND Customer not found.')
    }
    const customerDndDelete = await this.customerDndModel.findOneAndUpdate(
      { customerID },
      {
        is_deleted: '1',
        removed_by: removed_by,
      },
    )
    if (!customerDndDelete) {
      throw new UnprocessableEntity('Customer DND deleted failed')
    }

    return this.serviceResponse(200, { customerDnd }, 'Customer DND deleted successfully.')
  }

  async search(payload: IGlobalSearchPayload) {
    const { aadharNo, customerID, email, leadID, loanNo, mobile, name, pan } = payload

    let data = {}
    let whereQuery: WhereQuery<ICustomer> = {}

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    const customerQuery = this.customerModel.CustomerKnex.select(
      'customer.mobile',
      'customer.name',
      'l.leadID',
    )
      .join('leads as l', 'customer.customerID', 'l.customerID')
      .max('l.leadID as leadID')
      .groupBy('customer.mobile', 'customer.name')
      .orderBy('l.leadID', 'desc')
      .limit(10)

    // Customer table related data
    if (customerID) {
      customerQuery.where('customer.customerID', customerID)
    } else if (email) {
      whereQuery.email = email
    } else if (aadharNo) {
      whereQuery.aadharNo = aadharNo
    } else if (mobile) {
      whereQuery.mobile = mobile
    } else if (name) {
      whereQuery.name = name
    } else if (pan) {
      whereQuery.pancard = pan
    } else if (leadID) {
      data = await this.leadModel.LeadsKnex.select('c.mobile', 'c.name', 'leads.leadID')
        .join('customer as c', 'c.customerID', 'leads.customerID')
        .where({ leadID })
        .orderBy('leads.leadID', 'desc')
        .limit(10)
    } else if (loanNo) {
      data = await this.loanModel.LoanKnex.select('c.mobile', 'c.name', 'l.leadID')
        .join('leads as l', 'loan.leadID', 'l.leadID')
        .join('customer as c', 'l.customerID', 'c.customerID')
        .where({ loanNo })
        .orderBy('l.leadID', 'desc')
        .limit(10)
    }

    if (!loanNo && !leadID) {
      if (Object.keys(whereQuery).length > 0) {
        data = await customerQuery.where(whereQuery)
      } else {
        data = await customerQuery
      }
    }

    await getKnexInstance().raw("SET sql_mode = CONCAT(@@sql_mode, ',ONLY_FULL_GROUP_BY')")

    return this.serviceResponse(HttpStatusCode.Ok, data, 'Success')
  }

  async getCustomerList(
    payload: ICustomerPayload,
    page: number,
    perPage: number,
  ): Promise<IServiceResponse> {
    const { search_by, customer_search } = payload

    let whereQuery: WhereQuery<ICustomer> = {}

    if (search_by && customer_search) {
      switch (search_by) {
        case 'name':
          whereQuery = (qb) => {
            qb.whereRaw('name LIKE ?', [`%${customer_search}%`])
          }
          break
        case 'email':
          whereQuery = (qb) => {
            qb.whereRaw('email LIKE ?', [`%${customer_search}%`])
          }
          break
        case 'mobile':
          whereQuery = { mobile: parseInt(customer_search) }
          break
        case 'pancard':
          whereQuery = (qb) => {
            qb.whereRaw('pancard LIKE ?', [`%${customer_search}%`])
          }
          break
        case 'aadharNo':
          whereQuery = { aadharNo: parseInt(customer_search) }
          break
      }
    }
    const [customerData, totalCount] = await Promise.all([
      this.customerModel.find({
        where: whereQuery,
        select: [
          'customerID',
          'name',
          'email',
          'mobile',
          'pancard',
          'aadharNo',
          'createdDate',
          'gender',
          'dob',
        ],
        paginate: { perPage, page },
      }),
      this.customerModel.count({ where: whereQuery }),
    ])

    const data = {
      totalRows: totalCount,
      totalPages: calculateTotalPages(totalCount, perPage),
      table: customerData,
    }
    return this.serviceResponse(200, data, 'Fetch Customer Data Successfully...')
  }

  async updateCustomerDetails(payload: ICustomerUpdatePayload) {
    const { customerID, firstName, mobile, email, gender, dob, aadharno, pancard } = payload
    let customer = await this.customerModel.findOneCustomer({ customerID })
    if (!customer) {
      throw new PreconditionError('Customer not found.')
    }
    const customerUpdate = await this.customerModel.findOneAndUpdate(
      { customerID },
      {
        firstName: firstName,
        mobile: mobile,
        email: email,
        gender: gender as 'Male' | 'Female' | 'NA',
        dob: dob,
        aadharNo: aadharno,
        pancard: pancard,
      },
    )
    if (!customerUpdate) {
      throw new UnprocessableEntity('Customer Updation failed')
    }
    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Customer Updated Successfully...')
  }

  async editDND(payload: IUpdateDndPayload): Promise<IServiceResponse> {
    const { id, expiry_date, updated_by } = payload
    const customerDnd = await this.customerDndModel.findOneAndUpdate(
      { id },
      { expiry_date: expiry_date, updated_by: updated_by },
    )

    if (!customerDnd) {
      throw new UnprocessableEntity('Customer DND updated failed')
    }

    return this.serviceResponse(200, { customerDnd }, 'Customer DND updated successfully.')
  }

  async setSourcePartner(payload: ISourcePartnerPayload): Promise<IServiceResponse> {
    const { image, name, link, userID } = payload

    const s3FolderName = `documents/sourcePartnerImages/${userID}`
    const extension = path.extname(image?.originalname).toLowerCase()
    const imageName = `image_${Date.now()}${extension}`
    const uploadRes = await this.s3Service.uploadDocument(image.buffer, s3FolderName, imageName)
    if (!uploadRes) {
      return this.serviceResponse(500, {}, 'An error occurred while storing the file in S3.')
    }
    let response = {}
    if (uploadRes && uploadRes?.Key !== null && uploadRes.Key !== '') {
      response = await this.sourcePartnerModel.insert({
        image: uploadRes.Key,
        name: name,
        link: link,
      })
    } else {
      return this.serviceResponse(500, {}, 'An error occurred while storing the file in S3.')
    }
    return this.serviceResponse(200, response, 'SourcePartner data inserted successfully.')
  }

  async editSourcePartner(payload: ISourcePartnerPayload): Promise<IServiceResponse> {
    const { id, image, name, link, status, userID } = payload

    const updateData: any = {}

    if (image) {
      const s3FolderName = `documents/sourcePartnerImages/${userID}`
      const extension = path.extname(image.originalname).toLowerCase()
      const imageName = `image_${Date.now()}${extension}`

      const uploadRes = await this.s3Service.uploadDocument(image.buffer, s3FolderName, imageName)

      if (!uploadRes) {
        return this.serviceResponse(500, {}, 'An error occurred while storing the file in S3.')
      }

      if (uploadRes && uploadRes.Key) {
        updateData.image = uploadRes.Key as any
      }
    }

    if (name) updateData.name = name
    if (link) updateData.link = link
    if (status) updateData.status = status

    if (Object.keys(updateData).length === 0) {
      return this.serviceResponse(400, {}, 'No valid fields provided for update.')
    }

    const response = await this.sourcePartnerModel.findOneAndUpdate({ id }, updateData)

    if (!response) {
      return this.serviceResponse(500, {}, 'SourcePartner not found.')
    }

    return this.serviceResponse(200, { response }, 'SourcePartner data updated successfully.')
  }

  async getSourcePartner(
    payload: ISourcePartnerPayload,
    page: number,
    perPage: number,
  ): Promise<IServiceResponse> {
    const { name, link, status } = payload

    let whereQuery: WhereQuery<ISourcePartner> = {}

    if (name) {
      whereQuery.name = name
    } else if (link) {
      whereQuery.link = link
    } else if (status) {
      whereQuery.status = status
    }

    const [SourcePartnerData, totalCount] = await Promise.all([
      this.sourcePartnerModel.find({
        where: whereQuery,
        select: ['*'],
        paginate: { perPage, page },
      }),
      this.sourcePartnerModel.count({ where: whereQuery }),
    ])

    const data = {
      totalRows: totalCount,
      totalPages: calculateTotalPages(totalCount, perPage),
      records: SourcePartnerData,
    }
    return this.serviceResponse(200, data, 'Fetch SourcePartner Data Successfully...')
  }

  public async updateOne(
    where: WhereQuery<ICustomer>,
    update: UpdateQuery<ICustomer>,
  ): Promise<number> {
    return await this.customerModel.findOneAndUpdate(where, update)
  }

  // public updateEMIManualPayment = async (
  //   transaction: ITransaction,
  //   credit: any,
  //   loan: ILoan,
  //   lead: ILead,
  //   settle: boolean,
  //   emis: IEmiReCalculationResponse[],
  //   resultEmis: { [key in string]: IEmiReCalculationResponse },
  //   // repaymentData: any,
  // ): Promise<{ [key in string]: IEmiReCalculationResponse }> => {
  //   try {
  //     const baseUrl = this.commonHelper.getCrossPlatformBaseUrl()

  //     const apiCall = new AxiosService(baseUrl)

  //     const body = {
  //       pancard: pancard,
  //     }
  //     const url = config.checkCustomers

  //     const apiData = await apiCall.call<INewApiCheckCustomer, INewApiCheckCustomerBody, undefined>(
  //       'post',
  //       `/${url}`,
  //       body,
  //       undefined,
  //       {
  //         'Content-Type': 'application/json',
  //         Authorization: `Basic ${config.phpCrossPlatformKey}`,
  //       },
  //     )
  //     if (!apiData.data) {
  //       return apiData
  //     }

  //     const response = apiData.data

  //     if (!('checkLeadType' in response) || !('checkCurrentStatus' in response)) {
  //       return {
  //         leadstatus: '',
  //         action: 1,
  //       }
  //     }

  //     let action = 1
  //     response['newloanAmount'] = response['loanAmount']

  //     const returnData = {
  //       casetype: response['checkLeadType'],
  //       leadstatus: response['checkCurrentStatus'],
  //       action: action,
  //     }

  //     if (response['isRamfinCustomer'] == 'Yes') {
  //       const nonActionableStatuses = [
  //         'Approved',
  //         'Hold',
  //         'Disbursal Sheet Send',
  //         'Disbursed',
  //         'Part Payment',
  //         'Settlement',
  //         'Rejected',
  //         'Bank Update Rejected',
  //         'Approved Process',
  //         'Hold Process',
  //         'Blacklisted',
  //         'Disbursal Approved',
  //         'Bank Update Hold',
  //         'Document Received',
  //       ]

  //       if (nonActionableStatuses.includes(response['checkCurrentStatus'])) {
  //         action = 0
  //       }
  //     }

  //     await this.oldCrmUsersCheckModel.insert({
  //       endPoint_url: url,
  //       pancard: pancard,
  //       response: JSON.stringify(response),
  //       checks_response: JSON.stringify(returnData),
  //       createdDate: new Date(),
  //     })

  //     returnData['action'] = action

  //     return action
  //   } catch (error) {
  //     logger.error('Error in checkCustomerStatusPhpApi:', error)
  //     console.error('Error in checkCustomerStatusPhpApi:', error)
  //   }
  // }

  public updateEMIManualPayment = async (
    transaction: ITransaction,
    credit: any,
    // loan: ILoan,
    // lead: ILead,
    settle: boolean,
    emis: IEmiReCalculationResponse[],
    resultEmis: { [key in string]: IEmiReCalculationResponse },
    // repaymentData: any,
  ): Promise<{ [key in string]: IEmiReCalculationResponse }> => {
    try {
      if (!transaction) throw new BadRequestError('Transaction details are required')
      // Payment details initialization
      let transactionDetails = {
        amount: null,
        transactionDate: null,
        id: null,
        order_id: null,
        waiver: null,
        discount_type: null,
      }
      // Excess Amount
      let excessAmount = 0 as number
      // Handle different transaction statuses
      if (transaction.payment_transaction_status === 'collect_overdue_emi') {
        //update transaction details for overdue EMI
        transactionDetails = {
          amount: Number(transaction.amount) || 0,
          transactionDate: transaction.transactionDate ?? moment().startOf('day'),
          id: transaction.id,
          order_id: transaction.orderId,
          waiver: transaction.waiver || 0,
          discount_type: transaction.discount_type || null,
        }
        // Process manual payment for overdue EMI
        await this.emiCollectionService.processManualPayment(
          transactionDetails,
          excessAmount,
          credit,
          emis,
          resultEmis,
        )
      } else if (transaction.payment_transaction_status === 'collect_final_settlement') {
        transactionDetails = {
          amount: Number(transaction.amount) || 0,
          transactionDate: transaction.transactionDate ?? moment().startOf('day'),
          id: transaction.id,
          order_id: transaction.orderId,
          waiver: transaction.waiver || 0,
          discount_type: transaction.discount_type || null,
        }
        resultEmis = await this.emiCollectionService.manageManualPayment(
          transactionDetails,
          resultEmis,
          credit,
          excessAmount,
          settle,
        )
      }
      // Return success response
      return resultEmis
    } catch (error) {
      console.error('Error updating EMI manual payment:', error)
    }
  }

  public async findCustomerInputData(leadID: number) {
    const knex = getKnexInstance()

    // Remove ONLY_FULL_GROUP_BY (if needed)
    await knex.raw("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))")

    const result = await knex('leads as l')
      .join('customer as c', 'l.customerID', 'c.customerID')
      .join('address as ad', function () {
        this.on('l.customerID', '=', 'ad.customerID').andOn(
          'ad.addressID',
          '=',
          knex.raw('(SELECT MAX(addressID) FROM address WHERE customerID = l.customerID)'),
        )
      })
      .whereIn('l.status', ['Fresh Lead', 'Document Received'])
      .andWhere('l.leadID', leadID)
      .orderBy('l.leadID', 'desc')
      .select([
        'c.customerID',
        'c.firstName',
        'c.middlename',
        'c.lastName',
        'c.gender',
        'c.pancard',
        'c.dob',
        'c.mobile',
        'c.email',
        'l.leadID',
        'l.monthlyIncome',
        'l.salaryMode',
        'ad.address',
        'ad.city',
        'ad.state',
        'ad.pincode',
        knex.raw(`(
          SELECT GROUP_CONCAT(employerName ORDER BY employerID DESC)
          FROM employer
          WHERE customerID = c.customerID
        ) AS employer_list`),
      ])
      .groupBy([
        'c.customerID',
        'c.firstName',
        'c.middlename',
        'c.lastName',
        'c.gender',
        'c.pancard',
        'c.dob',
        'c.mobile',
        'c.email',
        'l.leadID',
        'l.monthlyIncome',
        'l.salaryMode',
        'ad.address',
        'ad.city',
        'ad.state',
        'ad.pincode',
      ])
      .first()

    return result
  }

  public async insertAndUpdateCustomerToken(customerID: number): Promise<string> {
    try {
      const knex = getKnexInstance()

      const customerTokenRow = await knex('bureauCustomerToken')
        .where('customerID', customerID)
        .first()

      const now = new Date()
      const randomStr = await this.generateRandomString(24)
      const randomInt = Math.floor(100000 + Math.random() * 900000)
      const hash = crypto
        .createHash('sha256')
        .update(now.toISOString() + customerID + randomStr + randomInt)
        .digest('hex')

      if (!customerTokenRow) {
        await knex('bureauCustomerToken').insert({
          customerID,
          customerToken: hash,
          last_updated: now,
          created_at: now,
        })
      } else {
        await knex('bureauCustomerToken').where('customerID', customerID).update({
          customerToken: hash,
          last_updated: now,
        })
      }

      return hash
    } catch (error) {
      logger.error('Error in insertAndUpdateCustomerToken:', error)
      throw new Error('Error in insertAndUpdateCustomerToken')
    }
  }

  public async generateRandomString(length: number = 10): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(crypto.randomInt(0, charactersLength))
      result += characters[randomIndex]
    }

    return result
  }

  async checkCustomerStatusPhpApi(pancard: string) {
    const baseUrl = this.commonHelper.getCrossPlatformBaseUrl()
    const apiCall = new AxiosService(baseUrl)

    const body = {
      pancard: pancard,
    }

    const apiData = await apiCall.call<INewApiCheckCustomer, INewApiCheckCustomerBody, undefined>(
      'post',
      `/${config.checkCustomers}`,
      body,
      undefined,
      {
        'Content-Type': 'application/json',
        Authorization: `Basic ${config.phpCrossPlatformKey}`,
      },
    )
    if (!apiData.data) {
      return apiData
    }

    let action = 1
    const response = apiData.data
    response['newloanAmount'] = response['loanAmount']

    const returnData = {
      casetype: response['checkLeadType'],
      leadstatus: response['checkCurrentStatus'],
      action: action,
    }

    if (response['isRamfinCustomer'] == 'Yes') {
      const nonActionableStatuses = [
        'Approved',
        'Hold',
        'Disbursal Sheet Send',
        'Disbursed',
        'Part Payment',
        'Settlement',
        'Rejected',
        'Bank Update Rejected',
        'Approved Process',
        'Hold Process',
        'Blacklisted',
        'Disbursal Approved',
        'Bank Update Hold',
        'Document Received',
      ]

      if (nonActionableStatuses.includes(response['checkCurrentStatus'])) {
        action = 0
      }
    }

    returnData['action'] = action

    return action
  }
}
export default CustomerService
export const customerService = new CustomerService()
