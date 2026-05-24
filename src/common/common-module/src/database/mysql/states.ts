import { IState, TSelectState } from '../../interfaces/states.interface'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export default class StateModel {
  private table = 'states'

  get StatesKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  // Get multiple states with specific conditions
  public async getStates(
    where: Partial<IState>,
    order: { orderKey: keyof IState; orderValue: string },
    select: (keyof IState)[],
  ): Promise<IState[] | []> {
    try {
      const db = getKnexInstance()
      const cities = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      return cities.length ? cities : []
    } catch (error) {
      logger.error('Error Inside UserModel getStates function', error)
      return []
    }
  }

  async findOneState(
    where: Partial<IState>,
    select: TSelectState[] | ['*'] = ['*'],
    order?: TSelectState[] | ['*'],
  ): Promise<IState> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)
    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }
}

export const stateModel = new StateModel()
