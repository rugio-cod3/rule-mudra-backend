import mongoose, { Schema } from 'mongoose';
import { ProcessedByTypes } from '../../interfaces/paymentLog.interface';
var PaymentEntitySchema = new Schema({
    id: String,
    entity: String,
    amount: Number,
    currency: String,
    base_amount: Number,
    status: String,
    order_id: String,
    invoice_id: String,
    international: Boolean,
    method: String,
    amount_refunded: Number,
    amount_transferred: Number,
    refund_status: String,
    captured: Boolean,
    description: String,
    card_id: String,
    bank: String,
    wallet: String,
    vpa: String,
    email: String,
    contact: String,
    notes: Schema.Types.Mixed,
    fee: Number,
    tax: Number,
    error_code: String,
    error_description: String,
    error_source: String,
    error_step: String,
    error_reason: String,
    acquirer_data: {
        rrn: {
            type: String,
            required: false
        }
    },
    created_at: Number
}, {
    _id: false
});
var paymentLogSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    processedBy: {
        type: String,
        required: false,
        enum: Object.values(ProcessedByTypes)
    },
    details: {
        entity: String,
        account_id: String,
        event: String,
        contains: [
            String
        ],
        payload: {
            payment: {
                entity: PaymentEntitySchema
            }
        },
        created_at: Number
    }
}, {
    timestamps: true
});
export var paymentLogsModel = mongoose.model('paymentLogs', paymentLogSchema);

//# sourceMappingURL=paymentLogs.js.map