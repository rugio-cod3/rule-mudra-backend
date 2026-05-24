import { bureauDatamodel } from '@/database/mysql/bureauData'
import {
  BureauBankingRequestBody,
  IBureauBankingResponse,
  IBureauDataModel,
  ICibilData,
  IOutput,
  TSelectBureauData,
} from '@/interfaces/bureauData.interface'

import config from '@/config/default'
import LeadModel from '@/database/mysql/leads'
import { LeadLogApiType } from '@/enums/leadLog.enum'
import { IBankingDataModel } from '@/interfaces/bankingData.interface'
import { IThirdPartyLogsModel } from '@/interfaces/thirdPartyLogs.interface'
import {
  InsertData,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '@/types/model.types'
import { roundAmountBanking } from '@/utils/util'
import axios from 'axios'
import AxiosService from './api.service'
import { bankingDataservice } from './bankingData.service'
import LeadApiLogService from './lead_api_log.service'
import { thirdPartyLogsservice } from './thirdpartylogs.service'

class BureauDataService {
  private readonly bureauDataModel = bureauDatamodel
  private readonly leadsModel = new LeadModel()
  private readonly leadsApiLogService = new LeadApiLogService()
  private readonly bankingDataService = bankingDataservice
  private readonly thirdPartyLogsService = thirdPartyLogsservice

  async findOne(
    where: WhereQuery<IBureauDataModel>,
    select: SelectFields<TSelectBureauData> = ['*'],
    order?: SortCriteria<TSelectBureauData>,
  ): Promise<IBureauDataModel> {
    return await this.bureauDataModel.findOneBureauData(where, select, order)
  }

  async create(data: InsertData<IBureauDataModel>): Promise<number[]> {
    return await this.bureauDataModel.insert(data)
  }

  async banking_v1(
    leadID: number,
  ): Promise<{ Decision: string; LoanAmount: number }> {
    const output = {
      Decision: '',
      LoanAmount: 0,
    }
    const lead = await this.leadsModel.LeadsKnex.join(
      'customer as c',
      'c.customerID',
      '=',
      'leads.customerID',
    )
      .where('leads.leadID', leadID)
      .orderBy('leads.leadID', 'desc')
      .first()

    if (!lead) {
      return output
    }

    const predictors = await this.leadsApiLogService.findOne(
      {
        status: 1,
        api_type: LeadLogApiType.PREDICTORS,
        mobile_no: lead.mobile,
        sync_result: 'ACCEPT',
      },
      ['*'],
      [{ column: 'id', order: 'desc' }],
    )
    if (predictors) {
      if (predictors.api_response) {
        const predictorsOutPut = JSON.parse(predictors.api_response)
        if (predictorsOutPut?.apimsg && predictorsOutPut?.is_success) {
          const referenceId = `${lead.customerID}${Date.now()}${
            Math.floor(Math.random() * 9000) + 1000
          }`

          const apiCall = new AxiosService(config.bureauBaseUrlv1)

          const body: BureauBankingRequestBody = {
            auth_token: '',
            client_id: '',
            rules_output: {
              bureau: {
                Decision: 'Proceed to Bank',
                LoanAmount: null,
                version: 'v1',
              },
            },
            input_data: {
              user_id: lead.email,
              reference_id: referenceId,
              fetched_timestamp: new Date(),
              external: {
                bankconnect: predictorsOutPut.apimsg,
              },
            },
          }
          const apiData = await apiCall.call<
            IBureauBankingResponse,
            BureauBankingRequestBody,
            undefined
          >('post', `/${config.bankingApiUrlv1}`, body, undefined, {
            'Content-Type': 'application/json',
          })

          delete body.input_data.external.bankconnect
          body.bankconnectId = predictors.id

          const saveData: IThirdPartyLogsModel = {
            customerID: lead.customerID,
            leadID,
            api_supplier: 11,
            api_type: 'Banking V1',
            api_endpoint_url: `${config.bureauBaseUrlv1}/${config.bankingApiUrlv1}`,
            api_method: 'POST',
            api_request: JSON.stringify(body),
            api_response: JSON.stringify(apiCall),
            status: !apiData.success ? 1 : 0,
          }

          const { data } = apiData
          if (apiData.success) {
            if (data?.output_data?.rules_output?.bank?.Decision) {
              const saveData2: IBankingDataModel = {
                customerID: lead.customerID,
                leadID: leadID,
                reference_id: data.output_data.input_data.reference_id,
                entity_id:
                  data.output_data.input_data.external.bankconnect.entity_id,
                Decision: data.output_data.rules_output.bank.Decision,
                LoanAmount: data.output_data.rules_output.bank.LoanAmount,
                version: 'v1',
              }

              await this.bankingDataService.create(saveData2)

              output.Decision = data.output_data.rules_output.bank.Decision
              output.LoanAmount = roundAmountBanking(
                Number(data.output_data.rules_output.bank.LoanAmount),
              )
            }
          }
          await this.thirdPartyLogsService.create(saveData)
        }
      }
    }
    return output
  }

  async count(
    where?: WhereQuery<IBureauDataModel>,
    whereNot?: WhereQuery<IBureauDataModel>,
  ): Promise<number> {
    return await this.bureauDataModel.countBureauData(where, whereNot)
  }

  async findSwitchPercentageUser(): Promise<number> {
    let v1_and_v0_gap: number

    const checkV2Api = await this.findOne(
      { version: 'v1' },
      ['*'],
      [{ column: 'id', order: 'desc' }],
    )
    if (checkV2Api) {
      const lastV1Id = checkV2Api.id
      const where: WhereQuery<IBureauDataModel> = (query) =>
        query.where('id', '>', lastV1Id)
      v1_and_v0_gap = await this.count(where)
    } else {
      v1_and_v0_gap = await this.count()
    }
    return v1_and_v0_gap
  }

  public removeDataFromCibil(data: any): any {
    const dataArr = { ...data }

    if (dataArr.consumerCreditData && dataArr.consumerCreditData[0]) {
      if (dataArr.consumerCreditData[0].names) {
        dataArr.consumerCreditData[0].names = []
      }

      if (dataArr.consumerCreditData[0].ids) {
        dataArr.consumerCreditData[0].ids = []
      }

      if (dataArr.consumerCreditData[0].telephones) {
        dataArr.consumerCreditData[0].telephones = []
      }

      if (dataArr.consumerCreditData[0].emails) {
        dataArr.consumerCreditData[0].emails = []
      }

      if (dataArr.consumerCreditData[0].addresses) {
        // dataArr.consumerCreditData[0].addresses = {}; // Uncomment this line if you want to replace addresses with an empty object instead of removing it
        delete dataArr.consumerCreditData[0].addresses // Comment this line if you want to replace addresses with an empty object instead of removing it
      }
    }

    return dataArr
  }

  private convertDataToBase64(data: string): string {
    return Buffer.from(data).toString('base64')
  }

  private roundAmount(amount: number): number {
    return Math.round(amount)
  }

  private async saveBureauData(data: any): Promise<void> {
    await this.thirdPartyLogsService.create(data)
  }

  public async bureauV1(leadID: number): Promise<IOutput> {
    const output: IOutput = {
      Decision: '',
      offerAmount: 0,
    }
    const cibilData: ICibilData | undefined =
      await this.leadsModel.LeadsKnex.join(
        'customer as c',
        'c.customerID',
        '=',
        'leads.customerID',
      )
        .join('leads_api_log as lal', (join) => {
          join
            .on('c.mobile', '=', 'lal.mobile_no')
            .andOn(
              'lal.api_type',
              '=',
              this.leadsModel.Knex.raw('?', ['consumer-cir-cv']),
            )
            .andOn('lal.status', '=', this.leadsModel.Knex.raw('?', [1]))
        })
        .where('leads.leadID', leadID)
        .orderBy('lal.id', 'desc')
        .select('lal.api_response', 'c.email', 'c.customerID', 'lal.id')
        .first()
    console.log("cibildata at bureauV1", cibilData)
    if (cibilData) {
      const cibil = JSON.parse(cibilData.api_response)

      if (cibil && cibil.apimsg) {
        const data = this.removeDataFromCibil(cibil.apimsg)
        console.log("data",data)
        const filebase64 = this.convertDataToBase64(JSON.stringify(data))
        const reference_id = `${cibilData.customerID}|${leadID}|${Date.now()}${
          Math.floor(Math.random() * 9000) + 1000
        }`

        const url = `${config.bureauBaseUrlv1}${config.bureauApiUrlv1}`
        console.log('url', url)
        const method = 'POST'
        const body = {
          auth_token: config.bureau_auth_token,
          client_id: config.bureau_client_id,
          input_data: {
            user_id: String(cibilData.customerID),
            reference_id,
            fetched_timestamp: new Date().toISOString(),
            external: {
              cibil_json: filebase64,
            },
          },
        }

        const headers = {
          'Content-Type': 'application/json',
        }

        const apiReturn = await axios.post(url, body, { headers })
        const apiResponse = apiReturn.data

        delete body.input_data.external.cibil_json
        body.input_data['cibil_json_id'] = cibilData.id

        let saveData = {
          customerID: cibilData.customerID,
          leadID,
          api_supplier: 11,
          api_type: 'Bureau V1',
          api_endpoint_url: url,
          api_method: method,
          api_request: JSON.stringify(body),
          api_response: JSON.stringify(apiResponse),
          status: apiResponse.error ? 0 : 1,
          created_at: new Date(Date.now()),
        }

        if (!apiResponse.error) {
          const decision =
            apiResponse.output_data?.rules_output?.bureau?.Decision || ''
          const loanAmount =
            apiResponse.output_data?.rules_output?.bureau?.LoanAmount || 0

          const saveData1: IBureauDataModel = {
            customerID: Number(cibilData.customerID),
            leadID,
            reference_id:
              apiResponse.output_data?.input_data?.reference_id || '',
            affordability_generic:
              apiResponse.output_data?.features?.cred_bureau_cibil_json
                ?.affordability_generic || 0,
            predicted_income:
              apiResponse.output_data?.features?.cred_bureau_cibil_json
                ?.predicted_income || 0,
            predicted_affordability:
              apiResponse.output_data?.features?.cred_bureau_cibil_json
                ?.predicted_affordability || 0,
            Decision: decision || '',
            LoanAmount: loanAmount || 0,
            version: 'v1',
            createdDate: new Date(),
          }
          await this.create(saveData1)

          output.Decision = decision
          output.offerAmount = this.roundAmount(loanAmount)
        }

        await this.saveBureauData(saveData)
      }
    }

    return output
  }

  async bureau(leadID: number): Promise<number> {
    let offerAmount = 0
    const cibilData: ICibilData | undefined =
      await this.leadsModel.LeadsKnex.join(
        'customer as c',
        'c.customerID',
        '=',
        'leads.customerID',
      )
        .join('leads_api_log as lal', (join) => {
          join
            .on('c.mobile', '=', 'lal.mobile_no')
            .andOn(
              'lal.api_type',
              '=',
              this.leadsModel.Knex.raw('?', ['consumer-cir-cv']),
            )
            .andOn('lal.status', '=', this.leadsModel.Knex.raw('?', [1]))
        })
        .where('leads.leadID', leadID)
        .orderBy('lal.id', 'desc')
        .select('lal.api_response', 'c.email', 'c.customerID', 'lal.id')
        .first()

    if (cibilData) {
      const cibil = JSON.parse(cibilData.api_response)

      if (Array.isArray(cibil) && cibil['apimsg']) {
        const data = this.removeDataFromCibil(cibil['apimsg'])
        const fileBase64 = this.convertDataToBase64(JSON.stringify(data))
        const referenceId = `${cibilData.customerID}|${leadID}|${Date.now()}${
          Math.floor(Math.random() * 9000) + 1000
        }`

        const url = `${config.bureau_base_url}${config.bureau_api_url}`
        const method = 'POST'
        const body = {
          auth_token: config.bureau_auth_token,
          client_id: config.bureau_client_id,
          user_id: String(cibilData.customerID),
          reference_id: referenceId,
          fetched_timestamp: new Date().toISOString(),
          raw_data: fileBase64,
          format_type: 'cibil_json',
        }

        const headers = {
          'Content-Type': 'application/json',
        }

        try {
          const response = await axios.post(url, body, { headers })
          const apiResponse = response.data

          delete body.raw_data
          body['row_data_id'] = cibilData.id

          let saveData = {
            customerID: cibilData.customerID,
            leadID,
            api_supplier: 11,
            api_type: 'Bureau',
            api_endpoint_url: url,
            api_method: method,
            api_request: JSON.stringify(body),
            api_response: JSON.stringify(apiResponse),
            status: apiResponse.error ? 0 : 1,
            // created_at: new Date(Date.now()),
          }

          if (
            !apiResponse.error &&
            apiResponse.reference_id &&
            apiResponse.affordability_generic &&
            apiResponse.predicted_income &&
            apiResponse.predicted_affordability
          ) {
            const saveData1: IBureauDataModel = {
              customerID: Number(cibilData.customerID),
              leadID,
              reference_id: apiResponse.reference_id || '',
              affordability_generic: apiResponse.affordability_generic || 0,
              predicted_income: apiResponse.predicted_income || 0,
              predicted_affordability: apiResponse.predicted_affordability || 0,
              Decision: '',
              LoanAmount: 0,
              version: '',
              // createdDate: new Date(),
            }
            await this.create(saveData1)
            offerAmount = this.roundAmount(apiResponse.affordability_generic)
          }

          await this.saveBureauData(saveData)
        } catch (error) {
          console.error('Error making API request:', error)
        }

        return offerAmount
      }
    }

    return offerAmount
  }
}

export const bureauDataservice = new BureauDataService()
