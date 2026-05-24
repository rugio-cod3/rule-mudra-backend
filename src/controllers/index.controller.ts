import { CustomResponse } from '@/interfaces/response.interface'
import { NextFunction, Request } from 'express'

class IndexController {
  public index = (
    req: Request,
    res: CustomResponse,
    next: NextFunction,
  ): void => {
    try {
      return res.success({ data: 'Online' })
    } catch (error) {
      console.log(error)
      return res.failure({})
    }
  }
}

export default IndexController
