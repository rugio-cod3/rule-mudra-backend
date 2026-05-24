import { config } from '@/config.server'
import { HttpException } from '@/exceptions/HttpException'
import CommonHelper from '@/helpers/common'
import { ICustomerApp } from '@/interfaces/customerApp.interface'
import { IMobileToken } from '@/interfaces/mobileToken.interface'
import { ICustomResponse } from '@/interfaces/response.interface'
import ApiReqResLogService from '@/services/api_req_res_log.service'
import CustomerService from '@/services/customer.service'
import CustomerAppService from '@/services/customerApp.service'
import MobileTokenService from '@/services/mobile_token.service'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'
import { NextFunction, Request, Response } from 'express'

export interface IAuthenticatedRequest extends Request {
  customer: any
}

// export const authMiddleware = async (
//   req: Request | any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.headers["x-access-token"];
//     if (token && token == "user-token") {
//       req.user = token;
//       next();
//     } else {
//       res.status(400).send("Unauthorised");
//     }
//   } catch (error) {
//     logger.error("error", error.stack);
//     next(new HttpException(401, "Wrong authentication token"));
//   }
// };

class Authentication {
  private commonHelper = new CommonHelper()
  private customerService = new CustomerService()
  private mobileTokenService = new MobileTokenService()
  private customerAppService = new CustomerAppService()
  private apiReqResLogService = new ApiReqResLogService()

  get Knex() {
    let db = getKnexInstance()
    return db
  }

  public isAuthenticatedCustomer = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<ICustomResponse | void> => {
    try {
      const token = req.headers['token'] as string
      if (token) {
        let mobileToken = (await this.mobileTokenService.findOne({ access_token: token }, [
          '*',
        ])) as IMobileToken
        if (mobileToken) {
          let customer = await this.customerService.findOne(
            {
              mobile: +mobileToken.mobile,
              customerID: +`${mobileToken.customerID}`,
            },
            ['*'],
          )
          if (!customer) {
            let customerApp = (await this.customerAppService.findOne(
              {
                mobile: BigInt(`${mobileToken.mobile}`),
                customerID: +`${mobileToken.customerID}`,
              },
              ['*'],
            )) as ICustomerApp
            if (!customerApp) {
              this.commonHelper.sendResponse(res, false, 'Customer Not Found', {}, 400)
              return
            } else {
              req.customer = customerApp
              next()
            }
          } else {
            req.customer = customer
            next()
          }
        } else {
          await this.commonHelper.sendResponse(
            res,
            false,
            'Unauthorised Request:Incorrect Token',
            {},
            403,
          )
          return
        }
      } else {
        await this.commonHelper.sendResponse(res, false, 'Unauthorised Request', {}, 403)
        return
      }
    } catch (error) {
      logger.error('error', error)
      next(new HttpException(401, 'Wrong authentication token'))
    }
  }

  public isAuthenticatedCustomerByJWT1 = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<ICustomResponse | void> => {
    try {
      let token: string
      const { authorization } = req.headers
      console.log('authorization', authorization)
      if (!authorization || !authorization.startsWith('Bearer')) {
        await this.commonHelper.sendResponse(res, false, 'Un-Authorised Request', {}, 401)
        return
      }
      token = authorization.split(' ')[1]

      if (!token) {
        await this.commonHelper.sendResponse(res, false, 'Please Provide Token', {}, 401)
        return
      }
      if (token) {
        let decode =
          ((await this.commonHelper.verifyJWT1(token, config.jwtSecret)) as {
            _id: number
            iat: number
            exp: number
          }) || false
        if (!decode) {
          await this.commonHelper.sendResponse(
            res,
            false,
            'Token Expired Please Login Again',
            {},
            401,
          )
          return
        }
        let mobileToken = await this.mobileTokenService.findOne(
          { jwt_access_token: token, customerID: String(decode._id) },
          ['*'],
          [
            {
              column: 'id',
              order: 'desc',
            },
          ],
        )
        if (mobileToken) {
          let customer = await this.customerService.findOne(
            {
              mobile: Number(mobileToken.mobile),
              customerID: +`${mobileToken.customerID}`,
            },
            ['*'],
          )
          if (!customer) {
            let customerApp = (await this.customerAppService.findOne(
              {
                mobile: BigInt(`${mobileToken.mobile}`),
                customerID: +`${mobileToken.customerID}`,
              },
              ['*'],
            )) as ICustomerApp
            if (!customerApp) {
              this.commonHelper.sendResponse(res, false, 'Customer Not Found', {}, 400)
              return
            } else {
              req.customer = customerApp
              next()
            }
          } else {
            req.customer = customer
            next()
          }
        } else {
          await this.commonHelper.sendResponse(
            res,
            false,
            'Unauthorised Request:Incorrect Token',
            {},
            403,
          )
          return
        }
      } else {
        await this.commonHelper.sendResponse(res, false, 'Unauthorised Request', {}, 403)
        return
      }
    } catch (error) {
      logger.error('error', error)
      next(new HttpException(401, 'Wrong authentication token'))
    }
  }

  public isSisterService = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<ICustomResponse | void> => {
    try {
      const key = req.headers['api_key'] as string
      const secret = req.headers['api_secret'] as string
      if (key && secret) {
        if (key == config.phpApiKey && secret == config.phpApiSecret) {
        } else {
          await this.commonHelper.sendResponse(res, false, 'Wrong Credentials', {}, 403)
          return
        }
        next()
      } else {
        await this.commonHelper.sendResponse(res, false, 'Unauthorised Request', {}, 403)
        return
      }
    } catch (error) {
      logger.error('error', error)
      await this.commonHelper.sendResponse(res, false, 'Unauthorised Request', {}, 403)
      return
    }
  }
  public authenticateAsferaRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<ICustomResponse | void> => {
    try {
      const key = req.headers['api_key'] as string
      const secret = req.headers['api_secret'] as string
      if (key && secret) {
        if (key == config.asferaApiKey && secret == config.asferaApiSecret) {
        } else {
          await this.commonHelper.sendResponse(res, false, 'Wrong Credentials', {}, 403)
          return
        }
        next()
      } else {
        await this.commonHelper.sendResponse(res, false, 'Unauthorised Request', {}, 403)
        return
      }
    } catch (error) {
      logger.error('error', error)
      await this.commonHelper.sendResponse(res, false, 'Unauthorised Request', {}, 403)
      return
    }
  }

  public isAuthenticatedCustomerByJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<ICustomResponse | void> => {
    try {
      let token: string
      const { authorization } = req.headers
      let db = getKnexInstance()

      console.log('[Auth] Authorization header:', authorization);

      if (!authorization || !authorization.startsWith('Bearer')) {
        console.log('[Auth] Missing or invalid Bearer token');
        await this.commonHelper.sendResponse(res, false, 'Un-Authorized Request', {}, 401)
        return
      }

      token = authorization.split(' ')[1]
      console.log('[Auth] Extracted token:', token);

      if (!token) {
        console.log('[Auth] Token missing after split');
        await this.commonHelper.sendResponse(res, false, 'Please Provide Token', {}, 401)
        return
      }

      if (token) {
        const decoded = (await this.commonHelper.verifyJWT(token)) as
          | { _id: number; iat: number; exp: number }
          | false
        console.log('[Auth] Decoded JWT:', decoded);

        if (!decoded) {
          console.log('[Auth] Token verification failed or expired');
          await this.commonHelper.sendResponse(
            res,
            false,
            'Token Expired Please Login Again',
            {},
            401,
          )
          return
        }

        const mobileToken = await this.mobileTokenService.findOne(
          { jwt_access_token: token, customerID: String(decoded._id) },
          ['*'],
          [{ column: 'id', order: 'desc' }],
        )
        console.log('[Auth] mobileToken:', mobileToken);

        if (mobileToken) {
          const customer = await this.customerService.findOne(
            {
              mobile: Number(mobileToken.mobile),
              customerID: +`${mobileToken.customerID}`,
            },
            ['*'],
          )

          if (!customer) {
            console.log('[Auth] Customer not found for mobileToken');
            this.commonHelper.sendResponse(res, false, 'Customer Not Found', {}, 400)
            return
          } else {
            req.customer = customer
            next()
          }
        } else {
          console.log('[Auth] mobileToken not found for token:', token, 'and customerID:', decoded._id);
          await this.commonHelper.sendResponse(
            res,
            false,
            'Unauthorised Request: Incorrect Token',
            {},
            403,
          )
          return
        }
      } else {
        console.log('[Auth] Token missing (should not reach here)');
        await this.commonHelper.sendResponse(res, false, 'Unauthorised Request', {}, 403)
        return
      }
    } catch (error) {
      console.error('[Auth] Error in isAuthenticatedCustomerByJWT:', error)
      next(new HttpException(401, 'Wrong authentication token'))
    }
  }

  public basicAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      this.commonHelper.sendResponse(res, false, 'Missing or invalid Authorization header', {}, 401)
      return
    }

    const base64Credentials = authHeader.split(' ')[1]
    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [username, password] = decodedCredentials.split(':')

    if (username !== config.basicUserName || password !== config.basicPassword) {
      this.commonHelper.sendResponse(res, false, 'Invalid credentials', {}, 401)
      return
    }
    next()
  }
}
export default Authentication
