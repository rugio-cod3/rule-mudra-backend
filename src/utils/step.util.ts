import { addressModel } from '@/database/mysql/address'
import { approvalModel } from '@/database/mysql/approval'
import { customerModel } from '@/database/mysql/customer'
import { customerAccountModel } from '@/database/mysql/customerAccount'
import { documentFinboxmodel } from '@/database/mysql/documentFinbox'
import { employerModel } from '@/database/mysql/employer'
import { leadModel } from '@/database/mysql/leads'
import { leadsApiLogModel } from '@/database/mysql/lead_api_log'
import { pennyDropModel } from '@/database/mysql/penny_drop'
import { razorpayMandateModel } from '@/database/mysql/razorpay_mandate'
import { referenceModel } from '@/database/mysql/reference'
import { stepControlModel } from '@/database/mysql/step-control'
import { stepTrackerModel } from '@/database/mysql/step_tracker'
import { ApiSupplierType, StepName } from '@/enums/common.enum'
import { LeadStatus, LeadType } from '@/enums/lead.enum'
import { LeadLogApiType } from '@/enums/leadLog.enum'
import { PennyStatus } from '@/enums/penny_drop.enum'
import { StepProvider } from '@/enums/step.enum'
import { ILead } from '@/interfaces/lead.interface'
import { PennyDropNameMatchStatus } from '@/interfaces/penny_drop.interface'
import { IStepTrackerModel } from '@/interfaces/step-tracker'

export const handlePhpCustomers = async (
  customerID: number,
  leadID?: number,
) => {
  let isOldCustomer = false
  let lead: ILead

  // Check if customer step entry exists or not
  const stepTracker = await stepTrackerModel.findOneStepTracker(
    { customer_id: customerID },
    ['id'],
  )

  // If entry does not exist then we know that this is an old customer
  if (!stepTracker) {
    isOldCustomer = true
  }

  if (!isOldCustomer) return

  if (leadID) {
    lead = await leadModel.findOne({
      where: { leadID },
      select: [
        'leadID',
        'status',
        'purpose',
        'loanRequeried',
        'salaryMode',
        'monthlyIncome',
        'kfs',
        'kfs_ip',
        'fbLeads',
      ],
    })
  }

  if (!leadID || !lead) return // only condition for repeat case

  let finboxQuery
  if (
    lead.status === LeadStatus.FRESH_LEAD &&
    lead.fbLeads === LeadType.EXISTING_CASE
  ) {
    finboxQuery = { leadID }
  } else {
    finboxQuery = { customerID }
  }

  const [
    customer,
    employerCount,
    addressCount,
    referenceCount,
    custAcntCount,
    rpay,
    pennyDropCount,
    finboxCount,
  ] = await Promise.all([
    customerModel.findOneCustomer({ customerID }, [
      'customerID',
      'aadharNo',
      'pancard',
      'mobile',
      'gender',
      'marrital',
      'employeeType',
      'salary_date',
      'industry',
      'designation',
      'emandate_required',
      'name',
      'pan_cust_verified',
      'education',
      'dob_digit_match',
    ]),
    employerModel.count({ where: { customerID } }),
    addressModel.count({ where: { customerID } }),
    referenceModel.count({ where: { customerID } }),
    customerAccountModel.count({ customerID }),
    razorpayMandateModel.RpayMandateKnex.where({
      customerID: String(customerID),
    })
      .andWhereRaw("LOWER(status) = 'paid'")
      .count(),
    pennyDropModel.count({
      where: {
        penny_status: PennyStatus.COMPLETED,
        penny_drop_name_match: PennyDropNameMatchStatus.ACCEPTED,
        customerID: String(customerID),
      },
    }),
    documentFinboxmodel.count({
      where: finboxQuery,
    }),
  ])

  const {
    mobile,
    aadharNo,
    gender,
    marrital,
    employeeType,
    salary_date,
    industry,
    designation,
    emandate_required,
    name,
    pan_cust_verified,
    education,
    dob_digit_match,
  } = customer
  const { purpose, loanRequeried, salaryMode, monthlyIncome, kfs, kfs_ip } =
    lead ?? {}

  // Now start saving completed step:
  const stepSaveData: IStepTrackerModel[] = []
  const stepNames: StepName[] = []

  // ! Generic Steps
  // 1. Name and Email

  const repeat = true

  if (pan_cust_verified == 1 && name) {
    // Complete name step
    stepNames.push(StepName.NAME_AND_EMAIL)
  }

  // 2. PAN

  if (pan_cust_verified == 1) {
    // SAVE PAN step - verify and confirm
    stepNames.push(StepName.PAN_VERIFICATION, StepName.PAN_CONFIRMATION)
  }

  const aadharExists = await leadsApiLogModel.count({
    where: {
      status: 1,
      api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
      api_supplier: ApiSupplierType.SUREPASS,
      aadharNo: String(aadharNo),
      mobile_no: String(mobile),
    },
  })

  const digilockerExists = await leadsApiLogModel.count({
    where: {
      status: 1,
      api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
      api_supplier: ApiSupplierType.DECENTRO,
      mobile_no: String(mobile),
    },
  })

  if (aadharExists || digilockerExists || dob_digit_match == '1') {
    // Save AADHAR Step
    stepNames.push(StepName.AADHAR_CONFIRMATION)
  }

  // ! If aadhar does not exist then check digilocker aadhar exists or not
  // if (!aadharExists) {
  //   const digilockerExists = await leadsApiLogModel.count({
  //     where: {
  //       status: 1,
  //       api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
  //       api_supplier: ApiSupplierType.DECENTRO,
  //       mobile_no: String(mobile),
  //     },
  //   })

  //   if (digilockerExists) {
  //     // Save AADHAR Step
  //     stepNames.push(StepName.AADHAR_CONFIRMATION)
  //   }
  // }

  if (!repeat) {
    // ! Start saving with Lead ID

    if (purpose) {
      // Save Loan purpose step
      stepNames.push(StepName.LOAN_PURPOSE)
    }

    if (loanRequeried > 999) {
      // ! default value 10000, change to 10

      // Save Loan Amount step
      stepNames.push(StepName.LOAN_AMOUNT)
    }

    if (gender !== 'NA') {
      // Save gender step
      stepNames.push(StepName.GENDER)
    }

    if (marrital) {
      // Save marrital step
      stepNames.push(StepName.MARITAL_STATUS)
    }

    if (education) {
      // Save marrital step
      stepNames.push(StepName.HIGHEST_EDUCATION)
    }

    if (employeeType !== 'Not Employed') {
      // ! employeeType has default value of "Not Employeed"

      // Save Employment Details step
      stepNames.push(StepName.EMPLOYMENT_DETAILS)
    }

    if (salaryMode) {
      // Save Mode Of Payment step
      stepNames.push(StepName.MODE_OF_PAYMENT)
    }

    if (employerCount) {
      // Save Company Name step
      // Save work experience Step
      stepNames.push(StepName.COMPANY_NAME, StepName.WORK_EXPERIENCE)
    }

    if (industry) {
      // Save Industry step -> in customer table
      stepNames.push(StepName.INDUSTRY)
    }

    if (designation) {
      // Save Designation step
      stepNames.push(StepName.DESIGNATION)
    }

    if (monthlyIncome) {
      // Save Monthly Income step
      stepNames.push(StepName.MONTHLY_INCOME)
    }

    if (salary_date) {
      // Save salary date step
      stepNames.push(StepName.SALARY_DATE)
    }

    if (addressCount) {
      // address gets saved at time of pan and aadhar
      // Save residence & address step
      stepNames.push(StepName.RESIDENCE_TYPE, StepName.ADDRESS_CONFIRMATION)
    }
  }

  // !!!!!!!!! Done Till Incomplete Details step

  // Finbox -> customer.document_recieved

  // Important Steps for Repeat Case
  if (leadID) {
    const approvalExists = await approvalModel.findOneApproval({
      customerID,
      leadID,
    })

    if (finboxCount) {
      stepNames.push(StepName.FINBOX)
    } else {
      if (approvalExists) stepNames.push(StepName.FINBOX)
    }

    // ! If finbox not done, then check if entry in approval table, if yes, make skippable true entry for finbox

    if (referenceCount) {
      // Save reference step
      stepNames.push(StepName.REFERENCE_DETAILS)
    }

    const selfieStepCheck = await leadsApiLogModel.findOneLeadsApiLog(
      {
        api_type: 'face-match',
        api_supplier: 5,
        status: 1,
        mobile_no: String(mobile),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    )

    if (selfieStepCheck) {
      // Save selfie step
      if (selfieStepCheck.api_response) {
        const resp = JSON.parse(selfieStepCheck.api_response)

        if (
          resp?.result?.is_same_face &&
          resp?.result?.person_image_correctly_identified
        ) {
          stepNames.push(StepName.SELFIE_VERIFICATION)
        }
      }
    }

    if (custAcntCount) {
      // Save Bank Details step
      stepNames.push(StepName.BANK_DETAILS)
    }

    if (rpay[0]['count(*)']) {
      // Ya fir at least one entry && emandate_required ==== "1"(rpay.status === "issued")
      // Save Emandate step

      stepNames.push(StepName.EMANDATE)
    } else if (emandate_required === '1') {
      const rpayIssued = razorpayMandateModel.RpayMandateKnex.where({
        customerID: String(customerID),
      })
        .andWhereRaw("LOWER(status) = 'issued'")
        .count()

      if (rpayIssued) stepNames.push(StepName.EMANDATE)
    }

    if (pennyDropCount) {
      // Save penny drop step
      stepNames.push(StepName.PENNY_DROP)
    }

    if (kfs === '1' && kfs_ip) {
      // KFS Done
      stepNames.push(StepName.KFS)
    }
  }

  const completedStepData = await stepControlModel.find({
    whereIn: [
      { column: 'step_name', value: stepNames },
      {
        column: 'provider_id',
        value: [StepProvider.EXISTING, StepProvider.GENERIC],
      },
    ],
    order: [{ column: 'step_order', order: 'asc' }],
    select: ['id', 'step_order', 'step_name', 'provider_id'],
  })

  // Batch insert

  if (completedStepData.length > 0) {
    for await (let step of completedStepData) {
      if (step.provider_id === StepProvider.GENERIC) {
        stepSaveData.push({
          customer_id: customerID,
          step_id: step.id,
          is_completed: true,
        })
      } else {
        stepSaveData.push({
          customer_id: customerID,
          step_id: step.id,
          lead_id: leadID,
          is_completed: true,
        })
      }
    }

    await stepTrackerModel.StepTrackerKnex().insert(stepSaveData)
  }
}
