import { THttpMethod } from '@/types/api.types'
import { logger } from '@/utils/logger'
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { InternalServerError } from '../errors'

export default class AxiosService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async call<T, D, P>(
    method: THttpMethod,
    url: string,
    data?: D,
    params?: P,
    headers?: Partial<AxiosHeaders>,
  ): Promise<{
    success: boolean
    statusCode: number
    data?: T
  }> {
    const config: AxiosRequestConfig = {
      method,
      url: this.baseURL + url,
      params,
      headers: headers as AxiosHeaders,
      data,
    }
    try {
      const response: AxiosResponse = await axios(config)
      return { data: response.data, success: true, statusCode: response.status }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNREFUSED') {
          logger.error(`Connection refused from ${error.config?.url}`)
          throw new InternalServerError()
        }
        if (error.response?.status === 500) {
          logger.error(
            `Error occurred at ${
              error.config?.url
            } with response: ${JSON.stringify(error.response.data)} and status code: 500`,
          )
          // throw new InternalServerError()
        }
         else if (error.response?.status === 502) {
          logger.error(`Server down for ${error.config?.url}`)
          throw new InternalServerError()
        }
        if (error.response) {
          console.log('err from apiService>>>>', error)
          console.log('err response from apiService>>>>', error?.response)

          return {
            data: error.response.data,
            success: false,
            statusCode: error.response.status,
          }
        }
      }
      throw error
    }
  }
}
