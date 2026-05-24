import mongoose from "mongoose"

export interface ICustomerPhoneEmailLogs {
    _id?: mongoose.Types.ObjectId
    customerId: number
    type: CustomerInfoType
    isVerified: boolean
    otp: number
    email?: string
    phone?: string
    createdAt?: Date,
    updatedAt?: Date
}

export enum CustomerInfoType {
    PHONE = "PHONE",
    EMAIL = 'EMAIL'
}