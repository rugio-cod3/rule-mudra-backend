import config from '@/config/default'
import axios, { HttpStatusCode } from 'axios'
import {
  addMonths,
  differenceInCalendarDays,
  differenceInDays,
  format,
  isWeekend,
  parseISO,
  subDays,
} from 'date-fns'
import ejs from 'ejs'
import { Knex } from 'knex'
import moment from 'moment-timezone'
import path from 'path'
import puppeteer from 'puppeteer'
import { Readable } from 'stream'
import { addressModel } from '../database/mysql/address'
import { approvalModel } from '../database/mysql/approval'
import { appVideoModel } from '../database/mysql/appVideo'
import { bankIfscModel } from '../database/mysql/bankIfsc'
import { bankUpdateCheckModel } from '../database/mysql/bankUpdateCheck'
import { blackListCustomerPancardModel } from '../database/mysql/blacklistCustomerPancard'
import { callHistorymodel } from '../database/mysql/callHistory'
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs'
import { collectionModel } from '../database/mysql/collection'
import { collectionFollowUpModel } from '../database/mysql/collectionFollowUp'
import { creditModel } from '../database/mysql/credit'
import { customerModel } from '../database/mysql/customer'
import { customerAccountModel } from '../database/mysql/customerAccount'
import { disbursalJobsModel } from '../database/mysql/disbursalJobs'
import { documentModel } from '../database/mysql/document'
import { emandateNotRequiredLogs } from '../database/mysql/emandateNotRequiredLogs'
import { employerModel } from '../database/mysql/employer'
import { finboxNameMatchModel } from '../database/mysql/finboxNameMatch'
import LeadApiLogModel, { leadsApiLogModel } from '../database/mysql/leadApiLogs'
import LeadModel from '../database/mysql/leads'
import { loanModel } from '../database/mysql/loan'
import { mobileTokenModel } from '../database/mysql/mobileToken'
import { noLoanFollowUpLogModel } from '../database/mysql/noLoanFollowUpLogs'
import { onlinePaymentModel } from '../database/mysql/onlinepayment'
import { paymentModeModel } from '../database/mysql/paymentMode'
import { paymentModeForBanksModel } from '../database/mysql/paymentModeForBanks'
import { pennyDropModel } from '../database/mysql/pennyDrop'
import { productModel } from '../database/mysql/product'
import { razorpayEmOrderModel } from '../database/mysql/razorpayEmOrder'
import { razorpayMandateModel } from '../database/mysql/razorpayMandate'
import { razorpayPayoutAccountsModel } from '../database/mysql/razorpayPayoutAccounts'
import { razorPayPayoutContactsModel } from '../database/mysql/razorpayPayoutContact'
import { razorpayPayoutDisbursedAmountModel } from '../database/mysql/razorpayPayoutDisbursedAmount'
import { referenceModel } from '../database/mysql/reference'
import { repayDateHolidaymodel } from '../database/mysql/repayDateHoliday'
import { stepControlModel } from '../database/mysql/stepControl'
import { stepTrackerModel } from '../database/mysql/stepTracker'
import TransactionModel from '../database/mysql/transactions'
import { userModel } from '../database/mysql/users'
import { virtualAccountModel } from '../database/mysql/virtualAccount'
import { whatsappMessageIdsModel } from '../database/mysql/whatsappMessageIds'
import { RAMFIN_WEBAPP_API } from '../enums/apis.enum'
import { ApprovalStatus } from '../enums/approvalStatus.enums'
import { CallType } from '../enums/callHistory.enum'
import { CollectedMode, CollectionStatus } from '../enums/collection.enum'
import { StepName } from '../enums/common.enum'
import { BankAccountStatus, BankAccountType } from '../enums/customerBankAccount.enum'
import { EmiStatus, ProductID } from '../enums/emi.enum'
import { LeadStatus } from '../enums/lead.enum'
import { ApiSupplierType, LeadLogApiType } from '../enums/leadApiLogs.enum'
import { LoanStatus } from '../enums/loan.enum'
import { NameMismatchType } from '../enums/logs'
import { PennyDropType, PennyStatus } from '../enums/pennyDrop.enum'
import { masterPermission } from '../enums/permission.enum'
import { Products } from '../enums/product.enum'
import { RazorPayContactType, RazorPayValidateStatus } from '../enums/razorpay.enum'
import { Roles } from '../enums/roles.enum'
import { TransactionGateway } from '../enums/transaction.enum'
import {
  AccessForbiddenError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../errors'
import { commonHelper } from '../helpers/common'
import { formatToIST, formatToISTDate, isHoliday } from '../helpers/date.helpers'
import { emiHelper } from '../helpers/emi.helpers'
import { IApproval } from '../interfaces/approval.interface'
import { IBlacklistCustomerPancard } from '../interfaces/blackListCustomerPancard.interface'
import { ICallHistoryModel } from '../interfaces/callHistory.interface'
import { ICallHistoryLog } from '../interfaces/callHistoryLogs.interface'
import { ICustomer } from '../interfaces/customer.interface'
import { ICustomerAccount } from '../interfaces/customerAccount.interface'
import { IEMIDoc } from '../interfaces/emidoc.interface'
import {
  IAddCollection,
  IAddCollectionFollowup,
  IAgainNoLoanFollowUpLogsSchema,
  IAgainNoLoanListPayload,
  IAllocateToMePayload,
  IAutoAllocation,
  IBankUpdateCheckPayload,
  IBankUpdatePayload,
  IChangeBlackListedOrWhiteListedStatus,
  IChangeLeadStatusFreshLead,
  IChangeLeadStatusToApproved,
  IChangeLeadStatusToApprovedProcess,
  IChangeRejectHoldStatuses,
  IChargeEmandatePayload,
  ICheckPennyDropPayload,
  ICollectionUpdateModelPayload,
  ICreateAddressPayload,
  ICreateEmploymentDetails,
  ICreditDetailPayload,
  ICreditListPayload,
  IDataCode,
  IDisbursalUpdatePayload,
  IEmiCollection,
  IGetAgainNoLoanFollowUpLogsQuery,
  ILead,
  ILeadPageNameFilter,
  ILeadProfilePayload,
  ILeadRefundUpdatePayload,
  IModifyEmiLoanDetailsPayload,
  IModifyLoanDetailsPayload,
  INameMismatch,
  INoDuesPayload,
  INoEligibleListPayload,
  IPincode,
  IReferenceDetailsPayload,
  IReferenceModel,
  IRepaymentDatePayload,
  ISanctionListPayload,
  ISummary,
  ITransactionDetail,
  IUnprocessedListPayload,
  TimeLineResponseDto,
  TSelectLead,
} from '../interfaces/lead.interface'
import { ILoan } from '../interfaces/loan.interface'
import {
  IRazorPayContactsRequest,
  IRazorPayCreateFundAccountRequest,
} from '../interfaces/razorpayPayoutAccounts.interface'
import { ICustomResponse } from '../interfaces/response.interface'
import { IServiceResponse } from '../interfaces/service.interface'
import { InsertData } from '../types/model.types'
import { getDifferenceInDays, isDateAfter } from '../utils/dateTimeFunction'
import { calculatePaydayAmountIPC } from '../utils/ipcCalculation'
import { logger } from '../utils/logger'
import { getKnexInstance } from '../utils/mysql'
import { notificationUtils } from '../utils/notification'
import RazorpayPG, { razorPayPayments } from '../utils/razorpayClient.utils'
import {
  calculateRepayDate,
  calculateTotalPages,
  convertRupeesToPaise,
  createLoanNumber,
  generatePennyDropId,
  generateRandomId,
  generateRandomNumber,
  permissionAuthorizer,
  roleAuthorizer,
  roundNumber,
} from '../utils/util'
import AxiosService from './api.service'
import { AutoAllocationService } from './autoAllocation'
import { creditService } from './credit.service'
import { crmService } from './crm.service'
import { csvDownloadService } from './csvDownload.service'
import { emiService } from './emi.service'
import { excelDownloadService } from './excelDownload.service'
import { loanService } from './loan.service'
import MobileTokenService from './mobileToken.service'
import NotificationService from './notification.service'
import ResponseService from './response.service'
import S3Service from './thirdParty/s3.service'
import { transactionService } from './transaction.service'
export class LeadService extends ResponseService {
  customerID: any
  leadID(arg0: string, leadID: any) {
    throw new Error('Method not implemented.')
  }
  private leadModel = new LeadModel()
  private readonly userModel = userModel
  private AllocationService = new AutoAllocationService()
  private readonly employerModel = employerModel
  private readonly approvalModel = approvalModel
  private readonly customerModel = customerModel
  private readonly addressModel = addressModel
  private readonly referenceModel = referenceModel
  private readonly razorpayMandateModel = razorpayMandateModel
  private readonly pennyDropModel = pennyDropModel
  private readonly emandateNotRequiredLogs = emandateNotRequiredLogs
  private readonly customerAccountModel = customerAccountModel
  private readonly razorPayPayments = razorPayPayments
  private readonly callHistoryLogsModel = callHistoryLogsModel
  private readonly razorpayEmOrderModel = razorpayEmOrderModel
  private readonly onlinePaymentModel = onlinePaymentModel
  private readonly loanModel = loanModel
  private readonly productModel = productModel
  private readonly bankIfscModel = bankIfscModel
  private readonly collectionModel = collectionModel
  private readonly loanService = loanService
  private readonly creditModel = creditModel
  private readonly emiService = emiService
  private readonly transactionModel = new TransactionModel()
  private readonly collectionFollowUpModel = collectionFollowUpModel
  private readonly razorpayPg = new RazorpayPG()
  private readonly virtualAccountModel = virtualAccountModel
  private readonly commonHelper = commonHelper
  private readonly creditService = creditService
  private readonly s3Service = new S3Service()
  private readonly documentModel = documentModel
  private readonly leadApiLogModel = new LeadApiLogModel()
  private mobileTokenService = new MobileTokenService()
  private readonly repayDateHolidaymodel = repayDateHolidaymodel
  private readonly mobileTokenModel = mobileTokenModel
  private readonly callHistoryModel = callHistorymodel
  private readonly stepControlModel = stepControlModel
  private readonly stepTrackerModel = stepTrackerModel
  private readonly blackListCustomerPancardModel = blackListCustomerPancardModel
  private readonly razorpayPayoutDisbursedAmountModel = razorpayPayoutDisbursedAmountModel
  private readonly disbursalJobsModel = disbursalJobsModel
  private readonly bankUpdateCheckModel = bankUpdateCheckModel
  private readonly razorPayPayoutContactsModel = razorPayPayoutContactsModel
  private readonly razorpayPayoutAccountsModel = razorpayPayoutAccountsModel
  private readonly transactionService = transactionService
  private readonly crmService = crmService
  private readonly finboxNameMatchModel = finboxNameMatchModel
  private readonly paymentModeModel = paymentModeModel
  private readonly paymentModeForBanksModel = paymentModeForBanksModel
  private readonly noLoanFollowUpLogModel = noLoanFollowUpLogModel
  private readonly appVideoModel = appVideoModel
  private readonly whatsappMessageIdsModel = whatsappMessageIdsModel
  private readonly csvDownloadService = csvDownloadService
  private notificationService = new NotificationService()
  private readonly emiHelper = emiHelper
  private readonly excelDownloadService = excelDownloadService

  async findOne(
    where: Partial<ILead>,
    select: TSelectLead[] | ['*'] = ['*'],
    order?: { column: TSelectLead; order: 'asc' | 'desc' }[],
  ): Promise<ILead> {
    let LeadData = await this.leadModel.findOneLead(where, select, order)
    // return this.serviceResponse(200, { LeadData }, 'Amount to be disbursed')
    return LeadData
  }

  public async find(
    whereConditions: { column: string; values: string[] | number[] }[],
    order: { orderKey: string; orderValue: string },
    select: string[],
    skip?: number,
    take?: number,
    leadStartDate?: string,
    leadEndDate?: string,
  ): Promise<ILead[] | ICustomResponse> {
    try {
      let leads = await this.leadModel.getLeadData(
        whereConditions,
        order,
        select,
        skip,
        take,
        leadStartDate,
        leadEndDate,
      )
      if (leads == null || leads.length == 0) {
        return null
      } else {
        return leads
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

  public async find_again_no_loan(
    whereConditions: { column: string; values: string[] | number[] }[],
    order: { orderKey: string; orderValue: string },
    select: string[],
    skip?: number,
    take?: number,
    leadStartDate?: string,
    leadEndDate?: string,
  ): Promise<ILead[] | ICustomResponse> {
    try {
      let leads = await this.leadModel.getAgainNoLoanLeadData(
        whereConditions,
        order,
        select,
        skip,
        take,
        leadStartDate,
        leadEndDate,
      )
      if (leads == null || leads.length == 0) {
        return null
      } else {
        return leads
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

  public async filterlist(payload: ILeadPageNameFilter): Promise<any | ICustomResponse> {
    const { pageName } = payload

    let status: string[] = []
    if (pageName === 'All Leads') {
      status = ['Fresh Lead', 'Callback', 'Interested', 'Not Interested']
    } else if (pageName === 'Sanction') {
      status = ['Approved Process', 'Rejected Process', 'Hold Process', 'Not Required Process']
    }

    let customerNameEmailMobile = ''
    let leadID = ''
    let leadStartDate = ''
    let leadEndDate = ''
    const caseType = ['New Case', 'Existing Case', 'Repeat Case']
    const employeeType = ['Salaried', 'Self Employee', 'Professional', 'Not Employed', 'NA']
    const device = ['iOS', 'Android']

    const db = getKnexInstance()

    // Fetch active users
    const activeUsers = await db('users').select('userID', 'name').where('status', 'Active')

    // Fetch unique UTM sources
    const utmSources = await db('leads').distinct('utmSource')

    // Construct the filter object
    const filter = {
      // customerNameEmailMobile,
      // leadID,
      status,
      caseType,
      employeeType,
      // leadStartDate,
      // leadEndDate,
      allocated: activeUsers,
      // utmSources,
      device,
    }

    return filter
  }

  public async autoallocation(payload: IAutoAllocation): Promise<any | ICustomResponse> {
    const { authUserID } = payload
    const db = getKnexInstance()

    // Fetch active user details
    const userDetails = await db('users')
      .where('status', 'Active')
      .where('userID', authUserID)
      .first()

    if (!userDetails) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404,
      } as ICustomResponse
    }

    try {
      const startDate = subDays(new Date(), 59)
      const formattedStartDate = format(startDate, 'yyyy-MM-dd')

      const leads = await this.AllocationService.assignLeadToUser(
        formattedStartDate,
        userDetails.userID,
        userDetails.name,
      )
      if (leads === 0) {
        return null
      } else {
        return leads
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

  // public async autoallocation(
  //   payload: IAutoAllocation
  // ): Promise<any | ICustomResponse> {
  //     const { authUserID } = payload;
  //     const db = getKnexInstance();

  //     // Fetch active users
  //     const userDetails = await db('users')
  //       .where('status', 'Active')
  //       .where('id', authUserID);

  //     try {
  //       const startDate = subDays(new Date(), 59);
  //       const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  //       let leads = await this.AllocationService.assignLeadToUser(formattedStartDate,userDetails);
  //       if (leads == null || leads.length == 0) {
  //         return null;
  //       } else {
  //         return leads;
  //       }
  //     } catch (error) {
  //       logger.error(error);
  //       return {
  //         success: false,
  //         message: 'Internal Server Error',
  //         statusCode: 500,
  //       } as ICustomResponse;
  //     }
  // }

  // public async filterlist(
  //   payload: ILeadPageNameFilter
  // ): Promise<ILead[] | ICustomResponse> {
  //   const {
  //     pageName
  //   } = payload
  //   try {

  //     let customerNameEmailMobile = ''
  //     let leadID = ''
  //     let status = []

  //     if (pageName === 'All Leads') {
  //       status = ["Fresh Lead", "Callback", "Interested", "Not Interested"];
  //     } else if (pageName === 'Sanction') {
  //       status = ['Approved Process','Rejected Process','Hold Process','Not Required Process'];
  //     }

  //     let caseType = ["New Case", "Existing Case", "Repeat Case"]

  //     let employeeType = ["Salaried","Self Employee","Professional","Not Employed","NA"]
  //     let leadStartDate = ''
  //     let leadEndDate = ''

  //     let allocated = []

  //     allocated = select userID,Name from users where status = 'Active';

  //     allocated = select utmsource from leads group by utmsource;

  //     if (leads == null || leads.length == 0) {
  //       return null;
  //     } else {
  //       return leads;
  //     }
  //   } catch (error) {
  //     logger.error(error);
  //     return {
  //       success: false,
  //       message: 'Internal Server Error',
  //       statusCode: 500,
  //     } as ICustomResponse;
  //   }
  // }

  // async find(
  //  where: WhereQuery<ILead>,
  // //  where:{},
  // // where: (builder: Knex.QueryBuilder) => void,
  //   order: SortCriteria<TSelectLead>,
  //   select: SelectFields<TSelectLead>,
  // ): Promise<ILead[]> {
  //   return await this.leadModel.findAll(where, order, select)
  // }

  // public async find(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ILead[] | ICustomResponse> {
  //   try {
  //     let lead = await this.leadModel.getLeadData(where, order, select)
  //     if (lead == null || lead.length == 0) {
  //       return null
  //     } else {
  //       return lead // Return the first lead if found
  //     }
  //   } catch (error) {
  //     logger.error(error)
  //     return {
  //       success: false,
  //       message: 'Internal Server Error',
  //       statusCode: 500,
  //     } as ICustomResponse
  //   }
  // }
  // ! Refactored

  public async updateOne(where: Partial<ILead>, update: Partial<ILead>): Promise<number> {
    return await this.leadModel.findOneAndUpdate(where, update)
  }

  public async create(data: {}): Promise<number | ICustomResponse> {
    try {
      let insertId = await this.leadModel.insert(data)
      return insertId
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  async getEmployementDetails(leadID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID', 'salaryMode', 'monthlyIncome'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const { customerID, salaryMode, monthlyIncome } = lead

    const empDetails = await this.employerModel.findOneEmployer(
      {
        customerID,
      },
      [
        'totalExperience',
        'office_email_id',
        'empDesignation',
        'address',
        'empWorkIndustry',
        'empSalary',
        'currentCompany',
        'employerID',
      ],
      [{ column: 'employerID', order: 'desc' }],
    )

    if (!empDetails) throw new NotFoundError('Employee details not available')

    const {
      totalExperience,
      office_email_id,
      empDesignation,
      address,
      empWorkIndustry,
      empSalary,
      currentCompany,
    } = empDetails

    let officialEmailId = office_email_id
    let industry = empWorkIndustry
    let designation = empDesignation
    let employeeSalary = empSalary ?? monthlyIncome

    if (!officialEmailId) {
      // If official email id not in table, search in approval table

      const approval = await this.approvalModel.findOneApproval({ leadID }, ['officialEmail'])

      officialEmailId = officialEmailId ?? approval?.officialEmail
    }

    if (!industry || !designation) {
      // find in customer
      const customer = await this.customerModel.findOneCustomer({ customerID }, [
        'industry',
        'designation',
      ])

      industry = industry ?? customer?.industry
      designation = designation ?? customer?.designation
    }

    // Now industry

    const response = {
      totalExperience,
      officialEmailId,
      designation,
      officeAddress: address,
      industry,
      income: employeeSalary,
      currentCompanyExperience: currentCompany,
      salaryMode,
      employerID: empDetails.employerID,
    }

    return this.serviceResponse(HttpStatusCode.Ok, response, 'Data Retrieved')
  }

  async getAddress(leadID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const address = await this.addressModel.findOneAddress(
      {
        customerID: lead.customerID,
      },
      ['address', 'pincode', 'city', 'state'],
      [{ column: 'addressID', order: 'desc' }],
    )

    if (!address) throw new NotFoundError('Address details not found')

    return this.serviceResponse(HttpStatusCode.Ok, address, 'Data Retrieved')
  }

  async getReferences(leadID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    // Find reference

    const reference = await this.referenceModel.find({
      where: { customerID: lead.customerID },
      select: ['relation', 'name', 'contactNo'],
      order: [{ column: 'referenceID', order: 'desc' }],
    })

    return this.serviceResponse(HttpStatusCode.Ok, reference, 'Data Retrieved')
  }

  async getEmandates(leadID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID', 'leadID'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const customer = await this.customerModel.findOneCustomer(
      {
        customerID: lead.customerID,
      },
      ['emandate_required'],
    )

    if (!customer) throw new NotFoundError('Customer does not exist')

    const rpayMandates = await this.razorpayMandateModel.RpayMandateKnex.where({
      customerID: lead.customerID,
    })
      .select(
        'inv_id',
        'accountNo',
        'accountType',
        'emMaxamount',
        'credated_date',
        'status',
        'short_url',
        'ifsc',
        'id',
        getKnexInstance().raw(`DATE_ADD(credated_date, INTERVAL 1 YEAR) as expiryDate`),
        getKnexInstance().raw(`'Razorpay' as mandateType`),
      )
      .orderBy('id', 'desc')

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        rpayMandates,
        emandateEnabled: customer.emandate_required === '1' ? false : true,
      },
      'Data Retrieved',
    )
  }

  async getPennyDrops(leadID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID', 'leadID'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const pennyDrops = await this.pennyDropModel.find({
      where: {
        customerID: lead.customerID,
      },
      select: [
        'p_id',
        'credated_date',
        'name',
        'bank_name',
        'account_number',
        'ifsc',
        'penny_status',
        'account_status',
      ],
      order: [{ column: 'id', order: 'desc' }],
    })

    //get mandate data from pennydrop
    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )
    const db = getKnexInstance()
    const getMandateData = await db('razorpay_mandate')
      .where('customerID', lead.customerID)
      .whereNot('inv_id', '')
      .whereIn('status', ['paid', 'Paid'])
      .groupBy('accountNo')
      .select('id', 'customerID', 'accountNo', 'ifsc', 'leadID')
    const data = { pennyDrops, getMandateData }

    return this.serviceResponse(HttpStatusCode.Ok, data, 'Data Retrieved')
  }

  async disableEmandate(leadID: number, userID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID', 'leadID'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const customer = await this.customerModel.findOneCustomer(
      {
        customerID: +lead.customerID,
      },
      ['emandate_required'],
    )

    if (!customer) throw new NotFoundError('Customer not found')

    await this.customerModel.findOneAndUpdate(
      { customerID: lead.customerID },
      { emandate_required: customer.emandate_required === '1' ? '0' : '1' },
    )

    if (customer.emandate_required === '0') {
      // Means emandate has been disabled
      await this.emandateNotRequiredLogs.insert({
        customerID: lead.customerID,
        nr_startBy: userID,
        nr_startDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
      })
    } else {
      const latestRecord = await this.emandateNotRequiredLogs.findOne({
        where: { customerID: lead.customerID },
        order: [{ column: 'id', order: 'desc' }],
        select: ['id'],
      })

      if (latestRecord) {
        await this.emandateNotRequiredLogs.findOneAndUpdate(
          {
            id: latestRecord.id,
          },
          {
            nr_endBy: userID,
            nr_endDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
          },
        )
      }
    }

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {},
      customer.emandate_required === '1' ? 'Emandate enabled' : 'Emandate disabled',
    )
  }

  async generateEmandate(leadID: number, accountID: number, userID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID', 'leadID', 'status'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    if (lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.SETTLEMENT) {
      throw new BadRequestError('Cannot generate emandate if lead status is ' + lead.status)
    }

    const customerAccount = await this.customerAccountModel.findOne({
      where: { accountID },
    })

    if (!customerAccount) throw new NotFoundError('Customer account not found')

    const customer = await this.customerModel.findOneCustomer({
      customerID: lead.customerID,
    })

    if (!customer) throw new NotFoundError('Customer not found')

    const approval = await this.approvalModel.findOneApproval(
      {
        customerID: lead.customerID,
        leadID: lead.leadID,
      },
      ['loanAmtApproved', 'status'],
    )

    if (!approval) throw new NotFoundError('Customer has no approval')

    // if (approval.status !== ApprovalStatus.Approved) {
    //   throw new BadRequestError('Approval status must be approved')
    // }

    const { email, mobile, name } = customer

    const resp = await this.razorPayPayments.createEmandateAuthLink(lead.customerID, lead.leadID, {
      accountNo: customerAccount.accountNo,
      accountType: customerAccount.accountType,
      contact: String(mobile),
      email: email,
      ifsc: customerAccount.bankIfsc,
      name,
      amount: approval.loanAmtApproved,
    })
    if (!resp.success) {
      throw new BadRequestError(
        'Their was an issue in generating emandate, Please try againg later',
        {
          data: resp.data,
        },
      )
    }

    const { data } = resp

    await this.razorpayMandateModel.insert({
      customerID: lead.customerID,
      leadID: String(lead.leadID),
      inv_id: data.id,
      entity: data.entity,
      receipt: data.receipt,
      invoice_number: data.invoice_number,
      customer_id: data.customer_id,
      cust_name: data.customer_details.name,
      cust_email: data.customer_details.email,
      cust_contact: data.customer_details.contact,
      order_id: data.order_id,
      status: data.status,
      sms_status: data.sms_status,
      email_status: data.email_status,
      short_url: data.short_url,
      type: data.type,
      accountNo: customerAccount.accountNo,
      accountType: customerAccount.accountType,
      bank: customerAccount.bank,
      ifsc: customerAccount.bankIfsc,
      uid: config.defaultUserId,
      emMaxamount: approval.loanAmtApproved * 3,
      etype: '0',
      token_id: '0',
      res_response: JSON.stringify(data),
    })

    await this.callHistoryLogsModel.insert({
      customerID: lead.customerID,
      leadID: lead.leadID,
      callType: 'IVR',
      status: 'Emandate',
      remark: '',
      noteli: '',
      calledBy: userID, // TODO: Change to logged in user via jwt_token
    })

    return this.serviceResponse(
      HttpStatusCode.Created,
      { url: data.short_url },
      'Emandate URL generated',
    )
  }

  async chargeEmandate(payload: IChargeEmandatePayload, loggedInUserId: number) {
    const { leadID, emandateAmount, emandateID, remark } = payload

    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID', 'leadID'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const customer = await this.customerModel.findOneCustomer(
      {
        customerID: lead.customerID,
      },
      ['mobile', 'email', 'name', 'pancard'],
    )

    if (!customer) throw new NotFoundError('Customer details not found')

    const rpayMandate = await this.razorpayMandateModel.findOne({
      where: { id: emandateID },
      select: ['emMaxamount', 'id', 'token_id', 'customer_id', 'cust_name', 'order_id', 'status'],
    })

    if (!rpayMandate) throw new NotFoundError('This emandate is invalid')

    if (rpayMandate.status.toLowerCase() !== 'paid') {
      throw new BadRequestError('Cannot create charge for an incompleted emandate')
    }

    const onlinePayment = await this.onlinePaymentModel.Knex.where({
      paymentStatus: 'success',
      method: 'E-mandate',
      leadID: String(leadID),
    }).sum('toValue')

    const collectedPayment: number = onlinePayment[0].sum
    let emandateMaxAmount: number = rpayMandate.emMaxamount ?? -1

    if (collectedPayment < emandateMaxAmount && emandateMaxAmount > 0) {
      emandateMaxAmount = emandateMaxAmount - collectedPayment
    }

    if (collectedPayment < 1 && emandateMaxAmount < 1) {
      const loan = await this.loanModel.findOneLoan(
        {
          customerID: lead.customerID,
          leadID: lead.leadID,
        },
        ['disbursalAmount'],
      )
      emandateMaxAmount = loan?.disbursalAmount ?? 0
      emandateMaxAmount = emandateMaxAmount * 2
    }

    if (emandateAmount > emandateMaxAmount) {
      throw new BadRequestError(`Max chargable amount cannot be more than Rs.${emandateMaxAmount}`)
    }

    if (emandateAmount >= 100 && emandateAmount <= emandateMaxAmount) {
      const order = await this.razorPayPayments.createOrder(lead.customerID, lead.leadID, {
        amount: convertRupeesToPaise(emandateAmount),
        currency: 'INR',
        receipt: 'INR',
        notes: {
          notes_key_1: `leadID:${lead.leadID}`,
          notes_key_2: `leadID:${lead.leadID}`,
        },
      })
      if (!order.success) {
        throw new BadRequestError('Unable to generate an order at the moment.')
      }

      const [[emOrderId], reccuringResp] = await Promise.all([
        this.razorpayEmOrderModel.insert({
          emID: String(rpayMandate.id),
          customerID: String(lead.customerID),
          orderID: order.data.id,
          entity: order.data.entity,
          amount: String(order.data.amount / 100),
          amount_paid: String(order.data.amount_paid),
          amount_due: String(order.data.amount_paid),
          currency: order.data.currency,
          receipt: order.data.receipt,
          status: order.data.status,
          notes_key_1: order.data.notes.notes_key_1,
          tokenID: rpayMandate.token_id,
          uid: `${loggedInUserId}`,
          razorpay_payment_id: '',
          razorpay_order_id: '',
          razorpay_signature: '',
          remarks: remark,
          leadID: String(lead.leadID),
        }),
        this.razorPayPayments.createRecurringPayment({
          amount: convertRupeesToPaise(emandateAmount),
          contact: customer.mobile,
          currency: 'INR',
          customer_id: rpayMandate.customer_id,
          description: rpayMandate.cust_name,
          email: customer.email,
          notes: {
            notes_key_1: rpayMandate.cust_name,
            notes_key_2: rpayMandate.cust_name,
          },
          order_id: order.data.id,
          recurring: '1',
          token: rpayMandate.token_id,
        }),
      ])

      if (!reccuringResp.success) {
        throw new BadRequestError('Unable to generate an order at the moment.')
      }

      await Promise.all([
        this.razorpayEmOrderModel.findOneAndUpdate(
          { id: emOrderId },
          { razorpay_payment_id: reccuringResp.data.razorpay_payment_id },
        ),
        this.onlinePaymentModel.insert({
          name: customer.name,
          email: customer.email,
          phone: String(customer.mobile),
          service: 'Ramfincorp',
          typeProduct: 'Emandate',
          toValue: String(order.data.amount / 100),
          message: customer.pancard,
          razorpayOrderId: order.data.id,
          razorpayPaymentId: reccuringResp.data.razorpay_payment_id,
          paymentStatus: 'PENDING',
          status: 'no',
          paymentType: 'E-mandate Charge',
          method: 'E-mandate',
          leadID: lead.leadID,
        }),
      ])

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Charge Created')
    }
    throw new BadRequestError('Amount should be greater than or equal to 100')
  }

  async createEmploymentDetails(payload: ICreateEmploymentDetails, userID: number) {
    const {
      designation,
      income,
      industry,
      officeAddress,
      officialEmailId,
      salaryMode,
      totalExperience,
      employerID,
      leadID,
    } = payload

    const lead = await this.leadModel.findOneLead({ leadID }, ['customerID', 'leadID'])

    if (!lead) throw new NotFoundError('Customer Lead not found')

    const oldEmployerDetails = await this.employerModel.findOneEmployer(
      { employerID },
      ['*'],
      [{ column: 'employerID', order: 'desc' }],
    )

    await Promise.all([
      this.employerModel.insert({
        totalExperience,
        office_email_id: officialEmailId,
        address: officeAddress,
        empWorkIndustry: industry,
        empDesignation: designation,
        empSalary: String(income),
        // currentCompany: currentCompanyExperience,
        city: oldEmployerDetails.city,
        state: oldEmployerDetails.state,
        pincode: oldEmployerDetails.pincode,
        customerID: lead.customerID,
        employerName: oldEmployerDetails.employerName,
        status: 'Verified',
        verifiedBy: userID, // TODO: Add user Id from token
      }),
      this.leadModel.findOneAndUpdate({ leadID }, { salaryMode }),
    ])

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
  }

  async createAddress(payload: ICreateAddressPayload) {
    const { address, city, state, leadID, pincode } = payload

    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const addressDetails = await this.addressModel.findOneAddress(
      { customerID: lead.customerID },
      ['type'],
      [{ column: 'addressID', order: 'desc' }],
    )

    await this.addressModel.insert({
      address,
      city,
      state,
      pincode,
      customerID: lead.customerID,
      type: addressDetails?.type ? addressDetails.type : 'Current Address',
    })

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
  }

  async getBasicLeadDetails(leadID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID', 'status', 'leadID', 'createdDate', 'loanRequeried', 'fbLeads'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const [approval, callHistory] = await Promise.all([
      this.approvalModel.findOneApproval({ leadID }, ['repayDate']),
      this.callHistoryLogsModel.findOne({
        where: { status: LeadStatus.APPROVED_PROCESS, leadID },
        select: ['createdDate'],
      }),
    ])

    let requestedTenure = null
    if (approval && callHistory) {
      // First date

      requestedTenure = this.loanService.getActualLoanTenure(
        callHistory.createdDate,
        approval.repayDate as unknown as Date,
      )
    }

    const leadData = {
      leadID: lead.leadID,
      loanApplicationDate: lead.createdDate,
      requestedLoanAmount: lead.loanRequeried,
      requestedTenure,
      loanType: lead.fbLeads,
    }

    return this.serviceResponse(HttpStatusCode.Ok, leadData, 'Success')
  }

  async getLoanDetails(leadID: number) {
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID', 'productID', 'ipc', 'status', 'leadID'],
    )

    if (!lead) throw new NotFoundError('Lead not found')

    const product = await this.productModel.findOne({
      productID: lead.productID,
    })

    const productType = product.name

    let loanDetails = {
      loanAmount: 0,
      disbursalDate: new Date(),
      repaymentDate: new Date(),
      disbursedBy: 'Name',
      accountNo: '',
      ifsc: '',
      accountHolderName: '',
      bankBranch: '',
      actualTenure: null,
      dpd: null,
      actualInterest: null,
      loanTenure: null,
      paidAmount: 0,
      repayAmount: 0,
      bounceCharges: 0,
      tax: 0,
      penalInterest: 0,
      outstandingAmount: 0,
      adminFee: 0,
      processingFee: 0,
      gst: 0,
      disbursedAmount: 0,
      emisPaid: null,
      loanNo: null,
      productID: null,
      status: lead.status,
      netInterest: 0,
      roi: 0,
    }

    const [approval, loan, customer] = await Promise.all([
      this.approvalModel.findOneApproval({ leadID }, [
        'repayDate',
        'tenure',
        'loanAmtApproved',
        'GstOfAdminFee',
        'adminFee',
        'roi',
      ]),
      this.loanModel.findOneLoan({ leadID }, [
        'disbursalAmount',
        'disbursalDate',
        'accountNo',
        'bankIfsc',
        'loanNo',
        'disbursedBy',
      ]),
      this.customerModel.findOneCustomer({ customerID: lead.customerID }, ['customerID']),
    ])

    if (!customer) throw new NotFoundError('No Customer found against the lead')

    if (!approval) throw new NotFoundError('No Loan found against the lead')

    if (!loan) throw new NotFoundError('No Loan found against this lead')

    const [account, user, bankIfsc] = await Promise.all([
      this.customerAccountModel.findOne({
        where: { accountNo: loan.accountNo },
      }),
      this.userModel.findOne({
        where: { userID: loan.disbursedBy },
        select: ['userID', 'name'],
      }),
      this.bankIfscModel.findOne({
        where: { IFSC: loan.bankIfsc },
        select: ['BRANCH'],
      }),
    ])

    loanDetails.loanTenure = this.loanService.getActualLoanTenure(
      approval.repayDate as unknown as Date,
      loan.disbursalDate,
    )
    loanDetails.loanTenure = !Number.isNaN(loanDetails.loanTenure)
      ? loanDetails.loanTenure + ' days'
      : null

    loanDetails.roi = approval.roi
    loanDetails.loanNo = loan.loanNo
    loanDetails.loanAmount = loan.disbursalAmount
    loanDetails.disbursalDate =
      String(loan?.disbursalDate) === '0000-00-00' ? null : loan?.disbursalDate ?? null
    loanDetails.disbursedBy = user?.name ?? null
    loanDetails.repaymentDate =
      String(loan?.disbursalDate) === '0000-00-00' ? null : (approval.repayDate as unknown as Date)
    loanDetails.accountNo = loan.accountNo
    loanDetails.ifsc = loan.bankIfsc
    loanDetails.accountHolderName = account?.bank_holder_name ?? null
    loanDetails.bankBranch = bankIfsc?.BRANCH ?? null

    // Dynamic fields
    loanDetails.actualTenure = null // only if data in collection
    loanDetails.dpd = null
    loanDetails.actualInterest = null // if collection me data hai that is part-payment then use dashboard method calculate part-payment, TODO !
    // ! else if closed or settlement then need to find in collection table [ask papu]
    loanDetails.paidAmount = 0
    loanDetails.repayAmount = roundNumber(
      approval.loanAmtApproved +
        roundNumber(
          approval.loanAmtApproved *
            ((approval.roi *
              this.loanService.getActualLoanTenure(
                approval.repayDate as unknown as Date,
                loan.disbursalDate,
              )) /
              100),
        ),
    )
    loanDetails.bounceCharges = null
    loanDetails.penalInterest = null

    loanDetails.adminFee = approval.adminFee
    loanDetails.processingFee = approval.loanAmtApproved != 0 ? approval.adminFee : 0
    loanDetails.disbursedAmount = loan.disbursalAmount
    loanDetails.tax = approval.GstOfAdminFee

    const dpdInterest = +config.dpdInterest
    const ipcDpdInterest = +config.ipcDpdInterest
    switch (productType) {
      case 'payday':
        loanDetails.productID = ProductID.PAYDAY
        if (lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.SETTLEMENT) {
          const collection = await this.collectionModel.find({
            where: {
              leadID,
              collectionStatus: CollectionStatus.APPROVED.toString(),
            },
            select: ['collectedDate', 'collectionID', 'collectedAmount', 'collectedMode'],
            order: [{ column: 'collectionID', order: 'desc' }],
          })

          // ! Actual Loan tenure
          // Formula : collectedDate - loan.disbursedDate

          loanDetails.actualTenure = this.loanService.getActualLoanTenure(
            collection[0].collectedDate,
            loan.disbursalDate,
          )

          // ! DPD : currentDate - approval.repayDate
          // first check even DPD or not
          const dpd = this.loanService.getDpdDays(
            approval.repayDate as unknown as Date,
            collection[0].collectedDate,
          )

          loanDetails.dpd = dpd > 0 ? dpd : null

          loanDetails.paidAmount = +this.loanService.getPaidAmountPayday(collection).toFixed(2)

          // ! OLD CODE:
          // loanDetails.penalInterest =
          //   dpd > 0
          //     ? +(await this.loanService.getPenalInterestPayday(lead, loan, approval, dpd)).toFixed(
          //         2,
          //       )
          //     : 0

          loanDetails.penalInterest = 0

          let orignalTenure = this.loanService.getActualLoanTenure(
            loan.disbursalDate,
            approval.repayDate as unknown as Date,
          )

          // ! OLD CODE:

          // const orignalInterest = +this.loanService
          //   .calculateInterest(loanDetails.disbursedAmount, approval.roi, orignalTenure)
          //   .toFixed(2)

          // Actual Interest:
          // loanDetails.actualInterest = +this.loanService
          //   .calculateInterest(loan.disbursalAmount, approval.roi, loanDetails.actualTenure)
          //   .toFixed(2)

          loanDetails.actualInterest = 0

          // if (dpd > 0) {
          //   const newInterest = this.loanService.calculateInterest(
          //     loan.disbursalAmount,
          //     lead.ipc ? ipcDpdInterest : dpdInterest,
          //     dpd,
          //   )

          // loanDetails.actualInterest = +(orignalInterest + newInterest).toFixed(2)
          // }

          // ! END OF OLD CODE:
        }

        if (lead.status === LeadStatus.DISBURSED || lead.status === LeadStatus.PART_PAYMENT) {
          // ! DPD : currentDate - approval.repayDate
          // loanDetails.tax = (+config.dpdPenalty * +config.gst) / 100

          const dpd = this.loanService.getDpdDays(approval.repayDate as unknown as Date)

          loanDetails.gst = dpd > 0 ? (+config.dpdPenalty * +config.gst) / 100 : 0

          loanDetails.dpd = dpd > 0 ? dpd : null

          loanDetails.bounceCharges = dpd > 0 ? +config.dpdPenalty : null

          // !
          loanDetails.penalInterest =
            dpd > 0
              ? await this.loanService.getPenalInterestPayday(lead, loan, approval, dpd)
              : null

          if (loanDetails.penalInterest < 0) loanDetails.penalInterest = 0

          const outstanding =
            lead.status === LeadStatus.DISBURSED
              ? await this.checkDisbursed(lead, customer)
              : await this.checkPartPayment(lead, customer)

          loanDetails.outstandingAmount = outstanding.totalAmount

          if (lead.status === LeadStatus.PART_PAYMENT) {
            const collections = await this.collectionModel.find({
              where: {
                leadID,
                collectionStatus: CollectionStatus.APPROVED.toString(),
              },
              select: [
                'collectedDate',
                'collectionID',
                'collectedAmount',
                'total_interest',
                'principal_amount',
              ],
              order: [{ column: 'collectionID', order: 'desc' }],
            })

            loanDetails.paidAmount = this.loanService.getPaidAmountPayday(collections)
            loanDetails.actualInterest = this.loanService.getRemainingInterestPayDay(
              collections,
              approval.roi,
            )

            loanDetails.penalInterest =
              dpd > 0
                ? +(
                    await this.loanService.getPenalInterestPayday(
                      lead,
                      loan,
                      approval,
                      dpd,
                      loanDetails.gst + loanDetails.bounceCharges,
                    )
                  ).toFixed(2)
                : null

            if (loanDetails.penalInterest < 0) loanDetails.penalInterest = 0

            // const sumOfBounceAndGst = loanDetails.gst + loanDetails.bounceCharges

            // if (loanDetails.outstandingAmount < sumOfBounceAndGst) {
            //   loanDetails.bounceCharges = loanDetails.outstandingAmount - loanDetails.bounceCharges
            // }

            // if (loanDetails.bounceCharges < 0) {
            //   loanDetails.gst = loanDetails.gst + loanDetails.bounceCharges
            //   loanDetails.bounceCharges = 0

            //   if (loanDetails.gst < 0) {
            //     loanDetails.gst = 0
            //   }
            // }
          }

          // Actual Tenure
          loanDetails.actualTenure = this.loanService.getActualLoanTenure(
            new Date(),
            loan.disbursalDate,
          )

          // Actual Interest:
          if (lead.status === LeadStatus.DISBURSED) {
            loanDetails.actualInterest = +this.loanService
              .calculateInterest(loan.disbursalAmount, approval.roi, loanDetails.actualTenure)
              .toFixed(2)
          }

          const sumOfBounceAndGst = loanDetails.gst + loanDetails.bounceCharges

          if (loanDetails.outstandingAmount < sumOfBounceAndGst) {
            loanDetails.gst = loanDetails.gst - loanDetails.outstandingAmount

            if (loanDetails.gst < 0) {
              // loanDetails.bounceCharges = loanDetails.bounceCharges + loanDetails.gst
              loanDetails.gst = 0
            }

            if (loanDetails.outstandingAmount < loanDetails.bounceCharges) {
              loanDetails.bounceCharges = loanDetails.outstandingAmount
            }
          }
        }

        loanDetails.netInterest = +(
          (loanDetails.penalInterest ?? 0) +
          (loanDetails.actualInterest ?? 0) +
          loanDetails.gst +
          loanDetails.bounceCharges
        ).toFixed(2)

        // if (lead.status === LeadStatus.PART_PAYMENT) {
        //   loanDetails.outstandingAmount =
        //     loanDetails.netInterest + loanDetails.loanAmount - (loanDetails.paidAmount || 0)
        // }

        // if (lead.status === LeadStatus.PART_PAYMENT) {
        //   loanDetails.outstandingAmount =
        //     loanDetails.netInterest + loanDetails.loanAmount - (loanDetails.paidAmount || 0)
        // }

        loanDetails.disbursedAmount =
          loan.disbursalAmount - (loanDetails.adminFee || 0) - (loanDetails.tax || 0)

        if (
          !(
            lead.status === LeadStatus.DISBURSED ||
            lead.status === LeadStatus.PART_PAYMENT ||
            lead.status === LeadStatus.CLOSED ||
            lead.status === LeadStatus.SETTLEMENT
          )
        ) {
          loanDetails.repayAmount = null
          loanDetails.repaymentDate = null
          loanDetails.netInterest = null
        }

        break
      case 'emi':
        const db = getKnexInstance()
        loanDetails.productID = ProductID.EMI

        // call repayment api
        const apiCall = await this.emiService.getRepaymentDataV2(leadID, lead.customerID)

        const { processedEmis: getEmis } = apiCall
        loanDetails.loanTenure = getEmis.length > 0 ? getEmis.length + ' Months' : null

        if (lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.SETTLEMENT) {
          // Calculating totalEmiAmountPaid
          // loanDetails.tax = 0
          loanDetails.gst = 0

          const emisLength = getEmis.length - 1
          // loanDetails.repayAmount = 0
          const emis = await db('equated_monthly_installments')
            .where({ leadID: leadID, is_deleted: 0 })
            .sum('amountPayable as repayAmount')

          loanDetails.repayAmount = emis[0]?.repayAmount
          let paidEmis = 0
          getEmis.forEach(element => {
            if (element.is_deleted == 0) {
              paidEmis += 1
              loanDetails.emisPaid = `${paidEmis} / ${paidEmis}`

              // if (
              //   element.status === EmiStatus.PAID ||
              //   element.status === EmiStatus.DUE ||
              //   element.status === EmiStatus.OVERDUE
              // ) {
              //   loanDetails.repayAmount += element?.amountPayable ?? 0
              // } else if (element.status === EmiStatus.PARTIALLY_PAID) {
              //   loanDetails.repayAmount +=
              //     (element?.amountPayable ?? 0) + Number(element.paymentReceived)
              // }

              if (element.status === EmiStatus.PAID) {
                loanDetails.paidAmount += parseFloat(element.paymentReceived)
                // if (element.panelty) {
                //   loanDetails.penalInterest += element.panelty
                // }
                if (typeof element.amountRemainsPenalty === 'number') {
                  loanDetails.penalInterest += element.amountRemainsPenalty
                }

                // loanDetails.actualInterest += element.interest

                const dpd = this.loanService.getDpdDays(element.dueDate, element.actualPaymentDate)

                if (dpd > 0) loanDetails.dpd += dpd

                loanDetails.bounceCharges += element.amountRemainsBrokenPeriodIntrest
              }
            }
          })
          loanDetails.actualInterest = 0

          loanDetails.actualTenure = this.loanService.getActualLoanTenureInMonthDay(
            getEmis[emisLength].actualPaymentDate,
            loan.disbursalDate,
          )

          // loanDetails.emisPaid = `${emisLength} / ${emisLength}`
          loanDetails.outstandingAmount = 0
          // loanDetails.bounceCharges =
          //   loanDetails.dpd > 0
          //     ? +config.dpdPenalty +
          //       (+config.dpdPenalty * Number(config.dpdPenaltyGstPercentage)) / 100
          //     : null
        } else if (lead.status === LeadStatus.DISBURSED) {
          let paidCount = 0
          let overDueCount = 0
          // loanDetails.repayAmount = 0
          const emis = await db('equated_monthly_installments')
            .where({ leadID: leadID, is_deleted: 0 })
            .sum('amountPayable as repayAmount')

          loanDetails.repayAmount = emis[0]?.repayAmount

          getEmis.forEach(element => {
            if (element.status === EmiStatus.OVERDUE) {
              // loanDetails.repayAmount += element?.amountPayable ?? 0

              overDueCount += 1
            }

            // TODO: Interest + only if status = DUE
            // TODO : If Status.PARTIALLY_PAID, then amountRemainsInterest

            if (element.status === EmiStatus.DUE) {
              loanDetails.actualInterest += element.interest
            } else if (
              element.status === EmiStatus.OVERDUE ||
              element.status === EmiStatus.PARTIALLY_PAID
            ) {
              loanDetails.actualInterest += element.amountRemainsInterest

              if (element.status === EmiStatus.PARTIALLY_PAID) {
                loanDetails.penalInterest += element.panelty
              }
            }

            loanDetails.paidAmount += parseFloat(element.paymentReceived)

            if (element.status !== EmiStatus.PAID) {
              loanDetails.outstandingAmount += element.amountPayable
              if (element.amountRemainsBrokenPeriodIntrest) {
                if (element.amountRemainsBrokenPeriodIntrest > 500) {
                  loanDetails.bounceCharges += 500
                } else {
                  loanDetails.bounceCharges += element.amountRemainsBrokenPeriodIntrest
                }
              } else {
                if (element.brokenPeriodIntrest > 500) {
                  loanDetails.bounceCharges += 500
                } else {
                  loanDetails.bounceCharges += element.brokenPeriodIntrest
                }
              }

              // Calculate penalty
              const dueDate = moment(element.dueDate).utcOffset(330).startOf('day')
              const currentDate = moment().utcOffset(330).startOf('day')

              const delay = currentDate.diff(dueDate, 'days')

              if (delay > 0) {
                if (
                  element.status === EmiStatus.PARTIALLY_PAID &&
                  (element.amountRemainsPenalty == null || element.amountRemainsPenalty == 0)
                ) {
                  loanDetails.penalInterest += element.panelty
                } else if (
                  element.status === EmiStatus.PARTIALLY_PAID &&
                  element.amountRemainsPenalty > 0
                ) {
                  loanDetails.penalInterest += element.amountRemainsPenalty
                } else if (element.status === EmiStatus.OVERDUE) {
                  loanDetails.penalInterest += element.panelty
                }
              }
            }

            if (element.status === EmiStatus.PAID) {
              const dpd = this.loanService.getDpdDays(element.dueDate, element.actualPaymentDate)
              if (dpd > 0) loanDetails.dpd += dpd

              paidCount += 1

              loanDetails.emisPaid = `${paidCount} / ${getEmis.length}`
            } else if (element.status === EmiStatus.OVERDUE) {
              const dpd = this.loanService.getDpdDays(element.dueDate)

              // Old way to calculate penalty

              // if (typeof element.amountRemainsPenalty === 'number') {
              //   loanDetails.penalInterest += element.amountRemainsPenalty
              // }

              if (dpd > 0) loanDetails.dpd += dpd
            }
          })

          // loanDetails.tax = ((+config.dpdPenalty * +config.gst) / 100) * overDueCount
          if (overDueCount !== 0)
            loanDetails.gst = ((+config.dpdPenalty * +config.gst) / 100) * overDueCount

          loanDetails.actualTenure = this.loanService.getActualLoanTenureInMonthDay(
            new Date(),
            loan.disbursalDate,
          )

          // loanDetails.bounceCharges =
          //   loanDetails.dpd > 0
          //     ? +config.dpdPenalty +
          //       (+config.dpdPenalty * Number(config.dpdPenaltyGstPercentage)) / 100
          //     : null
        }

        if (loanDetails.actualInterest) {
          loanDetails.actualInterest = +loanDetails.actualInterest.toFixed(2)
        }

        if (loanDetails.penalInterest) {
          loanDetails.penalInterest = +loanDetails.penalInterest.toFixed(2)
        }

        loanDetails.netInterest =
          (loanDetails.penalInterest ?? 0) +
          (loanDetails.actualInterest ?? 0) +
          loanDetails.gst +
          loanDetails.bounceCharges

        loanDetails.disbursedAmount =
          loan.disbursalAmount - (loanDetails.adminFee || 0) - (loanDetails.tax || 0)
        if (
          !(
            lead.status === LeadStatus.DISBURSED ||
            lead.status === LeadStatus.PART_PAYMENT ||
            lead.status === LeadStatus.CLOSED ||
            lead.status === LeadStatus.SETTLEMENT
          )
        ) {
          loanDetails.repayAmount = null
          loanDetails.repaymentDate = null
          loanDetails.netInterest = null
        }
    }
    return this.serviceResponse(HttpStatusCode.Ok, loanDetails, 'Fetched')
  }

  // For disbursed calculation
  async checkDisbursed(lead: ILead, customer: ICustomer) {
    const { leadID } = lead
    const { customerID } = customer
    // No step needs to be send here

    const [approval, loan] = await Promise.all([
      this.approvalModel.findOneApproval(
        { leadID, customerID },
        [
          'approvalID',
          'loanAmtApproved',
          'tenure',
          'roi',
          'repayDate',
          'adminFee',
          'GstOfAdminFee',
          'status',
          'customerApproval',
        ],
        [{ column: 'approvalID', order: 'desc' }],
      ),
      this.loanService.findOne(
        { customerID, leadID },
        [
          'loanNo',
          'createdDate',
          'disbursalAmount',
          'disbursalDate',
          'accountNo',
          'accountType',
          'bankIfsc',
          'bank',
          'status',
        ],
        [{ column: 'loanID', order: 'desc' }],
      ),
    ])
    const dpdInterest = +config.dpdInterest
    let totalAmount = 0
    let sanctionInterest = 0

    const dashboardMessages = {
      dashboard_message1: 'Loan Repayment',
      dashboard_message2: 'Keep your credit shining bright. Dont forget to repay your Loan on time',
      dashboard_message3: 'Repay Now!!',
      dashboard_message4: approval.repayDate,
      dashboard_message5: '',
      dashboard_message6: 0,
    }

    let currentDate = new Date()
    let repayDate = new Date(approval.repayDate)
    let disbursalDate = loan.disbursalDate

    let tenure = 0

    const isOverDue = isDateAfter(currentDate, repayDate)

    let delayInterest = 0

    // DPD case
    if (isOverDue) {
      const dpdDays = getDifferenceInDays(repayDate, currentDate)
      delayInterest = this.loanService.calculateInterest(loan.disbursalAmount, dpdInterest, dpdDays)
      tenure = getDifferenceInDays(disbursalDate, repayDate)

      dashboardMessages.dashboard_message5 = `Days Past Due: ${dpdDays} days`
    } else {
      tenure = getDifferenceInDays(disbursalDate, currentDate)
    }
    sanctionInterest = this.loanService.calculateInterest(
      loan.disbursalAmount,
      approval.roi,
      tenure,
    )
    totalAmount = loan.disbursalAmount + sanctionInterest + delayInterest

    if (lead.ipc === 1) {
      let repaymentData = await this.loanService.calculateRepayAmountIpc(
        lead,
        customer,
        approval,
        loan,
        isOverDue ? currentDate : repayDate,
      )
      totalAmount = repaymentData.totalPayableAmount
      sanctionInterest = repaymentData.totalInterest
    }

    dashboardMessages.dashboard_message6 = totalAmount

    return { interest: sanctionInterest, totalAmount }
  }

  async checkPartPayment(lead: ILead, customer: ICustomer) {
    const { leadID } = lead
    const { customerID } = customer

    const [approval, loan] = await Promise.all([
      this.approvalModel.findOneApproval(
        { leadID, customerID },
        [
          'approvalID',
          'loanAmtApproved',
          'tenure',
          'roi',
          'repayDate',
          'adminFee',
          'GstOfAdminFee',
          'status',
          'customerApproval',
        ],
        [{ column: 'approvalID', order: 'desc' }],
      ),
      this.loanService.findOne(
        { customerID, leadID },
        [
          'loanNo',
          'createdDate',
          'disbursalAmount',
          'disbursalDate',
          'accountNo',
          'accountType',
          'bankIfsc',
          'bank',
          'status',
        ],
        [{ column: 'loanID', order: 'desc' }],
      ),
    ])

    const dashboardMessages = {
      dashboard_message1: 'Loan Repayment',
      dashboard_message2: 'Keep your credit shining bright. Dont forget to repay your Loan on time',
      dashboard_message3: 'Repay Now!!',
      dashboard_message4: approval.repayDate,
      dashboard_message5: '',
      dashboard_message6: 0,
    }

    let collectionAmount = 0
    let dpdInterest = +config.dpdInterest

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )
    const collection = await this.collectionModel.find({
      where: {
        customerID,
        leadID,
        loanNo: loan.loanNo,
        status: CollectionStatus.PART_PAYMENT,
        collectionStatus: CollectionStatus.APPROVED.toString(),
      },
      sum: ['collectedAmount'],
    })

    if (collection.length > 0) {
      collectionAmount = collection[0].collectedAmount
    }

    let currentDate = new Date()
    let repayDate = new Date(approval.repayDate)
    let disbursalDate = loan.disbursalDate

    let tenure = 0

    let sanctionInterest = 0

    let totalAmount = 0
    let delayInterest = 0
    const isOverDue = isDateAfter(currentDate, repayDate)
    if (isOverDue) {
      dashboardMessages.dashboard_message1 = 'Urgent Attention Needed!'
      dashboardMessages.dashboard_message2 = `Your loan of`
      dashboardMessages.dashboard_message3 = 'Repay Loan!!'
      dashboardMessages.dashboard_message4 = 'is overdue. Please repay promptly'

      const dpdDays = getDifferenceInDays(repayDate, currentDate)
      delayInterest = this.loanService.calculateInterest(loan.disbursalAmount, dpdInterest, dpdDays)

      tenure = getDifferenceInDays(disbursalDate, repayDate)

      dashboardMessages.dashboard_message5 = `Days Past Due: ${dpdDays} days`
    } else {
      tenure = getDifferenceInDays(disbursalDate, currentDate)
    }
    sanctionInterest = this.loanService.calculateInterest(
      loan.disbursalAmount,
      approval.roi,
      tenure,
    )

    totalAmount = collectionAmount
      ? loan.disbursalAmount + sanctionInterest + delayInterest - collectionAmount
      : loan.disbursalAmount + sanctionInterest + delayInterest

    if (lead.ipc === 1) {
      let repaymentData = await this.loanService.calculateRepayAmountIpc(
        lead,
        customer,
        approval,
        loan,
        isOverDue ? currentDate : repayDate,
      )
      totalAmount = repaymentData.totalPayableAmount
    }

    dashboardMessages.dashboard_message6 = totalAmount

    return { totalAmount }
  }

  async collectionDetails(leadID: number, page: number, perPage: number) {
    const lead = await this.leadModel.findOneLead({ leadID }, [
        'customerID',
        'status',
        'leadID',
        'createdDate',
        'loanRequeried',
        'productID',
      ]),
      db = getKnexInstance()
    if (!lead) throw new NotFoundError('Lead not found')

    let collectionData: any[] = []
    let totalCount: number

    if (lead.productID === ProductID.PAYDAY) {
      totalCount = await this.collectionModel.countAll({
        where: { leadID: leadID },
      })

      collectionData = await db('collection as c')
        .where('c.leadID', leadID)
        .select([
          'c.referenceNo',
          'c.loanNo',
          'c.collectedAmount',
          'c.collectedMode',
          'c.remark',
          'c.refund_utr_no',
          'c.collectedDate',
          'c.collectionStatus',
          'c.collectedBy',
          'c.excess_amount',
          'r.remarks as razorpayRemarks',
          'u.name as collectedByName',
          'collectionID as id',
        ])
        .leftJoin('razorpay_emOrder as r', 'c.referenceNo', 'r.orderId')
        .leftJoin('users as u', 'c.collectedBy', 'u.userID')
        .orderBy('c.collectionID', 'desc')
        .limit(perPage)
        .offset(page * perPage)
    } else {
      totalCount = await this.transactionModel.count(
        { leadID: leadID, type: 'collection', emiID: 0 },
        undefined,
        [{ rawQuery: '(status IN (1,2,3,4))', values: [] }],
      )

      collectionData = await db('transactions as t')
        .where('t.leadID', leadID)
        .where('t.type', 'collection')
        .where('t.emiID', 0)
        .whereRaw('(t.status IN (1,2,3,4))')
        .select([
          't.mode',
          't.loanNo',
          't.referenceNo',
          't.createdAt',
          't.createdBy',
          't.amount',
          't.status',
          't.remarks',
          'r.remarks as razorpayRemarks',
          'u.name as createdByName',
          't.id',
        ])
        .leftJoin('razorpay_emOrder as r', 't.orderID', 'r.orderId')
        .leftJoin('users as u', 't.createdBy', 'u.userID')
        .orderBy('t.id', 'desc')
        .limit(perPage)
        .offset(page * perPage)
    }

    const formatCollectionData = (item: any) => ({
      referenceNo: item.referenceNo,
      loanNo: item.loanNo,
      amount: item.collectedAmount || item.amount,
      collectedMode: item.collectedMode || item.mode,
      remarks: item.remark || item.remarks || item.razorpayRemarks,
      refund_utr_no: item.refund_utr_no || '',
      collectedDateIST: formatToIST(item.collectedDate || item.createdAt),
      status:
        item.collectionStatus ||
        (item.status === 1
          ? 'Captured'
          : item.status === 2
          ? 'Pending'
          : item.status === 3
          ? 'Approved'
          : item.status === 4
          ? 'Rejected'
          : item.status),
      refundType: '',
      refundRemarks: '',
      approvedBy: item.collectedByName || item.createdByName || 'N/A',
      leadID: leadID,
      customerID: lead.customerID,
      productID: lead.productID,
      excessAmount: item.excess_amount,
      id: item.id, // collection or transaction Id
    })

    collectionData = collectionData.map(formatCollectionData)

    return this.serviceResponse(
      HttpStatusCode.Ok,
      {
        collection: collectionData,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
      'Success',
    )
  }

  async collectionFollowUp(leadID: number, isSanction: boolean) {
    const db = getKnexInstance()
    const collectionFollowUp = await db('collectionFollowup as cf')
      .leftJoin('users as u', 'cf.createdBy', 'u.userID')
      .leftJoin('leads as l', 'cf.leadID', 'l.leadID')
      .where('cf.leadID', leadID)
      .modify(query => {
        if (isSanction) {
          query.where('cf.followup_type', 1)
        }
      })
      .select(
        'cf.followType',
        'cf.createdBy',
        'cf.createdDate',
        'cf.StatusType',
        'cf.remark',
        'u.userID as createdByUserID',
        'u.name as createdByUserName',
      )
      .orderBy('cf.reviewID', 'desc')

    // Format follow-up data
    const formattedFollowUps = collectionFollowUp.map(followUp => ({
      ...followUp,
      collectedDateIST: formatToIST(followUp.createdDate),
      Executive: followUp.createdByUserName || 'N/A',
    }))

    return this.serviceResponse(
      HttpStatusCode.Ok,
      { collectionFollowUp: formattedFollowUps },
      'Success',
    )
  }

  async VirtualAccountTab(leadId: number, virtualAc: string, qrCode: string, userId: number) {
    const db = getKnexInstance()
    const date = new Date()
    if (virtualAc || qrCode) {
      const lead = await this.leadModel.findOneLead({ leadID: leadId }, [
        'customerID',
        'status',
        'leadID',
        'createdDate',
        'loanRequeried',
        'productID',
      ])
      if (!lead) {
        throw new BadRequestError('lead not found')
      }

      const customer = await db('customer').where({ customerID: lead.customerID }).first()
      if (!customer) {
        throw new BadRequestError('customer not found')
      }
      const virtualAccount = await this.virtualAccountModel.findOne({
        where: { customerID: customer.customerID },
        order: [{ column: 'credatedDate', order: 'desc' }],
      })
      if (virtualAccount) {
        const expiryDate = moment.utc(virtualAccount.credatedDate).add({ days: 90 })
        const diffInDays = expiryDate.diff(moment(), 'days')
        if (diffInDays >= 0) throw new BadRequestError('Virtual account already exists')
      }
      if (virtualAc && !virtualAccount) {
        const result = await this.createVirtualAccount(customer, lead, date, userId)
        if (result.status === 'error') {
          throw new BadRequestError('error while generating virtual Account')
        }
      }

      if (qrCode && !virtualAccount) {
        const result = await this.createQrCode(userId, customer, lead, date)
        if (result.status === 'error') {
          throw new BadRequestError('error while generating qr code ')
        }
      }
    }
    return this.serviceResponse(HttpStatusCode.Ok, {}, 'virtual account generating successfully')
  }

  private async createVirtualAccount(
    customer: any,
    lead: any,
    date: Date,
    userId: number,
  ): Promise<{ status: string; message?: string }> {
    const db = getKnexInstance()

    const trx = await db.transaction()
    try {
      const custID = await this.getOrCreateCustomer(customer, lead, date, userId)

      const name = `${customer.name}-${customer.mobile}-${lead.leadID}`
      const data = {
        receivers: { types: ['bank_account'] },
        description: name,
        customer_id: custID,
        close_by: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60, // Current time + 90 days in seconds
        notes: { project_name: name },
      }

      const response = await this.razorpayPg.razorpayVirtualAccount(
        'https://api.razorpay.com/v1/virtual_accounts',
        data,
      )

      if (response.data.status === 'error') {
        await trx.rollback()
        return { status: 'error', message: response.data.message }
      }

      const virtualAccount = response.data
      const vc1 = await trx('virtualAccount').insert({
        customerID: customer.customerID,
        leadID: lead.leadID,
        accounID: virtualAccount.id,
        name: virtualAccount.name,
        customer_id: virtualAccount.customer_id,
        recid: virtualAccount.receivers[0].id,
        entity: virtualAccount.receivers[0].entity,
        ifsc: virtualAccount.receivers[0].ifsc,
        bankName: virtualAccount.receivers[0].bank_name || '',
        recName: virtualAccount.receivers[0].name,
        account_number: virtualAccount.receivers[0].account_number,
        credatedDate: date,
        uid: userId,
      })

      if (vc1) {
        await trx.commit()
        return { status: 'success' }
      }

      await trx.rollback()
      return { status: 'error', message: 'Failed to create virtual account.' }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: (error as Error).message }
    }
  }

  private async createQrCode(
    userId: number,
    customer: any,
    lead: any,
    date: Date,
  ): Promise<{ status: string; message?: string }> {
    const db = getKnexInstance()

    // Start transaction
    const trx = await db.transaction()

    try {
      const custID = await this.getOrCreateCustomer(customer, lead, date, userId)

      const name = `${customer.name}-${customer.mobile}-${lead.leadID}`
      const data = {
        receivers: { types: ['bank_account'] },
        description: name,
        customer_id: custID,
        close_by: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60, // Current time + 90 days in seconds
        notes: { project_name: name },
      }
      const response = await this.razorpayPg.razorpayVirtualAccount(
        'https://api.razorpay.com/v1/virtual_accounts',
        data,
      )

      if (response.data.status === 'error') {
        await trx.rollback()
        return { status: 'error', message: response.data.message }
      }

      const virtualAccount = response.data
      const vc1 = await trx('virtualAccount').insert({
        customerID: customer.customerID,
        leadID: lead.leadID,
        accounID: virtualAccount.id,
        name: virtualAccount.name,
        customer_id: virtualAccount.customer_id,
        recid: virtualAccount.receivers[0].id,
        entity: virtualAccount.receivers[0].entity,
        ifsc: virtualAccount.receivers[0].ifsc,
        bankName: virtualAccount.receivers[0].bank_name || '',
        recName: virtualAccount.receivers[0].name,
        account_number: virtualAccount.receivers[0].account_number,
        credatedDate: date,
        uid: userId,
      })

      if (vc1) {
        await trx.commit()
        return { status: 'success' }
      }

      await trx.rollback()
      return { status: 'error', message: 'Failed to create QR code.' }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: (error as Error).message }
    }
  }
  private async getOrCreateCustomer(
    customer: any,
    lead: any,
    date: Date,
    userId: number,
  ): Promise<string> {
    const db = getKnexInstance()
    const existingCustomer = await db('virtualCustomer')
      .where({ customerID: customer.customerID })
      .first()

    if (!existingCustomer) {
      const data = {
        name: `${customer.name}-${customer.mobile}`,
        contact: customer.mobile,
        email: customer.email,
        fail_existing: '0',
      }
      const response = await this.razorpayPg.razorpayVirtualAccount(
        'https://api.razorpay.com/v1/customers',
        data,
      )

      if (response.data.status === 'error') {
        throw new Error(response.data.message)
      }

      const customerData = response.data
      await db('virtualCustomer').insert({
        customerID: customer.customerID,
        leadID: lead.leadID,
        custID: customerData.id,
        custName: customerData.name,
        custEmail: customerData.email,
        custMobile: customerData.contact,
        custPan: customer.pancard,
        credatedDate: date,
        uid: userId,
      })

      return customerData.id
    }

    return existingCustomer.custID
  }

  async EmandateCharges(leadID: number, page: number, perPage: number) {
    const db = getKnexInstance()
    //fetch count and data parallel
    const [query, totalCount] = await Promise.all([
      db('onlinepayment')
        .select(
          'onlinepayment.razorpayPaymentId',
          'onlinepayment.paymentType',
          'onlinepayment.razorpayOrderId',
          'onlinepayment.toValue',
          'onlinepayment.makerstamp',
          'onlinepayment.paymentStatus',
          'razorpay_emOrder.uid',
        )
        .join('razorpay_emOrder', function () {
          this.on('onlinepayment.leadID', '=', 'razorpay_emOrder.leadID').andOn(
            'onlinepayment.razorpayPaymentId',
            '=',
            'razorpay_emOrder.razorpay_payment_id',
          )
        })
        .where({
          'onlinepayment.leadID': leadID,
          'onlinepayment.typeProduct': 'Emandate',
        })
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.onlinePaymentModel.count({
        leadID: leadID,
        typeProduct: 'Emandate',
      }),
    ])

    const createdByIds = [...new Set(query.map(data => data.uid))]
    const users = await this.userModel.find({
      whereIn: [{ column: 'userID', value: createdByIds }],
      select: ['userID', 'name'],
    })
    const userMap = users.reduce((map, user) => {
      map[user.userID] = user.name
      return map
    }, {} as Record<number, string>)

    const response = query.map(data => ({
      ...data,
      DateIST: formatToIST(data.makerstamp),
      ChargedBY: userMap[data.uid] || 'N/A',
    }))

    const EmandateChargeData = {
      response,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / perPage),
    }
    return this.serviceResponse(HttpStatusCode.Ok, EmandateChargeData, 'Success')
  }

  async BankAccountDetails(leadID: number, page: number, perPage: number) {
    let leadData = await this.leadModel.findOneLead({ leadID: leadID }, ['customerID'])
    let AccountData = await this.customerAccountModel.find({
      where: { customerID: leadData.customerID },
      select: ['*'],
      order: [{ column: 'accountID', order: 'desc' }],
      paginate: { perPage, page },
    })

    const accountPromises = AccountData.map(async account => {
      const bankIfsc = await this.bankIfscModel.findOne({
        where: { IFSC: account.bankIfsc },
        select: ['BRANCH'],
      })
      return {
        ...account,
        bankBranch: bankIfsc?.BRANCH || '',
      }
    })

    // Resolve all promises to get accounts with branch info
    AccountData = await Promise.all(accountPromises)

    // Group accounts by account number, prioritizing verified status
    const accountMap = new Map()

    // First pass - group accounts and bank holder names by account number
    AccountData.forEach(account => {
      if (!accountMap.has(account.accountNo)) {
        accountMap.set(account.accountNo, {
          accounts: [account],
          holderNames: account.bank_holder_name ? [account.bank_holder_name] : [],
        })
      } else {
        const entry = accountMap.get(account.accountNo)
        entry.accounts.push(account)
        if (account.bank_holder_name && !entry.holderNames.includes(account.bank_holder_name)) {
          entry.holderNames.push(account.bank_holder_name)
        }
      }
    })

    // Second pass - select the best account for each account number
    const uniqueAccounts = []
    accountMap.forEach((entry, accountNo) => {
      // Prioritize accounts with status "Verified" (if any)
      const verifiedAccount = entry.accounts.find(acc => acc.status === 'Verified')
      // Otherwise take the most recent one (highest accountID)
      const bestAccount =
        verifiedAccount ||
        entry.accounts.reduce((prev, curr) => (curr.accountID > prev.accountID ? curr : prev))

      // Add the consolidated holder names to the best account
      uniqueAccounts.push({
        ...bestAccount,
        bank_holder_name:
          entry.holderNames.length > 1 ? entry.holderNames.join(', ') : entry.holderNames[0] || '',
      })
    })

    // Replace AccountData with unique accounts
    AccountData = uniqueAccounts

    // Update total count
    let totalCount = AccountData?.length ?? 0

    const customerAccountData = {
      AccountData,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / perPage),
    }

    return this.serviceResponse(HttpStatusCode.Ok, customerAccountData, 'Success')
  }

  async getSOA(customerId: number, page: number, perPage: number) {
    const db = getKnexInstance()
    const offset = (page - 1) * perPage

    const loanData = await db('loan')
      .where('customerID', customerId)
      .where('status', 'Disbursed')
      .select('loanNo', 'disbursalAmount', 'leadId', 'payout_status as payoutStatus')
      .limit(perPage)
      .offset(offset)

    const leadIds = loanData.map(loan => loan.leadId)
    const leadProductData = await db('leads')
      .whereIn('leadID', leadIds)
      .select('leadID', 'productID')

    const productIdMap = new Map(leadProductData.map(lead => [lead.id, lead.productID]))

    const processedData = await Promise.all(
      loanData.map(async loan => {
        const productID = productIdMap.get(loan.leadId)

        if (productID === 1) {
          const collectionData = await db('transactions')
            .where('leadId', loan.leadId)
            .where('emiID', 0)
            .whereIn('status', [1, 3])
            .sum({ totalCollectedAmount: 'amount' })
            .max({ lastCollectedDate: 'transactionDate' })
            .first()
          return {
            ...loan,
            totalCollectedAmount: collectionData?.totalCollectedAmount || 0,
            lastCollectedDate: collectionData?.lastCollectedDate
              ? formatToIST(collectionData.lastCollectedDate)
              : null,
          }
        } else {
          const collectionData = await db('collection')
            .where('leadId', loan.leadId)
            .where('collectionStatus', 'Approved')
            .sum({ totalCollectedAmount: 'collectedAmount' })
            .max({ lastCollectedDate: 'collectedDate' })
            .first()
          return {
            ...loan,
            totalCollectedAmount: collectionData?.totalCollectedAmount || 0,
            lastCollectedDate: collectionData?.lastCollectedDate
              ? formatToIST(collectionData.lastCollectedDate)
              : null,
          }
        }
      }),
    )
    let totalCount = await this.loanModel.count({
      customerID: customerId,
      status: 'Disbursed',
    })
    const soaData = {
      result: processedData,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
    }
    return this.serviceResponse(HttpStatusCode.Ok, soaData, 'Success')
  }

  virtualAccountDetails = async (leadID: number) => {
    const leadDetails = await this.leadModel.findOneLead({ leadID })
    if (!leadDetails) throw new BadRequestError('Lead not found')
    let AccountData = await this.virtualAccountModel.find({
      where: { customerID: `${leadDetails.customerID}` },
      select: ['account_number', 'ifsc', 'name', 'credatedDate'],
      order: [{ column: 'credatedDate', order: 'desc' }],
      paginate: { perPage: 1, page: 0 },
    })

    let baseUrl = await this.commonHelper.getBaseUrl()
    AccountData = AccountData.map(account => {
      const createdDate = new Date(account.credatedDate)
      const accountValidity = new Date(createdDate)
      accountValidity.setDate(createdDate.getDate() + 90)

      return {
        ...account,
        accountValidity: accountValidity.toISOString().split('T')[0],
      }
    })
    const virtualAccountData = {
      AccountData,
      link: `${baseUrl}/pay-now/`,
    }

    return this.serviceResponse(HttpStatusCode.Ok, virtualAccountData, 'Success')
  }

  async generateSoaByLeadId(leadID: number, customerID: number): Promise<IServiceResponse> {
    try {
      const data = await this.getEmisLoanDetails(leadID, customerID)
      const templatePath = path.join(__dirname, '..', 'views', 'loansDocs', 'soa.ejs')
      let renderedHtml = await ejs.renderFile(templatePath, { data })
      renderedHtml = renderedHtml.replace(/\n/g, '')

      return this.serviceResponse(200, { renderedHtml }, 'SOA rendered successfully')
    } catch (err) {
      throw err
    }
  }

  async generateSoaPaydayByLeadId(leadID: number, customerID: number): Promise<IServiceResponse> {
    try {
      const loanDetails = await this.getPaydayLoanDetails(leadID, customerID)
      let db = getKnexInstance()
      const approval = await db('approval')
        .where('customerID', customerID)
        .where('leadID', leadID)
        .where('status', 'Approved')
        .first()

      if (!approval) {
        throw new NotFoundError('No approval record found.')
      }

      const lead = await db('leads')
        .where('leadID', leadID)
        .select('kfs_ip', 'ipc', 'leadID', 'status')
        .first()

      const customer = await db('customer').where('customerID', approval.customerID).first()

      if (!customer) {
        throw new NotFoundError('No customer record found.')
      }

      // Fetch the loan record
      const loan = await db('loan')
        .where('customerID', customer.customerID)
        .where('leadID', approval.leadID)
        .first()

      const Data = {
        lead,
        loan,
        approval,
      }
      const data = await this.processLeadData(Data)
      const templatePath = path.join(__dirname, '..', 'views', 'loansDocs', 'payday.ejs')
      let htmlContent = await ejs.renderFile(templatePath, {
        statementDate: formatToISTDate(new Date()),
        startDate: loanDetails[0]?.disbursalDate
          ? formatToISTDate(new Date(loanDetails[0].disbursalDate))
          : null,
        endDate: data?.collectionDetailsLast?.collectedDate
          ? formatToISTDate(data?.collectionDetailsLast?.collectedDate)
          : null,
        customerDetails: {
          name: loanDetails[0].customerName,
          address: loanDetails[0].address,
          pan: loanDetails[0].pancard,
          mobile: loanDetails[0].mobile,
          loanNo: loanDetails[0].loanNo,
          branch: 'Delhi',
          product: 'Pay Day Loan',
        },
        loanDetails: {
          roi: loanDetails[0].roi,
          interestRateType: loanDetails[0].interestRateType,
          tenure: loanDetails[0].tenure,
          penalty: loanDetails[0].penaltyCharge,
          bounceCharge: loanDetails[0].bounceCharge,
          status: loanDetails[0].status,
          loanAmount: loanDetails[0].loanAmtApproved,
          amountDisbursed: loanDetails[0].disbursalAmount,
          pfGst: loanDetails[0].pfAndGst,
          totalRepayment: loanDetails[0].totalRepayAmount,
        },
        paymentSummary: {
          amountOverdue: data.totalAmountOverdue,
          amountPaid: data.totalCollectedSum,
          principalPaid: data.totalCollectedPrincipal,
          interestPaid: data.totalCollectedPrincipal,
          chargesPaid: data.totalCollectedPenality,
          excess: data.totalExcessAmount,
          otherCharges: data.otherCharges,
          bounceCount: data.dpd > 0 ? 1 : 0,
          dpd: data.dpd,
          settlementWaiver: data.settlementWaiver,
          closureWaiver: data.closedWaiver,
        },
        transactionDetails: data.transactionDataEmi,
        totalSummary: {
          debit: data.totalSummary.debit,
          credit: data.totalSummary.credit,
        },
      })
      htmlContent = htmlContent.replace(/\n/g, '')

      return this.serviceResponse(200, { htmlContent }, 'SOA rendered successfully')
    } catch (err) {
      throw err
    }
  }

  public async getEmisLoanDetails(leadId: number, customerId: number) {
    let db = getKnexInstance()
    let customerData = await this.customerModel.findOneCustomer(
      { customerID: customerId },
      ['name', 'pancard', 'mobile'],
      [{ column: 'customerID', order: 'desc' }],
    )
    let address = await this.addressModel.findOneAddress(
      { customerID: customerId },
      ['address'],
      [{ column: 'addressID', order: 'desc' }],
    )
    let loanData = await db('loan')
      .join('leads', 'loan.leadID', '=', 'leads.leadID')
      .join('credits', 'loan.leadID', '=', 'credits.leadID')
      .join('approval', 'approval.leadID', '=', 'leads.leadID')
      .select(
        'loan.loanNo',
        'loan.payout_status',
        'loan.disbursalDate',
        'loan.disbursalAmount',
        'loan.deduction',
        'leads.productID',
        'leads.status',
        'credits.roi',
        'credits.gst',
        'credits.tenure',
        'credits.interest',
        'credits.repaymentAmount',
        'credits.processingFee',
        'credits.principal',
        'credits.amountToBeRepayed',
        'approval.loanAmtApproved',
      )
      .where('loan.leadID', leadId)
      .andWhere('leads.leadID', leadId)
      .andWhere('credits.leadID', leadId)

    if (loanData[0].payout_status != 2) {
      throw new BadRequestError('Please wait until payout status changes')
    }

    const credit = await this.creditService.findOne({ leadID: leadId }, [
      'creditID',
      'leadID',
      'tenure',
      'amountToBeRepayed',
      'principal',
      'firstDueDate',
      'roi',
      'created_at',
      'processingFee',
      'gst',
    ])

    const getEmis = await this.emiService.find(
      { creditID: credit.creditID, is_deleted: 0 },
      [{ column: 'emiID', order: 'asc' }],
      [
        'principal',
        'interest',
        'panelty',
        'amountPayable',
        'dueDate',
        'status',
        'brokenPeriodIntrest',
        'amountRemains',
        'amountRemainsInterest',
        'amountRemainsPenalty',
        'amountRemainsBrokenPeriodIntrest',
        'paymentReceived',
        'actualPaymentDate',
        'emiID',
        'creditID',
        'customerID',
        'leadID',
        'productID',
        'is_deleted',
        'accessAmount',
        'waive_off_amount',
      ],
    )
    let emiAmount: number = getEmis[0].amountPayable
    const processedEmis = await Promise.all(
      getEmis.map(async emi => this.emiService.processEmi(emi, credit)),
    )

    let InterestPaid: number = 0
    let InstallmentOverdue: number = 0
    let InstallmentPaid: number = 0
    let PrincipalPaid: number = 0
    let outStandingAmount: number = 0
    let otherChargesPaid: number = 0
    let penaltyInterest: number = 0
    let dpd: number = 0
    let writeOffPrincipal: number = 0
    let writeOffInterest: number = 0
    let writeOffCharges: number = 0

    // penaltyInterest = Math.round((credit.roi / 365 + 0.1) * 365)
    penaltyInterest = +config.ipcDpdInterest * 365

    let totalAmountToBePaid: number = 0
    let flag = false
    processedEmis.forEach(emi => {
      totalAmountToBePaid += emi.amountPayable

      if (emi.status === 'Paid' || emi.status === 'Part Paid') {
        const amountRemainsInterest = emi.amountRemainsInterest ?? 0
        const amountRemainsPenalty = emi.amountRemainsPenalty ?? 0
        const amountRemainsBrokenPeriodIntrest = emi.amountRemainsBrokenPeriodIntrest ?? 0

        InterestPaid +=
          emi.interest +
          emi.brokenPeriodIntrest +
          emi.panelty -
          (amountRemainsInterest + amountRemainsBrokenPeriodIntrest + amountRemainsPenalty)
      }
      if (emi.status === 'Overdue') {
        InstallmentOverdue += emi.amountPayable
      }
      if (emi.status === 'Paid') {
        InstallmentPaid += +emi.paymentReceived
      }
      if (emi.status === 'Paid' || emi.status === 'Part Paid') {
        PrincipalPaid += emi.principal - emi.amountRemains
      }
      if (emi.status != 'Paid') {
        outStandingAmount += emi.amountPayable
      }
      if (emi.status === 'Paid' || emi.status === 'Part Paid') {
        otherChargesPaid += emi.brokenPeriodIntrest - emi.amountRemainsBrokenPeriodIntrest
      }
      // if (emi.status !== 'paid' && dueDate < currentDate) {
      //   dpd = differenceInCalendarDays(currentDate, dueDate); // Calculate Days Past Due
      // }
      const dueDate = new Date(emi.dueDate)
      const currentDate = new Date()
      if (flag === false && emi.status != 'Paid' && dueDate < currentDate) {
        dpd = differenceInCalendarDays(currentDate, dueDate)
        flag = true
      }
    })
    const transactions = []
    let totalDebit: number = 0
    let totalCredit: number = 0
    const deletedRows = await db('equated_monthly_installments')
      .select('emiID')
      .where({ leadID: leadId, is_deleted: 1 })

    if (deletedRows.length > 0) {
      const result = await db('equated_monthly_installments')
        .sum({
          totalAmountRemains: 'amountRemains',
          totalAmountRemainsInterest: 'amountRemainsInterest',
          totalAmountRemainPenalty: 'amountRemainsPenalty',
        })
        .where({ leadId, is_deleted: 0, status: 'paid' })

      writeOffPrincipal = result[0].totalAmountRemains
      writeOffInterest = result[0].totalAmountRemainsInterest
      writeOffCharges = result[0].totalAmountRemainPenalty
    }
    let result = []
    result[0] = []
    result[0].length = 0
    const emiTransaction = await db.raw(
      `
      SELECT emiID
      FROM equated_monthly_installments
      WHERE leadID = ?
      AND status IN ('paid', 'partially-paid')
      ORDER BY emiID DESC
    `,
      [leadId],
    )

    if (emiTransaction[0].length > 0) {
      const emiID = emiTransaction[0]
      const emiIDs = emiID.map(item => item.emiID)

      result = await db.raw(
        `
      SELECT emi_id, interest, principal, penalty, dpd_amount,transaction_date
      FROM emi_transactions
      WHERE emi_id IN (?)
    `,
        [emiIDs],
      )
    }
    let closingBalance = loanData[0].loanAmtApproved
    transactions.push(
      {
        txnDate: loanData[0].disbursalDate,
        particular: 'PAID - Loan Disbursal',
        debit: '',
        credit: loanData[0].loanAmtApproved,
        closingBalance: closingBalance,
      },
      {
        txnDate: formatToISTDate(credit.created_at),
        particular: 'DUE - Processing fee charged',
        debit: credit.processingFee,
        credit: '',
        closingBalance: closingBalance,
      },
      {
        txnDate: formatToISTDate(credit.created_at),
        particular: 'DUE - GST charged',
        debit: credit.gst,
        credit: '',
        closingBalance: closingBalance,
      },
    )
    totalDebit += credit.processingFee + credit.gst

    const getOrdinal = (n: number): string => {
      const suffix = ['th', 'st', 'nd', 'rd']
      const value = n % 100
      return n + (suffix[(value - 20) % 10] || suffix[value] || suffix[0])
    }
    const emiGroupMap: Record<number, any[]> = {}
    const finalParticulars: any[] = []

    if (result[0].length > 0) {
      result[0].forEach(item => {
        if (!emiGroupMap[item.emi_id]) {
          emiGroupMap[item.emi_id] = []
        }
        emiGroupMap[item.emi_id].push(item)
      })
      // const finalParticulars: any[] = []
      let emiIndex = 1
      for (const emi_id in emiGroupMap) {
        const iterationLabel = getOrdinal(emiIndex)

        emiGroupMap[emi_id].forEach(item => {
          if (parseFloat(item.interest) > 0) {
            finalParticulars.push({
              particular: `PAID - Interest for ${iterationLabel} EMI Installment`,
              credit: item.interest,
              transactionDate: item.transaction_date,
            })

            finalParticulars.push({
              particular: `DUE - Interest for ${iterationLabel} EMI Installment`,
              debit: item.interest,
              transactionDate: item.transaction_date,
            })
          }

          if (parseFloat(item.principal) > 0) {
            finalParticulars.push({
              particular: `DUE - Principal for ${iterationLabel} EMI Installment`,
              debit: item.principal,
              transactionDate: item.transaction_date,
            })
          }

          if (parseFloat(item.penalty) > 0) {
            finalParticulars.push({
              particular: `Charges for ${iterationLabel} EMI Installment`,
              credit: item.penalty,
              transactionDate: item.transaction_date,
            })

            finalParticulars.push({
              particular: `Charges for ${iterationLabel} EMI Installment`,
              debit: item.penalty,
              transactionDate: item.transaction_date,
            })
          }

          if (parseFloat(item.dpd_amount) > 0) {
            finalParticulars.push({
              particular: `Bounce Charges for ${iterationLabel} EMI`,
              credit: item.dpd_amount,
              transactionDate: item.transaction_date,
            })

            finalParticulars.push({
              particular: `Bounce Charges for ${iterationLabel} EMI`,
              debit: item.dpd_amount,
              transactionDate: item.transaction_date,
            })
          }
        })

        emiIndex++
      }
    }
    let debitAmount: number = 0
    let creditAmount: number = 0

    finalParticulars.forEach(item => {
      debitAmount = item.debit > 0 ? item.debit : 0
      creditAmount = item.credit > 0 ? item.credit : 0

      if (item.debit > 0) {
        closingBalance -= +item.debit
      } else if (item.credit > 0) {
        closingBalance += +item.credit
      }
      if (item.debit > 0 || item.credit > 0) {
        transactions.push({
          txnDate: formatToISTDate(item.transactionDate),
          particular: item.particular,
          debit: item.debit,
          credit: item.credit,
          closingBalance: Math.round(closingBalance),
        })
      }
      totalDebit += debitAmount
      totalCredit += creditAmount
    })
    const transactionDate = await db('equated_monthly_installments')
      .where({
        leadId: leadId,
        status: 'paid',
        is_deleted: 0,
      })
      .orderBy('emiID', 'desc')
      .select('emiID', 'actualPaymentDate')
      .limit(1)

    if (writeOffInterest > 0) {
      transactions.push({
        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
        particular: 'Write off Interest',
        debit: '',
        credit: writeOffInterest,
        closingBalance: closingBalance + writeOffInterest,
      })
      closingBalance += +writeOffInterest

      transactions.push({
        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
        particular: 'Write off Interest',
        debit: writeOffInterest,
        credit: '',
        closingBalance: closingBalance - writeOffInterest,
      })
      closingBalance -= +writeOffInterest
    }
    if (writeOffCharges > 0) {
      transactions.push({
        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
        particular: 'Write off Charges',
        debit: '',
        credit: writeOffCharges,
        closingBalance: closingBalance + writeOffCharges,
      })
      closingBalance += +writeOffCharges

      transactions.push({
        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
        particular: 'Write off Charges',
        debit: writeOffCharges,
        credit: '',
        closingBalance: closingBalance - writeOffCharges,
      })
      closingBalance -= +writeOffCharges
    }
    if (writeOffPrincipal > 0) {
      transactions.push({
        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
        particular: 'Write off Principle',
        debit: writeOffPrincipal,
        credit: '',
        closingBalance: closingBalance - writeOffPrincipal,
      })
      closingBalance -= +writeOffPrincipal
    }

    const formatDate = (date: string): string => {
      const dateObj = new Date(date)
      return dateObj.toISOString().split('T')[0]
    }
    const firstDueDate = new Date(credit.firstDueDate)
    const tenureInMonths = credit.tenure - 1

    const newDate = addMonths(firstDueDate, tenureInMonths)

    // Format the new date into the desired format
    const formattedDate = format(newDate, 'yyyy-MM-dd')
    const totalData = {
      date: formatToISTDate(new Date()),
      fromDate: loanData[0].disbursalDate,
      toDate: formatToISTDate(new Date()),
      customer: {
        name: customerData.name,
        mobile: customerData.mobile,
        pancard: customerData.pancard,
      },
      address: {
        address: address.address,
      },
      loan: {
        type: 'EMI',
        loanNo: loanData[0].loanNo,
        disbursalDate: loanData[0].disbursalDate,
        product: 'EMI (Personal Loan)',
      },
      emi: {
        installmentPeriod: `${format(firstDueDate, 'yyyy-MM-dd')} - ${formattedDate}`,
        emiAmount: emiAmount,
        roi: credit.roi,
        penaltyInterest: penaltyInterest,
        writeOffAmount: {
          principle: writeOffPrincipal,
          interest: writeOffInterest,
          charges: writeOffCharges,
        },
        dpd: loanData[0].status === 'Closed' ? 0 : dpd,
        restructured: false,
        processingFee: credit.processingFee,
        gst: credit.gst,
        tenure: credit.tenure,
        loanAmount: loanData[0].loanAmtApproved,
        disbursedAmount: loanData[0].disbursalAmount - loanData[0].deduction,
        repayAmount: credit.amountToBeRepayed,
        installmentOverdue: InstallmentOverdue,
        installmentPaid: Math.round(InstallmentPaid),
        principlePaid: PrincipalPaid,
        interestPaid: Math.round(InterestPaid),
        otherChargesPaid: otherChargesPaid,
        outstandingAmount: outStandingAmount,
      },
      totalDebit: totalDebit,
      totalCredit: totalCredit,
      transactions,
    }
    return totalData
  }

  private getPaydayLoanDetails = async (leadID: number, customerID: number) => {
    let db = getKnexInstance()
    const loanDetails = await db('loan')
      .join('customer', 'loan.customerID', '=', 'customer.customerID')
      .join('address', 'loan.customerID', '=', 'address.customerID')
      .leftJoin('approval', 'loan.leadID', '=', 'approval.leadID')
      .where('loan.leadID', leadID)
      .whereIn('loan.status', ['Disbursed', 'Part Payment', 'Settlement'])
      .orderBy('loan.loanID', 'desc')
      .select(
        'loan.*',
        'customer.name',
        'approval.loanAmtApproved',
        'approval.roi',
        'approval.adminFee',
        'approval.GstOfAdminFee',
        'approval.tenure',
        'approval.repayDate',
        'customer.pancard',
        'customer.mobile',
        'address.address',
      )

    const statements = await Promise.all(
      loanDetails.map(async loan => {
        const disbursalDate = loan.disbursalDate
        const disbursalAmount = loan.disbursalAmount
        const customerName = loan.name || ''
        const repayDate = loan.repayDate
        const roi = loan.roi
        const mobile = loan.mobile
        const address = loan.address
        const loanAmtApproved = loan.loanAmtApproved
        const pfAndGst = loan.adminFee + loan.GstOfAdminFee

        const tenure = Math.round(
          (new Date(repayDate).getTime() - new Date(disbursalDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )

        const totalAmount = parseFloat(
          ((tenure * roi * disbursalAmount) / 100 + disbursalAmount).toFixed(2),
        )

        const debit = disbursalAmount - loan.deduction
        let closingBalance = debit

        const ipcCount = await db('leads')
          .where('leadID', loan.leadID)
          .where('ipc', 1)
          .count('leadID as count')
          .first()

        const collectionDetails = ipcCount.count
          ? await db('collection')
              .where('leadID', loan.leadID)
              .whereIn('collectionStatus', ['Approved', 'Approved-refunded'])
              .select()
          : []

        return {
          customerName,
          loanNo: loan.loanNo,
          pancard: loan.pancard,
          mobile: mobile,
          address: address,
          interestRateType: 'Reducing',
          status: 'Disbursed',
          adminFeePercentage: parseFloat(((loan.adminFee / disbursalAmount) * 100).toFixed(2)),
          gstOnAdminFee: 18,
          bounceCharge: 590,
          disbursalAmount,
          totalRepayAmount: totalAmount,
          disbursalDate: new Date(disbursalDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          repayDate: new Date(repayDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          roi,
          tenure,
          loanAmtApproved,
          pfAndGst,
          penaltyCharge: '0.1',
        }
      }),
    )
    return statements
  }

  private processLeadData = async (data: any) => {
    let db = getKnexInstance()
    const leads = data.lead
    const approval = data.approval
    const loan = data.loan
    let finalWaiveOffAmount = 0
    let settlementWaiver = 0
    let closedWaiver = 0
    let dpd = 0

    const totalCollectedSum = await db('collection')
      .where('collectionStatus', 'Approved')
      .whereNot('collectedMode', 'Waive Off')
      .where('leadID', leads.leadID)
      .sum('collectedAmount as sum')
      .then(res => res[0]?.sum || 0)

    const totalWaiveOff = await db('collection')
      .where('collectionStatus', 'Approved')
      .where('collectedMode', 'Waive Off')
      .where('leadID', leads.leadID)
      .sum('collectedAmount as sum')
      .then(res => res[0]?.sum || 0)

    const totalCollectedPrincipal = await db('collection')
      .where('collectionStatus', 'Approved')
      .where('leadID', leads.leadID)
      .sum('collected_principal as sum')
      .then(res => res[0]?.sum || 0)

    const totalCollectedInterest = await db('collection')
      .where('collectionStatus', 'Approved')
      .where('leadID', leads.leadID)
      .sum('collected_interest as sum')
      .then(res => res[0]?.sum || 0)

    const totalCollectedPenality = await db('collection')
      .where('collectionStatus', 'Approved')
      .where('leadID', leads.leadID)
      .sum('collected_penality as sum')
      .then(res => res[0]?.sum || 0)

    const totalExcessAmount = await db('collection')
      .where('collectionStatus', 'Approved')
      .where('leadID', leads.leadID)
      .sum('excess_amount as sum')
      .then(res => res[0]?.sum || 0)

    const lastCollectionDate = await db('collection')
      .where('collectionStatus', 'Approved')
      .whereIn('status', ['Closed', 'Settlement'])
      .where('leadID', leads.leadID)
      .orderBy('collectionID', 'desc')
      .first()

    if (lastCollectionDate) {
      finalWaiveOffAmount = await db('collection')
        .where('collectionStatus', 'Approved')
        .where('status', 'Settlement')
        .where('leadID', leads.leadID)
        .sum('discount_waiver_amount as sum')
        .then(res => res[0]?.sum || 0)

      if (lastCollectionDate.discount_waiver === 'waiver') {
        settlementWaiver = finalWaiveOffAmount
      } else {
        closedWaiver = finalWaiveOffAmount
      }
    }

    const tenure = Math.floor(
      (new Date(approval.repayDate).getTime() - new Date(loan.disbursalDate).getTime()) /
        (1000 * 60 * 60 * 24),
    )

    // const dueDateRepayAmount = Number(
    //   (
    //     tenure * (approval.roi / 100) * loan.disbursalAmount +
    //     loan.disbursalAmount
    //   ).toFixed(2),
    // )

    const repaymentData = await this.calculateTotalRepayPaydayAmountIPC(leads.leadID, leads.status)
    let totalAmountOverdue = Number(repaymentData.totalRepayAmount)
    let otherCharges = repaymentData.charges
    if (leads.status != 'Disbursed' || leads.status != 'Part Payment') {
      totalAmountOverdue = 0
      otherCharges = 0
    }

    if (
      new Date().toISOString().split('T')[0] > approval.repayDate &&
      leads.status !== 'Closed' &&
      leads.status !== 'Settlement'
    ) {
      dpd = Math.floor(
        (new Date().getTime() - new Date(loan.disbursalDate).getTime()) / (1000 * 60 * 60 * 24),
      )
    } else if (
      new Date().toISOString().split('T')[0] > approval.repayDate &&
      (leads.status === 'Closed' || leads.status === 'Settlement') &&
      lastCollectionDate
    ) {
      dpd = Math.floor(
        (new Date(lastCollectionDate.collectedDate).getTime() -
          new Date(loan.disbursalDate).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    }

    if (dpd > 0) {
      dpd -= tenure
    }

    const collectionDetails = await db('collection')
      .where('leadID', leads.leadID)
      .where('collectionStatus', 'Approved')
      .select()

    const collectionDetailsFirst = await db('collection')
      .where('leadID', leads.leadID)
      .where('collectionStatus', 'Approved')
      .first()

    const collectionDetailsLast = await db('collection')
      .where('leadID', leads.leadID)
      .where('collectionStatus', 'Approved')
      .orderBy('collectionID', 'desc')
      .first()

    const otherData = ''
    const transactionData = await this.generateTransactionDetails(
      leads.leadID,
      collectionDetails,
      approval,
      +config.dpdPenalty,
      +config.dpdPenaltyGstPercentage,
    )
    const transactionDataEmi = transactionData.transactionDetails
    const totalSummary = transactionData.totalSummary
    return {
      otherCharges,
      totalAmountOverdue,
      totalCollectedSum,
      totalWaiveOff,
      totalCollectedPrincipal,
      totalCollectedInterest,
      totalCollectedPenality,
      totalExcessAmount,
      finalWaiveOffAmount,
      settlementWaiver,
      closedWaiver,
      dpd,
      collectionDetails,
      collectionDetailsFirst,
      collectionDetailsLast,
      otherData,
      transactionDataEmi,
      totalSummary,
    }
  }
  private calculateTotalRepayPaydayAmountIPC = async (
    leadID: number,
    status: string,
  ): Promise<{ totalRepayAmount: number; charges: number }> => {
    const db = getKnexInstance()
    const today = new Date()
    const loan = await loanModel.findOneLoan(
      { leadID: leadID },
      ['loanNo', 'disbursalDate', 'disbursalAmount', 'customerID'],
      [{ column: 'loanID', order: 'desc' }],
    )

    const approval = await approvalModel.findOneApproval(
      { leadID: leadID },
      ['repayDate', 'roi'],
      [{ column: 'approvalID', order: 'desc' }],
    )

    const principalAmount = loan.disbursalAmount
    const disbursalDate =
      typeof loan.disbursalDate === 'string' ? parseISO(loan.disbursalDate) : loan.disbursalDate

    const repayDate =
      typeof approval.repayDate === 'string' ? parseISO(approval.repayDate) : approval.repayDate

    let dpdDiff = differenceInCalendarDays(today, repayDate)
    let sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate)

    let totalInterest = (principalAmount * (dpdDiff + sanctionDiff) * approval.roi) / 100

    const dpdPenalty = Number(config.dpdPenalty)
    const dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage)
    const penaltyAmount = dpdPenalty * (1 + dpdPenaltyGst / 100)
    let charges =
      ((dpdDiff * Number(config.ipcDpdInterest)) / 100) * principalAmount + penaltyAmount

    let totalRepayAmount = principalAmount + totalInterest + charges

    if (status === 'Disbursed') {
      if (today <= repayDate) {
        sanctionDiff = differenceInCalendarDays(today, disbursalDate)
      } else {
        sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate)
        totalInterest = (principalAmount * (dpdDiff + sanctionDiff) * approval.roi) / 100
        charges =
          ((dpdDiff * Number(config.ipcDpdInterest)) / 100) * principalAmount + penaltyAmount
      }
    } else if (status === 'Part Payment') {
      const collection = await db('collection')
        .where({
          customerID: loan.customerID,
          leadID: leadID,
          loanNo: loan.loanNo,
          status: 'Part Payment',
          collectionStatus: 'Approved',
        })
        .orderBy('collectionID', 'desc')
        .first()

      if (collection) {
        const {
          principal_amount,
          closing_balance,
          collectedDate,
          penality_charge,
          total_interest,
        } = collection
        const penaltyBalance = penality_charge

        let penaltyAmountAdjustment = penaltyBalance ? 0 : penaltyAmount
        totalInterest = (principal_amount * (dpdDiff + sanctionDiff) * approval.roi) / 100

        if (today <= repayDate) {
          sanctionDiff = differenceInCalendarDays(today, collectedDate)
        } else {
          if (today >= repayDate && repayDate >= collectedDate) {
            sanctionDiff = differenceInCalendarDays(repayDate, collectedDate)
            dpdDiff = differenceInCalendarDays(today, repayDate)
          } else {
            dpdDiff = differenceInCalendarDays(today, collectedDate)
          }
        }

        charges =
          ((dpdDiff * Number(config.ipcDpdInterest)) / 100) * principal_amount +
          penaltyAmountAdjustment
        totalRepayAmount = Number(closing_balance ?? principal_amount) + totalInterest + charges
      }
    }

    return { totalRepayAmount, charges }
  }
  async noDuesByLead(payload: INoDuesPayload): Promise<IServiceResponse> {
    const { leadID, customerID } = payload
    let customer = await this.customerModel.findOneCustomer({ customerID }, ['customerID', 'name'])
    if (!customer) {
      throw new NotFoundError('Customer not found')
    }

    let lead = await this.findOne({ leadID }, ['*'])
    if (!lead) {
      throw new NotFoundError('Lead not found')
    }
    let loan = await this.loanService.findOne({ leadID, customerID }, [
      'leadID',
      'disbursalAmount',
      'disbursalDate',
      'loanNo',
    ])
    if (!loan) {
      throw new NotFoundError('loan not found')
    }
    const db = getKnexInstance()
    let collectedDate = null

    if (lead.productID === ProductID.PAYDAY) {
      const collection = await db('collection')
        .join('loan', 'loan.leadID', '=', 'collection.leadID')
        .select('collection.collectedDate')
        .where('loan.leadID', leadID)
        .where('collection.status', 'Closed')
        .orderBy('collection.collectionID', 'desc')
        .first()

      collectedDate = collection ? collection.collectedDate : null
    } else if (lead.productID === ProductID.EMI) {
      const transaction = (await db('transactions')
        .select(
          db.raw('COALESCE(transactions.transactionDate, transactions.createdAt) AS collectedDate'),
        )
        .where('transactions.leadID', leadID)
        .whereIn('transactions.status', [1, 3])
        .orderBy('transactions.id', 'desc')
        .first()) as { collectedDate?: string } | undefined

      collectedDate = transaction ? transaction.collectedDate : null
    }
    let res = {
      customerID: customer.customerID,
      leadID: loan.leadID,
      name: customer.name,
      email: customer.email,
      loanNo: loan.loanNo,
      disbursalAmount: loan.disbursalAmount,
      disbursalDate: moment(loan.disbursalDate).format('Do MMM, YYYY'),
      currentDate: moment().format('Do MMM, YYYY'),
      collectedDate: moment(collectedDate).format('Do MMM, YYYY'),
    }

    return this.serviceResponse(200, res, 'No Dues Data retreived successfully.')
  }

  async convertImageUrlToBase64(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      const base64Image = Buffer.from(response.data, 'binary').toString('base64')
      return `data:image/jpeg;base64,${base64Image}`
    } catch (error) {
      console.error('Error fetching or encoding image:', error)
      throw error
    }
  }

  async noDuesPdf(payload: INoDuesPayload): Promise<Readable> {
    return new Promise(async (resolve, reject) => {
      try {
        let noDuesData = await this.noDuesByLead(payload)
        const templatePath = path.resolve(__dirname, '../views/loansDocs/noDues.ejs')
        const htmlContent = await ejs.renderFile(templatePath, {
          data: noDuesData.data,
        })

        // Convert the S3 image URLs to base64
        const headerUrl =
          'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg'
        const footerUrl =
          'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg'

        const headerImage = await this.convertImageUrlToBase64(headerUrl)
        const footerImage = await this.convertImageUrlToBase64(footerUrl)

        const browser = await puppeteer.launch({
          executablePath: '/usr/bin/chromium-browser',
        })
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
          format: 'A4',
          displayHeaderFooter: true,
          headerTemplate: `<div class="header" style="width: 100%; text-align: center;">
            <img src="${headerImage}" style="width:100%; max-height:150px; margin-top: -20px">
          </div>`,
          footerTemplate: `<div class="footer" style="width: 100%; text-align: center;">
            <img src="${footerImage}" style="width:100%; max-height:150px; margin-bottom: -18px">
          </div>`,
          margin: {
            top: '150px',
            bottom: '100px',
          },
        })

        await browser.close()
        if (pdfBuffer) {
          let s3FolderName = 'documents/noDues/' + payload.customerID
          let imageName = 'noDues_' + Math.floor(Date.now() / 1000) + '.pdf'
          let res = await this.s3Service.uploadDocument(
            Buffer.from(pdfBuffer),
            s3FolderName,
            imageName,
          )

          if (res && res?.Key !== null && res.Key !== '') {
            await this.documentModel.insert({
              customerID: payload.customerID,
              type: 'No Dues',
              documentType: 'No Dues',
              documentFile: res.Key,
              status: 'Verified',
              uploadBy: payload.customerID,
              uploadedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
              verifiedBy: payload.customerID,
              verifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
              upload_platform: 'S3',
            })
          }
        }
        // Convert the buffer to a readable stream
        const pdfStream = new Readable()
        pdfStream.push(pdfBuffer)
        pdfStream.push(null)

        resolve(pdfStream)
      } catch (err) {
        reject(err)
      }
    })
  }

  async getTenure(disbursalDate: Date, repayDate: string): Promise<number> {
    try {
      // Convert dates to timestamps
      const disbursalTimestamp = new Date(disbursalDate).getTime()
      const repayTimestamp = new Date(repayDate).getTime()

      // Calculate the difference in seconds, then convert to days
      const daysDifference = Math.abs((repayTimestamp - disbursalTimestamp) / (1000 * 60 * 60 * 24))

      return Math.round(daysDifference)
    } catch (error) {
      console.error('Error fetching or encoding image:', error)
      throw error
    }
  }

  async disbursalByLead(payload: INoDuesPayload): Promise<IServiceResponse> {
    const { leadID, customerID } = payload
    let customer = await this.customerModel.findOneCustomer({ customerID }, [
      'customerID',
      'name',
      'email',
    ])
    if (!customer) {
      throw new NotFoundError('Customer not found')
    }
    let lead = await this.findOne({ leadID }, ['*'])
    if (!lead) {
      throw new NotFoundError('Lead not found')
    }

    const db = getKnexInstance()
    const lender = await db('lender')
      .select('lender_info')
      .where({ lenderID: lead.lenderID, status: 1 })
      .first()

    let loan = await this.loanService.findOne({ leadID, customerID }, [
      'leadID',
      'disbursalAmount',
      'disbursalDate',
      'loanNo',
    ])
    if (!loan) {
      throw new NotFoundError('Loan not found')
    }
    let approval = await this.approvalModel.findOneApproval({ leadID, customerID }, ['*'])
    if (!approval) {
      throw new NotFoundError('Approval not found')
    }
    let repayAmount = 0
    let repaymet = Math.round(loan.disbursalAmount * (approval.roi / 100))
    repayAmount = loan.disbursalAmount + repaymet * approval.tenure
    let tenure = approval.tenure

    if (approval && loan) {
      tenure = await this.getTenure(loan.disbursalDate, approval.repayDate as unknown as string)
    }
    if (lead.productID == 1) {
      const credit = await this.creditModel.findOneCredit(
        {
          customerID,
          leadID,
        },
        ['amountToBeRepayed', 'tenure', 'paidAmount'],
        [{ column: 'creditID', order: 'desc' }],
      )
      tenure = credit?.tenure || 1
      repayAmount = (Number(credit.amountToBeRepayed) + Number(credit.paidAmount)) / tenure
    }
    const res = {
      customerID: customer.customerID,
      leadID: loan.leadID,
      productID: lead.productID,
      name: customer.name,
      email: customer.email,
      loanNo: loan.loanNo,
      disbursalAmount: loan.disbursalAmount,
      roi: `${approval.roi} ${lead.productID == 1 ? '% per annum' : '% per day'}`,
      tenure: tenure ? `${tenure} ${lead.productID == 1 ? 'months' : 'days'}` : '-',
      repayAmount: Math.floor(repayAmount),
      currentDate: moment().format('Do MMM, YYYY'),
    }

    return this.serviceResponse(200, res, 'Disbursal letter Data retreived successfully.')
  }

  async disbursalPdf(payload: INoDuesPayload): Promise<Readable> {
    return new Promise(async (resolve, reject) => {
      try {
        let disbursalData = await this.disbursalByLead(payload)
        const templatePath = path.resolve(__dirname, '../views/loansDocs/disbursal.ejs')
        const htmlContent = await ejs.renderFile(templatePath, {
          data: disbursalData.data,
        })

        // Convert the S3 image URLs to base64
        const headerUrl =
          'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg'
        const footerUrl =
          'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg'

        const headerImage = await this.convertImageUrlToBase64(headerUrl)
        const footerImage = await this.convertImageUrlToBase64(footerUrl)

        const browser = await puppeteer.launch({
          executablePath: '/usr/bin/chromium-browser',
        })
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
          format: 'A4',
          displayHeaderFooter: true,
          headerTemplate: `<div class="header" style="width: 100%; text-align: center;">
            <img src="${headerImage}" style="width:100%; max-height:150px; margin-top: -20px">
          </div>`,
          footerTemplate: `<div class="footer" style="width: 100%; text-align: center;">
            <img src="${footerImage}" style="width:100%; max-height:150px; margin-bottom: -18px">
          </div>`,
          margin: {
            top: '150px',
            bottom: '100px',
          },
        })

        await browser.close()
        if (pdfBuffer) {
          let s3FolderName = 'documents/disbursalLetter/' + payload.customerID
          let imageName = 'disbursalLetter_' + Math.floor(Date.now() / 1000) + '.pdf'
          let res = await this.s3Service.uploadDocument(
            Buffer.from(pdfBuffer),
            s3FolderName,
            imageName,
          )
          if (res && res?.Key !== null && res.Key !== '') {
            await this.documentModel.insert({
              customerID: payload.customerID,
              type: 'Disbursal Letter',
              documentType: 'Disbursal Letter',
              documentFile: res.Key,
              status: 'Verified',
              uploadBy: payload.customerID,
              uploadedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
              verifiedBy: payload.customerID,
              verifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
              upload_platform: 'S3',
            })
          }
        }
        // Convert the buffer to a readable stream
        const pdfStream = new Readable()
        pdfStream.push(pdfBuffer)
        pdfStream.push(null)

        resolve(pdfStream)
      } catch (err) {
        reject(err)
      }
    })
  }
  async crmTimeline(leadID: number) {
    const db = getKnexInstance()

    // Fetch call history logs with user details
    const callHistoryLogs = await db('callhistoryLogs as ch')
      .leftJoin('users as u', 'ch.calledBy', 'u.userID')
      .where('ch.leadID', leadID)
      .orderBy('ch.callHistoryID', 'desc')
      .select(
        'ch.callHistoryID',
        'ch.status',
        'ch.remark',
        'ch.calledBy',
        'ch.appAmount',
        'ch.createdDate',
        'u.name as userName',
        'u.role as userRole',
      )

    // Fetch lead details along with assigned user
    const leadDetails = await db('leads as l')
      .leftJoin('users as u', 'l.callAssign', 'u.userID')
      .where('l.leadID', leadID)
      .select(
        'l.leadID',
        'l.utmSource',
        'l.createdDate',
        'l.callAssign',
        'u.name as assignedUserName',
      )
      .first()

    const timelineData: TimeLineResponseDto[] = callHistoryLogs.map(log => ({
      status: log.status,
      remarks: log.remark,
      role: log.calledBy === 221 ? log.userName : log.userRole || '',
      amount: log.appAmount,
      updatedBy: log.userName || '',
      updatedDateIST: log.createdDate,
    }))

    if (leadDetails?.assignedUserName) {
      timelineData.push({
        status: 'Assign',
        amount: '',
        remarks: 'Automatic System',
        updatedDateIST: formatToIST(leadDetails.createdDate),
        role: leadDetails.utmSource || 'N/A',
        updatedBy: `Lead Generated by ${leadDetails.utmSource || 'N/A'}`,
      })
    }

    return this.serviceResponse(HttpStatusCode.Ok, { collection: timelineData }, 'Success')
  }

  private async generateTransactionDetails(
    leadID: number,
    collectionDetails: any[],
    approval: any,
    dpdPenalty: number,
    dpdPenaltyGSTPercentage: number,
  ) {
    const transactionDetails: ITransactionDetail[] = []
    let totalDebit = 0
    let totalCredit = 0
    const repayDate = new Date(approval.repayDate)
    //const leadID = approval.leadID
    const today = new Date()
    let db = getKnexInstance()
    const loan = await db('loan')
      .where('leadID', leadID)
      .select('loanNo', 'disbursalAmount', 'leadId', 'disbursalDate', 'deduction')
      .first()

    // Add Loan Disbursal Details
    const disbursalDate = new Date(loan.disbursalDate).toISOString().split('T')[0]
    const loanDisbursalAmount = loan.disbursalAmount - loan.deduction

    transactionDetails.push(
      {
        date: disbursalDate,
        particular: 'Loan Disbursal',
        debit: '',
        credit: loanDisbursalAmount,
      },
      {
        date: disbursalDate,
        particular: 'Processing fee charged',
        debit: approval.adminFee,
        credit: '',
      },
      {
        date: disbursalDate,
        particular: 'GST charged',
        debit: approval.GstOfAdminFee,
        credit: '',
      },
    )

    totalCredit += loanDisbursalAmount
    totalDebit += approval.adminFee + approval.GstOfAdminFee

    // Add Bounce Charges and GST if conditions are met
    if (collectionDetails.length > 0 && collectionDetails[0].collectedDate > approval.repayDate) {
      const bounceDate = new Date(approval.repayDate)
      bounceDate.setDate(bounceDate.getDate() + 1)

      const bounceCharges = dpdPenalty
      const gstCharged = (dpdPenalty * dpdPenaltyGSTPercentage) / 100

      transactionDetails.push(
        {
          date: bounceDate.toISOString().split('T')[0],
          particular: 'Bounce Charges',
          debit: bounceCharges,
          credit: '',
        },
        {
          date: bounceDate.toISOString().split('T')[0],
          particular: 'GST Charged',
          debit: gstCharged,
          credit: '',
        },
      )

      totalDebit += bounceCharges + gstCharged
    }

    // Process collection details
    for (const cde of collectionDetails) {
      const collectionDate = new Date(cde.collectedDate).toISOString().split('T')[0]

      if (cde.collectedMode === 'Waive Off') {
        transactionDetails.push({
          date: collectionDate,
          particular: 'Waive Off Amount',
          debit: cde.collectedAmount,
          credit: '',
        })
        totalDebit += cde.collectedAmount
      } else if (cde.status === 'Settlement') {
        transactionDetails.push({
          date: collectionDate,
          particular: 'Settlement Amount',
          debit: cde.collectedAmount,
          credit: '',
        })
        totalDebit += cde.collectedAmount
      } else {
        transactionDetails.push({
          date: collectionDate,
          particular: 'Payment Received',
          debit: cde.collectedAmount,
          credit: '',
        })
        totalDebit += cde.collectedAmount

        if (cde.collected_interest) {
          transactionDetails.push({
            date: collectionDate,
            particular: `Interest Adjusted`,
            debit: '',
            credit: '',
          })
        }

        if (cde.collected_principal) {
          transactionDetails.push({
            date: collectionDate,
            particular: `Principal Adjusted`,
            debit: '',
            credit: '',
          })
        }

        if (cde.collected_penality) {
          transactionDetails.push({
            date: collectionDate,
            particular: `Charges Adjusted`,
            debit: '',
            credit: '',
          })
        }
      }
    }

    // Create total summary
    const totalSummary: ISummary = {
      debit: totalDebit,
      credit: totalCredit,
    }

    return { transactionDetails, totalSummary }
  }

  async addCollectionDetails(payload: IAddCollection) {
    let {
      leadID,
      cooling_period,
      collectedAmount,
      status,
      collectedMode,
      collectedDate,
      referenceNo,
      discountAmount,
      settlemenAmount,
      remark,
      discount_waiver,
      discount_waiver_amount,
      userID,
      collectionStatus,
    } = payload
    const db = getKnexInstance()
    const disba = await db('loan').where('leadID', leadID).first()
    const currentDate = new Date().toISOString().split('T')[0]
    const mandate = await db('exsl_mandate')
      .where('leadID', leadID)
      .where('status', 0)
      .whereRaw('DATE(created_at) = ?', [currentDate])
      .first()
    if (mandate) {
      throw new BadRequestError(
        'Mandate is in process for this user ,please add collection after some time',
      )
    }

    const leadStatusResult = await db('leads')
      .join('collection', 'leads.leadID', '=', 'collection.leadID')
      .where('leads.leadID', leadID)
      .whereIn('leads.status', ['Settlement', 'Closed'])
      .whereIn('collection.status', ['Settlement', 'Closed'])
      .where('collection.collectionStatus', 'Approved')
      .select('leads.status', 'leads.customerID')
      .distinct()
      .first()

    if (leadStatusResult && leadStatusResult.status !== status) {
      throw new BadRequestError(
        'Check if the loan is closed/settlement then only collection with status closed/settlement is acceptable',
      )
    }

    const leadDetail = await db('leads').where('leadID', leadID).first()
    const approvalDetail = await db('approval').where('leadID', leadID).first()

    if (leadDetail?.ipc === 1) {
      const collectionStatusNew = collectionStatus
        ? collectionStatus
        : ('Approval Waiting' as CollectionStatus)
      const collectedBy = userID

      const updateCollectionResult = await this.updateCollectedAmount(
        leadID,
        leadDetail.customerID,
        collectedAmount,
        status,
        collectedDate,
        collectedMode,
        remark,
        referenceNo,
        discountAmount,
        settlemenAmount,
        collectionStatusNew,
        collectedBy,
        discount_waiver,
        discount_waiver_amount,
        1,
        cooling_period,
      )
      if (updateCollectionResult === 2) {
        throw new BadRequestError(
          `You cannot close because Repayment Amount is more than Collected Amount (Rs. ${collectedAmount})`,
        )
      } else {
        return this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
      }
    } else {
      const date = new Date()
      //const getLoanLeadDetail = await this.getLoanLeadDetail(leadID)
      const getLoanLeadDetail = await this.check_repayment_amount(leadID, collectedDate)

      let repaymentAmount = getLoanLeadDetail.Remanning_Amount

      const tenure = Math.round(
        (new Date(approvalDetail.repayDate).getTime() - new Date(disba.disbursalDate).getTime()) /
          (1000 * 60 * 60 * 24),
      )
      const findDiff = new Date(collectedDate).getTime() - new Date(disba.disbursalDate).getTime()

      if (
        tenure < 7 &&
        Math.round(findDiff / (1000 * 60 * 60 * 24)) <= 1 &&
        cooling_period === 'Yes'
      ) {
        repaymentAmount = disba.disbursalAmount - disba.deduction
      } else if (
        tenure >= 7 &&
        Math.round(findDiff / (1000 * 60 * 60 * 24)) <= 3 &&
        cooling_period === 'Yes'
      ) {
        repaymentAmount = disba.disbursalAmount - disba.deduction
      }

      let excessAmount = 0
      if (status === CollectionStatus.CLOSED) {
        if (repaymentAmount > collectedAmount) {
          throw new BadRequestError(
            `You cannot close because Repayment Amount (Rs. ${repaymentAmount}) is more than Collected Amount (Rs. ${collectedAmount})`,
          )
        } else if (repaymentAmount < collectedAmount) {
          excessAmount = collectedAmount - repaymentAmount
        }
      } else if (status === CollectionStatus.PART_PAYMENT) {
        if (repaymentAmount === collectedAmount) {
          status = CollectionStatus.CLOSED
        } else if (repaymentAmount < collectedAmount) {
          excessAmount = collectedAmount - repaymentAmount
          status = CollectionStatus.PART_PAYMENT
        }
      } else if (status === CollectionStatus.SETTLEMENT) {
        discount_waiver = discount_waiver
        discount_waiver_amount = discount_waiver_amount
      }
      const collectionId = await db('collection').insert({
        customerID: leadDetail.customerID,
        leadID: leadID,
        loanNo: disba.loanNo,
        collectedAmount,
        collectedMode,
        collectedDate,
        referenceNo,
        discountAmount: 0,
        settlemenAmount: 0,
        remark: '',
        status,
        collectedBy: userID,
        createdDate: date,
        collectionStatus: 'Approval Waiting',
        collectionStatusby: 'no',
        excess_amount: excessAmount,
        discount_waiver,
        discount_waiver_amount,
      })
      const collectionID = collectionId[0]
      let transaction_status = 1
      if (collectionID) {
        await this.manageTransaction(
          leadID,
          leadDetail.customerID,
          'Collection',
          collectionID,
          'Manual',
          null,
          collectedDate,
          null,
          collectedMode,
          referenceNo,
          referenceNo,
          userID,
          collectedAmount,
          transaction_status,
        )
      }
      const data = {
        collectionID,
      }
      return this.serviceResponse(HttpStatusCode.Ok, data, 'Payday collection added successfully')
    }
  }
  async generateFailedFile(fileId: string): Promise<Readable> {
    try {
      const data = await this.getfailedDetails(fileId)
      const templatePath = path.resolve(
        __dirname,
        '../views/loansDocs/not_required_failed_leads.ejs',
      )
      const htmlContent = await ejs.renderFile(templatePath, { data })

      // const browser = await puppeteer.launch()
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
      })
      const page = await browser.newPage()

      await page.setContent(htmlContent, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      })

      await page.waitForSelector('body', { timeout: 5000 })
      await page.waitForSelector('h1')

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '8mm',
          bottom: '8mm',
          left: '15mm',
          right: '15mm',
        },
        scale: 0.7, // Adjust scale to fit content
        //displayHeaderFooter: true,  // If you want to add a header/footer to every page
      })

      await browser.close()

      const pdfStream = new Readable()
      pdfStream.push(pdfBuffer)
      pdfStream.push(null)

      return pdfStream
    } catch (err) {
      throw err
    }
  }

  private getfailedDetails = async (fileID: string) => {
    let db = getKnexInstance()
    const loanDetails = await db('not_required_leads')
      .where('fileid', fileID)
      .where('status', 'failed')
      .orderBy('id', 'desc')
      .select('mobile', 'status')
    const data = loanDetails.map(row => ({
      mobile: row.mobile,
      status: row.status,
    }))
    return data
  }

  async notRequiredLeads(page: number, perPage: number) {
    const db = getKnexInstance()

    const offset = (page - 1) * perPage

    const data = await db('not_required_leads_filelog')
      .orderBy('Id', 'desc')
      .limit(perPage)
      .offset(offset)

    const countResult = await db('not_required_leads_filelog').count('* as total')
    const totalCount = countResult[0].total

    const fileData = {
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(+totalCount / perPage),
    }

    return this.serviceResponse(HttpStatusCode.Ok, fileData, 'Success')
  }

  public async updateCollectedAmount(
    leadID: number,
    customerID: number,
    collectedAmount: number,
    status: CollectionStatus,
    collectedDate: string = moment().format('YYYY-MM-DD'),
    collectedMode: string,
    remarks: string,
    referenceNo: string,
    discountAmount: number,
    settlemenAmount: number,
    collectionStatus: CollectionStatus,
    userID: number,
    discount_waiver: string,
    discount_waiver_amount: string,
    bycrm: number,
    cooling_period: string,
  ): Promise<number> {
    let excess_amount = 0
    let penality_charge = 0
    let total_interest = 0
    let returnCode = 0
    let opening_bal = 0
    let closing_bal = 0
    let collected_interest = 0
    let collected_principal = 0
    let collected_penality = 0
    let principal_amount = 0
    let transaction_status = 1
    let check_principal = 0
    let principal_amount_over = 0
    let total_interest_actual = 0
    let penality_charge_actual = 0
    remarks = ''
    let db = getKnexInstance()
    const loan = await db('loan')
      .select('disbursalAmount', 'loanNo', 'disbursalDate', 'deduction')
      .where({ leadID, customerID })
      .first()

    const approval_detail = await db('approval').where('leadID', leadID).first()
    const repayment_data = await calculatePaydayAmountIPC(leadID, status)

    let repayment_amount = repayment_data.totalRepayAmount
    penality_charge = repayment_data.charges
    total_interest = repayment_data.totalInterest
    principal_amount = repayment_data.principalAmount
    total_interest_actual = total_interest
    penality_charge_actual = penality_charge
    if (repayment_amount > collectedAmount && status === CollectionStatus.CLOSED) {
      status = CollectionStatus.PART_PAYMENT
    }

    if (cooling_period === 'Yes' && bycrm === 1) {
      const check_cooling_period = await this.checkCoolingPeriod(
        loan,
        approval_detail,
        bycrm,
        cooling_period,
        collectedAmount,
        repayment_data,
        collectedDate,
      )
      if (check_cooling_period.is_cooling_period) {
        repayment_amount = check_cooling_period.repayment_amount
        principal_amount = check_cooling_period.principal_amount
        if (repayment_amount === principal_amount) {
          total_interest = 0
          penality_charge = 0
        }
      }
    }

    if (status === 'Closed') {
      if (repayment_amount > collectedAmount) {
        return 2
      } else if (repayment_amount < collectedAmount) {
        excess_amount = collectedAmount - repayment_amount
      }
      opening_bal = repayment_amount
      collected_interest = total_interest
      collected_principal = principal_amount
      collected_penality = penality_charge
      closing_bal = 0
      principal_amount = 0
      if (collectedAmount - repayment_amount >= 0) {
        penality_charge = 0
        total_interest = 0
      }
    } else if (status === 'Part Payment') {
      opening_bal = repayment_amount
      closing_bal = 0

      if (repayment_amount == collectedAmount) {
        status = CollectionStatus.CLOSED
        collected_interest = total_interest
        collected_principal = principal_amount
        collected_penality = penality_charge
        principal_amount = 0
        total_interest = 0
        penality_charge = 0
      } else if (repayment_amount < collectedAmount) {
        excess_amount =
          collectedAmount - repayment_amount > 0 ? collectedAmount - repayment_amount : 0
        status = CollectionStatus.CLOSED
        collected_interest = total_interest
        collected_principal = principal_amount
        collected_penality = penality_charge
        principal_amount = 0
        total_interest = 0
        penality_charge = 0
      } else {
        closing_bal = repayment_amount - collectedAmount

        if (collectedAmount > total_interest) {
          if (total_interest == 0 && collectedAmount >= principal_amount) {
            collected_principal = principal_amount
          } else if (total_interest == 0 && collectedAmount < principal_amount) {
            collected_principal = collectedAmount
          } else {
            collected_principal = collectedAmount - total_interest
            if (collectedAmount > principal_amount + total_interest) {
              check_principal = 1
              principal_amount_over = principal_amount
            }
          }

          total_interest = 0
          principal_amount -= collected_principal
          collected_interest = total_interest_actual - total_interest

          if (principal_amount < 0) {
            penality_charge += principal_amount
            principal_amount = 0
            if (penality_charge < 0) {
              penality_charge = 0
            }
          } else {
            penality_charge =
              penality_charge_actual -
                (collectedAmount - collected_principal - collected_interest) >
              0
                ? penality_charge_actual -
                  (collectedAmount - collected_principal - collected_interest)
                : 0.0
          }

          if (check_principal == 1) {
            collected_principal = principal_amount_over
            principal_amount = 0
          }

          collected_interest = total_interest_actual - total_interest
          collected_penality =
            penality_charge_actual - penality_charge > 0
              ? penality_charge_actual - penality_charge
              : 0.0

          if (collected_interest == 0 && collected_principal == 0) {
            collected_penality = collectedAmount
            penality_charge = penality_charge_actual - collected_penality
          }
        } else {
          total_interest -= collectedAmount
          collected_interest = total_interest_actual - total_interest
        }
      }
    } else if (status === 'Settlement') {
      closing_bal = repayment_amount - collectedAmount

      if (collectedAmount > total_interest) {
        if (total_interest == 0 && collectedAmount >= principal_amount) {
          collected_principal = principal_amount
        } else if (total_interest == 0 && collectedAmount < principal_amount) {
          collected_principal = collectedAmount
        } else {
          collected_principal = collectedAmount - total_interest
          if (collectedAmount > principal_amount + total_interest) {
            check_principal = 1
            principal_amount_over = principal_amount
          }
        }

        total_interest = 0
        principal_amount -= collected_principal

        if (principal_amount < 0) {
          penality_charge += principal_amount
          principal_amount = 0
          if (penality_charge < 0) {
            penality_charge = 0
          }
        } else {
          penality_charge =
            penality_charge_actual - (collectedAmount - collected_principal - collected_interest) >
            0
              ? penality_charge_actual -
                (collectedAmount - collected_principal - collected_interest)
              : 0.0
        }

        if (check_principal == 1) {
          collected_principal = principal_amount_over
          principal_amount = 0
        }

        collected_interest = total_interest_actual - total_interest
        collected_penality =
          penality_charge_actual - penality_charge > 0
            ? penality_charge_actual - penality_charge
            : 0.0

        if (collected_interest == 0 && collected_principal == 0) {
          collected_penality = collectedAmount
          penality_charge = penality_charge_actual - collected_penality
        }
      } else {
        total_interest -= collectedAmount
        collected_interest = total_interest_actual - total_interest
      }
    }

    const leadStatusResult = await db('leads')
      .join('collection', 'leads.leadID', 'collection.leadID')
      .where('leads.leadID', leadID)
      .whereIn('leads.status', ['Settlement', 'Closed'])
      .whereIn('collection.status', ['Settlement', 'Closed'])
      .where('collection.collectionStatus', 'Approved')
      .select('leads.status')
      .distinct()
      .first()

    if (leadStatusResult && leadStatusResult.status !== status) {
      return 2
    }

    // Insert collection record
    const collectionId = await db('collection').insert({
      customerID,
      leadID,
      loanNo: loan.loanNo,
      collectedAmount,
      collectedMode,
      collectedDate,
      referenceNo,
      orderID: referenceNo,
      discountAmount,
      settlemenAmount,
      remark: remarks,
      status,
      collectedBy: userID,
      createdDate: new Date().toISOString().replace('T', ' ').replace('Z', '').split('.')[0],
      collectionStatus,
      collectionStatusby: 'no',
      excess_amount: Math.round(excess_amount),
      discount_waiver,
      discount_waiver_amount,
      opening_balance: opening_bal,
      closing_balance: closing_bal,
      total_interest,
      principal_amount,
      penality_charge,
      collected_interest,
      collected_principal,
      collected_penality,
    })
    const collection_id = collectionId[0]
    if (collection_id) {
      await this.manageTransaction(
        leadID,
        customerID,
        'Collection',
        collection_id,
        'Manual',
        null,
        collectedDate,
        null,
        collectedMode,
        referenceNo,
        referenceNo,
        userID,
        collectedAmount,
        transaction_status,
      )
    }

    return returnCode
  }
  async manageTransaction(
    leadID: number,
    customerID: number,
    type: string = null,
    collectionID: number = null,
    gateway: string = null,
    emiID: number = null,
    transactionDate: string = null,
    remarks: string = null,
    mode: string = null,
    referenceNo: string = null,
    orderID: string = null,
    createdBy: number = null,
    amount: number = null,
    status: number = null,
  ): Promise<number | object | null> {
    try {
      if (!leadID || !customerID) {
        return 0
      }
      let db = getKnexInstance()
      transactionDate = transactionDate || new Date().toISOString()

      const loan = await db('loan').where({ leadID, customerID }).first()

      const approval_detail = await db('approval').where({ leadID, customerID }).first()

      if (!loan && !approval_detail) {
        return 0
      }

      if (type === 'disbursal') {
        const commonData = {
          customerID,
          leadID,
          loanNo: loan.loanNo,
          status: gateway === 'Manual' ? 2 : 1,
          mode: 'Payout',
          referenceNo: loan.disbursalRefrenceNo || '',
          orderId: loan.disbursalRefrenceNo || '',
          deleted: 0,
          gateway: gateway,
          createdBy: loan.disbursedBy,
          updatedBy: loan.disbursedBy,
          collectionID,
          emiID,
          transactionDate,
          remarks,
        }

        const disbursal_transaction_id = await db('transactions').insert({
          ...commonData,
          type: 'disbursal',
          amount: loan.disbursalAmount - loan.deduction,
        })

        // Insert PF transaction
        const pf_transaction_id = await db('transactions').insert({
          ...commonData,
          type: 'pf',
          amount: approval_detail.adminFee,
        })

        // Insert GST transac
        const gst_transaction_id = await db('transactions').insert({
          ...commonData,
          type: 'gst',
          amount: approval_detail.GstOfAdminFee,
        })

        return {
          disbursal_transaction_id,
          pf_transaction_id,
          gst_transaction_id,
        }
      }
      gateway = mode == 'PayU' ? 'Payu' : gateway
      const transaction_id = await db('transactions').insert({
        customerID,
        leadID,
        loanNo: loan.loanNo,
        status,
        type,
        mode,
        referenceNo,
        orderId: orderID,
        deleted: 0,
        gateway,
        createdBy,
        updatedBy: createdBy,
        amount,
        collectionID,
        emiID,
        transactionDate,
        remarks,
      })

      return transaction_id
    } catch (error) {
      console.error('Transaction Error:', error.message)
      return null
    }
  }

  async checkCoolingPeriod(
    loan: ILoan,
    approvalDetail: any,
    bycrm: number,
    coolingPeriod: string,
    collectedAmount: number,
    repaymentData: any,
    collectedDate: string,
  ): Promise<{
    repayment_amount: number
    principal_amount: number
    is_cooling_period: boolean
  }> {
    let repaymentAmount = 0
    let principalAmount = 0
    let isCoolingPeriod = false

    try {
      const tenure = Math.round(
        (new Date(approvalDetail.repayDate).getTime() - new Date(loan.disbursalDate).getTime()) /
          (1000 * 60 * 60 * 24),
      )

      const findDiff = new Date(collectedDate).getTime() - new Date(loan.disbursalDate).getTime()

      if (
        (tenure < 7 &&
          Math.round(findDiff / (1000 * 60 * 60 * 24)) <= 1 &&
          coolingPeriod === 'Yes' &&
          bycrm === 1) ||
        (tenure >= 7 &&
          Math.round(findDiff / (1000 * 60 * 60 * 24)) <= 3 &&
          coolingPeriod === 'Yes' &&
          bycrm === 1)
      ) {
        repaymentAmount = loan.disbursalAmount - loan.deduction
        isCoolingPeriod = true

        if (repaymentAmount === collectedAmount) {
          principalAmount = repaymentAmount
        }

        if (repaymentAmount < collectedAmount) {
          repaymentAmount = repaymentData.totalRepayAmount
        }
      }
    } catch (error) {
      return {
        repayment_amount: 0,
        principal_amount: 0,
        is_cooling_period: false,
      }
    }

    return {
      repayment_amount: repaymentAmount,
      principal_amount: principalAmount,
      is_cooling_period: isCoolingPeriod,
    }
  }
  async getLoanLeadDetail(leadId: number): Promise<any> {
    let repaymentAmount = 0
    let loanDisbursed = 0
    let roi = 0
    let nod = 0
    let rd = 0
    let penDay = 0
    let toi = 0
    let penAmount = 0
    let coAmount = 0
    let gstAmount = 0
    let adminFee = 0
    let repayAmount = 0
    let approvalAmount = 0
    let loanTenure = 0
    let disba: any = {}
    let creda: any = ''

    try {
      let db = getKnexInstance()
      const leadDetail = await db('leads').where('leadID', leadId).first()

      if (leadDetail) {
        disba = await db('loan')
          .where('customerID', leadDetail.customerID)
          .where('leadID', leadDetail.leadID)
          .first()

        loanDisbursed = disba?.disbursalAmount || 0

        if (disba?.disbursalRefrenceNo) {
          creda = await db('approval')
            .where('leadID', leadDetail.leadID)
            .where('customerID', leadDetail.customerID)
            .first()

          approvalAmount = creda?.loanAmtApproved || 0
          loanTenure = creda?.tenure || 0
          roi = creda?.roi || 0

          const sta = new Date(creda?.repayDate).toISOString().split('T')[0]
          const cur = new Date().toISOString().split('T')[0]
          const mi1 = roi / 100
          const mi = Math.round((disba?.disbursalAmount || 0) * mi1)
          nod =
            (new Date(creda?.repayDate).getTime() - new Date(disba?.disbursalDate).getTime()) /
            (1000 * 60 * 60 * 24)

          rd =
            new Date(creda?.repayDate).getTime() >= new Date(cur).getTime()
              ? (new Date(cur).getTime() - new Date(disba?.disbursalDate).getTime()) /
                (1000 * 60 * 60 * 24)
              : nod

          penDay =
            cur > sta
              ? (new Date(cur).getTime() - new Date(sta).getTime()) / (1000 * 60 * 60 * 24)
              : 0

          toi = mi * rd

          if (penDay > 0) {
            penAmount = Math.round((disba?.disbursalAmount || 0) * (1.25 / 100)) * penDay
          }

          const totPay = (disba?.disbursalAmount || 0) + toi + penAmount
          coAmount = await db('collection')
            .where('collectionStatus', 'Approved')
            .where('customerID', leadDetail.customerID)
            .where('leadID', leadDetail.leadID)
            .sum('collectedAmount')
            .first()
          repaymentAmount = totPay - (coAmount['sum(`collectedAmount`)'] || 0)

          const adgst = Math.round((creda?.adminFee || 0) * (18 / 100))
          const svs = adgst + (creda?.adminFee || 0)
          const dbu = (disba?.disbursalAmount || 0) - svs
          gstAmount = adgst
          adminFee = creda?.adminFee || 0

          const pa_a = Math.round((disba?.disbursalAmount || 0) * (roi / 100))
          const tda = pa_a * loanTenure
          repayAmount = (disba?.disbursalAmount || 0) + tda
        }
      }
    } catch (error) {
      console.error('Error in getLoanLeadDetail:', error.message)
      throw new BadRequestError('Error in adding collection')
    }

    return {
      loan_disbursed: loanDisbursed,
      roi,
      no_days: nod,
      real_days: rd,
      penalty_days: penDay,
      real_interest: toi,
      penalty_interest: penAmount,
      paid_amount: coAmount,
      repayment_amount: repaymentAmount,
      gst_amount: gstAmount,
      admin_fee: adminFee,
      repay_amount: repayAmount,
      approval_amount: approvalAmount,
      loan_tenure: loanTenure,
      creda,
      disba,
    }
  }
  async getProfileByLeadId(payload: ILeadProfilePayload): Promise<IServiceResponse> {
    const { leadID } = payload
    const lead = await this.leadModel.findOneLead({ leadID }, [
      'customerID',
      'leadID',
      'status',
      'productID',
      'fbLeads',
    ])
    if (!lead) throw new NotFoundError('Lead not found')

    const customer = await this.customerModel.findOneCustomer({ customerID: lead.customerID }, [
      '*',
    ])
    if (!customer) throw new NotFoundError('Customer not found')

    let aadharStatus = 'Not verify'
    let aadharNo = ''
    let aadharVerifyLink = ''
    if (customer.aadharNo) {
      aadharNo = String(customer.aadharNo)
      const whereCondition = {
        api_supplier: 4,
        status: 1,
        api_type: 'aadhaar-v2-submit-otp',
        aadharNo: aadharNo,
      }
      const leadApiLog = await this.leadApiLogModel.findOneLeadApiLog(whereCondition, [
        'api_response',
        'aadharNo',
        'status',
        'created_at',
      ])
      if (leadApiLog) {
        aadharStatus = 'Verify'
      } else {
        aadharVerifyLink = `${this.commonHelper.getBaseUrl()}/newcrm/thirdparty/surepass/surepass_lead_type?lead_id=${leadID}`
      }
    } else {
      aadharStatus = ''
      aadharNo = ''
    }

    let pancardStatus = 'Not verify'
    let pancardNo = ''
    let pancardVerifyLink = ''
    if (customer.pancard) {
      pancardNo = customer.pancard
      const pancardWhereCondition = {
        api_supplier: 4,
        status: 1,
        api_type: 'pan-comprehensive',
        pancard: pancardNo,
      }
      const pancardLeadApiLog = await this.leadApiLogModel.findOneLeadApiLog(
        pancardWhereCondition,
        ['api_response', 'pancard', 'status', 'created_at'],
      )
      if (pancardLeadApiLog) {
        pancardStatus = 'Verify'
      } else {
        pancardVerifyLink = `${this.commonHelper.getBaseUrl()}/newcrm/thirdparty/surepass/surepass_lead_type?lead_id=${leadID}`
      }
    } else {
      pancardStatus = ''
      pancardNo = ''
    }

    // Digilocker e sign link
    let digilockerVerifyLink = ''
    if (customer.mobile) {
      digilockerVerifyLink = `${this.commonHelper.getBaseUrl()}/loanapply/digilocker?mobile_no=${
        customer.mobile
      }`
    } else {
      digilockerVerifyLink = ''
    }

    let repay_date: moment.Moment
    const today = moment() // Current date

    if (customer.salary_date) {
      // Construct a date for this month's salary date
      repay_date = moment().date(+customer.salary_date)

      // If salary date is in the past, move it to next month
      if (repay_date.isBefore(today, 'day')) {
        repay_date.add(1, 'month')
      }
    } else {
      // Default to 5 days from today if salary_date is not available
      repay_date = moment().add(5, 'days').startOf('day')
    }

    // Adjust repay_date if it falls on a weekend or holiday
    do {
      const weekend = isWeekend(repay_date.toDate())
      const holiday = await isHoliday(repay_date.toDate())

      if (weekend || holiday) {
        repay_date.add(1, 'days') // Move to the next day
      } else {
        break // If it's not a weekend or holiday, break the loop
      }
    } while (true)

    let response = {
      customerID: customer.customerID,
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      dob: customer.dob,
      pancard: customer.pancard,
      pancard_verify: pancardStatus,
      pancard_verify_link: pancardVerifyLink,
      aadharNo: aadharNo,
      aadhar_verify: aadharStatus,
      aadhar_verify_link: aadharVerifyLink,
      digilocker_verify_link: digilockerVerifyLink,
      status: lead.status,
      productID: lead.productID,
      leadType: lead.fbLeads,
      repay_date: repay_date,
      salary_date: customer.salary_date,
    }

    return this.serviceResponse(200, response, 'Lead profile data retreived successfully.')
  }

  async addCollectionFollowup(payload: IAddCollectionFollowup, userID: number) {
    try {
      // Fetch lead and loan data in parallel
      const [lead, loan] = await Promise.all([
        this.findOne({ leadID: payload.leadID }, ['customerID']),
        this.loanModel.findOneLoan({ leadID: payload.leadID }, ['loanNo']),
      ])

      // Check if the lead or loan was not found
      if (!lead) throw new NotFoundError('Lead not found')
      if (!loan) throw new NotFoundError('Loan not found')

      // Prepare data to be inserted
      const data = {
        followType: payload.followType,
        StatusType: payload.StatusType,
        remark: payload.remark,
        leadID: payload.leadID,
        customerID: lead.customerID,
        loanNo: loan.loanNo,
        createdBy: userID,
        createdDate: new Date(),
        followup_type: payload.followup_type,
      }

      // Insert the follow-up data
      const savedData = await this.collectionFollowUpModel.insert(data)

      // Check if the insert operation failed
      if (!savedData) throw new NotFoundError('Failed to save collection follow-up')

      // Return a successful response
      return this.serviceResponse(
        HttpStatusCode.Ok,
        savedData,
        'Collection follow-up successfully saved',
      )
    } catch (error) {
      throw error
    }
  }
  addReferenceDetails = async (
    payload: IReferenceDetailsPayload,
    userID: number,
  ): Promise<IServiceResponse> => {
    const { mobileNo, name, relation, leadID } = payload
    const lead = await this.leadModel.findOneLead(
      {
        leadID,
      },
      ['customerID'],
    )
    if (!lead) {
      throw new BadRequestError('lead not found')
    }
    const customer = await this.customerModel.findOneCustomer({ customerID: lead.customerID }, [
      'mobile',
    ])
    const customerID = lead.customerID
    const mobile_no = customer.mobile

    if (mobileNo == mobile_no) {
      throw new BadRequestError("Reference's mobile number cannot be same as your mobile number")
    }

    // Check if reference already exists
    const checkReference = await this.referenceModel.find({
      where: { customerID },
      select: ['referenceID', 'contactNo', 'relation'],
    })

    const existingReference = checkReference.find(reference => {
      if (reference.contactNo === mobileNo) {
        return reference
      }
    })

    if (existingReference)
      throw new BadRequestError(
        `You have already entered the same mobile number for reference ${existingReference.relation}, please share mobile number for reference ${relation}`,
      )
    const insertData: IReferenceModel[] = []

    // if (existingReference) {
    //   insertData.push({
    //     customerID,
    //     relation: relation,
    //     name: name,
    //     contactNo: mobileNo,
    //     createdBy: userID,
    //     address: "N/A",
    //     state: "N/A",
    //     city:"N/A",
    //     pincode: 0,
    //   })
    // }

    if (!existingReference) {
      insertData.push({
        customerID,
        relation: relation,
        name: name,
        contactNo: mobileNo,
        createdBy: userID,
        address: 'N/A',
        state: 'N/A',
        city: 'N/A',
        pincode: 0,
      })
    }

    await this.referenceModel.bulkInsert(insertData)

    // await this.stepTrackermodel.completeStep(
    //   customerID,
    //   StepName.REFERENCE_DETAILS,
    //   Products.PAYDAY,
    //   leadID,
    // )

    return this.serviceResponse(
      HttpStatusCode.Created,
      {},
      'Your Reference details have been saved',
    )
  }

  async checkPincode(payload: IPincode) {
    const { pincode } = payload
    let db = getKnexInstance()
    const pinDetails = await db('pincode_city_list as pcl')
      .leftJoin('states as s', 'pcl.state_id', 's.stateID')
      .where('pcl.pincode', pincode)
      .first(['pcl.city_name', 'pcl.state_id', 'pcl.state_name', 's.stateName'])

    if (pinDetails) {
      return this.serviceResponse(200, pinDetails, 'Pin details found')
    } else {
      return this.serviceResponse(400, {}, 'Pin details not found')
    }
  }

  async modifyLoan(payload: IModifyLoanDetailsPayload, leadID: number, userId: number) {
    const { adminFee, loanAmount, repaymentDate, roi } = payload

    const lead = await this.leadModel.findOneLead({ leadID }, ['customerID', 'status'])

    const { customerID } = lead

    if (!lead) throw new NotFoundError('Lead not found')

    if (lead.status !== LeadStatus.APPROVED_PROCESS) {
      throw new BadRequestError(`Lead status must be ${LeadStatus.APPROVED_PROCESS}`)
    }

    const dayOfWeek = moment().format('dddd')
    const formattedRepayDate = moment(repaymentDate)

    const holidayCheck = await this.repayDateHolidaymodel.findOneRepayDateHoliday(
      {
        repaydate: formattedRepayDate.startOf('day').format('YYYY-MM-DD'),
      },
      ['repaydate'],
    )

    if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday' || holidayCheck) {
      throw new BadRequestError('Loan repayment cannot lie on a holiday')
    }

    // 6 days check

    const currentDate = moment().startOf('day')

    const dayDiff = formattedRepayDate.diff(currentDate, 'days')

    if (dayDiff < 6) {
      throw new BadRequestError('Loan tenure cannot be less than 6 days')
    }

    // Max loan amount check;

    const isAmountValid = await this.loanService.isReloanAmountValid(loanAmount, customerID)

    if (!isAmountValid.status)
      throw new BadRequestError(`Approval amount cannot be more than ${isAmountValid.amount}`)

    const updatedAdminFee = this.loanService.calculateAdminFee(loanAmount, adminFee)

    await Promise.all([
      this.approvalModel.findOneAndUpdateApproval(
        {
          leadID,
        },
        {
          tenure: dayDiff,
          roi,
          repayDate: moment(repaymentDate).utcOffset(330).startOf('day').format('YYYY-MM-DD'),
          adminFee: updatedAdminFee,
          GstOfAdminFee: Math.round(updatedAdminFee * 0.18),
          loanAmtApproved: loanAmount,
        },
      ),
      this.callHistoryLogsModel.insert({
        customerID,
        leadID,
        callType: CallType.IVR,
        calledBy: userId,
        status: 'Approved Process',
        remark: 'Modified Approved Process',
        noteli: '',
        callbackTime: moment().startOf('day').format('YYYY-MM-DD') as unknown as Date,
        appAmount: loanAmount.toString(),
      }),
    ])

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Loan Details have been updated')
  }

  async addEmiCollectionDetails(payload: IEmiCollection) {
    let {
      leadID,
      collectedAmount,
      collectedMode,
      referenceNo,
      collectedDate,
      status,
      remarks,
      waiver,
      discount_type,
      userID,
    } = payload

    const db = getKnexInstance()

    if (!leadID) {
      throw new BadRequestError('please send leadId')
    }
    const lead = await this.leadModel.findOneLead({ leadID }, ['customerID'])
    const date = new Date(collectedDate)
    const formattedDate = date.toISOString().split('T')[0]

    const data = {
      customerID: lead.customerID,
      leadID: leadID,
      userID: userID,
      payment_transaction_status: status,
      status: 'pending',
      method: collectedMode,
      orderId: referenceNo,
      amount: collectedAmount,
      gateway: 4,
      transactionDate: formattedDate,
      remarks: remarks,
      waiver: waiver || 0,
      discount_type: discount_type || 0,
    }

    const [isFoundTransactions, isFoundCollection] = await Promise.all([
      db('transactions').where('orderID', referenceNo).first(),
      db('collection').where('orderID', referenceNo).first(),
    ])

    if (isFoundTransactions && isFoundCollection) {
      throw new BadRequestError(`ReferenceNo ${referenceNo} already exists in the database.`)
    }

    let baseUrl = this.commonHelper.getBaseUrl()
    const response = await axios.post(`${baseUrl}/new-api/collection-crm/add`, data, {
      headers: {
        api_key: config.phpApiKey,
        api_secret: config.phpApiSecret,
        'Content-Type': 'application/json',
      },
    })

    const json = response.data

    if (!json) {
      throw new BadRequestError('Error while adding Emi collection ')
    }

    if (!json.success) {
      throw new BadRequestError('Error while adding Emi collection ')
    }

    return this.serviceResponse(HttpStatusCode.Ok, json.data, 'Emi Collection Added')
  }
  async modifyEmiLoan(payload: IModifyEmiLoanDetailsPayload, leadID: number, userID: number) {
    const { adminFee, loanAmount, repaymentDate, roi, tenure } = payload

    // Max amount check

    const lead = await this.leadModel.findOneLead({ leadID }, ['customerID', 'status'])

    if (!lead) throw new NotFoundError('Lead not found')

    if (lead.status !== LeadStatus.APPROVED && lead.status !== LeadStatus.APPROVED_PROCESS) {
      throw new BadRequestError(
        `Lead status must be one of ${LeadStatus.APPROVED} or ${LeadStatus.APPROVED_PROCESS}`,
      )
    }

    const approval = await this.approvalModel.findOneApproval({ leadID }, ['approvalID'])

    if (!approval) throw new NotFoundError('Approval details not found')

    const { customerID } = lead
    const { approvalID } = approval

    if (loanAmount >= +config.emiMaxAmount) {
      throw new BadRequestError(`Emi amount cannot be more than ${+config.emiMaxAmount}`)
    }

    const mobileToken = await this.mobileTokenModel.findOneMobileToken(
      { customerID: customerID.toString() },
      ['access_token'],
      [{ column: 'customerID', order: 'desc' }],
    )

    const firstDueDate = moment(repaymentDate).date()

    const axios = new AxiosService(this.commonHelper.getBaseUrl())

    const emiResp = await axios.call(
      'post',
      RAMFIN_WEBAPP_API.PAYDAY_TO_EMI,
      {
        customer_id: customerID,
        firstDueDate,
        lead_id: leadID,
        loanAmtApproved: loanAmount,
        productId: ProductID.EMI,
        roi,
        tenure,
        userID,
      },
      undefined,
      { token: mobileToken.access_token },
    )

    if (!emiResp.success) {
      throw new BadRequestError('Unable to modify EMI at the moment, Please try again later')
    }

    const newAdminFee = this.loanService.calculateAdminFee(loanAmount, adminFee)

    await this.approvalModel.findOneAndUpdateApproval(
      { approvalID },
      {
        adminFee: newAdminFee,
        GstOfAdminFee: Math.round(newAdminFee * (+config.gst / 100)),
      },
    )

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'EMI updated')
  }

  async getAccountList(leadID: number) {
    const lead = await this.leadModel.findOneLead({ leadID }, ['customerID'])

    if (!lead) throw new NotFoundError('Lead not found')

    const { customerID } = lead

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    const customerAccounts = await this.customerAccountModel.CustomerAccountKnex.where(
      'customerID',
      customerID,
    )
      .select('accountID', 'accountNo', 'accountType', 'bank', 'bankIfsc')
      .orderBy('accountID', 'desc')
      .groupBy('accountNo')

    getKnexInstance().raw("SET sql_mode = CONCAT(@@sql_mode, ',ONLY_FULL_GROUP_BY')")

    return this.serviceResponse(HttpStatusCode.Ok, customerAccounts, 'Fetched')
  }
  async downloadCollectionCSV(leadID: number) {
    let db = getKnexInstance()

    const lead = await this.leadModel.findOneLead({ leadID }, ['customerID', 'productID'])
    if (!lead) throw new NotFoundError('Lead not found')

    if (lead.productID === ProductID.EMI) {
      const collectionData = await db('transactions as t')
        .leftJoin('users as u', 't.createdBy', 'u.userID')
        .select(
          't.loanNo',
          db.raw(`
          CASE
            WHEN t.status = 0 THEN 'Failed'
            WHEN t.status = 1 THEN 'Captured'
            WHEN t.status = 2 THEN 'Pending'
            WHEN t.status = 3 THEN 'Approved'
            WHEN t.status = 3 THEN 'Rejected'
            ELSE 'Unknown'
          END AS status
        `),
          't.mode',
          't.referenceNo',
          't.orderId',
          't.gateway',
          't.createdAt',
          db.raw('COALESCE(u.name, "Unknown") as createdBy'),
          't.amount',
          db.raw('COALESCE(t.transactionDate, t.createdAt) AS transactionDate'),
          't.remarks',
          't.discount_type',
          't.payment_transaction_status',
          't.waiver',
        )
        .where('t.leadID', leadID)
        .where('emiID', '0')
        .orderBy('t.id', 'desc')

      if (collectionData.length === 0) {
        throw new BadRequestError('No collection found')
      }

      const csvBuffer = await this.csvDownloadService.exportDataToCsvString(
        collectionData as Record<string, any>[],
      )
      return this.serviceResponse(
        HttpStatusCode.Ok,
        { csvBuffer },
        'Collection data fetched successfully',
      )
    } else {
      const collectionData = await db('collection')
        .select([
          'collection.loanNo',
          'collection.status',
          'collection.collectedMode',
          'collection.referenceNo',
          'collection.orderID',
          'collection.createdDate',
          db.raw(
            "CASE WHEN collection.collectedBy = 1001 THEN 'Automatic System' ELSE users.name END AS collectedBy",
          ),
          'collection.collectedAmount',
          'collection.remark',
          'collection.collectionStatus',
          'collection.discount_waiver',
          'collection.discount_waiver_amount',
          'collection.collectedDate',
        ])
        .leftJoin('users', 'collection.collectedBy', 'users.userID')
        .where('collection.leadID', leadID)
        .orderBy('collection.collectionID', 'desc')

      if (collectionData.length === 0) {
        throw new BadRequestError('No collection found')
      }

      const csvBuffer = await this.csvDownloadService.exportDataToCsvString(
        collectionData as Record<string, any>[],
      )
      return this.serviceResponse(
        HttpStatusCode.Ok,
        { csvBuffer },
        'Collection data fetched successfully',
      )
    }
  }

  insertLeadToCallHistory = async (
    customerID: number,
    leadID: number,
    leadStatus: LeadStatus | string,
    userID: number,
    remark = '',
    noteli = '',
    appAmount = '0',
    callType = CallType.IVR,
  ) => {
    const callHistoryInsert: InsertData<ICallHistoryModel> | InsertData<ICallHistoryLog> = {
      customerID,
      leadID,
      callType,
      status: leadStatus,
      remark: remark ?? '',
      noteli: noteli ?? '',
      callbackTime: moment().format('YYYY-MM-DD') as unknown as Date,
      calledBy: userID,
    }

    await Promise.all([
      this.callHistoryModel.create(callHistoryInsert),
      this.callHistoryLogsModel.insert({ appAmount, ...callHistoryInsert }),
    ])
  }

  changeLeadStatus = async (
    payload: any,
    leadID: number,
    userID: number,
    clientIp: string,
    permissions: string[],
    role: Roles,
  ) => {
    const { status } = payload
    let {
      holdDate,
      holdTime,
      repaymentDate,
      noteli,
      remark,
      reason,
      loanAmtApproved,
      roi,
      adminFee,
      plateFormFee,
      officialEmail,
      m1,
      m2,
      m3,
      m1_date,
      m2_date,
      m3_date,
      m_avg,
      p1,
      p2,
      p3,
      employmentType,
      accountID,
      accountType,
      accountNo,
      newAccountType,
      bankName,
      bankIfsc,
      loanType,
      alternateMobile,
      tenure,
    } = payload

    let isAllowed = true

    if (!roleAuthorizer(role, [Roles.ADMIN, Roles.SUPER_ADMIN])) {
      isAllowed = false
    }

    const lead = await this.leadModel.findOneLead({ leadID }, ['customerID', 'status', 'productID'])

    if (!lead) throw new NotFoundError('This lead does not exist')

    const { customerID, status: leadStatus, productID } = lead

    if (leadStatus === status) {
      throw new BadRequestError('Lead status is already in ' + status)
    }

    const currentDate = moment().startOf('day')

    // if (loanType !== 'emi' && repaymentDate) {
    //   tenure = moment(repaymentDate).startOf('day').diff(currentDate, 'days')
    // }

    if (
      (status === LeadStatus.APPROVED_PROCESS || status === LeadStatus.APPROVED) &&
      loanType === 'payday'
    ) {
      repaymentDate = repaymentDate
        ? moment(repaymentDate).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD')

      tenure = moment(repaymentDate).startOf('day').diff(currentDate, 'days')
    }

    noteli = noteli ?? ''
    remark = remark ?? ''
    reason = reason ?? ''
    loanAmtApproved = loanAmtApproved ? +loanAmtApproved : 0
    roi = roi ? +roi : 1
    adminFee = adminFee ?? 0
    plateFormFee = plateFormFee ?? 0
    m1 = m1 ?? ''
    m2 = m2 ?? ''
    m3 = m3 ?? ''
    m1_date = m1_date ?? moment().format('YYYY-MM-DD')
    m2_date = m2_date ?? moment().format('YYYY-MM-DD')
    m3_date = m3_date ?? moment().format('YYYY-MM-DD')
    m_avg = m_avg ?? '0'
    p1 = p1 ?? '0'
    p2 = p2 ?? '0'
    p3 = p3 ?? '0'
    employmentType = employmentType ?? ''

    const customer = await this.customerModel.findOneCustomer({ customerID }, [
      'email',
      'mobile',
      'pancard',
    ])

    officialEmail = officialEmail ?? customer.email
    alternateMobile = alternateMobile ?? customer.mobile.str

    if (!customer) throw new NotFoundError('Customer not found')

    if (
      loanAmtApproved &&
      loanType === 'payday' &&
      !permissions.includes(masterPermission.Settings.MaxLoanAmountBypass)
    ) {
      const isAmountValid = await this.loanService.isReloanAmountValid(loanAmtApproved, customerID)

      if (!isAmountValid.status)
        throw new BadRequestError(`Approval amount cannot be more than ${isAmountValid.amount}`)
    } else if (
      loanAmtApproved &&
      loanType === 'emi' &&
      !permissions.includes(masterPermission.Settings.MaxLoanAmountBypass)
    ) {
      if (loanAmtApproved >= +config.emiMaxAmount) {
        throw new BadRequestError(`Emi amount cannot be more than ${+config.emiMaxAmount}`)
      }
    }

    //check if user has access to this permission
    const permissionSet = new Set(permissions)

    switch (leadStatus) {
      // User can only go to Doc receive if status = Fresh Lead
      case LeadStatus.FRESH_LEAD:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer([masterPermission.FormAction.Transaction], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        const flResp = await this.changeLeadStatusFromFreshToVarious({
          customerID,
          leadID,
          noteli,
          reason,
          remark,
          status,
          userID,
          email: customer.email,
          lastLeadStatus: leadStatus,
          mobile: customer.mobile,
          pancard: customer.pancard,
          leadStatus,
        })

        return this.serviceResponse(flResp.statusCode, flResp.data, flResp.message)

      case LeadStatus.DOCUMENT_RECEIVED:
        if (
          status === LeadStatus.HOLD_PROCESS ||
          status === LeadStatus.REJECTED_PROCESS ||
          status === LeadStatus.NOT_REQUIRED_PROCESS
        ) {
          if (
            !isAllowed &&
            !permissionAuthorizer(
              [
                masterPermission.LeadProfileDetails.CreditAdd,
                masterPermission.LeadProfileDetails.CreditChangeStatus,
              ],
              permissionSet,
            )
          ) {
            throw new AccessForbiddenError('You are not allowed to access this resource')
          }

          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          if (
            !isAllowed &&
            !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
          ) {
            throw new AccessForbiddenError('You are not allowed to access this resource')
          }

          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        } else if (status === LeadStatus.APPROVED_PROCESS) {
          const apResp = await this.changeLeadStatusToApprovedProcess({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            loanType,
          })

          return this.serviceResponse(apResp.statusCode, apResp.data, apResp.message)
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.HOLD_PROCESS:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.CreditAdd,
              masterPermission.LeadProfileDetails.CreditChangeStatus,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        if (status === LeadStatus.APPROVED_PROCESS) {
          const apResp = await this.changeLeadStatusToApprovedProcess({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            loanType,
          })

          return this.serviceResponse(apResp.statusCode, apResp.data, apResp.message)
        } else if (
          status === LeadStatus.REJECTED_PROCESS ||
          status === LeadStatus.NOT_REQUIRED_PROCESS
        ) {
          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.NOT_REQUIRED_PROCESS:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.CreditAdd,
              masterPermission.LeadProfileDetails.CreditChangeStatus,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        if (status === LeadStatus.HOLD_PROCESS || status === LeadStatus.REJECTED_PROCESS) {
          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.APPROVED_PROCESS) {
          const apResp = await this.changeLeadStatusToApprovedProcess({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            loanType,
          })

          return this.serviceResponse(apResp.statusCode, apResp.data, apResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.REJECTED_PROCESS:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.CreditAdd,
              masterPermission.LeadProfileDetails.CreditChangeStatus,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        if (status === LeadStatus.HOLD_PROCESS || status === LeadStatus.NOT_REQUIRED_PROCESS) {
          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        } else if (status === LeadStatus.APPROVED_PROCESS) {
          const apResp = await this.changeLeadStatusToApprovedProcess({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            loanType,
          })

          return this.serviceResponse(apResp.statusCode, apResp.data, apResp.message)
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.APPROVED_PROCESS:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.CreditAdd,
              masterPermission.LeadProfileDetails.CreditChangeStatus,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        if (
          status === LeadStatus.HOLD_PROCESS ||
          status === LeadStatus.REJECTED_PROCESS ||
          status === LeadStatus.REJECTED ||
          status === LeadStatus.NOT_REQUIRED_PROCESS ||
          status === LeadStatus.NOT_REQUIRED ||
          status === LeadStatus.HOLD
        ) {
          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        } else if (status === LeadStatus.APPROVED) {
          const aprResp = await this.changeLeadStatusToApproved({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            accountID,
            accountNo,
            accountType,
            bankIfsc,
            bankName,
            clientIp,
            newAccountType,
            productID,
          })

          return this.serviceResponse(aprResp.statusCode, aprResp.data, aprResp.message)
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.HOLD:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.CreditAdd,
              masterPermission.LeadProfileDetails.CreditChangeStatus,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        if (status === LeadStatus.APPROVED) {
          const aprResp = await this.changeLeadStatusToApproved({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            accountID,
            accountNo,
            accountType,
            bankIfsc,
            bankName,
            clientIp,
            newAccountType,
            productID,
          })

          return this.serviceResponse(aprResp.statusCode, aprResp.data, aprResp.message)
        } else if (status === LeadStatus.NOT_REQUIRED || status === LeadStatus.REJECTED) {
          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.APPROVED:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.CreditAdd,
              masterPermission.LeadProfileDetails.CreditChangeStatus,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        if (
          status === LeadStatus.HOLD ||
          status === LeadStatus.NOT_REQUIRED ||
          status === LeadStatus.REJECTED
        ) {
          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        }
        // ! TODO : Bank Update status needs to be handled in a seprate ticket

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.NOT_REQUIRED:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.CreditAdd,
              masterPermission.LeadProfileDetails.CreditChangeStatus,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        if (status === LeadStatus.HOLD || status === LeadStatus.REJECTED) {
          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.APPROVED) {
          const aprResp = await this.changeLeadStatusToApproved({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            accountID,
            accountNo,
            accountType,
            bankIfsc,
            bankName,
            clientIp,
            newAccountType,
            productID,
          })

          return this.serviceResponse(aprResp.statusCode, aprResp.data, aprResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.REJECTED:
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.CreditAdd,
              masterPermission.LeadProfileDetails.CreditChangeStatus,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }

        if (status === LeadStatus.HOLD || status === LeadStatus.NOT_REQUIRED) {
          const holdResp = await this.changeLeadStatusToRejectHoldStatuses({
            adminFee,
            customerID,
            employmentType,
            holdDate,
            holdTime,
            leadID,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        } else if (status === LeadStatus.APPROVED) {
          const aprResp = await this.changeLeadStatusToApproved({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            accountID,
            accountNo,
            accountType,
            bankIfsc,
            bankName,
            clientIp,
            newAccountType,
            productID,
          })

          return this.serviceResponse(aprResp.statusCode, aprResp.data, aprResp.message)
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.DISBURSAL_SHEET_SEND: // Bank Update
        if (
          status !== LeadStatus.BLACK_LISTED &&
          !isAllowed &&
          !permissionAuthorizer(
            [
              masterPermission.LeadProfileDetails.DisbursalAdd,
              masterPermission.LeadProfileDetails.DisbursalUpdate,
              masterPermission.LeadProfileDetails.DisbursalUpdateRazorpay,
            ],
            permissionSet,
          )
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        } else if (
          !isAllowed &&
          !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
        ) {
          throw new AccessForbiddenError('You are not allowed to access this resource')
        }
        if (status === LeadStatus.APPROVED) {
          const aprResp = await this.changeLeadStatusToApproved({
            adminFee,
            alternateMobile,
            customerID,
            employmentType,
            leadID,
            loanAmtApproved,
            m1,
            m1_date,
            m2,
            m2_date,
            m3,
            m3_date,
            m_avg,
            noteli,
            officialEmail,
            p1,
            p2,
            p3,
            plateFormFee,
            reason,
            remark,
            repaymentDate,
            roi,
            status,
            tenure,
            userID,
            leadStatus,
            accountID,
            accountNo,
            accountType,
            bankIfsc,
            bankName,
            clientIp,
            newAccountType,
            productID,
          })

          return this.serviceResponse(aprResp.statusCode, aprResp.data, aprResp.message)
        } else if (status === LeadStatus.BLACK_LISTED) {
          const blackListResp = await this.changeLeadStatusToBlackList({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: leadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            blackListResp.statusCode,
            blackListResp.data,
            blackListResp.message,
          )
        } else if (status === LeadStatus.DISBURSED) {
        }

        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      case LeadStatus.BLACK_LISTED:
        if (status === LeadStatus.WHITE_LISTED) {
          if (
            !isAllowed &&
            !permissionAuthorizer([masterPermission.Lead.Blacklisted], permissionSet)
          ) {
            throw new AccessForbiddenError('You are not allowed to access this resource')
          }

          let lastLeadStatus: LeadStatus = leadStatus
          if (leadStatus === String(LeadStatus.BLACK_LISTED)) {
            // Get the last lead status from call history logs, excluding blacklisted/whitelisted entries
            const lastStatusRecord = await this.callHistoryLogsModel.findOne({
              select: ['status'],
              where(query) {
                query.where('leadID', leadID)
                query.where('customerID', customerID)
                query.whereIn('status', Object.values(LeadStatus))
                query.whereNotIn('status', [LeadStatus.BLACK_LISTED, LeadStatus.WHITE_LISTED])
              },
              order: [{ column: 'callHistoryID', order: 'desc' }],
            })

            // Update lastLeadStatus if it exists
            lastLeadStatus = lastStatusRecord.status
              ? (lastStatusRecord.status as LeadStatus)
              : leadStatus
          }

          // Get whitelist response
          const whiteListResp = await this.changeLeadStatusToWhitelist({
            customerID,
            pancard: customer.pancard,
            lastLeadStatus: lastLeadStatus,
            leadID,
            mobile: customer.mobile,
            noteli,
            reason,
            remark,
            status,
            userID,
            leadStatus,
          })

          return this.serviceResponse(
            whiteListResp.statusCode,
            whiteListResp.data,
            whiteListResp.message,
          )
        }
        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)

      default:
        throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)
    }
  }

  private changeLeadStatusToRejectHoldStatuses = async (payload: IChangeRejectHoldStatuses) => {
    const {
      adminFee,
      customerID,
      employmentType,
      holdDate,
      holdTime,
      leadID,
      noteli,
      reason,
      remark,
      status,
      userID,
    } = payload

    if (
      status === LeadStatus.HOLD_PROCESS ||
      status === LeadStatus.REJECTED_PROCESS ||
      status === LeadStatus.REJECTED ||
      status === LeadStatus.NOT_REQUIRED_PROCESS ||
      status === LeadStatus.NOT_REQUIRED ||
      status === LeadStatus.HOLD
    ) {
      // const callHistory = await this.callHistoryModel.findOne({
      //   where: { status, leadID },
      //   select: ['callHistoryID'],
      //   order: [{ column: 'callHistoryID', order: 'desc' }],
      // })

      // if (callHistory) throw new BadRequestError(`Selected Lead is already in ${status}`)

      // const callHistoryLogs = await this.callHistoryLogsModel.findOne({
      //   where: { status, leadID },
      //   select: ['callHistoryID'],
      //   order: [{ column: 'callHistoryID', order: 'desc' }],
      // })

      // if (callHistoryLogs) throw new BadRequestError(`Selected Lead is already in ${status}`)

      await this.insertLeadToCallHistory(customerID, leadID, status, userID, remark, noteli)

      // Follow up time not in API
      let approvalData: IApproval = {
        customerID,
        leadID,
        loanType: 0,
        branch: 'Delhi',
        loanAmtApproved: 0,
        tenure: 0,
        roi: 1,
        repayDate: moment().add(10, 'days').format('YYYY-MM-DD'),
        adminFee,
        plateFormFee: 0,
        convinineceFee: 0,
        creditRiskAnalisys: 0,
        GstOfAdminFee: 0,
        alternateMobile: '0',
        officialEmail: '...@gmail.com',
        monthlyIncome: 0,
        cibil: 0,
        activeLoans: 0,
        activePL: 0,
        activeHL: 0,
        activeCC: 0,
        activePaydayLoan: 0,
        outstandingAmount: 0,
        monthlyObligation: 0,
        status: status as unknown as ApprovalStatus,
        remark,
        m1: '0',
        m2: '0',
        m3: '0',
        m_avg: '0',
        p1: '0',
        p2: '0',
        p3: '0',
        m1_date: moment().format('YYYY-MM-DD'),
        m2_date: moment().format('YYYY-MM-DD'),
        m3_date: moment().format('YYYY-MM-DD'),
        creditedBy: userID,
        sanctionalloUID: userID.toString(),
        rejectionReason: reason,
        documentr: '',
        employmentType,
      }

      const approval = await this.approvalModel.findOneApproval({ leadID }, ['approvalID'])
      if (!approval) {
        await this.approvalModel.insert(approvalData)
      } else {
        await this.approvalModel.findOneAndUpdateApproval(
          { approvalID: approval.approvalID },
          approvalData,
        )
      }

      const leadUpdate: Partial<ILead> = {
        sanctionalloUID: userID,
        alloUID: '0',
        status,
      }

      if (status === LeadStatus.HOLD || status === LeadStatus.HOLD_PROCESS) {
        leadUpdate.hold_date = moment(holdDate).format('YYYY-MM-DD')
        leadUpdate.hold_time = holdTime
      }

      await this.leadModel.findOneAndUpdate({ leadID }, leadUpdate)

      if (status == LeadStatus.REJECTED_PROCESS) {
        await notificationUtils.sendRejectProcessMail(customerID, leadID)
      } else if (status == LeadStatus.NOT_REQUIRED) {
        await notificationUtils.sendNotRequiredProcessMail(customerID, leadID)
      }
      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
    }
  }

  private changeLeadStatusToBlackList = async (payload: IChangeBlackListedOrWhiteListedStatus) => {
    const {
      customerID,
      pancard,
      lastLeadStatus,
      leadID,
      mobile,
      noteli,
      reason,
      remark,
      status,
      userID,
    } = payload

    if (status === LeadStatus.BLACK_LISTED) {
      // const callHistory = await this.callHistoryModel.findOne({
      //   where: { status, leadID },
      //   select: ['callHistoryID'],
      //   order: [{ column: 'callHistoryID', order: 'desc' }],
      // })

      // if (callHistory) throw new BadRequestError(`Selected Lead is already in ${status}`)

      // const callHistoryLogs = await this.callHistoryLogsModel.findOne({
      //   where: { status, leadID },
      //   select: ['callHistoryID'],
      //   order: [{ column: 'callHistoryID', order: 'desc' }],
      // })

      // if (callHistoryLogs) throw new BadRequestError(`Selected Lead is already in ${status}`)

      await this.insertLeadToCallHistory(
        customerID,
        leadID,
        LeadStatus.BLACK_LISTED,
        userID,
        'blacklist',
        noteli,
      )

      await Promise.all([
        this.customerPancardBlacklistOrWhitelist(pancard, userID, 'Active'),
        this.leadModel.findOneAndUpdate({ customerID, leadID }, { status }),
        this.mobileTokenModel.findOneAndUpdate(
          { mobile: mobile.toString() },
          { access_token: LeadStatus.BLACK_LISTED },
        ),
      ])

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
    }
  }

  private changeLeadStatusToWhitelist = async (payload: IChangeBlackListedOrWhiteListedStatus) => {
    const {
      customerID,
      pancard,
      lastLeadStatus,
      leadID,
      mobile,
      noteli,
      reason,
      remark,
      status,
      userID,
    } = payload

    if (status === LeadStatus.WHITE_LISTED) {
      // Insert to call history
      await this.insertLeadToCallHistory(
        customerID,
        leadID,
        LeadStatus.WHITE_LISTED,
        userID,
        'whitelist',
        noteli,
      )

      // Database operations
      await Promise.all([
        this.customerPancardBlacklistOrWhitelist(pancard, userID, 'Deactive'),
        this.leadModel.findOneAndUpdate({ customerID, leadID }, { status: lastLeadStatus }),
        this.mobileTokenModel.findOneAndUpdate(
          { mobile: mobile.toString() },
          { access_token: lastLeadStatus },
        ),
      ])

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
    }
  }

  private async customerPancardBlacklistOrWhitelist(
    pancard: string,
    userID: number,
    status: string = 'Active',
    isWebhook: boolean = false,
  ): Promise<void> {
    try {
      // Find the existing record for this pancard
      const existingRecord = await this.blackListCustomerPancardModel.findOne({
        where: { pancard },
        order: [{ column: 'id', order: 'desc' }],
      })

      // Only proceed if we're changing the status (avoid duplication)
      if (!existingRecord || existingRecord.status !== status) {
        // If not a webhook call, make a webhook request
        if (!isWebhook) {
          const url = config.blacklistCustomerWebhook
          try {
            await axios.post(
              url,
              { pancard, userID, status },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${config.kamakshiMoneyApiKey}`,
                },
              },
            )
          } catch (error) {
            throw new BadRequestError('Blacklist webhook error')
          }
        }

        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')

        // Handle database operations based on action (blacklist or whitelist)
        if (status === 'Active' && existingRecord) {
          // Blacklisting - update the existing record to Active
          await this.blackListCustomerPancardModel.findOneAndUpdate(
            { id: existingRecord.id },
            {
              status: 'Active',
              removeBy: userID,
              removeDate: currentDate,
            },
          )
        } else if (status === 'Active') {
          // Blacklisting - add a new record with Active status
          await this.blackListCustomerPancardModel.create({
            pancard,
            addBy: userID,
            status: 'Active',
            addDate: currentDate,
            createdDate: currentDate,
          })
        } else if (status === 'Deactive' && existingRecord) {
          // Whitelisting - update the existing record to Deactive
          await this.blackListCustomerPancardModel.findOneAndUpdate(
            { id: existingRecord.id },
            {
              status: 'Deactive',
              removeBy: userID,
              removeDate: currentDate,
            },
          )
        }
      }
    } catch (error) {
      throw new BadRequestError('Error updating pancard blacklist status')
    }
  }

  private changeLeadStatusToApproved = async (payload: IChangeLeadStatusToApproved) => {
    const {
      accountID,
      accountType,
      adminFee,
      alternateMobile,
      bankName,
      clientIp,
      customerID,
      employmentType,
      leadID,
      loanAmtApproved,
      m1,
      m1_date,
      m2,
      m2_date,
      m3,
      m3_date,
      m_avg,
      newAccountType,
      noteli,
      officialEmail,
      p1,
      p2,
      p3,
      plateFormFee,
      reason,
      remark,
      repaymentDate,
      roi,
      status,
      tenure,
      userID,
      accountNo,
      bankIfsc,
      productID,
    } = payload

    if (status === LeadStatus.APPROVED) {
      if (productID === 2) {
        if (tenure < 6) {
          throw new BadRequestError('Tenure cannot be less than 6 days')
        }

        const isLoanAmntValid = await this.loanService.isReloanAmountValid(
          loanAmtApproved,
          customerID,
        )

        if (!isLoanAmntValid.status) {
          throw new BadRequestError(`Approval amount cannot be more than ${isLoanAmntValid.amount}`)
        }

        // First check if accountID came or not
        // If not then new

        if (accountType === 'old') {
          // If existing account then need to send accountID
          const customerAccount = await this.customerAccountModel.findOne({
            where: { customerID, accountID },
          })

          if (!customerAccount) {
            throw new NotFoundError('Customer Account does not exist')
          }
        } else {
          // New account needs to be added
          // check if account already exists
          const bankAccount = await this.customerAccountModel.findOne({
            where: { accountNo },
            select: ['customerID'],
          })

          if (bankAccount && bankAccount?.customerID !== customerID) {
            throw new BadRequestError(
              'This account belongs to another user, Please enter different bank details',
            )
          } else if (bankAccount && bankAccount?.customerID === customerID) {
            throw new BadRequestError(
              'This account already exists in our database, Please enter different bank details',
            )
          }

          const [accountId] = await this.customerAccountModel.insert({
            accountNo,
            accountType: newAccountType,
            bankIfsc,
            bank: bankName,
            bankBranch: 'N/A',
            ip: clientIp,
            credatedBy: +config.defaultUserId,
            // bank_holder_name: accountHoldersName,
            customerID,
            leadID,
            status: BankAccountStatus.VERIFIED,
            is_credit: '1',
          })
        }

        await this.insertLeadToCallHistory(
          customerID,
          leadID,
          'Disbursal Account Updated',
          userID,
          accountNo,
          noteli,
          loanAmtApproved.toString(),
          CallType.DISBURSAL_ACCOUNT_UPDATE,
        )

        // check loanAmnt valid or not
        // Check Repeat Case
        let approvalData: IApproval = {
          customerID,
          leadID,
          loanType: 0,
          branch: 'Delhi',
          loanAmtApproved,
          tenure,
          roi,
          repayDate: repaymentDate as unknown as Date,
          adminFee,
          plateFormFee,
          convinineceFee: 0,
          creditRiskAnalisys: 0,
          GstOfAdminFee: Math.round(adminFee * (+config.gst / 100)),
          alternateMobile: alternateMobile.toString(),
          officialEmail,
          monthlyIncome: 0,
          cibil: 0,
          activeLoans: 0,
          activePL: 0,
          activeHL: 0,
          activeCC: 0,
          activePaydayLoan: 0,
          outstandingAmount: 0,
          monthlyObligation: 0,
          status: status as unknown as ApprovalStatus,
          remark,
          m1,
          m2,
          m3,
          m_avg,
          p1,
          p2,
          p3,
          m1_date,
          m2_date,
          m3_date,
          creditedBy: userID,
          sanctionalloUID: userID.toString(),
          rejectionReason: reason,
          documentr: '',
          employmentType,
        }

        const approval = await this.approvalModel.findOneApproval({ leadID }, ['approvalID'])

        if (approval) {
          await this.approvalModel.findOneAndUpdateApproval(
            { approvalID: approval.approvalID },
            approvalData,
          )
        } else {
          await this.approvalModel.insert(approvalData)
        }

        await this.insertLeadToCallHistory(
          customerID,
          leadID,
          status,
          userID,
          remark,
          noteli,
          loanAmtApproved.toString(),
        )

        await this.leadModel.findOneAndUpdate(
          {
            leadID,
          },
          {
            status,
            alloUID: '0',
            sanctionalloUID: userID,
          },
        )
      } else {
        // If existing account then need to send accountID
        const customerAccount = await this.customerAccountModel.findOne({
          where: { customerID, accountID },
        })

        if (!customerAccount) {
          throw new NotFoundError('Customer Account does not exist')
        }

        await this.insertLeadToCallHistory(
          customerID,
          leadID,
          'Disbursal Account Updated',
          userID,
          accountNo,
          noteli,
          loanAmtApproved.toString(),
          CallType.DISBURSAL_ACCOUNT_UPDATE,
        )

        const credit = await this.creditService.findOne({ leadID }, [
          'creditID',
          'firstDueDate',
          'principal',
        ])

        const apiService = new AxiosService(this.commonHelper.getBaseUrl())

        const gst = Math.floor(adminFee * (+config.gst / 100))
        const emiRepay = +repaymentDate as unknown as number

        const emiData = {
          adminFee,
          gst,
          branch: 'Delhi',
          customer_id: customerID,
          firstDueDate: emiRepay,
          lead_id: leadID,
          loanAmtApproved,
          roi,
          tenure,
        }
        if (!credit) {
          await apiService.call('post', '/new-api/crm/creditDetails', emiData)
        } else {
          let dayOfRepayDate = emiRepay >= 29 ? 1 : emiRepay
          let FirstDueDate = await calculateRepayDate(dayOfRepayDate)
          FirstDueDate = new Date(format(new Date(FirstDueDate), 'yyyy-MM-dd'))
          const emiDoc = (await this.emiHelper.emiGenerator(
            loanAmtApproved,
            roi,
            tenure,
            FirstDueDate,
          )) as IEMIDoc

          await this.creditService.updateOne(
            { creditID: credit.creditID },
            {
              tenure,
              interest: emiDoc.interest,
              amountToBeRepayed: emiDoc.repaymentAmount,
              totalEMIs: emiDoc.totalEMIs,
              emiLeft: emiDoc.EMILeft,
              principal: loanAmtApproved,
              processingFee: adminFee,
              gst,
              roi: roi,
              firstDueDate: FirstDueDate,
            },
          )
        }

        const updatedCredit = await this.creditService.findOne({ leadID }, [
          'creditID',
          'firstDueDate',
        ])

        await Promise.all([
          this.approvalModel.findOneAndUpdateApproval(
            { leadID },
            {
              loanAmtApproved,
              tenure,
              roi,
              adminFee,
              GstOfAdminFee: gst,
              repayDate: updatedCredit.firstDueDate,
            },
          ),
          await this.leadModel.findOneAndUpdate(
            {
              leadID,
            },
            {
              status,
              alloUID: '0',
              sanctionalloUID: userID,
            },
          ),
          await this.insertLeadToCallHistory(
            customerID,
            leadID,
            status,
            userID,
            remark,
            noteli,
            loanAmtApproved.toString(),
          ),
        ])
      }
      // send sanction email

      try {
        await notificationUtils.sendSanctionMail(customerID, leadID, userID)
      } catch (error) {
        logger.error('Error sending notification email')
      }

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
    }
  }

  private changeLeadStatusToApprovedProcess = async (
    payload: IChangeLeadStatusToApprovedProcess,
  ) => {
    const {
      adminFee,
      alternateMobile,
      customerID,
      employmentType,
      leadID,
      loanAmtApproved,
      m1,
      m1_date,
      m2,
      m2_date,
      m3,
      m3_date,
      m_avg,
      noteli,
      officialEmail,
      p1,
      p2,
      p3,
      plateFormFee,
      reason,
      remark,
      repaymentDate,
      roi,
      status,
      tenure,
      userID,
      loanType,
    } = payload
    if (status === LeadStatus.APPROVED_PROCESS) {
      if (loanType === 'emi') {
        const mobileToken = await this.mobileTokenModel.findOneMobileToken(
          { customerID: customerID.toString() },
          ['access_token'],
          [{ column: 'customerID', order: 'desc' }],
        )

        const axios = new AxiosService(this.commonHelper.getBaseUrl())

        if (roi < 12 || roi > 365)
          throw new BadRequestError('Rate Of Intrest Can only be in Between 12% - 365%')

        const emiResp = await axios.call(
          'post',
          RAMFIN_WEBAPP_API.PAYDAY_TO_EMI,
          {
            customer_id: customerID,
            firstDueDate: repaymentDate,
            lead_id: leadID,
            loanAmtApproved,
            productId: ProductID.EMI,
            roi,
            tenure,
            userID,
            adminFee,
          },
          undefined,
          { token: mobileToken.access_token },
        )

        if (!emiResp.success) {
          throw new BadRequestError('Unable to add EMI at the moment, Please try again later')
        }

        // customerID: customer_id,
        // leadID: lead_id,
        // branch: BranchName.DELHI,
        // loanAmtApproved: loanAmtApproved,
        // tenure: tenure,
        // roi: roi,
        // repayDate: updatedCredit.firstDueDate,
        // adminFee: adminFee,
        // GstOfAdminFee: gst,
        // alternateMobile: '',
        // officialEmail: '',
        // cibil: 0,
        // activeLoans: 0,
        // status: ApprovalStatus.ApprovedProcess,
        // creditedBy: +config.defaultUserId,
        // remark: 'Approved Process',
        // employmentType: 'employeeType,

        let approvalData: Partial<IApproval> = {
          customerID,
          leadID,
          loanType: 0,
          // branch: 'Delhi',
          loanAmtApproved,
          // tenure,
          // roi,
          // repayDate: repaymentDate as unknown as Date,
          // adminFee,
          plateFormFee,
          convinineceFee: 0,
          creditRiskAnalisys: 0,
          // GstOfAdminFee: Math.round(adminFee * (+config.gst / 100)),
          alternateMobile: alternateMobile,
          officialEmail,
          monthlyIncome: 0,
          cibil: 0,
          activeLoans: 0,
          activePL: 0,
          activeHL: 0,
          activeCC: 0,
          activePaydayLoan: 0,
          outstandingAmount: 0,
          monthlyObligation: 0,
          status: status as unknown as ApprovalStatus,
          // remark,
          m1,
          m2,
          m3,
          m_avg,
          p1,
          p2,
          p3,
          m1_date,
          m2_date,
          m3_date,
          creditedBy: userID,
          sanctionalloUID: userID.toString(),
          rejectionReason: reason,
          documentr: '',
          employmentType,
        }

        const approval = await this.approvalModel.findOneApproval({ leadID }, ['approvalID'])

        if (approval) {
          await this.approvalModel.findOneAndUpdateApproval(
            { approvalID: approval.approvalID },
            approvalData,
          )
        }

        const step = await this.stepControlModel.findOne({
          where: { step_name: StepName.FINBOX },
          select: ['id'],
        })

        if (step) {
          const userStepExists = await this.stepTrackerModel.findOneStepTracker(
            {
              customer_id: customerID,
              step_id: step.id,
              lead_id: leadID,
            },
            ['is_completed', 'id'],
          )

          if (!userStepExists) {
            await this.stepTrackerModel.insert({
              customer_id: customerID,
              step_id: step.id,
              is_completed: true,
              lead_id: leadID,
            })
          } else {
            if (!userStepExists.is_completed) {
              await this.stepTrackerModel.findOneAndUpdate(
                { id: userStepExists.id },
                { is_completed: true },
              )
            }
          }
        }
        // send approved process email
        await notificationUtils.sendApprovedProcessMail(customerID, leadID, userID)
        return this.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
      }

      if (tenure < 6) {
        throw new BadRequestError('Tenure cannot be less than 6 days')
      }

      const isLoanAmntValid = await this.loanService.isReloanAmountValid(
        loanAmtApproved,
        customerID,
      )

      if (!isLoanAmntValid.status) {
        throw new BadRequestError(`Approval amount cannot be more than ${isLoanAmntValid.amount}`)
      }

      // check loanAmnt valid or not
      // Check Repeat Case
      let approvalData: IApproval = {
        customerID,
        leadID,
        loanType: 0,
        branch: 'Delhi',
        loanAmtApproved,
        tenure,
        roi,
        repayDate: repaymentDate as unknown as Date,
        adminFee,
        plateFormFee,
        convinineceFee: 0,
        creditRiskAnalisys: 0,
        GstOfAdminFee: Math.round(adminFee * (+config.gst / 100)),
        alternateMobile: alternateMobile.toString(),
        officialEmail,
        monthlyIncome: 0,
        cibil: 0,
        activeLoans: 0,
        activePL: 0,
        activeHL: 0,
        activeCC: 0,
        activePaydayLoan: 0,
        outstandingAmount: 0,
        monthlyObligation: 0,
        status: status as unknown as ApprovalStatus,
        remark,
        m1,
        m2,
        m3,
        m_avg,
        p1,
        p2,
        p3,
        m1_date,
        m2_date,
        m3_date,
        creditedBy: userID,
        sanctionalloUID: userID.toString(),
        rejectionReason: reason,
        documentr: '',
        employmentType,
      }

      const approval = await this.approvalModel.findOneApproval({ leadID }, ['approvalID'])

      if (approval) {
        await this.approvalModel.findOneAndUpdateApproval(
          { approvalID: approval.approvalID },
          approvalData,
        )
      } else {
        await this.approvalModel.insert(approvalData)
      }

      await this.insertLeadToCallHistory(
        customerID,
        leadID,
        status,
        userID,
        remark,
        noteli,
        loanAmtApproved.toString(),
      )

      await this.leadModel.findOneAndUpdate(
        {
          leadID,
        },
        {
          status,
          alloUID: '0',
          sanctionalloUID: userID,
        },
      )

      const step = await this.stepControlModel.findOne({
        where: { step_name: StepName.FINBOX },
        select: ['id'],
      })

      if (step) {
        const userStepExists = await this.stepTrackerModel.findOneStepTracker(
          {
            customer_id: customerID,
            step_id: step.id,
            lead_id: leadID,
          },
          ['is_completed', 'id'],
        )

        if (!userStepExists) {
          await this.stepTrackerModel.insert({
            customer_id: customerID,
            step_id: step.id,
            is_completed: true,
            lead_id: leadID,
          })
        } else {
          if (!userStepExists.is_completed) {
            await this.stepTrackerModel.findOneAndUpdate(
              { id: userStepExists.id },
              { is_completed: true },
            )
          }
        }
      }
      // send approved process email
      await notificationUtils.sendApprovedProcessMail(customerID, leadID, userID)
      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
    }
  }

  private changeLeadStatusFromFreshToVarious = async (payload: IChangeLeadStatusFreshLead) => {
    const {
      customerID,
      leadID,
      noteli,
      reason,
      remark,
      status,
      userID,
      leadStatus,
      email,
      lastLeadStatus,
      mobile,
      pancard,
    } = payload
    if (
      status === LeadStatus.CALLBACK ||
      status === LeadStatus.NOT_INTERESTED ||
      status === LeadStatus.NO_ANSWER ||
      status === LeadStatus.NOT_ELIGIBLE ||
      status === LeadStatus.DUPLICATE ||
      status === LeadStatus.DNC ||
      status === LeadStatus.INCOMPLETE_DOCUMENTS ||
      status === LeadStatus.INTERESTED ||
      status === LeadStatus.DOCUMENT_RECEIVED
    ) {
      // const callHistory = await this.callHistoryModel.findOne({
      //   where: { status, leadID },
      //   select: ['callHistoryID'],
      //   order: [{ column: 'callHistoryID', order: 'desc' }],
      // })

      // if (callHistory) throw new BadRequestError(`Selected Lead is already in ${status}`)

      // const callHistoryLog = await this.callHistoryLogsModel.findOne({
      //   where: { status, leadID },
      //   select: ['callHistoryID'],
      //   order: [{ column: 'callHistoryID', order: 'desc' }],
      // })

      // if (callHistoryLog) throw new BadRequestError(`Selected Lead is already in ${status}`)

      await this.insertLeadToCallHistory(customerID, leadID, status, userID, remark, noteli)

      if (status === LeadStatus.DOCUMENT_RECEIVED) {
        const step = await this.stepControlModel.findOne({
          where: { step_name: StepName.FINBOX },
          select: ['id'],
        })

        if (step) {
          const userStepExists = await this.stepTrackerModel.findOneStepTracker(
            {
              customer_id: customerID,
              step_id: step.id,
              lead_id: leadID,
            },
            ['is_completed', 'id'],
          )

          if (!userStepExists) {
            await this.stepTrackerModel.insert({
              customer_id: customerID,
              step_id: step.id,
              is_completed: true,
              lead_id: leadID,
            })
          } else {
            if (!userStepExists.is_completed) {
              await this.stepTrackerModel.findOneAndUpdate(
                { id: userStepExists.id },
                { is_completed: true },
              )
            }
          }
        }
      }

      await this.leadModel.findOneAndUpdate(
        {
          leadID,
        },
        {
          status,
          // alloUID: '0',
          // sanctionalloUID: userID,
        },
      )

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
    }
    if (status === LeadStatus.BLACK_LISTED) {
      // const callHistory = await this.callHistoryModel.findOne({
      //   where: { status, leadID },
      //   select: ['callHistoryID'],
      //   order: [{ column: 'callHistoryID', order: 'desc' }],
      // })

      // if (callHistory) throw new BadRequestError(`Selected Lead is already in ${status}`)

      // const callHistoryLogs = await this.callHistoryLogsModel.findOne({
      //   where: { status, leadID },
      //   select: ['callHistoryID'],
      //   order: [{ column: 'callHistoryID', order: 'desc' }],
      // })

      // if (callHistoryLogs) throw new BadRequestError(`Selected Lead is already in ${status}`)

      await this.insertLeadToCallHistory(
        customerID,
        leadID,
        'blacklisted',
        userID,
        'blacklist',
        noteli,
      )

      const blackListData: InsertData<IBlacklistCustomerPancard> = {
        pancard: pancard,
        status: 'Active',
        addBy: userID,
      }

      await Promise.all([
        this.blackListCustomerPancardModel.create(blackListData),
        this.leadModel.findOneAndUpdate({ customerID, leadID }, { status }),
        this.mobileTokenModel.findOneAndUpdate(
          { mobile: mobile.toString() },
          { access_token: LeadStatus.BLACK_LISTED },
        ),
      ])

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
    }

    throw new BadRequestError(`Customer cannot be moved from ${leadStatus} to ${status}`)
  }

  bankUpdateCheck = async (
    payload: IBankUpdateCheckPayload,
    leadID: number,
    userID: number,
    clientIp: string,
  ) => {
    const {
      IsEmandateGreaterEqualToLoanAmount,
      isAddressAndEmploymentDetailsPresent,
      isCustomerTransferSalaryToAnotherAccount,
      isLoanAmountVerified,
      isPanAadharSelfieVerified,
      isPennyDropCompleted,
      isRepaymentDateVerified,
      isSelfieClear,
      loanAcceptanceMode,
      isReference1Verified,
      isReference2Verified,
      primaryAccountId,
      secondaryAccountId,
    } = payload

    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['customerID', 'status'],
    })

    if (!lead) throw new NotFoundError('This lead does not exist')

    const { status, customerID } = lead

    if (status !== LeadStatus.APPROVED)
      throw new BadRequestError(
        `Customer cannot be moved from ${status} to ${LeadStatus.DISBURSAL_SHEET_SEND}`,
      )

    const dataToSave = { ...payload, customerID, leadID, userID }

    await this.bankUpdateCheckModel.insert({
      customerID,
      leadID,
      data: JSON.stringify(dataToSave),
    })

    const { data, message, statusCode } = await this.bankUpdate(
      { accountID: primaryAccountId, accountType: 'old' },
      leadID,
      userID,
      clientIp,
    )

    return this.serviceResponse(statusCode, data, message)
  }

  bankUpdate = async (
    payload: IBankUpdatePayload,
    leadID: number,
    userID: number,
    clientIp: string,
  ) => {
    const { accountID, accountNo, accountType, bankName, ifsc } = payload

    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['customerID'],
    })

    if (!lead) throw new NotFoundError('This lead does not exist')

    const { customerID } = lead

    if (accountType === 'new') {
      const bankIfsc = await this.bankIfscModel.findOne({
        where: { IFSC: ifsc, is_active: '0' },
        select: ['id'],
      })

      if (bankIfsc)
        throw new BadRequestError('This bank account is inactive, Please select another bank')
    }

    let account: ICustomerAccount

    if (accountType === 'old') {
      account = await this.customerAccountModel.findOne({
        where: { accountID },
        select: ['bankIfsc', 'accountNo', 'accountType', 'bank', 'bankBranch'],
      })
    } else {
      const [accountId] = await this.customerAccountModel.insert({
        accountNo,
        accountType: BankAccountType.SAVING,
        bankIfsc: ifsc,
        bank: bankName,
        bankBranch: 'N/A',
        ip: clientIp,
        credatedBy: +config.defaultUserId,
        // bank_holder_name: accountHoldersName,
        customerID,
        leadID,
        status: BankAccountStatus.VERIFIED,
        is_credit: '1',
      })

      account = await this.customerAccountModel.findOne({
        where: { accountID: accountId },
        select: ['bankIfsc', 'accountNo', 'accountType', 'bank', 'bankBranch'],
      })
    }

    if (!account) throw new BadRequestError('Invalid account')

    const bankIfsc = await this.bankIfscModel.findOne({
      where: { IFSC: account.bankIfsc, is_active: '0' },
      select: ['id'],
    })

    if (bankIfsc)
      throw new BadRequestError('This bank account is inactive, Please select another bank')

    let loanNo = createLoanNumber()

    const approval = await this.approvalModel.findOneApproval(
      {
        customerID,
        leadID,
      },
      ['repayDate', 'loanAmtApproved', 'adminFee', 'GstOfAdminFee'],
    )

    if (!approval) throw new NotFoundError('No approval found for this lead')

    const customer = await this.customerModel.findOneCustomer(
      {
        customerID,
      },
      ['name', 'mobile', 'email'],
    )

    if (!customer) throw new NotFoundError('This customer does not exist')

    const { name, mobile, email } = customer
    const currentDate = moment().startOf('day')
    const repayDate = moment(approval.repayDate)

    const dateDiff = repayDate.diff(currentDate, 'days')

    if (dateDiff < 6) {
      throw new BadRequestError('Repay date cannot be less than 6 days')
    }

    if (config.nodeEnv === 'staging' || config.nodeEnv === 'development') {
      const note = `${name}-${leadID}-${generateRandomNumber(1111, 9999)}`
      const referenceId = `${name}-${mobile}`
      const contactId = generateRandomId('cont')
      await Promise.all([
        this.razorPayPayoutContactsModel.create({
          customerID: customerID.str,
          leadID: leadID.str,
          cont_id: contactId,
          cont_entity: 'contact',
          cont_name: name,
          cont_contact: mobile.str,
          cont_email: email,
          cont_type: 'customer',
          cont_reference_id: referenceId,
          cont_batch_id: '',
          cont_active: '1',
          cont_notes_key_1: note,
          cont_notes_key_2: note,
          createdDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
          uid: userID.str,
        }),
        this.razorpayPayoutAccountsModel.insert({
          customerID: customerID.str,
          leadID: leadID.str,
          acc_id: generateRandomId('fa'),
          entity: 'fund_account',
          contact_id: contactId,
          account_type: 'bank_account',
          ifsc: account.bankIfsc,
          bank_name: account.bank,
          name,
          account_number: account.accountNo,
          active: '1',
          batch_id: '',
          createdDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
          uid: userID.str,
        }),
      ])

      await this.insertLeadToCallHistory(
        customerID,
        leadID,
        LeadStatus.DISBURSAL_SHEET_SEND,
        userID,
      )

      let loanExists = await this.loanModel.findOneLoan({
        leadID,
      })

      do {
        let loanExists = await this.loanModel.findOneLoan({ loanNo })
        if (loanExists) {
          loanNo = createLoanNumber()
          break
        }
      } while (loanExists)

      await Promise.all([
        this.loanModel.create({
          leadID,
          loanNo,
          customerID,
          disbursalAmount: approval.loanAmtApproved,
          disbursalDate: '0000-00-00' as unknown as Date,
          disbursalRefrenceNo: '',
          accountNo: account.accountNo,
          accountType: account.accountType,
          bankIfsc: account.bankIfsc,
          bank: account.bank,
          bankBranch: account.bankBranch,
          chequeDetails: '',
          pdDate: moment().format('YYYY-MM-DD'),
          pdDoneBy: userID.str,
          deduction: approval.adminFee + approval.GstOfAdminFee,
          remarks: '',
          status: LoanStatus.DISBURSAL_SHEET_SENT,
          companyAccountNo: config.companyAccountNo,
          ip: clientIp, // ! NOTE
          disbursedBy: +config.defaultUserId,
        }),
        this.leadModel.findOneAndUpdate(
          {
            leadID,
          },
          { status: LeadStatus.DISBURSAL_SHEET_SEND, alloUID: '0' },
        ),
      ])

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Bank Update success')
    }

    const note = `${name}-${leadID}-${generateRandomNumber(1111, 9999)}`
    const referenceId = `${name}-${mobile}`

    const createContactPayload: IRazorPayContactsRequest = {
      contact: mobile,
      email,
      name,
      notes: {
        notes_key_1: note,
        notes_key_2: note,
      },
      reference_id: referenceId.substring(0, 39),
      type: RazorPayContactType.CUSTOMER,
    }

    const contactResp = await this.razorPayPayments.createContact(
      customerID,
      Number(leadID),
      createContactPayload,
    )

    if (!contactResp.success) {
      throw new BadRequestError('There was an issue while updating bank, Please try again later!')
    }

    // Now hit fund_account to create user's fund account
    const createFundAccountPayload: IRazorPayCreateFundAccountRequest = {
      contact_id: contactResp.data.id,
      account_type: 'bank_account',
      bank_account: {
        account_number: account.accountNo,
        ifsc: account.bankIfsc,
        name,
      },
    }

    const createFundAccountResp = await this.razorPayPayments.createFundAccount(
      customerID,
      Number(leadID),
      createFundAccountPayload,
    )

    if (!contactResp.success) {
      throw new BadRequestError('There was an issue while updating bank, Please try again later!')
    }

    await Promise.all([
      this.razorPayPayoutContactsModel.create({
        customerID: customerID.str,
        leadID: leadID.str,
        cont_id: contactResp.data.id,
        cont_entity: contactResp.data.entity,
        cont_name: contactResp.data.name,
        cont_contact: contactResp.data.contact,
        cont_email: contactResp.data.email,
        cont_type: contactResp.data.type,
        cont_reference_id: contactResp.data.reference_id,
        cont_batch_id: contactResp.data.batch_id ?? '',
        cont_active: contactResp.data.active ? '1' : '0',
        cont_notes_key_1: contactResp.data.notes ? contactResp.data.notes.notes_key_1 : '',
        cont_notes_key_2: contactResp.data.notes ? contactResp.data.notes.notes_key_2 : '',
        createdDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
        uid: userID.str,
      }),
      this.razorpayPayoutAccountsModel.insert({
        customerID: customerID.str,
        leadID: leadID.str,
        acc_id: createFundAccountResp.data.id,
        entity: createFundAccountResp.data.entity,
        contact_id: createFundAccountResp.data.contact_id,
        account_type: createFundAccountResp.data.account_type,
        ifsc: createFundAccountResp.data.bank_account.ifsc,
        bank_name: createFundAccountResp.data.bank_account.bank_name,
        name: createFundAccountResp.data.bank_account.name,
        account_number: createFundAccountResp.data.bank_account.account_number,
        active: createFundAccountResp.data.active ? '1' : '0',
        batch_id: '',
        createdDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
        uid: userID.str,
      }),
    ])

    await this.insertLeadToCallHistory(customerID, leadID, LeadStatus.DISBURSAL_SHEET_SEND, userID)

    let loanExists = await this.loanModel.findOneLoan({
      leadID,
    })

    do {
      loanExists = await this.loanModel.findOneLoan({ loanNo })
      if (loanExists) {
        loanNo = createLoanNumber()
        break
      }
    } while (loanExists)

    await Promise.all([
      this.loanModel.create({
        leadID,
        loanNo,
        customerID,
        disbursalAmount: approval.loanAmtApproved,
        disbursalDate: '0000-00-00' as unknown as Date,
        disbursalRefrenceNo: '',
        accountNo: account.accountNo,
        accountType: account.accountType,
        bankIfsc: account.bankIfsc,
        bank: account.bank,
        bankBranch: account.bankBranch,
        chequeDetails: '',
        pdDate: '',
        pdDoneBy: '',
        deduction: approval.adminFee + approval.GstOfAdminFee,
        remarks: '',
        status: LoanStatus.DISBURSAL_SHEET_SENT,
        companyAccountNo: config.companyAccountNo,
        ip: clientIp, // ! NOTE
        disbursedBy: +config.defaultUserId,
      }),
      this.leadModel.findOneAndUpdate(
        {
          leadID,
        },
        { status: LeadStatus.DISBURSAL_SHEET_SEND, alloUID: '0' },
      ),
    ])

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Bank Update success')
  }

  getBankUpdateData = async (leadID: number) => {
    let checks = {
      panAadharSelfie: false,
      addressAndEmployer: false,
      pennyDrop: false,
      emdCheck: false,
      selfieClear: false,
      repaymentDate: moment().startOf('day').add(6, 'days').format('Do MMMM, YYYY'),
      loanAmountApproved: 0,
      reference: null,
    }

    let panCheck = false,
      aadharCheck = false,
      selfieCheck = false

    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['em_id', 'customerID'],
    })

    if (!lead) throw new NotFoundError('This lead does not exists')

    const { customerID } = lead

    const customer = await this.customerModel.findOneCustomer({ customerID }, [
      'customerID',
      'aadharNo',
      'pancard',
      'mobile',
      'gender',
      'employeeType',
      'salary_date',
      'name',
      'pan_cust_verified',
    ])

    if (customer.pan_cust_verified == 1) {
      panCheck = true
    }

    const approval = await this.approvalModel.findOneApproval(
      {
        customerID,
        leadID,
      },
      ['loanAmtApproved', 'repayDate'],
    )

    let aadharExists

    if (customer.aadharNo) {
      aadharExists = await leadsApiLogModel.count({
        where: {
          status: 1,
          api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
          api_supplier: ApiSupplierType.SUREPASS,
          aadharNo: customer.aadharNo.str,
          mobile_no: String(customer.mobile),
        },
      })
    }

    const digilockerExists = await leadsApiLogModel.count({
      where: {
        status: 1,
        api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
        api_supplier: ApiSupplierType.DECENTRO,
        mobile_no: String(customer.mobile),
      },
    })
    if (aadharExists || digilockerExists || customer.dob_digit_match == '1') {
      // Save AADHAR Step
      aadharCheck = true
    }

    const selfieStepCheck = await leadsApiLogModel.findOneLeadsApiLog(
      {
        api_type: 'face-match',
        api_supplier: 5,
        status: 1,
        mobile_no: String(customer.mobile),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )

    if (selfieStepCheck) {
      // Save selfie step
      if (selfieStepCheck.api_response) {
        const resp = JSON.parse(selfieStepCheck.api_response)

        if (resp?.result?.is_same_face && resp?.result?.person_image_correctly_identified) {
          selfieCheck = true
        }
      }
    }

    const address = await this.addressModel.count({ where: { customerID } })
    const employer = await this.employerModel.count({ where: { customerID } })

    // For emd check check em_id first

    if (lead.em_id) {
      // ! Find account associated with that emandate

      const emd = await this.razorpayMandateModel.findOne({
        where: { id: lead.em_id },
        select: ['accountNo', 'ifsc', 'emMaxamount'],
        order: [{ column: 'id', order: 'desc' }],
      })

      if (!emd) {
        checks.emdCheck = false
      }

      if (!approval) {
        checks.emdCheck = false
      }

      if (emd?.emMaxamount >= approval?.loanAmtApproved * 2.5) {
        checks.emdCheck = true
      }

      if (emd?.accountNo) {
        const pennyData = await this.pennyDropModel.findOne({
          where: {
            account_number: emd.accountNo,
            customerID: customerID,
            account_status: 'active',
            penny_status: PennyStatus.COMPLETED,
          },
          order: [{ column: 'id', order: 'desc' }],
        })

        if (pennyData) {
          checks.pennyDrop = true
        }
      }
    } else {
      const customerAccount = await this.customerAccountModel.findOne({
        where: { customerID, is_credit: '1' },
        select: ['accountNo'],
        order: [{ column: 'accountID', order: 'desc' }],
      })

      if (customerAccount) {
        const emd = await this.razorpayMandateModel.findOne({
          where: { id: lead.em_id },
          select: ['accountNo', 'ifsc', 'emMaxamount'],
          order: [{ column: 'id', order: 'desc' }],
        })

        if (emd) {
          const approval = await this.approvalModel.findOneApproval(
            {
              customerID,
              leadID,
            },
            ['loanAmtApproved'],
          )

          if (approval) {
            if (emd?.emMaxamount >= approval?.loanAmtApproved * 2.5) {
              checks.emdCheck = true
            }
          }

          if (emd?.accountNo) {
            const pennyData = await this.pennyDropModel.findOne({
              where: {
                account_number: emd.accountNo,
                customerID: customerID,
                account_status: 'active',
                penny_status: PennyStatus.COMPLETED,
              },
              order: [{ column: 'id', order: 'desc' }],
            })

            if (pennyData) {
              checks.pennyDrop = true
            }
          }
        }
      }
    }

    if (selfieStepCheck) {
      // Save selfie step
      if (selfieStepCheck.api_response) {
        const resp = JSON.parse(selfieStepCheck.api_response)

        if (resp?.result?.is_same_face && resp?.result?.person_image_correctly_identified) {
          checks.selfieClear = true
        }
      }
    }

    if (selfieCheck && aadharCheck && panCheck) checks.panAadharSelfie = true
    if (address && employer) checks.addressAndEmployer = true

    if (approval?.repayDate) {
      checks.repaymentDate = moment(approval.repayDate).startOf('day').format('Do MMMM, YYYY')
    }

    if (approval?.loanAmtApproved) {
      checks.loanAmountApproved = approval.loanAmtApproved
    }

    const references = await this.referenceModel.find({
      where: { customerID },
      select: ['contactNo', 'is_verified', 'name', 'relation'],
      paginate: { page: 1, perPage: 2 },
    })

    checks.reference = references

    const finalPayload = {
      details: [
        { addressAndEmployer: checks.addressAndEmployer },
        { emdCheck: checks.emdCheck },
        { panAadharSelfie: checks.panAadharSelfie },
        { pennyDrop: checks.pennyDrop },
        { selfieClear: checks.selfieClear },
      ],
      reference: checks.reference,
      loanDetails: {
        repaymentDate: checks.repaymentDate,
        loanAmount: checks.loanAmountApproved,
      },
    }

    return this.serviceResponse(HttpStatusCode.Ok, finalPayload, 'Data retrieved')
  }

  razorpayDisbursalData = async (leadID: number) => {
    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['leadID', 'customerID'],
    })

    if (!lead) throw new NotFoundError('This lead does not exist')

    const [rpayData, loan] = await Promise.all([
      this.razorpayPayoutAccountsModel.findOne({
        where: { leadID: leadID.str },
        select: ['bank_name', 'account_number', 'ifsc'],
        order: [{ column: 'payaccID', order: 'desc' }],
      }),
      await this.loanModel.findOneLoan(
        {
          leadID,
          disbursalRefrenceNo: '',
          status: LoanStatus.DISBURSAL_SHEET_SENT,
        },
        ['disbursalAmount', 'deduction'],
      ),
    ])

    if (!loan) throw new NotFoundError('Loan details not found')
    if (!rpayData) throw new NotFoundError('Razorpay details not found')

    const data = {
      ...rpayData,
      disbursalAmount: loan.disbursalAmount - loan.deduction,
    }

    return this.serviceResponse(HttpStatusCode.Ok, data, 'Data Fetched')
  }

  razorpayDisbursal = async (leadID: number) => {
    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['leadID', 'customerID', 'status'],
    })

    if (!lead) throw new NotFoundError('This lead does not exist')

    const { status } = lead

    if (status !== LeadStatus.DISBURSAL_SHEET_SEND)
      throw new BadRequestError(
        `Customer cannot be moved from ${status} to ${LeadStatus.DISBURSED}`,
      )

    const [rpayPayout, loan] = await Promise.all([
      this.razorpayPayoutDisbursedAmountModel.findOne({
        where: { leadID: leadID.str },
      }),
      this.loanModel.findOneLoan({
        leadID,
        disbursalRefrenceNo: '',
        status: LoanStatus.DISBURSAL_SHEET_SENT,
      }),
    ])

    if (!loan) throw new NotFoundError('User loan details were not found')

    if (rpayPayout) throw new NotFoundError('Payout already in progress')

    const disbursalJobCount = await this.disbursalJobsModel.count({
      where: { leadID },
    })

    if (disbursalJobCount > 0) throw new NotFoundError('Payout already in progress')

    await this.loanService.createAutoDisbursal(leadID)

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
  }

  disbursalUpdate = async (payload: IDisbursalUpdatePayload, leadID: number, userID: number) => {
    const { disbursalDate, disbursalReferenceNo, remarks } = payload

    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['leadID', 'customerID', 'status'],
    })

    if (!lead) throw new NotFoundError('This lead does not exist')

    const { customerID, status } = lead

    let dateOfDisbursal = moment(disbursalDate).utcOffset(330).startOf('day').format('YYYY-MM-DD')

    await this.loanModel.findOneAndUpdate(
      {
        leadID,
      },
      {
        disbursalDate: dateOfDisbursal as unknown as Date,
        disbursalTime: moment().format('HH:mm:ss'),
        disbursalRefrenceNo: disbursalReferenceNo,
        remarks,
        status: LoanStatus.DISBURSED,
        is_manual: '1',
        manual_date: dateOfDisbursal,
        utr: disbursalReferenceNo,
        payout_status: 2,
        disbursedBy: userID,
      },
    )

    await this.transactionService.manageTransactions({
      leadID,
      type: 'disbursal',
      collectionID: null,
      gateway: TransactionGateway.MANUAL,
    })

    await this.callHistoryLogsModel.insert({
      customerID,
      leadID,
      callType: CallType.IVR,
      status: LeadStatus.DISBURSED,
      remark: remarks ?? '',
      noteli: '',
      callbackTime: moment().startOf('day').format('YYYY-MM-DD') as unknown as Date,
      calledBy: userID,
    })

    await this.leadModel.findOneAndUpdate(
      {
        leadID,
      },
      {
        status: LeadStatus.DISBURSED,
      },
    )

    const credit = await this.creditModel.findOneCredit(
      {
        customerID,
        leadID,
      },
      ['creditID', 'principal', 'roi', 'tenure'],
      [{ column: 'creditID', order: 'desc' }],
    )

    if (credit) {
      await this.crmService.getDocsRequirements({
        creditId: credit.creditID,
        loanAmount: credit.principal,
        roi: credit.roi,
        tenure: credit.tenure,
      })
    }

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
  }

  async creditList(
    payload: ICreditListPayload,
    userID: number,
    page?: number,
    perPage?: number,
    isExcelDownload?: boolean,
  ): Promise<IServiceResponse> {
    const {
      lead_id,
      search_by,
      customer_search,
      city,
      state,
      status,
      employment_type,
      salary_mode,
      monthly_income,
      start_date,
      end_date,
      allocated,
      allocatedFilter,
      utm_source,
      flow,
      device,
      apID,
      scID,
    } = payload

    const leadStatus = status ? [status] : ['Approved', 'Rejected', 'Hold', 'Not Required']

    const db = getKnexInstance()

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    let startDate, endDate

    if (!start_date && !end_date) {
      startDate = moment().startOf('month').format('YYYY-MM-DD')
      endDate = moment().format('YYYY-MM-DD')
    } else {
      startDate = start_date
      endDate = end_date
    }

    const query = db('customer')
      .select(
        'leads.leadID',
        'customer.customerID',
        'leads.utmSource',
        'leads.step',
        'leads.alloUID',
        'alloUser.name as allocatedTo',
        db.raw(
          `CASE
          WHEN leads.MLresponse IS NOT NULL
          THEN ROUND((1 - leads.MLresponse) * 100, 2)
          ELSE NULL
      END AS observation`,
        ),
        'leads.MLamount as preApprovedAmt',
        'leads.MLsalary as 	mLAvgSalary',
        'customer.name',
        'customer.email',
        'customer.mobile',
        'leads.loanRequeried',
        'leads.monthlyIncome',
        'customer.employeeType',
        'leads.city',
        'leads.state',
        'leads.pincode',
        'leads.status',
        'callUser.name as approvedBy',
        'callhistoryLogs.createdDate as approvedDate',
        'sanctionUser.name as sanctionBy',
        'sanction.createdDate as sanctionDate',
        'approval.rejectionReason as reason',
        'approval.remark as Remark',
        'approval.disbursalRemark as disbursalRemark',
        'leads.fbLeads as leadType',
        'leads.createdDate as leadcreatedDate',
        'followup.createdDate as followupDate',
        'collectionFollowupUser.name as followupExecutive',
        'followup.StatusType as followupStatus',
        db.raw(
          `CASE
        WHEN deviceDetail.android_version IS NOT NULL
        THEN 'Android'
        ELSE 'IOS'
       END AS deviceType`,
        ),
        db.raw(
          `CASE
        WHEN leads.step LIKE ? THEN 'Repeat'
        WHEN leads.step LIKE ? THEN 'Short'
        WHEN leads.step LIKE ? THEN 'Long'
        WHEN leads.step LIKE ? THEN 'Common'
        WHEN leads.step LIKE ? THEN 'Existing'
        WHEN leads.step LIKE ? THEN '1_page'
        WHEN leads.utmSource LIKE ? THEN 'Old App'
        WHEN leads.utmSource LIKE ? AND leads.step IS NULL THEN 'Not Captured'
        ELSE 'Web'
      END AS flow`,
          [
            '%Repeat%',
            '%Short%',
            '%Long%',
            '%Common%',
            '%Existing%',
            '%1_page%',
            '%apps%',
            '%APP_V%',
          ],
        ),
        db.raw(
          `CASE
        WHEN leads.step LIKE '%Short%' THEN
          CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Short', '')) > 0
               THEN SUBSTRING_INDEX(leads.step, 'Short', -1)
               ELSE ''
          END
        WHEN leads.step LIKE '%Long%' THEN
          CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Long', '')) > 0
               THEN SUBSTRING_INDEX(leads.step, 'Long', -1)
               ELSE ''
          END
        WHEN leads.step LIKE '%Common%' THEN
          CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Common', '')) > 0
               THEN SUBSTRING_INDEX(leads.step, 'Common', -1)
               ELSE ''
          END
        WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'
        WHEN leads.step LIKE '%Existing%' THEN 'Existing'
        WHEN leads.step LIKE '%1_page%' THEN '1_page'
        WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'
        WHEN leads.utmSource LIKE '%apps%' THEN 'Stage Completed'
        ELSE 'Stage Completed'
      END AS stage`,
        ),
        db.raw(
          `CASE
        WHEN leads.step LIKE '%Repeat%' OR leads.step LIKE '%Short%' OR leads.step LIKE '%Long%'
          OR leads.step LIKE '%Common%' OR leads.step LIKE '%Existing%' OR leads.step LIKE '%1_page%'
          THEN COALESCE(
            (SELECT screen_name FROM flow_screen_map
             WHERE flow_screen_map.flow =
              CASE
                WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'
                WHEN leads.step LIKE '%Short%' THEN 'Short'
                WHEN leads.step LIKE '%Long%' THEN 'Long'
                WHEN leads.step LIKE '%Common%' THEN 'Common'
                WHEN leads.step LIKE '%Existing%' THEN 'Existing'
                WHEN leads.step LIKE '%1_page%' THEN '1_page'
              END
             AND flow_screen_map.stage = TRIM(SUBSTRING_INDEX(leads.step, '/', 1))
             LIMIT 1),
            'Not Mapped'
          )
        WHEN leads.utmSource LIKE '%apps%' THEN 'Page Completed'
        WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'
        ELSE ''
      END AS page`,
        ),
      )
      .orderBy('leads.leadID', 'desc')
      .join('leads', 'customer.customerID', '=', 'leads.customerID')
      .leftJoin('callhistoryLogs', function () {
        this.on('leads.leadID', '=', 'callhistoryLogs.leadID')
          .andOn(db.raw('callhistoryLogs.status IN (?)', [leadStatus]))
          .andOn(
            'callhistoryLogs.createdDate',
            '=',
            db.raw(
              `(SELECT MIN(callHistoryID) FROM callhistoryLogs WHERE leadID = leads.leadID AND status IN (?))`,
              [leadStatus],
            ),
          )
      })
      .leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID')
      .leftJoin('users as callUser', 'callhistoryLogs.calledBy', '=', 'callUser.userID')
      .leftJoin('approval', function () {
        this.on('approval.customerID', '=', 'customer.customerID').andOn(
          'approval.leadID',
          '=',
          'leads.leadID',
        )
      })
      .leftJoin('collectionFollowup as followup', function () {
        this.on('followup.leadID', '=', 'leads.leadID')
          .andOn('followup.followup_type', '=', db.raw('?', [1]))
          .andOn(
            'followup.reviewID',
            '=',
            db.raw(
              `(SELECT MAX(reviewID) FROM collectionFollowup WHERE leadID = leads.leadID AND followup_type = 1)`,
            ),
          )
      })
      .leftJoin(
        'users as collectionFollowupUser',
        'followup.createdBy',
        '=',
        'collectionFollowupUser.userID',
      )

      .leftJoin('callhistoryLogs as sanction', function () {
        this.on('sanction.customerID', '=', db.ref('customer.customerID'))
          .andOn('sanction.leadID', '=', db.ref('leads.leadID'))
          .andOn('sanction.status', '=', db.raw('?', ['Approved Process']))
          .andOn(
            'sanction.createdDate',
            '=',
            db.raw(
              `(SELECT MAX(l.createdDate) FROM callhistoryLogs as l WHERE l.leadID = leads.leadID AND l.status = ?)`,
              ['Approved Process'],
            ),
          )
      })
      .leftJoin('users as sanctionUser', 'sanction.calledBy', '=', 'sanctionUser.userID')

      .leftJoin(
        db('login_device_detail as deviceDetail')
          .select('deviceDetail.*')
          .whereIn('id', function () {
            this.select(db.raw('MAX(id)'))
              .from('login_device_detail')
              .whereNotNull('modelName')
              .whereNotNull('android_version')
              .groupBy('mobile')
          })
          .as('deviceDetail'),
        'deviceDetail.mobile',
        'customer.mobile',
      )
      .whereIn('leads.status', leadStatus)

    query.whereBetween('leads.createdDate', [startDate, endDate])

    // Flow Filters Optimized
    if (flow) {
      switch (flow) {
        case 'Long':
        case 'Short':
        case 'Common':
        case 'Repeat':
        case 'Existing':
        case '1_page':
          query.whereRaw("leads.step LIKE ? AND leads.utmSource LIKE 'APP_V%'", [`%${flow}%`])
          break
        case 'Old App':
          query.where('leads.utmSource', 'like', `%${flow}%`)
          break
        case 'Web':
          query
            .whereNot('leads.utmSource', 'like', 'apps%')
            .whereNot('leads.utmSource', 'like', 'APP_V%')
          break
      }
    }

    //search_by case handling
    if (search_by && customer_search) {
      switch (search_by) {
        case 'mobile':
          query.where('customer.mobile', customer_search)
          break
        case 'name':
          query.where('customer.name', customer_search)
          break
        case 'email':
          query.where('customer.email', customer_search)
          break
        case 'aadharNo':
          query.where('customer.aadharNo', customer_search)
          break
        case 'pancard':
          query.where('customer.pancard', customer_search)
          break
      }
    }

    // Optimized Monthly Income Condition
    if (monthly_income) {
      query.where('leads.monthlyIncome', monthly_income == 1 ? '<' : '>=', 20000)
    }

    // Optimized Allocation Filters
    if (allocated) {
      query.where(function (builder) {
        if (allocated == 0) {
          builder.where('leads.sanctionalloUID', 0)
        } else {
          builder.whereIn('leads.alloUID', [allocated, userID])
        }
      })
    }

    if (allocatedFilter) {
      query.where(function (builder) {
        if (allocatedFilter == 2) {
          builder.whereNotIn('leads.alloUID', [userID, '', 0])
        } else if (allocatedFilter == 3) {
          builder.where('leads.alloUID', userID)
        }
      })
    }
    if (lead_id) query.where('leads.leadID', lead_id)
    if (city) query.where('leads.city', city)
    if (state) query.where('leads.state', state)
    if (utm_source) query.where('leads.utmSource', utm_source)

    // Optimized Device Filtering
    if (device && device !== 'All') {
      if (device === 'android') {
        query.whereExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
            .whereNotNull('modelName')
            .whereNotNull('android_version')
        })
      } else {
        query.whereNotExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
        })
      }
    }

    if (isExcelDownload) {
      let data = await query

      if (data.length == 0) {
        data = [
          {
            leadID: '-',
            customerID: '-',
            utmSource: '-',
            step: '-',
            alloUID: '-',
            allocatedTo: '-',
            observation: '-',
            preApprovedAmt: '-',
            mLAvgSalary: '-',
            name: '-',
            email: '-',
            mobile: '-',
            loanRequeried: '-',
            monthlyIncome: '-',
            employeeType: '-',
            city: '-',
            state: '-',
            pincode: '-',
            status: '-',
            approvedBy: '-',
            approvedDate: '-',
            sanctionBy: '-',
            sanctionDate: '-',
            reason: '-',
            Remark: '-',
            disbursalRemark: '-',
            leadType: '-',
            leadcreatedDate: '-',
            followupDate: '-',
            followupExecutive: '-',
            followupStatus: '-',
            deviceType: '-',
            flow: '-',
            stage: '-',
            page: '-',
          },
        ]
      }

      //get workbook from exceljs
      const workbook = await this.excelDownloadService.exportDataToExcelBuffer(data)
      return this.serviceResponse(200, { workbook }, 'Excel generated successfully')
    }

    const totalCountQuery = query.clone().count('* as totalCount').first()

    const paginatedQuery = query.clone().limit(perPage).offset(page)

    const [totalCountResult, paginatedData] = await Promise.all([totalCountQuery, paginatedQuery])

    const res = {
      result: paginatedData,
      totalCount: Number(totalCountResult?.totalCount ?? 0),
      totalPages: calculateTotalPages(Number(totalCountResult?.totalCount ?? 0), perPage),
    }

    return this.serviceResponse(200, res, 'Credit data retreived successfully.')
  }

  async sanctionList(
    payload: ISanctionListPayload,
    userID: number,
    page?: number,
    perPage?: number,
    isExcelDownload?: boolean,
  ): Promise<IServiceResponse> {
    const {
      sanction,
      search_by,
      customer_search,
      lead_id,
      city,
      state,
      status,
      lead_case,
      employment_type,
      salary_mode,
      monthly_income,
      disposition,
      start_date,
      end_date,
      allocated,
      apID,
      utm_source,
      flow,
      device,
      action_start_date,
      action_end_date,
      allocatedFilter,
    } = payload

    let leadStatus = []

    if (status) {
      leadStatus = [status]
    } else {
      leadStatus = ['Approved Process', 'Rejected Process', 'Hold Process', 'Not Required Process']
    }

    let startDate, endDate

    if (!start_date && !end_date) {
      startDate = moment().startOf('month').format('YYYY-MM-DD')
      endDate = moment().format('YYYY-MM-DD')
    } else {
      startDate = start_date
      endDate = end_date
    }

    const db = getKnexInstance()

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    let query = db('customer')
      .select(
        'leads.leadID',
        'customer.customerID',
        'leads.utmSource',
        'leads.step',
        'leads.alloUID',
        'alloUser.name as allocatedTo',
        db.raw(
          `CASE
            WHEN leads.MLresponse IS NOT NULL
            THEN ROUND((1 - leads.MLresponse) * 100, 2)
            ELSE NULL
        END AS observation`,
        ),
        'leads.MLamount as preApprovedAmt',
        'leads.MLsalary as 	MLAvgSalary',
        'customer.name',
        'customer.email',
        'customer.mobile',
        'leads.loanRequeried',
        'leads.monthlyIncome',
        'customer.employeeType',
        'approval.loanAmtApproved as approvedAmount',
        'leads.city',
        'leads.state',
        'leads.pincode',
        'leads.status',

        // 'callUser.name as approvedBy',
        // 'callhistoryLogs.createdDate as approvedDate',

        'approval.rejectionReason as reason',
        'approval.remark as Remark',
        'approval.disbursalRemark as disbursalRemark',
        'leads.fbLeads as leadType',
        'leads.createdDate as leadcreatedDate',
        'followup.createdDate as sanctionDate',

        'collectionFollowupUser.name as sanctionExecutive',

        'followup.StatusType as sanctionStatus',
        db.raw(
          `CASE
          WHEN deviceDetail.android_version IS NOT NULL
          THEN 'Android'
          ELSE 'IOS'
        END AS deviceType`,
        ),
        db.raw(
          `CASE
          WHEN leads.step LIKE ? THEN 'Repeat'
          WHEN leads.step LIKE ? THEN 'Short'
          WHEN leads.step LIKE ? THEN 'Long'
          WHEN leads.step LIKE ? THEN 'Common'
          WHEN leads.step LIKE ? THEN 'Existing'
          WHEN leads.step LIKE ? THEN '1_page'
          WHEN leads.utmSource LIKE ? THEN 'Old App'
          WHEN leads.utmSource LIKE ? AND leads.step IS NULL THEN 'Not Captured'
          ELSE 'Web'
        END AS flow`,
          [
            '%Repeat%',
            '%Short%',
            '%Long%',
            '%Common%',
            '%Existing%',
            '%1_page%',
            '%apps%',
            '%APP_V%',
          ],
        ),
        db.raw(
          `CASE
          WHEN leads.step LIKE '%Short%' THEN
            CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Short', '')) > 0
                THEN SUBSTRING_INDEX(leads.step, 'Short', -1)
                ELSE ''
            END
          WHEN leads.step LIKE '%Long%' THEN
            CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Long', '')) > 0
                THEN SUBSTRING_INDEX(leads.step, 'Long', -1)
                ELSE ''
            END
          WHEN leads.step LIKE '%Common%' THEN
            CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Common', '')) > 0
                THEN SUBSTRING_INDEX(leads.step, 'Common', -1)
                ELSE ''
            END
          WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'
          WHEN leads.step LIKE '%Existing%' THEN 'Existing'
          WHEN leads.step LIKE '%1_page%' THEN '1_page'
          WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'
          WHEN leads.utmSource LIKE '%apps%' THEN 'Stage Completed'
          ELSE 'Stage Completed'
        END AS stage`,
        ),
        db.raw(
          `CASE
          WHEN leads.step LIKE '%Repeat%' OR leads.step LIKE '%Short%' OR leads.step LIKE '%Long%'
            OR leads.step LIKE '%Common%' OR leads.step LIKE '%Existing%' OR leads.step LIKE '%1_page%'
            THEN COALESCE(
              (SELECT screen_name FROM flow_screen_map
              WHERE flow_screen_map.flow =
                CASE
                  WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'
                  WHEN leads.step LIKE '%Short%' THEN 'Short'
                  WHEN leads.step LIKE '%Long%' THEN 'Long'
                  WHEN leads.step LIKE '%Common%' THEN 'Common'
                  WHEN leads.step LIKE '%Existing%' THEN 'Existing'
                  WHEN leads.step LIKE '%1_page%' THEN '1_page'
                END
              AND flow_screen_map.stage = TRIM(SUBSTRING_INDEX(leads.step, '/', 1))
              LIMIT 1),
              'Not Mapped'
            )
          WHEN leads.utmSource LIKE '%apps%' THEN 'Page Completed'
          WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'
          ELSE ''
        END AS page`,
        ),
        'credit_reports.score',
      )
      .join('leads', 'customer.customerID', '=', 'leads.customerID')
      .leftJoin('approval', function () {
        this.on('approval.leadID', '=', 'leads.leadID')
      })
      .leftJoin('dialerFollowup', 'dialerFollowup.leadID', '=', 'leads.leadID')
      .leftJoin('credit_reports', function () {
        this.on('leads.customerID', '=', 'credit_reports.customerID').andOn(
          'credit_reports.id',
          '=',
          db.raw(
            '(SELECT MAX(id) FROM credit_reports WHERE customerID = credit_reports.customerID AND score != 0 limit 1)',
          ),
        )
      })
    if (sanction == 'Approved Process') {
      query.leftJoin('callhistoryLogs', function () {
        this.on('leads.leadID', '=', 'callhistoryLogs.leadID')
          .andOn(db.raw('callhistoryLogs.status IN (?)', [leadStatus]))
          .andOn(
            'callhistoryLogs.callHistoryID',
            '=',
            db.raw(
              `(SELECT MIN(callHistoryID) FROM callhistoryLogs WHERE leadID = leads.leadID AND status IN (?))`,
              [leadStatus],
            ),
          )
      })
    }
    query.leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID')
    if (sanction == 'Approved Process') {
      query.leftJoin('users as callUser', 'callhistoryLogs.calledBy', '=', 'callUser.userID')
    }
    query
      .leftJoin('collectionFollowup as followup', function () {
        this.on('followup.leadID', '=', 'leads.leadID')
          .andOn('followup.followup_type', '=', db.raw('?', [1]))
          .andOn(
            'followup.reviewID',
            '=',
            db.raw(
              `(SELECT MAX(reviewID) FROM collectionFollowup WHERE leadID = leads.leadID AND followup_type = 1)`,
            ),
          )
      })

      .leftJoin(
        'users as collectionFollowupUser',
        'followup.createdBy',
        '=',
        'collectionFollowupUser.userID',
      )

      .leftJoin(
        db('login_device_detail as deviceDetail')
          .select('deviceDetail.*')
          .whereIn('id', function () {
            this.select(db.raw('MAX(id)'))
              .from('login_device_detail')
              .whereNotNull('modelName')
              .whereNotNull('android_version')
              .groupBy('mobile')
          })
          .as('deviceDetail'),
        'deviceDetail.mobile',
        'customer.mobile',
      )
    query.whereIn('leads.status', leadStatus)

    if (sanction == 'Approved Process') {
      query.select('callhistoryLogs.createdDate as approvedDate')
      query.select('callUser.name as approvedBy')
    }

    if (startDate && startDate) {
      if (sanction != 'Approved Process') {
        query.whereBetween('leads.createdDate', [startDate, endDate])
      } else {
        query.whereBetween('callhistoryLogs.createdDate', [startDate, endDate])
      }
    }

    if (action_start_date && action_end_date) {
      query.whereBetween('approval.createdDate', [action_start_date, action_end_date])
    }

    if (employment_type) {
      query.where('customer.employeeType', employment_type)
    }
    if (lead_id) {
      query.where('leads.leadID', lead_id)
    }
    if (salary_mode) {
      query.where('leads.salaryMode', salary_mode)
    }
    if (city) {
      query.where('leads.city', city)
    }
    if (utm_source) {
      query.where('leads.utmSource', utm_source)
    }
    if (state) {
      query.where('leads.state', state)
    }
    if (lead_case) {
      query.where('leads.fbLeads', lead_case)
    }
    // if (status) {
    //   query.where('leads.status', status)
    // }
    if (disposition) {
      query.where('dialerFollowup.disposition', disposition)
    }
    if (flow) {
      switch (flow) {
        case 'Long':
        case 'Short':
        case 'Common':
        case 'Repeat':
        case 'Existing':
        case '1_page':
          query.where(function (builder) {
            builder
              .where('leads.step', 'like', `%${flow}%`)
              .where('leads.utmSource', 'like', 'APP_V%')
          })
          break

        case 'Old App':
          query.where('leads.utmSource', 'like', `%${flow}%`)
          break

        case 'Web':
          query.where(function (builder) {
            builder
              .whereNot('leads.utmSource', 'like', 'apps%')
              .whereNot('leads.utmSource', 'like', 'APP_V%')
          })
          break
      }
    }

    if (monthly_income) {
      if (monthly_income == 1) {
        query.where('leads.monthlyIncome', '<', 20000)
      } else if (monthly_income == 2) {
        query.where('leads.monthlyIncome', '>=', 20000)
      }
    }
    if (allocated) {
      if (allocated == 0) {
        query.where('leads.sanctionalloUID', 0)
      } else {
        query.where(function (builder) {
          builder
            .where('leads.callAssign', allocated)
            .orWhere('leads.creditAssign', allocated)
            .orWhere('leads.alloUID', allocated)
            .orWhere('leads.sanctionalloUID', allocated)
        })
      }
    }

    // Filter based on allocatedFilter
    if (allocatedFilter) {
      if (allocatedFilter == 2) {
        query.where(function () {
          this.where('leads.alloUID', '').orWhere('leads.alloUID', 'no')
        })
      } else if (allocatedFilter == 3) {
        query
          .where('leads.alloUID', '!=', '')
          .where('leads.alloUID', '!=', 0)
          .where('leads.alloUID', '!=', userID)
      } else {
        query.where('leads.alloUID', userID)
      }
    }

    if (apID != null && apID != undefined) {
      query.where('callhistoryLogs.calledBy', apID)
    }
    if (search_by && customer_search) {
      query.where(function (builder) {
        builder.where(`customer.${search_by}`, 'like', `%${customer_search}%`)
      })
    }
    if (device != null && device != undefined && device != 'All') {
      if (device === 'android') {
        query.whereExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
            .whereNotNull('login_device_detail.modelName')
            .whereNotNull('login_device_detail.android_version')
        })
      } else {
        query.whereNotExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
            .whereNull('login_device_detail.modelName')
            .whereNull('login_device_detail.android_version')
        })
      }
    }

    query.orderBy('leads.leadID', 'desc')

    if (isExcelDownload) {
      let data = await query

      if (data.length == 0) {
        data = [
          {
            leadID: '-',
            customerID: '-',
            utmSource: '-',
            step: '-',
            alloUID: '-',
            allocatedTo: '-',
            observation: '-',
            preApprovedAmt: '-',
            MLAvgSalary: '-',
            name: '-',
            email: '-',
            mobile: '-',
            loanRequeried: '-',
            monthlyIncome: '-',
            employeeType: '-',
            approvedAmount: '-',
            city: '-',
            state: '-',
            pincode: '-',
            status: '-',
            reason: '-',
            Remark: '-',
            disbursalRemark: '-',
            leadType: '-',
            leadcreatedDate: '-',
            sanctionDate: '-',
            sanctionExecutive: '-',
            sanctionStatus: '-',
            deviceType: '-',
            flow: '-',
            stage: '-',
            page: '-',
            score: '-',
          },
        ]
      }

      //get workbook from exceljs
      const workbook = await this.excelDownloadService.exportDataToExcelBuffer(data)
      return this.serviceResponse(200, { workbook }, 'Excel generated successfully')
    }

    const totalCountQuery = query.clone().count('* as totalCount').first()

    const paginatedQuery = query.clone().limit(perPage).offset(page)

    const [totalCountResult, paginatedData] = await Promise.all([totalCountQuery, paginatedQuery])

    const res = {
      result: paginatedData,
      totalCount: Number(totalCountResult?.totalCount ?? 0),
      totalPages: calculateTotalPages(Number(totalCountResult?.totalCount ?? 0), perPage),
    }

    return this.serviceResponse(200, res, 'Sanction data retreived successfully.')
  }

  async unprocessedList(
    payload: IUnprocessedListPayload,
    userID: number,
    page?: number,
    perPage?: number,
    isExcelDownload?: boolean,
  ): Promise<IServiceResponse> {
    const {
      search_by,
      customer_search,
      lead_id,
      city,
      state,
      status,
      lead_case,
      employment_type,
      salary_mode,
      monthly_income,
      start_date,
      end_date,
      allocated,
      utm_source,
      flow,
      device,
      allocatedFilter,
    } = payload

    const statuses = [
      LeadStatus.FRESH_LEAD,
      LeadStatus.CALLBACK,
      LeadStatus.INTERESTED,
      LeadStatus.NOT_INTERESTED,
      LeadStatus.NOT_ELIGIBLE,
      LeadStatus.DUPLICATE,
      LeadStatus.DNC,
      LeadStatus.DOCUMENT_RECEIVED,
      LeadStatus.INCOMPLETE_DOCUMENTS,
      LeadStatus.INTERESTED,
      LeadStatus.BLACK_LISTED,
      LeadStatus.INCOMPLETE_USER,
    ]

    let leadStatus = []

    if (status) {
      leadStatus = [status]
    } else {
      leadStatus = statuses
    }
    const db = getKnexInstance()

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    let startDate, endDate

    if (!start_date && !end_date) {
      startDate = moment().startOf('month').format('YYYY-MM-DD')
      endDate = moment().format('YYYY-MM-DD')
    } else {
      startDate = start_date
      endDate = end_date
    }

    let query = db('customer')
      .select(
        'leads.leadID',
        'customer.customerID',
        'leads.utmSource',
        'leads.step',
        'leads.alloUID',
        'alloUser.name as allocatedTo',
        db.raw(
          `CASE
              WHEN leads.MLresponse IS NOT NULL
              THEN ROUND((1 - leads.MLresponse) * 100, 2)
              ELSE NULL
          END AS observation`,
        ),
        'leads.MLamount as preApprovedAmt',
        'leads.MLsalary as 	mLAvgSalary',
        'customer.name',
        'customer.email',
        'customer.mobile',
        'leads.loanRequeried',
        'leads.monthlyIncome',
        'customer.employeeType',
        'leads.city',
        'leads.state',
        'leads.pincode',
        'leads.status',
        'callUser.name as approvedBy',
        'sanctionUser.name as sanctionTeamAgent',
        'callhistoryLogs.createdDate as approvedDate',
        'approval.rejectionReason as reason',
        'approval.remark as remark',
        'approval.disbursalRemark as disbursalRemark',
        'leads.fbLeads as leadType',
        'leads.createdDate as leadcreatedDate',
        'collectionFollowupUser.name as sanctionExecutive',
        'creditAssignUser.name as creditAssign',
        db.raw(
          `CASE
            WHEN deviceDetail.android_version IS NOT NULL
            THEN 'Android'
            ELSE 'IOS'
           END AS deviceType`,
        ),
        db.raw(
          `CASE
            WHEN leads.step LIKE ? THEN 'Repeat'
            WHEN leads.step LIKE ? THEN 'Short'
            WHEN leads.step LIKE ? THEN 'Long'
            WHEN leads.step LIKE ? THEN 'Common'
            WHEN leads.step LIKE ? THEN 'Existing'
            WHEN leads.step LIKE ? THEN '1_page'
            WHEN leads.utmSource LIKE ? THEN 'Old App'
            WHEN leads.utmSource LIKE ? AND leads.step IS NULL THEN 'Not Captured'
            ELSE 'Web'
          END AS flow`,
          [
            '%Repeat%',
            '%Short%',
            '%Long%',
            '%Common%',
            '%Existing%',
            '%1_page%',
            '%apps%',
            '%APP_V%',
          ],
        ),
        db.raw(
          `CASE
            WHEN leads.step LIKE '%Short%' THEN
              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Short', '')) > 0
                   THEN SUBSTRING_INDEX(leads.step, 'Short', -1)
                   ELSE ''
              END
            WHEN leads.step LIKE '%Long%' THEN
              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Long', '')) > 0
                   THEN SUBSTRING_INDEX(leads.step, 'Long', -1)
                   ELSE ''
              END
            WHEN leads.step LIKE '%Common%' THEN
              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Common', '')) > 0
                   THEN SUBSTRING_INDEX(leads.step, 'Common', -1)
                   ELSE ''
              END
            WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'
            WHEN leads.step LIKE '%Existing%' THEN 'Existing'
            WHEN leads.step LIKE '%1_page%' THEN '1_page'
            WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'
            WHEN leads.utmSource LIKE '%apps%' THEN 'Stage Completed'
            ELSE 'Stage Completed'
          END AS stage`,
        ),
        db.raw(
          `CASE
            WHEN leads.step LIKE '%Repeat%' OR leads.step LIKE '%Short%' OR leads.step LIKE '%Long%'
              OR leads.step LIKE '%Common%' OR leads.step LIKE '%Existing%' OR leads.step LIKE '%1_page%'
              THEN COALESCE(
                (SELECT screen_name FROM flow_screen_map
                 WHERE flow_screen_map.flow =
                  CASE
                    WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'
                    WHEN leads.step LIKE '%Short%' THEN 'Short'
                    WHEN leads.step LIKE '%Long%' THEN 'Long'
                    WHEN leads.step LIKE '%Common%' THEN 'Common'
                    WHEN leads.step LIKE '%Existing%' THEN 'Existing'
                    WHEN leads.step LIKE '%1_page%' THEN '1_page'
                  END
                 AND flow_screen_map.stage = TRIM(SUBSTRING_INDEX(leads.step, '/', 1))
                 LIMIT 1),
                'Not Mapped'
              )
            WHEN leads.utmSource LIKE '%apps%' THEN 'Page Completed'
            WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'
            ELSE ''
          END AS page`,
        ),
        db.raw(
          `(CASE WHEN leads.status = 'Document Received'
            THEN (SELECT users.name FROM users WHERE users.userID = callhistoryLogs.calledBy LIMIT 1)
            ELSE (SELECT users.name FROM users WHERE users.userID = leads.creditAssign LIMIT 1) END)
          AS callAssignDetail`,
        ),
        db.raw(`
          CASE
            WHEN leads.status = 'Not Eligible' THEN
              JSON_OBJECT(
                'monthlyIncome',
                  CASE
                    WHEN leads.monthlyIncome IS NOT NULL AND leads.monthlyIncome < 20000 THEN 'Salary < 20000'
                    WHEN leads.monthlyIncome IS NULL THEN 'Not Captured'
                    ELSE ''
                  END,
                'salaryMode',
                  CASE
                    WHEN leads.salaryMode IS NOT NULL AND leads.salaryMode != 'Bank Transfer' THEN leads.salaryMode
                    WHEN leads.salaryMode IS NULL THEN 'Not Captured'
                    ELSE ''
                  END,
                'employeeType',
                  CASE
                    WHEN customer.employeeType IS NOT NULL AND customer.employeeType != 'Salaried' THEN customer.employeeType
                    WHEN customer.employeeType IS NULL THEN 'Not Captured'
                    ELSE ''
                  END,
                'state',
                  CASE
                    WHEN leads.state IS NOT NULL AND leads.state IN ('Andaman & Nicobar Islands','Arunachal Pradesh','Assam','Jammu & Kashmir','Lakshadweep','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura','Ladakh') THEN leads.state
                    WHEN leads.state IS NULL THEN 'Not Captured'
                    ELSE ''
                  END,
                'ivrRemark',
                  CASE
                    WHEN callhistoryLogs.remark IS NOT NULL THEN callhistoryLogs.remark
                    WHEN callhistoryLogs.remark IS NULL THEN 'Not Captured'
                    ELSE ''
                  END
              )
            ELSE NULL
          END AS notEligibleDetails
        `),

        // 'approval.remark as notEligibilityReason',
      )
      .join('leads', 'customer.customerID', '=', 'leads.customerID')
      .leftJoin('callhistoryLogs', function () {
        this.on('leads.leadID', '=', 'callhistoryLogs.leadID')
          .andOn(db.raw('callhistoryLogs.status IN (?)', [leadStatus]))
          .andOn(
            'callhistoryLogs.createdDate',
            '=',
            db.raw(
              `(SELECT MAX(createdDate) FROM callhistoryLogs WHERE leadID = leads.leadID AND status IN (?))`,
              [leadStatus],
            ),
          )
      })
      .leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID')
      .leftJoin('users as callUser', 'callhistoryLogs.calledBy', '=', 'callUser.userID')
      .leftJoin('users as sanctionUser', 'leads.sanctionalloUID', '=', 'sanctionUser.userID')
      .leftJoin('approval', function () {
        this.on('approval.customerID', '=', 'customer.customerID').andOn(
          'approval.leadID',
          '=',
          'leads.leadID',
        )
      })
      .leftJoin('collectionFollowup as followup', function () {
        this.on('followup.leadID', '=', 'leads.leadID')
          .andOn('followup.followup_type', '=', db.raw('?', [1]))
          .andOn(
            'followup.reviewID',
            '=',
            db.raw(
              `(SELECT MAX(reviewID) FROM collectionFollowup WHERE leadID = leads.leadID AND followup_type = 1)`,
            ),
          )
      })
      .leftJoin(
        'users as collectionFollowupUser',
        'followup.createdBy',
        '=',
        'collectionFollowupUser.userID',
      )
      .leftJoin('users as creditAssignUser', 'followup.createdBy', '=', 'creditAssignUser.userID')
      .leftJoin(
        db('login_device_detail as deviceDetail')
          .select('deviceDetail.*')
          .whereIn('id', function () {
            this.select(db.raw('MAX(id)'))
              .from('login_device_detail')
              .whereNotNull('modelName')
              .whereNotNull('android_version')
              .groupBy('mobile')
          })
          .as('deviceDetail'),
        'deviceDetail.mobile',
        'customer.mobile',
      )
    // .whereIn('leads.status', leadStatus)

    if (startDate && endDate) {
      query.whereBetween('leads.createdDate', [startDate, endDate])
    }

    if (employment_type) {
      query.where('customer.employeeType', employment_type)
    }
    if (lead_id) {
      query.where('leads.leadID', lead_id)
    }
    if (salary_mode) {
      query.where('leads.salaryMode', salary_mode)
    }
    if (city) {
      query.where('leads.city', city)
    }
    if (utm_source) {
      query.where('leads.utmSource', utm_source)
    }
    if (state) {
      query.where('leads.state', state)
    }
    if (lead_case) {
      query.where('leads.fbLeads', lead_case)
    }
    if (status) {
      query.where('leads.status', status)
    }
    if (flow) {
      switch (flow) {
        case 'Long':
        case 'Short':
        case 'Common':
        case 'Repeat':
        case 'Existing':
        case '1_page':
          query.where(function (builder) {
            builder
              .where('leads.step', 'like', `%${flow}%`)
              .where('leads.utmSource', 'like', 'APP_V%')
          })
          break

        case 'Old App':
          query.where('leads.utmSource', 'like', `%${flow}%`)
          break

        case 'Web':
          query.where(function (builder) {
            builder
              .whereNot('leads.utmSource', 'like', 'apps%')
              .whereNot('leads.utmSource', 'like', 'APP_V%')
          })
          break
      }
    }

    if (monthly_income) {
      if (monthly_income == 1) {
        query.where('leads.monthlyIncome', '<', 20000)
      } else if (monthly_income == 2) {
        query.where('leads.monthlyIncome', '>=', 20000)
      }
    }

    if (allocated) {
      if (allocated == 0) {
        query.where('leads.sanctionalloUID', 0)
      } else {
        query.where(function (builder) {
          builder
            .where('leads.callAssign', allocated)
            .orWhere('leads.creditAssign', allocated)
            .orWhere('leads.alloUID', allocated)
            .orWhere('leads.sanctionalloUID', allocated)
        })
      }
    }

    if (allocatedFilter) {
      if (allocatedFilter == 2) {
        query.where(function () {
          this.where('leads.alloUID', '').orWhere('leads.alloUID', 0)
        })
      } else if (allocatedFilter == 3) {
        query
          .where('leads.alloUID', '!=', '')
          .where('leads.alloUID', '!=', 0)
          .where('leads.alloUID', '!=', userID)
      } else {
        query.where('leads.alloUID', userID)
      }
    }

    if (customer_search) {
      query.where(function (builder) {
        builder.where(`customer.${search_by}`, 'like', `%${customer_search}%`)
      })
    }

    if (device) {
      if (device === 'android') {
        query.whereExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
            .whereNotNull('login_device_detail.modelName')
            .whereNotNull('login_device_detail.android_version')
        })
      } else {
        query.whereNotExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
        })
      }
    }
    query.orderBy('leads.leadID', 'desc')

    if (isExcelDownload) {
      let data = await query
      if (data.length == 0) {
        data = [
          {
            leadID: '-',
            customerID: '-',
            utmSource: '-',
            step: '-',
            alloUID: '-',
            allocatedTo: '-',
            observation: '-',
            preApprovedAmt: '-',
            mLAvgSalary: '-',
            name: '-',
            email: '-',
            mobile: '-',
            loanRequeried: '-',
            monthlyIncome: '-',
            employeeType: '-',
            city: '-',
            state: '-',
            pincode: '-',
            status: '-',
            approvedBy: '-',
            sanctionTeamAgent: '-',
            approvedDate: '-',
            reason: '-',
            remark: '-',
            disbursalRemark: '-',
            leadType: '-',
            leadcreatedDate: '-',
            sanctionExecutive: '-',
            creditAssign: '-',
            deviceType: '-',
            flow: '-',
            stage: '-',
            page: '-',
            callAssignDetail: '-',
            notEligibilityReason: '-',
          },
        ]
      }

      //get workbook from exceljs
      const workbook = await this.excelDownloadService.exportDataToExcelBuffer(data)
      return this.serviceResponse(200, { workbook }, 'Excel generated successfully')
    }

    const totalCountQuery = query.clone().count('* as totalCount').first()

    const paginatedQuery = query.clone().limit(perPage).offset(page)

    const [totalCountResult, paginatedData] = await Promise.all([totalCountQuery, paginatedQuery])

    const res = {
      result: paginatedData,
      totalCount: Number(totalCountResult?.totalCount || 0),
      totalPages: calculateTotalPages(Number(totalCountResult?.totalCount || 0), perPage),
    }

    return this.serviceResponse(200, res, 'Unprocessed data retreived successfully.')
  }

  async noteligibilityReason(leadData: any): Promise<string> {
    const nc = 'Not Captured'
    const notOperational: string[] = [
      'Andaman & Nicobar Islands',
      'Arunachal Pradesh',
      'Assam',
      'Jammu & Kashmir',
      'Lakshadweep',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Sikkim',
      'Tripura',
      'Ladakh',
    ]
    let res = ''
    const calHist = await this.callHistoryModel.findOne({
      where: {
        leadID: leadData.leadID,
        customerID: leadData.customerID,
        status: 'Not Eligible',
      },
      select: ['remark'],
      order: [{ column: 'callHistoryID', order: 'desc' }],
    })

    if (leadData.monthlyIncome && leadData.monthlyIncome < 20000) {
      res += 'Salary < 20000\n'
    } else if (!leadData.monthlyIncome) {
      res += '\nSalary :' + nc
    }

    if (leadData.salaryMode && leadData.salaryMode !== 'Bank Transfer') {
      res += '\nSalary Mode :' + leadData.salaryMode
    } else if (!leadData.salaryMode) {
      res += '\nSalary Mode :' + nc
    }

    if (leadData.employeeType && leadData.employeeType !== 'Salaried') {
      res += '\nEmployee Type :' + leadData.employeeType
    } else if (!leadData.employeeType) {
      res += '\nEmployee Type :' + nc
    }

    if (leadData.state && notOperational.includes(leadData.state)) {
      res += '\nState :' + leadData.state
    } else if (!leadData.state) {
      res += '\nState :' + nc
    }

    if (calHist && calHist.remark) {
      res += '\nIVR Remark :' + calHist.remark
    } else if (calHist && !calHist.remark) {
      res += '\nIVR Remark :' + nc
    }
    return res
  }

  async getRepaymentDateData(
    search_by: string,
    customer_search: string,
    page: number,
    perPage: number,
  ): Promise<IServiceResponse> {
    const whereCondition: any = {}

    if (search_by && customer_search) {
      switch (search_by) {
        case 'mobile':
          whereCondition['c.mobile'] = parseInt(customer_search)
          break
        case 'name':
          whereCondition['c.name'] = customer_search
          break
        case 'email':
          whereCondition['c.email'] = customer_search
          break
        case 'aadharNo':
          whereCondition['c.aadharNo'] = parseInt(customer_search)
          break
        case 'pancard':
          whereCondition['c.pancard'] = customer_search
          break
      }
    }
    const { repaymentData, totalCount } = await customerModel.findRepaymentDate({
      where: whereCondition,
      paginate: { perPage, page },
    })
    if (repaymentData.length === 0) {
      throw new NotFoundError('Data not found')
    }
    const data = {
      totalRows: totalCount,
      totalPages: calculateTotalPages(totalCount, perPage),
      table: repaymentData,
    }
    return this.serviceResponse(200, data, 'Fetch Repayment Date Data Successfully...')
  }

  async updateRepaymentDateData(payload: IRepaymentDatePayload): Promise<IServiceResponse> {
    const { approvalID, date, customerID, leadID } = payload
    const isWeekendDate = isWeekend(date)

    if (isWeekendDate) {
      throw new BadRequestError('Date can not be a weekend')
    }

    const isHolidayDate = await isHoliday(date)

    if (isHolidayDate) {
      throw new BadRequestError('Date can not be a holiday')
    }
    const findCustomerID = await this.customerModel.getCustomerById(customerID)
    if (findCustomerID.length === 0) {
      throw new NotFoundError('Customer ID is not found')
    }

    const findLeadID = await this.leadModel.findOneLead({ leadID })
    if (!findLeadID) {
      throw new NotFoundError('Lead ID is not found')
    }

    const findApprovalID = await approvalModel.findOneApproval({
      approvalID: approvalID,
    })
    if (!findApprovalID) {
      throw new NotFoundError('Approval ID is not found')
    }

    const appAmount = findApprovalID.loanAmtApproved

    const getDisbursalDate = await loanModel.findOneLoan({ customerID: customerID }, [
      'disbursalDate',
    ])

    if (!getDisbursalDate) {
      throw new NotFoundError('Disbursal Date not found')
    }

    const disbursalDate = new Date(getDisbursalDate.disbursalDate)
    const daysGap = differenceInDays(date, disbursalDate)

    if (daysGap < 6) {
      throw new BadRequestError('Repayment date must be at least 6 days after the disbursal date')
    }

    const findStatus = await this.leadModel.findOneLead({ leadID, customerID })
    if (!findStatus) {
      throw new NotFoundError('Status is not found')
    }
    const status = findStatus.status
    await approvalModel.findOneAndUpdateApproval(
      {
        approvalID: approvalID,
      },
      { repayDate: date },
    )

    await callHistoryLogsModel.insert({
      customerID,
      leadID,
      callType: CallType.IVR,
      status: status,
      appAmount: appAmount.toString(),
      remark: 'Repayment Date is updated',
      noteli: '',
      callbackTime: moment().startOf('day').format('YYYY-MM-DD') as unknown as Date,
      calledBy: customerID,
    })

    return this.serviceResponse(200, {}, 'Update Repayment Date Data Successfully...')
  }
  async getNameMismatchData(
    search_by: string,
    customer_search: string,
    type: string,
    page: number,
    perPage: number,
  ): Promise<IServiceResponse> {
    let nameMatchData: INameMismatch[]
    const whereCondition: any = {}
    let totalCount: number
    if (search_by && customer_search) {
      switch (search_by) {
        case 'aadharNo':
          whereCondition['c.aadharNo'] = parseInt(customer_search)
          break
        case 'pancard':
          whereCondition['c.pancard'] = customer_search
          break
        case 'name':
          whereCondition['c.name'] = customer_search
          break
        case 'email':
          whereCondition['c.email'] = customer_search
          break
        case 'mobile':
          whereCondition['c.mobile '] = parseInt(customer_search)
          break
      }
    }
    switch (type) {
      case NameMismatchType.FINBOX:
        ;({ data: nameMatchData, totalCount } = await customerModel.getCustomerFinbox({
          where: whereCondition,
          paginate: { perPage, page },
        }))
        break
      case NameMismatchType.PENNY:
        ;({ data: nameMatchData, totalCount } = await customerModel.getCustomerPenny({
          where: whereCondition,
          paginate: { perPage, page },
        }))
        break
    }
    const db = getKnexInstance()

    const nameType = type === 'penny' ? 'penny' : 'finbox'

    for (const data of nameMatchData) {
      const pancard = await db('customer_name_match')
        .where('customer_id', data.customerID)
        .where('type', `${nameType} - pancard`)
        .orderBy('id', 'desc')
        .first()

      const aadhar = await db('customer_name_match')
        .where('customer_id', data.customerID)
        .whereIn('type', [`${nameType} - aadhar`, `${nameType} - digilocker`, `${nameType} - ckyc`])
        .orderBy('id', 'desc')
        .first()

      if (pancard && pancard.second_name) {
        data.pancard_name = pancard.second_name
      }
      if (pancard && pancard.percentage) {
        data.percentage_pancard = `${pancard.percentage}%`
      }
      if (aadhar && (aadhar.first_name || aadhar.second_name)) {
        data.aadhar_name = {
          [nameType]: aadhar.first_name,
          aadhar: aadhar.second_name,
        }
      }
      if (aadhar && aadhar.percentage) {
        data.percentage_aadhar = `${aadhar.percentage}%`
      }
      if (aadhar && aadhar.first_name) {
        data.finbox_name = aadhar.first_name
      }
      if (pancard && pancard.first_name) {
        data.finbox_name = pancard.first_name
      }
    }
    const data = {
      totalRows: totalCount,
      totalPages: calculateTotalPages(totalCount, perPage),
      table: nameMatchData,
    }
    return this.serviceResponse(200, data, 'Fetch Name Mismatch  Data Successfully...')
  }

  async nameMismatchAcceptReject(
    customerID: number,
    id: number,
    type: string,
    status: number,
    userID: number,
  ): Promise<IServiceResponse> {
    const findCustomerID = await this.customerModel.getCustomerById(customerID)
    if (findCustomerID.length === 0) {
      throw new NotFoundError('Customer ID is not found')
    }

    switch (type) {
      case NameMismatchType.FINBOX:
        const findFinboxID = await this.finboxNameMatchModel.getFinboxById(id)
        if (findFinboxID.length == 0) {
          throw new NotFoundError('Finbox ID is not found')
        }
        await this.finboxNameMatchModel.findOneAndUpdate(
          { customerID: customerID, id: id },
          { status: status.toString(), action_by: userID },
        )
        break

      case NameMismatchType.PENNY:
        const findPennyID = await this.pennyDropModel.getPennyById(id)

        if (findPennyID.length == 0) {
          throw new NotFoundError('Penny ID is not found')
        }
        await this.pennyDropModel.proceedNameMismatchAcceptRejectPenny(
          customerID,
          id,
          status,
          userID,
        )
        break
    }

    return this.serviceResponse(200, {}, 'Operation Done Successfully...')
  }
  async getPaymentMode(searchInput: string, type: string): Promise<IServiceResponse> {
    let fetchData: any
    if (type === 'bank') {
      throw new BadRequestError('Enter correct type')
    }
    switch (type) {
      case 'global':
        fetchData = await this.paymentModeModel.find({
          where: { status: '1' },
        })
        break
      case 'bankSearch':
        fetchData = await this.bankIfscModel.find({
          select: ['BANK'],
          where: [{ column: 'BANK', operator: 'like', value: `${searchInput}%` }],
          order: [{ column: 'BANK', order: 'asc' }],
          distinct: true,
          paginate: { perPage: 10, page: 0 },
        })
        break
    }

    return this.serviceResponse(200, fetchData, 'Fetch Data Successfully...')
  }

  async updatePaymentMode(
    mode: string,
    payment_mode: string,
    searchInput: string,
    type: string,
    userID: number,
    page: number,
    perPage: number,
  ): Promise<IServiceResponse> {
    if (type === 'bankSearch') {
      throw new BadRequestError('Enter correct type')
    }
    switch (type) {
      case 'bank':
        const checkRecord = await this.paymentModeForBanksModel.find({
          where: { bank_name: searchInput },
        })
        const currentDate = new Date()
        if (checkRecord && checkRecord.length !== 0) {
          await this.paymentModeForBanksModel.findOneAndUpdate(
            {
              payment_mode: payment_mode,
              updated_by: userID,
              updated_date: currentDate,
              status: '1',
            },
            { bank_name: searchInput },
          )
        } else {
          await this.paymentModeForBanksModel.insert({
            bank_name: searchInput,
            payment_mode: payment_mode,
            created_by: userID,
            created_date: currentDate,
            status: '1',
          })
        }
        break

      case 'global':
        await this.paymentModeModel.findOneAndUpdate({ status: 0 })
        await this.paymentModeModel.findOneAndUpdate({ status: 1 }, { mode: mode })
        break
    }
    const db = getKnexInstance()
    const data = await db('payment_mode_for_banks as pb')
      .where('pb.status', '1')
      .orderBy([{ column: 'id', order: 'desc' }])
      .select([
        'pb.id',
        'pb.bank_name',
        'pb.payment_mode',
        'pb.updated_by',
        'pb.updated_date',
        'users.name as updated_by',
      ])
      .leftJoin('users', 'pb.updated_by', '=', 'users.userID')
      .offset(page)
      .limit(perPage)

    return this.serviceResponse(200, data, 'Operation Done Successfully...')
  }
  async deletePaymentMode(id: number) {
    const findID = await this.paymentModeForBanksModel.find({
      where: { id: id },
    })
    if (findID.length === 0) return new NotFoundError('Id does not present in db')

    await this.paymentModeForBanksModel.delete([{ column: 'id', operator: '=', value: id }])

    return this.serviceResponse(200, {}, 'Operation done Successfully...')
  }

  async getAssignedLeadId(userId: number, role: string): Promise<IServiceResponse> {
    const startDate = moment().subtract(159, 'days').format('YYYY-MM-DD HH:mm:ss')
    let leadId: string | null = null

    //update hold or in progress lead id if found
    leadId = await this.getUserLeadIdToAllocate(startDate, userId)
    if (!leadId) return this.serviceResponse(HttpStatusCode.NotFound, {}, 'Fresh Lead not found')

    //update user's lead status
    await this.userModel.updateUserById(userId, { lead_status: 'start' })
    return this.serviceResponse(HttpStatusCode.Ok, { leadId }, 'Successfully Added')
  }

  private async getUserLeadIdToAllocate(startDate: string, userId: number) {
    let leadId: string
    const db: Knex = getKnexInstance()
    const holdLead = await this.getUserHoldLeadByStartdate(startDate, userId)
    if (holdLead) {
      const holdTime = moment(holdLead.hold_time, 'HH:mm:ss') // Convert hold time
      const currentTime = moment()
      let holdId = 0
      if (currentTime.isAfter(holdTime)) holdId = 1
      if (['Hold Process', 'Hold'].includes(holdLead.status) && holdId) leadId = holdLead.leadID
    }

    //if there is no hold lead
    else {
      //get "Document Received" and priority based leads
      const [newLead, priorityLead] = await Promise.all([
        db('leads')
          .select('leads.leadID', 'leads.status', 'leads.customerID', 'leads.hold_time')
          .join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID')
          .where(function () {
            this.whereIn('leads.status', ['Document Received'])
              .whereIn('leads.fbLeads', ['Existing Case', 'New Case'])
              .where('callhistoryLogs.createdDate', '>', startDate)
              .where('leads.sanctionalloUID', userId)
              .where('leads.alloUID', userId)
          })
          .first(),
        this.getPriorityUserLead(startDate),
      ])
      const freshLead = newLead || priorityLead
      if (freshLead) {
        // Assign the lead to the current user
        await this.updateOne(
          { leadID: freshLead.leadID },
          { sanctionalloUID: userId, alloUID: `${userId}` },

          /*
           customerID,
        leadID,
        callType: CallType.IVR,
        calledBy: userId,
        status: 'Approved Process',
        remark: 'Modified Approved Process',
        noteli: '',
        callbackTime: moment().startOf('day').format('YYYY-MM-DD') as unknown as Date,
        appAmount: loanAmount.toString(),
        */
        )

        // Insert call history log
        await this.callHistoryLogsModel.insert({
          customerID: freshLead.customerID,
          leadID: freshLead.leadID,
          callType: 'IVR',
          status: 'Lead Allocated',
          appAmount: ' ',
          noteli: ' ',
          remark: `Lead Allocated to ${userId}`,
          callbackTime: new Date(),
          calledBy: userId,
          createdDate: new Date(),
        })
        leadId = freshLead.leadID
      }
    }
    return leadId
  }

  async getPriorityUserLead(startDate: string) {
    const db: Knex = getKnexInstance()
    return db('leads')
      .select('leads.leadID', 'leads.status', 'leads.customerID', 'leads.hold_time')
      .join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID')
      .join('customer', 'customer.customerID', 'leads.customerID')
      .join('credit_reports', function () {
        this.on('credit_reports.customerID', '=', 'leads.customerID').andOn(
          db.raw(
            'credit_reports.id = (SELECT MAX(id) FROM credit_reports WHERE customerID = leads.customerID)',
          ),
        )
      })
      .where(function () {
        this.whereNotNull('customer.employeeType')
          .where('leads.status', 'Document Received')
          .whereIn('leads.fbLeads', ['Existing Case', 'New Case'])
          .where('callhistoryLogs.createdDate', '>', startDate)
          .where('leads.sanctionalloUID', 0)
          .where('leads.alloUID', 0)
      })
      .orderBy('customer.employeeType')
      .orderBy('leads.monthlyIncome', 'desc')
      .orderBy('credit_reports.score', 'desc')
      .orderBy('leads.salaryMode')
      .forUpdate() // Lock for update
      .first()
  }

  async getUserHoldLeadByStartdate(startDate: string, userId: Number) {
    const db: Knex = getKnexInstance()
    return db('leads')
      .select('leads.leadID', 'leads.status', 'leads.customerID', 'leads.hold_time')
      .join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID')
      .where(function () {
        this.whereIn('leads.status', ['Hold Process', 'Hold'])
          .whereIn('leads.fbLeads', ['Existing Case', 'New Case'])
          .where('callhistoryLogs.createdDate', '>', startDate)
          .where('leads.hold_date', moment().format('YYYY-MM-DD'))
          .where('leads.sanctionalloUID', userId)
          .where('leads.alloUID', userId)
      })
      .first()
  }

  async againNoLoanList(
    payload: IAgainNoLoanListPayload,
    page?: number,
    perPage?: number,
    isExcelDownload?: boolean,
  ): Promise<IServiceResponse> {
    const {
      search_by,
      customer_search,
      lead_id,
      city,
      state,
      status,
      lead_case,
      start_date,
      end_date,
      allocated,
      utm_source,
      device,
    } = payload

    const db = getKnexInstance()

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    let query = db('customer')
      .join('leads', 'customer.customerID', '=', 'leads.customerID')
      .leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID')
      .leftJoin('approval', function () {
        this.on('approval.customerID', '=', 'customer.customerID').andOn(
          'approval.leadID',
          '=',
          'leads.leadID',
        )
      })
      .leftJoin('no_loan_follow_up_logs', function () {
        this.on('no_loan_follow_up_logs.lead_id', '=', 'leads.leadID').andOn(
          'no_loan_follow_up_logs.created_at',
          '=',
          db.raw(
            `(SELECT MAX(created_at) FROM no_loan_follow_up_logs WHERE lead_id = leads.leadID )`,
          ),
        )
      })
      .leftJoin(
        'users as followUpUser',
        'followUpUser.userID',
        '=',
        'no_loan_follow_up_logs.follow_up_by',
      )

      .leftJoin('collection', function () {
        this.on('collection.customerID', '=', 'customer.customerID')
          .andOn('collection.status', '=', db.raw('?', ['Closed']))
          .andOn(
            'collection.collectedDate',
            '=',
            db.raw(
              `(SELECT MAX(collectedDate) FROM collection WHERE customerID = customer.customerID )`,
            ),
          )
      })
      .leftJoin(
        db('login_device_detail as deviceDetail')
          .select('deviceDetail.*')
          .whereIn('id', function () {
            this.select(db.raw('MAX(id)'))
              .from('login_device_detail')
              .whereNotNull('modelName')
              .whereNotNull('android_version')
              .groupBy('mobile')
          })
          .as('deviceDetail'),
        'deviceDetail.mobile',
        'customer.mobile',
      )
    if (status) {
      query.where('leads.status', status)
    } else {
      query.where('leads.status', 'closed')
    }
    query.select(
      'leads.leadID',
      'customer.customerID',
      'leads.utmSource',
      'customer.name',
      'customer.email',
      'customer.mobile',
      'leads.city',
      'leads.state',
      'leads.pincode',
      'leads.status',
      'collection.collectedDate as lastLoanClosedDate',
      'followUpUser.name as followUpUserName',
      'no_loan_follow_up_logs.created_at',
      'no_loan_follow_up_logs.follow_type',
      'no_loan_follow_up_logs.status_type',
      'no_loan_follow_up_logs.remark',
      db.raw(
        `CASE
            WHEN deviceDetail.android_version IS NOT NULL
            THEN 'Android'
            ELSE 'IOS'
           END AS deviceType`,
      ),
    )

    if (start_date && end_date) {
      let startDate = start_date
      let endDate = end_date

      query.whereBetween('leads.createdDate', [startDate, endDate])
    }

    if (!status || status === 'Closed') {
      query.whereNotExists(function () {
        this.select(db.raw('1'))
          .from('leads as l2')
          .whereRaw('l2.customerID = leads.customerID')
          .whereRaw('l2.leadID > leads.leadID')
      })
    } else {
      query
        .whereExists(function () {
          this.select(db.raw('1'))
            .from('leads as l2')
            .whereRaw('l2.customerID = customer.customerID')
            .where('l2.status', 'closed')
        })
        .where('leads.leadID', '=', function () {
          this.select(db.raw('MAX(l1.leadID)'))
            .from('leads as l1')
            .whereRaw('l1.customerID = customer.customerID')
            .where('l1.status', '<>', 'closed')
        })
    }

    if (lead_id) {
      query.where('leads.leadID', lead_id)
    }
    if (city) {
      query.where('leads.city', city)
    }
    if (utm_source) {
      query.where('leads.utmSource', utm_source)
    }
    if (state) {
      query.where('leads.state', state)
    }
    if (lead_case) {
      query.where('leads.fbLeads', lead_case)
    }

    if (allocated) {
      if (allocated == 0) {
        query.where('leads.sanctionalloUID', 0)
      } else {
        query.where(function (builder) {
          builder
            .where('leads.callAssign', allocated)
            .orWhere('leads.creditAssign', allocated)
            .orWhere('leads.alloUID', allocated)
            .orWhere('leads.sanctionalloUID', allocated)
        })
      }
    }
    if (customer_search) {
      query.where(function (builder) {
        builder.where(`customer.${search_by}`, 'like', `%${customer_search}%`)
      })
    }
    if (device) {
      if (device === 'android') {
        query.whereExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
            .whereNotNull('login_device_detail.modelName')
            .whereNotNull('login_device_detail.android_version')
        })
      } else {
        query.whereNotExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
        })
      }
    }

    query.orderBy('leads.leadID', 'desc')

    if (isExcelDownload) {
      let data = await query

      if (data.length == 0) {
        data = [
          {
            leadID: '-',
            customerID: '-',
            utmSource: '-',
            name: '-',
            email: '-',
            mobile: '-',
            city: '-',
            state: '-',
            pincode: '-',
            status: '-',
            lastLoanClosedDate: '-',
            followUpUserName: '-',
            created_at: '-',
            follow_type: '-',
            status_type: '-',
            remark: '-',
            deviceType: '-',
          },
        ]
      }

      //get workbook from exceljs
      const workbook = await this.excelDownloadService.exportDataToExcelBuffer(data)
      return this.serviceResponse(200, { workbook }, 'Excel generated successfully')
    }

    const totalCountQuery = query.clone().count('* as totalCount').first()

    const paginatedQuery = query.clone().limit(perPage).offset(page)

    const [totalCountResult, paginatedData] = await Promise.all([totalCountQuery, paginatedQuery])

    const res = {
      result: paginatedData,
      totalCount: Number(totalCountResult?.totalCount ?? 0),
      totalPages: calculateTotalPages(Number(totalCountResult?.totalCount ?? 0), perPage),
    }

    return this.serviceResponse(200, res, 'Again NoLoan data retreived successfully.')
  }

  async noEligibleList(
    payload: INoEligibleListPayload,
    page?: number,
    perPage?: number,
    isExcelDownload?: boolean,
  ): Promise<IServiceResponse> {
    const {
      search_by,
      customer_search,
      lead_id,
      city,
      state,
      lead_case,
      start_date,
      end_date,
      allocated,
      utm_source,
      flow,
      device,
    } = payload

    let leadStatus = LeadStatus.NOT_ELIGIBLE

    const db = getKnexInstance()

    await getKnexInstance().raw(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))",
    )

    let startDate, endDate

    if (!start_date && !end_date) {
      startDate = moment().startOf('month').format('YYYY-MM-DD')
      endDate = moment().format('YYYY-MM-DD')
    } else {
      startDate = start_date
      endDate = end_date
    }

    let query = db('customer')
      .join('leads', 'customer.customerID', '=', 'leads.customerID')
      .leftJoin('callhistoryLogs', function () {
        this.on('leads.leadID', '=', 'callhistoryLogs.leadID')
          .andOn('callhistoryLogs.status', '=', db.raw('?', [leadStatus]))
          .andOn(
            'callhistoryLogs.createdDate',
            '=',
            db.raw(
              `(SELECT MAX(createdDate) FROM callhistoryLogs WHERE leadID = leads.leadID AND status = ?)`,
              [leadStatus],
            ),
          )
      })
      .leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID')
      .leftJoin('users as callUser', 'callhistoryLogs.calledBy', '=', 'callUser.userID')
      .leftJoin('users as sanctionUser', 'leads.sanctionalloUID', '=', 'sanctionUser.userID')
      .leftJoin('approval', function () {
        this.on('approval.customerID', '=', 'customer.customerID').andOn(
          'approval.leadID',
          '=',
          'leads.leadID',
        )
      })
      .leftJoin('collectionFollowup as followup', function () {
        this.on('followup.leadID', '=', 'leads.leadID')
          .andOn('followup.followup_type', '=', db.raw('?', [1]))
          .andOn(
            'followup.reviewID',
            '=',
            db.raw(
              `(SELECT MAX(reviewID) FROM collectionFollowup WHERE leadID = leads.leadID AND followup_type = 1)`,
            ),
          )
      })
      .leftJoin(
        'users as collectionFollowupUser',
        'followup.createdBy',
        '=',
        'collectionFollowupUser.userID',
      )
      .leftJoin('users as creditAssignUser', 'followup.createdBy', '=', 'creditAssignUser.userID')
      .leftJoin(
        db('login_device_detail as deviceDetail')
          .select('deviceDetail.*')
          .whereIn('id', function () {
            this.select(db.raw('MAX(id)'))
              .from('login_device_detail')
              .whereNotNull('modelName')
              .whereNotNull('android_version')
              .groupBy('mobile')
          })
          .as('deviceDetail'),
        'deviceDetail.mobile',
        'customer.mobile',
      )
    query.where('leads.status', leadStatus)
    query.select(
      'leads.leadID',
      'customer.customerID',
      'leads.utmSource',
      'leads.step',
      'leads.alloUID',
      'alloUser.name as allocatedTo',
      db.raw(
        `CASE
              WHEN leads.MLresponse IS NOT NULL
              THEN ROUND((1 - leads.MLresponse) * 100, 2)
              ELSE NULL
          END AS observation`,
      ),
      'leads.MLamount as preApprovedAmt',
      'leads.MLsalary as 	mLAvgSalary',
      'customer.name',
      'customer.email',
      'customer.mobile',
      'leads.loanRequeried',
      'leads.monthlyIncome',
      'customer.employeeType',
      'leads.city',
      'leads.state',
      'leads.pincode',
      'leads.status',
      'callUser.name as approvedBy',
      'sanctionUser.name as sanctionTeamAgent',
      'callhistoryLogs.createdDate as approvedDate',
      'approval.rejectionReason as reason',
      'approval.remark as remark',
      'approval.disbursalRemark as disbursalRemark',
      'leads.fbLeads as leadType',
      'leads.createdDate as leadcreatedDate',
      'collectionFollowupUser.name as sanctionExecutive',
      'creditAssignUser.name as creditAssign',
      db.raw(
        `CASE
            WHEN deviceDetail.android_version IS NOT NULL
            THEN 'Android'
            ELSE 'IOS'
           END AS deviceType`,
      ),
      db.raw(
        `CASE
            WHEN leads.step LIKE ? THEN 'Repeat'
            WHEN leads.step LIKE ? THEN 'Short'
            WHEN leads.step LIKE ? THEN 'Long'
            WHEN leads.step LIKE ? THEN 'Common'
            WHEN leads.step LIKE ? THEN 'Existing'
            WHEN leads.step LIKE ? THEN '1_page'
            WHEN leads.utmSource LIKE ? THEN 'Old App'
            WHEN leads.utmSource LIKE ? AND leads.step IS NULL THEN 'Not Captured'
            ELSE 'Web'
          END AS flow`,
        [
          '%Repeat%',
          '%Short%',
          '%Long%',
          '%Common%',
          '%Existing%',
          '%1_page%',
          '%apps%',
          '%APP_V%',
        ],
      ),
      db.raw(
        `CASE
            WHEN leads.step LIKE '%Short%' THEN
              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Short', '')) > 0
                   THEN SUBSTRING_INDEX(leads.step, 'Short', -1)
                   ELSE ''
              END
            WHEN leads.step LIKE '%Long%' THEN
              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Long', '')) > 0
                   THEN SUBSTRING_INDEX(leads.step, 'Long', -1)
                   ELSE ''
              END
            WHEN leads.step LIKE '%Common%' THEN
              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Common', '')) > 0
                   THEN SUBSTRING_INDEX(leads.step, 'Common', -1)
                   ELSE ''
              END
            WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'
            WHEN leads.step LIKE '%Existing%' THEN 'Existing'
            WHEN leads.step LIKE '%1_page%' THEN '1_page'
            WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'
            WHEN leads.utmSource LIKE '%apps%' THEN 'Stage Completed'
            ELSE 'Stage Completed'
          END AS stage`,
      ),
      db.raw(
        `CASE
            WHEN leads.step LIKE '%Repeat%' OR leads.step LIKE '%Short%' OR leads.step LIKE '%Long%'
              OR leads.step LIKE '%Common%' OR leads.step LIKE '%Existing%' OR leads.step LIKE '%1_page%'
              THEN COALESCE(
                (SELECT screen_name FROM flow_screen_map
                 WHERE flow_screen_map.flow =
                  CASE
                    WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'
                    WHEN leads.step LIKE '%Short%' THEN 'Short'
                    WHEN leads.step LIKE '%Long%' THEN 'Long'
                    WHEN leads.step LIKE '%Common%' THEN 'Common'
                    WHEN leads.step LIKE '%Existing%' THEN 'Existing'
                    WHEN leads.step LIKE '%1_page%' THEN '1_page'
                  END
                 AND flow_screen_map.stage = TRIM(SUBSTRING_INDEX(leads.step, '/', 1))
                 LIMIT 1),
                'Not Mapped'
              )
            WHEN leads.utmSource LIKE '%apps%' THEN 'Page Completed'
            WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'
            ELSE ''
          END AS page`,
      ),
      db.raw(
        `(CASE WHEN leads.status = 'Document Received'
            THEN (SELECT users.name FROM users WHERE users.userID = callhistoryLogs.calledBy LIMIT 1)
            ELSE (SELECT users.name FROM users WHERE users.userID = leads.creditAssign LIMIT 1) END)
          AS callAssignDetail`,
      ),
      'approval.remark as notEligibilityReason',
    )

    query.whereBetween('leads.createdDate', [startDate, endDate])

    if (lead_id) {
      query.where('leads.leadID', lead_id)
    }
    if (city) {
      query.where('leads.city', city)
    }
    if (utm_source) {
      query.where('leads.utmSource', utm_source)
    }
    if (state) {
      query.where('leads.state', state)
    }
    if (lead_case) {
      query.where('leads.fbLeads', lead_case)
    }
    if (flow) {
      switch (flow) {
        case 'Long':
        case 'Short':
        case 'Common':
        case 'Repeat':
        case 'Existing':
        case '1_page':
          query.where(function (builder) {
            builder
              .where('leads.step', 'like', `%${flow}%`)
              .where('leads.utmSource', 'like', 'APP_V%')
          })
          break

        case 'Old App':
          query.where('leads.utmSource', 'like', `%${flow}%`)
          break

        case 'Web':
          query.where(function (builder) {
            builder
              .whereNot('leads.utmSource', 'like', 'apps%')
              .whereNot('leads.utmSource', 'like', 'APP_V%')
          })
          break
      }
    }

    if (allocated) {
      if (allocated == 0) {
        query.where('leads.sanctionalloUID', 0)
      } else {
        query.where(function (builder) {
          builder
            .where('leads.callAssign', allocated)
            .orWhere('leads.creditAssign', allocated)
            .orWhere('leads.alloUID', allocated)
            .orWhere('leads.sanctionalloUID', allocated)
        })
      }
    }

    if (customer_search) {
      query.where(function (builder) {
        builder.where(`customer.${search_by}`, 'like', `%${customer_search}%`)
      })
    }
    if (device) {
      if (device === 'android') {
        query.whereExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
            .whereNotNull('login_device_detail.modelName')
            .whereNotNull('login_device_detail.android_version')
        })
      } else {
        query.whereNotExists(function () {
          this.select(db.raw(1))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = customer.mobile')
        })
      }
    }
    query.orderBy('leads.leadID', 'desc')

    if (isExcelDownload) {
      let data = await query

      if (data.length == 0) {
        data = [
          {
            leadID: '-',
            customerID: '-',
            utmSource: '-',
            step: '-',
            alloUID: '-',
            allocatedTo: '-',
            observation: '-',
            preApprovedAmt: '-',
            mLAvgSalary: '-',
            name: '-',
            email: '-',
            mobile: '-',
            loanRequeried: '-',
            monthlyIncome: '-',
            employeeType: '-',
            city: '-',
            state: '-',
            pincode: '-',
            status: '-',
            approvedBy: '-',
            sanctionTeamAgent: '-',
            approvedDate: '-',
            reason: '-',
            remark: '-',
            disbursalRemark: '-',
            leadType: '-',
            leadcreatedDate: '-',
            sanctionExecutive: '-',
            creditAssign: '-',
            deviceType: '-',
            flow: '-',
            stage: '-',
            page: '-',
            callAssignDetail: '-',
            notEligibilityReason: '-',
          },
        ]
      }

      //get workbook from exceljs
      const workbook = await this.excelDownloadService.exportDataToExcelBuffer(data)
      return this.serviceResponse(200, { workbook }, 'Excel generated successfully')
    }

    const totalCountQuery = query.clone().count('* as totalCount').first()

    const paginatedQuery = query.clone().limit(perPage).offset(page)

    const [totalCountResult, paginatedData] = await Promise.all([totalCountQuery, paginatedQuery])

    const res = {
      totalRecords: Number(totalCountResult?.totalCount ?? 0),
      totalPages: calculateTotalPages(Number(totalCountResult?.totalCount ?? 0), perPage),
      results: paginatedData,
    }

    return this.serviceResponse(200, res, 'Not Eligible data retreived successfully.')
  }

  async againNoLoanFollowUp(payload: IAgainNoLoanFollowUpLogsSchema, followUpBy: number) {
    const insertData = {
      ...payload,
      follow_up_by: followUpBy,
    }
    const res = await this.noLoanFollowUpLogModel.insert(insertData)
    return this.serviceResponse(200, { response: res }, 'Operation Done Successfully...')
  }

  async getAgainNoLoanFollowUp(
    query: IGetAgainNoLoanFollowUpLogsQuery,
    page: number,
    perPage: number,
  ) {
    const { lead_id, customer_id } = query

    let whereObj = {}
    if (lead_id) {
      whereObj['lead_id'] = lead_id
    }
    if (customer_id) {
      whereObj['customer_id'] = customer_id
    }

    const [totalCountResult, paginatedData] = await Promise.all([
      this.noLoanFollowUpLogModel.count({ where: whereObj }),
      this.noLoanFollowUpLogModel.find({
        where: whereObj,
        order: [{ column: 'created_at', order: 'desc' }],
        paginate: { perPage, page },
      }),
    ])

    const data = {
      result: paginatedData,
      totalCount: totalCountResult,
      totalPages: calculateTotalPages(totalCountResult, perPage),
    }

    return this.serviceResponse(200, data, 'Operation Done Successfully...')
  }

  loanApplyStatusData = async (leadID: number) => {
    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['leadID', 'customerID', 'kfs'],
    })

    if (!lead) throw new NotFoundError('This lead does not exist')

    const customer = await this.customerModel.findOneCustomer(
      {
        customerID: lead.customerID,
      },
      ['mobile'],
    )

    if (!customer) throw new NotFoundError('Customer not found')

    const [references, selfieVideo, emandateStatus, pennyDrop] = await Promise.all([
      this.referenceModel.count({
        where: { customerID: lead.customerID },
      }),
      this.leadApiLogModel.findOneLeadsApiLog(
        {
          mobile_no: customer.mobile.str,
          api_type: 'face-match',
          status: 1,
        },
        ['api_response'],
        [{ order: 'desc', column: 'id' }],
      ),
      this.razorpayMandateModel.find({
        where: { customerID: lead.customerID },
        whereNot: { emMaxamount: null },
        whereIn: [{ column: 'status', value: ['paid', 'Paid', 'PAID'] }],
      }),
      this.pennyDropModel.find({
        where: { customerID: lead.customerID },
        select: ['penny_status', 'penny_drop_name_match'],
      }),
    ])

    let emandate_details = 'dont show'
    let emandate_details_less = 'dont show'
    let valid_array = new Set()
    let valid_array_less = new Set()

    for (const es of emandateStatus) {
      if (es) {
        const diffInDays3 = moment().diff(
          moment(es.credated_date, 'YYYY-MM-DD').startOf('day'),
          'days',
        )

        if (diffInDays3 <= 270) {
          const approval = await this.approvalModel.findOne({
            where: { customerID: lead.customerID, leadID },
          })

          if (approval) {
            const lastEmandate = es.emMaxamount
            const newEmandateAmt = approval.loanAmtApproved * 2.5
            const accNo = es.accountNo

            if (lastEmandate >= newEmandateAmt) {
              emandate_details = 'show'
              valid_array.add(accNo)
            } else {
              emandate_details_less = 'show'
              valid_array_less.add(accNo)
            }
          }
        }
      }
    }

    const api_response = selfieVideo?.api_response ? JSON.parse(selfieVideo.api_response) : null
    const video = api_response?.result?.is_same_face
      ? true
      : (await this.appVideoModel.count({
          where: { customerID: lead.customerID, leadID },
        })) > 0

    const data = {
      references: references > 0,
      selfieVideo: video,
      pennyDrop:
        (pennyDrop?.[0]?.penny_status === 'completed' ||
          pennyDrop?.[0]?.penny_status === 'created') &&
        (pennyDrop?.[0]?.penny_drop_name_match === '0' ||
          pennyDrop?.[0]?.penny_drop_name_match === '1'),
      kfs: lead.kfs === '1',
      eMandate: emandate_details === 'show',
    }

    return this.serviceResponse(HttpStatusCode.Ok, data, 'Data Fetched')
  }

  async noDuesPdfEmail(payload: INoDuesPayload): Promise<IServiceResponse> {
    const lead = await this.leadModel.findOne({
      where: { leadID: payload.leadID },
      select: ['status', 'lenderID'],
    })

    if (!lead) throw new NotFoundError('Lead not found')

    if (lead.status !== LeadStatus.CLOSED)
      throw new BadRequestError('Cannot generate No Dues lead is not closed')

    let noDuesData = await this.noDuesByLead(payload)
    if (!noDuesData) {
      throw new NotFoundError('NoDues data not found.')
    }
    let email = (noDuesData.data as { email?: string })?.email
    if (!email) {
      throw new NotFoundError('Email not found')
    }

    const templatePath = path.resolve(__dirname, '../views/loansDocs/noDues.ejs')
    const htmlContent = await ejs.renderFile(templatePath, {
      data: noDuesData.data,
    })

    // Convert the S3 image URLs to base64
    const headerUrl =
      'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg'
    const footerUrl =
      'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg'

    const headerImage = await this.convertImageUrlToBase64(headerUrl)
    const footerImage = await this.convertImageUrlToBase64(footerUrl)

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: `<div class="header" style="width: 100%; text-align: center;">
        <img src="${headerImage}" style="width:100%; max-height:150px; margin-top: -20px">
      </div>`,
      footerTemplate: `<div class="footer" style="width: 100%; text-align: center;">
        <img src="${footerImage}" style="width:100%; max-height:150px; margin-bottom: -18px">
      </div>`,
      margin: {
        top: '150px',
        bottom: '100px',
      },
    })

    await browser.close()

    if (!pdfBuffer) {
      throw new InternalServerError('An error occurred while generating the PDF')
    }

    let newhtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .header, .footer {
            width: 100%;
            text-align: center;
          }
          .header img {
            width: 100%;
            max-height: 150px;
            margin-top: -20px;
          }
          .footer img {
            width: 100%;
            max-height: 150px;
            margin-bottom: -18px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${headerUrl}" alt="Header Image">
        </div>
        ${htmlContent}
        <div class="footer">
          <img src="${footerUrl}" alt="Footer Image">
        </div>
      </body>
      </html>
    `
    let s3FolderName = 'documents/noDues/' + payload.customerID
    let imageName = 'noDues_' + Math.floor(Date.now() / 1000) + '.pdf'
    let res = await this.s3Service.uploadDocument(Buffer.from(pdfBuffer), s3FolderName, imageName)

    if (res && res?.Key !== null && res.Key !== '') {
      await this.documentModel.insert({
        customerID: payload.customerID,
        type: 'No Dues',
        documentType: 'No Dues',
        documentFile: res.Key,
        status: 'Verified',
        uploadBy: payload.customerID,
        uploadedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        verifiedBy: payload.customerID,
        verifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        upload_platform: 'S3',
      })
    } else {
      throw new InternalServerError('An error occurred while storing the file in S3')
    }
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
    let response = await notificationUtils.sendingPDFEmail(
      email,
      'NO DUES CERTIFICATE',
      pdfBase64,
      'pdf',
      'NO_DUE_CERTIFICATE',
    )
    if (!response.success) {
      throw new InternalServerError('An error occurred while sending the email.')
    }
    await this.notificationService.create({
      customerID: payload.customerID,
      leadID: payload.leadID,
      notification: newhtmlContent,
      type: 'Email',
      subject: 'No Dues Certificate Ramfin Corp',
      createdDate: new Date(Date.now()),
      uid: '221',
    })

    return this.serviceResponse(200, {}, 'No Dues certificate sent successfully.')
  }

  async disbursalPdfEmail(payload: INoDuesPayload): Promise<IServiceResponse> {
    let disbursalData = await this.disbursalByLead(payload)
    if (!disbursalData) {
      throw new NotFoundError('Disbursal data not found.')
    }
    let email = (disbursalData.data as { email?: string })?.email
    if (!email) {
      throw new NotFoundError('Email not found')
    }

    const templatePath = path.resolve(__dirname, '../views/loansDocs/disbursal.ejs')
    const htmlContent = await ejs.renderFile(templatePath, {
      data: disbursalData.data,
    })

    // Convert the S3 image URLs to base64
    const headerUrl =
      'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg'
    const footerUrl =
      'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg'

    const headerImage = await this.convertImageUrlToBase64(headerUrl)
    const footerImage = await this.convertImageUrlToBase64(footerUrl)

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: `<div class="header" style="width: 100%; text-align: center;">
        <img src="${headerImage}" style="width:100%; max-height:150px; margin-top: -20px">
      </div>`,
      footerTemplate: `<div class="footer" style="width: 100%; text-align: center;">
        <img src="${footerImage}" style="width:100%; max-height:150px; margin-bottom: -18px">
      </div>`,
      margin: {
        top: '150px',
        bottom: '100px',
      },
    })
    await browser.close()

    if (!pdfBuffer) {
      throw new InternalServerError('An error occurred while generating the PDF')
    }

    let newhtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .header, .footer {
            width: 100%;
            text-align: center;
          }
          .header img {
            width: 100%;
            max-height: 150px;
            margin-top: -20px;
          }
          .footer img {
            width: 100%;
            max-height: 150px;
            margin-bottom: -18px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${headerUrl}" alt="Header Image">
        </div>
        ${htmlContent}
        <div class="footer">
          <img src="${footerUrl}" alt="Footer Image">
        </div>
      </body>
      </html>
    `

    let s3FolderName = 'documents/disbursalLetter/' + payload.customerID
    let imageName = 'disbursalLetter_' + Math.floor(Date.now() / 1000) + '.pdf'
    let res = await this.s3Service.uploadDocument(Buffer.from(pdfBuffer), s3FolderName, imageName)
    if (res && res?.Key !== null && res.Key !== '') {
      await this.documentModel.insert({
        customerID: payload.customerID,
        type: 'Disbursal Letter',
        documentType: 'Disbursal Letter',
        documentFile: res.Key,
        status: 'Verified',
        uploadBy: payload.customerID,
        uploadedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        verifiedBy: payload.customerID,
        verifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        upload_platform: 'S3',
      })
    } else {
      throw new InternalServerError('An error occurred while storing the file in S3')
    }
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
    let response = await notificationUtils.sendingPDFEmail(
      email,
      'DISBURSAL LETTER',
      pdfBase64,
      'pdf',
      'DISBURSAL_LETTER',
    )
    if (!response.success) {
      throw new InternalServerError('An error occurred while sending the email.')
    }
    await this.notificationService.create({
      customerID: payload.customerID,
      leadID: payload.leadID,
      notification: newhtmlContent,
      type: 'Email',
      subject: 'Disbursal Letter Ram Fincorp',
      createdDate: moment().utcOffset(330).format('YYYY-MM-DD HH:mm:ss'),
      uid: '221',
    })

    return this.serviceResponse(200, {}, 'Disbursal Letter sent successfully.')
  }

  private async getAlloUID(leadID: number) {
    const lead = await this.leadModel.findOne({
      where: [{ column: 'leadID', value: leadID }],
      select: ['alloUID'],
    })

    if (!lead) {
      throw new NotFoundError('Lead not found')
    }
    return lead
  }

  private async getCustomerDetails(customerID: number) {
    const customer = await this.customerModel.findOneCustomer({ customerID }, [
      'name',
      'mobile',
      'email',
    ])
    if (!customer) {
      throw new NotFoundError('Customer not found')
    }
    return customer
  }

  private async getWcId(leadID: number, status: string) {
    const message = await this.whatsappMessageIdsModel.findOne({
      where: [
        { column: 'leadID', value: leadID },
        { column: 'lead_status', value: status },
      ],
      select: ['wc_id'],
      order: [{ column: 'id', order: 'desc' }],
    })

    if (!message) {
      throw new NotFoundError('Message not found')
    }
    return message
  }

  private async assignAgent(leadID: number, customerID: number, status: string) {
    try {
      const leadDetail = await this.getAlloUID(leadID)

      //TODO: Implement getWcId (Service is not available as of now)
      // const messageDetails = await this.getWcId(leadID, status)

      const customerDetails = await this.getCustomerDetails(customerID)

      const userDetails = await this.userModel.findOne({
        where: [{ column: 'userID', value: Number(leadDetail.alloUID) }],
        select: ['whatsapp_email'],
      })

      const whatsapp_email = userDetails?.whatsapp_email || ''

      // TODO: Implement WhatsAppInteraktService
      // const whatsAppInteraktService = new WhatsAppInteraktService();
      // whatsAppInteraktService.mobile = customerDetails.mobile;
      // whatsAppInteraktService.agentEmail = whatsapp_email;
      // whatsAppInteraktService.wcId = messageDetails.wc_id;
      // await whatsAppInteraktService.assignCustomerToAgent();

      // await this.whatsappMessageIdsModel.findOneAndUpdate(
      //   { wc_id: messageDetails.wc_id },
      //   { user_id: Number(leadDetail.alloUID) },
      // )

      return { success: '', statusCode: 200 }
    } catch (e) {
      logger.error('Failed to assign agent: ', e)
      return { error: e, statusCode: 500 }
    }
  }

  allocateToMe = async (payload: IAllocateToMePayload, loggedUserId: number) => {
    const { leadID, customerID } = payload

    // Update lead allocation
    await this.leadModel.findOneAndUpdate(
      { leadID },
      {
        sanctionalloUID: loggedUserId,
        alloUID: String(loggedUserId),
      },
    )

    // Get user details
    const user = await this.userModel.findOne({
      where: [{ column: 'userID', value: loggedUserId }],
      select: ['name'],
    })

    // Create call history log
    await this.callHistoryLogsModel.insert({
      customerID: customerID,
      leadID: leadID,
      callType: 'IVR',
      status: 'Lead Allocated',
      remark: `Lead Allocated to ${user?.name || ''}`,
      noteli: ' ',
      calledBy: loggedUserId,
      // callbackTime: new Date(),
      // createdDate: new Date(),
    })

    if (payload.type === 'approved') {
      const res = await this.assignAgent(leadID, customerID, 'Approved Process')
      if (res.error) {
        return this.serviceResponse(
          HttpStatusCode.InternalServerError,
          {},
          'Failed to assign agent',
        )
      }
    } else {
      return this.serviceResponse(
        HttpStatusCode.BadRequest,
        {},
        `Invalid permission_type: Only 'approved' is currently supported`,
      )
    }

    return this.serviceResponse(HttpStatusCode.Ok, {}, 'Agent assigned successfully')
  }

  approvalDetails = async (leadID: number) => {
    const lead = await this.leadModel.findOne({
      where: { leadID },
      select: ['leadID', 'customerID', 'productID'],
    })
    const customer = await this.customerModel.findOneCustomer({
      customerID: lead.customerID,
    })

    if (!lead) throw new NotFoundError('Lead not found')
    if (!customer) throw new NotFoundError('Customer not found')

    const approval = await this.approvalModel.findOneApproval({
      leadID,
      customerID: lead.customerID,
    })

    if (!approval) throw new NotFoundError('Approval details not found')

    const { loanAmtApproved, repayDate, tenure, roi, adminFee } = approval

    const formattedRepayDate = moment(repayDate)

    const resp: Record<string, any> = {
      loanAmtApproved,
      repayDate,
      tenure,
      roi,
      adminFee,
    }

    if (lead.productID === 1) {
      resp.repayDate = +formattedRepayDate.format('DD')
    }

    return this.serviceResponse(HttpStatusCode.Ok, resp, 'Approval details fetched')
  }

  async creditDetail(payload: ICreditDetailPayload): Promise<IServiceResponse> {
    const { leadID } = payload

    let lead = await this.findOne({ leadID }, ['*'])
    if (!lead) {
      throw new NotFoundError('Lead not found')
    }
    let customer = await this.customerModel.findOneCustomer({ customerID: lead.customerID }, ['*'])
    if (!customer) {
      throw new NotFoundError('Customer not found')
    }
    let loan = await this.loanService.findOne({ leadID, customerID: lead.customerID }, [
      'leadID',
      'disbursalAmount',
      'disbursalDate',
      'loanNo',
    ])
    let approval = await this.approvalModel.findOneApproval(
      { leadID, customerID: lead.customerID },
      ['*'],
    )
    if (!approval) {
      throw new NotFoundError('Approval not found')
    }

    let tenure = approval.tenure

    if (approval && loan) {
      tenure = await this.getTenure(loan.disbursalDate, approval.repayDate as unknown as string)
    }
    if (lead.productID == 1) {
      const credit = await this.creditModel.findOneCredit(
        {
          customerID: lead.customerID,
          leadID,
        },
        ['amountToBeRepayed', 'tenure'],
        [{ column: 'creditID', order: 'desc' }],
      )
      tenure = credit.tenure
    }

    let creditData = {
      loanType: lead.productID == 1 ? 'EMI' : 'Payday',
      tenure: tenure ? `${tenure} ${lead.productID == 1 ? 'months' : 'days'}` : '-',
      roi: `${approval.roi}${lead.productID == 1 ? '% per annum' : '% per day'}`,
      approvalAmount: approval.loanAmtApproved ?? 0,
      employeeType: approval.employmentType ?? '',
      monthlyIncome: lead.monthlyIncome,
      salaryMode: lead.salaryMode ?? '',
      repaymentDate: moment(approval.repayDate).format('DD/MM/YYYY'),
      creditDate: moment(approval.createdDate).format('Do MMM, YYYY, h:mm A'),
    }

    return this.serviceResponse(200, creditData, 'Credit details retreived successfully.')
  }

  async collectionModeUpdate(payload: ICollectionUpdateModelPayload): Promise<IServiceResponse> {
    const { leadID, customerID, referenceNo, id, collectedMode, productID, status, userID } =
      payload

    const db = getKnexInstance()

    if (ProductID.PAYDAY === productID) {
      const collection = await collectionModel.findOne({
        where: { collectionID: id },
      })
      if (!collection) {
        throw new NotFoundError('The collection does not exist')
      }

      const transactions = await this.transactionModel.find({
        where: { leadID, customerID, collectionID: id },
        select: ['id'],
      })

      if (transactions.length > 1) {
        throw new BadRequestError('Duplicate transactions found')
      }

      const normalizedCollectedMode = (Object.values(CollectedMode) as string[]).includes(
        collectedMode,
      )
        ? (collectedMode as CollectedMode)
        : undefined

      await collectionModel.findOneAndUpdate(
        { collectionID: id },
        {
          collectedMode: collectedMode === 'CASH' ? CollectedMode.CASH : normalizedCollectedMode,
          referenceNo,
        },
      )

      await this.transactionModel.findOneAndUpdate(
        {
          leadID: leadID,
          customerID: customerID,
          collectionID: id,
        },
        {
          mode: normalizedCollectedMode,
          referenceNo,
        },
      )

      const data = {
        customerID: customerID,
        leadID: leadID,
        callType: productID == ProductID.PAYDAY ? 'payDay' : 'emi',
        status: status,
        appAmount: '',
        noteli: 'Payment Mode Update',
        remark: 'Payment Mode Update',
        callbackTime: moment().format('YYYY-MM-DD') as unknown as Date,
        calledBy: userID,
        createdDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
      }
      await callHistoryLogsModel.insert(data)
    } else {
      const statusMap: Record<number, string> = {
        1: 'Captured',
        2: 'Pending',
        3: 'Approved',
        4: 'Rejected',
      }
      console.log(statusMap[2])
      if (statusMap[1] == status || statusMap[4] == status) {
        throw new BadRequestError(
          'Only transactions with a status of Pending or Approved are allowed',
        )
      }

      const transaction = await this.transactionModel.findOneTransaction({
        id: id,
      })

      if (!transaction) {
        throw new NotFoundError('Transaction not found')
      }

      await this.transactionModel.findAndUpdate([{ key: 'id', valueArray: [id] }], {
        mode: collectedMode,
        referenceNo,
      })

      await callHistoryLogsModel.insert({
        customerID,
        leadID,
        callType: productID == ProductID.PAYDAY ? 'payDay' : 'emi',
        status: statusMap[parseInt(status, 10)] || 'Failed',
        appAmount: '',
        remark: 'Payment Mode Update',
        noteli: 'Payment Mode Update',
        callbackTime: moment().format('YYYY-MM-DD') as unknown as Date,
        calledBy: userID,
        createdDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
      })
    }

    return this.serviceResponse(200, {}, 'Collection mode updated successfully.')
  }

  async leadRefundUpdate(payload: ILeadRefundUpdatePayload) {
    let { collectionID, leadID, refundDate, utrNo, status, remark, prAmount, userID } = payload

    const db = getKnexInstance()
    const currentDate = new Date()

    try {
      const collectionData = await db('collection').where({ leadID, collectionID }).first()

      if (!collectionData) {
        return this.serviceResponse(HttpStatusCode.NotFound, {}, 'Collection Data Not Available.')
      }

      if (collectionData.excess_amount < prAmount) {
        return this.serviceResponse(
          HttpStatusCode.BadRequest,
          {},
          `Please enter a valid amount below ${collectionData.excess_amount}`,
        )
      }

      await db.transaction(async trx => {
        await trx('collectionRefund').insert({
          collectionID,
          leadID,
          refundAmount: prAmount,
          refundDate,
          utrNo,
          changeStatus: status,
          uid: userID,
          remark,
          refundApproved: userID,
          refundApprovedDate: currentDate,
          credatedDate: currentDate,
        })

        await trx('collection').insert({
          customerID: collectionData.customerID,
          leadID: collectionData.leadID,
          loanNo: collectionData.loanNo,
          collectedAmount: prAmount,
          collectedMode: collectionData.collectedMode,
          collectedDate: refundDate,
          referenceNo: `${collectionData.referenceNo}_refundAmount`,
          status,
          remark,
          collectedBy: userID,
          collectionStatus: CollectionStatus.APPROVED_REFUNDED,
          approvedDate: currentDate,
          orderID: `${collectionData.orderID}_refundAmount`,
          refund_utr_no: utrNo,
        })

        await trx('leads').where({ leadID }).update({ status })

        await trx('callhistoryLogs').insert({
          customerID: collectionData.customerID,
          leadID: collectionData.leadID,
          callType: CallType.IVR,
          status,
          remark,
          noteli: remark,
          callbackTime: currentDate,
          calledBy: userID,
          createdDate: currentDate,
          appAmount: '',
        })
      })

      return this.serviceResponse(HttpStatusCode.Ok, {}, 'Refund added successfully')
    } catch (error) {
      return this.serviceResponse(HttpStatusCode.InternalServerError, {}, error)
    }
  }

  async checkPennyDrop(payload: ICheckPennyDropPayload) {
    const accountDetails = await razorpayMandateModel.findOne({
      where: {
        accountNo: payload.accountNo,
      },
      whereNotNull: ['emMaxamount'],
      whereIn: [
        {
          column: 'status',
          value: ['paid', 'Paid', 'PAID'],
        },
      ],
      order: [{ column: 'id', order: 'desc' }],
    })

    if (!accountDetails) {
      throw new NotFoundError('Account Details Not Found')
    }
    const remark = accountDetails?.accountNo ?? 0
    const data = {
      customerID: +accountDetails.customerID,
      leadID: payload.leadID,
      callType: 'IVR',
      status: 'Pennydrop Acc. Validation',
      appAmount: '',
      noteli: payload.noteli ?? '',
      remark: String(payload.remark ?? accountDetails.accountNo ?? '0'),
      callbackTime: moment().format('YYYY-MM-DD') as unknown as Date,
      calledBy: payload.userID,
      createdDate: moment().format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
    }
    await callHistoryLogsModel.insert(data)

    const pennyDropData = await pennyDropModel.findOne({
      where: {
        customerID: +accountDetails?.customerID,
        account_number: accountDetails.accountNo,
        account_status: 'active',
        penny_status: 'completed',
      },
      whereNot: {
        registered_name: '',
      },
      whereNotNull: ['registered_name'],
      order: [{ column: 'id', order: 'desc' }],
    })

    if (pennyDropData) {
      return this.serviceResponse(200, {}, 'Penny drop on this account has been already done.')
    }

    const customerDetails = await customerModel.find({
      where: { customerID: +accountDetails?.customerID },
    })

    const uniqueReference = `${customerDetails[0].name}-${payload.leadID}-${
      Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111
    }`
    const referenceName = customerDetails[0]?.name + '-' + customerDetails[0]?.mobile

    // Penny Drop bypass
    if (config.nodeEnv !== 'production') {
      const pennyIdDummy = await this.pennyDropModel.insert({
        account_number: accountDetails.accountNo,
        bank_name: accountDetails.bank,
        customerID: +accountDetails?.customerID,
        ifsc: accountDetails.ifsc,
        leadID: String(payload.leadID),
        logs: JSON.stringify({ bypass: true }),
        name: customerDetails[0].name,
        p_id: generatePennyDropId(),
        penny_status: 'completed', // completed
        uid: config.defaultUserId,
        account_status: 'active', // active
        registered_name: customerDetails[0].name,
        penny_type: PennyDropType.RAZORPAY,
      })

      await this.stepTrackerModel.completeStep(
        +accountDetails?.customerID,
        StepName.PENNY_DROP,
        Products.PAYDAY,
        payload.leadID,
      )

      return this.serviceResponse(
        200,
        {
          pennyStatus: 'completed',
          metaData: {
            pennyDropId: pennyIdDummy[0],
          },
        },
        'Your Bank Details have been verified',
      )
    }

    const createContactPayload: IRazorPayContactsRequest = {
      name: customerDetails[0].name,
      email: customerDetails[0].email,
      contact: customerDetails[0].mobile,
      type: RazorPayContactType.CUSTOMER,
      reference_id: referenceName.substring(0, 39),
      notes: {
        notes_key_1: uniqueReference,
        notes_key_2: uniqueReference,
      },
    }

    const contactResp = await this.razorPayPayments.createContact(
      +accountDetails?.customerID,
      payload.leadID,
      createContactPayload,
    )
    if (!contactResp.success) {
      logger.error('Error in RazorPay Contacts API')
      throw new BadRequestError('An Issue occured in initializing the bank verification process', {
        data: {
          pennyStatus: PennyStatus.INCOMPLETE,
          metaData: {
            pennyDropId: null,
          },
        },
      })
    }

    const createFundAccountPayload = {
      contact_id: contactResp.data.id,
      account_type: 'bank_account',
      bank_account: {
        name: customerDetails[0].name,
        ifsc: accountDetails.ifsc,
        account_number: accountDetails.accountNo,
      },
    }

    const createFundAccountResp = await this.razorPayPayments.createFundAccount(
      +accountDetails?.customerID,
      Number(payload?.leadID),
      createFundAccountPayload,
    )

    if (!createFundAccountResp.success) {
      logger.error('Error in RazorPay Fund Account API')
      throw new BadRequestError('An Issue occured initializing the bank verification process', {
        data: {
          pennyStatus: PennyStatus.INCOMPLETE,
          metaData: {
            pennyDropId: null,
          },
        },
      })
    }

    const fundAccountValidationPayload = {
      account_number: config.defaultAccountNo,
      fund_account: { id: createFundAccountResp.data.id },
      amount: 100,
      currency: 'INR',
      notes: {
        random_key_1: customerDetails[0].name,
        random_key_2: 'Payouts Account Validation',
      },
    }

    // Execute the fund account validation request
    const validateFundAccountResp = await this.razorPayPayments.validateAccount(
      +accountDetails?.customerID,
      Number(payload?.leadID),
      fundAccountValidationPayload,
    )

    if (!validateFundAccountResp.success) {
      logger.error('Error in RazorPay Validate Account API')
      throw new BadRequestError('An Issue occured initializing the bank verification process', {
        data: {
          pennyStatus: PennyStatus.INCOMPLETE,
          metaData: {
            pennyDropId: null,
          },
        },
      })
    }

    const pennyId = await this.pennyDropModel.insert({
      account_number: accountDetails.accountNo,
      bank_name: accountDetails.bank,
      customerID: +accountDetails.customerID,
      ifsc: accountDetails.ifsc,
      leadID: String(payload.leadID),
      logs: JSON.stringify(validateFundAccountResp.data),
      name: customerDetails[0]?.name,
      p_id: validateFundAccountResp.data.id,
      penny_status: validateFundAccountResp.data.status,
      uid: config.defaultUserId,
      account_status: validateFundAccountResp.data?.results?.account_status,
      registered_name: validateFundAccountResp.data?.results?.registered_name,
      penny_type: PennyDropType.RAZORPAY,
    })

    if (validateFundAccountResp.data.status === RazorPayValidateStatus.FAILED) {
      logger.error('RazorPay Validate Account API sent status of FAILED')

      throw new BadRequestError(
        'Failed to validate your bank details, Please try again in a few minutes',
        {
          data: {
            pennyStatus: PennyStatus.FAILED,
            metaData: { pennyDropId: pennyId[0] },
          },
        },
      )
    }

    return this.serviceResponse(200, {}, 'Credit details retreived successfully.')
  }

  private async check_repayment_amount(
    leadID: number,
    collectedDate: string | null = null,
  ): Promise<IDataCode> {
    const dpd_Intrest = 1.25
    let dpd_days = 0
    let remainingDays = 0
    let total_amount = 0
    let sanction_intrest = 0
    let delay_intrest = 0
    let collectionAmount = 0
    const DataCode: IDataCode = {
      Total_Payable_Amount: 0,
      Remanning_Amount: 0,
      RepayDate: '0000-00-00', //YYYY-MM-DD
    }

    const now = moment().format('YYYY-MM-DD') // Current date in 'YYYY-MM-DD' format
    const curr_date = collectedDate || now
    let db = getKnexInstance()

    // Fetch data from the database
    const data = await db('leads')
      .select('leads.*', 'customer.*', 'approval.*', 'loan.*')
      .join('customer', 'leads.customerID', 'customer.customerID')
      .join('approval', 'leads.leadID', 'approval.leadID')
      .join('loan', 'leads.leadID', 'loan.leadID')
      .where('leads.leadID', leadID)
      .whereIn('leads.status', ['Disbursed', 'Part Payment'])
      .first() // Fetch only the first record

    if (data) {
      const re_pay_date = moment(data.repayDate).format('YYYY-MM-DD')
      const datediff2 = moment(re_pay_date).diff(moment(now), 'days')

      if (datediff2 > 0) {
        remainingDays = datediff2
        dpd_days = 0
      } else {
        remainingDays = 0
        dpd_days = Math.abs(datediff2)
      }

      const disbursalDate = moment(data.disbursalDate).format('YYYY-MM-DD')

      let tenure: number
      if (moment(curr_date).isAfter(moment(re_pay_date))) {
        tenure = moment(re_pay_date).diff(moment(disbursalDate), 'days')
      } else {
        tenure = moment(now).diff(moment(disbursalDate), 'days')
      }

      sanction_intrest = data.disbursalAmount * (data.roi / 100) * tenure

      const collection = await db('collection')
        .select('collectionID', 'collectedAmount', 'status')
        .where('customerID', data.customerID)
        .where('leadID', data.leadID)
        .where('loanNo', data.loanNo)
        .where('status', 'Part Payment')
        .where('collectionStatus', 'Approved')
        .orderBy('collectionID', 'desc')

      if (collection.length > 0) {
        for (const col of collection) {
          collectionAmount += col.collectedAmount
        }

        if (moment(curr_date).isAfter(moment(data.repayDate))) {
          const delay_tenure = moment(curr_date).diff(moment(data.repayDate), 'days')
          dpd_days = delay_tenure
          delay_intrest = data.disbursalAmount * (dpd_Intrest / 100) * dpd_days
        }
      } else {
        if (moment(curr_date).isAfter(moment(data.repayDate))) {
          const delay_tenure = moment(curr_date).diff(moment(data.repayDate), 'days')
          dpd_days = delay_tenure
          delay_intrest = data.disbursalAmount * (dpd_Intrest / 100) * dpd_days
        }
      }

      total_amount = data.disbursalAmount + sanction_intrest + delay_intrest
      const Remanning_Amount = total_amount - collectionAmount

      DataCode.Total_Payable_Amount = Math.round(total_amount * 100) / 100 // Round to 2 decimal places
      DataCode.Remanning_Amount = Math.round(Remanning_Amount * 100) / 100 // Round to 2 decimal places
      DataCode.RepayDate = data.repayDate
    }

    return DataCode
  }
}

export const leadService = new LeadService()
