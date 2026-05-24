import ProductModel from '@/database/mysql/product'
import { IProduct } from '@/interfaces/product.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import { logger } from '@/utils/logger'

class ProductService {
  private productModel = new ProductModel()

  public async findOne(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IProduct | ICustomResponse> {
    try {
      let product = await this.productModel.getProduct(where, order, select)
      if (product.length == 0) {
        return null
      } else {
        return product[0] // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }

  public async find(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[],
  ): Promise<IProduct[] | ICustomResponse> {
    try {
      let product = await this.productModel.getProduct(where, order, select)
      if (product.length == 0) {
        return null
      } else {
        return product // Return the first lead if found
      }
    } catch (error) {
      logger.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      } as ICustomResponse
    }
  }
}

export default ProductService
