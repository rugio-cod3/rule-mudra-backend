import { getKnexInstance } from '@/utils/mysql'
import { LenderCredentials } from '@/enums/lender.enum'
import { IExperianHardPullGetRequest } from '../interfaces/experian.interface'

export default class RazorpayClient {
    async getLenderCredentialsByLeadId(
        leadID: number,
        credentialType: LenderCredentials
    ): Promise<IExperianHardPullGetRequest> {
        const db = getKnexInstance()

        // Get lender ID from lead
        const lead = await db('leads')
            .select('lenderID')
            .where('leadID', leadID)
            .first()

        if (!lead) {
            throw new Error('Lead not found')
        }

        // const credentials = await db('lender_creds')
        //     .where('lenderID', lead.lenderID)
        //     .where('cred_name', credentialType)
        //     .first()

        // if (!credentials) {
        //     throw new Error('Lender credentials not found')
        // }

        // const credData = JSON.parse(credentials.cred_data)

        return {
            // EXPERIAN_HARDPULL_URL: credData.EXPERIAN_HARDPULL_URL,
            // EXPERIAN_HARDPULL_METHOD: credData.EXPERIAN_HARDPULL_METHOD,
            // EXPERIAN_HARDPULL_USERNAME: credData.EXPERIAN_HARDPULL_USERNAME,
            // EXPERIAN_HARDPULL_PASSWORD: credData.EXPERIAN_HARDPULL_PASSWORD,
            // EXPERIAN_HARDPULL_CONTENT_TYPE: credData.EXPERIAN_HARDPULL_CONTENT_TYPE,


            EXPERIAN_HARDPULL_URL: 'https://connectuat.experian.in/nextgen-ind-pds-webservices-cbv2/endpoint',
            EXPERIAN_HARDPULL_USERNAME: 'cpu2yashik_uat01',
            EXPERIAN_HARDPULL_PASSWORD: 'Yashik@nexiloan@15',
            EXPERIAN_HARDPULL_METHOD: 'POST',
            EXPERIAN_HARDPULL_CONTENT_TYPE: 'application/xml'


        }
    }
}