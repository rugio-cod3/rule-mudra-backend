import { getKnexInstance } from '@/utils/mysql'
import { IState } from '../interfaces/experian.interface'

export default class StateModel {
    private table = 'states'

    async findOneState(
        where: { stateName: string },
        select: string[] = ['*']
    ): Promise<IState | null> {
        const db = getKnexInstance()

        try {
            const result = await db(this.table)
                .select(select)
                .where('stateName', where.stateName)
                .first()

            return result || null
        } catch (error) {
            console.error('Error finding state:', error)
            return null
        }
    }
}