import { IErrorOptions } from '@/interfaces/errors.interface'
import { CustomApiError } from './customApiError'

class FaultyStepError extends CustomApiError {
  statusCode = 428
  options?: IErrorOptions

  constructor(message: string, options?: IErrorOptions) {
    super(message)
    this.options = options
  }
}
export { FaultyStepError }
