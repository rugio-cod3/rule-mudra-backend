import moment from 'moment-timezone'
import { leadsApiLogModel } from '../database/mysql/leadApiLogs'
import { NameMatchType } from '../enums/finbox.enum'
import { ApiSupplierType, LeadLogApiType } from '../enums/leadApiLogs.enum'
import { CommonNameMatchType, NameSimilarityStatus } from '../enums/nameMatch.enum'
import {
  ICheckNamePercentage,
  INameMatchBaseData,
  INameMatchPayload,
} from '../interfaces/nameMatch.interface'
import { IDecentroEaadharResponse } from '../interfaces/thirdParty/decentro.interface'
import {
  ISurePassValidatePanResponse,
  ISurePassVerifyAadharResponse,
} from '../interfaces/thirdParty/surepass.interface'
import FinboxService from '../services/thirdParty/finbox.service'
import { logger } from './logger'

const findBoxService = new FinboxService()

export const nameMatch = async <T extends INameMatchBaseData>(payload: INameMatchPayload<T>) => {
  const { type, data } = payload

  switch (type) {
    case CommonNameMatchType.PENNY_DROP:
      let isNameMatched = false
      // Start name match flow, Prefer PAN

      const panDetails = data.pancard
        ? await leadsApiLogModel.findPanComprehensiveResponse(data.pancard, String(data.mobile))
        : null

      // If pan details exist , start pan name match flow
      if (panDetails && panDetails?.full_name) {
        const nameMatch = await findBoxService.checkNamePercentageByRajatApi({
          customerID: data.customerID,
          leadId: data.leadID,
          customerMobileNo: data.mobile,
          secondName: panDetails.full_name,
          firstName: data.name,
          type: NameMatchType.PENNY_DROP_PAN,
        })

        if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
          return nameMatch
        }
      }
      // Now check if nameMatch is false only then do this logic
      // Check if Aadhar is of surepass or digilocker
      // We can do this by checking

      if (!isNameMatched) {
        // Digilocker case

        if (data.aadharNo) {
          const aadharData = await leadsApiLogModel.getUserAadharDetails(
            data.aadharNo,
            String(data.mobile),
            true,
          )

          if (aadharData) {
            const nameMatch = await findBoxService.checkNamePercentageByRajatApi({
              customerID: data.customerID,
              leadId: data.leadID,
              customerMobileNo: data.mobile,
              secondName:
                aadharData.type === ApiSupplierType.SUREPASS
                  ? aadharData?.data?.full_name ?? ''
                  : aadharData?.data?.proofOfIdentity?.name ?? '',
              firstName: data.name,
              type: NameMatchType.PENNY_DROP_AADHAR,
            })

            if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
              isNameMatched = true
            }

            return nameMatch
          } else {
            // Check digilocker
            const digilockerAadhar = await leadsApiLogModel.findOneLeadsApiLog(
              {
                status: 1,
                api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                api_supplier: ApiSupplierType.DECENTRO,
                mobile_no: String(data.mobile),
              },
              ['api_response'],
              [{ column: 'id', order: 'desc' }],
            )

            if (digilockerAadhar && digilockerAadhar?.api_response) {
              const digilocker = <IDecentroEaadharResponse['data']>(
                JSON.parse(digilockerAadhar.api_response).data
              )

              const nameMatch = await findBoxService.checkNamePercentageByRajatApi({
                customerID: data.customerID,
                leadId: data.leadID,
                customerMobileNo: data.mobile,
                secondName: digilocker?.proofOfIdentity?.name ?? '',
                firstName: data.name,
                type: NameMatchType.PENNY_DROP_AADHAR,
              })

              if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
                isNameMatched = true
              }

              return nameMatch
            }
          }
        } else {
          // Else if aadharNo not in customer Table then user must be digilocker
          const digilockerAadhar = await leadsApiLogModel.findOneLeadsApiLog(
            {
              status: 1,
              api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
              api_supplier: ApiSupplierType.DECENTRO,
              mobile_no: String(data.mobile),
            },
            ['api_response'],
            [{ column: 'id', order: 'desc' }],
          )

          if (digilockerAadhar && digilockerAadhar?.api_response) {
            const digilocker = <IDecentroEaadharResponse['data']>(
              JSON.parse(digilockerAadhar.api_response).data
            )

            const nameMatch = await findBoxService.checkNamePercentageByRajatApi({
              customerID: data.customerID,
              leadId: data.leadID,
              customerMobileNo: data.mobile,
              secondName: digilocker?.proofOfIdentity?.name ?? '',
              firstName: data.name,
              type: NameMatchType.PENNY_DROP_AADHAR,
            })

            if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
              isNameMatched = true
            }

            return nameMatch
          }
        }
      }
      break

    case CommonNameMatchType.BANK_NAME:
      const panDetailsForBank = data.pancard
        ? await leadsApiLogModel.findPanComprehensiveResponse(data.pancard, data.mobile)
        : null
      // If pan details exist , start pan name match flow
      if (panDetailsForBank && panDetailsForBank?.full_name) {
        const nameMatch = await findBoxService.checkNamePercentageByRajatApi({
          customerID: data.customerID,
          leadId: data.leadID,
          customerMobileNo: data.mobile,
          secondName: panDetailsForBank.full_name,
          firstName: data.name,
          type: NameMatchType.BANK_NAME_PAN,
        })
        if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
          isNameMatched = true
        }
      }
      // Now check if nameMatch is false only then do this logic
      // Check if Aadhar is of surepass or digilocker
      // We can do this by checking
      if (!isNameMatched) {
        if (data.aadharNo) {
          const aadharData = await leadsApiLogModel.getUserAadharDetails(
            data.aadharNo,
            String(data.mobile),
            true,
          )
          if (aadharData) {
            const nameMatch = await findBoxService.checkNamePercentageByRajatApi({
              customerID: data.customerID,
              leadId: data.leadID,
              customerMobileNo: data.mobile,
              secondName:
                aadharData.type === ApiSupplierType.SUREPASS
                  ? aadharData?.data?.full_name ?? ''
                  : aadharData?.data?.proofOfIdentity?.name ?? '',
              firstName: data.name,
              type: NameMatchType.BANK_NAME_AADHAR,
            })

            if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
              isNameMatched = true
            }

            return nameMatch
          } else {
            const digilockerAadhar = await leadsApiLogModel.findOneLeadsApiLog(
              {
                status: 1,
                api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                api_supplier: ApiSupplierType.DECENTRO,
                mobile_no: String(data.mobile),
              },
              ['api_response'],
              [{ column: 'id', order: 'desc' }],
            )
            if (digilockerAadhar && digilockerAadhar?.api_response) {
              const digilocker = <IDecentroEaadharResponse['data']>(
                JSON.parse(digilockerAadhar.api_response).data
              )
              const nameMatch = await findBoxService.checkNamePercentageByRajatApi({
                customerID: data.customerID,
                leadId: data.leadID,
                customerMobileNo: data.mobile,
                secondName: digilocker.proofOfIdentity.name ?? '',
                firstName: data.name,
                type: NameMatchType.BANK_NAME_AADHAR,
              })
              if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
                isNameMatched = true
              }
              return nameMatch
            }
          }
        } else {
          // Else if aadharNo not in customer Table then user must be digilocker
          const digilockerAadhar = await leadsApiLogModel.findOneLeadsApiLog(
            {
              status: 1,
              api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
              api_supplier: ApiSupplierType.DECENTRO,
              mobile_no: String(data.mobile),
            },
            ['api_response'],
            [{ column: 'id', order: 'desc' }],
          )
          if (digilockerAadhar && digilockerAadhar?.api_response) {
            const digilocker = <IDecentroEaadharResponse['data']>(
              JSON.parse(digilockerAadhar.api_response).data
            )
            const nameMatch = await findBoxService.checkNamePercentageByRajatApi({
              customerID: data.customerID,
              leadId: data.leadID,
              customerMobileNo: data.mobile,
              secondName: digilocker.proofOfIdentity.name ?? '',
              firstName: data.name,
              type: NameMatchType.BANK_NAME_AADHAR,
            })
            if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
              isNameMatched = true
            }
            return nameMatch
          }
        }
      }
      break

    case CommonNameMatchType.FINBOX:
      const finboxNameMatchObj: ICheckNamePercentage = {
        leadId: data.leadID || 0,
        customerID: data.customerID || 0,
        customerMobileNo: data.mobile || '0',
        type: data.nameMatchType,
        firstName: data.bankConnectName,
        secondName: data.name,
      }
      return await findBoxService.checkNamePercentageByRajatApi(finboxNameMatchObj)

    case CommonNameMatchType.KYC:
      return await onboardAadharPanMatch(data.mobile, data.customerID)
  }
}

export async function onboardAadharPanMatch(
  mobileNo: string,
  customerID: number,
): Promise<{
  dobMatch: number
  nameMatch: number
  lastDigitsMatch: number
  aadharNo?: string
  isSurePassAadhar?: boolean
  surePassAadharData: ISurePassVerifyAadharResponse['data']
  digilockerAadharData: IDecentroEaadharResponse['data']
  aadharExistsInPan: boolean
}> {
  // Find aadhar and pan details from lead log
  let isSurePassAadhar = true

  const matches = {
    dobMatch: 0,
    nameMatch: 0,
    lastDigitsMatch: 0,
    aadharNo: 'XXXXXXXXXXXX',
    isSurePassAadhar: true,
    surePassAadharData: null,
    digilockerAadharData: null,
    aadharExistsInPan: true,
  }

  const [panDetails, aadhaarDetails, aadhaarDetailsDigilocker] = await Promise.all([
    leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
        api_supplier: ApiSupplierType.SUREPASS,
        mobile_no: mobileNo,
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    ),
    leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
        api_supplier: ApiSupplierType.SUREPASS,
        mobile_no: String(mobileNo),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    ),
    leadsApiLogModel.findOneLeadsApiLog(
      {
        status: 1,
        api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
        api_supplier: ApiSupplierType.DECENTRO,
        mobile_no: String(mobileNo),
      },
      ['api_response'],
      [{ column: 'id', order: 'desc' }],
    ),
  ])

  if (!panDetails) {
    logger.warn(
      "Error in pan-aadhar match: Pan/Aadhar details don't exist in lead_log table for mobileNo: " +
        mobileNo,
    )
    return matches
  }

  if (!aadhaarDetails && !aadhaarDetailsDigilocker) {
    logger.warn(
      "Error in pan-aadhar match: Pan/Aadhar details don't exist in lead_log table for mobileNo: " +
        mobileNo,
    )
    return matches
  }

  if (!panDetails?.api_response) {
    logger.warn(
      "Error in pan-aadhar match: Pan/Aadhar api_response details don't exist in lead_log table for mobileNo: " +
        mobileNo,
    )

    return matches
  }

  if (!aadhaarDetails?.api_response && !aadhaarDetailsDigilocker?.api_response) {
    logger.warn(
      "Error in pan-aadhar match: Pan/Aadhar api_response details don't exist in lead_log table for mobileNo: " +
        mobileNo,
    )

    return matches
  }

  // Check which aadhar details exist

  if (!aadhaarDetails) {
    // This means aadharDigiLocker data exist
    isSurePassAadhar = false
  }

  // If both aadhar details - surepass and digilocker exist, choose the latest entry
  if (aadhaarDetails && aadhaarDetailsDigilocker) {
    if (aadhaarDetails.id < aadhaarDetailsDigilocker.id) {
      isSurePassAadhar = false
    }
    // else true, surepass wins
  }

  const panResponse = <ISurePassValidatePanResponse['data']>JSON.parse(panDetails.api_response).data

  const { full_name: panFullName, dob: panDob, masked_aadhaar: panMaskedAadharNo } = panResponse

  // ! If aadhar not linked with pan / masked aadhar does not exist
  if (!panMaskedAadharNo) {
    matches.aadharExistsInPan = false
  }

  if (isSurePassAadhar) {
    const aadarResponse = <ISurePassVerifyAadharResponse['data']>(
      JSON.parse(aadhaarDetails.api_response).data
    )
    const { full_name: aadharFullName, dob: aadharDob, aadhaar_number: aadharNo } = aadarResponse

    let panAadhar = panMaskedAadharNo.slice(-4)
    let lastFourDigitsAadhar = aadharNo.slice(-4)

    // lastDIgitsMatch type = panLastDigit - aadharLastDigit
    const [nameMatch, dobMatch, lastDigitsMatch] = await Promise.all([
      await findBoxService.checkNamePercentageByRajatApi({
        firstName: panFullName,
        secondName: aadharFullName,
        type: 'pan - aadhar',
        leadId: 0,
        customerID,
        customerMobileNo: mobileNo,
      }),
      await findBoxService.checkNamePercentage({
        firstName: panDob,
        secondName: aadharDob,
        type: 'panDOB - aadharDOB',
        leadId: 0,
        customerID,
        customerMobileNo: mobileNo,
      }),
      await findBoxService.checkNamePercentage({
        firstName: panAadhar,
        secondName: lastFourDigitsAadhar,
        type: 'panLastDigit - aadharLastDigit',
        leadId: 0,
        customerID,
        customerMobileNo: mobileNo,
      }),
    ])

    matches.nameMatch = nameMatch.percentageResult
    matches.dobMatch = dobMatch.percentageResult
    matches.lastDigitsMatch = lastDigitsMatch.percentageResult
    matches.surePassAadharData = aadarResponse

    return matches
  } else {
    const aadarResponse = <IDecentroEaadharResponse['data']>(
      JSON.parse(aadhaarDetailsDigilocker.api_response).data
    )

    const {
      proofOfIdentity: { dob: aadharDob, name: aadharFullName },
      aadhaarUid: aadharNo,
    } = aadarResponse

    let panAadhar = panMaskedAadharNo.slice(-4)
    let lastFourDigitsAadhar = aadharNo.slice(-4)

    const aadharDobFormatted = moment(aadharDob, 'DD-MM-YYYY').format('YYYY-MM-DD')

    const [nameMatch, dobMatch, lastDigitsMatch] = await Promise.all([
      await findBoxService.checkNamePercentageByRajatApi({
        firstName: panFullName,
        secondName: aadharFullName,
        type: 'pan - aadhar',
        leadId: 0,
        customerID,
        customerMobileNo: mobileNo,
      }),
      await findBoxService.checkNamePercentage({
        firstName: panDob,
        secondName: aadharDobFormatted,
        type: 'panDOB - aadharDOB',
        leadId: 0,
        customerID,
        customerMobileNo: mobileNo,
      }),
      await findBoxService.checkNamePercentage({
        firstName: panAadhar,
        secondName: lastFourDigitsAadhar,
        type: 'panLastDigit - aadharLastDigit',
        leadId: 0,
        customerID,
        customerMobileNo: mobileNo,
      }),
    ])

    matches.nameMatch = nameMatch.percentageResult
    matches.dobMatch = dobMatch.percentageResult
    matches.lastDigitsMatch = lastDigitsMatch.percentageResult
    matches.aadharNo = aadharNo
    matches.isSurePassAadhar = false
    matches.digilockerAadharData = aadarResponse

    return matches
  }
}
