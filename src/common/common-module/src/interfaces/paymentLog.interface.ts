import mongoose from "mongoose"

export interface IPaymentLogs {
    _id?: mongoose.Types.ObjectId
    orderId: string
    amount: number
    status: string
    processedBy?: ProcessedByTypes
    details: IRazorpayWebhook
    createdAt?: Date,
    updatedAt?: Date
}

export enum ProcessedByTypes {
    KAFKA = "KAFKA",
    WEBHOOK = 'WEBHOOK'
}

export interface IRazorpayWebhook {
    entity: string
    account_id: string
    event: string
    contains: string[]
    payload: Payload
    created_at: number
}

export interface Payload {
    payment: Payment
}

export interface Payment {
    entity: PaymentEntity
}

export interface PaymentEntity {
    id: string
    entity: string
    amount: number
    currency: string
    base_amount: number
    status: string
    order_id: string
    invoice_id: string | null
    international: boolean
    method: string
    amount_refunded: number
    amount_transferred: number
    refund_status: string | null
    captured: boolean
    description: string | null
    card_id: string | null
    bank: string | null
    wallet: string | null
    vpa: string | null
    email: string
    contact: string
    notes: any
    fee: number
    tax: number
    error_code: string | null
    error_description: string | null
    error_source: string | null
    error_step: string | null
    error_reason: string | null
    acquirer_data: AcquirerData
    created_at: number
}

export interface AcquirerData {
    rrn: string
}