import mongoose, { Schema } from 'mongoose';
import { CustomerInfoType, ICustomerPhoneEmailLogs } from '../../interfaces/customerEmailPhoneLog.interface';

const customerLogSchema: Schema<ICustomerPhoneEmailLogs> = new Schema({
    customerId: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(CustomerInfoType),
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    otp: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

export const customerLogModel = mongoose.model('emailphonelogs', customerLogSchema);