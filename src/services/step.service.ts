import { approvalModel } from '@/database/mysql/approval'
import { customerModel } from '@/database/mysql/customer'
import { customerAccountModel } from '@/database/mysql/customerAccount'
import { leadModel } from '@/database/mysql/leads'
import { productModel } from '@/database/mysql/product'
import { stepControlModel } from '@/database/mysql/step-control'
import { stepTrackerModel } from '@/database/mysql/step_tracker'
import { StepName } from '@/enums/common.enum'
import { DashboardLeadStatus, LeadFlow, LeadStatus, LeadType } from '@/enums/lead.enum'
import { Products } from '@/enums/product.enum'
import { profileDetailsStep, StepProvider } from '@/enums/step.enum'
import { NotFoundError } from '@/errors'
import { ILead } from '@/interfaces/lead.interface'
import { IProduct } from '@/interfaces/product.interface'
import { IServiceResponse } from '@/interfaces/service.interface'
import { IStepControlModel } from '@/interfaces/step-control.interface'
import { IStepTrackerModel } from '@/interfaces/step-tracker'
import {
  ICheckRepeatCustomerPreviousStepsResponse,
  IStepService,
} from '@/interfaces/step.interface'
import { logger } from '@/utils/logger'
import { handlePhpCustomers } from '@/utils/step.util'
import { checkValidLead } from '@/utils/util'
import { HttpStatusCode } from 'axios'
import { Knex } from 'knex'
import { customerService } from './customer.service'
import { leadService } from './lead.service'
import ResponseService from './response.service'

export class StepService extends ResponseService implements IStepService {
  private readonly productModel = productModel
  private readonly stepControlModel = stepControlModel
  private readonly stepTrackerModel = stepTrackerModel
  private readonly leadModel = leadModel
  private readonly leadService = leadService
  private readonly approvalModel = approvalModel
  private readonly customerAccountModel = customerAccountModel

  constructor() {
    super()
  }

  getUserNextStep = async (
    customerID: number,
    leadID: number,
    userIp?: string,
    accountID?: number,
    name?: string,
    plateform?: string,
  ): Promise<IServiceResponse> => {
    // ! Recent

    const customerLead = await this.leadModel.findOne({
      where: { leadID },
      order: [{ column: 'leadID', order: 'desc' }],
      select: ['customerID'],
    })

    const lead = await this.leadModel.findOne({
      where: { customerID },
      order: [{ column: 'leadID', order: 'desc' }],
      select: ['leadID', 'status', 'fbLeads'],
    })

    const customer = { customerID, name }
    if (customerLead) {
      if (customerLead.customerID !== customerID) {
        // Wrong lead sent or lead does not belong to the customer
        // step:null,leadID:null

        return this.serviceResponse(
          HttpStatusCode.Ok,
          {
            step: null,
            leadID: null,
            status: null,
            leadType: null,
            flow: null,
            customer,
          },
          'Next step',
        )
      }
    }

    // TODO : Dynamic product ID as per lead.productID
    const result = await this.handleCustomers(
      customerID,
      Products.PAYDAY,
      lead,
      userIp,
      leadID,
      accountID,
      plateform,
    )

    return this.serviceResponse(
      HttpStatusCode.Ok,
      result
        ? { ...result, customer }
        : {
          step: null,
          leadID: null,
          status: null,
          leadType: null,
          flow: null,
          customer,
        },
      'Next step',
    )
  }

  handleCustomers = async (
    customerID: number,
    product: Products,
    lead?: ILead,
    userIp?: string,
    leadId?: number,
    accountID?: number,
    plateform?: string,
  ) => {
    if (!lead) {
      return await this.handleNewCustomer(customerID, product, userIp, plateform)
    }

    const { status, leadID } = lead

    let customerType: string
    let isRejected = true

    // ! Recent

    lead = await customerService.checkDuplicateLead(customerID, lead)

    // Check if latest lead or not
    const isValidLead = checkValidLead(lead, leadId)

    if (!isValidLead)
      return {
        step: null,
        leadID: null,
        status: null,
        leadType: null,
        flow: null,
      }

    // ! Function to add repeat user step control

    // if (lead.fbLeads === 'Repeat Case' || lead.fbLeads === 'Existing Case') {
    //   await handlePhpCustomers(customerID, leadID)
    // }

    switch (status) {
      case LeadStatus.REJECTED:
      case LeadStatus.REJECTED_PROCESS:
      case LeadStatus.BANK_UPDATE_REJECTED:
      case LeadStatus.NOT_ELIGIBLE:
        customerType = DashboardLeadStatus.REJECT
        // Make check for 45 days
        const rejectionStatus = await leadService.checkRejectedCase(
          leadID,
          customerID,
          lead.status,
        )

        isRejected = rejectionStatus.isRejected

        return await this.handleRejectedCustomer(
          customerID,
          isRejected,
          product,
          leadID,
          lead,
          userIp,
        )

      case LeadStatus.CLOSED:
        customerType = DashboardLeadStatus.CLOSED
        return await this.handleClosedCustomer(customerID, product, leadID)

      default:
        return await this.handleOtherCustomers(customerID, lead, product, userIp, accountID)
    }
  }

  private handleNewCustomer = async (
    customerID: number,
    product: Products,
    userIp?: string,
    plateform?: string,
  ) => {
    // First check if Re Verify PAN needed or not
    const isKycNeeded = await this.checkReKycNeeded(customerID)
    if (isKycNeeded.shouldReKyc) {
      return {
        step: isKycNeeded.step,
        leadID: null,
        status: null,
        leadType: LeadType.NEW_CASE,
        flow: LeadFlow.GENERIC,
      }
    }

    // if new Customer, no lead generated
    const productData = await productModel.findOne({ name: product }, ['productID'])

    if (!productData) throw new NotFoundError('Product not found')

    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]

    // first check if user has completed generic steps or not

    const stepsGeneric = await stepControlModel.find({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.GENERIC,
        is_active: true,
      },
      select: stepControlSelect,
      order: [{ column: 'step_order', order: 'asc' }],
    })

    // Checking generic steps completion

    const userStepsGeneric = await stepTrackerModel.findAll(
      ['*'],
      { customer_id: customerID, lead_id: null },
      [{ order: 'desc', column: 'id' }],
    )

    const incompleteGenericSteps = stepsGeneric.filter(
      step => !userStepsGeneric.some(userStep => userStep.step_id === step.id),
    )

    // The step sent was a generic step and user needs to complete this, let them do it

    if (incompleteGenericSteps[0]) {
      return {
        step: incompleteGenericSteps[0],
        leadID: null,
        status: null,
        leadType: LeadType.NEW_CASE,
        flow: LeadFlow.GENERIC,
      }
    }

    // No steps were incomplete, customer can perform 1st existing customer step

    const existingCustomerFirstStep = await this.stepControlModel.findOne({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.EXISTING,
        is_active: true,
      },
      order: [{ column: 'step_order', order: 'asc' }],
      select: stepControlSelect,
    })

    // ! Create a Lead here:

    const newLeadId = await this.leadService.createNewLead(
      customerID,
      'New Case',
      userIp,
      plateform,
    )

    return {
      step: existingCustomerFirstStep,
      leadID: newLeadId.leadID,
      status: newLeadId.status,
      leadType: LeadType.NEW_CASE,
      flow: LeadFlow.NON_GENERIC,
    }
  }

  private handleRejectedCustomer = async (
    customerID: number,
    isRejected: boolean,
    product: Products,
    leadID: number,
    lead: ILead,
    userIp?: string,
  ) => {
    // Check for 45 days

    if (isRejected)
      return {
        step: null,
        leadID,
        status: lead.status,
        leadType: null,
        flow: null,
      }
    // Find if user has completed generic steps or not

    const productData = await productModel.findOne({ name: product }, ['productID'])

    if (!productData) throw new NotFoundError('Product not found')

    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]

    // first check if user has completed generic steps or not

    const stepsGeneric = await stepControlModel.find({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.GENERIC,
        is_active: true,
      },
      select: stepControlSelect,
      order: [{ column: 'step_order', order: 'asc' }],
    })

    // Checking generic steps completion

    const userStepsGeneric = await stepTrackerModel.findAll(
      ['*'],
      { customer_id: customerID, lead_id: null },
      [{ order: 'desc', column: 'id' }],
    )

    const incompleteGenericSteps = stepsGeneric.filter(
      step => !userStepsGeneric.some(userStep => userStep.step_id === step.id),
    )

    // The step sent was a generic step and user needs to complete this, let them do it

    // approval check

    const { approvalService } = await import('./approval.service')
    const isApproval = await approvalService.checkCustomerApproval(customerID, lead)

    if (incompleteGenericSteps[0]) {
      return {
        step: incompleteGenericSteps[0],
        leadID,
        status: lead.status,
        leadType: isApproval ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
        flow: LeadFlow.GENERIC,
      }
    }

    // No steps were incomplete, customer can perform 1st existing/repeat customer step

    // if isApproval = true, start from 1_page flow, else new/existing flow , user fbLeads status will always be Existing Case

    const repeatCustomerFirstStep = await stepControlModel.findOne({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.REPEAT_CUSTOMER,
        is_active: true,
      },
      order: [{ column: 'step_order', order: 'asc' }],
      select: stepControlSelect,
    })

    return {
      step: repeatCustomerFirstStep,
      leadID,
      status: lead.status,
      leadType: LeadType.REPEAT_CASE,
      flow: LeadFlow.NON_GENERIC,
    }
  }

  private handleClosedCustomer = async (customerID: number, product: Products, leadID: number) => {
    const productData = await productModel.findOne({ name: product }, ['productID'])

    if (!productData) throw new NotFoundError('Product not found')

    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]

    // ! Function to add repeat user step control
    await handlePhpCustomers(customerID, leadID)
    // first check if user has completed generic steps or not

    const stepsGeneric = await stepControlModel.find({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.GENERIC,
        is_active: true,
      },
      select: stepControlSelect,
      order: [{ column: 'step_order', order: 'asc' }],
    })

    // Checking generic steps completion

    const userStepsGeneric = await stepTrackerModel.findAll(
      ['*'],
      { customer_id: customerID, lead_id: null },
      [{ order: 'desc', column: 'id' }],
    )

    const incompleteGenericSteps = stepsGeneric.filter(
      step => !userStepsGeneric.some(userStep => userStep.step_id === step.id),
    )

    // The step sent was a generic step and user needs to complete this, let them do it

    if (incompleteGenericSteps[0]) {
      return {
        step: incompleteGenericSteps[0],
        leadID,
        status: LeadStatus.CLOSED,
        leadType: LeadType.REPEAT_CASE,
        flow: LeadFlow.GENERIC,
      }
    }

    // No steps were incomplete, customer can perform 1st repeat_customer step
    // Because after first step complete, new leadId will be generated for user

    const repeatCustomerFirstStep = await stepControlModel.findOne({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.REPEAT_CUSTOMER,
        is_active: true,
      },
      order: [{ column: 'step_order', order: 'asc' }],
      select: stepControlSelect,
    })

    return {
      step: repeatCustomerFirstStep,
      leadID,
      status: LeadStatus.CLOSED,
      leadType: LeadType.REPEAT_CASE,
      flow: LeadFlow.NON_GENERIC,
    }
  }

  private handleIncompleteAndNextSteps = async (
    customerID: number,
    leadID: number,
    product: Products,
    lead: ILead,
    accountID?: number,
  ) => {
    const { status } = lead

    // approval check

    const { approvalService } = await import('./approval.service')
    let provider = await approvalService.checkRepeatFlowOrNew(customerID, leadID)
    // ! New change for existing user PHP
    if (lead.fbLeads === 'Existing Case') {
      provider = StepProvider.REPEAT_CUSTOMER
    }

    // ! Add two step_tracker entries here[ FOR DSA handling ]

    if (
      lead.status === LeadStatus.FRESH_LEAD &&
      provider === StepProvider.REPEAT_CUSTOMER &&
      lead.fbLeads === 'Existing Case'
    ) {
      const steps = await this.stepControlModel.find({
        whereIn: [
          {
            column: 'step_name',
            value: [StepName.FINBOX, StepName.LOAN_AMOUNT_CLOSED],
          },
        ],
        select: ['id', 'step_name'],
      })

      if (steps.length > 0) {
        for (let step of steps) {
          const stepExist = await this.stepTrackerModel.findOneStepTracker({
            step_id: step.id,
            lead_id: leadID,
            customer_id: customerID,
          })
          if (!stepExist) {
            await this.stepTrackerModel.insert({
              customer_id: customerID,
              is_completed: step.step_name === StepName.FINBOX ? false : true,
              is_skippable: false,
              lead_id: leadID,
              step_id: step.id,
            })
          }
        }
      }
    }

    // ! For reKyc
    if (
      lead.status === LeadStatus.INCOMPLETE_USER ||
      lead.status === LeadStatus.FRESH_LEAD ||
      lead.status === LeadStatus.APPROVED_PROCESS ||
      lead.status === LeadStatus.CALLBACK ||
      lead.status === LeadStatus.INTERESTED ||
      lead.status === LeadStatus.NO_ANSWER ||
      lead.status === LeadStatus.INCOMPLETE_DOCUMENTS ||
      lead.status === LeadStatus.DNC
    ) {
      const isKycNeeded = await this.checkReKycNeeded(customerID)
      if (isKycNeeded.shouldReKyc) {
        return {
          step: isKycNeeded.step,
          leadID: leadID,
          status,
          leadType:
            provider === StepProvider.REPEAT_CUSTOMER ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
          flow: LeadFlow.GENERIC,
        }
      }
    }

    // ! Even before generic steps, we need to check if user needs to complete is_completed false steps
    // ! This code is shifted below after generic step test for DSA fix
    // const notCompletedSteps = await this.notCompletedSteps(customerID, leadID)

    // if (notCompletedSteps.length > 0) {
    //   return {
    //     step: notCompletedSteps[0],
    //     leadID,
    //     status,
    //     leadType:
    //       provider === StepProvider.REPEAT_CUSTOMER
    //         ? LeadType.REPEAT_CASE
    //         : LeadType.NEW_CASE,
    //     flow: LeadFlow.NON_GENERIC,
    //   }
    // }
    // Find if user has completed generic steps or not

    const productData = await productModel.findOne({ name: product }, ['productID'])

    if (!productData) throw new NotFoundError('Product not found')

    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]

    // first check if user has completed generic steps or not

    const stepsGeneric = await stepControlModel.find({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.GENERIC,
        is_active: true,
      },
      select: stepControlSelect,
      order: [{ column: 'step_order', order: 'asc' }],
    })

    // Checking generic steps completion

    const userStepsGeneric = await stepTrackerModel.findAll(
      ['*'],
      { customer_id: customerID, lead_id: null, is_completed: true },
      [{ order: 'desc', column: 'id' }],
    )

    const incompleteGenericSteps = stepsGeneric.filter(
      step => !userStepsGeneric.some(userStep => userStep.step_id === step.id),
    )

    // The step sent was a generic step and user needs to complete this, let them do it

    if (incompleteGenericSteps[0]) {
      return {
        step: incompleteGenericSteps[0],
        leadID,
        status,
        leadType:
          provider === StepProvider.REPEAT_CUSTOMER ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
        flow: LeadFlow.GENERIC,
      }
    }

    // ! This code is shifted down from above for DSA
    const notCompletedSteps = await this.notCompletedSteps(customerID, leadID)

    if (notCompletedSteps.length > 0) {
      return {
        step: notCompletedSteps[0],
        leadID,
        status,
        leadType:
          provider === StepProvider.REPEAT_CUSTOMER ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
        flow: LeadFlow.NON_GENERIC,
      }
    }

    // No steps were incomplete, customer can perform 1st existing/repeat customer step

    if (status === LeadStatus.APPROVED_PROCESS && provider === StepProvider.REPEAT_CUSTOMER) {
      // Check if other steps were complete or not
      const resp = await this.checkRepeatCustomerPreviousSteps(customerID, leadID, productData)

      if (resp.required) {
        // This will be the user's next step
        return {
          step: resp.step,
          leadID,
          status,
          leadType:
            provider === StepProvider.REPEAT_CUSTOMER ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
          flow: LeadFlow.NON_GENERIC,
        }
      }
    }
    // if isApproval = true, start from 1_page flow, else new/existing flow

    let stepsForCustomer = await stepControlModel.find({
      where: {
        product_id: productData.productID,
        provider_id: provider,
        is_active: true,
      },
      order: [{ column: 'step_order', order: 'asc' }],
      select: stepControlSelect,
    })

    // ! Now find customer existing non generic steps, [For PHP Repeat case handling]
    if (lead.fbLeads === 'Repeat Case') {
      // Remove checking Profile Details step from repeat customer, as it is not needed

      stepsForCustomer = stepsForCustomer.filter(step => {
        // If lead status is not closed, then remove loan amount closed step
        if (status !== LeadStatus.CLOSED) {
          if (step.step_name === StepName.LOAN_AMOUNT_CLOSED) {
            return false
          }
        }
        // Remove checking profile details step
        if (!profileDetailsStep.includes(step.step_name as StepName)) {
          return step
        }
      })
    }

    const customerCompletedSteps = await stepTrackerModel.find({
      where: { customer_id: customerID, lead_id: leadID, is_completed: true },
      order: [{ order: 'asc', column: 'step_id' }],
    })

    const incompleteNonGenericSteps = stepsForCustomer.filter(
      step => !customerCompletedSteps.some(userStep => userStep.step_id === step.id),
    )

    // ! If the incomplete step is reference details, check needs to be made of 26000 one

    if (incompleteNonGenericSteps[0].step_name === StepName.REFERENCE_DETAILS) {
      const isReferenceNeeded = await this.checkReferenceRequired(leadID)

      if (!isReferenceNeeded) {
        // Skip this step for the user
        const userStep = await this.stepTrackerModel.findOneStepTracker(
          {
            step_id: incompleteNonGenericSteps[0].id,
            customer_id: customerID,
            lead_id: leadID,
          },
          ['id'],
        )

        if (!userStep) {
          // If not completed that insert entry
          await this.stepTrackerModel.insert({
            customer_id: customerID,
            step_id: incompleteNonGenericSteps[0].id,
            lead_id: leadID,
            is_completed: true,
            is_skippable: true,
          })
        }

        return {
          step: incompleteNonGenericSteps[1], // return the step after reference
          leadID,
          status,
          leadType:
            provider === StepProvider.REPEAT_CUSTOMER ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
          flow: LeadFlow.GENERIC,
        }
      }
    }

    // Check if mobile app needs to send user to bank list view or not
    if (
      (provider as any) === StepProvider.EXISTING &&
      (incompleteNonGenericSteps[0].step_name === StepName.EMANDATE ||
        incompleteNonGenericSteps[0].step_name === StepName.PENNY_DROP ||
        incompleteNonGenericSteps[0].step_name === StepName.KFS)
    ) {
      const step = await this.checkBankListOnAppClose(customerID, accountID)

      if (step) {
        return {
          step,
          leadID,
          status,
          leadType: LeadType.NEW_CASE,
          flow: LeadFlow.GENERIC,
        }
      }
    }

    if (
      provider === StepProvider.REPEAT_CUSTOMER &&
      incompleteNonGenericSteps[0].step_name === StepName.KFS
    ) {
      const step = await this.checkBankListOnAppClose(customerID, accountID)

      if (step) {
        return {
          step,
          leadID,
          status,
          leadType: LeadType.REPEAT_CASE,
          flow: LeadFlow.GENERIC,
        }
      }
    }

    return {
      step: incompleteNonGenericSteps[0],
      leadID,
      status,
      leadType:
        provider === StepProvider.REPEAT_CUSTOMER ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
      flow: LeadFlow.GENERIC,
    }
  }

  private handleOtherCustomers = async (
    customerID: number,
    lead: ILead,
    product: Products,
    userIp?: string,
    accountID?: number,
  ) => {
    const { status, leadID } = lead

    switch (status) {
      case LeadStatus.DOCUMENT_RECEIVED:
      case LeadStatus.DISBURSAL_SHEET_SEND:
      // case LeadStatus.FRESH_LEAD:
      case LeadStatus.APPROVED:
        // User cannot hit any API at this point
        return { step: null, leadID, status, leadType: null, flow: null }

      case LeadStatus.NOT_INTERESTED:
      case LeadStatus.NOT_REQUIRED:
      case LeadStatus.NOT_REQUIRED_PROCESS:
      case LeadStatus.DUPLICATE:
        // same flow as rejected for step checking but without 45 days check
        return await this.handleNotReqCustomer(customerID, product, leadID, lead)

      // Steps not required here
      case LeadStatus.HOLD:
      case LeadStatus.HOLD_PROCESS:
      case LeadStatus.SETTLEMENT:
      case LeadStatus.BLACK_LISTED:
      case LeadStatus.DISBURSED:
      case LeadStatus.PART_PAYMENT:
        return { step: null, leadID, status, leadType: null, flow: null }

      case LeadStatus.INCOMPLETE_USER:
      case LeadStatus.APPROVED_PROCESS:
        return await this.handleIncompleteAndNextSteps(customerID, leadID, product, lead, accountID)

      case LeadStatus.CALLBACK:
      case LeadStatus.INTERESTED:
      case LeadStatus.NO_ANSWER:
      case LeadStatus.INCOMPLETE_DOCUMENTS:
      case LeadStatus.DNC:
        return await this.handleCallbackCustomer(customerID, product, leadID, lead)

      case LeadStatus.FRESH_LEAD:
        // Need to do two step_tracker entries here
        return await this.handleIncompleteAndNextSteps(customerID, leadID, product, lead, accountID)

      default:
        return await this.handleIncompleteAndNextSteps(customerID, leadID, product, lead)
    }
  }

  private handleCallbackCustomer = async (
    customerID: number,
    product: Products,
    leadID: number,
    lead: ILead,
  ) => {
    const productData = await productModel.findOne({ name: product }, ['productID'])

    if (!productData) throw new NotFoundError('Product not found')

    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]

    // first check if user has completed generic steps or not

    const stepsGeneric = await stepControlModel.find({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.GENERIC,
        is_active: true,
      },
      select: stepControlSelect,
      order: [{ column: 'step_order', order: 'asc' }],
    })

    // Checking generic steps completion

    const userStepsGeneric = await stepTrackerModel.findAll(
      ['*'],
      { customer_id: customerID, lead_id: null },
      [{ order: 'desc', column: 'id' }],
    )

    const incompleteGenericSteps = stepsGeneric.filter(
      step => !userStepsGeneric.some(userStep => userStep.step_id === step.id),
    )

    // The step sent was a generic step and user needs to complete this, let them do it

    const { approvalService } = await import('./approval.service')
    const isApproval = await approvalService.checkCustomerApproval(customerID, lead)

    if (incompleteGenericSteps[0]) {
      return {
        step: incompleteGenericSteps[0],
        leadID,
        status: lead.status,
        leadType: isApproval ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
        flow: LeadFlow.GENERIC,
      }
    }

    // No steps were incomplete, customer can perform 1st repeat_customer step, if approval table has any data
    // Because after first step complete, new leadId will be generated for user

    const firstStep = await stepControlModel.findOne({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.EXISTING,
        step_name: StepName.FINBOX,
        is_active: true,
      },
      order: [{ column: 'step_order', order: 'asc' }],
      select: stepControlSelect,
    })

    return {
      step: firstStep,
      leadID,
      status: lead.status,
      leadType: isApproval ? LeadType.REPEAT_CASE : LeadType.NEW_CASE,
      flow: LeadFlow.NON_GENERIC,
    }
  }

  private handleNotReqCustomer = async (
    customerID: number,
    product: Products,
    leadID: number,
    lead: ILead,
  ) => {
    const productData = await productModel.findOne({ name: product }, ['productID'])

    if (!productData) throw new NotFoundError('Product not found')

    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]

    // first check if user has completed generic steps or not

    const stepsGeneric = await stepControlModel.find({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.GENERIC,
        is_active: true,
      },
      select: stepControlSelect,
      order: [{ column: 'step_order', order: 'asc' }],
    })

    // Checking generic steps completion

    const userStepsGeneric = await stepTrackerModel.findAll(
      ['*'],
      { customer_id: customerID, lead_id: null },
      [{ order: 'desc', column: 'id' }],
    )

    const incompleteGenericSteps = stepsGeneric.filter(
      step => !userStepsGeneric.some(userStep => userStep.step_id === step.id),
    )

    // The step sent was a generic step and user needs to complete this, let them do it

    if (incompleteGenericSteps[0]) {
      return {
        step: incompleteGenericSteps[0],
        leadID,
        status: lead.status,
        leadType: LeadType.REPEAT_CASE,
        flow: LeadFlow.GENERIC,
      }
    }

    // No steps were incomplete, customer can perform 1st repeat_customer step, if approval table has any data
    // Because after first step complete, new leadId will be generated for user

    const repeatCustomerFirstStep = await stepControlModel.findOne({
      where: {
        product_id: productData.productID,
        provider_id: StepProvider.REPEAT_CUSTOMER,
        is_active: true,
      },
      order: [{ column: 'step_order', order: 'asc' }],
      select: stepControlSelect,
    })

    return {
      step: repeatCustomerFirstStep,
      leadID,
      status: lead.status,
      leadType: LeadType.REPEAT_CASE,
      flow: LeadFlow.NON_GENERIC,
    }
  }

  getUserStep = async (
    customerID: number,
    customerType: DashboardLeadStatus,
    product: Products,
    leadID?: number,
  ) => {
    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]
    const productData = await this.productModel.findOne({ name: product }, ['productID'])

    // Handling Generic Steps
    const steps = await this.stepControlModel.find({
      where: { provider_id: 'Generic', product_id: productData.productID },
      select: stepControlSelect,
      order: [{ column: 'step_order', order: 'asc' }],
    })

    const userSteps = await this.stepTrackerModel.findAll(
      ['*'],
      {
        customer_id: customerID,
        lead_id: null,
      },
      [{ order: 'asc', column: 'step_id' }],
    )

    if (!userSteps.length) {
      // Fresh user no steps done

      return steps[0]
    }

    // check intersection
    const incompleteSteps = steps.filter(
      step => !userSteps.some(userStep => userStep.step_id === step.id),
    )

    switch (customerType) {
      case DashboardLeadStatus.FRESH_CUSTOMER:
        if (!incompleteSteps[0]) {
          const step = await this.stepControlModel.findOneStepControl(
            {
              provider_id: StepProvider.EXISTING,
              product_id: productData.productID,
            },
            stepControlSelect,
            [{ order: 'asc', column: 'step_order' }],
          )

          return step
        }

        return incompleteSteps[0]

      case DashboardLeadStatus.REJECT:
        return incompleteSteps[0]

      case DashboardLeadStatus.CLOSED:
        if (incompleteSteps[0]) {
          return incompleteSteps[0]
        }

        const step = await this.stepControlModel.findOneStepControl(
          {
            provider_id: StepProvider.REPEAT_CUSTOMER,
            product_id: productData.productID,
          },
          stepControlSelect,
          [{ column: 'step_order', order: 'asc' }],
        )
        return step

      default:
        // DashboardLeadStatus.OTHERS
        if (incompleteSteps[0]) {
          return incompleteSteps[0]
        }

        // Check other steps beside generic now
        // first need to check if person was a repeat customer or not
        const userLastStep = await this.stepTrackerModel
          .StepTrackerKnex()
          .where('customer_id', customerID)
          .andWhere('lead_id', leadID)
          .andWhere('sc.product_id', productData.productID)
          .join('step_control as sc', 'step_tracker.step_id', 'sc.id')
          .orderBy('step_tracker.id', 'desc')
          .first()

        if (userLastStep?.provider_id !== StepProvider.GENERIC) {
          const newSteps = await this.stepControlModel.find({
            where: {
              provider_id: userLastStep.provider_id,
              product_id: productData.productID,
            },
            select: stepControlSelect,
            order: [{ column: 'step_order', order: 'asc' }],
          })

          const newUserSteps = await this.stepTrackerModel.findAll(
            ['*'],
            {
              customer_id: customerID,
              lead_id: leadID,
            },
            [{ order: 'asc', column: 'step_id' }],
          )

          if (!newUserSteps.length) {
            // Fresh user no steps done

            return newSteps[0]
          }

          // check intersection
          const otherIncompleteSteps = newSteps.filter(
            step => !newUserSteps.some(userStep => userStep.step_id === step.id),
          )

          return otherIncompleteSteps[0]
        }
    }
  }

  async checkRepeatCustomerPreviousSteps(
    customerID: number,
    leadID: number,
    product: IProduct,
  ): Promise<ICheckRepeatCustomerPreviousStepsResponse> {
    const response: ICheckRepeatCustomerPreviousStepsResponse = {
      step: null,
      required: false,
    }
    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]

    const stepsToCheck = await this.stepControlModel.find({
      where: {
        product_id: product.productID,
        should_recheck: true,
        is_active: true,
      },
      order: [{ column: 'step_order', order: 'asc' }],
      select: stepControlSelect,
    })

    if (stepsToCheck.length === 0) return response // No need to complete prev step

    const userSteps = await stepTrackerModel
      .StepTrackerKnex()
      .join('step_control as sc', 'step_tracker.step_id', '=', 'sc.id')
      .where('customer_id', customerID)
      .where('sc.should_recheck', true)
      .where('step_tracker.is_skippable', false)
      .select('step_tracker.step_id')

    const incompleteRequiredSteps = stepsToCheck.filter(
      step => !userSteps.some((userStep: IStepTrackerModel) => userStep.step_id === step.id),
    )

    if (incompleteRequiredSteps.length > 0) {
      // If user needs to complete incompleted previous steps

      // 1 . Check if first step is reference details, if it is then, check if approved loan amount is lesser than 26000 then reference detail is not needed

      if (incompleteRequiredSteps[0].step_name === StepName.REFERENCE_DETAILS) {
        const isRequired = await this.checkReferenceRequired(leadID)

        // if true then send this as step, else move on to the next one
        if (isRequired) {
          response.step = incompleteRequiredSteps[0]
          response.required = true
        } else {
          if (incompleteRequiredSteps[1]) {
            response.step = incompleteRequiredSteps[1]
            response.required = true
          }
        }

        return response
      }
      response.step = incompleteRequiredSteps[0]
      response.required = true
    }

    return response
  }

  async checkReferenceRequired(leadID: number) {
    const approval = await this.approvalModel.findOneApproval({ leadID }, ['loanAmtApproved'])

    const { loanAmtApproved } = approval

    if (loanAmtApproved >= 26000) {
      return true
    }

    return false
  }

  async notCompletedSteps(customerID: number, leadID: number) {
    // For now is_completed false can only be finbox
    return (await stepTrackerModel
      .StepTrackerKnex()
      .join('step_control as sc', 'step_tracker.step_id', '=', 'sc.id')
      .where('customer_id', customerID)
      .where('lead_id', leadID)
      .where('is_completed', false)
      .select(
        'sc.id',
        'sc.current_route',
        'sc.next_route',
        'sc.prev_route',
        'sc.product_id',
        'sc.step_order',
        'sc.step_name',
        'sc.provider_id',
        'sc.dashboard_message1',
        'sc.dashboard_message2',
        'sc.dashboard_message3',
        'sc.dashboard_message4',
      )
      .orderBy('sc.step_order', 'asc')) as IStepControlModel[]
  }

  async getStepProgress(customerID: number, leadID?: number) {
    let lead: ILead
    let stepProvider = StepProvider.EXISTING
    let userSteps: Knex.QueryBuilder

    if (leadID) {
      lead = await this.leadModel.findOne({
        where: { leadID },
        select: ['status', 'fbLeads'],
      })

      stepProvider =
        lead?.fbLeads === 'Repeat Case' || lead?.fbLeads === 'Existing Case'
          ? StepProvider.REPEAT_CUSTOMER
          : StepProvider.EXISTING
    }

    const getStepForUser: IStepControlModel[] = await this.stepControlModel
      .Knex()
      .select('id', 'step_order', 'step_name')
      .where(knex => {
        knex.where('provider_id', StepProvider.GENERIC)
        knex.orWhere('provider_id', stepProvider)
      })
      .orderBy('step_order', 'asc')

    userSteps = this.stepTrackerModel
      .StepTrackerKnex()
      .select('step_id', 'lead_ID', 'customer_id', 'sc.step_order')
      .join('step_control as sc', 'step_tracker.step_id', '=', 'sc.id')

    if (leadID) {
      userSteps.where(function () {
        this.where({ lead_id: leadID, customer_id: customerID }).orWhere(function () {
          this.where({ customer_id: customerID }).whereNull('lead_id')
        })
      })
    } else {
      userSteps.where({ customer_id: customerID }).whereNull('lead_id')
    }

    const userStepsData: IStepTrackerModel[] = await userSteps.orderBy('sc.step_order', 'asc')

    const completionPercentage = Math.round((userStepsData.length / getStepForUser.length) * 100)

    return completionPercentage
  }

  async checkBankListOnAppClose(customerID: number, accountID: number) {
    // 1. If customer Account exist from accountID sent

    // 2. Now check if customer has done this step or not

    const stepControlSelect: Array<keyof IStepControlModel> = [
      'id',
      'current_route',
      'next_route',
      'prev_route',
      'product_id',
      'step_order',
      'step_name',
      'provider_id',
      'dashboard_message1',
      'dashboard_message2',
      'dashboard_message3',
      'dashboard_message4',
    ]

    const bankConfirmStep = await this.stepControlModel.findOne({
      where: {
        step_name: StepName.BANK_ACCOUNT_CONFIRMATION,
        provider_id: StepProvider.EXISTING,
        is_active: true,
      },
      select: stepControlSelect,
    })

    if (!bankConfirmStep) {
      logger.error('Next Step: Bank Confirm step not found')
      return null
    }

    if (!accountID && bankConfirmStep) {
      logger.warn('Next Step: Bank Confirm step needs to be done, Account ID not found')

      return bankConfirmStep
    }

    const customerAccount = await this.customerAccountModel.count({
      customerID,
      accountID,
    })

    const userStep = await this.stepTrackerModel.count({
      customer_id: customerID,
      step_id: bankConfirmStep.id,
    })

    // If step is done, then no need to show
    if (userStep) return null

    // If customer account found then proceed

    if (customerAccount) {
      logger.warn('Next Step: CustomerAccount found, no need to do bank view page')
      return null
    }

    return bankConfirmStep
  }

  async checkReKycNeeded(customerID: number) {
    let shouldReKyc = false
    let step = {
      id: 0,
      current_route: '/pan-not-linked',
      next_route: null,
      prev_route: null,
      product_id: null,
      step_order: null,
      step_name: 'PAN_REVERIFY',
      provider_id: 'Generic',
      dashboard_message1: 'It appears that your PAN and Aadhaar are not currently linked.',
      dashboard_message2: 'Sorry, we couldn`t recognize your KYC details.',
      dashboard_message3: 'Re-verify',
      dashboard_message4: '',
    }

    let returnData = {
      step: null,
      shouldReKyc,
    }
    const customer = await customerModel.findOneCustomer({ customerID }, [
      'customerID',
      'dob_digit_match',
      'is_dob_match',
      'is_pan_aadhar_linked',
    ])

    // if (customer.dob_digit_match === '0') {
    //   returnData.shouldReKyc = true
    //   returnData.step = step
    // } else if (customer.is_dob_match === 'No') {
    //   returnData.shouldReKyc = true
    //   returnData.step = step
    // } else

    if (customer.is_pan_aadhar_linked === 'No') {
      returnData.shouldReKyc = true
      returnData.step = step
    }

    return returnData
  }
}

export const stepService = new StepService()
