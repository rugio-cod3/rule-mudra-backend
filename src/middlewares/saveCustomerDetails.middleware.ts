import { customerAppLocationModel } from '@/database/mysql/customerApp_location'
import { customerAppVersionModel } from '@/database/mysql/customerApp_version'
import { NextFunction, Request, Response } from 'express'

export const saveCustomerDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { appVersion, residenceAddress, state, pincode, city } =
      req.validatedBody
    const { customerID, mobile } = req.customer

    await customerAppVersionModel.insert({
      appVersion,
      mobile,
      customerID,
    })

    await customerAppLocationModel.insert({
      mobile,
      customerID,
      residenceAddress,
      state,
      city,
      pincode: Number(pincode),
    })

    next()
  } catch (error) {
    next(error)
  }
}
