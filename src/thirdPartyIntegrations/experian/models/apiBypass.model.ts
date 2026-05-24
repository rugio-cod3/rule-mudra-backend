import { getKnexInstance } from '@/utils/mysql'
import { ApiBypassTypes } from '../interfaces/experian.interface'

export interface IApiBypass {
    id?: number
    type: string
    status: string
    lenderID: number
    api_response?: string
}

export default class ApiBypassModel {
    private table = 'api_bypass'

    async findOne(params: {
        where: {
            type: ApiBypassTypes
            status: string
            lenderID: number
        }
    }): Promise<IApiBypass | null> {
        const db = getKnexInstance()

        try {
            const result = await db(this.table)
                .where(params.where)
                .first()

            return result || null
        } catch (error) {
            console.error('Error finding api bypass:', error)
            return null
        }
    }
}