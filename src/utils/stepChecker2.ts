import { leadModel } from '@/database/mysql/leads'
import { productModel } from '@/database/mysql/product'
import { stepControlModel } from '@/database/mysql/step-control'
import { stepTrackerModel } from '@/database/mysql/step_tracker'
import { StepName } from '@/enums/common.enum'
import { DashboardLeadStatus, LeadStatus } from '@/enums/lead.enum'
import { Products } from '@/enums/product.enum'
import { StepProvider } from '@/enums/step.enum'
import { FaultyStepError, NotFoundError } from '@/errors'
import { ILead } from '@/interfaces/lead.interface'
import { IStepControlModel } from '@/interfaces/step-control.interface'
import { approvalService } from '@/services/approval.service'
import { leadService } from '@/services/lead.service'
import { checkValidLead } from '@/utils/util'

export const stepCheckHelper = async (
  customerID: number,
  leadID: number,
  stepName: StepName,
  product: Products,
) => {
  const lead = await leadModel.findOne({
    where: { customerID },
    order: [{ column: 'leadID', order: 'desc' }],
    select: ['leadID', 'status'],
  })

  const isApproval = await approvalService.checkCustomerApproval(
    customerID,
    lead,
  )

  if (isApproval) return true

  const result = await handleCustomers(
    customerID,
    stepName,
    product,
    lead,
    leadID,
  )

  if (!result) throw new FaultyStepError('Not Allowed')

  return true

  // Check case for the user who does not have lead created, might be trying to access a generic step or is a new user
}

const handleCustomers = async (
  customerID: number,
  stepName: StepName,
  product: Products,
  lead?: ILead,
  leadId?: number,
) => {
  if (!lead) {
    return await handleNewCustomer(customerID, stepName, product)
  }

  const { status, leadID } = lead

  let customerType: string
  let isRejected = true

  // Check if latest lead or not
  const isValidLead = checkValidLead(lead, leadId)

  if (!isValidLead) return false

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

      return await handleRejectedCustomer(
        customerID,
        leadID,
        isRejected,
        stepName,
        product,
        lead,
      )

    case LeadStatus.CLOSED:
      customerType = DashboardLeadStatus.CLOSED
      return await handleClosedCustomer(customerID, leadID, stepName, product)

    default:
      return await handleOtherCustomers(customerID, lead, stepName, product)
  }
}

const handleNewCustomer = async (
  customerID: number,
  stepName: StepName,
  product: Products,
) => {
  // if new Customer, no lead generated check that the step user is trying to access is accessible to them or not
  const productData = await productModel.findOne({ name: product }, [
    'productID',
  ])

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
  ]

  const sentStep = await stepControlModel.findOneStepControl(
    {
      step_name: stepName,
      product_id: productData.productID,
      is_active: true,
    },
    stepControlSelect,
  )

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
    (step) =>
      !userStepsGeneric.some((userStep) => userStep.step_id === step.id),
  )

  // The step sent was a generic step and user needs to complete this, let them do it

  if (
    incompleteGenericSteps[0] &&
    incompleteGenericSteps[0]?.id === sentStep.id
  ) {
    return true
  }

  // No steps were incomplete, customer can perform 1st existing customer step

  const existingCustomerFirstStep = await stepControlModel.findOne({
    where: {
      product_id: productData.productID,
      provider_id: StepProvider.EXISTING,
      is_active: true,
    },
    order: [{ column: 'step_order', order: 'asc' }],
  })

  if (existingCustomerFirstStep.id === sentStep.id) {
    return true
  }

  // TODO: User might be accessing old completed generic step
  // ! Not to handle,they can't redo prev steps

  return false
}

const handleRejectedCustomer = async (
  customerID: number,
  leadID: number,
  isRejected: boolean,
  stepName: StepName,
  product: Products,
  lead: ILead,
) => {
  // Check for 45 days

  if (isRejected) return false
  // Find if user has completed generic steps or not

  const productData = await productModel.findOne({ name: product }, [
    'productID',
  ])

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
  ]

  const sentStep = await stepControlModel.findOneStepControl(
    {
      step_name: stepName,
      product_id: productData.productID,
      is_active: true,
    },
    stepControlSelect,
  )

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
    (step) =>
      !userStepsGeneric.some((userStep) => userStep.step_id === step.id),
  )

  // The step sent was a generic step and user needs to complete this, let them do it

  if (
    incompleteGenericSteps[0] &&
    incompleteGenericSteps[0]?.id === sentStep.id
  ) {
    return true
  }

  // No steps were incomplete, customer can perform 1st existing/repeat customer step
  // approval check

  const isApproval = await approvalService.checkCustomerApproval(
    customerID,
    lead,
  )
  // if isApproval = true, start from 1_page flow, else new/existing flow

  const firstStep = await stepControlModel.findOne({
    where: {
      product_id: productData.productID,
      provider_id: isApproval
        ? StepProvider.REPEAT_CUSTOMER
        : StepProvider.EXISTING,
      is_active: true,
    },
    order: [{ column: 'step_order', order: 'asc' }],
    select: stepControlSelect,
  })

  if (firstStep.id === sentStep.id) {
    return true
  }

  return false
}

const handleClosedCustomer = async (
  customerID: number,
  leadID: number,
  stepName: StepName,
  product: Products,
) => {
  const productData = await productModel.findOne({ name: product }, [
    'productID',
  ])

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
  ]

  const sentStep = await stepControlModel.findOneStepControl(
    {
      step_name: stepName,
      product_id: productData.productID,
      is_active: true,
    },
    stepControlSelect,
  )

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
    (step) =>
      !userStepsGeneric.some((userStep) => userStep.step_id === step.id),
  )

  // The step sent was a generic step and user needs to complete this, let them do it

  if (
    incompleteGenericSteps[0] &&
    incompleteGenericSteps[0]?.id === sentStep.id
  ) {
    return true
  }

  // No steps were incomplete, customer can perform 1st repeat_customer step
  // Because after first step complete, new leadId will be generated for user

  const existingCustomerFirstStep = await stepControlModel.findOne({
    where: {
      product_id: productData.productID,
      provider_id: StepProvider.REPEAT_CUSTOMER,
      is_active: true,
    },
    order: [{ column: 'step_order', order: 'asc' }],
    select: stepControlSelect,
  })

  if (existingCustomerFirstStep.id === sentStep.id) {
    return true
  }

  return false
}

const handleIncompleteAndNextSteps = async (
  customerID: number,
  leadID: number,
  stepName: StepName,
  product: Products,
) => {
  // Find if user has completed generic steps or not

  const productData = await productModel.findOne({ name: product }, [
    'productID',
  ])

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
  ]

  const sentStep = await stepControlModel.findOneStepControl(
    {
      step_name: stepName,
      product_id: productData.productID,
      is_active: true,
    },
    stepControlSelect,
  )

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
    (step) =>
      !userStepsGeneric.some((userStep) => userStep.step_id === step.id),
  )

  // The step sent was a generic step and user needs to complete this, let them do it

  if (
    incompleteGenericSteps[0] &&
    incompleteGenericSteps[0]?.id === sentStep.id
  ) {
    return true
  }

  // No steps were incomplete, customer can perform 1st existing/repeat customer step
  // approval check

  const providerId = await approvalService.checkRepeatFlowOrNew(
    customerID,
    leadID,
  )

  // if isApproval = true, start from 1_page flow, else new/existing flow

  const stepsForCustomer = await stepControlModel.find({
    where: {
      product_id: productData.productID,
      provider_id: providerId,
      is_active: true,
    },
    order: [{ column: 'step_order', order: 'asc' }],
    select: stepControlSelect,
  })

  // Now find customer existing non generic steps

  const customerCompletedSteps = await stepTrackerModel.find({
    where: { customer_id: customerID, lead_id: leadID, is_completed: true },
    order: [{ order: 'asc', column: 'step_id' }],
  })

  const incompleteNonGenericSteps = stepsForCustomer.filter(
    (step) =>
      !customerCompletedSteps.some((userStep) => userStep.step_id === step.id),
  )

  if (
    incompleteNonGenericSteps[0] &&
    incompleteNonGenericSteps[0]?.id === sentStep.id
  ) {
    return true
  }

  // If user has already completed the step, they can reporform it

  // ! OLD
  // const isCompleted = stepsForCustomer.some((step) =>
  //   customerCompletedSteps.some(
  //     (userStep) => userStep.step_id === step.id && userStep.is_completed,
  //   ),
  // )

  // ! Fixed
  const isCompleted = customerCompletedSteps.some(
    (userStep) => userStep.step_id === sentStep.id && userStep.is_completed,
  )

  if (isCompleted) return true

  return false
}

const handleOtherCustomers = async (
  customerID: number,
  lead: ILead,
  stepName: StepName,
  product: Products,
) => {
  const { status, leadID } = lead

  switch (status) {
    case LeadStatus.DOCUMENT_RECEIVED:
    case LeadStatus.DISBURSAL_SHEET_SEND:
    case LeadStatus.FRESH_LEAD:
    case LeadStatus.APPROVED:
      // User cannot hit any API at this point
      return false

    case LeadStatus.NOT_INTERESTED:
    case LeadStatus.NOT_REQUIRED:
    case LeadStatus.NOT_REQUIRED_PROCESS:
    case LeadStatus.DUPLICATE:
      // same flow as rejected for step checking but without 45 days check
      return await handleRejectedCustomer(
        customerID,
        leadID,
        false,
        stepName,
        product,
        lead,
      )

    // Steps not required here
    case LeadStatus.HOLD:
    case LeadStatus.HOLD_PROCESS:
    case LeadStatus.SETTLEMENT:
    case LeadStatus.BLACK_LISTED:
    case LeadStatus.DISBURSED:
    case LeadStatus.PART_PAYMENT:
      return false

    case LeadStatus.INCOMPLETE_USER:
    case LeadStatus.APPROVED_PROCESS:
      // TODO : Handle
      return await handleIncompleteAndNextSteps(
        customerID,
        leadID,
        stepName,
        product,
      )

    case LeadStatus.CALLBACK:
    case LeadStatus.INTERESTED:
    case LeadStatus.NO_ANSWER:
    case LeadStatus.INCOMPLETE_DOCUMENTS:
    case LeadStatus.DNC:
      // TODO : Handle
      return await handleIncompleteAndNextSteps(
        customerID,
        leadID,
        stepName,
        product,
      )

    default:
      return await handleIncompleteAndNextSteps(
        customerID,
        leadID,
        stepName,
        product,
      )
  }
}

const genericStepCheck = async (
  customerID: number,
  stepName: StepName,
  product: Products,
) => {
  const productData = await productModel.findOne({ name: product }, [
    'productID',
  ])

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
  ]

  const sentStep = await stepControlModel.findOneStepControl(
    {
      step_name: stepName,
      product_id: productData.productID,
      is_active: true,
    },
    stepControlSelect,
  )

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
    (step) =>
      !userStepsGeneric.some((userStep) => userStep.step_id === step.id),
  )

  // The step sent was a generic step and user needs to complete this, let them do it

  if (
    incompleteGenericSteps[0] &&
    incompleteGenericSteps[0]?.id === sentStep.id
  ) {
    return true
  }

  return false
}
