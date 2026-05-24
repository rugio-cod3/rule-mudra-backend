import { IProduct, TSelectProduct } from '@/interfaces/product.interface'
import { SelectFields, SortCriteria, WhereQuery } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class ProductModel {
  private table = 'products'

  public async getProduct(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IProduct[] | null> {
    try {
      let db = getKnexInstance()
      let product = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue)
      if (product.length == 0) {
        return null
      } else {
        return product // Return the first product if found
      }
    } catch (error) {
      logger.error('Error Inside products.ts getProduct function', error)
    }
  }

  async findOne(
    where: WhereQuery<IProduct>,
    select: SelectFields<TSelectProduct> = ['*'],
    orderBy?: SortCriteria<TSelectProduct>,
  ): Promise<IProduct> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }
}

export const productModel = new ProductModel();